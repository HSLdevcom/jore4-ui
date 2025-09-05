export class TerminalInfoSpotsViewList {
  getTable = () => cy.getByTestId('TerminalInfoSpotsViewList::table');

  getTableContent = () =>
    cy.getByTestId('TerminalInfoSpotsViewList::tableContent');

  getSortButton = (column: string) =>
    cy.getByTestId(`TerminalInfoSpotsViewList::sortButton::${column}`);

  getLabelSortButton = () => this.getSortButton('label');

  getStopSortButton = () => this.getSortButton('stop');

  getShelterSortButton = () => this.getSortButton('shelter');

  getPurposeSortButton = () => this.getSortButton('purpose');

  getSizeSortButton = () => this.getSortButton('size');

  getDescriptionSortButton = () => this.getSortButton('description');
}
