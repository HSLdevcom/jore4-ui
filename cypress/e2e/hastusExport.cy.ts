import {
  GetInfrastructureLinksByExternalIdsResult,
  buildLine,
  buildRoute,
  buildStop,
  buildStopInJourneyPattern,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  InfraLinkAlongRouteInsertInput,
  JourneyPatternInsertInput,
  LineInsertInput,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  RouteInsertInput,
  StopInsertInput,
  StopInJourneyPatternInsertInput,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import { RoutesAndLinesPage } from '../pageObjects';
import { UUID } from '../types';
import {
  insertToDbHelper,
  removeFromDbHelper,
  SupportedResources,
} from '../utils';

// These external IDs exist in the infralink seed data.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = [
  {
    externalId: '445156',
    coordinates: [24.926699622176628, 60.164181083308065, 10.0969999999943],
  },
  {
    externalId: '442424',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  {
    externalId: '442325',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
  },
];

const stopLabels = ['H1234', 'H1235', 'H1236'];

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1234' }),
    line_id: '08d1fa6b-440c-421e-ad4d-0778d65afe60',
  },
];

const timingPlaces = [
  buildTimingPlace('78ee94c3-e856-4fdc-89ad-10b72cadb444', '1AACKT'),
  buildTimingPlace('f8a93c6f-5ef7-4b09-ae5e-0a04ea8597e9', '1ELIMK'),
  buildTimingPlace('5240633b-5c94-49c1-b1c2-26e9d61a01cd', '1AURLA'),
];

const buildStopsOnInfrastrucureLinks = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    scheduled_stop_point_id: '7ef42a37-142d-44be-9b69-dbe6adca7f34',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[1],
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    scheduled_stop_point_id: '4f8df0bc-a5cb-4fbe-a6dc-0425d55be382',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: stopLabels[2],
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    scheduled_stop_point_id: '322a32cc-7a50-402b-9c01-5dc6a6b39af6',
    timing_place_id: timingPlaces[2].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '99' }),
    route_id: '829e9d55-aa25-4ab9-858b-f2a5aa81d931',
    on_line_id: lines[0].line_id,
    validity_start: DateTime.fromISO('2022-08-11T13:08:43.315+03:00'),
    validity_end: DateTime.fromISO('2032-08-11T13:08:43.315+03:00'),
  },
];

const buildInfraLinksAlongRoute = (
  infrastructureLinkIds: UUID[],
): InfraLinkAlongRouteInsertInput[] => [
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[0],
    infrastructure_link_sequence: 0,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[1],
    infrastructure_link_sequence: 1,
    is_traversal_forwards: true,
  },
  {
    route_id: routes[0].route_id,
    infrastructure_link_id: infrastructureLinkIds[2],
    infrastructure_link_sequence: 2,
    is_traversal_forwards: true,
  },
];

const journeyPatterns: JourneyPatternInsertInput[] = [
  {
    journey_pattern_id: '6cae356b-20f4-4e04-a969-097999b351f0',
    on_route_id: routes[0].route_id,
  },
];

const stopsInJourneyPatternBase = (
  isFirstStopUsedAsTimingPoint: boolean,
  isLastStopUsedAsTimingPoint: boolean,
): StopInJourneyPatternInsertInput[] => [
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[0],
    scheduledStopPointSequence: 0,
    isUsedAsTimingPoint: isFirstStopUsedAsTimingPoint,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[1],
    scheduledStopPointSequence: 1,
    isUsedAsTimingPoint: false,
  }),
  buildStopInJourneyPattern({
    journeyPatternId: journeyPatterns[0].journey_pattern_id,
    stopLabel: stopLabels[2],
    scheduledStopPointSequence: 2,
    isUsedAsTimingPoint: isLastStopUsedAsTimingPoint,
  }),
];

const setup = (resources: SupportedResources) => {
  removeFromDbHelper(resources);
  insertToDbHelper(resources);

  cy.setupTests();
  cy.mockLogin();
  cy.visit('/routes');
};

const exportDate = DateTime.now().toISODate();
const exportFilePath = `${Cypress.config(
  'downloadsFolder',
)}/jore4-export-${exportDate}.csv`;

const teardown = (resources: SupportedResources) => {
  removeFromDbHelper(resources);
  cy.task('deleteFile', exportFilePath);
};

const comparisonExportFilePath = `${Cypress.config(
  'fixturesFolder',
)}/hastusExport/comparison-export-1.csv`;

const baseDbResources = (
  stopsInJourneyPattern: StopInJourneyPatternInsertInput[],
): Partial<SupportedResources> => {
  return {
    lines,
    routes,
    journeyPatterns,
    stopsInJourneyPattern,
  };
};

const buildTestResources = (
  infraLinkIds: UUID[],
  stopsInJourneyPattern: StopInJourneyPatternInsertInput[],
): SupportedResources => {
  const stops = buildStopsOnInfrastrucureLinks(infraLinkIds);
  const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

  return {
    ...baseDbResources(stopsInJourneyPattern),
    timingPlaces,
    stops,
    infraLinksAlongRoute,
  };
};

const testExportWhenFirstOrLastStopIsNotATimingPoint = () => {
  const routesAndLinesPage = new RoutesAndLinesPage();

  // Skip searching via UI
  cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
  routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
  routesAndLinesPage.routeLineTableRow
    .getRouteLineTableRowCheckbox('99')
    .check();
  routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
  routesAndLinesPage.toast.checkDangerToastHasMessage(
    'Seuraavia reittejä ei voida viedä: 99 (inbound). Ensimmäisen ja viimeisen pysäkin täytyy olla asetettuna käyttämään Hastus-paikkaa.',
  );
};

describe('Hastus export', () => {
  let infraLinkIds: UUID[];

  before(() => {
    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        testInfraLinks.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);
      return infraLinkIds;
    });
  });

  context('Success cases', () => {
    const stopsInJourneyPattern = stopsInJourneyPatternBase(true, true);
    let dbResources: SupportedResources;

    before(() => {
      dbResources = buildTestResources(infraLinkIds, stopsInJourneyPattern);
    });

    beforeEach(() => {
      setup(dbResources);
    });

    afterEach(() => {
      teardown(dbResources);
    });

    it(
      'Should export a line',
      { tags: [Tag.Lines, Tag.HastusExport, Tag.Smoke] },
      () => {
        const routesAndLinesPage = new RoutesAndLinesPage();

        // Search and export a line
        routesAndLinesPage.searchContainer.getChevron().click();
        // Uncheck Temporary priority button so that only Standard priority is shown
        // and exporting works
        routesAndLinesPage.searchContainer.priorityCondition
          .getTemporaryPriorityConditionButton()
          .click();
        routesAndLinesPage.searchContainer.getSearchInput().type('1234{enter}');
        routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
        routesAndLinesPage.routeLineTableRow
          .getRouteLineTableRowCheckbox('1234')
          .check();
        routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
        cy.wait('@hastusExport')
          .its('response.statusCode')
          .should('equal', 200);
        cy.readFile(exportFilePath).then((exportedFile) => {
          cy.readFile(comparisonExportFilePath).should('eq', exportedFile);
        });
      },
    );

    it(
      'Should export a route',
      { tags: [Tag.Routes, Tag.HastusExport] },
      () => {
        const routesAndLinesPage = new RoutesAndLinesPage();

        // Skip searching via UI
        cy.visit('/routes/search?label=99&priorities=10&displayedType=routes');
        routesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
        routesAndLinesPage.routeLineTableRow
          .getRouteLineTableRowCheckbox('99')
          .check();
        routesAndLinesPage.exportToolBar.getExportSelectedButton().click();
        cy.wait('@hastusExport')
          .its('response.statusCode')
          .should('equal', 200);
        cy.readFile(exportFilePath).then((exportedFile) => {
          cy.readFile(comparisonExportFilePath).should('eq', exportedFile);
        });
      },
    );
  });

  context('First and last stop are not timing points', () => {
    const stopsInJourneyPattern = stopsInJourneyPatternBase(false, false);
    let dbResources: SupportedResources;

    before(() => {
      dbResources = buildTestResources(infraLinkIds, stopsInJourneyPattern);
    });

    beforeEach(() => {
      setup(dbResources);
    });

    afterEach(() => {
      teardown(dbResources);
    });

    it(
      'Should show an error when trying to export a route whose first and last stop are not timing points',
      { tags: [Tag.Routes, Tag.HastusExport] },
      testExportWhenFirstOrLastStopIsNotATimingPoint,
    );
  });

  context('First stop is not a timing point, but the last stop is', () => {
    const stopsInJourneyPattern = stopsInJourneyPatternBase(false, true);
    let dbResources: SupportedResources;

    before(() => {
      dbResources = buildTestResources(infraLinkIds, stopsInJourneyPattern);
    });

    beforeEach(() => {
      setup(dbResources);
    });

    afterEach(() => {
      teardown(dbResources);
    });

    it(
      'Should show an error when trying to export a route whose first stop is not a timing point',
      { tags: [Tag.Routes, Tag.HastusExport] },
      testExportWhenFirstOrLastStopIsNotATimingPoint,
    );
  });

  context('Last stop is not a timing point, but the first stop is', () => {
    const stopsInJourneyPattern = stopsInJourneyPatternBase(true, false);
    let dbResources: SupportedResources;

    before(() => {
      dbResources = buildTestResources(infraLinkIds, stopsInJourneyPattern);
    });

    beforeEach(() => {
      setup(dbResources);
    });

    afterEach(() => {
      teardown(dbResources);
    });

    it(
      'Should show an error when trying to export a route whose last stop is not a timing point',
      { tags: [Tag.Routes, Tag.HastusExport] },
      testExportWhenFirstOrLastStopIsNotATimingPoint,
    );
  });
});
