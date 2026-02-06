import { SheltersForm } from './SheltersForm';
import { ShelterViewCard } from './ShelterViewCard';

export class SheltersSection {
  static form = SheltersForm;

  static viewCard = ShelterViewCard;

  static getTitle() {
    return cy.getByTestId('SheltersSection::title');
  }

  static getEditButton() {
    return cy.getByTestId('SheltersSection::editButton');
  }

  static getAddShelterButton() {
    return cy.getByTestId('SheltersSection::addNewItemButton');
  }

  static getAddNewShelterButton() {
    return cy.getByTestId('SheltersSection::addShelter');
  }

  static getSaveButton() {
    return cy.getByTestId('SheltersSection::saveButton');
  }
}
