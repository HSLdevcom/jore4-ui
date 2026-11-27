import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { PriorityForm } from './PriorityForm';

export interface TemplateRouteSelectorInfo {
  priority?: Priority;
  label: string;
}

export class TemplateRouteSelector {
  static setPriority = (priority: Priority) =>
    cy
      .getByTestId('TemplateRouteSelector::container')
      .within(() => PriorityForm.setPriority(priority));

  static getChooseRouteDropdown() {
    return cy.getByTestId('TemplateRouteSelector::chooseRouteDropdown');
  }

  static getChooseRouteDropdownButton() {
    return cy.getByTestId('TemplateRouteSelector::chooseRouteDropdown::button');
  }

  static fillForm(values: TemplateRouteSelectorInfo) {
    if (values.priority) {
      TemplateRouteSelector.setPriority(values.priority);
    }
    if (values.label) {
      TemplateRouteSelector.getChooseRouteDropdownButton().scrollIntoViewAndClick();
      cy.get('[role="option"]').contains(values.label).click();
    }
  }
}
