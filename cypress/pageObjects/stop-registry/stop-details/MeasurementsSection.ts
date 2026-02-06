import { MeasurementsForm } from './MeasurementsForm';
import { MeasurementsViewCard } from './MeasurementsViewCard';

export class MeasurementsSection {
  static form = MeasurementsForm;

  static viewCard = MeasurementsViewCard;

  static getAccessibilityLevel() {
    return cy.getByTestId('AccessibilityLevelInfo::accessibilityLevel');
  }

  static getEditButton() {
    return cy.getByTestId('MeasurementsSection::editButton');
  }

  static getSaveButton() {
    return cy.getByTestId('MeasurementsSection::saveButton');
  }
}
