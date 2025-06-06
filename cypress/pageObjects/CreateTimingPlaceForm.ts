export interface CreateTimingPlaceFormInfo {
  label: string;
  description: string;
}

export class CreateTimingPlaceForm {
  getTimingPlaceLabelInput() {
    return cy.getByTestId('CreateTimingPlaceForm::label');
  }

  getTimingPlaceDescriptionInput() {
    return cy.getByTestId('CreateTimingPlaceForm::finnishDescription');
  }

  getAddTimingPlaceSubmitButton() {
    return cy.getByTestId('CreateTimingPlaceForm::submitButton');
  }

  getCloseButton() {
    return cy.get(
      '[data-testid="TimingPlaceModal"] [data-testid="ModalHeader::closeButton"]',
    );
  }

  fillTimingPlaceForm(values: CreateTimingPlaceFormInfo) {
    this.getTimingPlaceLabelInput().clear().type(values.label);
    this.getTimingPlaceDescriptionInput().clear().type(values.description);
  }

  fillTimingPlaceFormAndSave(values: CreateTimingPlaceFormInfo) {
    this.fillTimingPlaceForm(values);
    this.getAddTimingPlaceSubmitButton().click();
  }
}
