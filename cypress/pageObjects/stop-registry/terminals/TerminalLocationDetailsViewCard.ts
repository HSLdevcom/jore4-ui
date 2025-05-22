export class TerminalLocationDetailsViewCard {
  getContainer = () => cy.getByTestId('LocationDetailsViewCard::container');

  getStreetAddress = () =>
    cy.getByTestId('LocationDetailsViewCard::streetAddress');

  getPostalCode = () => cy.getByTestId('LocationDetailsViewCard::postalCode');

  getMunicipality = () =>
    cy.getByTestId('LocationDetailsViewCard::municipality');

  getFareZone = () => cy.getByTestId('LocationDetailsViewCard::fareZone');

  getLatitude = () => cy.getByTestId('LocationDetailsViewCard::latitude');

  getLongitude = () => cy.getByTestId('LocationDetailsViewCard::longitude');

  getMemberStopAreas = () =>
    cy.getByTestId('LocationDetailsViewCard::memberStopAreas');

  getMemberPlatforms = () =>
    cy.getByTestId('LocationDetailsViewCard::memberPlatforms');
}
