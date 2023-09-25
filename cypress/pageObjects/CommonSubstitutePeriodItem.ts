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

  selectLineTypes(lineTypes: string[]) {
    this.getLineTypeDropdown().click();
    // Sometimes checkboxes are all checked and sometimes none are checked.
    // Uncheck them all if any are checked.
    this.getLineTypesList().then((ul) => {
      if (ul.find('input[type="checkbox"]:checked').length > 0) {
        cy.get('input[type="checkbox"]:checked').uncheck();
      }
    });
    cy.wrap(lineTypes).each((lineType: string) => {
      this.getLineTypesList().find('li').contains(lineType).click();
    });
    this.getLineTypeDropdown().click();
  }
}
