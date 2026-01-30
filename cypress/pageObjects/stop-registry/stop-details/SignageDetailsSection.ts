import { SignageDetailsForm } from './SignageDetailsForm';
import { SignageDetailsViewCard } from './SignageDetailsViewCard';

export class SignageDetailsSection {
  static form = SignageDetailsForm;

  static viewCard = SignageDetailsViewCard;

  static getEditButton() {
    return cy.getByTestId('SignageDetailsSection::editButton');
  }

  static getSaveButton() {
    return cy.getByTestId('SignageDetailsSection::saveButton');
  }
}
