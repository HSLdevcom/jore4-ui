import { VersionRowBase } from '../../common/VersionRowPageObject';

class StopVersionRowImpl extends VersionRowBase {
  protected rowTestIdPrefix = 'StopVersionRow';

  actionMenuShowOnMap() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowOnMap');
  }

  actionMenuShowStopDetails() {
    return cy.getByTestId('StopTableRow::ActionMenu::ShowStopDetails');
  }
}

export const StopVersionRow = new StopVersionRowImpl();
