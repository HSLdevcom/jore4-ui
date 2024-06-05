import { ShelterFormRow } from './ShelterFormRow';

export class SheltersForm {
  shelters = new ShelterFormRow();

  getShelterRows() {
    return cy.getByTestId('SheltersForm::shelterRow');
  }

  getShelterRow(index: number) {
    return this.getShelterRows().eq(index);
  }

  getDeleteShelterButtons() {
    return cy.getByTestId('SheltersForm::deleteShelter');
  }

  getAddNewShelterButton() {
    return cy.getByTestId('SheltersForm::addShelter');
  }
}
