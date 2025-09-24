import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export class PriorityFilter {
  getCheckbox(priority: Priority) {
    return cy.getByTestId(`StopSearchBar::priority::${Priority[priority]}`);
  }

  toggle(priority: Priority) {
    return this.getCheckbox(priority).click();
  }

  set(priority: Priority, include: boolean) {
    this.getCheckbox(priority).then((checkBox) => {
      const checked = !!checkBox.prop('checked');
      if (checked !== include) {
        this.toggle(priority);
      }
    });
  }
}
