import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import { uploadToCloudinary } from "../../utils/cloudinary.js";
import User from "../../models/user.js";

export const configureGoogleStrategy = () => {
  if (
    !process.env.GOOGLE_OAUTH_CLIENT_ID ||
    !process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
    !process.env.GOOGLE_OAUTH_CALLBACK_URL
  ) {
    throw new Error("Google OAuth env variables missing");
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done,
      ) => {
        try {
          const googleId = profile.id;
          const name = profile.name?.givenName || "NoName";
          const email = profile.emails?.[0]?.value;
          const photo = profile.photos?.[0]?.value;

          if (!email) {
            return done(null, false, { message: "Email is required from Google" });
          }

          let user = await User.findOne({ googleOAuthID: googleId });

          if (!user) {
            let profilePic;

            if (photo) {
              const cloudinaryPhoto = await uploadToCloudinary(photo);
              if(cloudinaryPhoto){
                profilePic = { public_id: cloudinaryPhoto?.public_id, URL: cloudinaryPhoto?.url };
              }
              
            }

            user = await User.create({
              name,
              email,
              profilePic,
              googleOAuthID: googleId,
              authMethod: "google",
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      },
    ),
  );
};
