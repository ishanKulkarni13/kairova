import type { UserDocument } from "../models/user";

declare global {
  namespace Express {
    interface User extends UserDocument {}

     interface Request {
      login(
        user: UserDocument,
        done: (err?: any) => void
      ): void;

      logout(done: (err?: any) => void): void;
    }
  }
}