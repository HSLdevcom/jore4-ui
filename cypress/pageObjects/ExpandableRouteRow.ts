import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export class ExpandableRouteRow {
  getRouteHeaderRow(routeLabel: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`ExpandableRouteRow::${routeLabel}-${direction}`);
  }

  toggleRouteSection(routeLabel: string, direction: RouteDirectionEnum) {
    return this.getRouteHeaderRow(routeLabel, direction)
      .findByTestId('ExpandableRouteRow::toggleAccordion')
      .click();
  }

  getRouteName() {
    return cy.getByTestId('ExpandableRouteRow::name');
  }

  getRouteValidityPeriod(routeLabel: string, direction: RouteDirectionEnum) {
    return this.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'ExpandableRouteRow::validityPeriod',
    );
  }

  getEditRouteButton = (routeLabel: string, direction: RouteDirectionEnum) =>
    this.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'ExpandableRouteRow::editRouteButton',
    );
}
