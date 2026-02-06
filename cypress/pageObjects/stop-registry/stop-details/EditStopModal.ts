import { StopVersionForm } from './StopVersionForm';

export class EditStopModal {
  static form = StopVersionForm;

  static modal() {
    return cy.getByTestId('EditStopModal::modal');
  }
}
