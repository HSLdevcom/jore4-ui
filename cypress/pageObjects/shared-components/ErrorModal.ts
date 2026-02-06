import { ErrorModalItem } from './ErrorModalItem';

export class ErrorModal {
  static errorModalItem = ErrorModalItem;

  static getModal() {
    return cy.getByTestId('ErrorModal::modal');
  }

  static getCloseButton() {
    return cy.getByTestId('ErrorModal::closeButton');
  }

  static getCloseIconButton() {
    return cy.getByTestId('ErrorModal::closeIconButton');
  }
}
