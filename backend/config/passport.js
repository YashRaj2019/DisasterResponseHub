import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Check if user with same email exists
          const email = profile.emails?.[0]?.value;
          if (email) {
            user = await User.findOne({ email });
          }

          if (user) {
            user.githubId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              name: profile.displayName || profile.username,
              email: email || `${profile.username}@github.com`,
              githubId: profile.id,
              role: 'Citizen',
              // Temporary password for OAuth users
              password: Math.random().toString(36).slice(-10),
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
