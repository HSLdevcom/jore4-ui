export class VehicleScheduleFrameBlocksView {
  getBlockByFrameLabel(label: string) {
    return cy.getByTestId(`VehicleScheduleFrameBlocksView::block::${label}`);
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
