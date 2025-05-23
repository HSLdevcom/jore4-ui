import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import { AlternativeNames, TerminalDetailsPage } from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

describe('Terminal details', () => {
  const terminalDetailsPage = new TerminalDetailsPage();
  const alternativeNames = new AlternativeNames();

  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

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
    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      ...baseStopRegistryData,
    }).then((data) => {
      const id = data.terminalsByName.E2ET001;
      cy.setupTests();
      cy.mockLogin();

      terminalDetailsPage.visit(id);
    });
  });

  const verifyInitialBasicDetails = () => {
    const bdView = terminalDetailsPage.terminalDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getPrivateCode().shouldHaveText('T2');
    bdView.getDescription().shouldHaveText('E2E testiterminaali');
    bdView.getNameFin().shouldHaveText('E2ET001');
    bdView.getNameSwe().shouldHaveText('Terminalen');
    alternativeNames.getNameEng().shouldHaveText('Terminal');
    alternativeNames.getNameLongFin().shouldHaveText('Terminaali pitkänimi');
    alternativeNames.getNameLongSwe().shouldHaveText('Terminalen långnamn');
    alternativeNames.getNameLongEng().shouldHaveText('Terminal long name');
    alternativeNames.getAbbreviationFin().shouldHaveText('Terminaali');
    alternativeNames.getAbbreviationSwe().shouldHaveText('Terminalen');
    alternativeNames.getAbbreviationEng().shouldHaveText('Terminal');
    bdView.getTerminalType().shouldHaveText('Bussiterminaali');
    bdView.getDeparturePlatforms().shouldHaveText('7');
    bdView.getArrivalPlatforms().shouldHaveText('6');
    bdView.getLoadingPlatforms().shouldHaveText('3');
    bdView.getElectricCharging().shouldHaveText('2');
  };

  const verifyInitialLocationDetails = () => {
    const locationView = terminalDetailsPage.locationDetails.viewCard;

    locationView.getContainer().shouldBeVisible();
    locationView.getStreetAddress().shouldHaveText('Mannerheimintie 22-24');
    locationView.getPostalCode().shouldHaveText('00100');
    locationView.getMunicipality().shouldHaveText('Helsinki');
    locationView.getFareZone().shouldHaveText('A');
    locationView.getLatitude().shouldHaveText('24.92596546020357');
    locationView.getLongitude().shouldHaveText('60.16993494912799');
    locationView.getMemberStops().shouldHaveText('E2E008');
  };

  describe('basic details', () => {
    it('should view basic details', { tags: [Tag.StopRegistry] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.privateCode().shouldHaveText('T2');
      terminalDetailsPage.titleRow.name().shouldHaveText('E2ET001');
      terminalDetailsPage
        .validityPeriod()
        .should('contain', '1.1.2020-1.1.2050');

      verifyInitialBasicDetails();
    });
  });

  describe('location details', () => {
    it('should view location details', { tags: [Tag.StopRegistry] }, () => {
      terminalDetailsPage.page().shouldBeVisible();

      terminalDetailsPage.titleRow.privateCode().shouldHaveText('T2');

      verifyInitialLocationDetails();
    });
  });
});
