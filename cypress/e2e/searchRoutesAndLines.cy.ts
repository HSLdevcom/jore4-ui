import { buildLine, LineInsertInput } from '@hsl/jore4-test-db-manager';
import { RoutesAndLinesPage, SearchResultsPage } from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1666' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0be',
  },
  {
    ...buildLine({ label: '2666' }),
    line_id: '61e4d95e-34e5-11ed-a261-0242ac120002',
  },
  {
    ...buildLine({ label: '1777' }),
    line_id: '69013606-34e5-11ed-a261-0242ac120002',
  },
];

const dbResources = {
  lines,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Verify that route and line search works', () => {
  let searchResultsPage: SearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;

  before(() => {
    cy.visit('/routes');
  });

  beforeEach(() => {
    searchResultsPage = new SearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    deleteCreatedResources();
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
    routesAndLinesPage.getRoutesAndLinesSearchInput().clear();
  });
  afterEach(() => {
    deleteCreatedResources();
  });
  it('Searches line with exact ID', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1666{enter}');
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', 'hakutulosta');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1666');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 1777');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 2666');
  });

  it('Searches line with asterisk', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1*{enter}');
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', 'hakutulosta');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1666');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('contain', 'line 1777');
    searchResultsPage
      .getLinesSearchResultTable()
      .should('not.contain', 'line 2666');
  });
});
