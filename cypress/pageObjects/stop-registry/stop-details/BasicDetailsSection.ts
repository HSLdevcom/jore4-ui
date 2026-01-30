import { BasicDetailsForm } from './BasicDetailsForm';
import { BasicDetailsViewCard } from './BasicDetailsViewCard';

export class BasicDetailsSection {
  static form = BasicDetailsForm;

  static viewCard = BasicDetailsViewCard;

  static getEditButton = () =>
    cy.getByTestId('BasicDetailsSection::editButton');

  static getSaveButton = () =>
    cy.getByTestId('BasicDetailsSection::saveButton');
}
