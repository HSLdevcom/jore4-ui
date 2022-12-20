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

  fillTimingPlaceFormAndSave(values: CreateTimingPlaceFormInfo) {
    this.getTimingPlaceLabelInput().clear().type(values.label);
    this.getTimingPlaceDescriptionInput().clear().type(values.description);
    this.getAddTimingPlaceSubmitButton().click();
  }
}
