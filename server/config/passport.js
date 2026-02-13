const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log('Google Profile:', { id: profile.id, email: profile.emails?.[0]?.value, displayName: profile.displayName });

                    // Check if user already exists
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Check if user exists by email
                    if (profile.emails && profile.emails.length > 0) {
                        user = await User.findOne({ email: profile.emails[0].value });
                    }

                    if (user) {
                        // Link googleId to existing user
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }

                    // Create new user
                    // Handle duplicate username by appending random digits if necessary
                    let username = profile.displayName;
                    let usernameExists = await User.findOne({ username });
                    if (usernameExists) {
                        username = `${username}_${Math.floor(Math.random() * 1000)}`;
                    }

                    user = await User.create({
                        username: username,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        // password field is optional, so we can omit it or send undefined
                    });

                    done(null, user);
                } catch (error) {
                    console.error('Passport Strategy Error:', error);
                    done(error, null);
                }
            }
        )
    );
} else {
    console.warn('⚠️ Google OAuth credentials missing in .env using placeholder. Google Auth will not work.');
}

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
