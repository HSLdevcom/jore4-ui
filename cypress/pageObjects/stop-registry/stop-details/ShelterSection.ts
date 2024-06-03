import { ShelterViewCard } from './ShelterViewCard';

export class SheltersSection {
  viewCard = new ShelterViewCard();

  getEditButton() {
    return cy.getByTestId('SheltersSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('SheltersSection::saveButton');
  }
}
