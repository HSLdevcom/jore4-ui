import { MaintenanceDetailsForm } from './MaintenanceDetailsForm';
import { MaintenanceViewCard } from './MaintenanceViewCard';

export class MaintenanceSection {
  form = new MaintenanceDetailsForm();

  viewCard = new MaintenanceViewCard();

  getEditButton() {
    return cy.getByTestId('MaintenanceSection::editButton');
  }

  getCancelButton() {
    return cy.getByTestId('MaintenanceSection::cancelButton');
  }

  getSaveButton() {
    return cy.getByTestId('MaintenanceSection::saveButton');
  }
}
