import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { RouteStopsOverlayRow } from './RouteStopsOverlayRow';

export class RouteStopsOverlay {
  routeStopsOverlayRow = new RouteStopsOverlayRow();

  getRouteStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::label::${stopLabel}`);
  }

  getHeader() {
    return cy.getByTestId('RouteStopsOverlay::mapOverlayHeader');
  }

  getRouteStopsOverlayRows() {
    return cy.getByTestId('RouteStopsOverlayRow');
  }

  getNthRouteStopsOverlayRow(nth: number) {
    return this.getRouteStopsOverlayRows().eq(nth);
  }

  getRouteStopRowMenu(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::${stopLabel}::menu`);
  }

  getRouteStopListHeader(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(
      `RouteStopsOverlay::routeStopListHeader::${label}-${direction}`,
    );
  }

  stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRow(label).should('not.exist');
    });
  }

  stopsShouldBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRow(label).should('exist');
    });
  }

  assertRouteStopCount(expectedCount: number) {
    return cy
      .get('[data-testid^="RouteStopsOverlayRow::label"')
      .should('have.length', expectedCount);
  }
}
