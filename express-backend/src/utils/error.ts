class ErrorHandler extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string = "Internal Server Error",
    statusCode: number = 500
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;