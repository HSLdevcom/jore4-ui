export class MapFooterActionsDropdown {
  getMenu() {
    return cy.getByTestId('MapFooterActionsDropdown::menu');
  }

  getCreateNewTerminal() {
    return cy.getByTestId('MapFooterActionsDropdown::createNewTerminal');
  }

  getCreateNewStopArea() {
    return cy.getByTestId('MapFooterActionsDropdown::createNewStopArea');
  }
}
