// ===== FIREBASE ERROR HANDLER =====
const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    // Authentication errors
    "auth/invalid-credential":
      "Invalid email or password. Please check your credentials and try again.",
    "auth/user-not-found":
      "No account found with this email address. Please check your email or create a new account.",
    "auth/wrong-password":
      "Incorrect password. Please try again or reset your password.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled":
      "This account has been disabled. Please contact support for assistance.",
    "auth/too-many-requests":
      "Too many failed login attempts. Please try again later or reset your password.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection and try again.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled. Please contact support.",
    "auth/invalid-action-code":
      "Invalid or expired action code. Please try again.",
    "auth/expired-action-code":
      "This link has expired. Please request a new one.",
    "auth/invalid-continue-uri":
      "Invalid redirect URL. Please contact support.",
    "auth/unauthorized-continue-uri":
      "Unauthorized redirect URL. Please contact support.",
    "auth/weak-password":
      "Password is too weak. Please choose a stronger password with at least 6 characters.",
    "auth/email-already-in-use":
      "An account with this email already exists. Please sign in or use a different email.",
    "auth/account-exists-with-different-credential":
      "An account already exists with the same email but different sign-in credentials.",
    "auth/credential-already-in-use":
      "This credential is already associated with a different user account.",
    "auth/requires-recent-login":
      "This operation requires recent authentication. Please sign out and sign in again.",
    "auth/invalid-verification-code":
      "Invalid verification code. Please check and try again.",
    "auth/invalid-verification-id":
      "Invalid verification ID. Please try again.",
    "auth/missing-verification-code": "Please enter the verification code.",
    "auth/missing-verification-id":
      "Verification ID is missing. Please try again.",
    "auth/quota-exceeded": "Quota exceeded. Please try again later.",
    "auth/app-deleted": "The app has been deleted. Please contact support.",
    "auth/app-not-authorized":
      "This app is not authorized to use Firebase Authentication. Please contact support.",
    "auth/argument-error":
      "Invalid arguments provided. Please check your input and try again.",
    "auth/invalid-api-key": "Invalid API key. Please contact support.",
    "auth/invalid-user-token":
      "Your session has expired. Please sign in again.",
    "auth/invalid-tenant-id": "Invalid tenant ID. Please contact support.",
    "auth/multi-factor-auth-required":
      "Multi-factor authentication is required to complete sign-in.",
    "auth/maximum-second-factor-count-exceeded":
      "Maximum number of second factors exceeded.",
    "auth/second-factor-already-in-use":
      "This second factor is already in use.",
    "auth/unsupported-first-factor": "Unsupported first factor.",
    "auth/unsupported-persistence-type": "Unsupported persistence type.",
    "auth/unsupported-tenant-operation":
      "This operation is not supported in a multi-tenant context.",
    "auth/unverified-email":
      "Email address is not verified. Please verify your email before signing in.",

    // Firestore errors
    "firestore/permission-denied":
      "You do not have permission to access this resource.",
    "firestore/not-found": "The requested document was not found.",
    "firestore/already-exists": "The document already exists.",
    "firestore/resource-exhausted":
      "Resource quota exceeded. Please try again later.",
    "firestore/failed-precondition": "Operation failed due to a precondition.",
    "firestore/aborted": "Operation was aborted. Please try again.",
    "firestore/out-of-range": "Operation out of valid range.",
    "firestore/unimplemented": "Operation is not implemented or supported.",
    "firestore/internal": "Internal server error. Please try again later.",
    "firestore/unavailable":
      "Service is currently unavailable. Please try again later.",
    "firestore/data-loss": "Unrecoverable data loss or corruption.",
    "firestore/unauthenticated": "User is not authenticated. Please sign in.",
    "firestore/invalid-argument": "Invalid argument provided.",
    "firestore/deadline-exceeded": "Operation timed out. Please try again.",
    "firestore/cancelled": "Operation was cancelled.",

    // Storage errors
    "storage/unknown": "An unknown error occurred. Please try again.",
    "storage/object-not-found": "File not found.",
    "storage/bucket-not-found": "Storage bucket not found.",
    "storage/project-not-found": "Project not found.",
    "storage/quota-exceeded": "Storage quota exceeded.",
    "storage/unauthenticated": "User is not authenticated.",
    "storage/unauthorized": "User is not authorized to perform this action.",
    "storage/retry-limit-exceeded":
      "Maximum retry limit exceeded. Please try again later.",
    "storage/invalid-checksum":
      "File checksum does not match. Please try uploading again.",
    "storage/canceled": "Upload was cancelled.",
    "storage/invalid-event-name": "Invalid event name.",
    "storage/invalid-url": "Invalid URL provided.",
    "storage/invalid-argument": "Invalid argument provided.",
    "storage/no-default-bucket": "No default storage bucket found.",
    "storage/cannot-slice-blob": "Cannot slice blob.",
    "storage/server-file-wrong-size": "Server file wrong size.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};

// ===== FIREBASE ERROR HANDLER WITH USER-FRIENDLY MESSAGES =====
const handleFirebaseError = (error) => {
  console.error("Firebase Error:", error);

  // Handle Firebase Auth errors
  if (error.code) {
    return {
      error: {
        code: error.code,
        message: getFirebaseErrorMessage(error.code),
        originalMessage: error.message,
      },
    };
  }

  // Handle generic errors
  if (error.message) {
    return {
      error: {
        message: error.message,
      },
    };
  }

  // Fallback for unknown errors
  return {
    error: {
      message: "An unexpected error occurred. Please try again.",
    },
  };
};

export { getFirebaseErrorMessage, handleFirebaseError };
