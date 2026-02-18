export interface Material {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  submittedBy?: {
    name: string;
    id: string;
  };
}
