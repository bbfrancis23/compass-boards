// Temporary feature flags. Remove each one once its blocker is resolved.

/**
 * Advice generation calls the Anthropic API, which costs real money per
 * request. Disabled until auth (#28-32) is wired up, so an anonymous
 * visitor to the deployed app can't run up the bill. Checked both in the
 * UI (lib/advice-widget.tsx) and, as the actual enforcement boundary, in
 * the getBoardAdvice server action (lib/advice-actions.ts).
 */
export const ADVICE_ENABLED = false;
