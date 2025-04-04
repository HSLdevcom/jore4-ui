import { InfoSpotFormFields } from './InfoSpotFormFields';

export class InfoSpotsForm {
  infoSpots = new InfoSpotFormFields();

  getInfoSpots() {
    return cy.getByTestId('InfoSpotsForm::infoSpot');
  }

  getNthInfoSpot(index: number) {
    return this.getInfoSpots().eq(index);
  }
}
