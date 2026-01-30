import { MaintainerFormFields } from './MaintainerFormFields';
import { OrganisationDetailsModal } from './OrganisationDetailsModal';

export class MaintenanceDetailsForm {
  static fields = MaintainerFormFields;

  static organisationDetailsModal = OrganisationDetailsModal;

  static getStopOwnerDropdownButton() {
    return cy.getByTestId('MaintenanceDetailsForm::stopOwner::ListboxButton');
  }

  static getStopOwnerDropdownOptions() {
    return cy.getByTestId('MaintenanceDetailsForm::stopOwner::ListboxOptions');
  }

  static getOwner() {
    return cy.getByTestId('MaintenanceDetailsForm::owner');
  }

  static getShelterMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::shelterMaintenance');
  }

  static getMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::maintenance');
  }

  static getWinterMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::winterMaintenance');
  }

  static getInfoUpkeep() {
    return cy.getByTestId('MaintenanceDetailsForm::infoUpkeep');
  }

  static getCleaning() {
    return cy.getByTestId('MaintenanceDetailsForm::cleaning');
  }
}
