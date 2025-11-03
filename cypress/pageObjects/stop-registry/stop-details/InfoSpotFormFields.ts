export class InfoSpotFormFields {
  getDescription = () => cy.getByTestId('InfoSpotFormFields::description');

  getLabel = () => cy.getByTestId('InfoSpotFormFields::label');

  getInfoSpotTypeButton = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxButton');

  getInfoSpotTypeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxOptions');

  getPurposeButton = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxButton');

  getPurposeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxOptions');

  getPurposeCustom = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::customInput');

  getBacklightButton = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxButton');

  getBacklightOptions = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxOptions');

  getSizeSelectorButton = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxButton').first();

  getSizeSelectorOptions = () =>
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxOptions');

  getSizeWidth = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::width').first();

  getSizeHeight = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::height').first();

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

  getPosterContainers = () =>
    cy.getByTestId('InfoSpotPosterFormFields::container');

  getNthPosterContainer = (index: number) =>
    this.getPosterContainers().eq(index);

  getPosterLabel = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLabel');

  getPosterLines = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLines');

  getAddPosterButton = () =>
    cy.getByTestId('InfoSpotFormFields::addInfoSpotPoster');

  getDeletePosterButton = () =>
    cy.getByTestId('InfoSpotFormFields::deleteInfoSpotPoster');

  getDeleteInfoSpotButton = () =>
    cy.getByTestId('InfoSpotFormFields::deleteInfoSpot');

  getNoPostersLabel = () => cy.getByTestId('InfoSpotFormFields::noPosters');
}
