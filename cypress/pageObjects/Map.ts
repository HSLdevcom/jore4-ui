import { Priority } from '@hsl/jore4-test-db-manager';
import qs from 'qs';
import { StopPopUp } from './StopPopUp';

export interface ClickPointNearMapMarker {
  mapMarkerTestId: string;
  rightOffset: number;
  downOffset: number;
}

export class Map {
  stopPopUp = new StopPopUp();

  zoomIn() {
    cy.get('.mapboxgl-ctrl-zoom-in').click();
  }

  // Wait for a map marker to appear on the map
  // This might take long as we need many HTTP requests to initialize the map view
  waitForMapToLoad() {
    this.getNthMarker(1, { timeout: 20000 });
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
      cy.getByTestId('modalMap').click(
        x + clickPoint.rightOffset,
        y + clickPoint.downOffset,
      );
    });
  }

  clickAtPosition(x: number, y: number) {
    cy.getByTestId('modalMap').click(x, y);
  }

  clickNthSnappingPointHandle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }

  clickRelativePoint(xPercentage: number, yPercentage: number) {
    const x = (Cypress.config('viewportWidth') / 100) * xPercentage;
    const y = (Cypress.config('viewportHeight') / 100) * yPercentage;
    cy.getByTestId('modalMap').click(x, y);
  }

  getStopByStopLabelAndPriority(testStopLabel: string, priority: Priority) {
    return cy.getByTestId(
      `Map::Stops::stopMarker::${testStopLabel}_${Priority[priority]}`,
    );
  }

  visit(params?: { zoom?: number; lat: number; lng: number }) {
    if (params) {
      return cy.visit(
        `/routes?${qs.stringify({
          z: params.zoom || 13, // 13 is default zoom level
          mapOpen: true,
          lat: params.lat,
          lng: params.lng,
        })}`,
      );
    }
    return cy.visit('/routes?mapOpen=true');
  }

  getLoader() {
    return cy.getByTestId('MapLoader::loader');
  }
}
