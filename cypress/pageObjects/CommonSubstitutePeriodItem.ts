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

  // TODO: Refactor or remove, there could be multiple substitituteDayOfWeekDropdown's available to be clicked
  selectSubstituteDayOfWeek(dayName: string) {
    this.getSubstituteDayOfWeekDropdown().click();
    cy.get('li').contains(dayName).click();
  }

  // TODO: Refactor or remove. This can't be called at all without '.within()', because the getLineTypeDropdown
  // Will always find multiple dropdowns and doesn't know which one to click.
  selectLineTypes(lineTypes: string[]) {
    this.getLineTypeDropdown().eq(3).click();

    cy.wrap(lineTypes).each((lineType: string) => {
      this.getLineTypesList().find('li').contains(lineType).click();
    });
    this.getLineTypeDropdown().click();
  }
}
