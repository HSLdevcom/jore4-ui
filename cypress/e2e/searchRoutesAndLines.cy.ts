import pick from 'lodash/pick';
import { getClonedBaseDbResources } from '../datasets/base';
import { Tag } from '../enums';
import { RoutesAndLinesPage, SearchResultsPage } from '../pageObjects';
import { insertToDbHelper } from '../utils';
import { expectGraphQLCallToSucceed } from '../utils/assertions';

const dbResources = pick(getClonedBaseDbResources(), 'lines', 'routes');

const rootTags: Cypress.SuiteConfigOverrides = { tags: [Tag.Search] };
describe('Verify that route and line search works', rootTags, () => {
  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
    RoutesAndLinesPage.searchContainer.getSearchInput().clear();
  });

  it(
    'Searches for a line with exact label',
    { tags: [Tag.Lines, Tag.Smoke] },
    () => {
      RoutesAndLinesPage.searchContainer.getSearchInput().type(`9999{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      SearchResultsPage.getSearchResultsContainer().should(
        'contain',
        '1 hakutulosta',
      );
      SearchResultsPage.getLinesSearchResultTable()
        .should('contain', `line 9999`)
        .and('not.contain', 'line 9998');
    },
  );

  it('Searches for lines with an asterisk', { tags: [Tag.Lines] }, () => {
    RoutesAndLinesPage.searchContainer.getSearchInput().type('9*{enter}');
    expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

    SearchResultsPage.getSearchResultsContainer().should(
      'contain',
      '3 hakutulosta',
    );
    SearchResultsPage.getLinesSearchResultTable()
      .should('contain', '9999')
      .and('contain', '9888')
      .and('contain', '901');
    SearchResultsPage.getLinesSearchResultTable()
      .should('not.contain', '8888')
      .and('not.contain', '8889');
  });

  it(
    'Searches for a route with an exact label',
    { tags: [Tag.Routes, Tag.Smoke] },
    () => {
      RoutesAndLinesPage.searchContainer.getSearchInput().type(`1999{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      SearchResultsPage.getRoutesResultsButton().click();
      SearchResultsPage.getSearchResultsContainer().should(
        'contain',
        '1 hakutulosta',
      );
      SearchResultsPage.getRoutesSearchResultTable()
        .should('contain', '1999')
        .and('not.contain', '1888');
    },
  );

  it('Searches for routes with an asterisk', { tags: Tag.Routes }, () => {
    RoutesAndLinesPage.searchContainer.getSearchInput().type('1*{enter}');
    expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

    SearchResultsPage.getRoutesResultsButton().click();
    SearchResultsPage.getSearchResultsContainer().should(
      'contain',
      '2 hakutulosta',
    );
    SearchResultsPage.getRoutesSearchResultTable()
      .should('contain', 'route 1999')
      .and('contain', 'route 1888');
  });

  it(
    'Should show valid results according to the observation date',
    { tags: [Tag.Lines, Tag.Routes] },
    () => {
      RoutesAndLinesPage.searchContainer.getSearchInput().type('*');
      RoutesAndLinesPage.searchContainer.setObservationDate('2024-04-01');
      RoutesAndLinesPage.searchContainer.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      SearchResultsPage.getLinesResultsButton().click();
      SearchResultsPage.getLinesSearchResultTable()
        // Line 1777 is valid in 2024.
        .should('contain', '1777')
        // 8889 is always valid.
        .and('contain', '8889')
        // The other two are not valid in 2024.
        .and('not.contain', '2666')
        .and('not.contain', '1666');
      SearchResultsPage.getRoutesResultsButton().click();
      SearchResultsPage.getRoutesSearchResultTable()
        // Route 2333 is valid in 2024 and the other two are not
        .should('contain', '2333')
        .and('not.contain', '1222')
        .and('not.contain', '1111');
    },
  );

  it(
    'Should show valid results according to the selected transportation modes',
    { tags: [Tag.Lines, Tag.Routes] },
    () => {
      RoutesAndLinesPage.searchContainer.getSearchInput().type('*');
      RoutesAndLinesPage.searchContainer.getChevron().click();
      RoutesAndLinesPage.searchContainer
        .toggleTransportationMode('bus')
        .click();

      RoutesAndLinesPage.searchContainer.getExpandedSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      SearchResultsPage.getLinesResultsButton().click();
      SearchResultsPage.getLinesSearchResultTable()
        .should('not.contain', '1777')
        .and('not.contain', '8889')
        .and('not.contain', '2666')
        .and('not.contain', '1666');
      SearchResultsPage.getRoutesResultsButton().click();
      SearchResultsPage.getRoutesSearchResultTable()
        .should('not.contain', '2333')
        .and('not.contain', '1222')
        .and('not.contain', '1111');
    },
  );
});
