export class TerminalInfoSpotRow {
  static getIdAndQuayCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::idAndQuayCell');

  static getLabelCell = () => cy.getByTestId('TerminalInfoSpotRow::labelCell');

  static getEditButton = () =>
    cy.getByTestId('TerminalInfoSpotRow::editButton');

  static getQuayPublicCodeCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::quayPublicCodeCell');

  static getShelterNumberCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::shelterNumberCell');

  static getPurposeCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::purposeCell');

  static getSizeCell = () => cy.getByTestId('TerminalInfoSpotRow::sizeCell');

  static getDescriptionCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::descriptionCell');

  static getActionCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::actionCell');

  static getToggleButton = () => cy.getByTestId('TerminalInfoSpotRow::toggle');

  static getNthToggleButton = (index: number) =>
    TerminalInfoSpotRow.getToggleButton().eq(index);

  static getDetailsRow = () =>
    cy.getByTestId('TerminalInfoSpotRow::detailsRow');

  static getNthDetailsRow = (index: number) =>
    TerminalInfoSpotRow.getDetailsRow().eq(index);

  static getSaveButton = () =>
    cy.getByTestId('TerminalInfoSpotRow::saveButton');

  static getCancelButton = () =>
    cy.getByTestId('TerminalInfoSpotRow::cancelButton');
}
