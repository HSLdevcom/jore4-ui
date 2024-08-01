import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';

export class RouteRow {
  getRouteHeaderRow(routeLabel: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`RouteRow::${routeLabel}-${direction}`);
  }

  toggleRouteSection(routeLabel: string, direction: RouteDirectionEnum) {
    return this.getRouteHeaderRow(routeLabel, direction)
      .findByTestId('RouteRow::toggleAccordion')
      .click();
  }

  getRouteName() {
    return cy.getByTestId('RouteRow::name');
  }

  getRouteValidityPeriod(routeLabel: string, direction: RouteDirectionEnum) {
    return this.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'RouteRow::validityPeriod',
    );
  }

  getEditRouteButton = (routeLabel: string, direction: RouteDirectionEnum) =>
    this.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'RouteRow::editRouteButton',
    );
}
