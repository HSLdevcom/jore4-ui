export class ShelterFormRow {
  getShelterTypeDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterType::ListboxButton');

  getShelterTypeDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterType::ListboxOptions');

  getShelterElectricityDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterElectricity::ListboxButton');

  getShelterElectricityDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterElectricity::ListboxOptions');

  getShelterLightingDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterLighting::ListboxButton');

  getShelterLightingDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterLighting::ListboxOptions');

  getShelterConditionDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterCondition::ListboxButton');

  getShelterConditionDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterCondition::ListboxOptions');

  getTimetableCabinetsInput = () =>
    cy.getByTestId('ShelterFormRow::timetableCabinets');

  getTrashCanDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::trashCan::ListboxButton');

  getTrashCanDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::trashCan::ListboxOptions');

  getShelterHasDisplayDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterHasDisplay::ListboxButton');

  getShelterHasDisplayDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterHasDisplay::ListboxOptions');

  getBicycleParkingDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::bicycleParking::ListboxButton');

  getBicycleParkingDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::bicycleParking::ListboxOptions');

  getLeaningRailDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::leaningRail::ListboxButton');

  getLeaningRailDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::leaningRail::ListboxOptions');

  getOutsideBenchDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::outsideBench::ListboxButton');

  getOutsideBenchDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::outsideBench::ListboxOptions');

  getShelterFasciaBoardTapingDropdownButton = () =>
    cy.getByTestId('ShelterFormRow::shelterFasciaBoardTaping::ListboxButton');

  getShelterFasciaBoardTapingDropdownOptions = () =>
    cy.getByTestId('ShelterFormRow::shelterFasciaBoardTaping::ListboxOptions');
}
