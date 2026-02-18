import { ValidityPeriodForm } from './ValidityPeriodForm';

export class StopAreaForm {
  static validityPeriodForm = ValidityPeriodForm;

  static getForm() {
    return cy.getByTestId('StopAreaFormComponent::form');
  }

  static getPrivateCode() {
    return cy.getByTestId('StopAreaFormComponent::privateCode');
  }

  static getName() {
    return cy.getByTestId('StopAreaFormComponent::name');
  }

  static getShowHideButton() {
    return cy.getByTestId('StopAreaFormComponent::showHideButton');
  }

  static getShowHideEngButton() {
    return cy.getByTestId('StopAreaFormComponent::showHideButtonEng');
  }

  static getNameSwe() {
    return cy.getByTestId('StopAreaFormComponent::nameSwe');
  }

  static getNameEng() {
    return cy.getByTestId('StopAreaFormComponent::nameEng');
  }

  static getNameLongFin() {
    return cy.getByTestId('StopAreaFormComponent::nameLongFin');
  }

  static getNameLongSwe() {
    return cy.getByTestId('StopAreaFormComponent::nameLongSwe');
  }

  static getNameLongEng() {
    return cy.getByTestId('StopAreaFormComponent::nameLongEng');
  }

  static getAbbreviationFin() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationFin');
  }

  static getAbbreviationSwe() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationSwe');
  }

  static getAbbreviationEng() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationEng');
  }

  static getLatitude() {
    return cy.getByTestId('StopAreaFormComponent::latitude');
  }

  static getLongitude() {
    return cy.getByTestId('StopAreaFormComponent::longitude');
  }

  static getTransportationMode() {
    return cy.getByTestId('StopAreaFormComponent::transportMode::ListboxButton');
  }

  /** Clicks the EditStopAreaModal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  static save(forceAction = false) {
    return cy
      .getByTestId('EditStopAreaModal')
      .findByTestId('EditStopAreaModal::saveButton')
      .click({ force: forceAction });
  }
}
