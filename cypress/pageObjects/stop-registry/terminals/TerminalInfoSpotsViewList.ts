export class TerminalInfoSpotsViewList {
  static getTable = () => cy.getByTestId('TerminalInfoSpotsViewList::table');

  static getTableContent = () =>
    cy.getByTestId('TerminalInfoSpotsViewList::tableContent');

  static getSortButton = (column: string) =>
    cy.getByTestId(`TerminalInfoSpotsViewList::sortButton::${column}`);

  static getLabelSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('label');

  static getStopSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('stop');

  static getShelterSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('shelter');

  static getPurposeSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('purpose');

  static getSizeSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('size');

  static getDescriptionSortButton = () =>
    TerminalInfoSpotsViewList.getSortButton('description');
}
