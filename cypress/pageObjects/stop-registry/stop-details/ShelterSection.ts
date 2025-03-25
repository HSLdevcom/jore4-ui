import { SheltersForm } from './SheltersForm';
import { ShelterViewCard } from './ShelterViewCard';

export class SheltersSection {
  form = new SheltersForm();

  viewCard = new ShelterViewCard();

  getTitle() {
    return cy.getByTestId('SheltersSection::title');
  }

  getEditButton() {
    return cy.getByTestId('SheltersSection::editButton');
  }

  getAddShelterButton() {
    return cy.getByTestId('SheltersSection::addNewItemButton');
  }

  getAddNewShelterButton() {
    return cy.getByTestId('SheltersSection::addShelter');
  }

  getSaveButton() {
    return cy.getByTestId('SheltersSection::saveButton');
  }
}
