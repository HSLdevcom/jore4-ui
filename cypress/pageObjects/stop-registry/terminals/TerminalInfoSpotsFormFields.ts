export class TerminalInfoSpotsFormFields {
  getDescription = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::description');

  getLabel = () => cy.getByTestId('TerminalInfoSpotFormFields::label');

  getPurposeButton = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxButton');

  getPurposeOptions = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::ListboxOptions');

  getPurposeCustom = () =>
    cy.getByTestId('InfoSpotFormFields::purpose::customInput');

  getBacklightButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::backlight::ListboxButton');

  getBacklightOptions = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::backlight::ListboxOptions');

  getSizeSelectorButton = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxButton').first();

  getSizeSelectorOptions = () =>
    cy.getByTestId('InfoSpotFormFields::size::selector::ListboxOptions');

  getSizeWidth = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('TerminalInfoSpotFormFields::size::width').first();

  getSizeHeight = () =>
    // Only get the 1st and ignore the deeply nested poster ones. To get the poster button,
    // nest this call in proper getNthPosterContainer().within block
    cy.getByTestId('TerminalInfoSpotFormFields::size::height').first();

  getDisplayTypeButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::displayType::ListboxButton');

  getDisplayTypeOptions = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::displayType::ListboxOptions');

  getSpeechPropertyButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::speechProperty::ListboxButton');

  getSpeechPropertyOptions = () =>
    cy.getByTestId(
      'TerminalInfoSpotFormFields::speechProperty::ListboxOptions',
    );

  getFloor = () => cy.getByTestId('TerminalInfoSpotFormFields::floor');

  getRailInformation = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::railInformation');

  getZoneLabel = () => cy.getByTestId('TerminalInfoSpotFormFields::zoneLabel');

  getPosterContainers = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::container');

  getNthPosterContainer = (index: number) =>
    this.getPosterContainers().eq(index);

  getPosterLabel = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::posterLabel');

  getPosterDetails = () =>
    cy.getByTestId('TerminalInfoSpotPosterFormFields::posterDetails');

  getAddPosterButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::addInfoSpotPoster');

  getDeletePosterButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::deleteInfoSpotPoster');

  getDeleteInfoSpotButton = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::deleteInfoSpot');

  getNoPostersLabel = () =>
    cy.getByTestId('TerminalInfoSpotFormFields::noPosters');

  getLatitude = () => cy.getByTestId('TerminalInfoSpotFormFields::latitude');

  getLongitude = () => cy.getByTestId('TerminalInfoSpotFormFields::longitude');
}
