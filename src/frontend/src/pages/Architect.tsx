import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { useI18n } from '../i18n/I18nProvider';
import { useSubmitArchitectProject } from '../hooks/useQueries';

export default function Architect() {
  const { t } = useI18n();
  const submitMutation = useSubmitArchitectProject();

  const [formData, setFormData] = useState({
    name: '',
    projectType: '',
    location: '',
    budget: '',
    message: '',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.projectType.trim()) newErrors.projectType = 'Project type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const fileBlobs = await Promise.all(
        files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
        })
      );

      await submitMutation.mutateAsync({
        ...formData,
        files: fileBlobs,
      });

      toast.success('Project submitted successfully! We will contact you soon.');
      setFormData({ name: '', projectType: '', location: '', budget: '', message: '' });
      setFiles([]);
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit project. Please try again.');
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Architect Project Submission</h1>
        <p className="text-muted-foreground">Submit your project details for a quote</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type *</Label>
          <Input
            id="projectType"
            value={formData.projectType}
            onChange={(e) => {
              setFormData({ ...formData, projectType: e.target.value });
              setErrors({ ...errors, projectType: '' });
            }}
            placeholder="e.g., Residential, Commercial"
          />
          {errors.projectType && <p className="text-sm text-destructive">{errors.projectType}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value });
              setErrors({ ...errors, location: '' });
            }}
            placeholder="Enter project location"
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Estimated Budget *</Label>
          <Input
            id="budget"
            value={formData.budget}
            onChange={(e) => {
              setFormData({ ...formData, budget: e.target.value });
              setErrors({ ...errors, budget: '' });
            }}
            placeholder="Enter your budget range"
          />
          {errors.budget && <p className="text-sm text-destructive">{errors.budget}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Project Details *</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Describe your project requirements"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="files">Design Images (Optional)</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <p className="text-sm text-muted-foreground">Upload design or reference images</p>
        </div>

        <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? 'Submitting...' : 'Submit Project'}
        </Button>
      </form>
    </div>
  );
}
