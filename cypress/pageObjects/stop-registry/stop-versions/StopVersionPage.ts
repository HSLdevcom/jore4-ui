import { VersionPageBase } from '../../common/VersionPagePageObject';

class StopVersionPageImpl extends VersionPageBase {
  protected pageTestIdPrefix = 'StopVersionsPage';

  visit(label: string) {
    return cy.visit(`/stop-registry/stops/${label}/versions`);
  }

  names() {
    return cy.getByTestId('StopVersionsPage::names');
  }
}

export const StopVersionPage = new StopVersionPageImpl();
