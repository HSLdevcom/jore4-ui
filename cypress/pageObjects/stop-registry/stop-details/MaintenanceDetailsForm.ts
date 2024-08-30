import { MaintainerFormFields } from './MaintainerFormFields';

export class MaintenanceDetailsForm {
  fields = new MaintainerFormFields();

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
