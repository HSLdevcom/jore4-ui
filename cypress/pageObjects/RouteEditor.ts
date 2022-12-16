import '@4tw/cypress-drag-drop';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { Toast } from './Toast';

export interface MoveRouteEditHandleInfo {
  handleIndex: number;
  deltaX: number;
  deltaY: number;
}

export class RouteEditor {
  map = new Map();

  mapFooter = new MapFooter();

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

  getRouteDashedLine() {
    // Locator matches multiple elements, but we need only one of them to be able to click the route.
    return cy.get('[data-type="feature"]').eq(1);
  }

  moveRouteEditHandle(values: MoveRouteEditHandleInfo) {
    this.map.getNthSnappingPointHandle(values.handleIndex).move(values);
  }

  /**
   * Starts the route editing process, moves one editHandle by the given offset
   * and saves the route.
   * @example const moveHandleInfo: MoveRouteEditHandleInfo =
   * { handleIndex: 2, deltaX: 10, deltaY: -90}
   * editOneRoutePoint(moveHandleInfo)
   */
  editOneRoutePoint(values: MoveRouteEditHandleInfo) {
    this.mapFooter.editRoute();
    this.map.getLoader().should('not.exist');
    this.getRouteDashedLine().click();
    this.moveRouteEditHandle(values);
    this.map.getLoader().should('not.exist');
    this.mapFooter.save();
  }
}
