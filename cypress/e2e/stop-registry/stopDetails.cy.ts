import {
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  extractStopPlaceIdFromResponse,
  GetInfrastructureLinksByExternalIdsResult,
  InsertStopPlaceResult,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  mapToDeleteStopPlaceMutation,
  mapToInsertStopPlaceMutation,
  Priority,
  StopInsertInput,
  StopRegistryStopPlace,
  StopRegistryNameType,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../../enums';
import { StopDetailsPage } from '../../pageObjects';
import { UUID } from '../../types';
import {
  insertToDbHelper,
  removeFromDbHelper,
  SupportedResources,
} from '../../utils';

// These infralink IDs exist in the 'infraLinks.sql' test data file.
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

const timingPlaces = [
  buildTimingPlace('352f8fd6-0eaa-4b01-a2db-734431092d62', '1AACKT'),
  buildTimingPlace('0388c3fb-a08b-461c-8655-581f06e9c2f5', '1AURLA'),
];

const stopLabels = ['H1122', 'H1234'];

const stopPlaceData: Array<Partial<StopRegistryStopPlace>> = [
  {
    name: { lang: 'fi_FI', value: 'Puistokaari' },
    keyValues: [{ key: 'label', values: [stopLabels[0]] }],
  },
  {
    name: { lang: 'fi_FI', value: 'Lapinrinne' },
    alternativeNames: [
      {
        name: { lang: 'sv_FI', value: 'Lappbrinken' },
        nameType: StopRegistryNameType.Translation,
      },
    ],
    keyValues: [{ key: 'label', values: [stopLabels[1]] }],
  },
];

const buildScheduledStopPoints = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: stopLabels[0],
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    scheduled_stop_point_id: 'd4e6478a-adce-4c76-8579-c8ca2a6bb70f',
    timing_place_id: timingPlaces[0].timing_place_id,
    priority: Priority.Draft,
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
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '3354eef5-0eaf-4b43-8b2f-14c867633342',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
];

describe('Stop details', () => {
  let stopDetailsPage: StopDetailsPage;
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
        testInfraLinks.map((infralink) => infralink.externalId),
      ),
    ).then((res) => {
      const infraLinkIds = extractInfrastructureLinkIdsFromResponse(res);

      const stops = buildScheduledStopPoints(infraLinkIds);
      dbResources = {
        ...baseDbResources,
        stops,
      };
    });

    cy.task<InsertStopPlaceResult[]>(
      'hasuraAPIMultiple',
      stopPlaceData.map((stopPlace) => mapToInsertStopPlaceMutation(stopPlace)),
    ).then((responses) => {
      stopPlaceIds = responses.map(extractStopPlaceIdFromResponse);
    });
  });

  beforeEach(() => {
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);

    stopDetailsPage = new StopDetailsPage();

    cy.mockLogin();
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

  it(
    'should view details for a stop',
    { tags: [Tag.StopRegistry, Tag.Smoke] },
    () => {
      stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
      stopDetailsPage.page().should('be.visible');

      stopDetailsPage.label().should('have.text', 'H1234');
      stopDetailsPage.names().should('have.text', 'Lapinrinne|Lappbrinken');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');
    },
  );
});
