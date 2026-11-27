import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

const temporaryLevels: ReadonlyArray<Priority> = [
  Priority.Temporary1,
  Priority.Temporary2,
];

export class PriorityFilter {
  openTemporaryLevels() {
    return cy
      .getByTestId('StopSearchBar::temporaryPriorityDropdown::button')
      .then(($button) => {
        if ($button.attr('aria-expanded') !== 'true') {
          cy.wrap($button).click();
        }
      });
  }

  getCheckbox(priority: Priority) {
    if (temporaryLevels.includes(priority)) {
      this.openTemporaryLevels();
    }
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
