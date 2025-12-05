/**
 * Browser API compatibility layer
 * Works with both Chrome (chrome.*) and Firefox (browser.*)
 * Firefox uses the 'browser' global instead of 'chrome'
 */

// Firefox's browser API has the same shape as Chrome's chrome API
declare const browser: typeof chrome | undefined;

export const browserAPI: typeof chrome =
  typeof chrome !== 'undefined' && chrome?.runtime
    ? chrome
    : typeof browser !== 'undefined'
      ? browser
      : // Fallback for strict TypeScript - should not reach in practice
        (chrome as unknown as typeof chrome);
