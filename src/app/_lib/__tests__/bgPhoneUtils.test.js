import { normalizeBgPhone, validateBgPhone } from '../bgPhoneUtils';

describe('normalizeBgPhone', () => {
  test('normalizes +359 format (already E.164)', () => {
    expect(normalizeBgPhone('+359888123456')).toBe('+359888123456');
  });

  test('normalizes 0-prefix format to E.164', () => {
    expect(normalizeBgPhone('0888123456')).toBe('+359888123456');
  });

  test('normalizes 00359 prefix to E.164', () => {
    expect(normalizeBgPhone('00359888123456')).toBe('+359888123456');
  });

  test('normalizes bare 359 prefix to E.164', () => {
    expect(normalizeBgPhone('359888123456')).toBe('+359888123456');
  });

  test('strips spaces, dashes and parentheses', () => {
    expect(normalizeBgPhone('0888 123 456')).toBe('+359888123456');
    expect(normalizeBgPhone('0888-123-456')).toBe('+359888123456');
    expect(normalizeBgPhone('(0888) 123 456')).toBe('+359888123456');
  });

  test('returns empty string for empty/falsy input', () => {
    expect(normalizeBgPhone('')).toBe('');
    expect(normalizeBgPhone(null)).toBe('');
    expect(normalizeBgPhone(undefined)).toBe('');
  });
});

describe('validateBgPhone', () => {
  test('returns ok:true for valid BG mobile numbers', () => {
    expect(validateBgPhone('+359888123456')).toEqual({
      ok: true,
      normalized: '+359888123456',
      message: '',
    });
    expect(validateBgPhone('0888123456')).toEqual({
      ok: true,
      normalized: '+359888123456',
      message: '',
    });
  });

  test('returns ok:false with message for empty input', () => {
    const result = validateBgPhone('');
    expect(result.ok).toBe(false);
    expect(result.message).toBeTruthy();
  });

  test('returns ok:false for non-BG prefix', () => {
    const result = validateBgPhone('+447911123456');
    expect(result.ok).toBe(false);
    expect(result.message).toBeTruthy();
  });

  test('returns ok:false for wrong length', () => {
    const result = validateBgPhone('+35988812345'); // 12 digits, needs 13
    expect(result.ok).toBe(false);
    expect(result.message).toBeTruthy();
  });

  test('returns ok:false for non-numeric characters', () => {
    const result = validateBgPhone('abc');
    expect(result.ok).toBe(false);
    expect(result.message).toBeTruthy();
  });

  test('accepts custom emptyMessage option', () => {
    const result = validateBgPhone('', { emptyMessage: 'Required' });
    expect(result.message).toBe('Required');
  });
});
