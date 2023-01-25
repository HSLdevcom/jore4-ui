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
}
