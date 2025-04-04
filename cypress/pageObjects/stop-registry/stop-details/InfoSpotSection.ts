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

  getAddNewButton() {
    return cy.getByTestId('InfoSpotsSection::addNewItemButton');
  }

  getSaveButton() {
    return cy.getByTestId('InfoSpotsSection::saveButton');
  }

  getAddNewInfoSpotButton() {
    return cy.getByTestId('InfoSpotsSection::addInfoSpot');
  }
}
