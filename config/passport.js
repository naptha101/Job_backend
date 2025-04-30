import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { config } from "dotenv"; // ✅ use 'config' not 'configDotenv'

config(); // ✅ Call dotenv.config() to load .env variables

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// Google OAuth Strategy
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = await User.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profilePicture: profile.photos[0].value,
          });
        }

        return done(null, { user, token: generateToken(user) });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export { passport as passp }; // ✅ cleaner export
