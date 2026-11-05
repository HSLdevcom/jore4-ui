import {
  KnownValueKey,
  Priority,
  RouteDirectionEnum,
  StopAreaInput,
  StopInsertInput,
  StopRegistryGeoJsonInput,
  StopRegistryGeoJsonType,
  StopRegistryTransportModeType,
  buildStopInJourneyPattern,
  minimalQuayKeyValues,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  journeyPatterns,
  stopCoordinatesByLabel,
  stopsInJourneyPattern901Inbound,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { StopPlaceState, Tag } from '../enums';
import {
  LineDetailsPage,
  LineRouteList,
  MapFooter,
  MapPage,
  RouteStopsOverlay,
  RouteStopsOverlayRow,
  Toast,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import { InsertedStopRegistryIds } from './utils';

// The stop that is set out of operation in this test suite's dataset.
const inactiveStopLabel = 'E2E003';

function constructStopRegistryEntries(
  stopPoints: ReadonlyArray<StopInsertInput> = [],
) {
  return stopPoints.map<StopAreaInput>(
    ({ label, measured_location: location }) => {
      const geometry: StopRegistryGeoJsonInput = {
        coordinates: location.coordinates.slice(0, 2),
        type: StopRegistryGeoJsonType.Point,
      };

      const keyValues = [
        ...minimalQuayKeyValues.filter(
          (keyValue) => keyValue.key !== KnownValueKey.StopState,
        ),
        {
          key: KnownValueKey.StopState,
          values: [
            label === inactiveStopLabel
              ? StopPlaceState.OutOfOperation
              : StopPlaceState.InOperation,
          ],
        },
      ];

      return {
        organisations: null,
        StopArea: {
          name: { value: label, lang: 'fin' },
          privateCode: { value: `A-${label}`, type: 'HSL/TEST' },
          geometry,
          transportMode: StopRegistryTransportModeType.Bus,
          quays: [
            {
              privateCode: { value: label, type: 'HSL/TEST' },
              publicCode: label,
              geometry,
              keyValues,
            },
          ],
        },
      };
    },
  );
}

describe(
  'Stops that are out of operation on routes',
  { tags: [Tag.Routes, Tag.Stops, Tag.Map], scrollBehavior: 'bottom' },
  () => {
    let dbResources: SupportedResources;

    const baseDbResources = getClonedBaseDbResources();

    // Location where all test stops and routes are visible.
    const mapLocation = {
      lng: 24.929689228090112,
      lat: 60.16495016651525,
      zoom: 15,
    };

    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      ).then((infraLinkIds) => {
        const stops = buildStopsOnInfraLinks(infraLinkIds);
        const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

        // Leave the out of operation stop out of the 901 Outbound journey pattern
        dbResources = {
          ...baseDbResources,
          stopsInJourneyPattern: [
            ...stopsInJourneyPattern901Inbound,
            ...['E2E001', 'E2E002', 'E2E004', 'E2E005'].map(
              (stopLabel, index) =>
                buildStopInJourneyPattern({
                  journeyPatternId: journeyPatterns[0].journey_pattern_id,
                  stopLabel,
                  scheduledStopPointSequence: index,
                  isUsedAsTimingPoint: false,
                }),
            ),
          ],
          stops,
          infraLinksAlongRoute,
        };
      });
    });

    beforeEach(() => {
      cy.task('resetDbs');
      insertToDbHelper(dbResources);
      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces: constructStopRegistryEntries(dbResources.stops),
      });

      cy.setupTests();
      cy.mockLogin();
    });

    it(
      'Should not pick an out of operation stop when drawing a route, but allow adding it manually',
      { tags: [Tag.Network] },
      () => {
        cy.section('Draw a route past the out of operation stop', () => {
          MapPage.map.visit(mapLocation);
          MapPage.map.waitForLoadToComplete();

          MapFooter.createRoute();
          MapPage.routePropertiesForm.fillRouteProperties({
            finnishName: 'Out of operation stop route',
            label: '901O',
            versionComment: 'E2E out of operation stop reason',
            line: '901',
            direction: RouteDirectionEnum.Outbound,
            origin: {
              finnishName: 'Test origin FIN',
              finnishShortName: 'Test origin FIN shortName',
              swedishName: 'Test origin SWE',
              swedishShortName: 'Test origin SWE shortName',
            },
            destination: {
              finnishName: 'Test destination FIN',
              finnishShortName: 'Test destination FIN shortName',
              swedishName: 'Test destination SWE',
              swedishShortName: 'Test destination SWE shortName',
            },
            priority: Priority.Standard,
            validityStartISODate: '2025-01-01',
            validityEndISODate: '2030-12-01',
          });

          MapPage.editRouteModal.save();
          MapPage.map.getLoader().should('exist');
          MapPage.map.getLoader().should('not.exist');

          MapPage.map.clickAtCoordinates(
            stopCoordinatesByLabel.E2E001[0],
            stopCoordinatesByLabel.E2E001[1],
          );
          MapPage.map.clickAtCoordinates(
            stopCoordinatesByLabel.E2E002[0],
            stopCoordinatesByLabel.E2E002[1],
          );
          MapPage.map.clickAtCoordinates(
            stopCoordinatesByLabel.E2E004[0],
            stopCoordinatesByLabel.E2E004[1],
          );
          // Click the last added node again to finish the route
          MapPage.map.clickAtCoordinates(
            stopCoordinatesByLabel.E2E004[0],
            stopCoordinatesByLabel.E2E004[1],
          );
        });

        cy.section(
          'The out of operation stop is offered, but is not part of the route',
          () => {
            RouteStopsOverlay.getRouteStopsOverlayRows().should(
              'have.length',
              4,
            );
            RouteStopsOverlay.getRouteStopRow(
              inactiveStopLabel,
            ).shouldBeVisible();

            MapFooter.save();
            Toast.expectSuccessToast('Reitti tallennettu');

            RouteStopsOverlay.getRouteStopsOverlayRows().should(
              'have.length',
              3,
            );
            RouteStopsOverlay.stopsShouldNotBeIncludedInRoute([
              inactiveStopLabel,
            ]);
          },
        );

        cy.section(
          'The out of operation stop can be added to the route',
          () => {
            MapFooter.editRoute();
            MapPage.map.getLoader().should('not.exist');

            RouteStopsOverlay.getRouteStopsOverlayRows().should(
              'have.length',
              4,
            );
            RouteStopsOverlay.getNthRouteStopsOverlayRow(2).within(() =>
              RouteStopsOverlayRow.getMenuButton().click(),
            );
            RouteStopsOverlayRow.getToggleStopInJourneyPatternButton()
              .contains('Lisää reitille')
              .click();

            MapFooter.save();
            Toast.expectSuccessToast('Reitti tallennettu');

            RouteStopsOverlay.getRouteStopsOverlayRows().should(
              'have.length',
              4,
            );
            RouteStopsOverlay.stopsShouldBeIncludedInRoute([inactiveStopLabel]);
          },
        );
      },
    );

    it('Should allow adding an out of operation stop to a route on the line details page', () => {
      const { lineRouteListItem } = LineRouteList;
      const { routeRow, routeStopListItem } = lineRouteListItem;

      LineDetailsPage.visit(baseDbResources.lines[0].line_id);

      cy.section('The out of operation stop is shown as unused', () => {
        LineRouteList.getShowUnusedStopsSwitch().click();
        LineRouteList.getNthLineRouteListItem(0).within(() => {
          routeRow.getToggleAccordionButton().click();

          lineRouteListItem
            .getNthRouteStopListItem(2)
            .should('contain', inactiveStopLabel)
            .and('contain', 'Ei reitin käytössä');
        });
      });

      cy.section('The out of operation stop can be added to the route', () => {
        LineRouteList.getNthLineRouteListItem(0).within(() => {
          lineRouteListItem.getNthRouteStopListItem(2).within(() => {
            routeStopListItem.getStopActionsDropdown().click();
            cy.withinHeadlessPortal(() =>
              routeStopListItem.stopActionsDropdown
                .getAddStopToRouteButton()
                .click(),
            );
          });
        });

        Toast.expectSuccessToast('Reitti tallennettu');

        LineRouteList.getNthLineRouteListItem(0).within(() => {
          lineRouteListItem
            .getNthRouteStopListItem(2)
            .should('contain', inactiveStopLabel)
            .and('not.contain', 'Ei reitin käytössä');
        });
      });
    });
  },
);
