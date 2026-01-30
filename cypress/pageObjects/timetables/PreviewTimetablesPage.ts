import { ConfirmPreviewedTimetablesImportForm } from '../forms/ConfirmPreviewedTimetablesImportForm';
import { TimetablesImportPriorityForm } from '../forms/TimetablesImportPriorityForm';
import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';
import { VehicleScheduleFrameBlocksView } from './VehicleScheduleFrameBlocksView';

export class PreviewTimetablesPage {
  static priorityForm = TimetablesImportPriorityForm;

  static blockVehicleJourneysTable = BlockVehicleJourneysTable;

  static confirmPreviewedTimetablesImportForm =
    ConfirmPreviewedTimetablesImportForm;

  static vehicleScheduleFrameBlocksView = VehicleScheduleFrameBlocksView;

  static getSaveButton() {
    return cy.getByTestId('PreviewTimetablesPage::saveButton');
  }

  static getTitle() {
    return cy.getByTestId('PreviewTimetablesPage::previewTitle');
  }

  static getVehicleScheduleFrameBlockByLabel(label: string) {
    return cy.getByTestId(
      `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
    );
  }
}
