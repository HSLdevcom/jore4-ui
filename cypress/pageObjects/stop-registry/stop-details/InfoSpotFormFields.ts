export class InfoSpotFormFields {
  getDescription = () => cy.getByTestId('InfoSpotFormFields::description');

  getLabel = () => cy.getByTestId('InfoSpotFormFields::label');

  getInfoSpotTypeButton = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxButton');

  getInfoSpotTypeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxOptions');

  getPurpose = () => cy.getByTestId('InfoSpotFormFields::purpose');

  getBacklightButton = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxButton');

  getBacklightOptions = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxOptions');

  getPosterPlaceSizeButton = () =>
    cy.getByTestId('InfoSpotFormFields::posterPlaceSize::ListboxButton');

  getPosterPlaceSizeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::posterPlaceSize::ListboxOptions');

  getMaintenance = () => cy.getByTestId('InfoSpotFormFields::maintenance');

  getDisplayTypeButton = () =>
    cy.getByTestId('InfoSpotFormFields::displayType::ListboxButton');

  getDisplayTypeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::displayType::ListboxOptions');

  getSpeechPropertyButton = () =>
    cy.getByTestId('InfoSpotFormFields::speechProperty::ListboxButton');

  getSpeechPropertyOptions = () =>
    cy.getByTestId('InfoSpotFormFields::speechProperty::ListboxOptions');

  getFloor = () => cy.getByTestId('InfoSpotFormFields::floor');

  getRailInformation = () =>
    cy.getByTestId('InfoSpotFormFields::railInformation');

  getZoneLabel = () => cy.getByTestId('InfoSpotFormFields::zoneLabel');

  getPosterSizeButton = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterSize::ListboxButton');

  getPosterSizeOptions = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterSize::ListboxOptions');

  getPosterLabel = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLabel');

  getPosterLines = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLines');

  getDeleteInfoSpotButton = () =>
    cy.getByTestId('InfoSpotFormFields::deleteInfoSpot');
}
