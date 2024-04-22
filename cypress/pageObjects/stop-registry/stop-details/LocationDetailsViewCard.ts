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

  getQuay = () => cy.getByTestId('LocationDetailsViewCard::quay');

  getStopAreaQuays = () =>
    cy.getByTestId('LocationDetailsViewCard::stopAreaQuays');

  getTerminal = () => cy.getByTestId('LocationDetailsViewCard::terminal');

  getTerminalName = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalName');

  getTerminalStops = () =>
    cy.getByTestId('LocationDetailsViewCard::terminalStops');
}
