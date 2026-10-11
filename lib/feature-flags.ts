// Temporary feature flags. Remove each one once its blocker is resolved.

/**
 * Advice generation calls the Anthropic API, which costs real money per
 * request. Auth is now wired up, and getBoardAdvice (lib/advice-actions.ts)
 * requires a session before calling out, so this just gates the UI
 * (lib/advice-widget.tsx) on top of that.
 */
export const ADVICE_ENABLED = true;
