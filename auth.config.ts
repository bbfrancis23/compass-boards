import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Edge-safe config (no Node-only imports), so it can also be used from
// middleware. See auth.ts for the full NextAuth() setup.
export const authConfig = {
  providers: [GitHub],
  callbacks: {
    // This is a single-owner app, not a multi-tenant one: only the GitHub
    // account named by AUTH_GITHUB_OWNER_LOGIN may sign in. Fails closed
    // (denies everyone) if that env var isn't set, rather than silently
    // allowing any GitHub user in.
    async signIn({ profile }) {
      const ownerLogin = process.env.AUTH_GITHUB_OWNER_LOGIN?.trim().toLowerCase();
      if (!ownerLogin) return false;
      // GitHub usernames are case-insensitive, so normalize both sides.
      return typeof profile?.login === "string" && profile.login.toLowerCase() === ownerLogin;
    },
  },
} satisfies NextAuthConfig;
