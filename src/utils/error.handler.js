export const handleError = (res, error, api) => {
  if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return res.status(200).json({
      message: "Validation error",
      responseCode: 400,
      errors: validationErrors,
    });
  } else if (error.name === "Error") {
    console.log(error);
    return res.status(200).json({
      responseCode: 400,
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    responseCode: 500,
    message: "server error",
    error: error.message,
  });
};
