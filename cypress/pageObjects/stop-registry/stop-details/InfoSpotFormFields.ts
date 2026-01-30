export class InfoSpotFormFields {
  static getDescription = () =>
    cy.getByTestId('InfoSpotFormFields::description');

  static getLabel = () => cy.getByTestId('InfoSpotFormFields::label');

  static getInfoSpotTypeButton = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxButton');

  static getInfoSpotTypeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::infoSpotType::ListboxOptions');

  static getPurposeButton = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxButton');

  static getPurposeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxOptions');

  static getPurposeCustom = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::customInput');

  static getBacklightButton = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxButton');

  static getBacklightOptions = () =>
    cy.getByTestId('InfoSpotFormFields::backlight::ListboxOptions');

  static getSizeSelectorButton = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxButton').first();

  static getSizeSelectorOptions = () =>
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxOptions');

  static getSizeWidth = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::width').first();

  static getSizeHeight = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::height').first();

  static getDisplayTypeButton = () =>
    cy.getByTestId('InfoSpotFormFields::displayType::ListboxButton');

  static getDisplayTypeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::displayType::ListboxOptions');

  static getSpeechPropertyButton = () =>
    cy.getByTestId('InfoSpotFormFields::speechProperty::ListboxButton');

  static getSpeechPropertyOptions = () =>
    cy.getByTestId('InfoSpotFormFields::speechProperty::ListboxOptions');

  static getFloor = () => cy.getByTestId('InfoSpotFormFields::floor');

  static getRailInformation = () =>
    cy.getByTestId('InfoSpotFormFields::railInformation');

  static getZoneLabel = () => cy.getByTestId('InfoSpotFormFields::zoneLabel');

  static getPosterContainers = () =>
    cy.getByTestId('InfoSpotPosterFormFields::container');

  static getNthPosterContainer = (index: number) =>
    InfoSpotFormFields.getPosterContainers().eq(index);

  static getPosterLabel = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLabel');

  static getPosterLines = () =>
    cy.getByTestId('InfoSpotPosterFormFields::posterLines');

  static getAddPosterButton = () =>
    cy.getByTestId('InfoSpotFormFields::addInfoSpotPoster');

  static getDeletePosterButton = () =>
    cy.getByTestId('InfoSpotFormFields::deleteInfoSpotPoster');

  static getDeleteInfoSpotButton = () =>
    cy.getByTestId('InfoSpotFormFields::deleteInfoSpot');

  static getNoPostersLabel = () =>
    cy.getByTestId('InfoSpotFormFields::noPosters');
}
