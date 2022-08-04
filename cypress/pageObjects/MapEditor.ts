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

  // Uses css indexing which starts from 1
  clickAtPositionFromNthMapMarker(
    xpos: number,
    ypos: number,
    markerNumber: number,
  ) {
    this.getNthMarker(markerNumber).then((marker) => {
      // returns the coords of the top-left corner within the parent #editor element
      const position = marker.position();
      cy.get('#editor').click(position.left + xpos, position.top + ypos, {
        force: true,
      });
    });
  }

  clickNthSnappingPointHandle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }
}
