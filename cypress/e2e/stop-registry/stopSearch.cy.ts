import {
  GetInfrastructureLinksByExternalIdsResult,
  Priority,
  StopInsertInput,
  StopPlaceInput,
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../../enums';
import { StopSearchBar } from '../../pageObjects/stop-registry/StopSearchBar';
import { StopSearchResultsPage } from '../../pageObjects/stop-registry/StopSearchResultsPage';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

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
  buildTimingPlace('057ebb3f-61bc-46f1-9018-f65257d11efb', '1AACKT'),
  buildTimingPlace('75f8e23d-4bcf-455a-9a14-262f71b4ea11', '1AURLA'),
];

const stopPlaceData: Array<StopPlaceInput> = [
  {
    label: 'H1122',
    stopPlace: {
      name: { lang: 'fin', value: 'Puistokaari' },
      alternativeNames: [
        {
          name: { lang: 'swe', value: 'Parkkurvan' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'fin', value: 'Puistokaari (pitkä)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: 'Parkkurvan (lång)' },
          nameType: StopRegistryNameType.Alias,
        },
      ],
      quays: [{ publicCode: 'H1122' }],
      privateCode: { value: '123456', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Puistokaari 1'] }],
      geometry: {
        coordinates: [24.86309, 60.15988], // Municipality = Helsinki
        type: StopRegistryGeoJsonType.Point,
      },
    },
  },
  {
    label: 'H1234',
    stopPlace: {
      name: { lang: 'fin', value: 'Lapinrinne' },
      alternativeNames: [
        {
          name: { lang: 'swe', value: 'Lappbrinken' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'fin', value: 'Lapinrinne (pitkä)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: 'Lappbrinken (lång)' },
          nameType: StopRegistryNameType.Alias,
        },
      ],
      quays: [{ publicCode: 'H1234' }],
      privateCode: { value: '123499', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Lapinrinteentie 25'] }],
      geometry: {
        coordinates: [24.87639, 60.32894], // Municipality = Vantaa
        type: StopRegistryGeoJsonType.Point,
      },
    },
  },
  {
    label: 'H2233',
    stopPlace: {
      name: { lang: 'fin', value: 'Tuusulanväylä' },
      alternativeNames: [
        {
          name: { lang: 'swe', value: 'Tusbyleden' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'fin', value: 'Tuusulanväylä (pitkä)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: 'Tusbyleden (lång)' },
          nameType: StopRegistryNameType.Alias,
        },
      ],
      quays: [{ publicCode: 'H2233' }],
      keyValues: [{ key: 'streetAddress', values: ['Tuusulanväylä 10-16'] }],
      geometry: {
        coordinates: [24.99721, 60.32129], // Municipality = Vantaa
        type: StopRegistryGeoJsonType.Point,
      },
    },
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
      coordinates: testInfraLinks[0].coordinates,
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
      coordinates: testInfraLinks[1].coordinates,
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
      coordinates: testInfraLinks[2].coordinates,
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
  });

  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: stopPlaceData,
    });

    stopSearchBar = new StopSearchBar();
    stopSearchResultsPage = new StopSearchResultsPage();
  });

  beforeEach(() => {
    cy.setupTests();
    cy.mockLogin();

    cy.visit('/stop-registry');
    stopSearchBar.getSearchInput().clear();
  });

  describe('by label', () => {
    it(
      'should be able to search with an exact stop label',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
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

  describe('by ELY number', () => {
    it(
      'should be able to search with an exact ELY number',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type(`123456`);
        stopSearchBar.getSearchButton().click();

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1122');
      },
    );

    it(
      'should be able to search with an asterix',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type(`1234*`);
        stopSearchBar.getSearchButton().click();

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 2);
        stopSearchResultsPage.getResultRows().should('contain', 'H1122');
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );

    it(
      'should show no results when search does not match any stops',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type(`not-an-ELY-number`);
        stopSearchBar.getSearchButton().click();

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });

  describe('by address', () => {
    it(
      'should be able to search with an exact address',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        stopSearchBar.getSearchInput().type(`Tuusulanväylä 10-16{enter}`);

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H2233');
      },
    );

    it(
      'should be able to search with an asterix',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        stopSearchBar.getSearchInput().type(`Tuusul*{enter}`);

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H2233');
      },
    );

    it(
      'should show no results when search does not match any stops',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        stopSearchBar.getSearchInput().type(`no address 22{enter}`);

        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });

  describe('Search criteria', () => {
    it(
      'Should trigger search when the search criteria is changed and the search input field contains text',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`Puistokaari 1`);
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1122');
      },
    );

    it(
      'Should not trigger a search when the search criteria is changed if the search input field is empty',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`H2233{enter}`);
        cy.wait('@gqlSearchStops');
        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H2233');

        stopSearchBar.getSearchInput().clear();
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H2233');
      },
    );
  });

  describe('by municipality', () => {
    it(
      'Should search by all municipalities by default',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`*`);
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.openMunicipalityDropdown();
        stopSearchBar.isMunicipalitySelected('Kaikki');
        stopSearchBar.getSearchButton().click();
        cy.wait('@gqlSearchStops');
        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 3);
      },
    );

    it(
      'should be able to search with one municipality',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.openMunicipalityDropdown();
        stopSearchBar.isMunicipalitySelected('Kaikki');
        stopSearchBar.toggleMunicipality('Kaikki');
        stopSearchBar.toggleMunicipality('Vantaa');
        stopSearchBar.getSearchButton().click();
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 2);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
        stopSearchResultsPage.getResultRows().should('contain', 'H2233');
      },
    );
  });

  describe('by name variants', () => {
    it(
      'should be able to search with an exact name',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Lapinrinne{enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );

    it(
      'should be able to search with an exact translation name',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Lappbrinken{enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );

    it(
      'should be able to search with an exact finnish name alias (long name)',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Lapinrinne (pitkä){enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );
    it(
      'should be able to search with an exact swedish name alias (long name)',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Lappbrinken (lång){enter}`);
        cy.wait('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'H1234');
      },
    );
  });
});
