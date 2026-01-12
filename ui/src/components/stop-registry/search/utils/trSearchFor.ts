import { TFunction } from 'i18next';
import { SearchFor } from '../types';

export function trSearchFor(t: TFunction, searchFor: SearchFor): string | null {
  switch (searchFor) {
    case SearchFor.Stops:
      return t('stopRegistrySearch.searchFor.stops');

    case SearchFor.StopAreas:
      return t('stopRegistrySearch.searchFor.stopAreas');

    case SearchFor.Terminals:
      return t('stopRegistrySearch.searchFor.terminals');

    default:
      return null;
  }
}
