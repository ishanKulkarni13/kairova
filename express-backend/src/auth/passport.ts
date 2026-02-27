import { configureSession } from "./serializeUser.js";
import { configureGoogleStrategy } from "./strategies/google.strategy.js";
import { configureLocalStrategy } from "./strategies/local.strategy.js";

export function initializePassport() {
  configureSession();
  configureGoogleStrategy();
  configureLocalStrategy();
}
