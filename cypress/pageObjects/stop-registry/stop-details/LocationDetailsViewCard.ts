export class LocationDetailsViewCard {
  static getContainer = () =>
    cy.getByTestId('LocationDetailsViewCard::container');

  static getStreetAddress = () =>
    cy.getByTestId('LocationDetailsViewCard::streetAddress');

  static getPostalCode = () =>
    cy.getByTestId('LocationDetailsViewCard::postalCode');

  static getMunicipality = () =>
    cy.getByTestId('LocationDetailsViewCard::municipality');

  static getFareZone = () =>
    cy.getByTestId('LocationDetailsViewCard::fareZone');

  static getLatitude = () =>
    cy.getByTestId('LocationDetailsViewCard::latitude');

  static getLongitude = () =>
    cy.getByTestId('LocationDetailsViewCard::longitude');

  static getAltitude = () =>
    cy.getByTestId('LocationDetailsViewCard::altitude');

  static getFunctionalArea = () =>
    cy.getByTestId('LocationDetailsViewCard::functionalArea');

  static getStopArea = () =>
    cy.getByTestId('LocationDetailsViewCard::stopArea');

  static getStopAreaName = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaName');

  static getStopAreaStops = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaStops');

  static getPlatformNumber = () =>
    cy.getByTestId('LocationDetailsViewCard::platformNumber');

  static getSignContentType = () =>
    cy.getByTestId('LocationDetailsViewCard::signContentType');

  static getMemberPlatforms = () =>
    cy.getByTestId('LocationDetailsViewCard::memberPlatforms');

  static getTerminalPrivateCode = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalPrivateCode');

  static getTerminalLink = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalLink');

  static getTerminalName = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalName');

  static getTerminalStops = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalStops');
}
