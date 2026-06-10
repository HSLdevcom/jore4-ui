import { VersionPageBase } from '../../common/VersionPagePageObject';

class StopVersionPageImpl extends VersionPageBase {
  protected pageTestIdPrefix = 'StopVersionsPage';

  static visit(label: string) {
    return cy.visit(`/stop-registry/stops/${label}/versions`);
  }

  visit = (label: string) => StopVersionPageImpl.visit(label);

  static names() {
    return cy.getByTestId('StopVersionsPage::names');
  }

  names = () => StopVersionPageImpl.names();

  // Static versions of inherited methods for consistency
  static pageLoader() {
    return new StopVersionPageImpl().pageLoader();
  }

  static title() {
    return new StopVersionPageImpl().title();
  }

  static returnButton() {
    return new StopVersionPageImpl().returnButton();
  }

  static startDate() {
    return new StopVersionPageImpl().startDate();
  }

  static endDate() {
    return new StopVersionPageImpl().endDate();
  }

  static showHideScheduled() {
    return new StopVersionPageImpl().showHideScheduled();
  }

  static scheduledVersions() {
    return new StopVersionPageImpl().scheduledVersions();
  }

  static showHideDrafts() {
    return new StopVersionPageImpl().showHideDrafts();
  }

  static draftVersions() {
    return new StopVersionPageImpl().draftVersions();
  }
}

export const StopVersionPage = StopVersionPageImpl;
