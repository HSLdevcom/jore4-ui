/**
 * Utility function to convert MapLibre coordinates to screen pixels using the global function
 * exposed by the map component.
 *
 * @param longitude - The longitude coordinate
 * @param latitude - The latitude coordinate
 * @returns A Cypress chainable that resolves to screen pixel coordinates {x, y}
 */
export function coordinatesToPixels(
  longitude: number,
  latitude: number,
): Cypress.Chainable<{ x: number; y: number }> {
  return cy.window().then((win) => {
    if (!win.coordinatesToOnScreenPixels) {
      throw new Error(
        'coordinatesToOnScreenPixels function not available. Make sure the map is loaded.',
      );
    }
    return win.coordinatesToOnScreenPixels(longitude, latitude);
  });
}

/**
 * Click on the map at the given MapLibre coordinates.
 *
 * @param longitude - The longitude coordinate
 * @param latitude - The latitude coordinate
 * @returns A Cypress chainable
 */
export function clickAtCoordinates(longitude: number, latitude: number) {
  return cy.window().then((win) => {
    if (!win.coordinatesToOnScreenPixels) {
      throw new Error(
        'coordinatesToOnScreenPixels function not available. Make sure the map is loaded.',
      );
    }
    const pixels = win.coordinatesToOnScreenPixels(longitude, latitude);
    cy.getByTestId('mapPage').click(pixels.x, pixels.y);
  });
}
