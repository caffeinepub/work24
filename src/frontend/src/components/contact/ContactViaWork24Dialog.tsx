import { useState } from 'react';
import { Worker } from '../../types/workers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Work24FormField from '../common/Work24FormField';
import { useI18n } from '../../i18n/I18nProvider';
import { validateRequired, validateMobile } from '../../lib/validation';
import { useSubmitContact } from '../../lib/contactSubmissions';
import { toast } from 'sonner';

interface ContactViaWork24DialogProps {
  worker: Worker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactViaWork24Dialog({
  worker,
  open,
  onOpenChange,
}: ContactViaWork24DialogProps) {
  const { t } = useI18n();
  const submitContact = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    requirement: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string | null> = {
      name: validateRequired(formData.name, t),
      mobile: validateMobile(formData.mobile, t),
      requirement: validateRequired(formData.requirement, t),
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err !== null)) {
      return;
    }

    try {
      await submitContact.mutateAsync({
        type: 'worker',
        workerName: worker?.name,
        customerName: formData.name,
        mobile: formData.mobile,
        requirement: formData.requirement,
      });
      
      toast.success(t('contact.success'));
      setFormData({ name: '', mobile: '', requirement: '' });
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('contact.title')}</DialogTitle>
          <DialogDescription>{t('contact.description')}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Work24FormField
            label={t('contact.nameLabel')}
            error={errors.name}
            required
          >
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('contact.namePlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('contact.mobileLabel')}
            error={errors.mobile}
            required
          >
            <Input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder={t('contact.mobilePlaceholder')}
            />
          </Work24FormField>

          <Work24FormField
            label={t('contact.requirementLabel')}
            error={errors.requirement}
            required
          >
            <Textarea
              value={formData.requirement}
              onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
              placeholder={t('contact.requirementPlaceholder')}
              rows={4}
            />
          </Work24FormField>

          <Button
            type="submit"
            className="w-full"
            disabled={submitContact.isPending}
          >
            {submitContact.isPending ? t('contact.submitting') : t('contact.submit')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
