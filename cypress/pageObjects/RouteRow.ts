import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DirectionBadge } from './DirectionBadge';

export class RouteRow {
  directionBadge = new DirectionBadge();

  getRouteHeaderRow(routeLabel: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`RouteRow::${routeLabel}-${direction}`);
  }

  getToggleAccordionButton() {
    return cy.getByTestId('RouteRow::toggleAccordion');
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
