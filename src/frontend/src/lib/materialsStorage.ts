import { Material } from '../types/materials';

const MATERIALS_KEY = 'work24_materials';

export function getMaterials(): Material[] {
  const stored = localStorage.getItem(MATERIALS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addMaterial(material: Omit<Material, 'id'>): Material {
  const materials = getMaterials();
  const newMaterial: Material = {
    ...material,
    id: `material_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  materials.push(newMaterial);
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
  return newMaterial;
}
