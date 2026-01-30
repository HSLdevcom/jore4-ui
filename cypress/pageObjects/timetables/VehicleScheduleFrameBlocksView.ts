import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

export class VehicleScheduleFrameBlocksView {
  static blockVehicleJourneysTable = BlockVehicleJourneysTable;

  static getToggleShowTableButton() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::toggleShowTable');
  }

  static getFrameTitleRow() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::frameTitleRow');
  }

  static getTables() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  static getNthTable(nth: number) {
    return VehicleScheduleFrameBlocksView.getTables().eq(nth);
  }

  static getValidityTimeRangeText() {
    return cy.getByTestId(
      'VehicleScheduleFrameBlocksView::validityTimeRangeText',
    );
  }
}
