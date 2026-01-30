export class TerminalLocationDetailsViewCard {
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

  static getMemberStops = () =>
    cy.getByTestId('LocationDetailsViewCard::memberStops');

  static getMemberPlatforms = () =>
    cy.getByTestId('LocationDetailsViewCard::memberPlatforms');
}
