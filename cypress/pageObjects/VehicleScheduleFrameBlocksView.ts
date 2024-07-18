import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

export class VehicleScheduleFrameBlocksView {
  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  getToggleShowTableButton() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::toggleShowTable');
  }

  getFrameTitleRow() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::frameTitleRow');
  }

  getTables() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  getNthTable(nth: number) {
    return this.getTables().eq(nth);
  }

  getValidityTimeRangeText() {
    return cy.getByTestId(
      'VehicleScheduleFrameBlocksView::validityTimeRangeText',
    );
  }
}
