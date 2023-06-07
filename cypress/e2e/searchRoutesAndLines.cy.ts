import {
  buildLine,
  buildRoute,
  LineInsertInput,
  RouteInsertInput,
} from '@hsl/jore4-test-db-manager';
import { Tag } from '../enums';
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
    line_id: '47c5fe92-e630-430b-a2da-2c6739acbb2b',
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '1111' }),
    route_id: '48490721-3346-493a-80c8-3edd07c2d5d6',
    on_line_id: lines[0].line_id,
  },
  {
    ...buildRoute({ label: '1222' }),
    route_id: 'd82ebf21-5adb-419c-b057-c6e3b0f7480c',
    on_line_id: lines[1].line_id,
  },
  {
    ...buildRoute({ label: '2333' }),
    route_id: 'fa6196fa-ce61-4808-84bf-f4fc60bf1162',
    on_line_id: lines[2].line_id,
  },
];

const dbResources = {
  lines,
  routes,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe(
  // eslint-disable-next-line jest/valid-describe-callback
  'Verify that route and line search works',
  { testIsolation: false },
  () => {
    let searchResultsPage: SearchResultsPage;
    let routesAndLinesPage: RoutesAndLinesPage;

    before(() => {
      searchResultsPage = new SearchResultsPage();
      routesAndLinesPage = new RoutesAndLinesPage();
      deleteCreatedResources();
      insertToDbHelper(dbResources);
      cy.visit('/routes');
    });

    after(() => {
      deleteCreatedResources();
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();
      routesAndLinesPage.searchContainer.getSearchInput().clear();
    });

    it('Searches line with exact ID', { tags: [Tag.Lines, Tag.Smoke] }, () => {
      routesAndLinesPage.searchContainer
        .getSearchInput()
        .type(`${lines[0].label}{enter}`);
      cy.wait('@gqlSearchLinesAndRoutes');
      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', 'hakutulosta');
      searchResultsPage
        .getLinesSearchResultTable()
        .should('contain', `line ${lines[0].label}`);
      searchResultsPage
        .getLinesSearchResultTable()
        .should('not.contain', `line ${lines[1].label}`);
      searchResultsPage
        .getLinesSearchResultTable()
        .should('not.contain', `line ${lines[2].label}`);
    });

    it('Searches line with asterisk', { tags: Tag.Lines }, () => {
      routesAndLinesPage.searchContainer.getSearchInput().type('1*{enter}');
      cy.wait('@gqlSearchLinesAndRoutes');
      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', 'hakutulosta');
      searchResultsPage
        .getLinesSearchResultTable()
        .should('contain', `line ${lines[0].label}`);
      searchResultsPage
        .getLinesSearchResultTable()
        .should('contain', `line ${lines[2].label}`);
      searchResultsPage
        .getLinesSearchResultTable()
        .should('not.contain', `line ${lines[1].label}`);
    });

    it('Searches route with exact ID', { tags: Tag.Lines }, () => {
      routesAndLinesPage.searchContainer
        .getSearchInput()
        .type(`${routes[0].label}{enter}`);
      cy.wait('@gqlSearchLinesAndRoutes');
      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', 'hakutulosta');
      searchResultsPage.getRoutesResultsButton().click();
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('contain', `route ${routes[0].label}`);
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('not.contain', `route ${routes[1].label}`);
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('not.contain', `route ${routes[2].label}`);
    });

    it('Searches route with asterisk', { tags: Tag.Lines }, () => {
      routesAndLinesPage.searchContainer.getSearchInput().type('1*{enter}');
      cy.wait('@gqlSearchLinesAndRoutes');
      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', 'hakutulosta');
      searchResultsPage.getRoutesResultsButton().click();
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('contain', `route ${routes[0].label}`);
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('contain', `route ${routes[1].label}`);
      searchResultsPage
        .getRoutesSearchResultTable()
        .should('not.contain', `route ${routes[2].label}`);
    });
  },
);
