import { AppError } from "../utils/appError.js";
import { ERROR_CODES } from "./errorCodes.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}