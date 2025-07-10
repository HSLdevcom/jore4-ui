import { StopVersionForm } from './StopVersionForm';

export class EditValidityModal {
  form = new StopVersionForm();

  modal() {
    return cy.getByTestId('EditStopValidityModal::modal');
  }
}
