export class TerminalInfoSpotsFormFields {
  static getDescription = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::description');

  static getLabel = () => cy.getByTestId('TerminalInfoSpotFormFields::label');

  static getPurposeButton = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxButton');

  static getPurposeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxOptions');

  static getPurposeCustom = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::customInput');

  static getBacklightButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::backlight::ListboxButton');

  static getBacklightOptions = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::backlight::ListboxOptions');

  static getSizeSelectorButton = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxButton').first();

  static getSizeSelectorOptions = () =>
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxOptions');

  static getSizeWidth = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('TerminalInfoSpotFormFields::size::width').first();

  static getSizeHeight = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('TerminalInfoSpotFormFields::size::height').first();

  static getDisplayTypeButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::displayType::ListboxButton');

  static getDisplayTypeOptions = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::displayType::ListboxOptions');

  static getSpeechPropertyButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::speechProperty::ListboxButton');

  static getSpeechPropertyOptions = () =>
    cy.getByTestId(
      'TerminalInfoSpotFormFields::speechProperty::ListboxOptions',
    );

  static getFloor = () => cy.getByTestId('TerminalInfoSpotFormFields::floor');

  static getRailInformation = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::railInformation');

  static getZoneLabel = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::zoneLabel');

  static getPosterContainers = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::container');

  static getNthPosterContainer = (index: number) =>
    TerminalInfoSpotsFormFields.getPosterContainers().eq(index);

  static getPosterLabel = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::posterLabel');

  static getPosterDetails = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::posterDetails');

  static getAddPosterButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::addInfoSpotPoster');

  static getDeletePosterButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::deleteInfoSpotPoster');

  static getDeleteInfoSpotButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::deleteInfoSpot');

  static getNoPostersLabel = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::noPosters');

  static getLatitude = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::latitude');

  static getLongitude = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::longitude');
}
