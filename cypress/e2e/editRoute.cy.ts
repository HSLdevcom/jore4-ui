import { Priority, RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import {
  EditRoutePage,
  LineDetailsPage,
  LineRouteListItem,
  Toast,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import { expectGraphQLCallToSucceed } from '../utils/assertions';

describe('Route editing', () => {
  let editRoutePage: EditRoutePage;
  let lineDetailsPage: LineDetailsPage;
  let lineRouteListItem: LineRouteListItem;
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
      cy.task('resetDbs');
      insertToDbHelper(dbResources);

      editRoutePage = new EditRoutePage();
      lineDetailsPage = new LineDetailsPage();
      lineRouteListItem = new LineRouteListItem();
      toast = new Toast();

      cy.setupTests();
      cy.mockLogin();
    });

    it("Should edit a routes's information", { tags: Tag.Routes }, () => {
      const { routeRow } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);
      routeRow.getEditRouteButton('901', RouteDirectionEnum.Inbound).click();

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
      editRoutePage.changeValidityForm.validityPeriodForm
        .getIndefiniteCheckbox()
        .click();
      editRoutePage.changeValidityForm.validityPeriodForm.setStartDate(
        '2022-01-01',
      );
      editRoutePage.changeValidityForm.validityPeriodForm.setEndDate(
        '2030-12-31',
      );

      editRoutePage.getSaveRouteButton().click();

      // Verify information after transitioning to the line details page
      routeRow.getRouteName().should('contain', 'Edited route name');
      routeRow
        .getRouteHeaderRow('901E', RouteDirectionEnum.Outbound)
        .should('be.visible');
      lineDetailsPage.lineRouteList.assertRouteDirection(
        '901E',
        RouteDirectionEnum.Outbound,
      );
      routeRow
        .getRouteValidityPeriod('901E', RouteDirectionEnum.Outbound)
        .should('contain', '1.1.2022 - 31.12.2030');

      // Verify rest of the information from the edit route page
      routeRow.getEditRouteButton('901E', RouteDirectionEnum.Outbound).click();

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
      const { routeRow } = lineRouteListItem;
      lineDetailsPage.visit(baseDbResources.lines[0].line_id);

      routeRow.getEditRouteButton('901', RouteDirectionEnum.Outbound).click();

      editRoutePage.routePropertiesForm.getForm().should('be.visible');
      editRoutePage.getDeleteRouteButton().click();

      editRoutePage.confirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlDeleteRoute');
      toast.expectSuccessToast('Reitti poistettu');

      routeRow
        .getRouteHeaderRow('901', RouteDirectionEnum.Outbound)
        .should('not.exist');

      routeRow
        .getRouteHeaderRow('901', RouteDirectionEnum.Inbound)
        .should('exist');
    });
  });

  describe('Should show error messages', () => {
    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      ).then((infraLinkIds) => {
        const stops = buildStopsOnInfraLinks(infraLinkIds);
        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        const modifiedDbResources = {
          ...baseDbResources,
        };

        modifiedDbResources.lines[0].validity_end =
          DateTime.fromISO('2032-12-31');

        dbResources = {
          ...modifiedDbResources,
          stops,
          infraLinksAlongRoute,
        };
      });
    });

    beforeEach(() => {
      cy.task('resetDbs');
      insertToDbHelper(dbResources);

      editRoutePage = new EditRoutePage();
      lineDetailsPage = new LineDetailsPage();
      lineRouteListItem = new LineRouteListItem();
      toast = new Toast();

      cy.setupTests();
      cy.mockLogin();
    });

    function fillTestValuesToForm() {
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
    }

    function visitPage() {
      const { routeRow } = lineRouteListItem;
      const line = baseDbResources.lines.find(
        (l) => l.line_id === '08d1fa6b-440c-421e-ad4d-0778d65afe60',
      );
      const row = baseDbResources.routes.find(
        (r) => r.route_id === '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
      );
      if (!line?.line_id || !row?.label) {
        throw new Error(
          'Test configuration error. Line id or route label missing',
        );
      }
      lineDetailsPage.visit(line?.line_id);
      routeRow
        .getEditRouteButton(row?.label, RouteDirectionEnum.Outbound)
        .click();
      return { line, row };
    }

    function setValidityPeriodToForm(
      routeValidityStart: string,
      routeValidityEnd: string | undefined,
    ) {
      editRoutePage.changeValidityForm.validityPeriodForm.setStartDate(
        routeValidityStart,
      );
      if (routeValidityEnd) {
        editRoutePage.changeValidityForm.validityPeriodForm.setEndDate(
          routeValidityEnd,
        );
      }
    }

    it('should validate start after end', { tags: Tag.Routes }, () => {
      const { line } = visitPage();
      fillTestValuesToForm();

      const endTime = line.validity_end?.minus({ months: 1 });
      if (!endTime) {
        throw new Error('Test configuration error. No end time for line');
      }

      const routeValidityEnd = endTime.toISODate();

      const routeValidityStart = endTime?.plus({ days: 1 })?.toISODate();

      if (!routeValidityStart || !routeValidityEnd) {
        throw new Error(
          'Test configuration error. No validity period for line',
        );
      }

      setValidityPeriodToForm(routeValidityStart, routeValidityEnd);

      editRoutePage.getSaveRouteButton().click();
      toast.expectDangerToast(
        'Reitin voimassaoloaijan alku ei voi olla ennen loppua',
      );
    });

    it(
      'should validate route validity outside line validity',
      { tags: Tag.Routes },
      () => {
        const { line } = visitPage();

        fillTestValuesToForm();

        const routeValidityStart = line.validity_start
          ?.minus({ days: 1 })
          ?.toISODate();

        const routeValidityEnd = line.validity_end?.toISODate();

        if (!routeValidityStart || !routeValidityEnd) {
          throw new Error(
            'Test configuration error. No validity period for line',
          );
        }
        setValidityPeriodToForm(routeValidityStart, routeValidityEnd);

        editRoutePage.getSaveRouteButton().click();

        toast.expectDangerToast(
          'Reitin voimassaoloaika ei voi alkaa ennen linjan voimassaoloajan alkamista.',
        );
      },
    );
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
      cy.task('resetDbs');
      insertToDbHelper(dbResources);

      editRoutePage = new EditRoutePage();
      lineDetailsPage = new LineDetailsPage();
      toast = new Toast();

      cy.setupTests();
      cy.mockLogin();
    });

    it(
      'Should show a warning when trying to change the priority of a draft route that has draft stops',
      { tags: Tag.Routes },
      () => {
        const { routeRow } = lineRouteListItem;
        lineDetailsPage.visit(baseDbResources.lines[0].line_id);
        lineDetailsPage.getShowDraftsButton().click();

        routeRow.getEditRouteButton('901', RouteDirectionEnum.Outbound).click();

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
