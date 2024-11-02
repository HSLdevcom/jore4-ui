import { ShelterFormFields } from './ShelterFormFields';

export class SheltersForm {
  shelters = new ShelterFormFields();

  getShelters() {
    return cy.getByTestId('SheltersForm::shelter');
  }

  getNthShelter(index: number) {
    return this.getShelters().eq(index);
  }

  getAddNewShelterButton() {
    return cy.getByTestId('SheltersForm::addShelter');
  }

  getCopyNewShelterButton() {
    return cy.getByTestId('SheltersFormFields::copyShelter');
  }
}
