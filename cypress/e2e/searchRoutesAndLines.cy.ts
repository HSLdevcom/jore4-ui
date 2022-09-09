import { buildLine } from '@hsl/jore4-test-db-manager';
import {
  RoutesAndLinesPage,
  RoutesAndLinesSearchResultsPage,
} from '../pageObjects';
import { LineInsertInput } from '../types';
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

const dbResources = {
  lines,
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

  it('Searches line with asterisk', () => {
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('1*');
    routesAndLinesPage.getRoutesAndLinesSearchInput().type('{enter}');
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
