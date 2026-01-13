import { CommonSubstitutePeriodItem } from './CommonSubstitutePeriodItem';

export class CommonSubstitutePeriodForm {
  commonSubstitutePeriodItem = new CommonSubstitutePeriodItem();

  getSaveButton() {
    return cy.getByTestId('CommonSubstitutePeriodForm::saveButton');
  }

  editCommonSubstitutePeriod(values: {
    periodName: string;
    substituteDay: string;
    lineTypes?: string[];
  }) {
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodEditButton(
      values.periodName,
    );
    this.commonSubstitutePeriodItem
      .getContainer(values.periodName)
      .within(() => {
        this.commonSubstitutePeriodItem
          .getSubstituteDayOfWeekDropdown()
          .click();
        cy.withinHeadlessPortal(() =>
          cy.get('[role="option"]').contains(values.substituteDay).click(),
        );

        if (values.lineTypes?.length) {
          this.commonSubstitutePeriodItem.getLineTypeDropdown().click();

          cy.withinHeadlessPortal(() =>
            values.lineTypes?.forEach((lineType: string) => {
              this.commonSubstitutePeriodItem
                .getLineTypesList()
                .find('[role="option"]')
                .contains(lineType)
                .click();
            }),
          );

          cy.closeDropdown();
        }
      });
  }

  removeCommonSubstitutePeriod(periodName: string) {
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodCloseButton(
      periodName,
    );
    this.getSaveButton().click();
  }
}
