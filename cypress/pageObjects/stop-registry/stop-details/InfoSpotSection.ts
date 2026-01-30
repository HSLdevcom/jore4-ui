import { InfoSpotsForm } from './InfoSpotsForm';
import { InfoSpotViewCard } from './InfoSpotViewCard';

export class InfoSpotsSection {
  static viewCard = InfoSpotViewCard;

  static form = InfoSpotsForm;

  static getTitle() {
    return cy.getByTestId('InfoSpotsSection::title');
  }

  static getEditButton() {
    return cy.getByTestId('InfoSpotsSection::editButton');
  }

  static getAddNewButton() {
    return cy.getByTestId('InfoSpotsSection::addNewItemButton');
  }

  static getSaveButton() {
    return cy.getByTestId('InfoSpotsSection::saveButton');
  }

  static getAddNewInfoSpotButton() {
    return cy.getByTestId('InfoSpotsSection::addInfoSpot');
  }

  static getNoSheltersInfoText() {
    return cy.getByTestId('InfoSpotsSection::noSheltersText');
  }
}
