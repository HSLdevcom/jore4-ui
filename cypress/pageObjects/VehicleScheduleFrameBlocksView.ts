import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

export class VehicleScheduleFrameBlocksView {
  blockVehicleJourneysTable = new BlockVehicleJourneysTable();

  getFrameBlocksByLabel(label: string) {
    return cy.getByTestId(
      `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
    );
  }

  getToggleShowTableButton() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::toggleShowTable');
  }

  getFrameTitleRow() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::frameTitleRow');
  }

  getTables() {
    return cy.getByTestId('BlockVehicleJourneysTable::table');
  }

  getValidityTimeRangeText() {
    return cy.getByTestId(
      'VehicleScheduleFrameBlocksView::validityTimeRangeText',
    );
  }
}
