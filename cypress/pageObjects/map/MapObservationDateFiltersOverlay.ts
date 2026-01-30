import { MapObservationDateControl } from './MapObservationDateControl';

export class MapObservationDateFiltersOverlay {
  static observationDateControl = MapObservationDateControl;

  static getToggleShowFiltersButton() {
    return cy.getByTestId('ObservationDateOverlay::toggleFiltersButton');
  }
}
