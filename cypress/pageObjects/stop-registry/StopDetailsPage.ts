import {
  BasicDetailsSection,
  LocationDetailsSection,
  MeasurementsSection,
  SignageDetailsSection,
} from './stop-details';
import { SheltersSection } from './stop-details/ShelterSection';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  locationDetails = new LocationDetailsSection();

  signageDetails = new SignageDetailsSection();

  shelters = new SheltersSection();

  measurements = new MeasurementsSection();

  visit(label: string) {
    cy.visit(`/stop-registry/stops/${label}`);
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
