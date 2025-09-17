export class LocationDetailsViewCard {
  getContainer = () => cy.getByTestId('LocationDetailsViewCard::container');

  getStreetAddress = () =>
    cy.getByTestId('LocationDetailsViewCard::streetAddress');

  getPostalCode = () => cy.getByTestId('LocationDetailsViewCard::postalCode');

  getMunicipality = () =>
    cy.getByTestId('LocationDetailsViewCard::municipality');

  getFareZone = () => cy.getByTestId('LocationDetailsViewCard::fareZone');

  getLatitude = () => cy.getByTestId('LocationDetailsViewCard::latitude');

  getLongitude = () => cy.getByTestId('LocationDetailsViewCard::longitude');

  getAltitude = () => cy.getByTestId('LocationDetailsViewCard::altitude');

  getFunctionalArea = () =>
    cy.getByTestId('LocationDetailsViewCard::functionalArea');

  getStopArea = () => cy.getByTestId('LocationDetailsViewCard::stopArea');

  getStopAreaName = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaName');

  getStopAreaStops = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaStops');

  getPlatformNumber = () =>
    cy.getByTestId('LocationDetailsViewCard::platformNumber');

  getSignContentType = () =>
    cy.getByTestId('LocationDetailsViewCard::signContentType');

  getMemberPlatforms = () =>
    cy.getByTestId('LocationDetailsViewCard::memberPlatforms');

  getTerminalPrivateCode = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalPrivateCode');

  getTerminalLink = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalLink');

  getTerminalName = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalName');

  getTerminalStops = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalStops');
}
