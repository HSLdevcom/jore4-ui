import { InfoSpotViewCard } from './InfoSpotViewCard';

export class InfoSpotsSection {
  viewCard = new InfoSpotViewCard();

  getTitle() {
    return cy.getByTestId('InfoSpotsSection::title');
  }

  getEditButton() {
    return cy.getByTestId('InfoSpotsSection::editButton');
  }
}
