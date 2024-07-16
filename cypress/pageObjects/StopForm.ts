import { ChangeValidityForm } from './ChangeValidityForm';
import { CreateTimingPlaceForm } from './CreateTimingPlaceForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import { ValidityPeriodFormInfo } from './ValidityPeriodForm';

export interface StopFormInfo extends ValidityPeriodFormInfo, PriorityFormInfo {
  label: string;
  longitude?: string;
  latitude?: string;
  timingPlace?: string;
}

export class StopForm {
  changeValidityForm = new ChangeValidityForm();

  createTimingPlaceForm = new CreateTimingPlaceForm();

  priorityForm = new PriorityForm();

  getLabelInput() {
    return cy.getByTestId('StopFormComponent::label');
  }

  getLongitudeInput() {
    return cy.getByTestId('StopFormComponent::longitude');
  }

  getLatitudeInput() {
    return cy.getByTestId('StopFormComponent::latitude');
  }

  getTimingPlaceDropdown() {
    return cy.getByTestId('StopFormComponent::timingPlaceDropdown');
  }

  getAddTimingPlaceButton() {
    return cy.getByTestId('StopFormComponent::addTimingPlaceButton');
  }

  selectTimingPlace(timingPlaceName: string) {
    // type to form to make sure that desired timing place is visible
    this.getTimingPlaceDropdown().type(timingPlaceName);
    // Wait for the search results before trying to find the result list item
    cy.wait('@gqlGetTimingPlacesForCombobox')
      .its('response.statusCode')
      .should('equal', 200);
    this.getTimingPlaceDropdown()
      .find('[role="option"]')
      .contains(timingPlaceName)
      .click();
  }

  fillForm(values: StopFormInfo) {
    this.getLabelInput().clear().type(values.label);
    if (values.latitude) {
      this.getLatitudeInput().clear().type(values.latitude);
    }
    if (values.longitude) {
      this.getLongitudeInput().clear().type(values.longitude);
    }
    if (values.timingPlace) {
      this.selectTimingPlace(values.timingPlace);
    }
    if (values.priority) {
      this.priorityForm.setPriority(values.priority);
    }
    this.changeValidityForm.validityPeriodForm.fillForm(values);
  }

  /** Clicks the Edit stop modal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditStopModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
