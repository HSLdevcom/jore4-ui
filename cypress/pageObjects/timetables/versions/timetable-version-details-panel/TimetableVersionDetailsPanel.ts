import { VehicleJourneyGroupInfo } from '../../VehicleJourneyGroupInfo';

export class TimetableVersionDetailsPanel {
  static vehicleJourneyGroupInfo = VehicleJourneyGroupInfo;

  static getHeading = () => {
    return cy.getByTestId('TimetableVersionPanelHeading::heading');
  };

  static getRows = () => {
    return cy.getByTestId('ExpandableRouteTimetableRow::row');
  };

  static toggleExpandNthRow = (rowNumber: number) => {
    TimetableVersionDetailsPanel.getRows()
      .eq(rowNumber)
      .findByTestId('ExpandableRouteTimetableRow::AccordionButton')
      .click();
  };

  static close = () => {
    cy.getByTestId('TimetableVersionPanelHeading::closeButton').click();
  };
}
