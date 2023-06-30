export class VehicleJourneyGroupInfo {
  getChangeValidityButton() {
    return cy.getByTestId('VehicleJourneyGroupInfo::changeValidityButton');
  }

  getValidityTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::validityRangeSpan');
  }

  getTripCount() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripCount');
  }

  getTripTimeRange() {
    return cy.getByTestId('VehicleJourneyGroupInfo::tripTimeRange');
  }

  verifyTripTimeRange(startTime: string, endTime: string) {
    this.getTripTimeRange().should(($range) => {
      // We need to strip whitespace because the span contains a line break character
      // eslint-disable-next-line jest/no-standalone-expect
      expect($range.text().replace(/\s/g, '')).equal(
        `${startTime}...${endTime}`,
      );
    });
  }
}
