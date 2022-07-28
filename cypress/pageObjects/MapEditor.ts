// This constant comes from ModalMap.tsx
const MAP_HEADER_HEIGHT = 64;

export class MapEditor {
  zoomIn() {
    cy.get('.mapboxgl-ctrl-zoom-in').click();
  }

  // Wait for a map marker to appear on the map
  waitForMapToLoad() {
    this.getNthMarker(1);
  }

  getNthMarker(markerNumber: number) {
    return cy
      .get(`.overlays>.mapboxgl-marker:nth-of-type(${markerNumber})`)
      .first();
  }

  /** This will click the route editor on a point that has
   *  given StopMarker as origin and then the xpos and ypos are added
   *
   *  This only works for route editing
   */
  clickAtPositionOnRouteEditorFromMapMarkerByTestId(
    xpos: number,
    ypos: number,
    testId: string,
  ) {
    cy.getByTestId(testId)
      .parent()
      .then((mark) => {
        const x = mark.position().left;

        // Map header heigth needs to be subtracted from the y coordinate
        // because we use the editors "internal" coordinates for the click
        // which does not include the header
        const y = mark.position().top - MAP_HEADER_HEIGHT;

        cy.get('#editor').click(x + xpos, y + ypos, {
          force: true,
        });
      });
  }

  /** This will click the Map canvas on a point that has
   * given StopMarker as origin and then xpos and ypos are added
   *
   * This does not work when clicking points for route.
   */
  clickAtPositionFromMapMarkerByTestId(
    xpos: number,
    ypos: number,
    testId: string,
  ) {
    cy.getByTestId(testId)
      .parent()
      .then((mark) => {
        const x = mark.position().left;

        // Map header heigth needs to be subtracted from the y coordinate
        // because we use the editors "internal" coordinates for the click
        // which does not include the header
        const y = mark.position().top - MAP_HEADER_HEIGHT;

        cy.get('canvas').click(x + xpos, y + ypos, {
          force: true,
        });
      });
  }

  clickNthCreatedRectangle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }
}
