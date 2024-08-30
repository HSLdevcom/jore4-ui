import { MaintenanceDetailsForm } from './MaintenanceDetailsForm';
import { MaintenanceViewCard } from './MaintenanceViewCard';

export class MaintenanceSection {
  form = new MaintenanceDetailsForm();

  viewCard = new MaintenanceViewCard();

  getEditButton() {
    return cy.getByTestId('MaintenanceSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('MaintenanceSection::saveButton');
  }
}
