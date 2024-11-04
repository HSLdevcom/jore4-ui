import { InfoSpotsForm } from './InfoSpotsForm';
import { InfoSpotViewCard } from './InfoSpotViewCard';

export class InfoSpotsSection {
  viewCard = new InfoSpotViewCard();

  form = new InfoSpotsForm();

  getTitle() {
    return cy.getByTestId('InfoSpotsSection::title');
  }

  getEditButton() {
    return cy.getByTestId('InfoSpotsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('InfoSpotsSection::saveButton');
  }
}
