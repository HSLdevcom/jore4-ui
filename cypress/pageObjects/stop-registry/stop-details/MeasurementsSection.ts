import { MeasurementsForm } from './MeasurementsForm';
import { MeasurementsViewCard } from './MeasurementsViewCard';

export class MeasurementsSection {
  form = new MeasurementsForm();

  viewCard = new MeasurementsViewCard();

  getEditButton() {
    return cy.getByTestId('MeasurementsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('MeasurementsSection::saveButton');
  }
}