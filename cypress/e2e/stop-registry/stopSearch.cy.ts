import {
  InfrastructureNetworkDirectionEnum,
  Priority,
  RouteTypeOfLineEnum,
  StopAreaInput,
  StopInsertInput,
  StopRegistryGeoJsonType,
  StopRegistryInfoSpotInput,
  StopRegistryQuayInput,
  StopRegistryShelterElectricity,
  StopRegistryShelterEquipmentInput,
  StopRegistryShelterType,
  StopRegistryTransportModeType,
  buildLine,
  buildStop,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import compact from 'lodash/compact';
import range from 'lodash/range';
import uniqBy from 'lodash/uniqBy';
import without from 'lodash/without';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  stopCoordinatesByLabel,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { StopPlaceState, Tag } from '../../enums';
import {
  Map,
  MapFooter,
  MapPage,
  MapStopSelection,
  Pagination,
  SearchForStopAreas,
  SearchForTerminals,
  SortByButton,
  StopAreaDetailsPage,
  StopGroupSelector,
  StopSearchBar,
  StopSearchByLine,
  StopSearchResultsPage,
  TerminalDetailsPage,
} from '../../pageObjects';
import { StopPopUp } from '../../pageObjects/StopPopUp';
import { InsertQuayInput, InsertQuaysResult } from '../../support/types';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();

const stopSearchBar = new StopSearchBar();
const stopSearchResultsPage = new StopSearchResultsPage();
const stopSearchByLine = new StopSearchByLine();
const stopGroupSelector = new StopGroupSelector();
const searchForStopAreas = new SearchForStopAreas();
const searchForTerminals = new SearchForTerminals();
const sortByButton = new SortByButton();
const pagination = new Pagination();
const map = new Map();
const mapPage = new MapPage();
const mapFooter = new MapFooter();
const mapStopSelection = new MapStopSelection();
const stopPopUp = new StopPopUp();

function getUuid(index: number) {
  if (!Number.isInteger(index)) {
    throw new Error(`Index must be an integer! But was: ${index}`);
  }

  const base = '10000000-0000-4000-9000-000000000000';
  const indexStr = index.toString(10);

  return base.substring(0, base.length - indexStr.length) + indexStr;
}

const template: StopRegistryQuayInput = {
  keyValues: [
    { key: 'stopState', values: [StopPlaceState.InOperation] },
    { key: 'priority', values: ['10'] },
    { key: 'validityStart', values: ['2025-01-01'] },
  ],
};

const shelterPostTemplate: StopRegistryShelterEquipmentInput = {
  shelterNumber: 1,
  shelterType: StopRegistryShelterType.Post,
};

const shelterUrbanTemplate: StopRegistryShelterEquipmentInput = {
  shelterNumber: 1,
  shelterType: StopRegistryShelterType.Urban,
};

const geoDelta = 0.00002;

type PointGeometry = {
  coordinates: number[];
  type: StopRegistryGeoJsonType.Point;
};

const centroids = {
  helsinki: {
    coordinates: [24.9342, 60.1756],
    type: StopRegistryGeoJsonType.Point,
  },
  vantaa: {
    coordinates: [25.0333, 60.3],
    type: StopRegistryGeoJsonType.Point,
  },
  espoo: {
    coordinates: [24.66, 60.21],
    type: StopRegistryGeoJsonType.Point,
  },
  kauniainen: {
    coordinates: [24.7264, 60.2097],
    type: StopRegistryGeoJsonType.Point,
  },
} as const satisfies Readonly<Record<string, PointGeometry>>;

function offsetPoint(
  point: PointGeometry,
  index: number,
  columns = 10,
  delta = geoDelta,
): PointGeometry {
  const [startLongitude, startLatitude] = point.coordinates;

  return {
    type: StopRegistryGeoJsonType.Point,
    coordinates: [
      startLongitude + (index % columns) * delta,
      startLatitude + Math.floor(index / columns) * delta,
    ],
  };
}

let generatedQuayIndex = 0;

function generateQuay(
  stopPlaceId: string,
  ...changes: ReadonlyArray<Partial<StopRegistryQuayInput>>
): InsertQuayInput {
  const location: Partial<StopRegistryQuayInput> = {
    geometry: offsetPoint(centroids.helsinki, generatedQuayIndex),
  };
  generatedQuayIndex += 1;

  const input = [template, location, ...changes].reduce(
    (compiled, set) => ({
      ...compiled,
      ...set,
      keyValues: uniqBy(
        compact((set.keyValues ?? [])?.concat(compiled.keyValues ?? [])),
        (kv) => kv.key,
      ),
    }),
    {},
  );

  return { stopPlaceId, input };
}

function shouldHaveResultOf(
  ...expectedStops: ReadonlyArray<string | ReadonlyArray<string>>
) {
  const flattened = expectedStops.flat();
  stopSearchResultsPage
    .getResultCount()
    .should('contain.text', `${flattened.length} hakutulos`);
  flattened.forEach((stop) => {
    stopSearchResultsPage.getRowByLabel(stop).shouldBeVisible();
  });
}

describe('Stop search', () => {
  let dbResources: SupportedResources;
  let testInfraLinkIds: ReadonlyArray<UUID>;

  let insertedData: 'custom' | 'hardcoded' | null = null;

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      testInfraLinkIds = infraLinkIds;
      const stops = buildStopsOnInfraLinks(infraLinkIds);

      const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

      dbResources = {
        ...baseDbResources,
        stops,
        infraLinksAlongRoute,
      };
    });
  });

  function insertHardcodedTestData() {
    if (insertedData === 'hardcoded') {
      return;
    }

    cy.task('resetDbs');
    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>(
      'insertStopRegistryData',
      getClonedBaseStopRegistryData(),
    );

    insertedData = 'hardcoded';
  }

  function setupTestsAndNavigateToPage(qs: Record<string, unknown>) {
    cy.setupTests();
    cy.mockLogin();

    cy.visit({ url: '/stop-registry/search', qs });

    stopSearchBar.getSearchInput().clear();
  }

  function initWithHardcodedData() {
    insertHardcodedTestData();
    setupTestsAndNavigateToPage({});
  }

  describe('by label', () => {
    beforeEach(initWithHardcodedData);

    it(
      'should be able to search with an exact stop label',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`E2E001{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
      },
    );

    it(
      'should be able to search with an asterisk',
      { tags: [Tag.StopRegistry, Tag.Smoke] },
      () => {
        stopSearchBar.getSearchInput().type(`E2E00*{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 9);

        // Ordered by label.
        stopSearchResultsPage.getResultRows().eq(0).should('contain', 'E2E001');
        stopSearchResultsPage.getResultRows().eq(1).should('contain', 'E2E002');
        stopSearchResultsPage.getResultRows().eq(2).should('contain', 'E2E003');
        stopSearchResultsPage.getResultRows().eq(3).should('contain', 'E2E004');
        stopSearchResultsPage.getResultRows().eq(4).should('contain', 'E2E005');
        stopSearchResultsPage.getResultRows().eq(5).should('contain', 'E2E006');
        stopSearchResultsPage.getResultRows().eq(6).should('contain', 'E2E007');
        stopSearchResultsPage.getResultRows().eq(7).should('contain', 'E2E008');
        stopSearchResultsPage.getResultRows().eq(8).should('contain', 'E2E009');
      },
    );

    it(
      'should show no results when search does not match any stops',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`*404*{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });

  describe('by ELY number', () => {
    beforeEach(initWithHardcodedData);

    // not ok

    it(
      'should be able to search with an exact ELY number',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type(`E2E001`);
        stopSearchBar.getSearchButton().click();

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
      },
    );

    it(
      'should be able to search with an asterix',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type('E2E00*');
        stopSearchBar.getSearchButton().click();

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 9);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E002');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E003');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E005');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E006');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E007');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E008');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E009');
      },
    );

    it(
      'should show no results when search does not match any stops',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.getElyInput().type(`not-an-ELY-number`);
        stopSearchBar.getSearchButton().click();

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });

  describe('by address', () => {
    beforeEach(initWithHardcodedData);

    it(
      'should be able to search with an exact address',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        stopSearchBar.getSearchInput().type(`Annankatu 15{enter}`);

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 2);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E009');
      },
    );

    it(
      'should be able to search with an asterix',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        stopSearchBar.getSearchInput().type(`Annankatu*{enter}`);

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 3);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E002');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E009');
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

        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('not.exist');
      },
    );
  });

  describe('Search criteria', () => {
    beforeEach(initWithHardcodedData);

    it(
      'Should trigger search when the search criteria is changed and the search input field contains text',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`Albertinkatu 38`);
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );

    it(
      'Should not trigger a search when the search criteria is changed if the search input field is empty',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`E2E004{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');
        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');

        stopSearchBar.getSearchInput().clear();
        stopSearchBar.searchCriteriaRadioButtons
          .getAddressRadioButton()
          .click();

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );
  });

  describe('by municipality', () => {
    beforeEach(initWithHardcodedData);

    it(
      'Should search by all municipalities by default',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`*`);
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.municipality.openDropdown();
        stopSearchBar.municipality.isSelected('Kaikki');
        stopSearchBar.getSearchButton().click();
        expectGraphQLCallToSucceed('@gqlSearchStops');
        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 10);
      },
    );

    it(
      'should be able to search with one municipality',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.municipality.openDropdown();
        stopSearchBar.municipality.isSelected('Kaikki');
        stopSearchBar.municipality.toggleOption('Espoo');
        stopSearchBar.getSearchButton().click();
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E010');
      },
    );
  });

  describe('by name variants', () => {
    beforeEach(initWithHardcodedData);

    it(
      'should be able to search with an exact name',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Albertinkatu 38{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );

    it(
      'should be able to search with an exact translation name',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Albertsgatan 38{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );

    it(
      'should be able to search with an exact finnish name alias (long name)',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Albertinkatu 38 (pitkä){enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );

    it(
      'should be able to search with an exact swedish name alias (long name)',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.searchCriteriaRadioButtons
          .getLabelRadioButton()
          .should('be.checked');
        stopSearchBar.getSearchInput().type(`Albertsgatan 38 (lång){enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      },
    );
  });

  describe('by line label', () => {
    const SHOW_ALL_BY_DEFAULT_MAX = 20;

    // Create extra lines so that showAll/hideExta functionality can be tested.
    // Search: LE* should fit in show all by default range
    // Search: L* should not fit.
    function insertExtraLines() {
      const lines = range(SHOW_ALL_BY_DEFAULT_MAX * 2).map((i) => ({
        ...buildLine({
          label: i < SHOW_ALL_BY_DEFAULT_MAX ? `LE${i}` : `L${i}`,
        }),
        line_id: getUuid(i),
        type_of_line: RouteTypeOfLineEnum.StoppingBusService,
        validity_start: DateTime.fromISO('2000-01-01'),
      }));
      insertToDbHelper({ lines });
      return lines.map((line) => line.label as string);
    }

    // We do not currently have custom fonts defined on the App, and instead the
    // system defaults are used → Each system having a different set of fonts.
    // Thus, proper testing of the hide/show all lines functionality that depends
    // on window width, font width & size, is not possible if those values change
    // between systems.
    // So we must inject a known font into the App that ensures consistent
    // rendering between systems and runs.
    function injectKnownMonospaceFont() {
      cy.document().then((doc) => {
        const style = doc.createElement('style');
        style.innerHTML = `
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

          html {
            font-family: "Noto Sans";
            font-optical-sizing: auto;
            font-variation-settings: "wdth" 100;
          }

          .font-mono {
            font-family: "Noto Sans Mono";
            font-optical-sizing: auto;
            font-variation-settings: "wdth" 100;
          }
        `;

        doc.head.append(style);

        // Block until the required fonts are actually loaded and usable.
        return Promise.all(
          Array.from(doc.fonts.values())
            .filter(
              (font) =>
                // Noto Sans or Noto Sans Mono
                font.family.includes('Noto Sans') &&
                // Includes the basic latin range
                font.unicodeRange.includes('U+0000-00FF'),
            )
            .map((font) => font.load()),
        );
      });
    }

    function assertShowsAllResultsByDefault() {
      stopSearchBar.getSearchInput().clearAndType(`LE*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindLinesByStopSearch');

      // Should contain and show all LE -lines
      stopGroupSelector.shouldHaveGroups(
        range(SHOW_ALL_BY_DEFAULT_MAX).map((i) => `LE${i}`),
      );
      stopGroupSelector.getShowAllGroupsButton().should('not.exist');
      stopGroupSelector.getShowLessGroupsButton().should('not.exist');
    }

    function assertShowAllAndShowLessWork(
      allExtraLines: ReadonlyArray<string>,
    ) {
      stopSearchBar.getSearchInput().clearAndType(`L*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindLinesByStopSearch');

      // Changes in CSS styles, viewport size, and the line labels can influence
      // the list of shown labels.
      cy.viewport(1000, 1080);
      // prettier-ignore
      stopGroupSelector
        .shouldHaveGroups(['L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29']);

      cy.viewport(500, 1080);
      // prettier-ignore
      const minimalResult = ['L20', 'L21', 'L22', 'L23', 'L24'];
      stopGroupSelector.shouldHaveGroups(minimalResult);

      stopGroupSelector.getShowLessGroupsButton().should('not.exist');
      stopGroupSelector
        .getShowAllGroupsButton()
        .should('contain', `Näytä kaikki (${SHOW_ALL_BY_DEFAULT_MAX * 2})`)
        .click();
      stopGroupSelector.getShowLessGroupsButton().shouldBeVisible();
      stopGroupSelector.getShowAllGroupsButton().should('not.exist');
      stopGroupSelector.shouldHaveGroups(allExtraLines);

      stopGroupSelector.getShowLessGroupsButton().click();

      stopGroupSelector.shouldHaveGroups(minimalResult);
      stopGroupSelector.getShowAllGroupsButton().shouldBeVisible();
    }

    let allExtraLines: ReadonlyArray<string> = [];

    before(() => {
      insertHardcodedTestData();
      allExtraLines = insertExtraLines();
      insertedData = 'custom';
    });

    beforeEach(() => setupTestsAndNavigateToPage({}));

    it('should have a working asterisk search and line selector', () => {
      injectKnownMonospaceFont();

      stopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();

      assertShowsAllResultsByDefault();
      assertShowAllAndShowLessWork(allExtraLines);
    });

    function assertIsObject(obj: unknown): asserts obj is object {
      expect(obj).to.be.an('object');
    }

    type RouteInfoForAssert = Readonly<
      Record<
        'label' | 'directionSymbol' | 'directionTitle' | 'name' | 'validity',
        string
      >
    >;

    function assertRouteInfo(id: string, info: RouteInfoForAssert) {
      stopSearchByLine.getRouteInfoContainer(id).within(() => {
        stopSearchByLine.getRouteLabel().shouldHaveText(info.label);

        stopSearchByLine
          .getRouteDirection()
          .shouldHaveText(info.directionSymbol)
          .and('have.attr', 'title', info.directionTitle);

        stopSearchByLine.getRouteName().shouldHaveText(info.name);

        stopSearchByLine.getRouteValidity().shouldHaveText(info.validity);

        stopSearchByLine.getRouteLocatorButton().shouldBeVisible();
      });
    }

    function assertOutboundRouteIsValid() {
      const outbound = baseDbResources.routes.find(
        ({ label, direction }) => label === '901' && direction === 'outbound',
      );
      assertIsObject(outbound);
      assertRouteInfo(outbound.route_id, {
        label: '901',
        directionSymbol: '1',
        directionTitle: 'Keskustasta pois',
        name: 'route 901',
        validity: 'Voimassa 11.8.2022 - 11.8.2032',
      });

      stopSearchResultsPage
        .getRowByLabel('E2E001')
        .shouldBeVisible()
        .and('contain', 'E2E001')
        .and('contain', '1AACKT')
        .and('contain', 'Annankatu 15')
        .and('contain', '20.3.2020-');

      stopSearchResultsPage.getRowByLabel('E2E002').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E003').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E004').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E005').shouldBeVisible();
    }

    function assertInboundRouteIsValid() {
      const inbound = baseDbResources.routes.find(
        ({ label, direction }) => label === '901' && direction === 'inbound',
      );
      assertIsObject(inbound);
      assertRouteInfo(inbound.route_id, {
        label: '901',
        directionSymbol: '2',
        directionTitle: 'Keskustaan päin',
        name: 'route 901',
        validity: 'Voimassa 11.8.2022 - 11.8.2032',
      });

      stopSearchResultsPage
        .getRowByLabel('E2E005')
        .shouldBeVisible()
        .and('contain', 'E2E005')
        .and('contain', '1EIRA')
        .and('contain', 'Lönnrotinkatu 32')
        .and('contain', '20.3.2020-');

      stopSearchResultsPage.getRowByLabel('E2E006').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E007').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E008').shouldBeVisible();
      stopSearchResultsPage.getRowByLabel('E2E009').shouldBeVisible();
    }

    it('should find and display line 901 routes', () => {
      stopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      stopSearchBar.getSearchInput().clearAndType(`901{enter}`);

      stopSearchByLine.getActiveLineName().shouldHaveText('901 line 901');
      stopSearchByLine
        .getActiveLineValidity()
        .should('contain', 'Voimassa 1.1.2022 -');

      stopSearchByLine
        .getActiveLineAllStopsCount()
        .shouldHaveText('9 pysäkkiä');
      stopSearchByLine
        .getActiveLineInboundStopsCount()
        .shouldHaveText('5 pys.');
      stopSearchByLine
        .getActiveLineOutboundStopsCount()
        .shouldHaveText('5 pys.');

      assertOutboundRouteIsValid();
      assertInboundRouteIsValid();
    });

    it('should be able to select multiple lines', () => {
      stopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      stopSearchBar.getSearchInput().clearAndType(`9*{enter}`);

      stopGroupSelector.getGroupSelectors().contains('901').click();
      stopGroupSelector.getGroupSelectors().contains('9999').click();

      stopGroupSelector.getGroupSelectors().should('have.length', 3);
      stopGroupSelector.getGroupSelectors().eq(0).should('contain', '901');
      stopGroupSelector.getGroupSelectors().eq(2).should('contain', '9999');

      // Assert that both lines are shown
      stopSearchByLine.getActiveLineName().should('have.length', 2);
      stopSearchByLine.getActiveLineName().eq(0).should('contain', '901');
      stopSearchByLine.getActiveLineName().eq(1).should('contain', '9999');
    });
  });

  describe('for stop areas', () => {
    beforeEach(initWithHardcodedData);

    it('should find all by *', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      stopSearchBar.getSearchInput().clearAndType(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      stopGroupSelector.shouldHaveGroups([
        'X0003',
        'X0004',
        'E2E002',
        'E2E004',
        'E2E005',
        'E2E007',
        'E2E008',
        'E2E010',
        'E2E011',
        'E2ENQ',
      ]);
    });

    it('should find and navigate to X0004', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      stopSearchBar.getSearchInput().clearAndType(`X0004{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      stopGroupSelector.shouldHaveGroups(['X0004']);

      searchForStopAreas
        .getStopAreaLabel()
        .shouldHaveText('Pysäkkialue X0004 | Kalevankatu 32');

      searchForStopAreas.getLocatorButton().shouldBeVisible();

      stopSearchResultsPage
        .getRowByLabel('E2E003')
        .shouldBeVisible()
        .and('contain', 'E2E003')
        .and('contain', '1AURLA')
        .and('contain', 'Kalevankatu 32')
        .and('contain', '20.3.2020-');

      stopSearchResultsPage
        .getRowByLabel('E2E006')
        .shouldBeVisible()
        .and('contain', 'E2E006')
        .and('contain', '1AURLA')
        .and('contain', 'Kalevankatu 32')
        .and('contain', '20.3.2020-');

      searchForStopAreas.getStopAreaLink().click();

      const stopAreaDetailsPage = new StopAreaDetailsPage();
      // TODO: Refactor to check privateCode after area details tests are ready
      stopAreaDetailsPage.details.getName().should('contain', 'Kalevankatu 32');

      cy.go('back');

      searchForStopAreas.getActionMenu().click();

      searchForStopAreas.getActionMenuShowOnMap().shouldBeVisible();

      searchForStopAreas.getActionMenuShowDetails().click();

      stopAreaDetailsPage.details.getName().should('contain', 'Kalevankatu 32');
    });

    it('should find E2ENQ and display no stops', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      stopSearchBar.getSearchInput().clearAndType(`E2ENQ{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      stopGroupSelector.shouldHaveGroups(['E2ENQ']);

      searchForStopAreas
        .getStopAreaLabel()
        .shouldHaveText('Pysäkkialue E2ENQ | No quays');

      searchForStopAreas
        .getNoStopsInStopAreaText()
        .shouldHaveText('Ei pysäkkejä.Siirry pysäkkialueen tietoihin.');
      searchForStopAreas.getNoStopsInStopAreaLink().click();

      const stopAreaDetailsPage = new StopAreaDetailsPage();
      stopAreaDetailsPage.details.getName().should('contain', 'No quays');
    });
  });

  describe('for terminals', () => {
    beforeEach(initWithHardcodedData);

    it('should find all by *', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');

      stopSearchBar.getSearchInput().clearAndType(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      stopGroupSelector.shouldHaveGroups(['T2']);
    });

    it('should find and navigate to T2', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');

      stopSearchBar.getSearchInput().clearAndType(`T2{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      stopGroupSelector.shouldHaveGroups(['T2']);

      searchForTerminals
        .getTerminalLabel()
        .shouldHaveText('Terminaali T2 | E2ET001');

      searchForTerminals.getLocatorButton().shouldBeVisible();

      stopSearchResultsPage
        .getRowByLabel('E2E008')
        .shouldBeVisible()
        .and('contain', 'E2E008')
        .and('contain', 'Kuttulammentie')
        .and('contain', '20.3.2020-');

      stopSearchResultsPage
        .getRowByLabel('E2E010')
        .shouldBeVisible()
        .and('contain', 'E2E010')
        .and('contain', '1AACKT')
        .and('contain', 'Finnoonkartano')
        .and('contain', '20.3.2020-');

      searchForTerminals.getTerminalLink().click();

      const terminalDetailsPage = new TerminalDetailsPage();
      terminalDetailsPage.titleRow.getPrivateCode().should('contain', 'T2');

      cy.go('back');

      searchForTerminals.getActionMenu().click();

      searchForTerminals.getActionMenuShowOnMap().shouldBeVisible();

      searchForTerminals.getActionMenuShowDetails().click();

      terminalDetailsPage.titleRow.getPrivateCode().should('contain', 'T2');
    });
  });

  describe('Sorting & paging', () => {
    beforeEach(() => {
      insertHardcodedTestData();
      setupTestsAndNavigateToPage({ pageSize: 5 });
    });

    function assertResultOrder(expectedOrder: ReadonlyArray<string>) {
      expectedOrder.forEach((label, index) => {
        stopSearchResultsPage
          .getResultRows()
          .eq(index)
          .should('contain', label);
      });
    }

    it('should sort on basic stop search', () => {
      stopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Label ascending
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      // Label descending
      sortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E008', 'E2E007', 'E2E006', 'E2E005']);

      // Name descending
      sortByButton.getButton('name').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('name', 'desc');
      assertResultOrder(['E2E005', 'E2E008', 'E2E006', 'E2E003', 'E2E007']);

      // Name ascending
      sortByButton.getButton('name').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('name', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E007']);

      // Address ascending
      sortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('address', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E007']);

      // Address descending
      sortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('address', 'desc');
      assertResultOrder(['E2E005', 'E2E008', 'E2E006', 'E2E003', 'E2E007']);
    });

    it('should page on basic stop search', () => {
      stopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Label ascending
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      pagination.getNextPageButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E006', 'E2E007', 'E2E008', 'E2E009']);
    });

    it('should sort on stop search by line', () => {
      stopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      stopSearchBar.getSearchInput().type(`*{enter}`);

      sortByButton.assertSorting('sequenceNumber', 'groupOnly');
      stopSearchByLine
        .getRouteContainer('994a7d79-4991-423b-9c1a-0ca621a6d9ed')
        .within(() => {
          assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);
        });

      // Label ascending
      sortByButton.getButton('label').click();
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      // Label descending
      sortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E008', 'E2E007', 'E2E006', 'E2E005']);
    });

    it('should sort on search for stop areas', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      stopSearchBar.getSearchInput().type(`X*{enter}`);
      stopGroupSelector.getGroupSelectors().contains('X0003').click();
      searchForStopAreas.getStopAreaLabel();

      sortByButton.assertSorting('byStopArea', 'groupOnly');
      assertResultOrder(['E2E001', 'E2E009']);

      // Label ascending
      sortByButton.getButton('label').click();
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E003', 'E2E006', 'E2E009']);

      // Label descending
      sortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E006', 'E2E003', 'E2E001']);
    });

    it('should be able to select multiple stop areas', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      stopSearchBar.getSearchInput().clearAndType(`X*{enter}`);
      stopGroupSelector.getGroupSelectors().contains('X0003').click();

      searchForStopAreas.getStopAreaLabel().should('contain', 'X0003');

      stopGroupSelector.getGroupSelectors().contains('X0004').click();
      searchForStopAreas.getStopAreaLabel().should('have.length', 2);
      searchForStopAreas.getStopAreaLabel().eq(0).should('contain', 'X0003');
      searchForStopAreas.getStopAreaLabel().eq(1).should('contain', 'X0004');

      stopGroupSelector.getGroupSelectors().contains('X0003').click();
      searchForStopAreas.getStopAreaLabel().should('have.length', 1);
      searchForStopAreas.getStopAreaLabel().should('contain', 'X0004');
    });

    it('should sort on search for terminals', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');
      stopSearchBar.getSearchInput().type(`T*{enter}`);
      stopGroupSelector.getGroupSelectors().contains('T2').click();
      searchForTerminals.getTerminalLabel();

      sortByButton.assertSorting('byTerminal', 'groupOnly');
      assertResultOrder(['E2E008', 'E2E010']);

      // Label ascending
      sortByButton.getButton('label').click();
      sortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E008', 'E2E010']);

      // Label descending
      sortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E010', 'E2E008']);
    });
  });

  describe('Priority visualization', () => {
    const today = DateTime.now().startOf('day');
    const startDate = today.minus({ years: 1 });

    beforeEach(() => {
      const extraPrioStops: StopInsertInput[] = [
        {
          // All good
          ...buildStop({
            label: 'P0001',
            located_on_infrastructure_link_id: testInfraLinkIds[0],
          }),

          priority: Priority.Standard,
          validity_start: startDate,
          validity_end: null,

          direction: InfrastructureNetworkDirectionEnum.Forward,
          scheduled_stop_point_id: getUuid(1),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E001,
          },
        },
        {
          // All good, Draft
          ...buildStop({
            label: 'P0002',
            located_on_infrastructure_link_id: testInfraLinkIds[1],
          }),

          priority: Priority.Draft,
          validity_start: startDate,
          validity_end: null,

          direction: InfrastructureNetworkDirectionEnum.Forward,
          scheduled_stop_point_id: getUuid(2),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E002,
          },
        },
        {
          // About to end in 10 days, no next
          ...buildStop({
            label: 'P0003',
            located_on_infrastructure_link_id: testInfraLinkIds[3],
          }),

          priority: Priority.Standard,
          validity_start: startDate,
          validity_end: today.plus({ days: 10 }),

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(3),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E003,
          },
        },
        {
          // About to end tomorrow, no next
          ...buildStop({
            label: 'P0004',
            located_on_infrastructure_link_id: testInfraLinkIds[4],
          }),

          priority: Priority.Standard,
          validity_start: startDate,
          validity_end: today.plus({ days: 1 }),

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(4),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E004,
          },
        },
        {
          // About to end today, no next
          ...buildStop({
            label: 'P0005',
            located_on_infrastructure_link_id: testInfraLinkIds[5],
          }),

          priority: Priority.Standard,
          validity_start: startDate,
          validity_end: today,

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(5),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E005,
          },
        },
        {
          // Standard base version for temp
          ...buildStop({
            label: 'P0006',
            located_on_infrastructure_link_id: testInfraLinkIds[6],
          }),

          priority: Priority.Standard,
          validity_start: startDate,

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(6),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E006,
          },
        },
        {
          // Temp about to end today, base version still valid
          ...buildStop({
            label: 'P0006',
            located_on_infrastructure_link_id: testInfraLinkIds[6],
          }),

          priority: Priority.Temporary,
          validity_start: startDate.plus({ days: 1 }),
          validity_end: today,

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(7),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E006,
          },
        },
        {
          // Temp about to end today, no base version
          ...buildStop({
            label: 'P0007',
            located_on_infrastructure_link_id: testInfraLinkIds[7],
          }),

          priority: Priority.Temporary,
          validity_start: startDate,
          validity_end: today,

          direction: InfrastructureNetworkDirectionEnum.Backward,
          scheduled_stop_point_id: getUuid(8),
          measured_location: {
            type: 'Point',
            coordinates: stopCoordinatesByLabel.E2E007,
          },
        },
      ];

      const stopPlaces: ReadonlyArray<StopAreaInput> = [
        {
          StopArea: {
            name: { lang: 'fin', value: 'X1234' },
            quays: extraPrioStops.map((stopPoint) => ({
              publicCode: stopPoint.label,
              privateCode: { value: stopPoint.label, type: 'HSL/TEST' },
              geometry: {
                coordinates: stopPoint.measured_location.coordinates.slice(
                  0,
                  2,
                ),
                type: StopRegistryGeoJsonType.Point,
              },
              keyValues: [
                { key: 'priority', values: [stopPoint.priority.toString()] },
                {
                  key: 'validityStart',
                  values: [stopPoint.validity_start?.toISODate() ?? null],
                },
                {
                  key: 'validityEnd',
                  values: [stopPoint.validity_end?.toISODate() ?? null],
                },
                {
                  key: 'imported-id',
                  values: [
                    `${stopPoint.label}-${stopPoint.validity_start}-${stopPoint.priority}`,
                  ],
                },
              ],
            })),
          },
          organisations: null,
        },
      ];

      insertToDbHelper({ stops: extraPrioStops });

      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces,
      });

      setupTestsAndNavigateToPage({});
    });

    it('should visualise priorities correctly', () => {
      // prettier-ignore
      const results: ReadonlyArray<
        readonly [string, string, string, Priority]
      > = [
        [getUuid(1), 'P0001', 'Prioriteetti: Perusversio', Priority.Standard],
        [getUuid(2), 'P0002', 'Prioriteetti: Luonnos', Priority.Draft],
        [getUuid(3), 'P0003', 'Voimassaolo loppuu 10 päivän kuluttua', Priority.Standard],
        [getUuid(4), 'P0004', 'Voimassaolo loppuu huomenna', Priority.Standard],
        [getUuid(5), 'P0005', 'Voimassaolo loppuu tänään', Priority.Standard],
        [getUuid(6), 'P0006', 'Prioriteetti: Perusversio', Priority.Standard],
        [getUuid(7), 'P0006', 'Prioriteetti: Väliaikainen', Priority.Temporary],
        [getUuid(8), 'P0007', 'Voimassaolo loppuu tänään', Priority.Temporary],
      ];

      const allPriorities: ReadonlyArray<Priority> = [
        Priority.Standard,
        Priority.Temporary,
        Priority.Draft,
      ];

      const prioritySets: ReadonlyArray<ReadonlyArray<Priority>> = [
        allPriorities,
        [Priority.Standard],
        [Priority.Temporary],
        [Priority.Draft],
      ];

      stopSearchBar.getExpandToggle().click();

      prioritySets.forEach((prioritySet) => {
        allPriorities.forEach((priority) => {
          stopSearchBar.priority.set(priority, prioritySet.includes(priority));
        });

        stopSearchBar.getSearchInput().clearAndType('P*{enter}');
        expectGraphQLCallToSucceed('@gqlSearchStops');

        results.forEach(
          ([scheduledStopPointId, label, priorityText, priority]) => {
            if (prioritySet.includes(priority)) {
              stopSearchResultsPage
                .getRowByScheduledStopPointId(scheduledStopPointId)
                .should('contain.text', label)
                .within(() =>
                  stopSearchResultsPage
                    .getRowPriority()
                    .should('have.attr', 'title', priorityText),
                );
            } else {
              stopSearchResultsPage
                .getRowByScheduledStopPointId(scheduledStopPointId)
                .should('not.exist');
            }
          },
        );
      });
    });
  });

  describe('By extended search filters', () => {
    type TestStops = InsertQuaysResult<
      keyof ReturnType<typeof generateTestData>
    >;
    let testStops: TestStops;

    function generateTestData(stopPlaceId: string) {
      generatedQuayIndex = 0;

      return {
        template: generateQuay(stopPlaceId),
        outOfUse: generateQuay(stopPlaceId, {
          keyValues: [
            { key: 'stopState', values: [StopPlaceState.OutOfOperation] },
          ],
        }),
        shelterPostUndefinedElectricity: generateQuay(stopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterPostTemplate] },
        }),
        shelterPostNoElectricity: generateQuay(stopPlaceId, {
          placeEquipments: {
            shelterEquipment: [
              {
                ...shelterPostTemplate,
                shelterElectricity: StopRegistryShelterElectricity.None,
              },
            ],
          },
        }),
        shelterPostLightElectricity: generateQuay(stopPlaceId, {
          placeEquipments: {
            shelterEquipment: [
              {
                ...shelterPostTemplate,
                shelterElectricity: StopRegistryShelterElectricity.Light,
              },
            ],
          },
        }),
        infoSpotA4: generateQuay(stopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
        }),
        infoSpotA5: generateQuay(stopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
        }),
        stopOwner: generateQuay(stopPlaceId, {
          keyValues: [{ key: 'stopOwner', values: ['hkl'] }],
        }),
      };
    }

    function generateInfoSpotsForTestData(
      generatedStops: TestStops,
    ): Array<StopRegistryInfoSpotInput> {
      return [
        {
          label: 'Sized A4',
          width: 210,
          height: 297,
          infoSpotLocations: [
            generatedStops.tagToNetexId.infoSpotA4,
            generatedStops.tagToShelters.infoSpotA4[0],
          ],
        },
        {
          label: 'Sized A5',
          width: 148,
          height: 210,
          infoSpotLocations: [
            generatedStops.tagToNetexId.infoSpotA5,
            generatedStops.tagToShelters.infoSpotA5[0],
          ],
        },
      ];
    }

    before(() => {
      cy.task('resetDbs');

      const privateCode = 'EF001';
      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces: [
          {
            StopArea: {
              name: {
                lang: 'fin',
                value: 'Haun lisäsuodattimet - testi pysäkki',
              },
              privateCode: { type: 'HSL/TEST', value: privateCode },
              transportMode: StopRegistryTransportModeType.Bus,
            },
            organisations: null,
          },
        ],
        stopPointsRequired: false,
      })
        .then((ids) => {
          const testDataInputs = generateTestData(
            ids.stopPlaceIdsByName[privateCode],
          );

          return cy.task('insertQuaysWithRealIds', { inputs: testDataInputs });
        })
        .then((insertResult) => {
          testStops = insertResult;
          return insertResult;
        })
        .then(generateInfoSpotsForTestData)
        .then((infoSpotData) => cy.task('insertInfoSpots', infoSpotData));

      insertedData = 'custom';
    });

    beforeEach(() => setupTestsAndNavigateToPage({ pageSize: 100 }));

    function shouldHaveResultWithout(
      ...unexpectedStops: ReadonlyArray<string | ReadonlyArray<string>>
    ) {
      const flattened = unexpectedStops.flat();
      const allStops = Object.values(testStops.tagToPublicCode);
      const expectedStops = without(allStops, ...flattened);

      stopSearchResultsPage
        .getResultCount()
        .should('contain.text', `${expectedStops.length} hakutulos`);
      expectedStops.forEach((stop) => {
        stopSearchResultsPage.getRowByLabel(stop).shouldBeVisible();
      });
      flattened.forEach((stop) => {
        stopSearchResultsPage.getRowByLabel(stop).should('not.exist');
      });
    }

    it('Should filter by transport mode', () => {
      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for non bus stops (0)
      stopSearchBar.transportationMode.toggle(
        StopRegistryTransportModeType.Bus,
      );
      stopSearchBar.transportationMode.isNotSelected(
        StopRegistryTransportModeType.Bus,
      );
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      stopSearchResultsPage.getResultCount().shouldHaveText('0 hakutulosta');

      // Search for bus stops
      stopSearchBar.transportationMode.toggle(
        StopRegistryTransportModeType.Bus,
      );
      stopSearchBar.transportationMode.isSelected(
        StopRegistryTransportModeType.Bus,
      );

      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      const testStopTotalCount = Object.values(testStops.inputs).length;
      stopSearchResultsPage
        .getResultCount()
        .should('contain.text', `${testStopTotalCount} hakutulos`);
    });

    it('Should filter by stop state', () => {
      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for out of use stops
      stopSearchBar.stopState.openDropdown();
      stopSearchBar.stopState.toggleOption(StopPlaceState.OutOfOperation);
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(testStops.tagToPublicCode.outOfUse);

      // Search for in use stops
      stopSearchBar.stopState.openDropdown();
      stopSearchBar.stopState.toggleOption(StopPlaceState.InOperation);
      stopSearchBar.stopState.toggleOption(StopPlaceState.OutOfOperation);
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(testStops.tagToPublicCode.outOfUse);
    });

    it('Should filter by shelter', () => {
      const stopWithPostShelter = [
        testStops.tagToPublicCode.shelterPostUndefinedElectricity,
        testStops.tagToPublicCode.shelterPostNoElectricity,
        testStops.tagToPublicCode.shelterPostLightElectricity,
      ];

      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with shelter post
      stopSearchBar.shelters.openDropdown();
      stopSearchBar.shelters.toggleOption(StopRegistryShelterType.Post);
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopWithPostShelter);

      // Search for stops without shelter
      stopSearchBar.shelters.openDropdown();
      stopSearchBar.shelters.toggleOption('Ei katosta');
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(
        stopWithPostShelter.concat(
          testStops.tagToPublicCode.infoSpotA4,
          testStops.tagToPublicCode.infoSpotA5,
        ),
      );
    });

    it('Should filter by electricity', () => {
      const stopsWithDefinedElectricityStatus = [
        testStops.tagToPublicCode.shelterPostNoElectricity,
        testStops.tagToPublicCode.shelterPostLightElectricity,
      ];

      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with shelter with defined electricity propert
      stopSearchBar.electricity.openDropdown();
      stopSearchBar.electricity.toggleOption(
        StopRegistryShelterElectricity.Light,
      );
      stopSearchBar.electricity.toggleOption(
        StopRegistryShelterElectricity.None,
      );
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopsWithDefinedElectricityStatus);

      // Search for stops with undefined electricity status
      stopSearchBar.electricity.openDropdown();
      stopSearchBar.electricity.toggleOption('Ei tiedossa');
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(stopsWithDefinedElectricityStatus);
    });

    it('Should filter by InfoSpots', () => {
      const stopsWithInfoSpots = [
        testStops.tagToPublicCode.infoSpotA4,
        testStops.tagToPublicCode.infoSpotA5,
      ];

      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with A4 or A5 sized InfoSpots
      stopSearchBar.infoSpots.openDropdown();
      stopSearchBar.infoSpots.toggleOption('A4');
      stopSearchBar.infoSpots.toggleOption('A5');
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopsWithInfoSpots);

      // Search for stops without InfoSpots
      stopSearchBar.infoSpots.openDropdown();
      stopSearchBar.infoSpots.toggleOption('Ei infopaikkaa');
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(stopsWithInfoSpots);
    });

    it('Should filter by stop owner', () => {
      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      stopSearchBar.stopOwner.openDropdown();
      stopSearchBar.stopOwner.toggleOption('hkl');
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(testStops.tagToPublicCode.stopOwner);
    });
  });

  describe('Show results on map', () => {
    type TestStops = InsertQuaysResult<
      keyof ReturnType<typeof generateTestData>
    >;
    let testStops: TestStops;

    function generateTestData(
      urbanShelterStopPlaceId: string,
      postShelterStopPlaceId: string,
    ) {
      generatedQuayIndex = 0;

      return {
        urban1: generateQuay(urbanShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
          geometry: offsetPoint(centroids.helsinki, 1),
        }),
        urban2: generateQuay(urbanShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
          geometry: offsetPoint(centroids.helsinki, 2),
        }),
        postEspoo: generateQuay(postShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterPostTemplate] },
          geometry: centroids.espoo,
        }),
        postHelsinki: generateQuay(postShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterPostTemplate] },
          geometry: centroids.helsinki,
        }),
        postKauniainen: generateQuay(postShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterPostTemplate] },
          geometry: centroids.kauniainen,
        }),
        postVantaa: generateQuay(postShelterStopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterPostTemplate] },
          geometry: centroids.vantaa,
        }),
      };
    }

    before(() => {
      cy.task('resetDbs');

      const urbanShelters = 'US001';
      const posts = 'PS002';
      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces: [
          {
            StopArea: {
              name: {
                lang: 'fin',
                value: 'Tulokset kartalla - tiukkaklusteri urbaanikatoksia',
              },
              privateCode: { type: 'HSL/TEST', value: urbanShelters },
              transportMode: StopRegistryTransportModeType.Bus,
            },
            organisations: null,
          },
          {
            StopArea: {
              name: {
                lang: 'fin',
                value: 'Tulokset kartalla - tolppia siellä täällä',
              },
              privateCode: { type: 'HSL/TEST', value: posts },
              transportMode: StopRegistryTransportModeType.Bus,
            },
            organisations: null,
          },
        ],
        stopPointsRequired: false,
      })
        .then((ids) => {
          const testDataInputs = generateTestData(
            ids.stopPlaceIdsByName[urbanShelters],
            ids.stopPlaceIdsByName[posts],
          );

          return cy.task('insertQuaysWithRealIds', { inputs: testDataInputs });
        })
        .then((insertResult) => {
          testStops = insertResult;
          return insertResult;
        });

      insertedData = 'custom';
    });

    function searchAndOpenPoleTypeResultsOnAMap(
      type: StopRegistryShelterType,
      assertResults: (expectedStops: ReadonlyArray<string>) => void,
      ...expectedStops: ReadonlyArray<string | ReadonlyArray<string>>
    ) {
      const flattenedResults = expectedStops.flat();

      stopSearchBar.getExpandToggle().click();
      stopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with the given shelter type
      stopSearchBar.shelters.openDropdown();
      stopSearchBar.shelters.toggleOption(type);
      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Assert results
      assertResults(flattenedResults);

      stopSearchResultsPage
        .getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled');
      stopSearchResultsPage.getShowOnMapButton().click();
      stopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      map.getLoader().shouldBeVisible();
      map.waitForLoadToComplete();

      flattenedResults.forEach((stop) => {
        map
          .getStopByStopLabelAndPriority(stop, Priority.Standard)
          .shouldBeVisible();
      });

      mapFooter
        .getStopResultsFooter()
        .shouldHaveText(`Hakutuloksia: ${flattenedResults.length}.`);
      mapPage.getCloseButton().click();

      // Assert we are back on the search page
      assertResults(flattenedResults);
    }

    it('Should show and zoom-in on a tightly packed result set', () => {
      setupTestsAndNavigateToPage({ pageSize: 100 });

      searchAndOpenPoleTypeResultsOnAMap(
        StopRegistryShelterType.Urban,
        shouldHaveResultOf,
        testStops.tagToPublicCode.urban1,
        testStops.tagToPublicCode.urban2,
      );
    });

    it('Should show and zoom-out to a sparsely distributed result set', () => {
      // Simulate situation with many results that don't fit on a single page.
      setupTestsAndNavigateToPage({ pageSize: 2 });

      searchAndOpenPoleTypeResultsOnAMap(
        StopRegistryShelterType.Post,
        // Only assert result count, as some stops are paged out.
        (results) => {
          stopSearchResultsPage
            .getResultCount()
            .should('contain.text', `${results.length} hakutulos`);
        },
        testStops.tagToPublicCode.postEspoo,
        testStops.tagToPublicCode.postHelsinki,
        testStops.tagToPublicCode.postKauniainen,
        testStops.tagToPublicCode.postVantaa,
      );
    });

    function stopShouldBeSelected() {
      stopSearchResultsPage
        .getSelectInput()
        .shouldBeVisible()
        .and('be.checked');
    }

    function stopShouldNotBeSelected() {
      stopSearchResultsPage
        .getSelectInput()
        .shouldBeVisible()
        .and('not.be.checked');
    }

    function selectUnselectedRow(label: string) {
      stopSearchResultsPage
        .getRowByLabel(label)
        .shouldBeVisible()
        .within(() =>
          stopSearchResultsPage
            .getSelectInput()
            .shouldBeVisible()
            .and('not.be.checked')
            .click()
            .and('be.checked'),
        );
    }

    function unselectedSelectedRow(label: string) {
      stopSearchResultsPage
        .getRowByLabel(label)
        .shouldBeVisible()
        .within(() =>
          stopSearchResultsPage
            .getSelectInput()
            .shouldBeVisible()
            .and('be.checked')
            .click()
            .and('not.be.checked'),
        );
    }

    function stopShouldBeOnMap(label: string) {
      map
        .getStopByStopLabelAndPriority(label, Priority.Standard)
        .shouldBeVisible();
    }

    function stopShouldNotBeOnMap(label: string) {
      map
        .getStopByStopLabelAndPriority(label, Priority.Standard)
        .should('not.exist');
    }

    it('Should show partial selection', () => {
      setupTestsAndNavigateToPage({ pageSize: 100 });

      const selectedStops = [
        testStops.tagToPublicCode.postEspoo,
        testStops.tagToPublicCode.postVantaa,
        testStops.tagToPublicCode.postHelsinki,
        testStops.tagToPublicCode.postKauniainen,
      ];
      const notSelectedStops = without(
        Object.values(testStops.tagToPublicCode),
        ...selectedStops,
      );

      // Find some stops
      stopSearchBar.getExpandToggle().click();
      stopSearchBar.shelters.openDropdown();
      stopSearchBar.shelters.toggleOption(StopRegistryShelterType.Urban);
      stopSearchBar.shelters.toggleOption(StopRegistryShelterType.Post);

      stopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // By default, all should be selected.
      stopSearchResultsPage
        .getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      stopSearchResultsPage
        .getResultRows()
        .each((row) => cy.wrap(row).within(stopShouldBeSelected));

      // Unselect all
      stopSearchResultsPage.getSelectAllButton().click().and('not.be.checked');

      stopSearchResultsPage
        .getResultRows()
        .each((row) => cy.wrap(row).within(stopShouldNotBeSelected));

      // Select the urban shelter results
      selectedStops.forEach(selectUnselectedRow);

      // Open the map
      stopSearchResultsPage
        .getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled');
      stopSearchResultsPage.getShowOnMapButton().click();
      stopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      map.getLoader().shouldBeVisible();
      map.waitForLoadToComplete();

      // Urban shelters should be visible and posts should not be shown.
      selectedStops.forEach(stopShouldBeOnMap);
      notSelectedStops.forEach(stopShouldNotBeOnMap);

      // Close the selection.
      mapFooter.getStopResultsFooterCloseButton().click();
      notSelectedStops.forEach(stopShouldBeOnMap);

      // Navigate back to search results.
      mapPage.getCloseButton().click();

      stopSearchResultsPage
        .getSelectAllButton()
        .shouldBeVisible()
        .and('not.be.checked');
      selectedStops
        .map(stopSearchResultsPage.getRowByLabel)
        .forEach((row) => row.within(stopShouldBeSelected));
      notSelectedStops
        .map(stopSearchResultsPage.getRowByLabel)
        .forEach((row) => row.within(stopShouldNotBeSelected));
    });

    it('Should handle partial selections of Stop Areas', () => {
      setupTestsAndNavigateToPage({});

      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      stopSearchBar.getSearchInput().clearAndType('*{enter}');

      // Select both Stop Areas
      stopGroupSelector.shouldHaveGroups(['PS002', 'US001']);
      stopGroupSelector.getGroupSelectors().contains('US001').click();

      // By default, all should be selected
      stopSearchResultsPage
        .getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      // Unselect one
      unselectedSelectedRow(testStops.tagToPublicCode.urban1);

      // And ALL should not be selected anymore
      stopSearchResultsPage
        .getSelectAllButton()
        .shouldBeVisible()
        .and('not.be.checked');

      // Unselect the group that contained the unselected stop
      stopGroupSelector.getGroupSelectors().contains('US001').click();
      // And ALL should be selected again.
      stopSearchResultsPage
        .getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      // Unselect one from the list.
      unselectedSelectedRow(testStops.tagToPublicCode.postHelsinki);
      // Add in back the unselected Area
      stopGroupSelector.getGroupSelectors().contains('US001').click();
      // And then they should not get auto selected as ALL has not been selected.
      stopSearchResultsPage
        .getRowByLabel(testStops.tagToPublicCode.urban1)
        .within(stopShouldNotBeSelected);
      stopSearchResultsPage
        .getRowByLabel(testStops.tagToPublicCode.urban2)
        .within(stopShouldNotBeSelected);

      stopSearchResultsPage
        .getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled')
        .click();
      stopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      map.getLoader().shouldBeVisible();
      map.waitForLoadToComplete();

      stopShouldBeOnMap(testStops.tagToPublicCode.postEspoo);
      stopShouldNotBeOnMap(testStops.tagToPublicCode.postHelsinki);
    });
  });

  describe('CSV reports', () => {
    type TestStops = InsertQuaysResult<
      keyof ReturnType<typeof generateTestData>
    >;

    function generateTestData(stopPlaceId: string) {
      generatedQuayIndex = 0;

      return {
        infoSpotA4: generateQuay(stopPlaceId, {
          placeEquipments: {
            shelterEquipment: [
              { shelterNumber: 1, shelterType: StopRegistryShelterType.Post },
              { shelterNumber: 2, shelterType: StopRegistryShelterType.Urban },
            ],
          },
        }),
        infoSpotA5: generateQuay(stopPlaceId, {
          placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
        }),
      };
    }

    function generateInfoSpotsForTestData(
      generatedStops: TestStops,
    ): Array<StopRegistryInfoSpotInput> {
      return [
        {
          label: 'Sized A4',
          width: 210,
          height: 297,
          poster: [
            { label: 'Tuote 1', height: 100, width: 100, lines: '' },
            { label: 'Tuote 2', height: 100, width: 100, lines: 'Lisätieto' },
          ],
          infoSpotLocations: [
            generatedStops.tagToNetexId.infoSpotA4,
            generatedStops.tagToShelters.infoSpotA4[1],
          ],
        },
        {
          label: 'Sized A5',
          width: 148,
          height: 210,
          poster: [{ label: 'Öökkönen', height: 88, width: 125 }],
          infoSpotLocations: [
            generatedStops.tagToNetexId.infoSpotA5,
            generatedStops.tagToShelters.infoSpotA5[0],
          ],
        },
      ];
    }

    function generateAndInsertInfoSpotExtraData() {
      const privateCode = 'EI001';
      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        stopPlaces: [
          {
            StopArea: {
              name: {
                lang: 'fin',
                value: 'Infopaikka raportti - testi pysäkki',
              },
              privateCode: { type: 'HSL/TEST', value: privateCode },
              transportMode: StopRegistryTransportModeType.Bus,
            },
            organisations: null,
          },
        ],
        stopPointsRequired: false,
      })
        .then((ids) => {
          const testDataInputs = generateTestData(
            ids.stopPlaceIdsByName[privateCode],
          );

          return cy.task('insertQuaysWithRealIds', {
            inputs: testDataInputs,
            // Ensure Public and Private Codes get assigned consistently,
            // as we are comparing the end result to hard coded data.
            generateIdsSequentially: true,
          });
        })
        .then(generateInfoSpotsForTestData)
        .then((infoSpotData) => cy.task('insertInfoSpots', infoSpotData));
    }

    before(initWithHardcodedData);
    before(generateAndInsertInfoSpotExtraData);

    beforeEach(() => setupTestsAndNavigateToPage({ pageSize: 100 }));

    it('Should generate and download Equipment Details CSV report', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('EquipmentReportTest.csv');
      });

      const observationDate = '2025-01-01';
      stopSearchBar.getObservationDateInput().clearAndType(observationDate);
      stopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      stopSearchResultsPage.getContainer().should('be.visible');
      stopSearchResultsPage.getResultRows().should('have.length', 9);

      stopSearchResultsPage.getResultsActionMenu().shouldBeVisible().click();
      stopSearchResultsPage
        .getDownloadEquipmentDetailsReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      stopSearchResultsPage
        .getDownloadedEquipmentDetailsCSVReport()
        .then((generatedData) => {
          cy.fixture<string>(
            'csvReports/equipmentDetailsHardCodedData.csv',
            'utf-8',
          ).then((referenceData) => {
            expect(generatedData).to.eql(referenceData);
          });
        });

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    });

    it('Should generate and download Info Spot Details CSV report', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('InfoSpotReportTest.csv');
      });

      const observationDate = '2025-01-01';
      stopSearchBar.getObservationDateInput().clearAndType(observationDate);
      stopSearchBar.getSearchInput().type(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      stopSearchResultsPage.getContainer().should('be.visible');
      stopSearchResultsPage.getResultCount().shouldHaveText('13 hakutulosta');

      stopSearchResultsPage.getResultsActionMenu().shouldBeVisible().click();
      stopSearchResultsPage
        .getDownloadInfoSpotDetailsReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      stopSearchResultsPage
        .getDownloadedInfoSpotDetailsCSVReport()
        .then((generatedData) => {
          cy.fixture<string>(
            'csvReports/InfoSpotDetailsHardCodedData.csv',
            'utf-8',
          ).then((referenceData) => {
            expect(generatedData).to.eql(referenceData);
          });
        });

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    });

    it.only('Should generate and download Equipment Details CSV report on Map', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('EquipmentReportMapTest.csv');
      });

      // Search for stops
      const observationDate = '2025-01-01';
      stopSearchBar.getObservationDateInput().clearAndType(observationDate);
      stopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      stopSearchResultsPage.getContainer().should('be.visible');
      stopSearchResultsPage.getResultRows().should('have.length', 9);

      // Open them on the Map
      stopSearchResultsPage.getShowOnMapButton().click();
      map.getLoader().shouldBeVisible();
      map.waitForLoadToComplete();

      // Check initial selection and remove E2E0001 from it
      mapStopSelection.getOpenButton().shouldBeVisible().click();
      mapStopSelection.getSelectedStops().should('have.length', 9);
      mapStopSelection.getSelectedStop('E2E001').within(() => {
        mapStopSelection.getRemoveSelectionButton().click();
      });
      mapStopSelection.getSelectedStops().should('have.length', 8);
      mapStopSelection.getSelectedStop('E2E001').should('not.exist');

      // Reselect E2E0001 From the map
      map.getStopByStopLabelAndPriority('E2E001', Priority.Standard).click();
      stopPopUp.getIsSelected().should('not.be.checked');
      stopPopUp.getIsSelected().click();
      stopPopUp.getIsSelected().should('be.checked');

      // Ensure it is also back in selection
      mapStopSelection.getOpenButton().shouldBeVisible().click();
      mapStopSelection.getSelectedStops().should('have.length', 9);
      mapStopSelection.getSelectedStop('E2E001');

      // Trigger generation
      mapStopSelection.getActionMenu().click();
      mapStopSelection.getEquipmentReportMenuItem().click();

      stopSearchResultsPage
        .getDownloadedEquipmentDetailsCSVReport()
        .then((generatedData) => {
          cy.fixture<string>(
            'csvReports/equipmentDetailsHardCodedData.csv',
            'utf-8',
          ).then((referenceData) => {
            expect(generatedData).to.eql(referenceData);
          });
        });
    });
  });
});
