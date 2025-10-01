import { ChangeValidityForm } from './ChangeValidityForm';
import { PriorityForm } from './PriorityForm';
import { Toast } from './Toast';

export class LineForm {
  toast = new Toast();

  priorityForm = new PriorityForm();

  changeValidityForm = new ChangeValidityForm();

  getLabelInput() {
    return cy.getByTestId('LinePropertiesForm::label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishName');
  }

  getSwedishNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishName');
  }

  getFinnishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::finnishShortName');
  }

  getSwedishShortNameInput() {
    return cy.getByTestId('LinePropertiesForm::swedishShortName');
  }

  selectTransportTarget(target: string) {
    cy.getByTestId(
      'LinePropertiesForm::transportTargetInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(target).click();
  }

  selectVehicleType(type: string) {
    cy.getByTestId(
      'LinePropertiesForm::primaryVehicleModeInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(type).click();
  }

  selectLineType(type: string) {
    cy.getByTestId(
      'LinePropertiesForm::typeOfLineInput::ListboxButton',
    ).click();
    cy.get('[role="option"]').contains(type).click();
  }

  getLineTextInput() {
    return cy.getByTestId('LinePropertiesForm::descriptionInput');
  }

  save() {
    return cy.getByTestId('LineForm::saveButton').click();
  }

  cancel() {
    return cy.getByTestId('LineForm::cancelButton').click();
  }

  checkLineSubmitSuccess() {
    this.toast.expectSuccessToast('Linja tallennettu');
  }
}
