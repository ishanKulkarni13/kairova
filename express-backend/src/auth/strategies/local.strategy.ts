import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/user.js";

export const configureLocalStrategy = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done) => {
        try {
          if (!email || !password) {
            return done(null, false, {
              message: "Email and password required",
            });
          }

          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            return done(null, false, { message: "Invalid email" });
          }

          const isPasswordValid = await user.isValidPassword(password);

          if (!isPasswordValid) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      },
    ),
  );
};
