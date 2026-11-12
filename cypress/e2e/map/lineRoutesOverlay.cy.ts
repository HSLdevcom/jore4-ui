import {
  Priority,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
  buildLine,
  buildRoute,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  KnownMapItemTypeFilters,
  LineRoutesOverlay,
  Map,
  MapItemTypeFiltersOverlay,
  MapObservationDateFiltersOverlay,
  RouteStopsOverlay,
  SearchResultsPage,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();
const baseStopRegistryData = getClonedBaseStopRegistryData();

const line901 = baseDbResources.lines[0];

/** A variant of line 901 that is no longer valid. */
const pastRouteVariant = {
  ...buildRoute({ label: '901' }),
  route_id: 'd3f9b9a7-0d4f-4a65-8b43-3e3d4b3a5c21',
  variant: 1,
  direction: RouteDirectionEnum.Outbound,
  on_line_id: line901.line_id,
  validity_start: Temporal.PlainDate.from('2022-02-01'),
  validity_end: Temporal.PlainDate.from('2022-12-31'),
};

const draftLine = {
  ...buildLine({ label: '902' }),
  line_id: '5a6a3e59-1a4f-4d84-97a2-9a2b06e6f1a5',
  priority: Priority.Draft,
  type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  validity_start: Temporal.PlainDate.from('2022-01-01'),
};

const draftRoute = {
  ...buildRoute({ label: '902' }),
  route_id: '0c9d0b5d-2bd7-4f85-9d41-61b0a6f0a2d4',
  priority: Priority.Draft,
  direction: RouteDirectionEnum.Outbound,
  on_line_id: draftLine.line_id,
  validity_start: Temporal.PlainDate.from('2022-01-01'),
};

function showLineOnMap(label: string, priorities: ReadonlyArray<Priority>) {
  // Skip searching via the UI.
  cy.visit(
    `/routes/search?query=${label}&priorities=${priorities.join(',')}&displayedType=lines`,
  );
  SearchResultsPage.getRouteLineTableRowByLabel(label).within(() => {
    SearchResultsPage.getShowLineOnMapButton().click();
  });
  Map.waitForLoadToComplete();
}

function expectRenderedRouteIdCount(expectedCount: number) {
  return expectGraphQLCallToSucceed('@gqlGetRouteRenderInfoByIds')
    .its('request.body.variables.routeIds')
    .should('have.length', expectedCount);
}

describe(
  'Line route variants on the map',
  { tags: [Tag.Map, Tag.Routes] },
  () => {
    let dbResources: SupportedResources;

    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      )
        .then((infraLinkIds) => {
          dbResources = {
            ...baseDbResources,
            lines: [...baseDbResources.lines, draftLine],
            routes: [...baseDbResources.routes, pastRouteVariant, draftRoute],
            stops: buildStopsOnInfraLinks(infraLinkIds),
            infraLinksAlongRoute: buildInfraLinksAlongRoute(infraLinkIds),
          };
        })
        .then(() => {
          // Readonly tests, initialize the DB only once.
          cy.task('resetDbs');

          insertToDbHelper(dbResources);

          cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
            ...baseStopRegistryData,
          });
        });
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();
    });

    it("should list the line's valid route variants", () => {
      showLineOnMap('901', [Priority.Standard]);

      LineRoutesOverlay.getHeader()
        .should('contain', '901')
        .and('contain', 'line 901');

      // The past variant is filtered out by the default time filters.
      LineRoutesOverlay.getRouteRows().should('have.length', 2);
      LineRoutesOverlay.getRouteRow(
        '901',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
      LineRoutesOverlay.getRouteRow(
        '901',
        RouteDirectionEnum.Inbound,
      ).shouldBeVisible();
    });

    it('should draw the visible variants with a single geometry query', () => {
      showLineOnMap('901', [Priority.Standard]);

      cy.section('Only the first variant is drawn by default', () => {
        LineRoutesOverlay.getVisibilitySwitch(
          '901',
          RouteDirectionEnum.Outbound,
        ).should('have.attr', 'aria-checked', 'true');
        LineRoutesOverlay.getVisibilitySwitch(
          '901',
          RouteDirectionEnum.Inbound,
        ).should('have.attr', 'aria-checked', 'false');
        LineRoutesOverlay.getRouteRowToggle(
          '901',
          RouteDirectionEnum.Outbound,
        ).should('have.attr', 'aria-expanded', 'true');

        expectRenderedRouteIdCount(1);
      });

      cy.section('Both variants are fetched with one query', () => {
        LineRoutesOverlay.getVisibilitySwitch(
          '901',
          RouteDirectionEnum.Inbound,
        ).click();

        expectRenderedRouteIdCount(2);
      });
    });

    it('should show the stops of an opened variant without making it visible', () => {
      showLineOnMap('901', [Priority.Standard]);

      cy.section('The outbound variant is opened by default', () => {
        RouteStopsOverlay.stopsShouldBeIncludedInRoute(['E2E001', 'E2E005']);
        Map.getStopByStopLabelAndPriority(
          'E2E001',
          Priority.Standard,
        ).shouldBeVisible();
        Map.getStopByStopLabelAndPriority('E2E007', Priority.Standard).should(
          'not.exist',
        );
      });

      cy.section('Opening the inbound variant shows its stops', () => {
        LineRoutesOverlay.getRouteRowToggle(
          '901',
          RouteDirectionEnum.Inbound,
        ).click();
        Map.waitForLoadToComplete();

        RouteStopsOverlay.stopsShouldBeIncludedInRoute(['E2E007', 'E2E009']);
        Map.getStopByStopLabelAndPriority(
          'E2E007',
          Priority.Standard,
        ).shouldBeVisible();

        // Opening a row must not change what is drawn on the map.
        LineRoutesOverlay.getVisibilitySwitch(
          '901',
          RouteDirectionEnum.Inbound,
        ).should('have.attr', 'aria-checked', 'false');
      });

      cy.section('Closing the row hides the stops again', () => {
        LineRoutesOverlay.getRouteRowToggle(
          '901',
          RouteDirectionEnum.Inbound,
        ).click();
        Map.waitForLoadToComplete();

        RouteStopsOverlay.getRouteStopRow('E2E007').should('not.exist');
        Map.getStopByStopLabelAndPriority('E2E007', Priority.Standard).should(
          'not.exist',
        );
      });
    });

    it('should list the past variants when the time filters allow it', () => {
      showLineOnMap('901', [Priority.Standard]);

      LineRoutesOverlay.getRouteRows().should('have.length', 2);

      cy.section('Past routes are shown when enabled', () => {
        MapObservationDateFiltersOverlay.getToggleShowFiltersButton().click();
        MapItemTypeFiltersOverlay.setFilters({
          [KnownMapItemTypeFilters.ShowHighestPriorityCurrent]: false,
          [KnownMapItemTypeFilters.ShowPast]: true,
        });

        LineRoutesOverlay.getRouteRows().should('have.length', 3);
        // The route rows of a variant and its base route share the test id,
        // so assert the variant from the overlay contents.
        LineRoutesOverlay.getOverlay().should('contain', '901 1');
      });

      cy.section('And hidden again when disabled', () => {
        MapItemTypeFiltersOverlay.setFilters({
          [KnownMapItemTypeFilters.ShowPast]: false,
        });

        LineRoutesOverlay.getRouteRows().should('have.length', 2);
      });
    });

    it('should show the routes of a draft line', () => {
      showLineOnMap('902', [Priority.Draft]);

      LineRoutesOverlay.getHeader().should('contain', '902');
      LineRoutesOverlay.getRouteRow(
        '902',
        RouteDirectionEnum.Outbound,
      ).shouldBeVisible();
    });
  },
);
