import { StopTableRow } from '../StopTableRow';

export class StopAreaMemberStops {
  private stopTableRow = new StopTableRow();

  getStopRow = (label: string) => this.stopTableRow.row(label);

  getAddStopButton = () => cy.getByTestId('MemberStops::addStopButton');
}
