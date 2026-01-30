export class StopTitleRow {
  static label() {
    return cy.getByTestId('StopTitleRow::label');
  }

  static names() {
    return cy.getByTestId('StopTitleRow::names');
  }

  static openOnMapButton() {
    return cy.getByTestId('StopTitleRow::StopTitleRow::openOnMapButton');
  }

  static actionsMenuButton() {
    return cy.getByTestId('StopTitleRow::extraActions::menu');
  }

  static actionsMenuCopyButton() {
    return cy.getByTestId('StopTitleRow::extraActions::copy');
  }
}
