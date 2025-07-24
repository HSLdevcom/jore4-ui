import { StopInsertInput } from '@hsl/jore4-test-db-manager';
import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import {
  FilterPanel,
  MapModal,
  Navbar,
  TerminalDetailsPage,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds, mapViewport } from '../utils';

const testStopLabels = {
  terminalPrivateCode: 'TA',
  terminalName: 'Terminal A',
  stops: ['E2E001', 'E2E002'],
  expectedMemberStops: 'E2E001, E2E002, E2E009',
};

const mapModal = new MapModal();
const mapFilterPanel = new FilterPanel();
const navbar = new Navbar();
const terminalDetailsPage = new TerminalDetailsPage();

const testCoordinates1 = {
  lng: 24.93458814980886,
  lat: 60.16493319843619,
  el: 0,
};

const testCoordinates2 = {
  lng: 24.918451016960763,
  lat: 60.1805636468358,
  el: 0,
};

describe('Terminal creation tests', mapViewport, () => {
  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  let dbResources: SupportedResources;
  let stops: StopInsertInput[];

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      stops = buildStopsOnInfraLinks(infraLinkIds);

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
      baseStopRegistryData,
    ).then(() => {
      cy.setupTests();
      cy.mockLogin();

      mapModal.map.visit({
        path: '/stops',
        zoom: 16,
        lat: testCoordinates1.lat,
        lng: testCoordinates1.lng,
      });
    });
  });

  it(
    'Should create terminal on map and verify details',
    { tags: [Tag.Map, Tag.Terminals, Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      mapModal.createTerminalAtLocation({
        terminalFormInfo: {
          privateCode: testStopLabels.terminalPrivateCode,
          name: testStopLabels.terminalName,
          nameSwe: testStopLabels.terminalName,
          validityStartISODate: '2022-01-01',
          stops: testStopLabels.stops,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlTerminalShouldBeCreatedSuccessfully();

      mapModal.checkTerminalSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::MapTerminal::terminal::${testStopLabels.terminalPrivateCode}`,
      ).should('exist');

      mapModal.getCloseButton().click();

      navbar.getStopsLink().click();

      terminalDetailsPage.visit(testStopLabels.terminalPrivateCode);

      const { terminalDetails, locationDetails } = terminalDetailsPage;
      const { viewCard } = terminalDetails;
      const { viewCard: locationView } = locationDetails;
      viewCard.getNameFin().shouldHaveText(testStopLabels.terminalName);
      viewCard.getNameSwe().shouldHaveText(testStopLabels.terminalName);
      locationView
        .getMemberStops()
        .shouldHaveText(testStopLabels.expectedMemberStops);
    },
  );

  it(
    'Should place terminal correctly by using manually typed latitude and longitude',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapModal.createTerminalAtLocation({
        terminalFormInfo: {
          privateCode: testStopLabels.terminalPrivateCode,
          name: testStopLabels.terminalName,
          nameSwe: testStopLabels.terminalName,
          validityStartISODate: '2022-01-01',
          stops: testStopLabels.stops,
          // Actual coordinates will be on Topeliuksenkatu
          latitude: testCoordinates2.lat.toString(),
          longitude: testCoordinates2.lng.toString(),
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlTerminalShouldBeCreatedSuccessfully();

      mapModal.checkTerminalSubmitSuccessToast();

      // Change map position to created terminal location
      mapModal.map.visit({
        zoom: 16,
        lat: testCoordinates2.lat,
        lng: testCoordinates2.lng,
      });

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);

      cy.getByTestId(
        `Map::MapTerminal::terminal::${testStopLabels.terminalPrivateCode}`,
      ).should('exist');
    },
  );
});
