import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSubmitContactRequest } from '../../hooks/useQueries';
import { validateMobile } from '../../lib/validation';
import { useI18n } from '../../i18n/I18nProvider';

interface ContactViaWork24DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: bigint;
  targetType: 'worker' | 'material';
  targetName: string;
}

export default function ContactViaWork24Dialog({
  open,
  onOpenChange,
  targetId,
  targetType,
  targetName,
}: ContactViaWork24DialogProps) {
  const { t } = useI18n();
  const submitMutation = useSubmitContactRequest();

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    requirements: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    const mobileError = validateMobile(formData.mobile, t);
    if (mobileError) newErrors.mobile = mobileError;
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await submitMutation.mutateAsync({
        ...formData,
        targetId,
        targetType,
      });

      toast.success('Request submitted successfully! We will contact you soon.');
      setFormData({ customerName: '', mobile: '', requirements: '' });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact via Work24</DialogTitle>
          <DialogDescription>
            Fill in your details to inquire about {targetName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => {
                setFormData({ ...formData, customerName: e.target.value });
                setErrors({ ...errors, customerName: '' });
              }}
              placeholder="Enter your name"
            />
            {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) => {
                setFormData({ ...formData, mobile: e.target.value });
                setErrors({ ...errors, mobile: '' });
              }}
              placeholder="Enter your mobile number"
            />
            {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Your Requirements *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => {
                setFormData({ ...formData, requirements: e.target.value });
                setErrors({ ...errors, requirements: '' });
              }}
              placeholder="Describe what you need"
              rows={4}
            />
            {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitMutation.isPending}>
              {submitMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
