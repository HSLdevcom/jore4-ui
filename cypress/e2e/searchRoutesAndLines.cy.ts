import {
  buildLine,
  buildRoute,
  LineInsertInput,
  RouteInsertInput,
  RouteTypeOfLineEnum,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { RoutesAndLinesPage, SearchResultsPage } from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const lines: LineInsertInput[] = [
  // Valid in 2022
  {
    ...buildLine({ label: '1666' }),
    line_id: '5dfa82f1-b3f7-4e26-b31d-0d7bd78da0be',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2022-01-02'),
    validity_end: DateTime.fromISO('2022-12-24'),
  },
  // Valid in 2023
  {
    ...buildLine({ label: '2666' }),
    line_id: '61e4d95e-34e5-11ed-a261-0242ac120002',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2023-01-02'),
    validity_end: DateTime.fromISO('2023-12-24'),
  },
  // Valid in 2024
  {
    ...buildLine({ label: '1777' }),
    line_id: '47c5fe92-e630-430b-a2da-2c6739acbb2b',
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    validity_start: DateTime.fromISO('2024-01-02'),
    validity_end: DateTime.fromISO('2024-12-24'),
  },
  // Valid between 2000 and 2054
  {
    ...buildLine({ label: '9999' }),
    line_id: '7f5aa870-891a-433e-bd9b-f864162a2adf',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  {
    ...buildLine({ label: '9888' }),
    line_id: 'a627dfbf-8db6-4519-b968-56b4a4988d91',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  {
    ...buildLine({ label: '8888' }),
    line_id: '69141b10-98cb-4319-9fe9-95cddbd46987',
    validity_start: DateTime.fromISO('2000-01-02'),
    validity_end: DateTime.fromISO('2054-12-24'),
  },
  // Always valid.
  {
    ...buildLine({ label: '8889' }),
    line_id: '429413b0-a3b7-4b12-a3a1-5c26268066c1',
    validity_start: null,
    validity_end: null,
  },
];

const routes: RouteInsertInput[] = [
  // Valid in 2022
  {
    ...buildRoute({ label: '1111' }),
    route_id: '48490721-3346-493a-80c8-3edd07c2d5d6',
    on_line_id: lines[0].line_id,
    validity_start: lines[0].validity_start,
    validity_end: lines[0].validity_end,
  },
  // Valid in 2023
  {
    ...buildRoute({ label: '1222' }),
    route_id: 'd82ebf21-5adb-419c-b057-c6e3b0f7480c',
    on_line_id: lines[1].line_id,
    validity_start: lines[1].validity_start,
    validity_end: lines[1].validity_end,
  },
  // Valid in 2024
  {
    ...buildRoute({ label: '2333' }),
    route_id: 'fa6196fa-ce61-4808-84bf-f4fc60bf1162',
    on_line_id: lines[2].line_id,
    validity_start: lines[2].validity_start,
    validity_end: lines[2].validity_end,
  },
  // The rest are valid between 2000 and 2054
  {
    ...buildRoute({ label: '1999' }),
    route_id: 'eec15aaf-3cf3-4fc8-86a1-7849ea4d88e0',
    on_line_id: lines[3].line_id,
    validity_start: lines[3].validity_start,
    validity_end: lines[3].validity_end,
  },
  {
    ...buildRoute({ label: '1888' }),
    route_id: '88f2bb05-8438-41ab-ba26-27983250a78e',
    on_line_id: lines[3].line_id,
    validity_start: lines[3].validity_start,
    validity_end: lines[3].validity_end,
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
    });

    after(() => {
      deleteCreatedResources();
    });

    beforeEach(() => {
      cy.setupMapTiles();
      cy.mockLogin();
      cy.visit('/routes');
      routesAndLinesPage.searchContainer.getSearchInput().clear();
    });

    it(
      'Searches for a line with exact label',
      { tags: [Tag.Lines, Tag.Smoke] },
      () => {
        routesAndLinesPage.searchContainer.getSearchInput().type(`9999{enter}`);
        cy.wait('@gqlSearchLinesAndRoutes');

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
      cy.wait('@gqlSearchLinesAndRoutes');

      searchResultsPage
        .getSearchResultsContainer()
        .should('contain', '2 hakutulosta');
      searchResultsPage
        .getLinesSearchResultTable()
        .should('contain', '9999')
        .and('contain', '9888');
      searchResultsPage
        .getLinesSearchResultTable()
        .should('not.contain', '8888')
        .and('not.contain', '8889');
    });

    it('Searches for a route with an exact label', { tags: Tag.Routes }, () => {
      routesAndLinesPage.searchContainer.getSearchInput().type(`1999{enter}`);
      cy.wait('@gqlSearchLinesAndRoutes');

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
      cy.wait('@gqlSearchLinesAndRoutes');

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
        routesAndLinesPage.searchContainer.getChevron().click();
        routesAndLinesPage.searchContainer.setObservationDate('2024-04-01');
        routesAndLinesPage.searchContainer.getSearchButton().click();
        cy.wait('@gqlSearchLinesAndRoutes');

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
  },
);
