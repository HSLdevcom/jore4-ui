import {
  GetInfrastructureLinksByExternalIdsResult,
  Priority,
  StopInsertInput,
  StopRegistryNameType,
  StopRegistryStopPlace,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToDeleteStopPlaceMutation,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { testInfraLinksThree } from '../../datasets';
import { Tag } from '../../enums';
import { StopSearchBar } from '../../pageObjects/stop-registry/StopSearchBar';
import { StopSearchResultsPage } from '../../pageObjects/stop-registry/StopSearchResultsPage';
import { UUID } from '../../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../../utils';

const timingPlaces = [
  buildTimingPlace('057ebb3f-61bc-46f1-9018-f65257d11efb', '1AACKT'),
  buildTimingPlace('75f8e23d-4bcf-455a-9a14-262f71b4ea11', '1AURLA'),
];

const stopPlaceData: Array<Partial<StopRegistryStopPlace>> = [
  {
    name: { lang: 'fin', value: 'Puistokaari' },
  },
  {
    name: { lang: 'fin', value: 'Lapinrinne' },
    alternativeNames: [
      {
        name: { lang: 'swe', value: 'Lappbrinken' },
        nameType: StopRegistryNameType.Translation,
      },
    ],
  },
  {
    name: { lang: 'fin', value: 'Tuusulanväylä' },
  },
];

const buildScheduledStopPoints = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: 'H1122',
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    scheduled_stop_point_id: '772a788b-75ab-4bf1-94af-f76182886344',
    timing_place_id: timingPlaces[0].timing_place_id,
    priority: Priority.Draft,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinksThree[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'H1234',
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-04-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '92048575-488c-4811-8b8f-de40ee90d9b1',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinksThree[1].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'H2233',
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-02-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '8e7a7175-6bd5-42f1-bdc7-ad0e531beede',
    timing_place_id: null,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinksThree[2].coordinates,
    },
  },
];

describe('Stop search', () => {
  let stopSearchBar: StopSearchBar;
  let stopSearchResultsPage: StopSearchResultsPage;
  const baseDbResources = {
    timingPlaces,
  };
  let dbResources: SupportedResources &
    Required<Pick<SupportedResources, 'stops'>>;
  let stopPlaceIds: Array<string>;

  before(() => {
    cy.task<GetInfrastructureLinksByExternalIdsResult>(
      'hasuraAPI',
      mapToGetInfrastructureLinksByExternalIdsQuery(
        testInfraLinksThree.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      const infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);

      const stops = buildScheduledStopPoints(infraLinkIds);
      dbResources = {
        ...baseDbResources,
        stops,
      };
    });
  });

  beforeEach(() => {
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    cy.task<string[]>('insertStopPlaces', {
      scheduledStopPoints: dbResources.stops,
      stopPlaces: stopPlaceData,
    }).then((_stopPlaceIds) => {
      stopPlaceIds = _stopPlaceIds;
    });

    stopSearchBar = new StopSearchBar();
    stopSearchResultsPage = new StopSearchResultsPage();
  });

  beforeEach(() => {
    cy.setupTests();
    cy.mockLogin();

    cy.visit('/stop-registry/search');
    stopSearchBar.getSearchInput().clear();
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);

    cy.task(
      'hasuraAPIMultiple',
      stopPlaceIds.map((stopPlaceId) =>
        mapToDeleteStopPlaceMutation(stopPlaceId),
      ),
    );
  });

  describe('by label', () => {
    it(
      'should be able to search with an exact stop label',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`H1234{enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );

    it(
      'should be able to search with an asterisk',
      { tags: [Tag.StopRegistry, Tag.Smoke] },
      () => {
        stopSearchBar.getSearchInput().type(`H1*{enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 2);

        // Ordered by label.
        stopSearchResultsPage.getResultRows().eq(0).should('contain', 'H1122');
        stopSearchResultsPage.getResultRows().eq(1).should('contain', 'H1234');
      },
    );

    it(
      'should show no results when search does not match any stops',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`*404*{enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });
});
