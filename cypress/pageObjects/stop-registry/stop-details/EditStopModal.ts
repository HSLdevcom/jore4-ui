import { StopVersionForm } from './StopVersionForm';

export class EditStopModal {
  form = new StopVersionForm();

  modal() {
    return cy.getByTestId('EditStopModal::modal');
  }
}
