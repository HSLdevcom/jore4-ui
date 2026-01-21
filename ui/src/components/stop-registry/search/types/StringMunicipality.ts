export const knownMunicipalities = [
  'Helsinki',
  'Vantaa',
  'Espoo',
  'Kauniainen',
  'Siuntio',
  'Kirkkonummi',
  'Sipoo',
  'Kerava',
  'Tuusula',
] as const;

export type StringMunicipality = (typeof knownMunicipalities)[number];
