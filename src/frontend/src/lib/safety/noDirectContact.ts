export const ALLOWED_WORKER_FIELDS = ['id', 'name', 'skill', 'serviceCategory', 'profileImage', 'workImages', 'location'];
export const ALLOWED_MATERIAL_FIELDS = ['id', 'name', 'category', 'description', 'images', 'location'];

export function sanitizeWorkerData(worker: any): any {
  const sanitized: any = {};
  ALLOWED_WORKER_FIELDS.forEach(field => {
    if (worker[field] !== undefined) {
      sanitized[field] = worker[field];
    }
  });
  return sanitized;
}

export function sanitizeMaterialData(material: any): any {
  const sanitized: any = {};
  ALLOWED_MATERIAL_FIELDS.forEach(field => {
    if (material[field] !== undefined) {
      sanitized[field] = material[field];
    }
  });
  return sanitized;
}
