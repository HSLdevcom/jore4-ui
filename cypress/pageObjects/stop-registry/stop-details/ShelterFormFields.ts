export class ShelterFormFields {
  static getShelterNumberInput = () =>
    cy.getByTestId('ShelterFormFields::shelterNumber');

  static getShelterTypeDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterType::ListboxButton');

  static getShelterTypeDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterType::ListboxOptions');

  static getShelterElectricityDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterElectricity::ListboxButton');

  static getShelterElectricityDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterElectricity::ListboxOptions');

  static getShelterLightingDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterLighting::ListboxButton');

  static getShelterLightingDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterLighting::ListboxOptions');

  static getShelterConditionDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterCondition::ListboxButton');

  static getShelterConditionDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterCondition::ListboxOptions');

  static getTimetableCabinetsInput = () =>
    cy.getByTestId('ShelterFormFields::timetableCabinets');

  static getTrashCanCheckbox = () =>
    cy.getByTestId('ShelterFormFields::trashCan');

  static getShelterHasDisplayCheckbox = () =>
    cy.getByTestId('ShelterFormFields::shelterHasDisplay');

  static getBicycleParkingCheckbox = () =>
    cy.getByTestId('ShelterFormFields::bicycleParking');

  static getLeaningRailCheckbox = () =>
    cy.getByTestId('ShelterFormFields::leaningRail');

  static getOutsideBenchCheckbox = () =>
    cy.getByTestId('ShelterFormFields::outsideBench');

  static getShelterFasciaBoardTapingCheckbox = () =>
    cy.getByTestId('ShelterFormFields::shelterFasciaBoardTaping');

  static getShelterExternalIdInput = () =>
    cy.getByTestId('ShelterFormFields::shelterExternalId');

  static getDeleteShelterButton = () =>
    cy.getByTestId('ShelterFormFields::deleteShelter');
}
