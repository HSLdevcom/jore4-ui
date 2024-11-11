/* eslint-disable jest/valid-expect */
import { RouteTypeOfLineEnum, buildLine } from '@hsl/jore4-test-db-manager';
import range from 'lodash/range';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  Pagination,
  SearchForStopAreas,
  SortByButton,
  StopGroupSelector,
  StopSearchBar,
  StopSearchByLine,
  StopSearchResultsPage,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();

describe('Stop search', () => {
  const stopSearchBar = new StopSearchBar();
  const stopSearchResultsPage = new StopSearchResultsPage();
  const stopSearchByLine = new StopSearchByLine();
  const stopGroupSelector = new StopGroupSelector();
  const searchForStopAreas = new SearchForStopAreas();
  const sortByButton = new SortByButton();
  const pagination = new Pagination();

  let dbResources: SupportedResources;

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

    cy.task<InsertedStopRegistryIds>(
      'insertStopRegistryData',
      getClonedBaseStopRegistryData(),
    );
  });

  function setupTestsAndNavigateToPage(qs: Record<string, unknown>) {
    cy.setupTests();
    cy.mockLogin();

    cy.visit({ url: '/stop-registry', qs });
    stopSearchBar.getSearchInput().clear();
  }

  function init() {
    setupTestsAndNavigateToPage({});
  }

  describe('by label', () => {
    beforeEach(init);

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
    beforeEach(init);

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
    beforeEach(init);

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
        stopSearchResultsPage.getResultRows().should('have.length', 4);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E001');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E002');
        stopSearchResultsPage.getResultRows().should('contain', 'E2E008');
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
    beforeEach(init);

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
    beforeEach(init);

    it(
      'Should search by all municipalities by default',
      { tags: Tag.StopRegistry },
      () => {
        stopSearchBar.getSearchInput().type(`*`);
        stopSearchBar.getExpandToggle().click();
        stopSearchBar.openMunicipalityDropdown();
        stopSearchBar.isMunicipalitySelected('Kaikki');
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
        stopSearchBar.openMunicipalityDropdown();
        stopSearchBar.isMunicipalitySelected('Kaikki');
        stopSearchBar.toggleMunicipality('Kaikki');
        stopSearchBar.toggleMunicipality('Espoo');
        stopSearchBar.getSearchButton().click();
        expectGraphQLCallToSucceed('@gqlSearchStops');

        stopSearchResultsPage.getContainer().should('be.visible');
        stopSearchResultsPage.getResultRows().should('have.length', 1);
        stopSearchResultsPage.getResultRows().should('contain', 'E2E010');
      },
    );
  });

  describe('by name variants', () => {
    beforeEach(init);

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
    beforeEach(init);

    const SHOW_ALL_BY_DEFAULT_MAX = 20;

    function getUuid(index: number) {
      if (!Number.isInteger(index)) {
        throw new Error(`Index must be an integer! But was: ${index}`);
      }

      const base = '10000000-0000-4000-9000-000000000000';
      const indexStr = index.toString(10);

      return base.substring(0, base.length - indexStr.length) + indexStr;
    }

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

    it('should have a working asterisk search and line selector', () => {
      const allExtraLines = insertExtraLines();
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

      assertOutboundRouteIsValid();
      assertInboundRouteIsValid();
    });
  });

  describe('for stop areas', () => {
    beforeEach(init);

    it('should find all by *', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      stopSearchBar.getSearchInput().clearAndType(`*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindStopAreas');

      stopGroupSelector.shouldHaveGroups(['X0003', 'X0004']);
    });

    it('should find X0004', () => {
      stopSearchBar.searchForDropdown.openSearchForDropdown();
      stopSearchBar.searchForDropdown.selectSearchFor('Pysäkkialueet');

      stopSearchBar.getSearchInput().clearAndType(`X0004{enter}`);
      expectGraphQLCallToSucceed('@gqlfindStopAreas');

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
    });
  });

  describe('Sorting & paging', () => {
    beforeEach(() => {
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
      assertResultOrder(['E2E005', 'E2E003', 'E2E006', 'E2E007', 'E2E002']);

      // Name ascending
      sortByButton.getButton('name').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('name', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E008']);

      // Address ascending
      sortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('address', 'asc');
      assertResultOrder(['E2E004', 'E2E001', 'E2E009', 'E2E002', 'E2E008']);

      // Address descending
      sortByButton.getButton('address').click();
      expectGraphQLCallToSucceed('@gqlSearchStops');
      sortByButton.assertSorting('address', 'desc');
      assertResultOrder(['E2E005', 'E2E003', 'E2E006', 'E2E007', 'E2E002']);
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
      stopSearchBar.getSearchInput().type(`*{enter}`);

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
  });
});
