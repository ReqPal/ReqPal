import AlertService from "@/services/util/alert.ts";
import {
    AuthenticationError,
    ConversionError,
    DatabaseError,
    PrivilegeError,
    UserAlreadyRegisteredError
} from "@/errors/custom.ts";

const errorHandler = (error: unknown): void => {

    if (error instanceof PromiseRejectionEvent) {
        error = error.reason;
    }

    if (error instanceof PrivilegeError) {
        AlertService.addErrorAlert("Sie haben nicht die nötigen Rechte um diese Aktion auszuführen.");
        return;
    }

    if (error instanceof ConversionError) {
        AlertService.addErrorAlert("Fehler im Format der CSV Datei: " + error.message);
        return;
    }

    if (error instanceof DatabaseError) {
        AlertService.addErrorAlert("Es ist ein Fehler mit der Datenbank aufgetreten.");
        return;
    }

    if (error instanceof AuthenticationError) {
        if (error.message === 'Email not confirmed') {
            AlertService.addErrorAlert("Ihre Email wurde noch nicht bestätigt.");
            return;
        }
        AlertService.addErrorAlert("Fehler bei der Anmeldung/Registrierung/Zurücksetzen des Passworts.");
        return;
    }

    if (error instanceof UserAlreadyRegisteredError) {
        AlertService.addErrorAlert(error.message);
        return;
    }

    AlertService.addErrorAlert("Ein unerwarteter Fehler ist aufgetreten.");

};

export {errorHandler};