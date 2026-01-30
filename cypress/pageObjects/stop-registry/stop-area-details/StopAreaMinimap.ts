export class StopAreaMinimap {
  static getOpenMapButton = () =>
    cy.getByTestId('StopAreaMinimap::openMapButton');

  static getMarker = () => cy.getByTestId('StopAreaMinimap::marker');
}
