import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import { StopSearchBar, StopSearchResultsPage } from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const baseDbResources = getClonedBaseDbResources();

describe('Stop search', () => {
  let stopSearchBar: StopSearchBar;
  let stopSearchResultsPage: StopSearchResultsPage;
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
        cy.pause();
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
});
