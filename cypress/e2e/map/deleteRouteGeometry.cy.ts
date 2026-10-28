import {
  Priority,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  stopCoordinatesByLabel,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  ConfirmationDialog,
  Map,
  MapFooter,
  MapPage,
  RouteEditor,
  RouteStopsOverlay,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

describe(
  'Delete route geometry',
  { tags: [Tag.Routes, Tag.Map, Tag.Network], scrollBehavior: 'bottom' },
  () => {
    let dbResources: SupportedResources;
    const baseDbResources = getClonedBaseDbResources();
    const baseStopRegistryData = getClonedBaseStopRegistryData();
    const originalStops = ['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005'];
    const redrawnStops = ['E2E003', 'E2E004', 'E2E005'] as const;
    const mapLocation = {
      lng: 24.929689228090112,
      lat: 60.16495016651525,
      zoom: 16,
    };

    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      ).then((infraLinkIds) => {
        dbResources = {
          ...baseDbResources,
          stops: buildStopsOnInfraLinks(infraLinkIds),
          infraLinksAlongRoute: buildInfraLinksAlongRoute(infraLinkIds),
        };
      });
    });

    beforeEach(() => {
      cy.task('resetDbs');
      insertToDbHelper(dbResources);
      cy.task<InsertedStopRegistryIds>(
        'insertStopRegistryData',
        baseStopRegistryData,
      );
      cy.setupTests();
      cy.mockLogin();
    });

    function openExistingRoute(expectedStops = originalStops) {
      cy.visit('/routes');
      RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');
      SearchResultsPage.getRoutesResultsButton().click();
      SearchResultsPage.getShowRouteOnMapButton().click();
      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
      RouteStopsOverlay.stopsShouldBeIncludedInRoute(expectedStops);
      cy.getByTestId('MapFooter:addStopButton').should('be.disabled');
      cy.getByTestId('MapFooterActionsDropdown::menu').should('be.disabled');
    }

    function editExistingRoute() {
      openExistingRoute();
      MapFooter.editRoute();
      // Saving becomes available only after the initial map matching completes.
      MapFooter.getSaveButton().should('be.enabled');
      Map.waitForLoadToComplete();
    }

    function confirmGeometryDeletion() {
      MapFooter.getDeleteRouteGeometryButton()
        .should('be.visible')
        .and('be.enabled')
        .click();
      ConfirmationDialog.dialogWithButtons
        .getTextContent()
        .should('have.text', 'Perustiedot säilyvät.');
      ConfirmationDialog.getConfirmButton().click();
      ConfirmationDialog.getConfirmButton().should('not.exist');
      RouteStopsOverlay.getRouteStopsOverlayRows().should('not.exist');
      MapFooter.getSaveButton().should('be.disabled');
      MapFooter.getCreateRouteButton()
        .should('have.text', 'Vedä reitti uudelleen')
        .and('be.enabled');
      MapFooter.getEditRouteButton().should('be.disabled');
    }

    function drawReplacementGeometry() {
      Map.waitForLoadToComplete();
      redrawnStops.forEach((label) => {
        const [longitude, latitude] = stopCoordinatesByLabel[label];
        Map.clickAtCoordinates(longitude, latitude);
      });
      // Finish the line by clicking its last vertex again.
      const [longitude, latitude] = stopCoordinatesByLabel.E2E005;
      Map.clickAtCoordinates(longitude, latitude);
      MapFooter.getSaveButton().should('be.enabled');
      Map.waitForLoadToComplete();
      RouteStopsOverlay.stopsShouldBeIncludedInRoute([...redrawnStops]);
      RouteStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E001', 'E2E002']);
      MapFooter.getCreateRouteButton().should('be.disabled');
    }

    function assertSavedReplacement(label: string) {
      RouteStopsOverlay.getRouteStopListHeader(
        label,
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
      RouteStopsOverlay.assertRouteStopCount(redrawnStops.length);
      RouteStopsOverlay.stopsShouldBeIncludedInRoute([...redrawnStops]);
      RouteStopsOverlay.stopsShouldNotBeIncludedInRoute(['E2E001', 'E2E002']);
    }

    it('Should keep geometry when deletion confirmation is cancelled', () => {
      editExistingRoute();
      MapFooter.getCreateRouteButton().should('be.disabled');
      MapFooter.getDeleteRouteGeometryButton().click();
      ConfirmationDialog.getCancelButton().click();

      ConfirmationDialog.getConfirmButton().should('not.exist');
      RouteStopsOverlay.stopsShouldBeIncludedInRoute(originalStops);
      MapFooter.getSaveButton().should('be.enabled');
      MapFooter.getCreateRouteButton().should('be.disabled');
      MapFooter.getDeleteRouteGeometryButton().should('be.enabled');

      MapFooter.cancel();
      openExistingRoute();
      RouteStopsOverlay.assertRouteStopCount(originalStops.length);
      RouteStopsOverlay.stopsShouldBeIncludedInRoute(originalStops);
    });

    it('Should clear geometry without deselecting the route and restore it on cancel', () => {
      editExistingRoute();
      confirmGeometryDeletion();
      RouteStopsOverlay.getRouteStopListHeader(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
      MapFooter.getDeleteRouteGeometryButton().should('be.disabled');
      MapFooter.getDeleteRouteButton().should('be.visible');

      Map.clickRelativePoint(75, 25);
      MapFooter.getCreateRouteButton().should('be.enabled');
      MapFooter.getEditRouteButton().should('be.disabled');
      MapFooter.getDeleteRouteButton().should('be.visible');
      MapFooter.getSaveButton().should('be.disabled');
      RouteStopsOverlay.getRouteStopsOverlayRows().should('not.exist');
      cy.getByTestId('MapFooter:addStopButton').should('be.disabled');
      cy.getByTestId('MapFooterActionsDropdown::menu').should('be.disabled');

      MapFooter.cancel();
      RouteStopsOverlay.stopsShouldBeIncludedInRoute(originalStops);
      MapFooter.getEditRouteButton().should('be.enabled');
      MapFooter.getCreateRouteButton().should('be.disabled');
      MapFooter.getDeleteRouteGeometryButton().should('not.exist');

      openExistingRoute();
      RouteStopsOverlay.assertRouteStopCount(originalStops.length);
      RouteStopsOverlay.stopsShouldBeIncludedInRoute(originalStops);
    });

    it('Should delete and redraw geometry repeatedly and save the same route and journey pattern', () => {
      editExistingRoute();
      Map.zoomIn(3);
      confirmGeometryDeletion();
      MapFooter.redrawRoute();
      drawReplacementGeometry();

      confirmGeometryDeletion();
      MapFooter.getDeleteRouteGeometryButton().should('be.disabled');
      MapFooter.redrawRoute();
      drawReplacementGeometry();

      MapFooter.save();
      expectGraphQLCallToSucceed('@gqlUpdateRouteGeometry')
        .its('request.body.variables')
        .should('include', {
          route_id: baseDbResources.routes[0].route_id,
          journey_pattern_id:
            baseDbResources.journeyPatterns[0].journey_pattern_id,
        });
      RouteEditor.checkRouteSubmitSuccessToast();
      assertSavedReplacement('901');

      openExistingRoute([...redrawnStops]);
      assertSavedReplacement('901');
    });

    [false, true].forEach((useTemplate) => {
      it(`Should keep metadata when deleting and redrawing a new route${useTemplate ? ' created from a template' : ''}`, () => {
        Map.visit(mapLocation);
        MapFooter.createRoute();
        if (useTemplate) {
          MapPage.routePropertiesForm.useTemplateRoute({ label: '901' });
        }
        MapPage.routePropertiesForm.fillRouteProperties({
          finnishName: 'Geometry deletion test',
          label: '902',
          line: '901',
          direction: RouteDirectionEnum.Outbound,
          priority: Priority.Standard,
          validityStartISODate: '2022-08-11',
          validityEndISODate: '2032-08-11',
        });
        MapPage.editRouteModal.save();
        MapPage.routePropertiesForm.getForm().should('not.exist');

        if (useTemplate) {
          RouteStopsOverlay.stopsShouldBeIncludedInRoute(originalStops);
          MapFooter.getSaveButton().should('be.enabled');
        } else {
          drawReplacementGeometry();
          MapFooter.editRoute();
        }
        MapFooter.getDeleteRouteGeometryButton().should('be.enabled');
        Map.waitForLoadToComplete();

        confirmGeometryDeletion();
        RouteStopsOverlay.getHeader()
          .should('contain', '902')
          .and('contain', 'Geometry deletion test');
        MapFooter.getDeleteRouteButton().should('not.exist');
        MapPage.routePropertiesForm.getForm().should('not.exist');

        MapFooter.redrawRoute();
        drawReplacementGeometry();
        MapFooter.save();
        RouteEditor.gqlRouteShouldBeCreatedSuccessfully();
        RouteEditor.checkRouteSubmitSuccessToast();
        assertSavedReplacement('902');

        cy.reload();
        assertSavedReplacement('902');
        RouteStopsOverlay.getHeader().should(
          'contain',
          'Geometry deletion test',
        );

        // Clearing template geometry must not modify the template itself.
        openExistingRoute();
        RouteStopsOverlay.assertRouteStopCount(originalStops.length);
      });
    });

    it('Should still allow deleting the entire route with its separate button', () => {
      editExistingRoute();
      MapFooter.getDeleteRouteButton().click();
      ConfirmationDialog.dialogWithButtons
        .getTextContent()
        .should('contain', 'Reitti poistetaan sille kuuluvalta linjalta.');
      ConfirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlDeleteRoute');
      RouteStopsOverlay.getHeader().should('not.exist');

      cy.reload();
      RouteStopsOverlay.getHeader().should('not.exist');
    });
  },
);
