export class TimingSettingsForm {
  getIsUsedAsTimingPointCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isUsedAsTimingPoint');
  }

  getIsRegulatedTimingPointCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isRegulatedTimingPoint');
  }

  getIsLoadingTimeAllowedCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isLoadingTimeAllowed');
  }

  getSavebutton() {
    return cy.getByTestId('TimingSettingsForm::saveButton');
  }

  getTimingPlaceDropdownButton() {
    return cy.getByTestId('TimingSettingsForm::timingPlaceDropdown::button');
  }

  getTimingPlaceDropdown() {
    return cy.getByTestId('TimingSettingsForm::timingPlaceDropdown');
  }

  selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    this.getTimingPlaceDropdownButton().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    cy.wait('@gqlGetTimingPlacesForCombobox')
      .its('response.statusCode')
      .should('equal', 200);
    this.getTimingPlaceDropdown()
      .find('[role="option"]')
      .contains(timingPlaceName)
      .click();
  }
}
