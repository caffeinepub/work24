import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Work24FormField from '../components/common/Work24FormField';
import { useI18n } from '../i18n/I18nProvider';
import { validateRequired, validateMobile } from '../lib/validation';
import { useSubmitContact } from '../lib/contactSubmissions';
import { toast } from 'sonner';

export default function Career() {
  const { t } = useI18n();
  const submitContact = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    skills: '',
    experience: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string | null> = {
      name: validateRequired(formData.name, t),
      mobile: validateMobile(formData.mobile, t),
      skills: validateRequired(formData.skills, t),
      experience: validateRequired(formData.experience, t),
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      return;
    }

    try {
      await submitContact.mutateAsync({
        type: 'career',
        customerName: formData.name,
        mobile: formData.mobile,
        requirement: `Skills: ${formData.skills}\nExperience: ${formData.experience}\nMessage: ${formData.message}`,
      });
      
      toast.success(t('career.success'));
      setFormData({ name: '', mobile: '', skills: '', experience: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{t('career.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('career.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-soft">
        <Work24FormField
          label={t('career.nameLabel')}
          error={errors.name}
          required
        >
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('career.namePlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('career.mobileLabel')}
          error={errors.mobile}
          required
        >
          <Input
            type="tel"
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            placeholder={t('career.mobilePlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('career.skillsLabel')}
          error={errors.skills}
          required
        >
          <Input
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder={t('career.skillsPlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('career.experienceLabel')}
          error={errors.experience}
          required
        >
          <Input
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            placeholder={t('career.experiencePlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('career.messageLabel')}
        >
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('career.messagePlaceholder')}
            rows={4}
          />
        </Work24FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={submitContact.isPending}
        >
          {submitContact.isPending ? t('career.submitting') : t('career.submit')}
        </Button>
      </form>
    </div>
  );
}
