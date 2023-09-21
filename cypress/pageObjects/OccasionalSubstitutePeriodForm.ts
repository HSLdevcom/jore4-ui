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

  openOccasionalSubstitutePeriodForm() {
    // Clicking the '+' button does not always open the form for some reason
    // and waiting seems to help with that
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    this.getAddOccasionalSubstitutePeriodButton().click();
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
    // Sometimes checkboxes are all checked and sometimes none are checked.
    // Uncheck them all if any are checked.
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown()
      .next('ul')
      .then((list) => {
        if (list.find('input[type="checkbox"]:checked').length > 0) {
          cy.get('input[type="checkbox"]:checked').uncheck();
        }
      });
    cy.get('li').contains(lineType).click();
    this.getOccasionalSubstitutePeriodFormLineTypesDropdown().click();
  }

  fillOccasionalSubstitutePeriodForm(
    values: OccasionalSubstitutePeriodFormInfo,
  ) {
    // // The form sometimes closes for some reason unless wait is used before filling it
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
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
