type SortingDirections = 'asc' | 'desc' | 'groupOnly';

export class SortByButton {
  static getButton(sortBy: string) {
    return cy.getByTestId(`SortByButton::${sortBy}`);
  }

  static getActive() {
    return cy.get("[data-element-type='SortByButton'][data-is-active='true']");
  }

  static assertSortBy(sortBy: string) {
    return SortByButton.getActive().should(
      'have.attr',
      'data-testid',
      `SortByButton::${sortBy}`,
    );
  }

  static assertSortDirection(direction: SortingDirections) {
    return SortByButton.getActive().should(
      'have.attr',
      'data-sort-direction',
      direction,
    );
  }

  static assertSorting(sortBy: string, direction: SortingDirections) {
    SortByButton.assertSortBy(sortBy);
    SortByButton.assertSortDirection(direction);
  }
}
