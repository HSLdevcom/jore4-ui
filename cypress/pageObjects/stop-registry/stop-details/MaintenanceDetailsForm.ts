import { MaintainerFormFields } from './MaintainerFormFields';
import { OrganisationDetailsModal } from './OrganisationDetailsModal';

export class MaintenanceDetailsForm {
  fields = new MaintainerFormFields();

  organisationDetailsModal = new OrganisationDetailsModal();

  getStopOwnerDropdownButton() {
    return cy.getByTestId('MaintenanceDetailsForm::stopOwner::ListboxButton');
  }

  getStopOwnerDropdownOptions() {
    return cy.getByTestId('MaintenanceDetailsForm::stopOwner::ListboxOptions');
  }

  getOwner() {
    return cy.getByTestId('MaintenanceDetailsForm::owner');
  }

  getShelterMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::shelterMaintenance');
  }

  getMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::maintenance');
  }

  getWinterMaintenance() {
    return cy.getByTestId('MaintenanceDetailsForm::winterMaintenance');
  }

  getInfoUpkeep() {
    return cy.getByTestId('MaintenanceDetailsForm::infoUpkeep');
  }

  getCleaning() {
    return cy.getByTestId('MaintenanceDetailsForm::cleaning');
  }
}
