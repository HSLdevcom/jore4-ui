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

  getSaveButton() {
    return cy.getByTestId('SheltersSection::saveButton');
  }
}
