import { buildLine, buildRoute } from '@hsl/jore4-test-db-manager';
import {
  RoutesAndLinesPage,
  RoutesAndLinesSearchResultsPage,
} from '../pageObjects';
import { LineInsertInput, RouteInsertInput } from '../types';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1666' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
  },
  {
    ...buildLine({ label: '2666' }),
    line_id: '4dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
  },
  {
    ...buildLine({ label: '1777' }),
    line_id: '3dfa82f1-b3f7-4e26-b31d-0d7bd78da0bf',
  },
];

// TODO: don't insert routes if these are not used in this test
const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '3777' }),
    route_id: '61bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[0].line_id,
  },
  {
    ...buildRoute({ label: '3666' }),
    route_id: '51bef596-84a0-40ea-b818-423d6b9b1fcf',
    on_line_id: lines[1].line_id,
  },
];

const dbResources = {
  lines,
  routes,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Verify route and line search works', () => {
  let searchResultsPage: RoutesAndLinesSearchResultsPage;
  let routesAndLinesPage: RoutesAndLinesPage;

  beforeEach(() => {
    searchResultsPage = new RoutesAndLinesSearchResultsPage();
    routesAndLinesPage = new RoutesAndLinesPage();
    deleteCreatedResources();
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
  });
  afterEach(() => {
    deleteCreatedResources();
  });
  it('Searches line with exact ID', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1666{enter}');
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

  // TODO: this test seems to be flaky at least locally, find out why
  it('Searches line with asterisk', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1*{enter}');
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
