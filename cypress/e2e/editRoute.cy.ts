import {
  Priority,
  RouteDirectionEnum,
  buildRoute,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  baseDbResources,
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import {
  EditRoutePage,
  LineDetailsPage,
  Navbar,
  RoutesAndLinesPage,
  SearchResultsPage,
  Toast,
} from '../pageObjects';
import { UUID } from '../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../utils';

describe('Route editing', () => {
  let editRoutePage: EditRoutePage;
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let routesAndLinesPage: RoutesAndLinesPage;
  let searchResultsPage: SearchResultsPage;
  let navBar: Navbar;

  let dbResources: SupportedResources;

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  beforeEach(() => {
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    editRoutePage = new EditRoutePage();
    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    routesAndLinesPage = new RoutesAndLinesPage();
    searchResultsPage = new SearchResultsPage();
    navBar = new Navbar();

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
  });

  it("Should edit a routes's information", { tags: Tag.Routes }, () => {
    lineDetailsPage.visit(baseDbResources.lines[0].line_id);

    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getEditRouteButton('901')
      .click();

    // Edit the route's information
    editRoutePage.routePropertiesForm.fillRouteProperties({
      finnishName: 'Edited route name',
      label: '901E',
      variant: '8',
      direction: RouteDirectionEnum.Outbound,
      origin: {
        finnishName: 'Edited origin FIN',
        finnishShortName: 'Edited origin FIN shortName',
        swedishName: 'Edited origin SWE',
        swedishShortName: 'Edited origin SWE shortName',
      },
      destination: {
        finnishName: 'Edited destination FIN',
        finnishShortName: 'Edited destination FIN shortName',
        swedishName: 'Edited destination SWE',
        swedishShortName: 'Edited destination SWE shortName',
      },
    });
    editRoutePage.priorityForm.setAsTemporary();
    editRoutePage.changeValidityForm.getIndefiniteCheckbox().click();
    editRoutePage.changeValidityForm.setStartDate('2022-01-01');
    editRoutePage.changeValidityForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    // Verify information after transitioning to the line details page
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteName()
      .should('contain', 'Edited route name');
    lineDetailsPage.routeStopsTable.expandableRouteRow.getRouteHeaderRow(
      '901E',
    );
    lineDetailsPage.routeStopsTable.assertRouteDirection(
      '901E',
      RouteDirectionEnum.Outbound,
    );
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteValidityPeriod('901E')
      .should('contain', '1.1.2022 - 31.12.2030');

    // Verify rest of the information from the edit route page
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getEditRouteButton('901E')
      .click();

    editRoutePage.routePropertiesForm
      .getVariantInput()
      .should('have.value', '8');

    editRoutePage.terminusNamesInputs.verifyOriginValues({
      finnishName: 'Edited origin FIN',
      finnishShortName: 'Edited origin FIN shortName',
      swedishName: 'Edited origin SWE',
      swedishShortName: 'Edited origin SWE shortName',
    });

    editRoutePage.terminusNamesInputs.verifyDestinationValues({
      finnishName: 'Edited destination FIN',
      finnishShortName: 'Edited destination FIN shortName',
      swedishName: 'Edited destination SWE',
      swedishShortName: 'Edited destination SWE shortName',
    });
  });

  it('Should delete a route', { tags: Tag.Routes }, () => {
    lineDetailsPage.visit(baseDbResources.lines[0].line_id);

    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getEditRouteButton('901')
      .click();

    editRoutePage.routePropertiesForm.getForm().should('be.visible');
    editRoutePage.getDeleteRouteButton().click();

    editRoutePage.confirmationDialog.getConfirmButton().click();
    cy.wait('@gqlDeleteRoute').its('response.statusCode').should('equal', 200);
    toast.checkSuccessToastHasMessage('Reitti poistettu');

    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteHeaderRow('901')
      .should('not.exist');

    // Double check with search
    navBar.getRoutesAndLinesLink().click();
    routesAndLinesPage.searchContainer.getSearchInput().type(`901{enter}`);
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage.getRoutesResultsButton().click();
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '0 hakutulosta');
  });

  describe('draft route', () => {
    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      ).then((infraLinkIds) => {
        const stops = buildStopsOnInfraLinks(infraLinkIds);
        stops[1].priority = Priority.Draft;

        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        dbResources = {
          ...baseDbResources,
          routes: [
            {
              ...buildRoute({ label: '901' }),
              route_id: '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
              on_line_id: baseDbResources.lines[0].line_id,
              priority: Priority.Draft,
              validity_start: DateTime.fromISO('2022-08-11'),
              validity_end: DateTime.fromISO('2032-08-11'),
            },
          ],
          stops,
          infraLinksAlongRoute,
        };
      });
    });

    beforeEach(() => {
      removeFromDbHelper(dbResources);
      insertToDbHelper(dbResources);

      editRoutePage = new EditRoutePage();
      lineDetailsPage = new LineDetailsPage();
      toast = new Toast();
      routesAndLinesPage = new RoutesAndLinesPage();
      searchResultsPage = new SearchResultsPage();

      cy.setupTests();
      cy.mockLogin();
    });

    afterEach(() => {
      removeFromDbHelper(dbResources);
    });

    it(
      'Should show a warning when trying to change the priority of a draft route that has draft stops',
      { tags: Tag.Routes },
      () => {
        lineDetailsPage.visit(baseDbResources.lines[0].line_id);
        lineDetailsPage.getShowDraftsButton().click();

        lineDetailsPage.routeStopsTable.expandableRouteRow
          .getEditRouteButton('901')
          .click();

        editRoutePage.priorityForm.setAsStandard();
        editRoutePage.getSaveRouteButton().click();
        editRoutePage.routeDraftStopsConfirmationDialog
          .getTextContent()
          .should(
            'contain',
            'Jos haluat pysäkit mukaan reitille, säädä ensin niiden prioriteetti vastaamaan reittiä.',
          );
      },
    );
  });
});
