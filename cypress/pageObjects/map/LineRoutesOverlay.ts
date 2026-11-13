import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export class LineRoutesOverlay {
  static getOverlay() {
    return cy.getByTestId('LineRoutesOverlay');
  }

  static getHeader() {
    return cy.getByTestId('LineRoutesOverlay::mapOverlayHeader');
  }

  static getLineLink() {
    return cy.getByTestId('LineRoutesOverlay::lineLink');
  }

  static getRouteRow(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`LineRouteRow::${label}-${direction}`);
  }

  static getRouteRowToggle(label: string, direction: RouteDirectionEnum) {
    return LineRoutesOverlay.getRouteRow(label, direction).find(
      'button[aria-expanded]',
    );
  }

  static getRouteRows() {
    return cy.get(
      '[data-testid^="LineRouteRow::"]:not([data-testid*="::visibility::"])',
    );
  }

  static getVisibilitySwitch(label: string, direction: RouteDirectionEnum) {
    return cy.getByTestId(`LineRouteRow::visibility::${label}-${direction}`);
  }
}
