export class BasicDetailsViewCard {
  getToggle = () => cy.getByTestId('BasicDetailsSection::toggle');

  getContent = () => cy.getByTestId('BasicDetailsSection::content');

  getLabel = () => cy.getByTestId('BasicDetailsSection::label');

  getPrivateCode = () => cy.getByTestId('BasicDetailsSection::privateCode');

  getNameFin = () => cy.getByTestId('BasicDetailsSection::nameFin');

  getNameSwe = () => cy.getByTestId('BasicDetailsSection::nameSwe');

  getNameLongFin = () => cy.getByTestId('BasicDetailsSection::nameLongFin');

  getNameLongSwe = () => cy.getByTestId('BasicDetailsSection::nameLongSwe');

  getLocationFin = () => cy.getByTestId('BasicDetailsSection::locationFin');

  getLocationSwe = () => cy.getByTestId('BasicDetailsSection::locationSwe');

  getAbbreviationFin = () =>
    cy.getByTestId('BasicDetailsSection::abbreviationFin');

  getAbbreviationSwe = () =>
    cy.getByTestId('BasicDetailsSection::abbreviationSwe');

  getAbbreviation5CharFin = () =>
    cy.getByTestId('BasicDetailsSection::abbreviation5CharFin');

  getAbbreviation5CharSwe = () =>
    cy.getByTestId('BasicDetailsSection::abbreviation5CharSwe');

  getTransportMode = () => cy.getByTestId('BasicDetailsSection::transportMode');

  getTimingPlaceId = () => cy.getByTestId('BasicDetailsSection::timingPlaceId');

  getStopType = () => cy.getByTestId('BasicDetailsSection::stopType');

  getStopState = () => cy.getByTestId('BasicDetailsSection::stopState');

  getElyNumber = () => cy.getByTestId('BasicDetailsSection::elyNumber');
}
