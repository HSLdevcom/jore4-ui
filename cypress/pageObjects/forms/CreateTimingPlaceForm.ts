export interface CreateTimingPlaceFormInfo {
  label: string;
  description: string;
}

export class CreateTimingPlaceForm {
  static getTimingPlaceLabelInput() {
    return cy.getByTestId('CreateTimingPlaceForm::label');
  }

  static getTimingPlaceDescriptionInput() {
    return cy.getByTestId('CreateTimingPlaceForm::finnishDescription');
  }

  static getAddTimingPlaceSubmitButton() {
    return cy.getByTestId('CreateTimingPlaceForm::submitButton');
  }

  static getCloseButton() {
    return cy.get(
      '[data-testid="TimingPlaceModal"] [data-testid="ModalHeader::closeButton"]',
    );
  }

  static fillTimingPlaceForm(values: CreateTimingPlaceFormInfo) {
    CreateTimingPlaceForm.getTimingPlaceLabelInput().clear().type(values.label);
    CreateTimingPlaceForm.getTimingPlaceDescriptionInput()
      .clear()
      .type(values.description);
  }

  static fillTimingPlaceFormAndSave(values: CreateTimingPlaceFormInfo) {
    CreateTimingPlaceForm.fillTimingPlaceForm(values);
    CreateTimingPlaceForm.getAddTimingPlaceSubmitButton().click();
  }
}
