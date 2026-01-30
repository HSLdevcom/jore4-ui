import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { RouteStopsOverlayRow } from './RouteStopsOverlayRow';

export class RouteStopsOverlay {
  static routeStopsOverlayRow = RouteStopsOverlayRow;

  static getRouteStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::label::${stopLabel}`);
  }

  static getHeader() {
    return cy.getByTestId('RouteStopsOverlay::mapOverlayHeader');
  }

  static getRouteStopsOverlayRows() {
    return cy.getByTestId('RouteStopsOverlayRow');
  }

  static getNthRouteStopsOverlayRow(nth: number) {
    return this.getRouteStopsOverlayRows().eq(nth);
  }

  static getRouteStopRowMenu(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::${stopLabel}::menu`);
  }

  static getRouteStopListHeader(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(
      `RouteStopsOverlay::routeStopListHeader::${label}-${direction}`,
    );
  }

  static stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      RouteStopsOverlay.getRouteStopRow(label).should('not.exist');
    });
  }

  static stopsShouldBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      RouteStopsOverlay.getRouteStopRow(label).should('exist');
    });
  }

  static assertRouteStopCount(expectedCount: number) {
    return cy
      .get('[data-testid^="RouteStopsOverlayRow::label"')
      .should('have.length', expectedCount);
  }
}
