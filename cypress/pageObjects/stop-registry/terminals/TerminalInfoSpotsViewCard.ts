export class TerminalInfoSpotsViewCard {
  static getContainer = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::container');

  static getDescription = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::description');

  static getLabel = () => cy.getByTestId('TerminalInfoSpotsViewCard::label');

  static getInfoSpotType = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::infoSpotType');

  static getIntendedUser = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::intendedUser');

  static getLatitude = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::latitude');

  static getLongitude = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::longitude');

  static getBacklight = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::backlight');

  static getSize = () => cy.getByTestId('TerminalInfoSpotsViewCard::size');

  static getFloor = () => cy.getByTestId('TerminalInfoSpotsViewCard::floor');

  static getRailInformation = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::railInformation');

  static getZoneLabel = () =>
    cy.getByTestId('TerminalInfoSpotsViewCard::zoneLabel');

  static getPosterContainer = () =>
    cy.getByTestId('InfoSpotPosterDetails::container');

  static getPosterSize = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterSize');

  static getPosterPurpose = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterPurpose');

  static getPosterLines = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterLines');

  static getNoPosters = () =>
    cy.getByTestId('InfoSpotPosterDetails::noPosters');

  static getNthPosterContainer = (index: number) =>
    TerminalInfoSpotsViewCard.getPosterContainer().eq(index);
}
