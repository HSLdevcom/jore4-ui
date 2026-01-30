export class ShelterViewCard {
  static getContainers = () => cy.getByTestId('ShelterViewCard::container');

  static getNthContainer = (index: number) =>
    ShelterViewCard.getContainers().eq(index);

  static getShelterNumber = () =>
    cy.getByTestId('ShelterViewCard::shelterNumber');

  static getShelterType = () => cy.getByTestId('ShelterViewCard::shelterType');

  static getElectricity = () =>
    cy.getByTestId('ShelterViewCard::shelterElectricity');

  static getLighting = () => cy.getByTestId('ShelterViewCard::shelterLighting');

  static getCondition = () =>
    cy.getByTestId('ShelterViewCard::shelterCondition');

  static getTimetableCabinets = () =>
    cy.getByTestId('ShelterViewCard::timetableCabinets');

  static getTrashCan = () => cy.getByTestId('ShelterViewCard::trashCan');

  static getHasDisplay = () =>
    cy.getByTestId('ShelterViewCard::shelterHasDisplay');

  static getBicycleParking = () =>
    cy.getByTestId('ShelterViewCard::bicycleParking');

  static getLeaningRail = () => cy.getByTestId('ShelterViewCard::leaningRail');

  static getOutsideBench = () =>
    cy.getByTestId('ShelterViewCard::outsideBench');

  static getFasciaBoardTaping = () =>
    cy.getByTestId('ShelterViewCard::shelterFasciaBoardTaping');

  static getShelterExternalId = () =>
    cy.getByTestId('ShelterViewCard::shelterExternalId');
}
