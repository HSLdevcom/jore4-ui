export class InfoSpotViewCard {
  static getSectionContainers = () =>
    cy.getByTestId('InfoSpotsSection::container');

  static getNthSectionContainer = (index: number) =>
    InfoSpotViewCard.getSectionContainers().eq(index);

  static getViewCardContainers = () =>
    cy.getByTestId('InfoSpotsViewCard::container');

  static getNthViewCardContainer = (index: number) =>
    InfoSpotViewCard.getViewCardContainers().eq(index);

  static getDescription = () =>
    cy.getByTestId('InfoSpotsViewCard::description');

  static getLabel = () => cy.getByTestId('InfoSpotsViewCard::label');

  static getInfoSpotType = () =>
    cy.getByTestId('InfoSpotsViewCard::infoSpotType');

  static getPurpose = () => cy.getByTestId('InfoSpotsViewCard::purpose');

  static getLatitude = () => cy.getByTestId('InfoSpotsViewCard::latitude');

  static getLongitude = () => cy.getByTestId('InfoSpotsViewCard::longitude');

  static getDisplayType = () =>
    cy.getByTestId('InfoSpotDetailsDynamic::displayType');

  static getSpeechProperty = () =>
    cy.getByTestId('InfoSpotDetailsDynamic::speechProperty');

  static getBacklight = () => cy.getByTestId('InfoSpotDetails::backlight');

  static getSize = () => cy.getByTestId('InfoSpotDetails::size');

  static getPosterContainers = () =>
    cy.getByTestId('InfoSpotPosterDetails::container');

  static getNthPosterContainer = (index: number) =>
    InfoSpotViewCard.getPosterContainers().eq(index);

  static getPosterSize = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterSize');

  static getPosterLabel = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterLabel');

  static getPosterLines = () =>
    cy.getByTestId('InfoSpotPosterDetails::posterLines');

  static getNoPosters = () =>
    cy.getByTestId('InfoSpotPosterDetails::noPosters');

  static getFloor = () => cy.getByTestId('InfoSpotZoneDetails::floor');

  static getRailInformation = () =>
    cy.getByTestId('InfoSpotZoneDetails::railInformation');

  static getStops = () => cy.getByTestId('InfoSpotZoneDetails::stops');

  static getTerminals = () => cy.getByTestId('InfoSpotZoneDetails::terminals');

  static getZoneLabel = () => cy.getByTestId('InfoSpotZoneDetails::zoneLabel');
}
