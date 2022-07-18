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

  clickAtPositionFromMapMarkerByTestId(
    xpos: number,
    ypos: number,
    testId: string,
  ) {
    cy.get('#editor').then((editor) => {
      cy.getByTestId(testId).then((mark) => {
        // Because we are clicking the editor, we need to subtract the editors coordinates
        // from the markers coordinates to get the correct coordinate
        const x =
          mark[0].getBoundingClientRect().x -
          editor[0].getBoundingClientRect().x;
        const y =
          mark[0].getBoundingClientRect().y -
          editor[0].getBoundingClientRect().y;

        cy.get('#editor').click(x + xpos, y + ypos, { force: true });
      });
    });
  }

  clickNthSnappingPointHandle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }
}
