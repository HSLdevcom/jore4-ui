import { Priority, RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import { EditRoutePage, LineDetailsPage, Toast } from '../pageObjects';
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

  let dbResources: SupportedResources;
  const baseDbResources = getClonedBaseDbResources();

  describe('basic editing', () => {
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

      cy.setupTests();
      cy.mockLogin();
    });

    afterEach(() => {
      removeFromDbHelper(dbResources);
    });

    it("Should edit a routes's information", { tags: Tag.Routes }, () => {
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);
      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getEditRouteButton('901', RouteDirectionEnum.Inbound)
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
      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getRouteHeaderRow('901E', RouteDirectionEnum.Outbound)
        .should('be.visible');
      lineDetailsPage.routeStopsTable.assertRouteDirection(
        '901E',
        RouteDirectionEnum.Outbound,
      );
      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getRouteValidityPeriod('901E', RouteDirectionEnum.Outbound)
        .should('contain', '1.1.2022 - 31.12.2030');

      // Verify rest of the information from the edit route page
      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getEditRouteButton('901E', RouteDirectionEnum.Outbound)
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
        .getEditRouteButton('901', RouteDirectionEnum.Outbound)
        .click();

      editRoutePage.routePropertiesForm.getForm().should('be.visible');
      editRoutePage.getDeleteRouteButton().click();

      editRoutePage.confirmationDialog.getConfirmButton().click();
      cy.wait('@gqlDeleteRoute')
        .its('response.statusCode')
        .should('equal', 200);
      toast.checkSuccessToastHasMessage('Reitti poistettu');

      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getRouteHeaderRow('901', RouteDirectionEnum.Outbound)
        .should('not.exist');

      lineDetailsPage.routeStopsTable.expandableRouteRow
        .getRouteHeaderRow('901', RouteDirectionEnum.Inbound)
        .should('exist');
    });
  });

  describe('draft route', () => {
    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      ).then((infraLinkIds) => {
        const stops = buildStopsOnInfraLinks(infraLinkIds);

        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        // Set stop and route priority to draft
        stops[1].priority = Priority.Draft;
        const editedBaseDbResources = getClonedBaseDbResources();
        editedBaseDbResources.routes[0].priority = Priority.Draft;

        dbResources = {
          ...editedBaseDbResources,
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
          .getEditRouteButton('901', RouteDirectionEnum.Outbound)
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
