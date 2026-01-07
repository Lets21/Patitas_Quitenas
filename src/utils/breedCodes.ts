/**
 * Códigos de razas según dataset PetFinder
 * Estas son las razas más comunes que se pueden seleccionar
 */

export const BREED_OPTIONS = [
  { label: "Mestizo (Mixed Breed)", code: 307 },
  { label: "Labrador Retriever", code: 265 },
  { label: "Golden Retriever", code: 232 },
  { label: "Pastor Alemán (German Shepherd)", code: 94 },
  { label: "Chihuahua", code: 158 },
  { label: "Beagle", code: 76 },
  { label: "Bulldog", code: 125 },
  { label: "Poodle/Caniche", code: 265 },
  { label: "Dachshund/Salchicha", code: 173 },
  { label: "Boxer", code: 103 },
  { label: "Husky", code: 250 },
  { label: "Rottweiler", code: 287 },
  { label: "Schnauzer", code: 294 },
  { label: "Dálmata", code: 174 },
  { label: "Shih Tzu", code: 295 },
  { label: "Pomerania", code: 273 },
  { label: "Pug/Carlino", code: 277 },
  { label: "Cocker Spaniel", code: 162 },
  { label: "Maltés", code: 218 },
  { label: "Pitbull/American Pit Bull Terrier", code: 268 },
  { label: "Border Collie", code: 99 },
  { label: "Doberman", code: 178 },
  { label: "Gran Danés", code: 234 },
  { label: "Terrier (general)", code: 91 },
  { label: "Desconocida", code: 0 },
] as const;

/**
 * Encuentra el código de raza por nombre
 */
export function getBreedCodeByLabel(label: string): number {
  const breed = BREED_OPTIONS.find(b => b.label === label);
  return breed?.code ?? 0;
}

/**
 * Encuentra la etiqueta de raza por código
 */
export function getBreedLabelByCode(code: number): string {
  const breed = BREED_OPTIONS.find(b => b.code === code);
  return breed?.label ?? "Desconocida";
}
