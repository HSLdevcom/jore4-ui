export class CommonSubstitutePeriodItem {
  static getContainer(periodName: string) {
    return cy.getByTestId(
      `CommonSubstitutePeriodItem::container::${periodName}`,
    );
  }

  static getEditButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::editButton');
  }

  static getCloseButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::closeButton');
  }

  static clickCommonSubstitutePeriodEditButton(periodName: string) {
    CommonSubstitutePeriodItem.getContainer(periodName).within(() => {
      CommonSubstitutePeriodItem.getEditButton().click();
    });
  }

  static clickCommonSubstitutePeriodCloseButton(periodName: string) {
    CommonSubstitutePeriodItem.getContainer(periodName).within(() => {
      CommonSubstitutePeriodItem.getCloseButton().click();
    });
  }

  static getSubstituteDayOfWeekDropdown() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::substituteDayOfWeekDropdown::ListboxButton',
    );
  }

  static getLineTypeDropdown() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::lineTypesDropdown::ListboxButton',
    );
  }

  static getLineTypesList() {
    return cy.getByTestId(
      'CommonSubstitutePeriodItem::lineTypesDropdown::ListboxOptions',
    );
  }
}
