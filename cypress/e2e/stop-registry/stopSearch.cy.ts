import {
  InfrastructureNetworkDirectionEnum,
  KnownValueKey,
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
import { InsertQuayInput, InsertQuaysResult } from '../../support/types';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();

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
    { key: KnownValueKey.StopState, values: [StopPlaceState.InOperation] },
    { key: KnownValueKey.Priority, values: ['10'] },
    { key: KnownValueKey.ValidityStart, values: ['2025-01-01'] },
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
const safeMultiInfoSpotTestStopLabel = 'E2E099';

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
  StopSearchResultsPage.getResultCount().should(
    'contain.text',
    `${flattened.length} hakutulos`,
  );
  flattened.forEach((stop) => {
    StopSearchResultsPage.getRowByLabel(stop).shouldBeVisible();
  });
}

describe('Stop search', { tags: [Tag.StopRegistry, Tag.Search] }, () => {
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

    StopSearchBar.getSearchInput().clear();
  }

  function initWithHardcodedData() {
    insertHardcodedTestData();
    setupTestsAndNavigateToPage({});
  }

  describe('by label', () => {
    beforeEach(initWithHardcodedData);

    it('should be able to search with an exact stop label', () => {
      StopSearchBar.searchCriteriaRadioButtons
        .getLabelRadioButton()
        .should('be.checked');
      StopSearchBar.getSearchInput().type(`E2E001{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E001');
    });

    it(
      'should be able to search with an asterisk',
      { tags: [Tag.StopRegistry, Tag.Smoke] },
      () => {
        StopSearchBar.getSearchInput().type(`E2E00*{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        StopSearchResultsPage.getContainer().should('be.visible');
        StopSearchResultsPage.getResultRows().should('have.length', 9);

        // Ordered by label.
        StopSearchResultsPage.getResultRows().eq(0).should('contain', 'E2E001');
        StopSearchResultsPage.getResultRows().eq(1).should('contain', 'E2E002');
        StopSearchResultsPage.getResultRows().eq(2).should('contain', 'E2E003');
        StopSearchResultsPage.getResultRows().eq(3).should('contain', 'E2E004');
        StopSearchResultsPage.getResultRows().eq(4).should('contain', 'E2E005');
        StopSearchResultsPage.getResultRows().eq(5).should('contain', 'E2E006');
        StopSearchResultsPage.getResultRows().eq(6).should('contain', 'E2E007');
        StopSearchResultsPage.getResultRows().eq(7).should('contain', 'E2E008');
        StopSearchResultsPage.getResultRows().eq(8).should('contain', 'E2E009');
      },
    );

    it('should show no results when search does not match any stops', () => {
      StopSearchBar.getSearchInput().type(`*404*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('not.exist');
    });
  });

  describe('by ELY number', () => {
    beforeEach(initWithHardcodedData);

    // not ok

    it('should be able to search with an exact ELY number', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getElyInput().type(`E2E001`);
      StopSearchBar.getSearchButton().click();

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E001');
    });

    it('should be able to search with an asterix', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getElyInput().type('E2E00*');
      StopSearchBar.getSearchButton().click();

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 9);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E001');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E002');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E003');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E005');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E006');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E007');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E008');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E009');
    });

    it('should show no results when search does not match any stops', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getElyInput().type(`not-an-ELY-number`);
      StopSearchBar.getSearchButton().click();

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('not.exist');
    });
  });

  describe('by address', () => {
    beforeEach(initWithHardcodedData);

    it('should be able to search with an exact address', () => {
      StopSearchBar.searchCriteriaRadioButtons.getAddressRadioButton().click();
      StopSearchBar.getSearchInput().type(`Annankatu 15{enter}`);

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 2);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E001');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E009');
    });

    it('should be able to search with an asterix', () => {
      StopSearchBar.searchCriteriaRadioButtons.getAddressRadioButton().click();
      StopSearchBar.getSearchInput().type(`Annankatu*{enter}`);

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 3);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E001');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E002');
      StopSearchResultsPage.getResultRows().should('contain', 'E2E009');
    });

    it('should show no results when search does not match any stops', () => {
      StopSearchBar.searchCriteriaRadioButtons.getAddressRadioButton().click();
      StopSearchBar.getSearchInput().type(`no address 22{enter}`);

      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('not.exist');
    });
  });

  describe('Search criteria', () => {
    beforeEach(initWithHardcodedData);

    it('Should trigger search when the search criteria is changed and the search input field contains text', () => {
      StopSearchBar.getSearchInput().type(`Albertinkatu 38`);
      StopSearchBar.searchCriteriaRadioButtons.getAddressRadioButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });

    it('Should not trigger a search when the search criteria is changed if the search input field is empty', () => {
      StopSearchBar.getSearchInput().type(`E2E004{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');
      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');

      StopSearchBar.getSearchInput().clear();
      StopSearchBar.searchCriteriaRadioButtons.getAddressRadioButton().click();

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });
  });

  describe('by municipality', () => {
    beforeEach(initWithHardcodedData);

    it('Should search by all municipalities by default', () => {
      StopSearchBar.getSearchInput().type(`*`);
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.municipality.openDropdown();
      StopSearchBar.municipality.isSelected('Kaikki');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 10);
    });

    it('should be able to search with one municipality', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.municipality.openDropdown();
      StopSearchBar.municipality.isSelected('Kaikki');
      StopSearchBar.municipality.toggleOption('Espoo');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E010');
    });
  });

  describe('by name variants', () => {
    beforeEach(initWithHardcodedData);

    it('should be able to search with an exact name', () => {
      StopSearchBar.searchCriteriaRadioButtons
        .getLabelRadioButton()
        .should('be.checked');
      StopSearchBar.getSearchInput().type(`Albertinkatu 38{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });

    it('should be able to search with an exact translation name', () => {
      StopSearchBar.searchCriteriaRadioButtons
        .getLabelRadioButton()
        .should('be.checked');
      StopSearchBar.getSearchInput().type(`Albertsgatan 38{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });

    it('should be able to search with an exact finnish name alias (long name)', () => {
      StopSearchBar.searchCriteriaRadioButtons
        .getLabelRadioButton()
        .should('be.checked');
      StopSearchBar.getSearchInput().type(`Albertinkatu 38 (pitkä){enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });

    it('should be able to search with an exact swedish name alias (long name)', () => {
      StopSearchBar.searchCriteriaRadioButtons
        .getLabelRadioButton()
        .should('be.checked');
      StopSearchBar.getSearchInput().type(`Albertsgatan 38 (lång){enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 1);
      StopSearchResultsPage.getResultRows().should('contain', 'E2E004');
    });
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
      StopSearchBar.getSearchInput().clearAndType(`LE*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindLinesByStopSearch');

      // Should contain and show all LE -lines
      StopGroupSelector.shouldHaveGroups(
        range(SHOW_ALL_BY_DEFAULT_MAX).map((i) => `LE${i}`),
      );
      StopGroupSelector.getShowAllGroupsButton().should('not.exist');
      StopGroupSelector.getShowLessGroupsButton().should('not.exist');
    }

    function assertShowAllAndShowLessWork(
      allExtraLines: ReadonlyArray<string>,
    ) {
      StopSearchBar.getSearchInput().clearAndType(`L*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindLinesByStopSearch');

      // Changes in CSS styles, viewport size, and the line labels can influence
      // the list of shown labels.
      cy.viewport(1000, 1080);
      // prettier-ignore
      StopGroupSelector
        .shouldHaveGroups(['L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29']);

      cy.viewport(500, 1080);
      // prettier-ignore
      const minimalResult = ['L20', 'L21', 'L22', 'L23', 'L24'];
      StopGroupSelector.shouldHaveGroups(minimalResult);

      StopGroupSelector.getShowLessGroupsButton().should('not.exist');
      StopGroupSelector.getShowAllGroupsButton()
        .should('contain', `Näytä kaikki (${SHOW_ALL_BY_DEFAULT_MAX * 2})`)
        .click();
      StopGroupSelector.getShowLessGroupsButton().shouldBeVisible();
      StopGroupSelector.getShowAllGroupsButton().should('not.exist');
      StopGroupSelector.shouldHaveGroups(allExtraLines);

      StopGroupSelector.getShowLessGroupsButton().click();

      StopGroupSelector.shouldHaveGroups(minimalResult);
      StopGroupSelector.getShowAllGroupsButton().shouldBeVisible();
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

      StopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();

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
      StopSearchByLine.getRouteInfoContainer(id).within(() => {
        StopSearchByLine.getRouteLabel().shouldHaveText(info.label);

        StopSearchByLine.getRouteDirection()
          .shouldHaveText(info.directionSymbol)
          .and('have.attr', 'title', info.directionTitle);

        StopSearchByLine.getRouteName().shouldHaveText(info.name);

        StopSearchByLine.getRouteValidity().shouldHaveText(info.validity);

        StopSearchByLine.getRouteLocatorButton().shouldBeVisible();
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

      StopSearchResultsPage.getRowByLabel('E2E001')
        .shouldBeVisible()
        .and('contain', 'E2E001')
        .and('contain', '1AACKT')
        .and('contain', 'Annankatu 15')
        .and('contain', '20.3.2020-');

      StopSearchResultsPage.getRowByLabel('E2E002').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E003').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E004').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E005').shouldBeVisible();
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

      StopSearchResultsPage.getRowByLabel('E2E005')
        .shouldBeVisible()
        .and('contain', 'E2E005')
        .and('contain', '1EIRA')
        .and('contain', 'Lönnrotinkatu 32')
        .and('contain', '20.3.2020-');

      StopSearchResultsPage.getRowByLabel('E2E006').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E007').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E008').shouldBeVisible();
      StopSearchResultsPage.getRowByLabel('E2E009').shouldBeVisible();
    }

    it('should find and display line 901 routes', () => {
      StopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      StopSearchBar.getSearchInput().clearAndType(`901{enter}`);

      StopSearchByLine.getActiveLineName().shouldHaveText('901 line 901');
      StopSearchByLine.getActiveLineValidity().should(
        'contain',
        'Voimassa 1.1.2022 -',
      );

      StopSearchByLine.getActiveLineAllStopsCount().shouldHaveText(
        '9 pysäkkiä',
      );
      StopSearchByLine.getActiveLineInboundStopsCount().shouldHaveText(
        '5 pys.',
      );
      StopSearchByLine.getActiveLineOutboundStopsCount().shouldHaveText(
        '5 pys.',
      );

      assertOutboundRouteIsValid();
      assertInboundRouteIsValid();
    });

    it('should be able to select multiple lines', () => {
      StopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      StopSearchBar.getSearchInput().clearAndType(`9*{enter}`);

      StopGroupSelector.getGroupSelectors().contains('901').click();
      StopGroupSelector.getGroupSelectors().contains('9999').click();

      StopGroupSelector.getGroupSelectors().should('have.length', 3);
      StopGroupSelector.getGroupSelectors().eq(0).should('contain', '901');
      StopGroupSelector.getGroupSelectors().eq(2).should('contain', '9999');

      // Assert that both lines are shown
      StopSearchByLine.getActiveLineName().should('have.length', 2);
      StopSearchByLine.getActiveLineName().eq(0).should('contain', '901');
      StopSearchByLine.getActiveLineName().eq(1).should('contain', '9999');
    });

    it('should be able to select and deselect stops on line', () => {
      StopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      StopSearchBar.getSearchInput().clearAndType(`901{enter}`);

      StopSearchByLine.getActiveLineName().shouldHaveText('901 line 901');
      StopSearchByLine.getActiveLineValidity().should(
        'contain',
        'Voimassa 1.1.2022 -',
      );

      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');
      StopSearchResultsPage.getSelectAllStopsOfLineButton(
        '08d1fa6b-440c-421e-ad4d-0778d65afe60',
      )
        .shouldBeVisible()
        .and('be.checked');
      StopSearchResultsPage.getSelectAllStopsOfRouteButton(
        '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
      )
        .shouldBeVisible()
        .and('be.checked');
      StopSearchResultsPage.getSelectAllStopsOfRouteButton(
        '5f1fff1a-2449-4a8f-8107-15edc6f46fce',
      )
        .shouldBeVisible()
        .and('be.checked');

      StopSearchResultsPage.getRowByLabel('E2E004')
        .shouldBeVisible()
        .within(() =>
          StopSearchResultsPage.getSelectInput()
            .shouldBeVisible()
            .and('be.checked')
            .click()
            .and('not.be.checked'),
        );

      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('not.be.checked');
      StopSearchResultsPage.getSelectAllStopsOfLineButton(
        '08d1fa6b-440c-421e-ad4d-0778d65afe60',
      )
        .shouldBeVisible()
        .and('not.be.checked');
      StopSearchResultsPage.getSelectAllStopsOfRouteButton(
        '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
      )
        .shouldBeVisible()
        .and('not.be.checked');
      StopSearchResultsPage.getSelectAllStopsOfRouteButton(
        '5f1fff1a-2449-4a8f-8107-15edc6f46fce',
      )
        .shouldBeVisible()
        .and('be.checked');
    });
  });

  describe('for stop areas', () => {
    beforeEach(initWithHardcodedData);

    it('should find all by *', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      StopSearchBar.getSearchInput().clearAndType(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      StopGroupSelector.shouldHaveGroups([
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
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      StopSearchBar.getSearchInput().clearAndType(`X0004{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      StopGroupSelector.shouldHaveGroups(['X0004']);

      SearchForStopAreas.getStopAreaLabel().shouldHaveText(
        'Pysäkkialue X0004 | Kalevankatu 32',
      );

      SearchForStopAreas.getLocatorButton().shouldBeVisible();

      StopSearchResultsPage.getRowByLabel('E2E003')
        .shouldBeVisible()
        .and('contain', 'E2E003')
        .and('contain', '1AURLA')
        .and('contain', 'Kalevankatu 32')
        .and('contain', '20.3.2020-');

      StopSearchResultsPage.getRowByLabel('E2E006')
        .shouldBeVisible()
        .and('contain', 'E2E006')
        .and('contain', '1AURLA')
        .and('contain', 'Kalevankatu 32')
        .and('contain', '20.3.2020-');

      SearchForStopAreas.getStopAreaLink().click();

      // TODO: Refactor to check privateCode after area details tests are ready
      StopAreaDetailsPage.details.getName().should('contain', 'Kalevankatu 32');

      cy.go('back');

      SearchForStopAreas.getActionMenu().click();

      SearchForStopAreas.getActionMenuShowOnMap().shouldBeVisible();

      SearchForStopAreas.getActionMenuShowDetails().click();

      StopAreaDetailsPage.details.getName().should('contain', 'Kalevankatu 32');
    });

    it('should find E2ENQ and display no stops', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      StopSearchBar.getSearchInput().clearAndType(`E2ENQ{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      StopGroupSelector.shouldHaveGroups(['E2ENQ']);

      SearchForStopAreas.getStopAreaLabel().shouldHaveText(
        'Pysäkkialue E2ENQ | No quays',
      );

      SearchForStopAreas.getNoStopsInStopAreaText().shouldHaveText(
        'Ei pysäkkejä.Siirry pysäkkialueen tietoihin.',
      );
      SearchForStopAreas.getNoStopsInStopAreaLink().click();
      StopAreaDetailsPage.details.getName().should('contain', 'No quays');
    });
  });

  describe('for terminals', () => {
    beforeEach(initWithHardcodedData);

    it('should find all by *', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');

      StopSearchBar.getSearchInput().clearAndType(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      StopGroupSelector.shouldHaveGroups(['T2']);
    });

    it('should find and navigate to T2', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');

      StopSearchBar.getSearchInput().clearAndType(`T2{enter}`);
      expectGraphQLCallToSucceed('@gqlFindStopPlaces');

      StopGroupSelector.shouldHaveGroups(['T2']);

      SearchForTerminals.getTerminalLabel().shouldHaveText(
        'Terminaali T2 | E2ET001',
      );

      SearchForTerminals.getLocatorButton().shouldBeVisible();

      StopSearchResultsPage.getRowByLabel('E2E008')
        .shouldBeVisible()
        .and('contain', 'E2E008')
        .and('contain', 'Kuttulammentie')
        .and('contain', '20.3.2020-');

      StopSearchResultsPage.getRowByLabel('E2E010')
        .shouldBeVisible()
        .and('contain', 'E2E010')
        .and('contain', '1AACKT')
        .and('contain', 'Finnoonkartano')
        .and('contain', '20.3.2020-');

      SearchForTerminals.getTerminalLink().click();

      TerminalDetailsPage.titleRow.getPrivateCode().should('contain', 'T2');

      cy.go('back');

      SearchForTerminals.getActionMenu().click();

      SearchForTerminals.getActionMenuShowOnMap().shouldBeVisible();

      SearchForTerminals.getActionMenuShowDetails().click();

      TerminalDetailsPage.titleRow.getPrivateCode().should('contain', 'T2');
    });
  });

  describe('Sorting & paging', () => {
    beforeEach(() => {
      insertHardcodedTestData();
      setupTestsAndNavigateToPage({ pageSize: 5 });
    });

    function assertResultOrder(expectedOrder: ReadonlyArray<string>) {
      expectedOrder.forEach((label, index) => {
        StopSearchResultsPage.getResultRows()
          .eq(index)
          .should('contain', label);
      });
    }

    it('should sort on basic stop search', () => {
      StopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Label ascending
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      // Label descending
      SortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E008', 'E2E007', 'E2E006', 'E2E005']);

      // Name descending
      SortByButton.getButton('name').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('name', 'desc');
      assertResultOrder(['E2E005', 'E2E008', 'E2E006', 'E2E003', 'E2E007']);

      // Name ascending
      SortByButton.getButton('name').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('name', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E007']);

      // Address ascending
      SortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('address', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E007']);

      // Address descending
      SortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('address', 'desc');
      assertResultOrder(['E2E005', 'E2E008', 'E2E006', 'E2E003', 'E2E007']);
    });

    it('should page on basic stop search', () => {
      StopSearchBar.getSearchInput().type(`E2E00*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Label ascending
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      Pagination.getNextPageButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E006', 'E2E007', 'E2E008', 'E2E009']);
    });

    it('should sort on stop search by line', () => {
      StopSearchBar.searchCriteriaRadioButtons.getLineRadioButton().click();
      StopSearchBar.getSearchInput().type(`*{enter}`);

      SortByButton.assertSorting('sequenceNumber', 'groupOnly');
      StopSearchByLine.getRouteContainer(
        '994a7d79-4991-423b-9c1a-0ca621a6d9ed',
      ).within(() => {
        assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);
      });

      // Label ascending
      SortByButton.getButton('label').click();
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E002', 'E2E003', 'E2E004', 'E2E005']);

      // Label descending
      SortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E008', 'E2E007', 'E2E006', 'E2E005']);
    });

    it('should sort on search for stop areas', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      StopSearchBar.getSearchInput().type(`X*{enter}`);
      StopGroupSelector.getGroupSelectors().contains('X0003').click();
      SearchForStopAreas.getStopAreaLabel();

      SortByButton.assertSorting('byStopArea', 'groupOnly');
      assertResultOrder(['E2E001', 'E2E009']);

      // Label ascending
      SortByButton.getButton('label').click();
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E001', 'E2E003', 'E2E006', 'E2E009']);

      // Label descending
      SortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('label', 'desc');
      assertResultOrder(['E2E009', 'E2E006', 'E2E003', 'E2E001']);
    });

    it('should be able to select multiple stop areas', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      StopSearchBar.getSearchInput().clearAndType(`X*{enter}`);
      StopGroupSelector.getGroupSelectors().contains('X0003').click();

      SearchForStopAreas.getStopAreaLabel().should('contain', 'X0003');

      StopGroupSelector.getGroupSelectors().contains('X0004').click();
      SearchForStopAreas.getStopAreaLabel().should('have.length', 2);
      SearchForStopAreas.getStopAreaLabel().eq(0).should('contain', 'X0003');
      SearchForStopAreas.getStopAreaLabel().eq(1).should('contain', 'X0004');

      StopGroupSelector.getGroupSelectors().contains('X0003').click();
      SearchForStopAreas.getStopAreaLabel().should('have.length', 1);
      SearchForStopAreas.getStopAreaLabel().should('contain', 'X0004');
    });

    it('should sort on search for terminals', () => {
      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Terminaalit');
      StopSearchBar.getSearchInput().type(`T*{enter}`);
      StopGroupSelector.getGroupSelectors().contains('T2').click();
      SearchForTerminals.getTerminalLabel();

      SortByButton.assertSorting('byTerminal', 'groupOnly');
      assertResultOrder(['E2E008', 'E2E010']);

      // Label ascending
      SortByButton.getButton('label').click();
      SortByButton.assertSorting('label', 'asc');
      assertResultOrder(['E2E008', 'E2E010']);

      // Label descending
      SortByButton.getButton('label').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      SortByButton.assertSorting('label', 'desc');
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
                {
                  key: KnownValueKey.Priority,
                  values: [stopPoint.priority.toString()],
                },
                {
                  key: KnownValueKey.ValidityStart,
                  values: [stopPoint.validity_start?.toISODate() ?? null],
                },
                {
                  key: KnownValueKey.ValidityEnd,
                  values: [stopPoint.validity_end?.toISODate() ?? null],
                },
                {
                  key: KnownValueKey.ImportedId,
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

      StopSearchBar.getExpandToggle().click();

      prioritySets.forEach((prioritySet) => {
        allPriorities.forEach((priority) => {
          StopSearchBar.priority.set(priority, prioritySet.includes(priority));
        });

        StopSearchBar.getSearchInput().clearAndType('P*{enter}');
        expectGraphQLCallToSucceed('@gqlSearchStops');

        results.forEach(
          ([scheduledStopPointId, label, priorityText, priority]) => {
            if (prioritySet.includes(priority)) {
              StopSearchResultsPage.getRowByScheduledStopPointId(
                scheduledStopPointId,
              )
                .should('contain.text', label)
                .within(() =>
                  StopSearchResultsPage.getRowPriority().should(
                    'have.attr',
                    'title',
                    priorityText,
                  ),
                );
            } else {
              StopSearchResultsPage.getRowByScheduledStopPointId(
                scheduledStopPointId,
              ).should('not.exist');
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
            {
              key: KnownValueKey.StopState,
              values: [StopPlaceState.OutOfOperation],
            },
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
          keyValues: [{ key: KnownValueKey.StopOwner, values: ['hkl'] }],
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

      StopSearchResultsPage.getResultCount().should(
        'contain.text',
        `${expectedStops.length} hakutulos`,
      );
      expectedStops.forEach((stop) => {
        StopSearchResultsPage.getRowByLabel(stop).shouldBeVisible();
      });
      flattened.forEach((stop) => {
        StopSearchResultsPage.getRowByLabel(stop).should('not.exist');
      });
    }

    it('Should filter by transport mode', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for non bus stops (0)
      StopSearchBar.transportationMode.toggle(
        StopRegistryTransportModeType.Bus,
      );
      StopSearchBar.transportationMode.isNotSelected(
        StopRegistryTransportModeType.Bus,
      );
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getResultCount().shouldHaveText('0 hakutulosta');

      // Search for bus stops
      StopSearchBar.transportationMode.toggle(
        StopRegistryTransportModeType.Bus,
      );
      StopSearchBar.transportationMode.isSelected(
        StopRegistryTransportModeType.Bus,
      );

      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      const testStopTotalCount = Object.values(testStops.inputs).length;
      StopSearchResultsPage.getResultCount().should(
        'contain.text',
        `${testStopTotalCount} hakutulos`,
      );
    });

    it('Should filter by stop state', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for out of use stops
      StopSearchBar.stopState.openDropdown();
      StopSearchBar.stopState.toggleOption(StopPlaceState.OutOfOperation);
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(testStops.tagToPublicCode.outOfUse);

      // Search for in use stops
      StopSearchBar.stopState.openDropdown();
      StopSearchBar.stopState.toggleOption(StopPlaceState.InOperation);
      StopSearchBar.stopState.toggleOption(StopPlaceState.OutOfOperation);
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(testStops.tagToPublicCode.outOfUse);
    });

    it('Should filter by shelter', () => {
      const stopWithPostShelter = [
        testStops.tagToPublicCode.shelterPostUndefinedElectricity,
        testStops.tagToPublicCode.shelterPostNoElectricity,
        testStops.tagToPublicCode.shelterPostLightElectricity,
      ];

      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with shelter post
      StopSearchBar.shelters.openDropdown();
      StopSearchBar.shelters.toggleOption(StopRegistryShelterType.Post);
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopWithPostShelter);

      // Search for stops without shelter
      StopSearchBar.shelters.openDropdown();
      StopSearchBar.shelters.toggleOption('Ei katosta');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
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

      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with shelter with defined electricity propert
      StopSearchBar.electricity.openDropdown();
      StopSearchBar.electricity.toggleOption(
        StopRegistryShelterElectricity.Light,
      );
      StopSearchBar.electricity.toggleOption(
        StopRegistryShelterElectricity.None,
      );
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopsWithDefinedElectricityStatus);

      // Search for stops with undefined electricity status
      StopSearchBar.electricity.openDropdown();
      StopSearchBar.electricity.toggleOption('Ei tiedossa');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(stopsWithDefinedElectricityStatus);
    });

    it('Should filter by InfoSpots', () => {
      const stopsWithInfoSpots = [
        testStops.tagToPublicCode.infoSpotA4,
        testStops.tagToPublicCode.infoSpotA5,
      ];

      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with A4 or A5 sized InfoSpots
      StopSearchBar.infoSpots.openDropdown();
      StopSearchBar.infoSpots.toggleOption('A4');
      StopSearchBar.infoSpots.toggleOption('A5');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(stopsWithInfoSpots);

      // Search for stops without InfoSpots
      StopSearchBar.infoSpots.openDropdown();
      StopSearchBar.infoSpots.toggleOption('Ei infopaikkaa');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultWithout(stopsWithInfoSpots);
    });

    it('Should filter by stop owner', () => {
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      StopSearchBar.stopOwner.openDropdown();
      StopSearchBar.stopOwner.toggleOption('hkl');
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      shouldHaveResultOf(testStops.tagToPublicCode.stopOwner);
    });
  });

  describe('Show results on map', { tags: [Tag.Map] }, () => {
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

      StopSearchBar.getExpandToggle().click();
      StopSearchBar.getSearchInput().clearAndType('*');

      // Search for stops with the given shelter type
      StopSearchBar.shelters.openDropdown();
      StopSearchBar.shelters.toggleOption(type);
      cy.closeDropdown();
      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // Assert results
      assertResults(flattenedResults);

      StopSearchResultsPage.getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled');
      StopSearchResultsPage.getShowOnMapButton().click();
      StopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      Map.getLoader().shouldBeVisible();
      Map.waitForLoadToComplete();

      flattenedResults.forEach((stop) => {
        Map.getStopByStopLabelAndPriority(
          stop,
          Priority.Standard,
        ).shouldBeVisible();
      });

      MapFooter.getStopResultsFooter().shouldHaveText(
        `Hakutuloksia: ${flattenedResults.length}.`,
      );
      MapPage.getCloseButton().click();

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
          StopSearchResultsPage.getResultCount().should(
            'contain.text',
            `${results.length} hakutulos`,
          );
        },
        testStops.tagToPublicCode.postEspoo,
        testStops.tagToPublicCode.postHelsinki,
        testStops.tagToPublicCode.postKauniainen,
        testStops.tagToPublicCode.postVantaa,
      );
    });

    function stopShouldBeSelected() {
      StopSearchResultsPage.getSelectInput()
        .shouldBeVisible()
        .and('be.checked');
    }

    function stopShouldNotBeSelected() {
      StopSearchResultsPage.getSelectInput()
        .shouldBeVisible()
        .and('not.be.checked');
    }

    function selectUnselectedRow(label: string) {
      StopSearchResultsPage.getRowByLabel(label)
        .shouldBeVisible()
        .within(() =>
          StopSearchResultsPage.getSelectInput()
            .shouldBeVisible()
            .and('not.be.checked')
            .click()
            .and('be.checked'),
        );
    }

    function unselectedSelectedRow(label: string) {
      StopSearchResultsPage.getRowByLabel(label)
        .shouldBeVisible()
        .within(() =>
          StopSearchResultsPage.getSelectInput()
            .shouldBeVisible()
            .and('be.checked')
            .click()
            .and('not.be.checked'),
        );
    }

    function stopShouldBeOnMap(label: string) {
      Map.getStopByStopLabelAndPriority(
        label,
        Priority.Standard,
      ).shouldBeVisible();
    }

    function stopShouldNotBeOnMap(label: string) {
      Map.getStopByStopLabelAndPriority(label, Priority.Standard).should(
        'not.exist',
      );
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
      StopSearchBar.getExpandToggle().click();
      StopSearchBar.shelters.openDropdown();
      StopSearchBar.shelters.toggleOption(StopRegistryShelterType.Urban);
      StopSearchBar.shelters.toggleOption(StopRegistryShelterType.Post);
      cy.closeDropdown();

      StopSearchBar.getSearchButton().click();
      expectGraphQLCallToSucceed('@gqlSearchStops');

      // By default, all should be selected.
      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      StopSearchResultsPage.getResultRows().each((row) =>
        cy.wrap(row).within(stopShouldBeSelected),
      );

      // Unselect all
      StopSearchResultsPage.getSelectAllButton().click().and('not.be.checked');

      StopSearchResultsPage.getResultRows().each((row) =>
        cy.wrap(row).within(stopShouldNotBeSelected),
      );

      // Select the urban shelter results
      selectedStops.forEach(selectUnselectedRow);

      // Open the map
      StopSearchResultsPage.getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled');
      StopSearchResultsPage.getShowOnMapButton().click();
      StopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      Map.getLoader().shouldBeVisible();
      Map.waitForLoadToComplete();

      // Urban shelters should be visible and posts should not be shown.
      selectedStops.forEach(stopShouldBeOnMap);
      notSelectedStops.forEach(stopShouldNotBeOnMap);

      // Close the selection.
      MapFooter.getStopResultsFooterCloseButton().click();
      notSelectedStops.forEach(stopShouldBeOnMap);

      // Navigate back to search results.
      MapPage.getCloseButton().click();

      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('not.be.checked');
      selectedStops
        .map(StopSearchResultsPage.getRowByLabel)
        .forEach((row) => row.within(stopShouldBeSelected));
      notSelectedStops
        .map(StopSearchResultsPage.getRowByLabel)
        .forEach((row) => row.within(stopShouldNotBeSelected));
    });

    it('Should handle partial selections of Stop Areas', () => {
      setupTestsAndNavigateToPage({});

      StopSearchBar.searchForDropdown.openSearchForDropdown();
      StopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');
      StopSearchBar.getSearchInput().clearAndType('*{enter}');

      // Select both Stop Areas
      StopGroupSelector.shouldHaveGroups(['PS002', 'US001']);
      StopGroupSelector.getGroupSelectors().contains('US001').click();

      // By default, all should be selected
      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      // Unselect one
      unselectedSelectedRow(testStops.tagToPublicCode.urban1);

      // And ALL should not be selected anymore
      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('not.be.checked');

      // Unselect the group that contained the unselected stop
      StopGroupSelector.getGroupSelectors().contains('US001').click();
      // And ALL should be selected again.
      StopSearchResultsPage.getSelectAllButton()
        .shouldBeVisible()
        .and('be.checked');

      // Unselect one from the list.
      unselectedSelectedRow(testStops.tagToPublicCode.postHelsinki);
      // Add in back the unselected Area
      StopGroupSelector.getGroupSelectors().contains('US001').click();
      // And then they should not get auto selected as ALL has not been selected.
      StopSearchResultsPage.getRowByLabel(
        testStops.tagToPublicCode.urban1,
      ).within(stopShouldNotBeSelected);
      StopSearchResultsPage.getRowByLabel(
        testStops.tagToPublicCode.urban2,
      ).within(stopShouldNotBeSelected);

      StopSearchResultsPage.getShowOnMapButton()
        .shouldBeVisible()
        .and('be.enabled')
        .click();
      StopSearchResultsPage.getShowOnMapButtonLoading().should('not.exist');

      Map.getLoader().shouldBeVisible();
      Map.waitForLoadToComplete();

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

    const generateMultiInfoSpotSameShelterData = (stopPlaceId: string) => ({
      multiInfoSpotSameShelter: generateQuay(stopPlaceId, {
        publicCode: safeMultiInfoSpotTestStopLabel,
        placeEquipments: { shelterEquipment: [shelterUrbanTemplate] },
      }),
    });

    function generateInfoSpotsForSameShelterTestData(
      generatedStops: InsertQuaysResult<
        keyof ReturnType<typeof generateMultiInfoSpotSameShelterData>
      >,
    ): Array<StopRegistryInfoSpotInput> {
      const {
        tagToShelters: {
          multiInfoSpotSameShelter: [shelterId],
        },
        tagToNetexId: { multiInfoSpotSameShelter: quayId },
      } = generatedStops;

      return [
        {
          label: 'InfoSpot 1',
          width: 100,
          height: 200,
          poster: [{ label: 'Poster 1', height: 50, width: 50, lines: 'Line' }],
          infoSpotLocations: [quayId, shelterId],
        },
        {
          label: 'InfoSpot 2',
          width: 120,
          height: 220,
          poster: [
            { label: 'Poster 2', height: 70, width: 70, lines: 'Notes' },
            { label: 'Poster 3', height: 60, width: 60, lines: '' },
          ],
          infoSpotLocations: [quayId, shelterId],
        },
      ];
    }

    function generateAndInsertMultiInfoSpotSameShelterData() {
      const privateCode = 'EI002';
      generatedQuayIndex = 0;

      return cy
        .task<InsertedStopRegistryIds>('insertStopRegistryData', {
          stopPlaces: [
            {
              StopArea: {
                name: {
                  lang: 'fin',
                  value: 'Infopaikka raportti - monen infopaikan testi',
                },
                privateCode: { type: 'HSL/TEST', value: privateCode },
                transportMode: StopRegistryTransportModeType.Bus,
              },
              organisations: null,
            },
          ],
          stopPointsRequired: false,
        })
        .then(({ stopPlaceIdsByName }) =>
          cy.task('insertQuaysWithRealIds', {
            inputs: generateMultiInfoSpotSameShelterData(
              stopPlaceIdsByName[privateCode],
            ),
            generateIdsSequentially: true,
          }),
        )
        .then((generatedStops) =>
          cy
            .task(
              'insertInfoSpots',
              generateInfoSpotsForSameShelterTestData(generatedStops),
            )
            .then(() => generatedStops),
        );
    }

    before(initWithHardcodedData);
    before(generateAndInsertInfoSpotExtraData);
    before(generateAndInsertMultiInfoSpotSameShelterData);

    beforeEach(() => setupTestsAndNavigateToPage({ pageSize: 100 }));

    it('Should generate and download Equipment Details CSV report', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('EquipmentReportMultiInfoSpot.csv');
      });

      const observationDate = '2025-01-01';
      StopSearchBar.getObservationDateInput().clearAndType(observationDate);
      StopSearchBar.getSearchInput().type(`E2E0*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultRows().should('have.length', 12);

      StopSearchResultsPage.getResultsActionMenu().shouldBeVisible().click();
      StopSearchResultsPage.getDownloadEquipmentDetailsReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      StopSearchResultsPage.getDownloadedEquipmentDetailsCSVReport().then(
        (generatedData) => {
          cy.fixture<string>(
            'csvReports/equipmentDetailsHardCodedData.csv',
            'utf-8',
          ).then((referenceData) => {
            expect(generatedData).to.eql(referenceData);
          });
        },
      );

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    });

    it('Should generate and download Info Spot Details CSV report', () => {
      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('InfoSpotReportTest.csv');
      });

      const observationDate = '2025-01-01';
      StopSearchBar.getObservationDateInput().clearAndType(observationDate);
      StopSearchBar.getSearchInput().type(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlSearchStops');

      StopSearchResultsPage.getContainer().should('be.visible');
      StopSearchResultsPage.getResultCount().shouldHaveText('13 hakutulosta');
      StopSearchResultsPage.getResultsActionMenu().shouldBeVisible().click();
      StopSearchResultsPage.getDownloadInfoSpotDetailsReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      StopSearchResultsPage.getDownloadedInfoSpotDetailsCSVReport().then(
        (generatedData) => {
          cy.fixture<string>(
            'csvReports/InfoSpotDetailsHardCodedData.csv',
            'utf-8',
          ).then((referenceData) => {
            expect(generatedData).to.eql(referenceData);
          });
        },
      );

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    });

    it(
      'Should generate and download Equipment Details CSV report on Map',
      { tags: [Tag.Map] },
      () => {
        cy.window().then((win) => {
          cy.stub(win, 'prompt').returns('EquipmentReportMapTest.csv');
        });

        // Search for stops
        const observationDate = '2025-01-01';
        StopSearchBar.getObservationDateInput().clearAndType(observationDate);
        StopSearchBar.getSearchInput().type(`E2E0*{enter}`);
        expectGraphQLCallToSucceed('@gqlSearchStops');

        StopSearchResultsPage.getContainer().should('be.visible');
        StopSearchResultsPage.getResultRows().should('have.length', 12);

        // Open them on the Map
        StopSearchResultsPage.getShowOnMapButton().click();
        Map.getLoader().shouldBeVisible();
        Map.waitForLoadToComplete();

        // Ensure E2E001 is selected
        MapStopSelection.getOpenButton().shouldBeVisible().click();
        MapStopSelection.getSelectedStops().should('have.length', 12);
        MapStopSelection.getSelectedStop('E2E001');

        // Trigger generation
        MapStopSelection.getActionMenu().click();
        MapStopSelection.getEquipmentReportMenuItem().click();

        StopSearchResultsPage.getDownloadedEquipmentDetailsCSVReport().then(
          (generatedData) => {
            cy.fixture<string>(
              'csvReports/equipmentDetailsHardCodedData.csv',
              'utf-8',
            ).then((referenceData) => {
              expect(generatedData).to.eql(referenceData);
            });
          },
        );
      },
    );
  });
});
