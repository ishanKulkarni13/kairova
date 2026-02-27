import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

const sendDevError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    success: false,
    code: err.code,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err: AppError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    success: false,
    code: ERROR_CODES.INTERNAL_ERROR,
    message: "Something went wrong",
  });
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else {
    appError = new AppError(
      "Internal Server Error",
      500,
      ERROR_CODES.INTERNAL_ERROR,
      false
    );
  }

  if (process.env.NODE_ENV === "development") {
    return sendDevError(appError, res);
  }

  return sendProdError(appError, res);
};