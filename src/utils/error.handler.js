export const handleError = (res, error, api) => {
  if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validationErrors,
    });
  }
  if (error.name === "Error") {
    console.log("Operational Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.log("Unhandled System Error:", error);
  return res.status(500).json({
    success: false,
    message: "server error",
    error: error.message,
  });
};
