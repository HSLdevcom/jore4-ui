export class VehicleScheduleFrameBlocksView {
  getFrameBlocksByLabel(label: string) {
    return cy.getByTestId(
      `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
    );
  }

  getToggleShowTableButton() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::toggleShowTable');
  }

  getTable() {
    return cy.getByTestId('VehicleScheduleFrameBlocksView::table');
  }

  getValidityTimeRangeText() {
    return cy.getByTestId(
      'VehicleScheduleFrameBlocksView::validityTimeRangeText',
    );
  }
}
