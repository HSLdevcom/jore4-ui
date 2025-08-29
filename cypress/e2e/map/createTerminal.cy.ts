import { StopInsertInput } from '@hsl/jore4-test-db-manager';
import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
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
  Map,
  MapModal,
  TerminalDetailsPage,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToReturnError } from '../../utils/assertions';
import { InsertedStopRegistryIds, mapViewport } from '../utils';

const testTerminalLabels = {
  existingTerminalName: 'E2ET001',
  terminalName: 'Terminal A',
  stops: ['E2E001', 'E2E002'],
  expectedMemberStops: 'E2E001, E2E002, E2E009',
};

const map = new Map();
const mapModal = new MapModal();
const mapFilterPanel = new FilterPanel();
const terminalDetailsPage = new TerminalDetailsPage();
const toast = new Toast();

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
      map.getLoader().shouldBeVisible();
      map.waitForLoadToComplete();
    });
  });

  it(
    'Should create terminal on map and verify details',
    { tags: [Tag.Map, Tag.Terminals, Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      const privateCode = mapModal.createTerminalAtLocation({
        terminalFormInfo: {
          name: testTerminalLabels.terminalName,
          nameSwe: testTerminalLabels.terminalName,
          validityStartISODate: '2022-01-01',
          stops: testTerminalLabels.stops,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapModal.gqlTerminalShouldBeCreatedSuccessfully();

      mapModal.checkTerminalSubmitSuccessToast();

      mapFilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Bus);
      map.waitForLoadToComplete().then(() => {
        privateCode.then((value) => {
          cy.getByTestId(`Map::MapTerminal::terminal::${value}`).should(
            'exist',
          );

          terminalDetailsPage.visit(String(value));

          const { terminalDetails, locationDetails } = terminalDetailsPage;
          const { viewCard } = terminalDetails;
          const { viewCard: locationView } = locationDetails;
          viewCard.getNameFin().shouldHaveText(testTerminalLabels.terminalName);
          viewCard.getNameSwe().shouldHaveText(testTerminalLabels.terminalName);
          locationView
            .getMemberStops()
            .shouldHaveText(testTerminalLabels.expectedMemberStops);
        });
      });
    },
  );

  it(
    'Should place terminal correctly by using manually typed latitude and longitude',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      const privateCode = mapModal.createTerminalAtLocation({
        terminalFormInfo: {
          name: testTerminalLabels.terminalName,
          nameSwe: testTerminalLabels.terminalName,
          validityStartISODate: '2022-01-01',
          stops: testTerminalLabels.stops,
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
      map.waitForLoadToComplete().then(() => {
        privateCode.then((value) => {
          cy.getByTestId(`Map::MapTerminal::terminal::${value}`).should(
            'exist',
          );
        });
      });
    },
  );

  it(
    'should handle unique private code exception',
    {
      tags: [Tag.Terminals, Tag.Map],
      scrollBehavior: 'bottom',
    },
    () => {
      mapModal.mapFooter.addTerminal();

      mapModal.map.clickRelativePoint(50, 50);

      mapModal.terminalForm.fillFormForNewTerminal({
        name: testTerminalLabels.terminalName,
        nameSwe: testTerminalLabels.terminalName,
        validityStartISODate: '2022-01-01',
        stops: testTerminalLabels.stops,
      });

      mapModal.terminalForm
        .getPrivateCodeInput()
        .shouldBeVisible()
        .shouldBeDisabled()
        .invoke('val')
        .then((privateCode) => {
          cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
            stopPlaces: [
              {
                StopArea: {
                  privateCode: { type: 'HSL/TEST', value: 'ExistingStopArea' },
                  name: { lang: 'fin', value: 'Testikatu 18' },
                  quays: [
                    {
                      publicCode: 'E2E999',
                      geometry: {
                        coordinates: [24.92596546020357, 60.16993494912799],
                        type: StopRegistryGeoJsonType.Point,
                      },
                      keyValues: [
                        { key: 'validityStart', values: ['2020-03-20'] },
                      ],
                    },
                  ],
                  geometry: {
                    coordinates: [24.92596546020357, 60.16993494912799],
                    type: StopRegistryGeoJsonType.Point,
                  },
                },
                organisations: null,
              },
            ],
            terminals: [
              {
                terminal: {
                  ...baseStopRegistryData.terminals[0].terminal,
                  name: { lang: 'fi-fi', value: privateCode },
                  privateCode: { type: 'HSL/JORE-4', value: privateCode },
                },
                memberLabels: ['ExistingStopArea'],
              },
            ],
            stopPointsRequired: false,
          });

          mapModal.terminalForm.save();

          toast.expectDangerToast(
            `Terminaalilla tulee olla uniikki tunnus, mutta tunnus ${privateCode} on jo jonkin toisen terminaalin tai pysäkkialueen käytössä!`,
          );
          expectGraphQLCallToReturnError('@gqlCreateTerminal');
        });
    },
  );
});
