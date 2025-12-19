import { ValidityPeriodForm } from './ValidityPeriodForm';

export class StopAreaForm {
  validityPeriodForm = new ValidityPeriodForm();

  getForm() {
    return cy.getByTestId('StopAreaFormComponent::form');
  }

  getPrivateCode() {
    return cy.getByTestId('StopAreaFormComponent::privateCode');
  }

  getName() {
    return cy.getByTestId('StopAreaFormComponent::name');
  }

  getShowHideButton() {
    return cy.getByTestId('StopAreaFormComponent::showHideButton');
  }

  getShowHideEngButton() {
    return cy.getByTestId('StopAreaFormComponent::showHideButtonEng');
  }

  getNameSwe() {
    return cy.getByTestId('StopAreaFormComponent::nameSwe');
  }

  getNameEng() {
    return cy.getByTestId('StopAreaFormComponent::nameEng');
  }

  getNameLongFin() {
    return cy.getByTestId('StopAreaFormComponent::nameLongFin');
  }

  getNameLongSwe() {
    return cy.getByTestId('StopAreaFormComponent::nameLongSwe');
  }

  getNameLongEng() {
    return cy.getByTestId('StopAreaFormComponent::nameLongEng');
  }

  getAbbreviationFin() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationFin');
  }

  getAbbreviationSwe() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationSwe');
  }

  getAbbreviationEng() {
    return cy.getByTestId('StopAreaFormComponent::abbreviationEng');
  }

  getLatitude() {
    return cy.getByTestId('StopAreaFormComponent::latitude');
  }

  getLongitude() {
    return cy.getByTestId('StopAreaFormComponent::longitude');
  }

  /** Clicks the EditStopAreaModal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditStopAreaModal')
      .findByTestId('EditStopAreaModal::saveButton')
      .click({ force: forceAction });
  }
}
