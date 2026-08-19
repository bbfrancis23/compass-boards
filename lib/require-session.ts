import "server-only";
import { auth } from "@/auth";

/**
 * Throws if there's no authenticated session. Call this at the top of
 * every Server Action that reads or writes board data.
 *
 * app/boards/layout.tsx already redirects unauthenticated page loads, but
 * Server Actions are independently invokable HTTP endpoints — a request
 * can hit one directly without ever going through that layout's render
 * path, so each action needs its own check rather than relying on the
 * page-level guard alone.
 */
export async function requireSession() {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
