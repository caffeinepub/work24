import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Work24FormField from '../components/common/Work24FormField';
import { useI18n } from '../i18n/I18nProvider';
import { Language } from '../i18n/translations';
import { setOnboardingComplete } from '../lib/localPreferences';
import { validateRequired } from '../lib/validation';

export default function Onboarding() {
  const { t, setLanguage } = useI18n();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateRequired(name, t);
    if (nameError) {
      setError(nameError);
      return;
    }

    setOnboardingComplete(name, selectedLanguage);
    setLanguage(selectedLanguage);
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <img 
            src="/assets/generated/work24-logo.dim_512x512.png" 
            alt="Work24" 
            className="h-20 w-auto mx-auto"
          />
          <h1 className="text-3xl font-bold">{t('onboarding.welcome')}</h1>
          <p className="text-xl text-primary font-semibold">{t('onboarding.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
          <Work24FormField
            label={t('onboarding.nameLabel')}
            error={error}
            required
          >
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder={t('onboarding.namePlaceholder')}
              className="text-base"
            />
          </Work24FormField>

          <Work24FormField
            label={t('onboarding.languageLabel')}
            required
          >
            <Select value={selectedLanguage} onValueChange={(val) => setSelectedLanguage(val as Language)}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder={t('onboarding.languageSelect')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('languages.en')}</SelectItem>
                <SelectItem value="hi">{t('languages.hi')}</SelectItem>
                <SelectItem value="gu">{t('languages.gu')}</SelectItem>
              </SelectContent>
            </Select>
          </Work24FormField>

          <Button type="submit" className="w-full text-base h-11">
            {t('onboarding.continue')}
          </Button>
        </form>
      </div>
    </div>
  );
}
