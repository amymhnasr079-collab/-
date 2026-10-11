/**
 * Utility functions for Eastern Arabic Numerals (الأرقام العربية الشرقية)
 * ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩
 * As strictly required by Omani curriculum and user instructions.
 */

const westernToEasternMap: Record<string, string> = {
  '0': '٠',
  '1': '١',
  '2': '٢',
  '3': '٣',
  '4': '٤',
  '5': '٥',
  '6': '٦',
  '7': '٧',
  '8': '٨',
  '9': '٩',
  '.': '٫',
  ',': '،'
};

/**
 * Converts any number or string with Western digits to Eastern Arabic digits.
 */
export function toArabicNumerals(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str.replace(/[0-9.,]/g, (match) => westernToEasternMap[match] || match);
}

/**
 * Formats a distance in meters to Arabic Eastern digits.
 * Example: 24.5 -> "٢٤٫٥٠ م"
 */
export function formatDistance(meters: number): string {
  const formatted = meters.toFixed(2);
  return `${toArabicNumerals(formatted)} م`;
}

/**
 * Formats a measurement with a unit.
 * Example: (260, 'سم') -> "٢٦٠ سم"
 */
export function formatUnit(val: number | string, unit: string): string {
  return `${toArabicNumerals(val)} ${unit}`;
}
