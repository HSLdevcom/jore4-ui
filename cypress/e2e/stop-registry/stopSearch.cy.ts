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

    function shouldHaveLines(lines: ReadonlyArray<string>) {
      const shouldHaveLength = stopSearchByLine
        .getLineSelectors()
        .should('have.length', lines.length);

      lines.reduce(
        (should, line) => should.and('contain', line),
        shouldHaveLength,
      );
    }

    function assertShowsAllResultsByDefault() {
      stopSearchBar.getSearchInput().clearAndType(`LE*{enter}`);
      expectGraphQLCallToSucceed('@gqlfindLinesByStopSearch');

      // Should contain and show all LE -lines
      shouldHaveLines(range(SHOW_ALL_BY_DEFAULT_MAX).map((i) => `LE${i}`));
      stopSearchByLine.getShowAllLinesButton().should('not.exist');
      stopSearchByLine.getShowLessLinesButton().should('not.exist');
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
      shouldHaveLines(['L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29']);

      cy.viewport(500, 1080);
      // prettier-ignore
      const minimalResult = ['L20', 'L21', 'L22', 'L23', 'L24'];
      shouldHaveLines(minimalResult);

      stopSearchByLine.getShowLessLinesButton().should('not.exist');
      stopSearchByLine
        .getShowAllLinesButton()
        .should('contain', `Näytä kaikki (${SHOW_ALL_BY_DEFAULT_MAX * 2})`)
        .click();
      stopSearchByLine.getShowLessLinesButton().shouldBeVisible();
      stopSearchByLine.getShowAllLinesButton().should('not.exist');
      shouldHaveLines(allExtraLines);

      stopSearchByLine.getShowLessLinesButton().click();

      shouldHaveLines(minimalResult);
      stopSearchByLine.getShowAllLinesButton().shouldBeVisible();
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
      stopSearchByLine.getRouteContainer(id).within(() => {
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
});
