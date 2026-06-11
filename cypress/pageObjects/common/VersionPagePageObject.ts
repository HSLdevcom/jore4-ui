import Chainable = Cypress.Chainable;

/**
 * Base class for version pages with common functionality
 */
export abstract class VersionPageBase {
  protected abstract pageTestIdPrefix: string;

  pageLoader(): Chainable<JQuery> {
    return cy.getByTestId(`${this.pageTestIdPrefix}::LoadingWrapper`);
  }

  title(): Chainable<JQuery> {
    return cy.getByTestId(`${this.pageTestIdPrefix}::title`);
  }

  returnButton(): Chainable<JQuery> {
    return cy.getByTestId(`${this.pageTestIdPrefix}::returnButton`);
  }

  startDate(): Chainable<JQuery> {
    return cy.getByTestId(
      'ScheduledVersionsContainer::DateRangeInputs::startDate',
    );
  }

  endDate(): Chainable<JQuery> {
    return cy.getByTestId(
      'ScheduledVersionsContainer::DateRangeInputs::endDate',
    );
  }

  showHideScheduled(): Chainable<JQuery> {
    return cy.getByTestId('ScheduledVersionsContainer::showHideButton');
  }

  scheduledVersions(): Chainable<JQuery> {
    return cy.getByTestId('ScheduledVersionsContainer::versionTable');
  }

  showHideDrafts(): Chainable<JQuery> {
    return cy.getByTestId('DraftVersionsContainer::showHideButton');
  }

  draftVersions(): Chainable<JQuery> {
    return cy.getByTestId('DraftVersionsContainer::versionTable');
  }
}
