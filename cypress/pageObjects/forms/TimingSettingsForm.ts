import { expectGraphQLCallToSucceed } from '../../utils/assertions';

export class TimingSettingsForm {
  static getIsUsedAsTimingPointCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isUsedAsTimingPoint');
  }

  static getIsRegulatedTimingPointCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isRegulatedTimingPoint');
  }

  static getIsLoadingTimeAllowedCheckbox() {
    return cy.getByTestId('TimingSettingsForm::isLoadingTimeAllowed');
  }

  static getSavebutton() {
    return cy.getByTestId('TimingSettingsForm::saveButton');
  }

  static getTimingPlaceDropdownButton() {
    return cy.getByTestId('TimingSettingsForm::timingPlaceDropdown::button');
  }

  static getTimingPlaceDropdown() {
    return cy.getByTestId('TimingSettingsForm::timingPlaceDropdown');
  }

  static getTimingPlaceOptionByLabel(label: string) {
    return cy.get('[role="option"]').contains(label);
  }

  static selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    TimingSettingsForm.getTimingPlaceDropdownButton().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    expectGraphQLCallToSucceed('@gqlGetTimingPlacesForCombobox');
    TimingSettingsForm.getTimingPlaceDropdown()
      .find('[role="option"]')
      .contains(timingPlaceName)
      .click();
  }
}
