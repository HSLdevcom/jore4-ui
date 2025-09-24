type IsSelectedOptions = {
  readonly isSelected: boolean;
  readonly considerAll: boolean;
};

export class MultiselectDropDown {
  readonly baseId: string;

  constructor(baseId: string) {
    this.baseId = baseId;
  }

  getDropdown() {
    return cy.getByTestId(`${this.baseId}::button`);
  }

  getOptions() {
    return cy.get(`[data-testid^="${this.baseId}::Option::"]`);
  }

  openDropdown() {
    this.getDropdown().click();
  }

  toggleOption(option: string) {
    this.getOption(option).click();
  }

  isSelected(option: string, options: Partial<IsSelectedOptions> = {}) {
    const { isSelected = true, considerAll = false } = options;

    if (!considerAll) {
      this.getOption(option).should(
        'have.attr',
        'aria-selected',
        String(isSelected),
      );
    } else {
      this.getOptions()
        .filter(
          this.contentOrKeyToFindOptions(option)
            .concat('[data-testid$="::all"]')
            .join(', '),
        )
        .should('have.attr', 'aria-selected', String(isSelected));
    }
  }

  isNotSelected(option: string, considerAll = false) {
    this.isSelected(option, { isSelected: false, considerAll });
  }

  private contentOrKeyToFindOptions(contentOrKey: string) {
    return [`:contains(${contentOrKey})`, `[data-testid$="::${contentOrKey}"]`];
  }

  private getOption(contentOrKey: string) {
    return this.getOptions().filter(
      this.contentOrKeyToFindOptions(contentOrKey).join(', '),
    );
  }
}
