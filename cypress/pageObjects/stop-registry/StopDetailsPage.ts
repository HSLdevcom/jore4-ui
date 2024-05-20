import { UUID } from '../../types';
import {
  BasicDetailsSection,
  LocationDetailsSection,
  MeasurementsSection,
  SignageDetailsSection,
} from './stop-details';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  locationDetails = new LocationDetailsSection();

  signageDetails = new SignageDetailsSection();

  measurements = new MeasurementsSection();

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

  basicDetailsTabButton() {
    return cy.getByTestId('StopDetailsPage::basicDetailsTabButton');
  }

  basicDetailsTabPanel() {
    return cy.getByTestId('StopDetailsPage::basicDetailsTabPanel');
  }

  technicalFeaturesTabButton() {
    return cy.getByTestId('StopDetailsPage::technicalFeaturesTabButton');
  }

  technicalFeaturesTabPanel() {
    return cy.getByTestId('StopDetailsPage::technicalFeaturesTabPanel');
  }

  infoSpotsTabButton() {
    return cy.getByTestId('StopDetailsPage::infoSpotsTabButton');
  }

  infoSpotsTabPanel() {
    return cy.getByTestId('StopDetailsPage::infoSpotsTabPanel');
  }
}
