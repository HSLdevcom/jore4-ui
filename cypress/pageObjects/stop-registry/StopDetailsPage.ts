import {
  BasicDetailsSection,
  InfoSpotsSection,
  LocationDetailsSection,
  MaintenanceSection,
  MeasurementsSection,
  SheltersSection,
  SignageDetailsSection,
} from './stop-details';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  infoSpots = new InfoSpotsSection();

  locationDetails = new LocationDetailsSection();

  signageDetails = new SignageDetailsSection();

  shelters = new SheltersSection();

  measurements = new MeasurementsSection();

  maintenance = new MaintenanceSection();

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

  copyToNewVersionButton() {
    return cy.getByTestId('calendar-button-createStopVersion');
  }
}
