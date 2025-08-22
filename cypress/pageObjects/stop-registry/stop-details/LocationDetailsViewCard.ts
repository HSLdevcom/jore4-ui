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

  getQuay = () => cy.getByTestId('LocationDetailsViewCard::quay');

  getStopAreaQuays = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaQuays');

  getTerminalPrivateCode = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalPrivateCode');

  getTerminalLink = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalLink');

  getTerminalName = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalName');

  getTerminalStops = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalStops');
}
