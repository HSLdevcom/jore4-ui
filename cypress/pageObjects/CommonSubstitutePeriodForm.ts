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
      .getPeriodContainer(values.periodName)
      .within(() => {
        this.commonSubstitutePeriodItem.selectSubstituteDayOfWeek(
          values.substituteDay,
        );
        if (values.lineType) {
          this.commonSubstitutePeriodItem.selectLineType(values.lineType);
        }
      });
  }

  removeCommonSubstituteDay(periodName: string) {
    this.commonSubstitutePeriodItem.clickCommonSubstitutePeriodEditCloseButton(
      periodName,
    );
    this.getSaveButton().click();
  }

  getLoadingIndicator() {
    return cy.getByTestId(
      'CommonSubstitutePeriodForm::LoadingCommonSubstitutePeriods',
    );
  }
}
