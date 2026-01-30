import {
  KnownValueKey,
  ReusableComponentsVehicleModeEnum,
  StopInsertInput,
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
  MapObservationDateFiltersOverlay,
  MapPage,
  TerminalDetailsPage,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToReturnError } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const testTerminalLabels = {
  existingTerminalName: 'E2ET001',
  terminalName: 'Terminal A',
  stops: ['E2E001', 'E2E002'],
  expectedMemberStops: 'E2E001, E2E002, E2E009',
};

const map = new Map();
const mapPage = new MapPage();
const observationDateFilters = new MapObservationDateFiltersOverlay();
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

describe('Terminal creation tests', { tags: [Tag.Terminals, Tag.Map] }, () => {
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

      mapPage.map.visit({
        zoom: 16,
        lat: testCoordinates1.lat,
        lng: testCoordinates1.lng,
      });
      map.waitForLoadToComplete();
    });
  });

  it(
    'Should create terminal on map and verify details',
    { tags: [Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      const privateCode = mapPage.createTerminalAtLocation({
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

      mapPage.gqlTerminalShouldBeCreatedSuccessfully();

      mapPage.checkTerminalSubmitSuccessToast();

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
    'Should create terminal and change observation date',
    { scrollBehavior: 'bottom' },
    () => {
      observationDateFilters.observationDateControl.setObservationDate(
        '2025-01-01',
      );

      const privateCode = mapPage.createTerminalAtLocation({
        terminalFormInfo: {
          name: testTerminalLabels.terminalName,
          nameSwe: testTerminalLabels.terminalName,
          validityStartISODate: '2030-01-01',
          stops: testTerminalLabels.stops,
        },
        clickRelativePoint: {
          xPercentage: 40,
          yPercentage: 55,
        },
      });

      mapPage.gqlTerminalShouldBeCreatedSuccessfully();

      observationDateFilters.observationDateControl
        .getObservationDateInput()
        .should('have.value', '2030-01-01');

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
    'should cancel creating a new terminal',
    { scrollBehavior: 'bottom' },
    () => {
      mapPage.map.waitForLoadToComplete();

      mapPage.mapFooter.addTerminal();
      mapPage.mapFooter.getMapFooter().should('not.exist');

      mapPage.mapFooter.cancelAddMode();
      mapPage.mapFooter.getMapFooter().shouldBeVisible();
    },
  );

  it(
    'Should place terminal correctly by using manually typed latitude and longitude',
    { scrollBehavior: 'bottom' },
    () => {
      const privateCode = mapPage.createTerminalAtLocation({
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

      mapPage.gqlTerminalShouldBeCreatedSuccessfully();

      mapPage.checkTerminalSubmitSuccessToast();

      // Change map position to created terminal location
      mapPage.map.visit({
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
    { scrollBehavior: 'bottom' },
    () => {
      mapPage.mapFooter.addTerminal();

      mapPage.map.clickRelativePoint(50, 50);

      mapPage.terminalForm.fillFormForNewTerminal({
        name: testTerminalLabels.terminalName,
        nameSwe: testTerminalLabels.terminalName,
        validityStartISODate: '2022-01-01',
        stops: testTerminalLabels.stops,
      });

      mapPage.terminalForm
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
                        {
                          key: KnownValueKey.ValidityStart,
                          values: ['2020-03-20'],
                        },
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

          mapPage.terminalForm.save();

          toast.expectDangerToast(
            `Terminaalilla tulee olla uniikki tunnus, mutta tunnus ${privateCode} on jo jonkin toisen terminaalin tai pysäkkialueen käytössä!`,
          );
          expectGraphQLCallToReturnError('@gqlCreateTerminal');
        });
    },
  );
});
