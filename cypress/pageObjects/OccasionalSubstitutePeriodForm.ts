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

  selectLineTypes(lineTypes: string[]) {
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
    this.getLineTypesList().then((ul) => {
      if (ul.find('input[type="checkbox"]:checked').length > 0) {
        cy.get('input[type="checkbox"]:checked').uncheck();
      }
    });
    cy.wrap(lineTypes).each((lineType: string) => {
      cy.get('li').contains(lineType).click();
    });

    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
  }

  fillOccasionalSubstitutePeriodForm(
    values: OccasionalSubstitutePeriodFormInfo,
    nth: number,
  ) {
    this.getOccasionalSubstitutePeriodRow()
      .eq(nth)
      .within(() => {
        this.getOccasionalSubstitutePeriodFormPeriodName()
          .clear()
          .type(values.name);
        this.getOccasionalSubstitutePeriodFormBeginDate().type(
          values.beginDate,
        );
        this.getOccasionalSubstitutePeriodFormBeginTime()
          .clear()
          .type(values.beginTime);
        this.getOccasionalSubstitutePeriodFormEndDate()
          .clear()
          .type(values.endDate);
        this.getOccasionalSubstitutePeriodFormEndTime()
          .clear()
          .type(values.endTime);
        this.selectDayType(values.substituteDay);
        if (values.lineTypes) {
          this.selectLineTypes(values.lineTypes);
        }
      });
  }

  deleteOccasionalSubstituteDay(nth: number) {
    this.getRemoveOccasionalSubstitutePeriodButton().eq(nth).click();
  }
}
