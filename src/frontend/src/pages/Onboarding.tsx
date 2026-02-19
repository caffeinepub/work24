import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useI18n } from '../i18n/I18nProvider';
import { Language } from '../i18n/translations';
import { setOnboardingComplete } from '../lib/localPreferences';

export default function Onboarding() {
  const { t, setLanguage } = useI18n();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
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
          <h1 className="text-3xl font-bold">Welcome to Work24</h1>
          <p className="text-xl text-primary font-semibold">Let's get started</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter your name"
              className="text-base"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language *</Label>
            <Select value={selectedLanguage} onValueChange={(val) => setSelectedLanguage(val as Language)}>
              <SelectTrigger id="language" className="text-base">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="gu">ગુજરાતી</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full text-base h-11">
            Get Started
          </Button>
        </form>
      </div>
    </div>
  );
}
