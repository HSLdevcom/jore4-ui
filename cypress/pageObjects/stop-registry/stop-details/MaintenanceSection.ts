import { MaintenanceDetailsForm } from './MaintenanceDetailsForm';
import { MaintenanceViewCard } from './MaintenanceViewCard';

export class MaintenanceSection {
  static form = MaintenanceDetailsForm;

  static viewCard = MaintenanceViewCard;

  static getEditButton() {
    return cy.getByTestId('MaintenanceSection::editButton');
  }

  static getCancelButton() {
    return cy.getByTestId('MaintenanceSection::cancelButton');
  }

  static getSaveButton() {
    return cy.getByTestId('MaintenanceSection::saveButton');
  }
}
