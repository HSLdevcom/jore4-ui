import { createVersionRowPageObject } from '../../common/VersionRowPageObject';

const BaseRouteVersionRow = createVersionRowPageObject('RouteVersionRow');

export class RouteVersionRow extends BaseRouteVersionRow {
  static actionMenuShowOnMap() {
    return cy.getByTestId('RouteVersionRow::ActionMenu::ShowOnMap');
  }

  actionMenuShowOnMap = () => RouteVersionRow.actionMenuShowOnMap();
}
