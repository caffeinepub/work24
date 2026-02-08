import { Language } from '../i18n/translations';

export function validateRequired(value: string, t: (key: string) => string): string | null {
  if (!value || value.trim() === '') {
    return t('validation.required');
  }
  return null;
}

export function validateMobile(value: string, t: (key: string) => string): string | null {
  const requiredError = validateRequired(value, t);
  if (requiredError) return requiredError;
  
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(value.trim())) {
    return t('validation.mobileInvalid');
  }
  return null;
}
