import { escapeHtml } from '../htmlUtils';

describe('escapeHtml', () => {
  test('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  test('escapes angle brackets', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('a < b > c')).toBe('a &lt; b &gt; c');
  });

  test('escapes combined special characters', () => {
    expect(escapeHtml('<div class="x">&</div>')).toBe(
      '&lt;div class="x"&gt;&amp;&lt;/div&gt;'
    );
  });

  test('returns empty string for falsy input', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
  });

  test('leaves normal text unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
    expect(escapeHtml('Здравейте')).toBe('Здравейте');
  });

  test('handles numeric input via coercion', () => {
    expect(escapeHtml(42)).toBe('42');
  });
});
