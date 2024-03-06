export interface CommonSubstitutePeriodItemInfo {
  periodName: string;
  substituteDay: string;
  lineTypes?: string[];
}

export class CommonSubstitutePeriodItem {
  getContainer(periodName: string) {
    return cy.getByTestId(
      `CommonSubstitutePeriodItem::container::${periodName}`,
    );
  }

  getEditCloseButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::editCloseButton');
  }

  clickCommonSubstitutePeriodEditCloseButton(periodName: string) {
    this.getContainer(periodName).within(() => {
      this.getEditCloseButton().click();
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
