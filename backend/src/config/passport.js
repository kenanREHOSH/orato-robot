import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

export const configurePassport = () => {
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          const googleId = profile.id;
          const profilePicture = profile.photos[0]?.value || '';

          let user = await User.findOne({ googleId });
          if (user) {
            if (profilePicture && user.profilePicture !== profilePicture) {
              user.profilePicture = profilePicture;
              await user.save();
            }
            return done(null, user);
          }

          user = await User.findOne({ email: email.toLowerCase() });
          if (user) {
            user.googleId = googleId;
            user.profilePicture = profilePicture || user.profilePicture;
            user.authProvider = 'google';
            await user.save();
            return done(null, user);
          }

          return done(null, false, { message: 'new_user_not_allowed' });

        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};