import { ErrorModalItem } from './ErrorModalItem';

export class ErrorModal {
  errorModalItem = new ErrorModalItem();

  getModal() {
    return cy.getByTestId('ErrorModal::modal');
  }

  getCloseButton() {
    return cy.getByTestId('ErrorModal::closeButton');
  }

  getCloseIconButton() {
    return cy.getByTestId('ErrorModal::closeIconButton');
  }
}
