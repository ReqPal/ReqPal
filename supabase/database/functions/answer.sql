-- Author: Laura

create or replace function create_user_answers_from_json(data jsonb) returns void
    language plpgsql
as
$$
DECLARE
    used_hints_count    int4 := 0;
    lesson_uuid         uuid;
    newAnswer           jsonb;
    question_uuid       uuid;
    lesson_finished     bool := false;
    lesson_started      bool := false;
    temp_option         jsonb;
    old_answer          jsonb;
BEGIN
    lesson_uuid := data ->> 'uuid';

    SELECT COUNT(*)
    INTO used_hints_count
    FROM user_hints
    WHERE user_id = auth.uid()
      AND lesson_id = lesson_uuid;

    SELECT is_started
    INTO lesson_started
    FROM user_finished_lessons
    WHERE lesson_id = lesson_uuid
      AND user_id = auth.uid();

    IF NOT FOUND THEN
        lesson_started := TRUE;
    end if;

    SELECT finished
    INTO lesson_finished
    FROM user_finished_lessons
    WHERE lesson_id = lesson_uuid
      AND user_id = auth.uid();

    IF NOT FOUND THEN
        INSERT INTO user_finished_lessons (user_id, lesson_id, finished, is_started, finished_for_first_time,
                                           used_hints)
        VALUES (auth.uid(), lesson_uuid, TRUE, FALSE, TRUE, used_hints_count);
        lesson_finished
            := FALSE;
    END IF;

    IF (NOT lesson_finished) THEN
        FOR newAnswer IN
            SELECT *
            FROM jsonb_array_elements(data -> 'answers')
            LOOP
                temp_option := newAnswer -> 'options';
                IF ((newAnswer ->> 'type') != 'Requirement' OR
                    (newAnswer ->> 'type') = 'Requirement' AND
                    (temp_option ->> 'askForQualification')::boolean IS TRUE) THEN
                    question_uuid := (newAnswer ->> 'uuid')::uuid;
                    INSERT INTO user_answers (user_id, lesson_id, question_id, answer)
                    VALUES (auth.uid(), lesson_uuid, question_uuid, temp_option);
                END IF;
            END LOOP;

    ELSE
        IF (lesson_started) THEN
            UPDATE user_finished_lessons
            SET finished                = TRUE,
                is_started              = FALSE,
                finished_for_first_time = FALSE
            WHERE lesson_id = lesson_uuid
              AND user_id = auth.uid();

            FOR newAnswer IN
                SELECT *
                FROM jsonb_array_elements(data -> 'answers')
                LOOP
                    question_uuid := (newAnswer ->> 'uuid')::uuid;

                    SELECT answer
                    INTO old_answer
                    FROM user_answers
                    WHERE lesson_id = lesson_uuid
                      AND user_id = auth.uid()
                      AND question_id = question_uuid;

                    IF NOT FOUND THEN
                        temp_option := newAnswer -> 'options';
                        IF ((newAnswer ->> 'type') != 'Requirement' OR
                            (newAnswer ->> 'type') = 'Requirement' AND
                            (temp_option ->> 'askForQualification')::boolean IS TRUE) THEN
                            INSERT INTO user_answers (user_id, lesson_id, question_id, answer)
                            VALUES (auth.uid(), lesson_uuid, question_uuid, temp_option);
                        END IF;
                    ELSE
                        temp_option := newAnswer -> 'options';
                        IF ((newAnswer ->> 'type') != 'Requirement' OR
                            (newAnswer ->> 'type') = 'Requirement' AND
                            (temp_option ->> 'askForQualification')::boolean IS TRUE) THEN
                            question_uuid := (newAnswer ->> 'uuid')::uuid;
                            UPDATE user_answers
                            SET answer = newAnswer -> 'options'
                            WHERE lesson_id = lesson_uuid
                              AND user_id = auth.uid()
                              AND question_id = question_uuid;
                        END IF;
                    END IF;
                END LOOP;
        END IF;
    END IF;
END;
$$;

create or replace function evaluate_multiple_choice(question_id uuid, answer jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    solution        jsonb;
    compared_result jsonb;
    user_result     jsonb;
    maxPoints       int4;
    score           double precision := 0;
    percentage      double precision := 1.0;
    correctAnswers  double precision := 0;
    totalAnswers    double precision := 0;
    result          jsonb;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    SELECT questions.points
    INTO maxPoints
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := json_agg(jsonb_build_object(
            'id', q_option ->> 'id',
            'isCorrect', (q_option ->> 'solution')::BOOLEAN = (o_option ->> 'input')::BOOLEAN
                                ))
                       FROM json_array_elements(solution::JSON) AS q_option
                                LEFT JOIN json_array_elements(answer::JSON) AS o_option
                                          ON (q_option ->> 'id')::int = (o_option ->> 'id')::int;

    FOR result IN SELECT * FROM jsonb_array_elements(compared_result)
        LOOP
            IF (result ->> 'isCorrect')::BOOLEAN THEN
                correctAnswers := correctAnswers + 1;
            END IF;
        END LOOP;

    totalAnswers := jsonb_array_length(answer);
    percentage := correctAnswers / totalAnswers;
    score := maxPoints * percentage;

    user_result := json_build_object('score', score, 'results', compared_result);
    RETURN user_result;
END
$$;

create or replace function evaluate_product_qualification(question_id uuid, answer jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    q_solution      jsonb;
    compared_result jsonb            := '[]';
    score           double precision := 0;
    result          jsonb;
    correctAnswers  double precision := 0;
    totalAnswers    double precision := 0;
    percentage      double precision := 1.0;
    user_result     jsonb;
    product_answers jsonb;
    p_qualification int;
    maxPoints       int4;
    product_answer  jsonb;
    tolerance_value int;
    req_id          uuid;
    temp_result     bool;
    temp_input      int;
    temp_id         uuid;
BEGIN

    IF (answer ->> 'askForQualification')::boolean IS FALSE THEN
        raise log 'exit';
        return json_build_object('score', 0);
    end if;

    req_id := (answer ->> 'requirementId')::uuid;
    product_answers := (answer ->> 'products')::jsonb;

    SELECT questions.solution
    INTO q_solution
    FROM questions
    WHERE questions.uuid = question_id;

    SELECT questions.points
    INTO maxPoints
    FROM questions
    WHERE questions.uuid = question_id;

    IF q_solution IS NULL THEN
        return NULL;
    END IF;

    SELECT ((q_solution ->> 'toleranceValue')::int)
    INTO tolerance_value;

    FOR product_answer IN
        SELECT *
        FROM jsonb_array_elements(product_answers)
        LOOP
            temp_id := ((product_answer ->> 'id')::uuid);

            SELECT qualification
            INTO p_qualification
            FROM product_requirements
            WHERE product_id = temp_id
              AND requirement_id = req_id;

            temp_input := (product_answer ->> 'input')::int;

            IF (temp_input BETWEEN (p_qualification - tolerance_value) AND (p_qualification + tolerance_value)) THEN
                temp_result := true;
            else
                temp_result := false;
            end if;

            compared_result = jsonb_insert(
                    compared_result,
                    '{-1}',
                    jsonb_build_object(
                            'id', (product_answer ->> 'id')::uuid,
                            'isCorrect', temp_result),
                    true);
        END LOOP;

    FOR result IN SELECT * FROM jsonb_array_elements(compared_result)
        LOOP
            IF (result ->> 'isCorrect')::BOOLEAN THEN
                correctAnswers := correctAnswers + 1;
            END IF;
        END LOOP;

    totalAnswers := jsonb_array_length(product_answers);
    percentage := correctAnswers / totalAnswers;
    score := maxPoints * percentage;

    user_result := json_build_object('score', score, 'results', compared_result);

    RETURN user_result;
END
$$;

create or replace function evaluate_slider(question_id uuid, answer jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    solution        jsonb;
    right_answer    integer;
    tolerance_value integer;
    user_input      integer;
    maxPoints       int4;
    score           double precision := 0;
    is_correct      bool             := false;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    SELECT questions.points
    INTO maxPoints
    FROM questions
    WHERE questions.uuid = question_id;

    user_input := answer ->> 'input';
    right_answer := solution ->> 'correctValue';
    tolerance_value := solution ->> 'toleranceValue';

    IF (user_input <= right_answer + tolerance_value) AND (user_input >= right_answer - tolerance_value) THEN
        score := maxPoints;
        is_correct := true;
    END IF;

    RETURN json_build_object('score', score, 'isCorrect', is_correct);
END
$$;

create or replace function evaluate_true_or_false(question_id uuid, answer jsonb) returns jsonb
    language plpgsql
as
$$
DECLARE
    solution        jsonb;
    compared_result bool;
    score           double precision := 0;
    maxPoints       int4;
BEGIN

    SELECT questions.solution
    INTO solution
    FROM questions
    WHERE questions.uuid = question_id;

    SELECT questions.points
    INTO maxPoints
    FROM questions
    WHERE questions.uuid = question_id;

    compared_result := (solution = answer);

    IF
        (compared_result) THEN
        score := maxPoints;
    END IF;

    return jsonb_build_object('isCorrect', compared_result, 'score', score);
END;
$$;
