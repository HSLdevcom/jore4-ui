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
  getAddOccasionalSubstitutePeriodButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodForm::addRowButton');
  }

  getSaveButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodForm::saveButton');
  }

  getRemoveOccasionalSubstitutePeriodButton() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::removeButton');
  }

  getOccasionalSubstitutePeriodFormPeriodName() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::periodName');
  }

  getOccasionalSubstitutePeriodFormBeginDate() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::beginDate');
  }

  getOccasionalSubstitutePeriodFormBeginTime() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::beginTime');
  }

  getOccasionalSubstitutePeriodFormEndDate() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::endDate');
  }

  getOccasionalSubstitutePeriodFormEndTime() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::endTime');
  }

  getOccasionalSubstitutePeriodFormDayTypeDropdown() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown::ListboxButton',
    );
  }

  getDayTypeList() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown::ListboxOptions',
    );
  }

  getOccasionalSubstitutePeriodRow() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow');
  }

  getOccasionalSubstitutePeriodFormLineTypesDropdown() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::lineTypesDropdown::ListboxButton',
    );
  }

  getLineTypesList() {
    return cy.getByTestId(
      'OccasionalSubstitutePeriodRow::lineTypesDropdown::ListboxOptions',
    );
  }

  selectDayType(dayType: string) {
    this.getOccasionalSubstitutePeriodFormDayTypeDropdown().click();
    this.getDayTypeList().find('li').contains(dayType).click();
  }

  /**
   * Unchecks all line type checkboxes by presing the "Kaikki" option
   * and then checks the checkboxes for the line types that
   * are provided as arguments.
   *
   * Checkbox unchecking is needed
   * because checkboxes are all checked initially.
   */
  selectLineTypes(lineTypes: string[]) {
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
    // This could be in a separate function
    // Deselect all line types
    cy.get('li').contains('Kaikki').click();

    // Select linetypes that are provided as arguments
    cy.wrap(lineTypes).each((lineType: string) => {
      cy.get('li').contains(lineType).click();
    });

    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
  }

  fillNthOccasionalSubstitutePeriodForm(values: {
    nth: number;
    formInfo: OccasionalSubstitutePeriodFormInfo;
  }) {
    this.getOccasionalSubstitutePeriodRow()
      .eq(values.nth)
      .within(() => {
        this.getOccasionalSubstitutePeriodFormPeriodName()
          .clear()
          .type(values.formInfo.name);
        this.getOccasionalSubstitutePeriodFormBeginDate().type(
          values.formInfo.beginDate,
        );
        this.getOccasionalSubstitutePeriodFormBeginTime()
          .clear()
          .type(values.formInfo.beginTime);
        this.getOccasionalSubstitutePeriodFormEndDate()
          .clear()
          .type(values.formInfo.endDate);
        this.getOccasionalSubstitutePeriodFormEndTime()
          .clear()
          .type(values.formInfo.endTime);
        this.selectDayType(values.formInfo.substituteDay);
        if (values.formInfo.lineTypes) {
          this.selectLineTypes(values.formInfo.lineTypes);
        }
      });
  }

  deleteNthOccasionalSubstituteDay(nth: number) {
    this.getRemoveOccasionalSubstitutePeriodButton().eq(nth).click();
  }
}
