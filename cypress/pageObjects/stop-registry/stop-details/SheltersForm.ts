import { ShelterFormFields } from './ShelterFormFields';

export class SheltersForm {
  static shelters = ShelterFormFields;

  static getShelters() {
    return cy.getByTestId('SheltersForm::shelter');
  }

  static getNthShelter(index: number) {
    return SheltersForm.getShelters().eq(index);
  }

  static getCopyNewShelterButton() {
    return cy.getByTestId('SheltersFormFields::copyShelter');
  }
}
