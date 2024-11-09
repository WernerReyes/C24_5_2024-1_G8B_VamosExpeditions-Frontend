import toast from "react-hot-toast";

export const toasterAdapter = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  dismiss: (id: string) => toast.dismiss(id),
};
