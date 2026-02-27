class ErrorHandler extends Error {
  public statusCode: number;

  constructor(message: string = "Internal server Error", statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;