import { Priority } from '../../../../../types/enums';
import { JoreStopRegistryTransportModeType } from '../../../../../types/stop-registry';

export const stopSearchBarTestIds = {
  electricityFilter: 'StopSearchBar::electricityFilter',
  elyInput: 'StopSearchBar::elyInput',
  infoSpotsFilter: 'StopSearchBar::infoSpotsFilter',
  municipalitiesFilter: 'StopSearchBar::municipalitiesFilter',
  observationDateInput: 'StopSearchBar::observationDateInput',
  priorityCheckbox: (priority: Priority) =>
    `StopSearchBar::priority::${Priority[priority]}`,
  searchButton: 'StopSearchBar::searchButton',
  searchForDropdown: 'StopSearchBar::SearchForDropdown',
  searchInput: 'StopSearchBar::searchInput',
  shelterFilter: 'StopSearchBar::shelterFilter',
  stopStateFilter: 'StopSearchBar::stopStateFilter',
  toggleExpand: 'StopSearchBar::chevronToggle',
  transportationModeButton: (mode: JoreStopRegistryTransportModeType) =>
    `StopSearchBar::transportationMode::${mode}`,
};
