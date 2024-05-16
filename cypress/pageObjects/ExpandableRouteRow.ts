export class ExpandableRouteRow {
  getRouteHeaderRow(routeLabel: string) {
    return cy.getByTestId(`ExpandableRouteRow::${routeLabel}`);
  }

  toggleRouteSection(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel)
      .getByTestId('ExpandableRouteRow::toggleAccordion')
      .click();
  }

  getRouteName() {
    return cy.getByTestId('ExpandableRouteRow::name');
  }

  getRouteValidityPeriod(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel).findByTestId(
      'ExpandableRouteRow::validityPeriod',
    );
  }

  getEditRouteButton = (routeLabel: string) =>
    this.getRouteHeaderRow(routeLabel).findByTestId(
      'ExpandableRouteRow::editRouteButton',
    );
}
