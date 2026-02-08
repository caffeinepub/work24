export interface Worker {
  id: string;
  name: string;
  skill: string;
  serviceCategory: string;
  profileImage: string;
  workImages: string[];
  location?: string;
}
