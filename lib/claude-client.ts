import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let claude: Anthropic | undefined;

/**
 * Lazily constructed so a missing ANTHROPIC_API_KEY only breaks the advice
 * feature when it's actually used, rather than crashing the whole app at
 * import time (this module lands in a shared server chunk, so an eager
 * throw here took down unrelated routes like sign-in).
 */
export function getClaudeClient(): Anthropic {
  if (!claude) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required (set it in .env.local for local dev)");
    }
    claude = new Anthropic({ apiKey });
  }
  return claude;
}
