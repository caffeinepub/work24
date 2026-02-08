export interface Service {
  id: string;
  nameKey: string;
  icon: string;
}

export const services: Service[] = [
  { id: 'furniture', nameKey: 'services.furniture', icon: '🪑' },
  { id: 'painting', nameKey: 'services.painting', icon: '🎨' },
  { id: 'fabrication', nameKey: 'services.fabrication', icon: '🔧' },
  { id: 'plumbing', nameKey: 'services.plumbing', icon: '🚰' },
  { id: 'electrical', nameKey: 'services.electrical', icon: '⚡' },
  { id: 'custom', nameKey: 'services.custom', icon: '⚙️' },
];

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}
