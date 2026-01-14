import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { PriorityForm } from './PriorityForm';

export interface TemplateRouteSelectorInfo {
  priority?: Priority;
  label: string;
}

export class TemplateRouteSelector {
  private priorityForm = new PriorityForm();

  setPriority = (priority: Priority) => {
    cy.getByTestId('TemplateRouteSelector::container').within(() => {
      switch (priority) {
        case Priority.Draft:
          this.priorityForm.setAsDraft();
          break;
        case Priority.Temporary:
          this.priorityForm.setAsTemporary();
          break;
        case Priority.Standard:
          this.priorityForm.setAsStandard();
          break;
        default:
          throw new Error(`Unknown priority "${priority}"`);
      }
    });
  };

  getChooseRouteDropdown() {
    return cy.getByTestId('TemplateRouteSelector::chooseRouteDropdown');
  }

  getChooseRouteDropdownButton() {
    return cy.getByTestId('TemplateRouteSelector::chooseRouteDropdown::button');
  }

  fillForm(values: TemplateRouteSelectorInfo) {
    if (values.priority) {
      this.setPriority(values.priority);
    }
    if (values.label) {
      this.getChooseRouteDropdownButton().scrollIntoViewAndClick();
      cy.get('[role="option"]').contains(values.label).click();
    }
  }
}
