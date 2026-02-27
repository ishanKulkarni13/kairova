import { AppError } from "../utils/appError.js";
import { ERROR_CODES } from "./errorCodes.js";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, ERROR_CODES.VALIDATION_FAILED);
  }
}