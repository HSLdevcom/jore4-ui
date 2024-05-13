import {
  Priority,
  RouteDirectionEnum,
  buildRoute
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
  RoutesAndLinesPage,
  SearchResultsPage,
  Toast
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

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);
  });

  it("Should edit a routes's information", { tags: Tag.Routes }, () => {
    editRoutePage.visit('994a7d79-4991-423b-9c1a-0ca621a6d9ed'); // TODO: remove hardcoded id
    // Edit the route's information
    editRoutePage.routePropertiesForm.fillRouteProperties({
      finnishName: 'Muokattu reitin nimi',
      label: 'Muokattu label',
      variant: '8',
      direction: RouteDirectionEnum.Outbound,
      origin: {
        finnishName: 'Muokattu lähtöpaikka FIN',
        finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
        swedishName: 'Muokattu lähtöpaikka SWE',
        swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
      },
      destination: {
        finnishName: 'Muokattu määränpää FIN',
        finnishShortName: 'Muokattu määränpää FIN lyhennys',
        swedishName: 'Muokattu määränpää SWE',
        swedishShortName: 'Muokattu määränpää SWE lyhennys',
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
      .should('contain', 'Muokattu reitin nimi');
    lineDetailsPage.routeStopsTable.expandableRouteRow.getRouteHeaderRow(
      'Muokattu label',
    );
    lineDetailsPage.routeStopsTable.assertRouteDirection(
      'Muokattu label',
      RouteDirectionEnum.Outbound,
    );
    lineDetailsPage.routeStopsTable.expandableRouteRow
      .getRouteValidityPeriod('Muokattu label')
      .should('contain', '1.1.2022 - 31.12.2030');

    // Verify rest of the information from the edit route page
    editRoutePage.visit('994a7d79-4991-423b-9c1a-0ca621a6d9ed'); // TODO: remove hardcoded id, also remove the whole visit.
    editRoutePage.routePropertiesForm
      .getVariantInput()
      .should('have.value', '8');

    editRoutePage.terminusNamesInputs.verifyOriginValues({
      finnishName: 'Muokattu lähtöpaikka FIN',
      finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
      swedishName: 'Muokattu lähtöpaikka SWE',
      swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
    });

    editRoutePage.terminusNamesInputs.verifyDestinationValues({
      finnishName: 'Muokattu määränpää FIN',
      finnishShortName: 'Muokattu määränpää FIN lyhennys',
      swedishName: 'Muokattu määränpää SWE',
      swedishShortName: 'Muokattu määränpää SWE lyhennys',
    });
  });

  it('Should delete a route', { tags: Tag.Routes }, () => {
    editRoutePage.visit('994a7d79-4991-423b-9c1a-0ca621a6d9ed'); // TODO: remove hardcoded id
    editRoutePage.routePropertiesForm.getForm().should('be.visible');
    editRoutePage.getDeleteRouteButton().click();
    editRoutePage.confirmationDialog.getConfirmButton().click();
    cy.wait('@gqlDeleteRoute').its('response.statusCode').should('equal', 200);
    toast.checkSuccessToastHasMessage('Reitti poistettu');
    editRoutePage.visit('994a7d79-4991-423b-9c1a-0ca621a6d9ed'); // TODO: remove hardcoded id, also remove extra visit
    editRoutePage.routePropertiesForm.getForm().should('not.exist');
    cy.visit('/routes');
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
        stops[1].priority = Priority.Draft

        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        dbResources = {
          ...baseDbResources,
          routes: [
            {
              ...buildRoute({ label: '901' }),
              route_id: '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
              on_line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60', // TODO: remove hardocde
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
        editRoutePage.visit('994a7d79-4991-423b-9c1a-0ca621a6d9ed'); // TODO:
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
