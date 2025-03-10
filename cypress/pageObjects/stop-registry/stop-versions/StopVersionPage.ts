export class StopVersionPage {
  visit = (label: string) => cy.visit(`/stop-registry/stops/${label}/versions`);

  pageLoader = () => cy.getByTestId('StopVersionsPage::LoadingWrapper');

  title = () => cy.getByTestId('StopVersionsPage::title');

  returnButton = () => cy.getByTestId('StopVersionsPage::returnButton');

  names = () => cy.getByTestId('StopVersionsPage::names');

  startDate = () =>
    cy.getByTestId('ScheduledVersionsContainer::DateRangeInputs::startDate');

  endDate = () =>
    cy.getByTestId('ScheduledVersionsContainer::DateRangeInputs::endDate');

  showHideScheduled = () =>
    cy.getByTestId('ScheduledVersionsContainer::showHideButton');

  scheduledVersions = () =>
    cy.getByTestId('ScheduledVersionsContainer::versionTable');

  showHideDrafts = () =>
    cy.getByTestId('DraftVersionsContainer::showHideButton');

  draftVersions = () => cy.getByTestId('DraftVersionsContainer::versionTable');
}
