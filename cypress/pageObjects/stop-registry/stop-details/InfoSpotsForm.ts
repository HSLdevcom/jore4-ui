import { InfoSpotFormFields } from './InfoSpotFormFields';

export class InfoSpotsForm {
  static infoSpots = InfoSpotFormFields;

  static getInfoSpots() {
    return cy.getByTestId('InfoSpotsForm::infoSpot');
  }

  static getNthInfoSpot(index: number) {
    return InfoSpotsForm.getInfoSpots().eq(index);
  }
}
