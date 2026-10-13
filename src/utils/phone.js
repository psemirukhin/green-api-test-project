/**
 * Normalize phone input to digits for GREEN-API CheckAccount (RF/RB).
 * @returns {{ phoneNumber: number } | { error: string }}
 */
export function normalizePhoneNumber(value) {
  let digits = String(value || '').replace(/\D/g, '');

  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`;
  }

  if (!digits) {
    return { error: 'Введите номер телефона' };
  }

  const isRussia = digits.length === 11 && digits.startsWith('7');
  const isBelarus = digits.length === 12 && digits.startsWith('375');

  if (!isRussia && !isBelarus) {
    return {
      error:
        'Укажите номер РФ (11 цифр, код 7) или РБ (12 цифр, код 375), например 79991234567',
    };
  }

  return { phoneNumber: Number(digits) };
}
