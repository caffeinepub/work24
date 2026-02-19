import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { useI18n } from '../i18n/I18nProvider';
import { useAddWorker } from '../hooks/useQueries';
import { services } from '../lib/servicesCatalog';

export default function WorkerSubmission() {
  const { t } = useI18n();
  const addWorkerMutation = useAddWorker();

  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    category: '',
    location: '',
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [workImages, setWorkImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setErrors({ ...errors, profileImage: '' });
    }
  };

  const handleWorkImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setWorkImages(Array.from(e.target.files));
      setErrors({ ...errors, workImages: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.skill.trim()) newErrors.skill = 'Skill is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!profileImage) newErrors.profileImage = 'Profile photo is required';
    if (workImages.length < 3) newErrors.workImages = 'At least 3 work photos are required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const profileArrayBuffer = await profileImage!.arrayBuffer();
      const profileBlob = ExternalBlob.fromBytes(new Uint8Array(profileArrayBuffer));

      const workBlobs = await Promise.all(
        workImages.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
        })
      );

      await addWorkerMutation.mutateAsync({
        ...formData,
        profileImage: profileBlob,
        workImages: workBlobs,
      });

      toast.success('Profile submitted successfully!');
      setFormData({ name: '', skill: '', category: '', location: '' });
      setProfileImage(null);
      setWorkImages([]);
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit profile. Please try again.');
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Register as a Worker</h1>
        <p className="text-muted-foreground">Join our network of skilled professionals</p>
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
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="skill">Your Skill *</Label>
          <Input
            id="skill"
            value={formData.skill}
            onChange={(e) => {
              setFormData({ ...formData, skill: e.target.value });
              setErrors({ ...errors, skill: '' });
            }}
            placeholder="e.g., Carpenter, Electrician"
          />
          {errors.skill && <p className="text-sm text-destructive">{errors.skill}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Service Category *</Label>
          <Select value={formData.category} onValueChange={(val) => {
            setFormData({ ...formData, category: val });
            setErrors({ ...errors, category: '' });
          }}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a service category" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {t(service.nameKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
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
            placeholder="Enter your city or area"
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profileImage">Profile Photo *</Label>
          <Input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <p className="text-sm text-muted-foreground">Upload a clear photo of yourself</p>
          {errors.profileImage && <p className="text-sm text-destructive">{errors.profileImage}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workImages">Work Photos *</Label>
          <Input
            id="workImages"
            type="file"
            multiple
            accept="image/*"
            onChange={handleWorkImagesChange}
          />
          <p className="text-sm text-muted-foreground">Upload at least 3 photos of your work</p>
          {errors.workImages && <p className="text-sm text-destructive">{errors.workImages}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={addWorkerMutation.isPending}>
          {addWorkerMutation.isPending ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </form>
    </div>
  );
}
