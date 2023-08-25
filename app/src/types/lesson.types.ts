export interface Lesson {
    id: string;
    title: string;
    description: string;
}

export enum questionTypes {
    MultipleChoice = "MultipleChoice",
    DragAndDrop = "DragAndDrop",
    TrueOrFalse = "TrueOrFalse",
    Sortable = "Sortable",
}

export interface Question {
    id: string;
    lessonId: string;
    description: string;
    questionType: questionTypes | null;
    userResults: Result | null;
}

export interface Answer {
    id: string,
    description: string;
}

export interface Result {
    wholeAnswerIsCorrect: boolean;
    results: answerResults[];
}

export interface answerResults {
    id: string,
    answerIsCorrect: boolean;
}