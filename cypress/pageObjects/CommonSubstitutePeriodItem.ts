export interface CommonSubstitutePeriodItemInfo {
  periodName: string;
  substituteDay: string;
  lineType?: string;
}

export class CommonSubstitutePeriodItem {
  getPeriodContainer(periodName: string) {
    return cy.getByTestId(
      `CommonSubstitutePeriodItem::container::${periodName}`,
    );
  }

  getEditCloseButton() {
    return cy.getByTestId('CommonSubstitutePeriodItem::editCloseButton');
  }

  clickCommonSubstitutePeriodEditCloseButton(periodName: string) {
    this.getPeriodContainer(periodName).within(() => {
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

  selectSubstituteDayOfWeek(dayName: string) {
    this.getSubstituteDayOfWeekDropdown().click();
    cy.get('li').contains(dayName).click();
  }

  selectLineType(lineType: string) {
    this.getLineTypeDropdown().click();
    // Sometimes checkboxes are all checked and sometimes none are checked.
    // Uncheck them all if any are checked.
    cy.get('ul').then((ul) => {
      if (ul.find('input[type="checkbox"]:checked').length > 0) {
        cy.get('input[type="checkbox"]:checked').uncheck();
      }
    });
    cy.get('li').contains(lineType).click();
    this.getLineTypeDropdown().click();
  }
}
