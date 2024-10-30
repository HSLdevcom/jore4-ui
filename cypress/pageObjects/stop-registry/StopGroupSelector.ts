export class StopGroupSelector {
  getGroupSelectors() {
    return cy.get('[data-group-id][data-visible="true"]');
  }

  getShowAllGroupsButton() {
    return cy.getByTestId('StopGroupSelector::showAllButton');
  }

  getShowLessGroupsButton() {
    return cy.getByTestId('StopGroupSelector::showLessButton');
  }

  shouldHaveGroups(groups: ReadonlyArray<string>) {
    const shouldHaveLength = this.getGroupSelectors().should(
      'have.length',
      groups.length,
    );

    groups.reduce(
      (should, group) => should.and('contain', group),
      shouldHaveLength,
    );
  }
}
