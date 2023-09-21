interface OccasionalSubstitutePeriodFormInfo {
  name: string;
  beginDate: string;
  beginTime: string;
  endDate: string;
  endTime: string;
  substituteDay: string;
  lineType?: string;
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
      'OccasionalSubstitutePeriodRow::substituteDayOfWeekDropdown',
    );
  }

  selectDayType(dayType: string) {
    this.getOccasionalSubstitutePeriodFormDayTypeDropdown().click();
    cy.get('li').contains(dayType).click();
  }

  getOccasionalSubstitutePeriodFormLineTypesDropdown() {
    return cy.getByTestId('OccasionalSubstitutePeriodRow::lineTypesDropdown');
  }

  selectLineType(lineType: string) {
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
    cy.get('ul').then((ul) => {
      if (ul.find('input[type="checkbox"]:checked').length > 0) {
        cy.get('input[type="checkbox"]:checked').uncheck();
      }
    });
    cy.get('li').contains(lineType).click();
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
  }

  fillOccasionalSubstitutePeriodForm(
    values: OccasionalSubstitutePeriodFormInfo,
  ) {
    this.getOccasionalSubstitutePeriodFormPeriodName()
      .clear()
      .type(values.name);
    this.getOccasionalSubstitutePeriodFormBeginDate().type(values.beginDate);
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
    if (values.lineType) {
      this.selectLineType(values.lineType);
    }
  }
}
