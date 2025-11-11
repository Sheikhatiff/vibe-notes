import AppError from "../utils/appError.js";

function handleCastErrorDB(err) {
  const message = `Invalid ${err?.path}: ${err?.value}.`;
  return new AppError(message, 400);
}

const handleDuplicateErrorDb = (err) => {
  const msg = `Duplicate field value: ${
    err.errorResponse.errmsg.match(/"(?:\\.|[^"\\])*"/)[0]
  }. Please use another value!`;
  return new AppError(msg, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors)
    .map((x) => x.message)
    .join(". ");
  const msg = `Invalid input data. ${errors}`;
  return new AppError(msg, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token, please log in again !", 401);

const handleExpireTokenError = () =>
  new AppError("Your token has expired, please log in again !", 401);

function sendErrorDev(err, res) {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

function sendErrorProd(err, res) {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } // Programming or other unknown error: don't leak error details
  else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
}

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENVIRONMENT === "development") {
    sendErrorDev(err, res);
  } else {
    const { name, code } = err;
    let error = { ...err };
    if (name === "CastError") error = handleCastErrorDB(error);
    if (name === "ValidationError") error = handleValidationErrorDb(error);
    if (code === 11000) error = handleDuplicateErrorDb(error);
    if (name === "JsonWebTokenError") error = handleJWTError();
    if (name === "TokenExpiredError") error = handleExpireTokenError();
    sendErrorProd(error, res);
  }
};
