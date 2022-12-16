import '@4tw/cypress-drag-drop';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { Toast } from './Toast';

export class RouteEditor {
  map = new Map();

  mapFooter = new MapFooter();

  routeStopsOverlay = new RouteStopsOverlay();

  toast = new Toast();

  gqlRouteShouldBeCreatedSuccessfully() {
    return cy
      .wait('@gqlInsertRouteOne')
      .its('response.statusCode')
      .should('equal', 200);
  }

  checkRouteSubmitSuccessToast() {
    this.toast.checkSuccessToastHasMessage('Reitti tallennettu');
  }

  checkRouteSubmitFailureToast() {
    this.toast.checkDangerToastHasMessage('Tallennus epäonnistui');
  }

  // Locator matches multiple elements, but we need only one of them to be able to click the route.
  getRouteDashedLine() {
    return cy.get('[data-type="feature"]').eq(1);
  }

  moveRouteEditHandle(handleNumber: number, xPixels: number, yPixels: number) {
    this.map
      .getNthSnappingPointHandle(handleNumber)
      .move({ deltaX: xPixels, deltaY: yPixels, force: true });
  }

  editOneRoutePoint(handleNumber: number, xPixels: number, yPixels: number) {
    this.mapFooter.editRoute();
    this.map.getLoader().should('not.exist');
    this.getRouteDashedLine().click();
    this.moveRouteEditHandle(handleNumber, xPixels, yPixels);
    this.map.getLoader().should('not.exist');
    this.mapFooter.save();
  }
}
