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

  getPlatformNumber = () =>
    cy.getByTestId('LocationDetailsForm::platformNumber');

  getSignContentTypeDropdownButton = () =>
    cy.getByTestId('LocationDetailsForm::signContentType::ListboxButton');

  getSignContentTypeDropdownOptions = () =>
    cy.getByTestId('LocationDetailsForm::signContentType::ListboxOptions');
}
