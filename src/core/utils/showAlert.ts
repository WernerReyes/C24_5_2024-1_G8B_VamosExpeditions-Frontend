import { ApiError } from "@/infraestructure/store/services";
import { toasterAdapter } from "@/presentation/components";

export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const MAX_TOASTS = 5;

const activeToasts: string[] = [];

const startShowAlert = (
  message: string,
  type: AlertType,
  maxToasts: number = MAX_TOASTS
) => {
  if (activeToasts.length >= maxToasts) {
    const firstToastId = activeToasts.shift();
    toasterAdapter.dismiss(firstToastId!);
  }

  let toastId = null;
  switch (type) {
    case AlertType.SUCCESS:
      toastId = toasterAdapter.success(message);
      break;
    case AlertType.ERROR:
      toastId = toasterAdapter.error(message);
      break;
    default:
      break;
  }

  activeToasts.push(toastId!);
};

export const startShowSuccess = (message: string, maxToasts?: number) => {
  startShowAlert(message, AlertType.SUCCESS, maxToasts);
};

export const startShowError = (message: string, maxToasts?: number) => {
  startShowAlert(message, AlertType.ERROR, maxToasts);
};

export const startShowApiError = (error: ApiError, maxToasts?: number) => {
  if (error.status === "FETCH_ERROR") {
    startShowAlert("Error de conexión", AlertType.ERROR, maxToasts);
  } else if (error.status === "PARSING_ERROR") {
    if (error.originalStatus === 404 || error.originalStatus === 200) {
      startShowAlert("Recurso no encontrado", AlertType.ERROR, maxToasts);
      return;
    }

    startShowAlert("Error de parseo", AlertType.ERROR, maxToasts);
  } else {
    if (error.data) {
      startShowAlert(error.data.error, AlertType.ERROR, maxToasts);
      return;
    }
  }
};
