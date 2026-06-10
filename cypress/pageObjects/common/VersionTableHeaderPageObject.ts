import Chainable = Cypress.Chainable;

export type VersionTableColumn =
  | 'STATUS'
  | 'VALIDITY_START'
  | 'VALIDITY_END'
  | 'VERSION_COMMENT'
  | 'CHANGED'
  | 'CHANGED_BY';

type AriaSortOrder = 'ascending' | 'descending';

/**
 * Factory function to create a version table header page object with a specific test ID prefix
 */
export function createVersionTableHeaderPageObject(testIdPrefix: string) {
  return class VersionTableHeader {
    static changed() {
      return cy.getByTestId(`${testIdPrefix}::changed`);
    }

    changed = () => VersionTableHeader.changed();

    static changedBy() {
      return cy.getByTestId(`${testIdPrefix}::changed_by`);
    }

    changedBy = () => VersionTableHeader.changedBy();

    static status() {
      return cy.getByTestId(`${testIdPrefix}::status`);
    }

    status = () => VersionTableHeader.status();

    static validityEnd() {
      return cy.getByTestId(`${testIdPrefix}::validity_end`);
    }

    validityEnd = () => VersionTableHeader.validityEnd();

    static validityStart() {
      return cy.getByTestId(`${testIdPrefix}::validity_start`);
    }

    validityStart = () => VersionTableHeader.validityStart();

    static versionComment() {
      return cy.getByTestId(`${testIdPrefix}::version_comment`);
    }

    versionComment = () => VersionTableHeader.versionComment();

    static sortButton() {
      return cy.getByTestId(`${testIdPrefix}::sortButton`);
    }

    sortButton = () => VersionTableHeader.sortButton();

    static setSorting(
      sortBy: VersionTableColumn,
      sortOrder: AriaSortOrder,
    ): Chainable<JQuery> {
      return this.toggleSortOnTh(this.getThByTableColumn(sortBy), sortOrder);
    }

    setSorting = (sortBy: VersionTableColumn, sortOrder: AriaSortOrder) =>
      VersionTableHeader.setSorting(sortBy, sortOrder);

    static getThByTableColumn(column: VersionTableColumn): Chainable<JQuery> {
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

    static toggleSortOnTh(
      column: Chainable<JQuery>,
      sortOrder: AriaSortOrder,
    ): Chainable<JQuery> {
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
  };
}
