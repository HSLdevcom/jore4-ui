import { ObservationDateControl } from '../ObservationDateControl';
import {
  BasicDetailsSection,
  CreateCopyModal,
  InfoSpotsSection,
  LocationDetailsSection,
  MaintenanceSection,
  MeasurementsSection,
  SheltersSection,
  SignageDetailsSection,
  StopHeaderSummaryRow,
  StopTitleRow,
} from './stop-details';
import { OverlappingVersionCutConfirmationModal } from './stop-details/CutValidityConfirmationModal';
import { EditStopModal } from './stop-details/EditStopModal';

export class StopDetailsPage {
  basicDetails = new BasicDetailsSection();

  infoSpots = new InfoSpotsSection();

  locationDetails = new LocationDetailsSection();

  signageDetails = new SignageDetailsSection();

  shelters = new SheltersSection();

  measurements = new MeasurementsSection();

  maintenance = new MaintenanceSection();

  titleRow = new StopTitleRow();

  copyModal = new CreateCopyModal();

  editStopModal = new EditStopModal();

  observationDateControl = new ObservationDateControl();

  overlappingCutConfirmationModal =
    new OverlappingVersionCutConfirmationModal();

  headerSummaryRow = new StopHeaderSummaryRow();

  visit(label: string) {
    cy.visit(`/stop-registry/stops/${label}`);
  }

  page() {
    return cy.getByTestId('StopDetailsPage::page');
  }

  validityPeriod() {
    return cy.getByTestId('StopDetailsPage::validityPeriod');
  }

  editStopValidityButton() {
    return cy.getByTestId('StopDetailsPage::editStopValidityButton');
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

  loadingStopDetails() {
    return cy.getByTestId('StopDetailsPage::loadingStopDetails');
  }

  returnToDateBasedVersionSelection() {
    return cy.getByTestId(
      'StopDetailsVersion::returnToDateBasedVersionSelection',
    );
  }
}
