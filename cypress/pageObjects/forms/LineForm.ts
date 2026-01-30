import { Toast } from '../shared-components/Toast';
import { ChangeValidityForm } from './ChangeValidityForm';
import { PriorityForm } from './PriorityForm';

export class LineForm {
  static toast = Toast;

  static priorityForm = PriorityForm;

  static changeValidityForm = ChangeValidityForm;

  static getLabelInput() {
    return cy.getByTestId('LinePropertiesForm::label');
  }

  static getFinnishNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishName');
  }

  static getSwedishNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishName');
  }

  static getFinnishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishShortName');
  }

  static getSwedishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishShortName');
  }

  static selectTransportTarget(target: string) {
    cy.getByTestId(
      'LinePropertiesForm::transportTargetInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(target).click();
  }

  static selectVehicleType(type: string) {
    cy.getByTestId(
      'LinePropertiesForm::primaryVehicleModeInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(type).click();
  }

  static selectLineType(type: string) {
    cy.getByTestId(
      'LinePropertiesForm::typeOfLineInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(type).click();
  }

  static getLineTextInput() {
    return cy.getByTestId('LinePropertiesForm::descriptionInput');
  }

  static save() {
    return cy.getByTestId('LineForm::saveButton').click();
  }

  static cancel() {
    return cy.getByTestId('LineForm::cancelButton').click();
  }

  static checkLineSubmitSuccess() {
    Toast.expectSuccessToast('Linja tallennettu');
  }
}
