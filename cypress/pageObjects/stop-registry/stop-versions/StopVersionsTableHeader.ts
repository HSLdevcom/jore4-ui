import Chainable = Cypress.Chainable;

// Same as on actual UI code side.
export type StopVersionTableColumn =
  | 'STATUS'
  | 'VALIDITY_START'
  | 'VALIDITY_END'
  | 'VERSION_COMMENT'
  | 'CHANGED'
  | 'CHANGED_BY';

// Lowercased so we can compare the values directly to aria-sort attribute
type AriaSortOrder = 'ascending' | 'descending';

export class StopVersionsTableHeader {
  changed = () => cy.getByTestId('StopVersionTableHeaderSortableCell::changed');

  changedBy = () =>
    cy.getByTestId('StopVersionTableHeaderSortableCell::changed_by');

  status = () => cy.getByTestId('StopVersionTableHeaderSortableCell::status');

  validityEnd = () =>
    cy.getByTestId('StopVersionTableHeaderSortableCell::validity_end');

  validityStart = () =>
    cy.getByTestId('StopVersionTableHeaderSortableCell::validity_start');

  versionComment = () =>
    cy.getByTestId('StopVersionTableHeaderSortableCell::version_comment');

  sortButton = () =>
    cy.getByTestId('StopVersionTableHeaderSortableCell::sortButton');

  setSorting = (sortBy: StopVersionTableColumn, sortOrder: AriaSortOrder) =>
    this.toggleSortOnTh(this.getThByTableColumn(sortBy), sortOrder);

  private getThByTableColumn = (column: StopVersionTableColumn) => {
    switch (column) {
      case 'STATUS':
        return this.status();

      case 'VALIDITY_START':
        return this.validityStart();

      case 'VALIDITY_END':
        return this.validityEnd();

      case 'VERSION_COMMENT':
        return this.versionComment();

      case 'CHANGED':
        return this.changed();

      case 'CHANGED_BY':
        return this.changedBy();

      default:
        throw new Error(`Unknown Sort column: ${column}`);
    }
  };

  private toggleSortOnTh(column: Chainable<JQuery>, sortOrder: AriaSortOrder) {
    column.then(($th) => {
      let attributeOnTh = $th.attr('aria-sort');

      // If not set → Sorting is on another column → Click
      if (attributeOnTh === undefined) {
        column.within(() => this.sortButton().click());
        attributeOnTh = $th.attr('aria-sort');
      }

      // Sorted on correct column, but direction might be wrong → Click
      if (attributeOnTh !== sortOrder) {
        column.within(() => this.sortButton().click());
      }
    });

    return column;
  }
}
