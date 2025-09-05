import { TerminalInfoSpotsFormFields } from './TerminalInfoSpotsFormFields';

export class TerminalInfoSpotsForm {
  formFields = new TerminalInfoSpotsFormFields();

  getInfoSpots() {
    return cy.getByTestId('TerminalInfoSpotsForm::infoSpot');
  }

  getNthInfoSpot(index: number) {
    return this.getInfoSpots().eq(index);
  }
}
