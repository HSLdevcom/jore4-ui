function positionStringToCoordinates(value: string | null) {
  const matcher = /translate\((\d+)px, (\d+)px\)/;
  if (value) {
    const position = value.match(matcher)?.slice(1);
    if (position != null && position.length > 1) {
      return { x: +position[0], y: +position[1] };
    }
  }
  return { x: 0, y: 0 };
}

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
    this.getNthMarker(markerNumber).then((mark) => {
      const position = positionStringToCoordinates(
        mark[0].getAttribute('style'),
      );
      cy.get('#editor').click(position.x + xpos, position.y + ypos, {
        force: true,
      });
    });
  }

  clickNthCreatedRectangle(nth: number) {
    cy.get(`rect[data-index="${nth}"]`).first().click({ force: true });
  }
}
