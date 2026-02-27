import { AppError } from "../utils/appError.js";
import { ERROR_CODES } from "./errorCodes.js";

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, ERROR_CODES.AUTH_REQUIRED);
  }
}