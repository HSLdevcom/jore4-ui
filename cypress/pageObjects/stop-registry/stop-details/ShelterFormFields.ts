export class ShelterFormFields {
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

  getTrashCanDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::trashCan::ListboxButton');

  getTrashCanDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::trashCan::ListboxOptions');

  getShelterHasDisplayDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::shelterHasDisplay::ListboxButton');

  getShelterHasDisplayDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::shelterHasDisplay::ListboxOptions');

  getBicycleParkingDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::bicycleParking::ListboxButton');

  getBicycleParkingDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::bicycleParking::ListboxOptions');

  getLeaningRailDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::leaningRail::ListboxButton');

  getLeaningRailDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::leaningRail::ListboxOptions');

  getOutsideBenchDropdownButton = () =>
    cy.getByTestId('ShelterFormFields::outsideBench::ListboxButton');

  getOutsideBenchDropdownOptions = () =>
    cy.getByTestId('ShelterFormFields::outsideBench::ListboxOptions');

  getShelterFasciaBoardTapingDropdownButton = () =>
    cy.getByTestId(
      'ShelterFormFields::shelterFasciaBoardTaping::ListboxButton',
    );

  getShelterFasciaBoardTapingDropdownOptions = () =>
    cy.getByTestId(
      'ShelterFormFields::shelterFasciaBoardTaping::ListboxOptions',
    );

  getShelterExternalIdInput = () =>
    cy.getByTestId('ShelterFormFields::shelterExternalId');

  getDeleteShelterButton = () =>
    cy.getByTestId('ShelterFormFields::deleteShelter');
}
