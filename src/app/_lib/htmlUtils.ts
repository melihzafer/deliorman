/**
 * Shared HTML escaping utilities.
 *
 * Used by:
 *  - src/app/api/reservation/route.ts
 *  - src/app/api/contact/route.ts
 */

/**
 * Escape HTML special characters in a string
 */
export function escapeHtml(text: string | number | null | undefined): string {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
