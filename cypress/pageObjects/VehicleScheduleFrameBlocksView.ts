export class VehicleScheduleFrameBlocksView {
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
