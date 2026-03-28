/**
 * Shared HTML escaping utilities.
 *
 * Used by:
 *  - src/app/api/reservation/route.ts
 *  - src/app/api/contact/route.ts
 */

/**
 * Escape HTML special characters in a string
 * @param {string} text - The input text
 * @returns {string} - The text with escaped HTML characters
 */
export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
