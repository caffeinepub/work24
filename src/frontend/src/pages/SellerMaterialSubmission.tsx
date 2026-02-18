import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Work24FormField from '../components/common/Work24FormField';
import { useI18n } from '../i18n/I18nProvider';
import { validateRequired } from '../lib/validation';
import { addMaterial } from '../lib/materialsStorage';
import { getUserName, getSubmitterId } from '../lib/localPreferences';
import { toast } from 'sonner';

export default function SellerMaterialSubmission() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    images: [] as File[],
  });

  const [errors, setErrors] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    images: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: files }));
      setErrors(prev => ({ ...prev, images: '' }));
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
      category: validateRequired(formData.category, t) || '',
      description: validateRequired(formData.description, t) || '',
      location: validateRequired(formData.location, t) || '',
      images: formData.images.length > 0 ? '' : t('sellerSubmission.imagesRequired'),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);

    try {
      const imagesBase64 = await Promise.all(
        formData.images.map(file => fileToBase64(file))
      );

      // Get submitter information
      const submitterName = getUserName() || 'Anonymous';
      const submitterId = getSubmitterId();

      addMaterial({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        images: imagesBase64,
        submittedBy: {
          name: submitterName,
          id: submitterId,
        },
      });

      toast.success(t('sellerSubmission.success'));
      
      setTimeout(() => {
        navigate({ to: '/materials' });
      }, 1500);
    } catch (error) {
      console.error('Error submitting material:', error);
      toast.error('Failed to submit material. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('sellerSubmission.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('sellerSubmission.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border shadow-soft">
          <Work24FormField
            label={t('sellerSubmission.nameLabel')}
            error={errors.name}
            required
          >
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('sellerSubmission.namePlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('sellerSubmission.categoryLabel')}
            error={errors.category}
            required
          >
            <Input
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder={t('sellerSubmission.categoryPlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('sellerSubmission.locationLabel')}
            error={errors.location}
            required
          >
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={t('sellerSubmission.locationPlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('sellerSubmission.descriptionLabel')}
            error={errors.description}
            required
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('sellerSubmission.descriptionPlaceholder')}
              rows={4}
            />
          </Work24FormField>

          <Work24FormField
            label={t('sellerSubmission.imagesLabel')}
            helper={t('sellerSubmission.imagesHelper')}
            error={errors.images}
            required
          >
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {formData.images.length} {formData.images.length === 1 ? 'image' : 'images'} selected
              </p>
            )}
          </Work24FormField>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t('sellerSubmission.submitting') : t('sellerSubmission.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
