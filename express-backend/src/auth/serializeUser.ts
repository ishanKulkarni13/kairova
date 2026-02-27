import passport from "passport";
import userModel from "../models/user.js";


export const configureSession = () => {

  passport.serializeUser((user: any, done) => {
    try {
      done(null, (user as any)._id);
    } catch (error) {
      done(error as Error);
    }
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  });

};