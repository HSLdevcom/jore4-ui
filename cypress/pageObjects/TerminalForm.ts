import {
  ValidityPeriodForm,
  ValidityPeriodFormInfo,
} from './ValidityPeriodForm';

export interface BaseTerminalFormInfo extends ValidityPeriodFormInfo {
  name?: string;
  nameSwe?: string;
  longitude?: string;
  latitude?: string;
  timingPlace?: string;
  versionName?: string;
  versionDescription?: string;
}

export interface NewTerminalFormInfo extends BaseTerminalFormInfo {
  stops: string[];
}

export class TerminalForm {
  validityPeriodForm = new ValidityPeriodForm();

  getForm() {
    return cy.getByTestId('TerminalFormComponent::form');
  }

  getPrivateCodeInput() {
    return cy.getByTestId('TerminalFormComponent::privateCode');
  }

  getLongitudeInput() {
    return cy.getByTestId('TerminalFormComponent::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('TerminalFormComponent::latitude');
  }

  getNameInput() {
    return cy.getByTestId('TerminalFormComponent::name');
  }

  getNameSweInput() {
    return cy.getByTestId('TerminalFormComponent::nameSwe');
  }

  showTerminalNameForm() {
    return cy.getByTestId('TerminalFormComponent::showHideButton').click();
  }

  getModal() {
    return cy.getByTestId('EditTerminalModal');
  }

  fillBaseForm(values: BaseTerminalFormInfo) {
    if (values.name) {
      this.getNameInput().clearAndType(values.name);
    }

    this.showTerminalNameForm();

    if (values.nameSwe) {
      this.getNameSweInput().clearAndType(values.nameSwe);
    }

    if (values.latitude) {
      this.getLatitudeInput().clearAndType(values.latitude);
    }

    if (values.longitude) {
      this.getLongitudeInput().clearAndType(values.longitude);
    }

    this.validityPeriodForm.fillForm(values);
  }

  fillFormForNewTerminal(values: NewTerminalFormInfo) {
    this.fillBaseForm(values);

    values.stops.forEach((stop) => {
      cy.getByTestId('SelectMemberStopsDropdownButton').click();
      cy.getByTestId('SelectMemberStopsDropdown::input').clearAndType(stop);
      cy.getByTestId('MemberStopOptions::option').click();
    });
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return this.getModal()
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
