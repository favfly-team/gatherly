// ===== ERROR HANDLER =====
const errorHandler = (error) => {
  return {
    error: {
      status: error.status,
      message: error.message,
    },
  };
};

export { errorHandler };
