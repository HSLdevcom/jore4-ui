import { MaintainerFormFields } from './MaintainerFormFields';
import { OrganisationDetailsModal } from './OrganisationDetailsModal';

export class MaintenanceDetailsForm {
  fields = new MaintainerFormFields();

  organisationDetailsModal = new OrganisationDetailsModal();

  getOwner() {
    return cy.getByTestId('MaintenanceDetailsForm::owner');
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
