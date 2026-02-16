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
  static changed() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::changed');
  }

  changed = () => StopVersionsTableHeader.changed();

  static changedBy() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::changed_by');
  }

  changedBy = () => StopVersionsTableHeader.changedBy();

  static status() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::status');
  }

  status = () => StopVersionsTableHeader.status();

  static validityEnd() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::validity_end');
  }

  validityEnd = () => StopVersionsTableHeader.validityEnd();

  static validityStart() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::validity_start');
  }

  validityStart = () => StopVersionsTableHeader.validityStart();

  static versionComment() {
    return cy.getByTestId(
      'StopVersionTableHeaderSortableCell::version_comment',
    );
  }

  versionComment = () => StopVersionsTableHeader.versionComment();

  static sortButton() {
    return cy.getByTestId('StopVersionTableHeaderSortableCell::sortButton');
  }

  sortButton = () => StopVersionsTableHeader.sortButton();

  static setSorting(sortBy: StopVersionTableColumn, sortOrder: AriaSortOrder) {
    return this.toggleSortOnTh(this.getThByTableColumn(sortBy), sortOrder);
  }

  setSorting = (sortBy: StopVersionTableColumn, sortOrder: AriaSortOrder) =>
    StopVersionsTableHeader.setSorting(sortBy, sortOrder);

  private static getThByTableColumn(column: StopVersionTableColumn) {
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
  }

  private static toggleSortOnTh(
    column: Chainable<JQuery>,
    sortOrder: AriaSortOrder,
  ) {
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
