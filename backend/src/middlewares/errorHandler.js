const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      statusCode: 400,
      message: messages[0] || "Validatsiya xatosi",
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    if (field === "email") {
      return res.status(409).json({
        statusCode: 409,
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }
    return res.status(409).json({
      statusCode: 409,
      message: "Bu ma'lumot allaqachon mavjud",
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      statusCode: 400,
      message: "Noto'g'ri ID format",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      statusCode: 401,
      message: "Tizimga kiring",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      statusCode: 401,
      message: "Token muddati tugagan",
    });
  }

  // Custom errors with statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Default server error
  return res.status(500).json({
    statusCode: 500,
    message: "Server xatosi yuz berdi",
  });
};

module.exports = errorHandler;
