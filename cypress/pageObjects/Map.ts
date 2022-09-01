export interface ClickPointNearMapMarker {
  mapMarkerTestId: string;
  rightOffset: number;
  downOffset: number;
}

export class Map {
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

  clickNthSnappingPointHandle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }
}
