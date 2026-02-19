import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import { useI18n } from '../i18n/I18nProvider';
import { useAddMaterial } from '../hooks/useQueries';

export default function SellerMaterialSubmission() {
  const { t } = useI18n();
  const addMaterialMutation = useAddMaterial();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setErrors({ ...errors, images: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Material name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (images.length === 0) newErrors.images = 'At least one photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const imageBlobs = await Promise.all(
        images.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
        })
      );

      await addMaterialMutation.mutateAsync({
        ...formData,
        images: imageBlobs,
      });

      toast.success('Material submitted successfully!');
      setFormData({ name: '', category: '', description: '', location: '' });
      setImages([]);
      setErrors({});
    } catch (error) {
      toast.error('Failed to submit material. Please try again.');
    }
  };

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sell Material</h1>
        <p className="text-muted-foreground">List your construction materials for sale</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-medium space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Material Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: '' });
            }}
            placeholder="e.g., Cement, Bricks, Steel"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setErrors({ ...errors, category: '' });
            }}
            placeholder="e.g., Building Material, Hardware"
          />
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
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: '' });
            }}
            placeholder="Describe the material, quantity, condition, etc."
            rows={4}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Material Photos *</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
          />
          <p className="text-sm text-muted-foreground">Upload photos of the material</p>
          {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={addMaterialMutation.isPending}>
          {addMaterialMutation.isPending ? 'Submitting...' : 'Submit Material'}
        </Button>
      </form>
    </div>
  );
}
