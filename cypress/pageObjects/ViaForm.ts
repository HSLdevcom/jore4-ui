export class ViaForm {
  getFinnishName() {
    return cy.getByTestId('viaForm::finnishName');
  }

  getFinnishShortName() {
    return cy.getByTestId('viaForm::finnishShortName');
  }

  getSwedishName() {
    return cy.getByTestId('viaForm::swedishName');
  }

  getSwedishShortName() {
    return cy.getByTestId('viaForm::swedishShortName');
  }

  save() {
    return cy.getByTestId('viaForm::save').click();
  }

  remove() {
    return cy.getByTestId('viaForm::remove').click();
  }

  fillViaInformation(values: {
    finnishName: string;
    finnishShortName: string;
    swedishName: string;
    swedishShortName: string;
  }) {
    this.getFinnishName().type(values.finnishName);
    this.getFinnishShortName().type(values.finnishShortName);
    this.getSwedishName().type(values.swedishName);
    this.getSwedishShortName().type(values.swedishShortName);

    this.save();
  }
}
