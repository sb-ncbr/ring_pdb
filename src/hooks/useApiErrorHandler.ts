import { useNotification } from "../context/NotificationContext";

interface ApiError {
  code?: string;
  field?: string;
  message?: string;
}

export const useApiErrorHandler = () => {
  const { notify } = useNotification();

  const handleApiError = (error: ApiError | string) => {
    let message = "";

    if (typeof error === "string") {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else {
      message = "An unknown error occurred";
    }

    notify(message, "error");
  };

  return { handleApiError };
};