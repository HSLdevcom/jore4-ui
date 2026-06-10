import { createVersionRowPageObject } from '../../common/VersionRowPageObject';

const BaseStopVersionRow = createVersionRowPageObject('StopVersionRow');

export class StopVersionRow extends BaseStopVersionRow {
  static actionMenuShowOnMap() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');
  }

  actionMenuShowOnMap = () => StopVersionRow.actionMenuShowOnMap();

  static actionMenuShowStopDetails() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');
  }

  actionMenuShowStopDetails = () => StopVersionRow.actionMenuShowStopDetails();
}
