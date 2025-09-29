import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import qs from 'qs';
import { expectGraphQLCallToSucceed } from '../utils/assertions';
import { StopPopUp } from './StopPopUp';

export interface ClickPointNearMapMarker {
  mapMarkerTestId: string;
  rightOffset: number;
  downOffset: number;
}

export class Map {
  stopPopUp = new StopPopUp();

  /**
   * Click on the map at specific MapLibre coordinates.
   * This method uses the global coordinatesToOnScreenPixels function to convert
   * geographic coordinates to screen pixels.
   *
   * @param longitude - The longitude coordinate
   * @param latitude - The latitude coordinate
   */
  clickAtCoordinates(longitude: number, latitude: number) {
    cy.window().then((win) => {
      if (!win.coordinatesToOnScreenPixels) {
        throw new Error(
          'coordinatesToOnScreenPixels function not available. Make sure the map is loaded.',
        );
      }
      const pixels = win.coordinatesToOnScreenPixels(longitude, latitude);
      cy.getByTestId('mapPage').click(pixels.x, pixels.y);
    });
  }

  zoomIn(n = 1) {
    Cypress._.times(n, (iteration) => {
      cy.get('button[class*="maplibregl-ctrl-zoom-in"]').click();

      if (iteration < n) {
        // The zoom in action takes some time to settle down.
        // The Map component ignores zoom actions if they are triggered
        // while the map is still displaying the animation from the previous
        // action.

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000);
      }
    });
    this.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlGetMapStops');
    expectGraphQLCallToSucceed('@gqlGetStopAreasByLocation');
  }

  getNthMarker(markerNumber: number, options?: Partial<Cypress.Timeoutable>) {
    return cy
      .get(`.overlays>.mapboxgl-marker:nth-of-type(${markerNumber})`, options)
      .first();
  }

  /** Clicks position relative to stopMarker. So this uses given stopMarker
   * as origin and then adds 'right' to x coordinate and 'down' to y coordinates
   * and clicks that position. You can go left and up by giving negative numbers. */
  clickAtPositionFromMapMarkerByTestId(clickPoint: ClickPointNearMapMarker) {
    cy.getByTestId(clickPoint.mapMarkerTestId).then((mark) => {
      const { x } = mark[0].getBoundingClientRect();
      const { y } = mark[0].getBoundingClientRect();
      cy.getByTestId('mapPage').click(
        x + clickPoint.rightOffset,
        y + clickPoint.downOffset,
      );
    });
  }

  clickAtPosition(x: number, y: number) {
    cy.getByTestId('mapPage').click(x, y);
  }

  getNthSnappingPointHandle(nth: number) {
    return cy.get(`rect[data-index="${nth}"]`).first();
  }

  clickNthSnappingPointHandle(nth: number) {
    this.getNthSnappingPointHandle(nth).click();
  }

  clickRelativePoint(xPercentage: number, yPercentage: number) {
    cy.window().then((window) => {
      const x = (window.innerWidth / 100) * xPercentage;
      const y = (window.innerHeight / 100) * yPercentage;
      cy.getByTestId('mapPage').click(x, y);
    });
  }

  getStopByStopLabelAndPriority(testStopLabel: string, priority: Priority) {
    return cy.getByTestId(
      `Map::Stops::stopMarker::${testStopLabel}_${Priority[priority]}`,
    );
  }

  getMemberStop(testStopLabel: string) {
    return cy.getByTestId(`Map::Stops::memberStop::${testStopLabel}`);
  }

  getStopAreaById(id: string) {
    return cy.getByTestId(`Map::StopArea::stopArea::${id}`);
  }

  getTerminalById(id: string) {
    return cy.getByTestId(`Map::MapTerminal::terminal::${id}`);
  }

  visit(params?: { zoom?: number; lat: number; lng: number }) {
    if (params) {
      cy.visit(
        `/map?${qs.stringify({
          zoom: params.zoom ?? 13, // 13 is default zoom level
          latitude: params.lat,
          longitude: params.lng,
        })}`,
      );
      this.waitForLoadToComplete();
      return;
    }
    cy.visit('/map');
    this.waitForLoadToComplete();
  }

  getLoader() {
    return cy.getByTestId('MapLoader::loader');
  }

  waitForLoadToComplete() {
    return this.getLoader().should('not.exist');
  }

  getMapPage() {
    return cy.getByTestId('mapPage');
  }

  // Route editor handle needs to exist in start coordinate
  moveRouteEditorHandleByCoordinates = (coordinates: {
    start: { longitude: number; latitude: number };
    destination: { longitude: number; latitude: number };
  }) => {
    cy.window().then((win) => {
      if (!win.coordinatesToOnScreenPixels) {
        throw new Error(
          'coordinatesToOnScreenPixels function not available. Make sure the map is loaded.',
        );
      }

      const startPixels = win.coordinatesToOnScreenPixels(
        coordinates.start.longitude,
        coordinates.start.latitude,
      );
      const destPixels = win.coordinatesToOnScreenPixels(
        coordinates.destination.longitude,
        coordinates.destination.latitude,
      );

      // Focus canvas before triggering mouse events
      // Cypress mousedown event doesn't focus map when triggering
      cy.get('canvas.maplibregl-canvas').focus();
      this.getMapPage().trigger('mousedown', {
        button: 1,
        buttons: 1,
        x: startPixels.x,
        y: startPixels.y,
        eventConstructor: 'MouseEvent',
      });
      this.getMapPage().trigger('mousemove', {
        button: 1,
        buttons: 1,
        x: destPixels.x,
        y: destPixels.y,
        eventConstructor: 'MouseEvent',
      });
      this.getMapPage().trigger('mouseup', {
        button: 1,
        buttons: 1,
        x: destPixels.x,
        y: destPixels.y,
        eventConstructor: 'MouseEvent',
      });
    });
  };
}
