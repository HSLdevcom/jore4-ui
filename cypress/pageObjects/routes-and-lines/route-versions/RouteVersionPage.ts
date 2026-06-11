import { VersionPageBase } from '../../common/VersionPagePageObject';

class RouteVersionPageImpl extends VersionPageBase {
  protected pageTestIdPrefix = 'RouteVersionsPage';

  visit(label: string, direction: string) {
    return cy.visit(`/routes/${label}/${direction}/versions`);
  }

  lineName() {
    return cy.getByTestId('RouteVersionsPage::lineName');
  }
}

export const RouteVersionPage = new RouteVersionPageImpl();
