export class InfoSpotViewCard {
  getContainers = () => cy.getByTestId('InfoSpotsSection::container');

  getNthContainer = (index: number) => this.getContainers().eq(index);

  getDescription = () => cy.getByTestId('InfoSpotsViewCard::description');

  getLabel = () => cy.getByTestId('InfoSpotsViewCard::label');

  getInfoSpotType = () => cy.getByTestId('InfoSpotsViewCard::infoSpotType');

  getPurpose = () => cy.getByTestId('InfoSpotsViewCard::purpose');

  getLatitude = () => cy.getByTestId('InfoSpotsViewCard::latitude');

  getLongitude = () => cy.getByTestId('InfoSpotsViewCard::longitude');

  getDisplayType = () => cy.getByTestId('InfoSpotDetailsDynamic::displayType');

  getSpeechProperty = () =>
    cy.getByTestId('InfoSpotDetailsDynamic::speechProperty');

  getBacklight = () => cy.getByTestId('InfoSpotDetailsStatic::backlight');

  getPosterPlaceSize = () =>
    cy.getByTestId('InfoSpotDetailsStatic::posterPlaceSize');

  getMaintenance = () => cy.getByTestId('InfoSpotDetailsStatic::maintenance');

  getPosterSize = () => cy.getByTestId('InfoSpotPosterDetails::posterSize');

  getPosterLabel = () => cy.getByTestId('InfoSpotPosterDetails::posterLabel');

  getPosterLines = () => cy.getByTestId('InfoSpotPosterDetails::posterLines');

  getFloor = () => cy.getByTestId('InfoSpotZoneDetails::floor');

  getRailInformation = () =>
    cy.getByTestId('InfoSpotZoneDetails::railInformation');

  getStops = () => cy.getByTestId('InfoSpotZoneDetails::stops');

  getTerminals = () => cy.getByTestId('InfoSpotZoneDetails::terminals');

  getZoneLabel = () => cy.getByTestId('InfoSpotZoneDetails::zoneLabel');
}
