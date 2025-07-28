export class TitleRow {
  label() {
    return cy.getByTestId('StopTitleRow::label');
  }

  names() {
    return cy.getByTestId('StopTitleRow::names');
  }

  openOnMapButton() {
    return cy.getByTestId('StopTitleRow::StopTitleRow::openOnMapButton');
  }

  actionsMenuButton() {
    return cy.getByTestId('StopTitleRow::extraActions::menu');
  }

  actionsMenuCopyButton() {
    return cy.getByTestId('StopTitleRow::extraActions::copy');
  }
}
