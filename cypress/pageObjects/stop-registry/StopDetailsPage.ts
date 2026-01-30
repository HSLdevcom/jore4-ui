import { ObservationDateControl } from '../timetables/ObservationDateControl';
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
  static basicDetails = BasicDetailsSection;

  static infoSpots = InfoSpotsSection;

  static locationDetails = LocationDetailsSection;

  static signageDetails = SignageDetailsSection;

  static shelters = SheltersSection;

  static measurements = MeasurementsSection;

  static maintenance = MaintenanceSection;

  static titleRow = StopTitleRow;

  static copyModal = CreateCopyModal;

  static editStopModal = EditStopModal;

  static observationDateControl = ObservationDateControl;

  static overlappingCutConfirmationModal =
    OverlappingVersionCutConfirmationModal;

  static headerSummaryRow = StopHeaderSummaryRow;

  static visit(label: string) {
    cy.visit(`/stop-registry/stops/${label}`);
  }

  static page() {
    return cy.getByTestId('StopDetailsPage::page');
  }

  static validityPeriod() {
    return cy.getByTestId('StopDetailsPage::validityPeriod');
  }

  static editStopValidityButton() {
    return cy.getByTestId('StopDetailsPage::editStopValidityButton');
  }

  static changeHistoryLink() {
    return cy.getByTestId('StopDetailsPage::changeHistoryLink');
  }

  static basicDetailsTabButton() {
    return cy.getByTestId('StopDetailsPage::basicDetailsTabButton');
  }

  static basicDetailsTabPanel() {
    return cy.getByTestId('StopDetailsPage::basicDetailsTabPanel');
  }

  static technicalFeaturesTabButton() {
    return cy.getByTestId('StopDetailsPage::technicalFeaturesTabButton');
  }

  static technicalFeaturesTabPanel() {
    return cy.getByTestId('StopDetailsPage::technicalFeaturesTabPanel');
  }

  static infoSpotsTabButton() {
    return cy.getByTestId('StopDetailsPage::infoSpotsTabButton');
  }

  static infoSpotsTabPanel() {
    return cy.getByTestId('StopDetailsPage::infoSpotsTabPanel');
  }

  static loadingStopDetails() {
    return cy.getByTestId('StopDetailsPage::loadingStopDetails');
  }

  static returnToDateBasedVersionSelection() {
    return cy.getByTestId(
      'StopDetailsVersion::returnToDateBasedVersionSelection',
    );
  }
}
