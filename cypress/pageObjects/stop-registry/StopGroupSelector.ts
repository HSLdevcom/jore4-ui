export class StopGroupSelector {
  static getGroupSelectors() {
    return cy.get('[data-group-id][data-visible="true"]');
  }

  static getShowAllGroupsButton() {
    return cy.getByTestId('StopGroupSelector::showAllButton');
  }

  static getShowLessGroupsButton() {
    return cy.getByTestId('StopGroupSelector::showLessButton');
  }

  static shouldHaveGroups(groups: ReadonlyArray<string>) {
    const shouldHaveLength = StopGroupSelector.getGroupSelectors().should(
      'have.length',
      groups.length,
    );

    groups.reduce(
      (should, group) => should.and('contain', group),
      shouldHaveLength,
    );
  }
}
