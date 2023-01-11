import times from 'lodash/times';
import qs from 'qs';
import { StopPopUp } from './StopPopUp';

export interface ClickPointNearMapMarker {
  mapMarkerTestId: string;
  rightOffset: number;
  downOffset: number;
}

export class Map {
  stopPopUp = new StopPopUp();

  zoomIn(n = 1) {
    times(n, () => cy.getByTestId('modalMap').type('+'));
    this.getLoader().should('not.exist');
    cy.wait('@gqlGetStopsByLocation');
  }

  // Wait for a map marker to appear on the map
  // This might take long as we need many HTTP requests to initialize the map view
  waitForMapToLoad() {
    this.getNthMarker(1);
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

  getNthSnappingPointHandle(nth: number) {
    return cy.get(`rect[data-index="${nth}"]`).first();
  }

  clickNthSnappingPointHandle(nth: number) {
    this.getNthSnappingPointHandle(nth).click();
  }

  clickRelativePoint(xPercentage: number, yPercentage: number) {
    const x = (Cypress.config('viewportWidth') / 100) * xPercentage;
    const y = (Cypress.config('viewportHeight') / 100) * yPercentage;
    cy.getByTestId('modalMap').click(x, y);
  }

  getStopByStopLabel(testStopLabel: string) {
    return cy.getByTestId(`Map::Stops::stopMarker::${testStopLabel}_Standard`);
  }

  visit(params?: { zoom?: number; lat: number; lng: number }) {
    if (params) {
      cy.visit(
        `/routes?${qs.stringify({
          z: params.zoom || 13, // 13 is default zoom level
          mapOpen: true,
          lat: params.lat,
          lng: params.lng,
        })}`,
      );
      this.getLoader().should('not.exist');
      return;
    }
    cy.visit('/routes?mapOpen=true');
    this.getLoader().should('not.exist');
  }

  getLoader() {
    return cy.getByTestId('MapLoader::loader');
  }
}
