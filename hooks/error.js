import { getFirebaseErrorMessage } from "@/utils/firebase-errors";

// ===== ERROR HANDLER =====
const errorHandler = (error) => {
  // Handle Firebase errors specifically
  if (
    error.code &&
    (error.code.startsWith("auth/") ||
      error.code.startsWith("firestore/") ||
      error.code.startsWith("storage/"))
  ) {
    return {
      error: {
        code: error.code,
        status: error.status,
        message: getFirebaseErrorMessage(error.code),
        originalMessage: error.message,
      },
    };
  }

  // Handle generic errors
  return {
    error: {
      status: error.status,
      message:
        error.message || "An unexpected error occurred. Please try again.",
    },
  };
};

export { errorHandler };
