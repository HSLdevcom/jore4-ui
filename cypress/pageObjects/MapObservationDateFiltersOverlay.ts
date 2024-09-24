import { ObservationDateControl } from './ObservationDateControl';

export class MapObservationDateFiltersOverlay {
  observationDateControl = new ObservationDateControl();

  getToggleShowFiltersButton() {
    return cy.getByTestId('ObservationDateOverlay::toggleFiltersButton');
  }
}
