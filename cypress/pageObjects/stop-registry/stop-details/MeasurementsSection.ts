import { MeasurementsForm } from './MeasurementsForm';
import { MeasurementsViewCard } from './MeasurementsViewCard';

export class MeasurementsSection {
  form = new MeasurementsForm();

  viewCard = new MeasurementsViewCard();

  getAccessibilityLevel() {
    return cy.getByTestId('AccessibilityLevelInfo::accessibilityLevel');
  }

  getEditButton() {
    return cy.getByTestId('MeasurementsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('MeasurementsSection::saveButton');
  }
}
