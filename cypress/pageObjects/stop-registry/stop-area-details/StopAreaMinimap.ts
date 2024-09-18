export class StopAreaMinimap {
  getOpenMapButton = () => cy.getByTestId('StopAreaMinimap::openMapButton');

  getMarker = () => cy.getByTestId('StopAreaMinimap::marker');
}
