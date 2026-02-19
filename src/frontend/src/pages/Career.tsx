import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useI18n } from '../i18n/I18nProvider';
import { useSubmitCareerApplication } from '../hooks/useQueries';
import { validateMobile } from '../lib/validation';

export default function Career() {
  const { t } = useI18n();
  const submitMutation = useSubmitCareerApplication();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    skills: '',
    experience: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    const mobileError = validateMobile(formData.mobile, t);
    if (mobileError) newErrors.mobile = mobileError;
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      toast.success('Application submitted successfully! We will contact you soon.');
      setFormData({ name: '', mobile: '', skills: '', experience: '', message: '' });
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Join Work24</h1>
        <p className="text-muted-foreground">Become a part of our skilled workforce</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
          <Label htmlFor="skills">Your Skill *</Label>
          <Input
            id="skills"
            value={formData.skills}
            onChange={(e) => {
              setFormData({ ...formData, skills: e.target.value });
              setErrors({ ...errors, skills: '' });
            }}
            placeholder="e.g., Carpenter, Electrician, Plumber"
          />
          {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Input
            id="experience"
            value={formData.experience}
            onChange={(e) => {
              setFormData({ ...formData, experience: e.target.value });
              setErrors({ ...errors, experience: '' });
            }}
            placeholder="Enter years of experience"
          />
          {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Additional Message (Optional)</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us more about yourself"
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
}
