import { Priority } from '@hsl/jore4-test-db-manager';

export interface TemplateRouteSelectorInfo {
  priority?: Priority;
  label: string;
}

export class TemplateRouteSelector {
  setAsStandard() {
    return cy
      .getByTestId('TemplateRouteSelector::standardPriorityButton')
      .click();
  }

  setAsDraft() {
    return cy.getByTestId('TemplateRouteSelector::draftPriorityButton').click();
  }

  setAsTemporary() {
    return cy
      .getByTestId('TemplateRouteSelector::temporaryPriorityButton')
      .click();
  }

  setPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.Draft:
        this.setAsDraft();
        break;
      case Priority.Temporary:
        this.setAsTemporary();
        break;
      case Priority.Standard:
        this.setAsStandard();
        break;
      default:
        throw new Error(`Unknown priority "${priority}"`);
    }
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
      this.getChooseRouteDropdown().find('li').contains(values.label).click();
    }
  }
}
