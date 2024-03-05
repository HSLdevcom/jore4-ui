import { VehicleJourneyGroupInfo } from '../../../VehicleJourneyGroupInfo';

export class TimetableVersionDetailsPanel {
  vehicleJourneyGroupInfo = new VehicleJourneyGroupInfo();

  getHeading = () => {
    return cy.getByTestId('TimetableVersionPanelHeading::heading');
  };

  getRows = () => {
    return cy.getByTestId('ExpandableRouteTimetableRow::row');
  };

  expandNthRow = ({ rowNumber }: { rowNumber: number }) => {
    this.getRows()
      .eq(rowNumber)
      .findByTestId('ExpandableRouteTimetableRow::AccordionButton')
      .click();
  };

  close = () => {
    cy.getByTestId('TimetableVersionPanelHeading::closeButton').click();
  };
}
