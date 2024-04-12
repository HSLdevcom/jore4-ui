import { UUID } from '../../types';
import {
  BasicDetailsSection,
  LocationDetailsViewCard,
  SignageDetailsSection,
} from './stop-details';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  locationDetailsViewCard = new LocationDetailsViewCard();

  signageDetails = new SignageDetailsSection();

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
