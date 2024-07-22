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
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodEditCloseButton(
      values.periodName,
    );
    this.commonSubstitutePeriodItem
      .getContainer(values.periodName)
      .within(() => {
        this.commonSubstitutePeriodItem
          .getSubstituteDayOfWeekDropdown()
          .click();
        cy.get('[role="option"]').contains(values.substituteDay).click();

        if (values.lineTypes) {
          this.commonSubstitutePeriodItem.getLineTypeDropdown().click();

          cy.wrap(values.lineTypes).each((lineType: string) => {
            this.commonSubstitutePeriodItem
              .getLineTypesList()
              .find('[role="option"]')
              .contains(lineType)
              .click();
          });
          this.commonSubstitutePeriodItem.getLineTypeDropdown().click();
        }
      });
  }

  removeCommonSubstitutePeriod(periodName: string) {
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodEditCloseButton(
      periodName,
    );
    this.getSaveButton().click();
  }
}
