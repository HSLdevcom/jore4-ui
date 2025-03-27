export class ShelterViewCard {
  getContainers = () => cy.getByTestId('ShelterViewCard::container');

  getNthContainer = (index: number) => this.getContainers().eq(index);

  getShelterNumber = () => cy.getByTestId('ShelterViewCard::shelterNumber');

  getShelterType = () => cy.getByTestId('ShelterViewCard::shelterType');

  getElectricity = () => cy.getByTestId('ShelterViewCard::shelterElectricity');

  getLighting = () => cy.getByTestId('ShelterViewCard::shelterLighting');

  getCondition = () => cy.getByTestId('ShelterViewCard::shelterCondition');

  getTimetableCabinets = () =>
    cy.getByTestId('ShelterViewCard::timetableCabinets');

  getTrashCan = () => cy.getByTestId('ShelterViewCard::trashCan');

  getHasDisplay = () => cy.getByTestId('ShelterViewCard::shelterHasDisplay');

  getBicycleParking = () => cy.getByTestId('ShelterViewCard::bicycleParking');

  getLeaningRail = () => cy.getByTestId('ShelterViewCard::leaningRail');

  getOutsideBench = () => cy.getByTestId('ShelterViewCard::outsideBench');

  getFasciaBoardTaping = () =>
    cy.getByTestId('ShelterViewCard::shelterFasciaBoardTaping');
}
