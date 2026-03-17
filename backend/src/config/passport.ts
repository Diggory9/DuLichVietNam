import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User";
import { env } from "./env";

export function initPassport(): void {
  if (!env.googleClientId || !env.googleClientSecret) {
    console.log("[Passport] Google OAuth chưa cấu hình, bỏ qua.");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(new Error("Google account has no email"));
          }

          // Find existing user by googleId or email
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email }],
          });

          if (user) {
            // Link google account if not already linked
            if (!user.googleId) {
              user.googleId = profile.id;
              user.authProvider = user.authProvider === "local" ? "local" : "google";
              await user.save();
            }
          } else {
            // Create new user
            user = await User.create({
              username: `google_${profile.id}`,
              email,
              password: `oauth_${Date.now()}_${Math.random().toString(36)}`,
              googleId: profile.id,
              authProvider: "google",
              displayName:
                profile.displayName || email.split("@")[0],
              avatar: profile.photos?.[0]?.value,
            });
          }

          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}
