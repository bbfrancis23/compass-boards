import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-safe config (no Node-only imports), so it can also be used from
// middleware. See auth.ts for the full NextAuth() setup.
export const authConfig = {
  providers: [GitHub],
  callbacks: {
    // Without a database adapter, Auth.js deliberately does NOT set
    // token.sub from the provider's profile id — it mints a fresh random
    // UUID as `user.id` on every single sign-in (see @auth/core's
    // getUserAndAccount: "the user's id is intentionally not set based on
    // the profile id, as the user should remain independent of the
    // provider"). That's correct once there's a real user table to assign
    // stable ids from, but there isn't one here, so left alone it means a
    // different, unpredictable session.user.id every time you sign in —
    // which can never match a userId seeded into boards.
    //
    // `profile` (the raw GitHub API response) is only passed into this
    // callback on the initial sign-in, and does carry GitHub's real,
    // stable numeric id — capture it into token.sub there. On later
    // requests `profile` is undefined and token.sub already holds the
    // value from sign-in, so it's left untouched.
    async jwt({ token, profile }) {
      if (profile?.id) {
        token.sub = String(profile.id);
      }
      return token;
    },
    // The default session callback only copies name/email/image; board
    // data is scoped per-user (db/schema.ts boards.userId), so callers
    // need that id exposed on session.user too. Providing this callback
    // replaces the default entirely (they aren't composed), so — unlike
    // the default, which always constructs a user object — session.user
    // isn't guaranteed to exist here; spread rather than assume it does.
    async session({ session, token }) {
      if (token.sub) {
        session.user = { ...session.user, id: token.sub };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
