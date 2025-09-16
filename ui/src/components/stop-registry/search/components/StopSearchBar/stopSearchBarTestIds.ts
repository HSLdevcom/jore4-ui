import { JoreStopRegistryTransportModeType } from '../../../../../types/stop-registry';

export const stopSearchBarTestIds = {
  elyInput: 'StopSearchBar::elyInput',
  observationDateInput: 'StopSearchBar::observationDateInput',
  searchButton: 'StopSearchBar::searchButton',
  searchInput: 'StopSearchBar::searchInput',
  toggleExpand: 'StopSearchBar::chevronToggle',
  stopStateFilter: 'StopSearchBar::stopStateFilter',
  shelterFilter: 'StopSearchBar::shelterFilter',
  electricityFilter: 'StopSearchBar::electricityFilter',
  transportationModeButton: (mode: JoreStopRegistryTransportModeType) =>
    `StopSearchBar::transportationMode::${mode}`,
  municipalitiesFilter: 'StopSearchBar::municipalitiesFilter',
  infoSpotsFilter: 'StopSearchBar::infoSpotsFilter',
};
