import { StopVersionForm } from './StopVersionForm';

export class CreateCopyModal {
  form = new StopVersionForm();

  modal() {
    return cy.getByTestId('CopyStopModal::modal');
  }

  names() {
    return cy.getByTestId('CopyStopModal::names');
  }

  validity() {
    return cy.getByTestId('CopyStopModal::validity');
  }
}
