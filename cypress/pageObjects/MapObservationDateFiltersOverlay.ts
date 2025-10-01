import { MapObservationDateControl } from './MapObservationDateControl';

export class MapObservationDateFiltersOverlay {
  observationDateControl = new MapObservationDateControl();

  getToggleShowFiltersButton() {
    return cy.getByTestId('ObservationDateOverlay::toggleFiltersButton');
  }
}
