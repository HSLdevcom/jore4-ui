export class InfoSpotViewCard {
  getSectionContainers = () => cy.getByTestId('InfoSpotsSection::container');

  getNthSectionContainer = (index: number) =>
    this.getSectionContainers().eq(index);

  getViewCardContainers = () => cy.getByTestId('InfoSpotsViewCard::container');

  getNthViewCardContainer = (index: number) =>
    this.getViewCardContainers().eq(index);

  getDescription = () => cy.getByTestId('InfoSpotsViewCard::description');

  getLabel = () => cy.getByTestId('InfoSpotsViewCard::label');

  getInfoSpotType = () => cy.getByTestId('InfoSpotsViewCard::infoSpotType');

  getPurpose = () => cy.getByTestId('InfoSpotsViewCard::purpose');

  getLatitude = () => cy.getByTestId('InfoSpotsViewCard::latitude');

  getLongitude = () => cy.getByTestId('InfoSpotsViewCard::longitude');

  getDisplayType = () => cy.getByTestId('InfoSpotDetailsDynamic::displayType');

  getSpeechProperty = () =>
    cy.getByTestId('InfoSpotDetailsDynamic::speechProperty');

  getBacklight = () => cy.getByTestId('InfoSpotDetails::backlight');

  getPosterPlaceSize = () => cy.getByTestId('InfoSpotDetails::posterPlaceSize');

  getPosterContainers = () =>
    cy.getByTestId('InfoSpotPosterDetails::container');

  getNthPosterContainer = (index: number) =>
    this.getPosterContainers().eq(index);

  getPosterSize = () => cy.getByTestId('InfoSpotPosterDetails::posterSize');

  getPosterLabel = () => cy.getByTestId('InfoSpotPosterDetails::posterLabel');

  getPosterLines = () => cy.getByTestId('InfoSpotPosterDetails::posterLines');

  getNoPosters = () => cy.getByTestId('InfoSpotPosterDetails::noPosters');

  getFloor = () => cy.getByTestId('InfoSpotZoneDetails::floor');

  getRailInformation = () =>
    cy.getByTestId('InfoSpotZoneDetails::railInformation');

  getStops = () => cy.getByTestId('InfoSpotZoneDetails::stops');

  getTerminals = () => cy.getByTestId('InfoSpotZoneDetails::terminals');

  getZoneLabel = () => cy.getByTestId('InfoSpotZoneDetails::zoneLabel');
}
