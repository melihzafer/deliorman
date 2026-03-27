/**
 * Shared Bulgarian phone number validation and normalization utilities.
 *
 * Used by:
 *  - src/app/api/reservation/route.js
 *  - src/app/_components/forms/ReservationForm.jsx
 */

/**
 * Normalize Bulgarian phone number to E.164 format
 * @param {string|number} input - The raw phone number input
 * @returns {string} - Normalized phone number in E.164 format
 */
export function normalizeBgPhone(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';

  let s = raw.replace(/[\s\-()]/g, '');

  // 00359... -> +359...
  if (s.startsWith('00')) s = `+${s.slice(2)}`;

  // 359... -> +359...
  if (s.startsWith('359')) s = `+${s}`;

  // 08XXXXXXXXX -> +3598XXXXXXXX
  if (s.startsWith('08')) s = `+359${s.slice(1)}`;

  return s;
}

/**
 * Validate Bulgarian phone number
 * @param {string|number} input - The raw phone number input
 * @param {Object} [options] - Validation options
 * @param {string} [options.emptyMessage] - Custom message when input is empty
 * @returns {Object} - Validation result { ok, normalized, message }
 */
export function validateBgPhone(input, options = {}) {
  const emptyMessage = options.emptyMessage || 'Моля въведете телефонен номер';
  const normalized = normalizeBgPhone(input);
  if (!normalized) {
    return { ok: false, normalized: '', message: emptyMessage };
  }

  if (!/^\+\d+$/.test(normalized)) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  if (!normalized.startsWith('+359')) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  // Common BG mobile length: +359 + 9 digits
  if (normalized.length !== 13) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  return { ok: true, normalized, message: '' };
}
