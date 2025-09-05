export class TerminalInfoSpotRow {
  getIdAndQuayCell = () => cy.getByTestId('TerminalInfoSpotRow::idAndQuayCell');

  getLabelCell = () => cy.getByTestId('TerminalInfoSpotRow::labelCell');

  getEditButton = () => cy.getByTestId('TerminalInfoSpotRow::editButton');

  getQuayPublicCodeCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::quayPublicCodeCell');

  getShelterNumberCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::shelterNumberCell');

  getPurposeCell = () => cy.getByTestId('TerminalInfoSpotRow::purposeCell');

  getSizeCell = () => cy.getByTestId('TerminalInfoSpotRow::sizeCell');

  getDescriptionCell = () =>
    cy.getByTestId('TerminalInfoSpotRow::descriptionCell');

  getActionCell = () => cy.getByTestId('TerminalInfoSpotRow::actionCell');

  getToggleButton = () => cy.getByTestId('TerminalInfoSpotRow::toggle');

  getNthToggleButton = (index: number) => this.getToggleButton().eq(index);

  getDetailsRow = () => cy.getByTestId('TerminalInfoSpotRow::detailsRow');

  getNthDetailsRow = (index: number) => this.getDetailsRow().eq(index);

  getSaveButton = () => cy.getByTestId('TerminalInfoSpotRow::saveButton');

  getCancelButton = () => cy.getByTestId('TerminalInfoSpotRow::cancelButton');
}
