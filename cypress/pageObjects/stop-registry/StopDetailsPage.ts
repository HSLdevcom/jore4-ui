import { UUID } from '../../types';
import {
  BasicDetailsSection,
  LocationDetailsSection,
  SignageDetailsSection,
} from './stop-details';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  locationDetails = new LocationDetailsSection();

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
