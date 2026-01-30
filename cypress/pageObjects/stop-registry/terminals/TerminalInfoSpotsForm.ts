import { TerminalInfoSpotsFormFields } from './TerminalInfoSpotsFormFields';

export class TerminalInfoSpotsForm {
  static formFields = TerminalInfoSpotsFormFields;

  static getInfoSpots() {
    return cy.getByTestId('TerminalInfoSpotsForm::infoSpot');
  }

  static getNthInfoSpot(index: number) {
    return TerminalInfoSpotsForm.getInfoSpots().eq(index);
  }
}
