import { LocationDetailsViewCard } from './LocationDetailsViewCard';

export class LocationDetailsSection {
  viewCard = new LocationDetailsViewCard();

  getEditButton() {
    return cy.getByTestId('LocationDetailsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('LocationDetailsSection::saveButton');
  }
}
