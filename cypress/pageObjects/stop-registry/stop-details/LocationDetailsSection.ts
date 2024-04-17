import { LocationDetailsForm } from './LocationDetailsForm';
import { LocationDetailsViewCard } from './LocationDetailsViewCard';

export class LocationDetailsSection {
  form = new LocationDetailsForm();

  viewCard = new LocationDetailsViewCard();

  getEditButton() {
    return cy.getByTestId('LocationDetailsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('LocationDetailsSection::saveButton');
  }
}
