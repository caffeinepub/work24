import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Work24FormField from '../components/common/Work24FormField';
import { useI18n } from '../i18n/I18nProvider';
import { validateRequired } from '../lib/validation';
import { addWorker } from '../lib/workersStorage';
import { getUserName, getSubmitterId } from '../lib/localPreferences';
import { services } from '../lib/servicesCatalog';
import { toast } from 'sonner';

export default function WorkerSubmission() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    serviceCategory: '',
    location: '',
    profileImage: null as File | null,
    workImages: [] as File[],
  });

  const [errors, setErrors] = useState({
    name: '',
    skill: '',
    serviceCategory: '',
    location: '',
    profileImage: '',
    workImages: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const handleWorkImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, workImages: files }));
      setErrors(prev => ({ ...prev, workImages: '' }));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: validateRequired(formData.name, t) || '',
      skill: validateRequired(formData.skill, t) || '',
      serviceCategory: validateRequired(formData.serviceCategory, t) || '',
      location: validateRequired(formData.location, t) || '',
      profileImage: formData.profileImage ? '' : t('workerSubmission.profileImageRequired'),
      workImages: formData.workImages.length >= 3 ? '' : t('workerSubmission.workImagesRequired'),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const profileImageBase64 = await fileToBase64(formData.profileImage!);
      const workImagesBase64 = await Promise.all(
        formData.workImages.map(file => fileToBase64(file))
      );

      // Get submitter information
      const submitterName = getUserName() || 'Anonymous';
      const submitterId = getSubmitterId();

      addWorker({
        name: formData.name,
        skill: formData.skill,
        serviceCategory: formData.serviceCategory,
        location: formData.location,
        profileImage: profileImageBase64,
        workImages: workImagesBase64,
        submittedBy: {
          name: submitterName,
          id: submitterId,
        },
      });

      toast.success(t('workerSubmission.success'));
      
      setTimeout(() => {
        navigate({ to: `/service/${formData.serviceCategory}` });
      }, 1500);
    } catch (error) {
      console.error('Error submitting worker profile:', error);
      toast.error('Failed to submit profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('workerSubmission.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('workerSubmission.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border shadow-soft">
          <Work24FormField
            label={t('workerSubmission.nameLabel')}
            error={errors.name}
            required
          >
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('workerSubmission.namePlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('workerSubmission.skillLabel')}
            error={errors.skill}
            required
          >
            <Input
              value={formData.skill}
              onChange={(e) => handleInputChange('skill', e.target.value)}
              placeholder={t('workerSubmission.skillPlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('workerSubmission.categoryLabel')}
            error={errors.serviceCategory}
            required
          >
            <Select
              value={formData.serviceCategory}
              onValueChange={(value) => handleInputChange('serviceCategory', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('workerSubmission.categorySelect')} />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {t(service.nameKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Work24FormField>

          <Work24FormField
            label={t('workerSubmission.locationLabel')}
            error={errors.location}
            required
          >
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={t('workerSubmission.locationPlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('workerSubmission.profileImageLabel')}
            helper={t('workerSubmission.profileImageHelper')}
            error={errors.profileImage}
            required
          >
            <Input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </Work24FormField>

          <Work24FormField
            label={t('workerSubmission.workImagesLabel')}
            helper={t('workerSubmission.workImagesHelper')}
            error={errors.workImages}
            required
          >
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleWorkImagesChange}
            />
            {formData.workImages.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.workImages.length} {formData.workImages.length === 1 ? 'image' : 'images'} selected
              </p>
            )}
          </Work24FormField>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('workerSubmission.submitting') : t('workerSubmission.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
