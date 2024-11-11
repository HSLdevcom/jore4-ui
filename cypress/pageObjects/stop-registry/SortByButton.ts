type SortingDirections = 'asc' | 'desc' | 'groupOnly';

export class SortByButton {
  getButton(sortBy: string) {
    return cy.getByTestId(`SortByButton::${sortBy}`);
  }

  getActive() {
    return cy.get("[data-element-type='SortByButton'][data-is-active='true']");
  }

  assertSortBy(sortBy: string) {
    return this.getActive().should(
      'have.attr',
      'data-testid',
      `SortByButton::${sortBy}`,
    );
  }

  assertSortDirection(direction: SortingDirections) {
    return this.getActive().should(
      'have.attr',
      'data-sort-direction',
      direction,
    );
  }

  assertSorting(sortBy: string, direction: SortingDirections) {
    this.assertSortBy(sortBy);
    this.assertSortDirection(direction);
  }
}
