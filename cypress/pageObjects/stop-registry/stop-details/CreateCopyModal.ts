import { StopVersionForm } from './StopVersionForm';

export class CreateCopyModal {
  static form = StopVersionForm;

  static modal() {
    return cy.getByTestId('CopyStopModal::modal');
  }

  static names() {
    return cy.getByTestId('CopyStopModal::names');
  }

  static validity() {
    return cy.getByTestId('CopyStopModal::validity');
  }
}
