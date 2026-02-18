import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Work24FormField from '../components/common/Work24FormField';
import { useI18n } from '../i18n/I18nProvider';
import { validateRequired } from '../lib/validation';
import { useSubmitContact } from '../lib/contactSubmissions';
import { toast } from 'sonner';

export default function Architect() {
  const { t } = useI18n();
  const submitContact = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    projectType: '',
    location: '',
    budget: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string | null> = {
      name: validateRequired(formData.name, t),
      projectType: validateRequired(formData.projectType, t),
      location: validateRequired(formData.location, t),
      budget: validateRequired(formData.budget, t),
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      return;
    }

    try {
      await submitContact.mutateAsync({
        type: 'architect',
        origin: 'architect',
        customerName: formData.name,
        mobile: '',
        requirement: `Project Type: ${formData.projectType}\nLocation: ${formData.location}\nBudget: ${formData.budget}\nMessage: ${formData.message}\nImages: ${selectedFiles.length} files`,
      });
      
      toast.success(t('architect.success'));
      setFormData({ name: '', projectType: '', location: '', budget: '', message: '' });
      setSelectedFiles([]);
    } catch (error) {
      toast.error('Failed to submit project. Please try again.');
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">{t('architect.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('architect.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-soft">
        <Work24FormField
          label={t('architect.nameLabel')}
          error={errors.name}
          required
        >
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('architect.namePlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('architect.projectTypeLabel')}
          error={errors.projectType}
          required
        >
          <Input
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            placeholder={t('architect.projectTypePlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('architect.locationLabel')}
          error={errors.location}
          required
        >
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder={t('architect.locationPlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('architect.budgetLabel')}
          error={errors.budget}
          required
        >
          <Input
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder={t('architect.budgetPlaceholder')}
          />
        </Work24FormField>

        <Work24FormField
          label={t('architect.messageLabel')}
        >
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t('architect.messagePlaceholder')}
            rows={4}
          />
        </Work24FormField>

        <Work24FormField
          label={t('architect.imagesLabel')}
          helper={t('architect.imagesHelper')}
        >
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          {selectedFiles.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </Work24FormField>

        <Button
          type="submit"
          className="w-full"
          disabled={submitContact.isPending}
        >
          {submitContact.isPending ? t('architect.submitting') : t('architect.submit')}
        </Button>
      </form>
    </div>
  );
}
