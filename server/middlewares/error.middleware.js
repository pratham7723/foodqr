const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.log(error);

    // Wrong Mongoose object ID
    if (error.name === "CastError") {
      const message = `Resource not found. Invalid: ${error.path}`;
      error = new Error(message);
      error.status = 400;
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
      error = new Error(message);
      error.status = 400;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((val) => val.message);
      error = new Error(message);
      error.status = 400;
    }

    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
