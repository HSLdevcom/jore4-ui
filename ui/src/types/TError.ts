import { TFunction } from 'i18next';

export interface TError extends Error {
  translate(t: TFunction): string;
}
