import { ApiError } from "@/infraestructure/store/services";
import { toasterAdapter } from "@/presentation/components";
import { useEffect } from "react";

export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const MAX_TOASTS = 5;

const activeToasts: string[] = [];

export const useAlert = (maxToasts: number = MAX_TOASTS) => {
  useEffect(() => {
    toasterAdapter.dismiss();
  }, []);

  const startShowAlert = (message: string, type: AlertType) => {
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

  const startShowSuccess = (message: string) => {
    startShowAlert(message, AlertType.SUCCESS);
  };

  const startShowError = (message: string) => {
    startShowAlert(message, AlertType.ERROR);
  }

  const startShowApiError = (error: ApiError) => {
    if (error.status === "FETCH_ERROR") {
      startShowAlert("Error de conexión", AlertType.ERROR);
    } else if (error.status === "PARSING_ERROR") {
      if (error.originalStatus === 404 || error.originalStatus === 200) {
        startShowAlert("Recurso no encontrado", AlertType.ERROR);
        return;
      }
      
      startShowAlert("Error de parseo", AlertType.ERROR);
    } else {
      if (error.data) {
        startShowAlert(error.data.error, AlertType.ERROR);
        return;
      }
    }
  };

  return { startShowSuccess, startShowApiError, startShowError };
};
