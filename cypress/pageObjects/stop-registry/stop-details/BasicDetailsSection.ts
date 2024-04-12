import { BasicDetailsForm } from './BasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';

export class BasicDetailsSection {
  form = new BasicDetailsForm();

  viewCard = new BasicDetailsViewCard();

  getEditButton = () => cy.getByTestId('BasicDetailsSection::editButton');

  getSaveButton = () => cy.getByTestId('BasicDetailsSection::saveButton');
}
