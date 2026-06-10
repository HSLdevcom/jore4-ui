import { ReasonForChangeForm } from '../../forms/ReasonForChangeForm';
import { ConfirmationDialog } from '../../shared-components';

export class MirroredQuayDetails {
  static cards() {
    return cy.getByTestId('MirroredQuayDetails::container');
  }

  static getEditButton() {
    return cy.getByTestId('MirroredQuayDetails::editButton');
  }

  static getSaveButton() {
    return cy.getByTestId('MirroredQuayDetails::saveButton');
  }

  static getCancelButton() {
    return cy.getByTestId('MirroredQuayDetails::cancelButton');
  }

  static getDeleteButton() {
    return cy.getByTestId('MirroredQuayDetails::deleteButton');
  }

  static getStopStateDropdownButton() {
    return cy.getByTestId('MirroredQuayForm::stopPlaceState::ListboxButton');
  }

  static getStopStateDropdownOptions() {
    return cy.getByTestId('MirroredQuayForm::stopPlaceState::ListboxOptions');
  }

  static reasonForChange = ReasonForChangeForm;

  static removeButton() {
    return cy.getByTestId('MirroredQuayDetails::remove');
  }

  static confirmationDialog = ConfirmationDialog;
}
