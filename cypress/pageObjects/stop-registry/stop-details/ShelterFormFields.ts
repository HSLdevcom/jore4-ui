export class ShelterFormFields {
  getShelterNumberInput = () =>
    cy.getByTestId('ShelterFormFields::shelterNumber');

  getShelterTypeDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterType::ListboxButton');

  getShelterTypeDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterType::ListboxOptions');

  getShelterElectricityDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterElectricity::ListboxButton');

  getShelterElectricityDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterElectricity::ListboxOptions');

  getShelterLightingDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterLighting::ListboxButton');

  getShelterLightingDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterLighting::ListboxOptions');

  getShelterConditionDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterCondition::ListboxButton');

  getShelterConditionDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterCondition::ListboxOptions');

  getTimetableCabinetsInput = () =>
    cy.getByTestId('ShelterFormFields::timetableCabinets');

  getTrashCanCheckbox = () => cy.getByTestId('ShelterFormFields::trashCan');

  getShelterHasDisplayCheckbox = () =>
    cy.getByTestId('ShelterFormFields::shelterHasDisplay');

  getBicycleParkingCheckbox = () =>
    cy.getByTestId('ShelterFormFields::bicycleParking');

  getLeaningRailCheckbox = () =>
    cy.getByTestId('ShelterFormFields::leaningRail');

  getOutsideBenchCheckbox = () =>
    cy.getByTestId('ShelterFormFields::outsideBench');

  getShelterFasciaBoardTapingCheckbox = () =>
    cy.getByTestId('ShelterFormFields::shelterFasciaBoardTaping');

  getShelterExternalIdInput = () =>
    cy.getByTestId('ShelterFormFields::shelterExternalId');

  getDeleteShelterButton = () =>
    cy.getByTestId('ShelterFormFields::deleteShelter');
}
