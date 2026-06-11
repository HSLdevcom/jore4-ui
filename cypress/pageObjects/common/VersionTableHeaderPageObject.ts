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
 * Base class for version table header page objects with common functionality
 */
export abstract class VersionTableHeaderBase {
  protected abstract headerTestIdPrefix: string;

  changed(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::changed`);
  }

  changedBy(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::changed_by`);
  }

  status(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::status`);
  }

  validityEnd(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::validity_end`);
  }

  validityStart(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::validity_start`);
  }

  versionComment(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::version_comment`);
  }

  sortButton(): Chainable<JQuery> {
    return cy.getByTestId(`${this.headerTestIdPrefix}::sortButton`);
  }

  setSorting(
    sortBy: VersionTableColumn,
    sortOrder: AriaSortOrder,
  ): Chainable<JQuery> {
    return this.toggleSortOnTh(this.getThByTableColumn(sortBy), sortOrder);
  }

  getThByTableColumn(column: VersionTableColumn): Chainable<JQuery> {
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

  toggleSortOnTh(
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
}
