import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DirectionBadge } from '../shared-components';

export class RouteRow {
  static directionBadge = DirectionBadge;

  static getRouteHeaderRow(routeLabel: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`RouteRow::${routeLabel}-${direction}`);
  }

  static getToggleAccordionButton() {
    return cy.getByTestId('RouteRow::toggleAccordion');
  }

  static getRouteName() {
    return cy.getByTestId('RouteRow::name');
  }

  static getRouteValidityPeriod(
    routeLabel: string,
    direction: RouteDirectionEnum,
  ) {
    return RouteRow.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'RouteRow::validityPeriod',
    );
  }

  static getEditRouteButton = (
    routeLabel: string,
    direction: RouteDirectionEnum,
  ) =>
    RouteRow.getRouteHeaderRow(routeLabel, direction).findByTestId(
      'RouteRow::editRouteButton',
    );
}
