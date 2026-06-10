import { VersionPageBase } from '../../common/VersionPagePageObject';

class RouteVersionPageImpl extends VersionPageBase {
  protected pageTestIdPrefix = 'RouteVersionsPage';

  static visit(label: string, direction: string) {
    return cy.visit(`/routes/${label}/${direction}/versions`);
  }

  visit = (label: string, direction: string) =>
    RouteVersionPageImpl.visit(label, direction);

  static lineName() {
    return cy.getByTestId('RouteVersionsPage::lineName');
  }

  lineName = () => RouteVersionPageImpl.lineName();

  // Static versions of inherited methods for consistency
  static pageLoader() {
    return new RouteVersionPageImpl().pageLoader();
  }

  static title() {
    return new RouteVersionPageImpl().title();
  }

  static returnButton() {
    return new RouteVersionPageImpl().returnButton();
  }

  static startDate() {
    return new RouteVersionPageImpl().startDate();
  }

  static endDate() {
    return new RouteVersionPageImpl().endDate();
  }

  static showHideScheduled() {
    return new RouteVersionPageImpl().showHideScheduled();
  }

  static scheduledVersions() {
    return new RouteVersionPageImpl().scheduledVersions();
  }

  static showHideDrafts() {
    return new RouteVersionPageImpl().showHideDrafts();
  }

  static draftVersions() {
    return new RouteVersionPageImpl().draftVersions();
  }
}

export const RouteVersionPage = RouteVersionPageImpl;
