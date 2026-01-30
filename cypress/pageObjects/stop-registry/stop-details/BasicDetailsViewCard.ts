export class BasicDetailsViewCard {
  static getToggle = () => cy.getByTestId('BasicDetailsSection::toggle');

  static getContent = () => cy.getByTestId('BasicDetailsSection::content');

  static getLabel = () => cy.getByTestId('BasicDetailsSection::label');

  static getAreaLink = () => cy.getByTestId('BasicDetailsSection::areaLink');

  static getAreaPrivateCode = () =>
    cy.getByTestId('BasicDetailsSection::areaPrivateCode');

  static getAreaQuays = () => cy.getByTestId('BasicDetailsSection::areaQuays');

  static getAreaName = () => cy.getByTestId('BasicDetailsSection::areaName');

  static getAreaNameSwe = () =>
    cy.getByTestId('BasicDetailsSection::areaNameSwe');

  static getPrivateCode = () =>
    cy.getByTestId('BasicDetailsSection::privateCode');

  static getNameFin = () => cy.getByTestId('BasicDetailsSection::nameFin');

  static getNameSwe = () => cy.getByTestId('BasicDetailsSection::nameSwe');

  static getNameLongFin = () =>
    cy.getByTestId('BasicDetailsSection::nameLongFin');

  static getNameLongSwe = () =>
    cy.getByTestId('BasicDetailsSection::nameLongSwe');

  static getLocationFin = () =>
    cy.getByTestId('BasicDetailsSection::locationFin');

  static getLocationSwe = () =>
    cy.getByTestId('BasicDetailsSection::locationSwe');

  static getAbbreviationFin = () =>
    cy.getByTestId('BasicDetailsSection::abbreviationFin');

  static getAbbreviationSwe = () =>
    cy.getByTestId('BasicDetailsSection::abbreviationSwe');

  static getTransportMode = () =>
    cy.getByTestId('BasicDetailsSection::transportMode');

  static getTimingPlaceId = () =>
    cy.getByTestId('BasicDetailsSection::timingPlaceId');

  static getStopType = () => cy.getByTestId('BasicDetailsSection::stopType');

  static getStopState = () => cy.getByTestId('BasicDetailsSection::stopState');

  static getElyNumber = () => cy.getByTestId('BasicDetailsSection::elyNumber');
}
