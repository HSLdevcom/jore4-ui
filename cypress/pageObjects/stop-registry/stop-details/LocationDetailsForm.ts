export class LocationDetailsForm {
  getStreetAddressInput = () =>
    cy.getByTestId('LocationDetailsForm::streetAddress');

  getPostalCodeInput = () => cy.getByTestId('LocationDetailsForm::postalCode');

  getMunicipalityReadOnly = () =>
    cy.getByTestId('LocationDetailsForm::municipality');

  getFareZoneReadOnly = () => cy.getByTestId('LocationDetailsForm::fareZone');

  getLatitudeInput = () => cy.getByTestId('LocationDetailsForm::latitude');

  getLongitudeInput = () => cy.getByTestId('LocationDetailsForm::longitude');

  getAltitudeInput = () => cy.getByTestId('LocationDetailsForm::altitude');

  getFunctionalAreaInput = () =>
    cy.getByTestId('LocationDetailsForm::functionalArea');
}
