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
        this.commonSubstitutePeriodItem
          .getSubstituteDayOfWeekDropdown()
          .click();
        cy.get('li').contains(values.substituteDay).click();

        if (values.lineTypes) {
          this.commonSubstitutePeriodItem.getLineTypeDropdown().click();

          cy.wrap(values.lineTypes).each((lineType: string) => {
            this.commonSubstitutePeriodItem
              .getLineTypesList()
              .find('li')
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
