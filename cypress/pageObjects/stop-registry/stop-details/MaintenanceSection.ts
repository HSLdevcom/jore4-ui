import { MaintenanceViewCard } from './MaintenanceViewCard';

export class MaintenanceSection {
  viewCard = new MaintenanceViewCard();

  getEditButton() {
    return cy.getByTestId('MaintenanceSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('MaintenanceSection::saveButton');
  }
}
