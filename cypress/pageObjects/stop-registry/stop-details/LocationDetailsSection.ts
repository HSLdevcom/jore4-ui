import { LocationDetailsForm } from './LocationDetailsForm';
import { LocationDetailsViewCard } from './LocationDetailsViewCard';

export class LocationDetailsSection {
  static form = LocationDetailsForm;

  static viewCard = LocationDetailsViewCard;

  static getEditButton() {
    return cy.getByTestId('LocationDetailsSection::editButton');
  }

  static getSaveButton() {
    return cy.getByTestId('LocationDetailsSection::saveButton');
  }
}
