export class CommonSubstitutePeriodItem {
  getContainer(periodName: string) {
    return cy.getByTestId(
      `CommonSubstitutePeriodItem::container::${periodName}`,
    );
  }

  getEditButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::editButton');
  }

  getCloseButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::closeButton');
  }

  clickCommonSubstitutePeriodEditButton(periodName: string) {
    this.getContainer(periodName).within(() => {
      this.getEditButton().click();
    });
  }

  clickCommonSubstitutePeriodCloseButton(periodName: string) {
    this.getContainer(periodName).within(() => {
      this.getCloseButton().click();
    });
  }

  getSubstituteDayOfWeekDropdown() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::substituteDayOfWeekDropdown::ListboxButton',
    );
  }

  getLineTypeDropdown() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::lineTypesDropdown::ListboxButton',
    );
  }

  getLineTypesList() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::lineTypesDropdown::ListboxOptions',
    );
  }
}
