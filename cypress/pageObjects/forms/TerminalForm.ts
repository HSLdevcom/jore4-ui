import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';
import { SelectTerminalMemberStopsDropdown } from './SelectTerminalMemberStopsDropdown';
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
  reasonForChange?: string | null;
}

export interface NewTerminalFormInfo extends BaseTerminalFormInfo {
  stops: string[];
}

export class TerminalForm {
  static getForm() {
    return cy.getByTestId('TerminalFormComponent::form');
  }

  static getPrivateCodeInput() {
    return cy.getByTestId('TerminalFormComponent::privateCode');
  }

  static getLongitudeInput() {
    return cy.getByTestId('TerminalFormComponent::longitude');
  }

  static getLatitudeInput() {
    return cy.getByTestId('TerminalFormComponent::latitude');
  }

  static getNameInput() {
    return cy.getByTestId('TerminalFormComponent::name');
  }

  static getNameSweInput() {
    return cy.getByTestId('TerminalFormComponent::nameSwe');
  }

  static showTerminalNameForm() {
    return cy.getByTestId('TerminalFormComponent::showHideButton').click();
  }

  static getModal() {
    return cy.getByTestId('EditTerminalModal');
  }

  static fillBaseForm(values: BaseTerminalFormInfo) {
    if (values.name) {
      TerminalForm.getNameInput().clearAndType(values.name);
    }

    TerminalForm.showTerminalNameForm();

    if (values.nameSwe) {
      TerminalForm.getNameSweInput().clearAndType(values.nameSwe);
    }

    if (values.latitude) {
      TerminalForm.getLatitudeInput().clearAndType(values.latitude);
    }

    if (values.longitude) {
      TerminalForm.getLongitudeInput().clearAndType(values.longitude);
    }

    ValidityPeriodForm.fillForm(values);
  }

  static fillFormForNewTerminal(values: NewTerminalFormInfo) {
    TerminalForm.fillBaseForm(values);

    values.stops.forEach((stop) => {
      SelectTerminalMemberStopsDropdown.dropdownButton().click();
      SelectTerminalMemberStopsDropdown.getInput().clearAndType(stop);
      SelectMemberStopsDropdown.getMemberOptions().click();
      cy.closeDropdown();
    });
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  static save(forceAction = false) {
    return TerminalForm.getModal()
      .findByTestId('EditTerminalModal::saveButton')
      .click({ force: forceAction });
  }
}
