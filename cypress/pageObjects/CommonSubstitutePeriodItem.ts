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

  selectSubstituteDayOfWeek(dayName: string) {
    this.getSubstituteDayOfWeekDropdown().click();
    cy.get('li').contains(dayName).click();
  }

  /**
   * Checks the checkboxes for the line types that
   * are provided as arguments.
   * Checkbox unchecking is NOT needed
   * because none of the line type checkboxes are checked initially.
   */
  selectLineTypes(lineTypes: string[]) {
    this.getLineTypeDropdown().click();
    cy.wrap(lineTypes).each((lineType: string) => {
      this.getLineTypesList().find('li').contains(lineType).click();
    });
    this.getLineTypeDropdown().click();
  }
}
