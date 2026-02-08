import { Language } from '../i18n/translations';

const ONBOARDING_KEY = 'work24_onboarding_complete';
const USER_NAME_KEY = 'work24_user_name';
const LANGUAGE_KEY = 'work24_language';

export function getOnboardingStatus(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function setOnboardingComplete(name: string, language: Language): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
  localStorage.setItem(USER_NAME_KEY, name);
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function getUserName(): string {
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function getLanguage(): Language {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return (saved as Language) || 'en';
}

export function setLanguage(language: Language): void {
  localStorage.setItem(LANGUAGE_KEY, language);
}

export function clearPreferences(): void {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(LANGUAGE_KEY);
}
