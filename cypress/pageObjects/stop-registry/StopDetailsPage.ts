import { UUID } from '../../types';

export class StopDetailsPage {
  visit(scheduledStopPointId: UUID) {
    cy.visit(`/stop-registry/stops/${scheduledStopPointId}`);
  }

  page() {
    return cy.getByTestId('StopDetailsPage::page');
  }

  label() {
    return cy.getByTestId('StopTitleRow::label');
  }

  names() {
    return cy.getByTestId('StopTitleRow::names');
  }

  validityPeriod() {
    return cy.getByTestId('StopDetailsPage::validityPeriod');
  }
}
