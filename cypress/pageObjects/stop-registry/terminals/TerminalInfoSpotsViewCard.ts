export class TerminalInfoSpotsViewCard {
  getContainer = () => cy.getByTestId('TerminalInfoSpotsViewCard::container');

  getDescription = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::description');

  getLabel = () => cy.getByTestId('TerminalInfoSpotsViewCard::label');

  getInfoSpotType = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::infoSpotType');

  getPurpose = () => cy.getByTestId('TerminalInfoSpotsViewCard::purpose');

  getLatitude = () => cy.getByTestId('TerminalInfoSpotsViewCard::latitude');

  getLongitude = () => cy.getByTestId('TerminalInfoSpotsViewCard::longitude');

  getBacklight = () => cy.getByTestId('TerminalInfoSpotsViewCard::backlight');

  getSize = () => cy.getByTestId('TerminalInfoSpotsViewCard::size');

  getFloor = () => cy.getByTestId('TerminalInfoSpotsViewCard::floor');

  getRailInformation = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::railInformation');

  getZoneLabel = () => cy.getByTestId('TerminalInfoSpotsViewCard::zoneLabel');

  getPosterContainer = () => cy.getByTestId('InfoSpotPosterDetails::container');

  getPosterSize = () => cy.getByTestId('InfoSpotPosterDetails::posterSize');

  getPosterLabel = () => cy.getByTestId('InfoSpotPosterDetails::posterLabel');

  getPosterLines = () => cy.getByTestId('InfoSpotPosterDetails::posterLines');

  getNoPosters = () => cy.getByTestId('InfoSpotPosterDetails::noPosters');

  getNthPosterContainer = (index: number) =>
    this.getPosterContainer().eq(index);
}
