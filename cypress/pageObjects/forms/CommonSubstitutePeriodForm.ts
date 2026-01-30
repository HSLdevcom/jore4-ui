import { CommonSubstitutePeriodItem } from '../timetables/CommonSubstitutePeriodItem';

export class CommonSubstitutePeriodForm {
  static commonSubstitutePeriodItem = CommonSubstitutePeriodItem;

  static getSaveButton() {
    return cy.getByTestId('CommonSubstitutePeriodForm::saveButton');
  }

  static editCommonSubstitutePeriod(values: {
    periodName: string;
    substituteDay: string;
    lineTypes?: string[];
  }) {
    CommonSubstitutePeriodItem.clickCommonSubstitutePeriodEditButton(
      values.periodName,
    );
    CommonSubstitutePeriodItem.getContainer(values.periodName).within(() => {
      CommonSubstitutePeriodItem.getSubstituteDayOfWeekDropdown().click();
      cy.withinHeadlessPortal(() =>
        cy.get('[role="option"]').contains(values.substituteDay).click(),
      );

      if (values.lineTypes?.length) {
        CommonSubstitutePeriodItem.getLineTypeDropdown().click();

        cy.withinHeadlessPortal(() =>
          values.lineTypes?.forEach((lineType: string) => {
            CommonSubstitutePeriodItem.getLineTypesList()
              .find('[role="option"]')
              .contains(lineType)
              .click();
          }),
        );

        cy.closeDropdown();
      }
    });
  }

  static removeCommonSubstitutePeriod(periodName: string) {
    CommonSubstitutePeriodItem.clickCommonSubstitutePeriodCloseButton(
      periodName,
    );
    CommonSubstitutePeriodForm.getSaveButton().click();
  }
}
