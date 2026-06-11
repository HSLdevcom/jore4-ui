import { VersionRowBase } from '../../common/VersionRowPageObject';

class RouteVersionRowImpl extends VersionRowBase {
  protected rowTestIdPrefix = 'RouteVersionRow';

  actionMenuShowOnMap() {
    return cy.getByTestId('RouteVersionRow::ActionMenu::ShowOnMap');
  }
}

export const RouteVersionRow = new RouteVersionRowImpl();
