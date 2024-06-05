export class ApiError extends Error {
  constructor(statusCode, message, stack) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
  }
}

export function throwErr(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";
    return res
    .status(err.statusCode)
    .json({
        success: false,
        err: err.message,
        stack: err.stack
    })
}