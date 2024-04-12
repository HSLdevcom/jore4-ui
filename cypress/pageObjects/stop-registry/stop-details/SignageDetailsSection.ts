import { SignageDetailsForm } from './SignageDetailsForm';
import { SignageDetailsViewCard } from './SignageDetailsViewCard';

export class SignageDetailsSection {
  form = new SignageDetailsForm();

  viewCard = new SignageDetailsViewCard();

  getEditButton() {
    return cy.getByTestId('SignageDetailsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('SignageDetailsSection::saveButton');
  }
}
