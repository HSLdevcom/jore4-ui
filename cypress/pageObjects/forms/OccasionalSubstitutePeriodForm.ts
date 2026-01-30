interface OccasionalSubstitutePeriodFormInfo {
  name: string;
  beginDate: string;
  beginTime: string;
  endDate: string;
  endTime: string;
  substituteDay: string;
  lineTypes?: string[];
}

export class OccasionalSubstitutePeriodForm {
  static getAddOccasionalSubstitutePeriodButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodForm::addRowButton');
  }

  static getSaveButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodForm::saveButton');
  }

  static getRemoveOccasionalSubstitutePeriodButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::removeButton');
  }

  static getOccasionalSubstitutePeriodFormPeriodName() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::periodName');
  }

  static getOccasionalSubstitutePeriodFormBeginDate() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::beginDate');
  }

  static getOccasionalSubstitutePeriodFormBeginTime() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::beginTime');
  }

  static getOccasionalSubstitutePeriodFormEndDate() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::endDate');
  }

  static getOccasionalSubstitutePeriodFormEndTime() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::endTime');
  }

  static getOccasionalSubstitutePeriodFormDayTypeDropdown() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown::ListboxButton',
    );
  }

  static getDayTypeList() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown::ListboxOptions',
    );
  }

  static getOccasionalSubstitutePeriodRow() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow');
  }

  static getOccasionalSubstitutePeriodFormLineTypesDropdown() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::lineTypesDropdown::ListboxButton',
    );
  }

  static getLineTypesList() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::lineTypesDropdown::ListboxOptions',
    );
  }

  static selectDayType(dayType: string) {
    OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormDayTypeDropdown().click();
    cy.withinHeadlessPortal(() =>
      OccasionalSubstitutePeriodForm.getDayTypeList()
        .find('[role="option"]')
        .contains(dayType)
        .click(),
    );
  }

  static selectLineTypes(lineTypes: string[]) {
    OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
    cy.withinHeadlessPortal(() => {
      cy.get('[role="option"]').contains('Kaikki').click();

      lineTypes.forEach((lineType: string) => {
        cy.get('[role="option"]').contains(lineType).click();
      });
    });

    cy.closeDropdown();
  }

  static fillNthOccasionalSubstitutePeriodForm(values: {
    nth: number;
    formInfo: OccasionalSubstitutePeriodFormInfo;
  }) {
    OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodRow()
      .eq(values.nth)
      .within(() => {
        OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormPeriodName()
          .clear()
          .type(values.formInfo.name);
        OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormBeginDate().type(
          values.formInfo.beginDate,
        );
        OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormBeginTime()
          .clear()
          .type(values.formInfo.beginTime);
        OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormEndDate()
          .clear()
          .type(values.formInfo.endDate);
        OccasionalSubstitutePeriodForm.getOccasionalSubstitutePeriodFormEndTime()
          .clear()
          .type(values.formInfo.endTime);
        OccasionalSubstitutePeriodForm.selectDayType(
          values.formInfo.substituteDay,
        );
        if (values.formInfo.lineTypes) {
          OccasionalSubstitutePeriodForm.selectLineTypes(
            values.formInfo.lineTypes,
          );
        }
      });
  }

  static deleteNthOccasionalSubstituteDay(nth: number) {
    OccasionalSubstitutePeriodForm.getRemoveOccasionalSubstitutePeriodButton()
      .eq(nth)
      .click();
  }
}
