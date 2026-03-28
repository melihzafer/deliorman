/**
 * Shared Bulgarian phone number validation and normalization utilities.
 *
 * Used by:
 *  - src/app/api/reservation/route.ts
 *  - src/app/_components/forms/ReservationForm.jsx
 */

import type { PhoneValidationOptions, PhoneValidationResult } from '@/src/types';

/**
 * Normalize Bulgarian phone number to E.164 format
 */
export function normalizeBgPhone(input: string | number | null | undefined): string {
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
 */
export function validateBgPhone(
  input: string | number | null | undefined,
  options: PhoneValidationOptions = {},
): PhoneValidationResult {
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
