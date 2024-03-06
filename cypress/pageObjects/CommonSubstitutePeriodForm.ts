import {
  CommonSubstitutePeriodItem,
  CommonSubstitutePeriodItemInfo,
} from './CommonSubstitutePeriodItem';

export class CommonSubstitutePeriodForm {
  commonSubstitutePeriodItem = new CommonSubstitutePeriodItem();

  getSaveButton() {
    return cy.getByTestId('CommonSubstitutePeriodForm::saveButton');
  }

  editCommonSubstitutePeriod(values: CommonSubstitutePeriodItemInfo) {
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodEditCloseButton(
      values.periodName,
    );
    this.commonSubstitutePeriodItem
      .getContainer(values.periodName)
      .within(() => {
        this.commonSubstitutePeriodItem.selectSubstituteDayOfWeek(
          values.substituteDay,
        );
        if (values.lineTypes) {
          this.commonSubstitutePeriodItem.selectLineTypes(values.lineTypes);
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
