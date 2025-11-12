import pick from 'lodash/pick';
import { getClonedBaseDbResources } from '../datasets/base';
import { Tag } from '../enums';
import { RoutesAndLinesPage, SearchResultsPage } from '../pageObjects';
import { insertToDbHelper } from '../utils';
import { expectGraphQLCallToSucceed } from '../utils/assertions';

const dbResources = pick(getClonedBaseDbResources(), 'lines', 'routes');

describe('Verify that route and line search works', () => {
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;

  before(() => {
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
  });

  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
    routesAndLinesPage.searchContainer.getSearchInput().clear();
  });

  it(
    'Searches for a line with exact label',
    { tags: [Tag.Lines, Tag.Smoke] },
    () => {
      routesAndLinesPage.searchContainer.getSearchInput().type(`9999{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', '1 hakutulosta');
      searchResultsPage
        .getLinesSearchResultTable()
        .should('contain', `line 9999`)
        .and('not.contain', 'line 9998');
    },
  );

  it('Searches for lines with an asterisk', { tags: Tag.Lines }, () => {
    routesAndLinesPage.searchContainer.getSearchInput().type('9*{enter}');
    expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '3 hakutulosta');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', '9999')
      .and('contain', '9888')
      .and('contain', '901');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', '8888')
      .and('not.contain', '8889');
  });

  it('Searches for a route with an exact label', { tags: Tag.Routes }, () => {
    routesAndLinesPage.searchContainer.getSearchInput().type(`1999{enter}`);
    expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

    searchResultsPage.getRoutesResultsButton().click();
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '1 hakutulosta');
    searchResultsPage
      .getRoutesSearchResultTable()
      .should('contain', '1999')
      .and('not.contain', '1888');
  });

  it('Searches for routes with an asterisk', { tags: Tag.Routes }, () => {
    routesAndLinesPage.searchContainer.getSearchInput().type('1*{enter}');
    expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

    searchResultsPage.getRoutesResultsButton().click();
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '2 hakutulosta');
    searchResultsPage
      .getRoutesSearchResultTable()
      .should('contain', 'route 1999')
      .and('contain', 'route 1888');
  });

  it(
    'Should show valid results according to the observation date',
    { tags: [Tag.Lines, Tag.Routes] },
    () => {
      routesAndLinesPage.searchContainer.getSearchInput().type('*');
      routesAndLinesPage.searchContainer.setObservationDate('2024-04-01');
      routesAndLinesPage.searchContainer.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      searchResultsPage.getLinesResultsButton().click();
      searchResultsPage
        .getLinesSearchResultTable()
        // Line 1777 is valid in 2024.
        .should('contain', '1777')
        // 8889 is always valid.
        .and('contain', '8889')
        // The other two are not valid in 2024.
        .and('not.contain', '2666')
        .and('not.contain', '1666');
      searchResultsPage.getRoutesResultsButton().click();
      searchResultsPage
        .getRoutesSearchResultTable()
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
      routesAndLinesPage.searchContainer.getSearchInput().type('*');
      routesAndLinesPage.searchContainer.getChevron().click();
      routesAndLinesPage.searchContainer
        .toggleTransportationMode('bus')
        .click();

      routesAndLinesPage.searchContainer.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchLinesAndRoutes');

      searchResultsPage.getLinesResultsButton().click();
      searchResultsPage
        .getLinesSearchResultTable()
        .should('not.contain', '1777')
        .and('not.contain', '8889')
        .and('not.contain', '2666')
        .and('not.contain', '1666');
      searchResultsPage.getRoutesResultsButton().click();
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('not.contain', '2333')
        .and('not.contain', '1222')
        .and('not.contain', '1111');
    },
  );
});
