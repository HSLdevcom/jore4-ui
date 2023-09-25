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
    /**
     * Unchecks all line type checkboxes if any are checked
     * and then checks the checkboxes for the line types that
     * are provided as arguments. Checkbox unchecking is needed
     * because the element functionality is unstable in Cypress and
     * sometimes checkboxes are all checked and sometimes none are checked
     * initially.
     */
    this.getLineTypeDropdown().click();
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
