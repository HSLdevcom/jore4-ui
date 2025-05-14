import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { PriorityForm } from './PriorityForm';

export interface TemplateRouteSelectorInfo {
  priority?: Priority;
  label: string;
}

export class TemplateRouteSelector {
  private priorityForm = new PriorityForm();

  setPriority = (priority: Priority) => {
    // With some screen sizes the element is just outside view and tests will fail...
    cy.getByTestId('TemplateRouteSelector::container').scrollIntoView({
      offset: { top: 500, left: 0 },
    });
    // scrollIntoView is unsafe so can't chain further.

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
      this.getChooseRouteDropdownButton().click();
      this.getChooseRouteDropdown()
        .find('[role="option"]')
        .contains(values.label)
        .click();
    }
  }
}
