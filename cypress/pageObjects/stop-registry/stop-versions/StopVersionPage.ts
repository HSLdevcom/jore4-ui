export class StopVersionPage {
  static visit(label: string) {
    return cy.visit(`/stop-registry/stops/${label}/versions`);
  }

  visit = (label: string) => StopVersionPage.visit(label);

  static pageLoader() {
    return cy.getByTestId('StopVersionsPage::LoadingWrapper');
  }

  pageLoader = () => StopVersionPage.pageLoader();

  static title() {
    return cy.getByTestId('StopVersionsPage::title');
  }

  title = () => StopVersionPage.title();

  static returnButton() {
    return cy.getByTestId('StopVersionsPage::returnButton');
  }

  returnButton = () => StopVersionPage.returnButton();

  static names() {
    return cy.getByTestId('StopVersionsPage::names');
  }

  names = () => StopVersionPage.names();

  static startDate() {
    return cy.getByTestId(
      'ScheduledVersionsContainer::DateRangeInputs::startDate',
    );
  }

  startDate = () => StopVersionPage.startDate();

  static endDate() {
    return cy.getByTestId(
      'ScheduledVersionsContainer::DateRangeInputs::endDate',
    );
  }

  endDate = () => StopVersionPage.endDate();

  static showHideScheduled() {
    return cy.getByTestId('ScheduledVersionsContainer::showHideButton');
  }

  showHideScheduled = () => StopVersionPage.showHideScheduled();

  static scheduledVersions() {
    return cy.getByTestId('ScheduledVersionsContainer::versionTable');
  }

  scheduledVersions = () => StopVersionPage.scheduledVersions();

  static showHideDrafts() {
    return cy.getByTestId('DraftVersionsContainer::showHideButton');
  }

  showHideDrafts = () => StopVersionPage.showHideDrafts();

  static draftVersions() {
    return cy.getByTestId('DraftVersionsContainer::versionTable');
  }

  draftVersions = () => StopVersionPage.draftVersions();
}
