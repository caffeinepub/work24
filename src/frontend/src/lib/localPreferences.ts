import { Language } from '../i18n/translations';

const ONBOARDING_KEY = 'work24_onboarding_complete';
const USER_NAME_KEY = 'work24_user_name';
const LANGUAGE_KEY = 'work24_language';
const SUBMITTER_ID_KEY = 'work24_submitter_id';

export function getOnboardingStatus(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function setOnboardingComplete(name: string, language: Language): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
  localStorage.setItem(USER_NAME_KEY, name);
  localStorage.setItem(LANGUAGE_KEY, language);
  
  // Generate a unique submitter ID if not exists
  if (!localStorage.getItem(SUBMITTER_ID_KEY)) {
    const submitterId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SUBMITTER_ID_KEY, submitterId);
  }
}

export function getUserName(): string {
  return localStorage.getItem(USER_NAME_KEY) || '';
}

export function getSubmitterId(): string {
  let id = localStorage.getItem(SUBMITTER_ID_KEY);
  if (!id) {
    id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SUBMITTER_ID_KEY, id);
  }
  return id;
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
  localStorage.removeItem(SUBMITTER_ID_KEY);
}
