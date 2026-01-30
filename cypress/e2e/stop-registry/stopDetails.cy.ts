import {
  GetInfrastructureLinksByExternalIdsResult,
  KnownValueKey,
  Priority,
  StopAreaInput,
  StopInsertInput,
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  StopRegistryStopPlaceOrganisationRefInput,
  StopRegistryTransportModeType,
  TerminalInput,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  quayH2003,
  quayV1562,
  seedInfoSpots,
  seedOrganisations,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import { Tag } from '../../enums';
import {
  AlternativeNames,
  BasicDetailsForm,
  BasicDetailsViewCard,
  CreateTimingPlaceForm,
  EditStopModal,
  ExternalLinksForm,
  ExternalLinksSection,
  InfoSpotViewCard,
  InfoSpotsForm,
  LocationDetailsForm,
  LocationDetailsViewCard,
  MaintenanceDetailsForm,
  MaintenanceViewCard,
  MeasurementsForm,
  MeasurementsViewCard,
  ShelterViewCard,
  SheltersForm,
  SignageDetailsForm,
  SignageDetailsViewCard,
  StopAreaDetailsPage,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
import { StopVersionForm } from '../../pageObjects/stop-registry/stop-details/StopVersionForm';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

// These infralink IDs exist in the 'infraLinks.sql' test data file.
// These form a straight line on Eerikinkatu in Helsinki.
// Coordinates are partial since they are needed only for the stop creation.

const testInfraLinks = [
  {
    externalId: '7d29bd61-6cf7-4d2c-8bd8-b8e835fe90b7:1',
    coordinates: [24.92669962, 60.16418108, 10.09699999],
  },
  {
    externalId: 'cbe70fa1-8797-4dd4-b264-5a69f2ddcfc9:1',
    coordinates: [24.92904198, 60.16490775, 0],
  },
  {
    externalId: 'c1e17eee-96d6-4d83-91d2-51512318bff2:1',
    coordinates: [24.93207242, 60.16600322, 0],
  },
];

const timingPlaces = [
  buildTimingPlace('352f8fd6-0eaa-4b01-a2db-734431092d62', '1AACKT'),
  buildTimingPlace('0388c3fb-a08b-461c-8655-581f06e9c2f5', '1AURLA'),
];

const stopAreaInput: Array<StopAreaInput> = [
  {
    StopArea: {
      name: { lang: 'fin', value: 'Puistokaari' },
      quays: [
        {
          publicCode: 'H1122',
        },
      ],
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'H2003' },
      name: { lang: 'fin', value: 'Pohjoisesplanadi' },
      transportMode: StopRegistryTransportModeType.Bus,
      alternativeNames: [
        {
          name: { lang: 'swe', value: 'Norraesplanaden' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'eng', value: 'North esplanade' },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'fin', value: 'Pohjoisesplanadi (pitkä)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: 'Norraesplanaden (lång)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'eng', value: 'North esplanade (long)' },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'fin', value: 'Pohj.esplanadi' },
          nameType: StopRegistryNameType.Other,
        },
        {
          name: { lang: 'swe', value: 'N.esplanaden' },
          nameType: StopRegistryNameType.Other,
        },

        {
          name: { lang: 'eng', value: 'N.esplanade' },
          nameType: StopRegistryNameType.Other,
        },
      ],
      geometry: quayH2003.quay.geometry,
      quays: [
        {
          ...quayH2003.quay,
          organisations: quayH2003.organisations as
            | StopRegistryStopPlaceOrganisationRefInput[]
            | null,
        },
      ],
    },
    organisations: null,
  },
  {
    StopArea: {
      name: { lang: 'fin', value: 'V1562' },
      geometry: quayV1562.quay.geometry,
      quays: [quayV1562.quay],
    },
    organisations: null,
  },
];

const terminalH2003: TerminalInput = {
  terminal: {
    privateCode: { type: 'HSL/TEST', value: 'TH2003' },
    name: { lang: 'fin', value: 'E2ETH2003' },
    description: { lang: 'fin', value: 'E2E testiterminaali H2003' },
    geometry: {
      coordinates: [24.92596546, 60.16993495],
      type: StopRegistryGeoJsonType.Point,
    },
    keyValues: [
      { key: KnownValueKey.ValidityStart, values: ['2020-01-01'] },
      { key: KnownValueKey.ValidityEnd, values: ['2050-01-01'] },
      {
        key: KnownValueKey.StreetAddress,
        values: ['Mannerheimintie 22-24'],
      },
      { key: KnownValueKey.PostalCode, values: ['00100'] },
      { key: KnownValueKey.Municipality, values: ['Helsinki'] },
      { key: KnownValueKey.FareZone, values: ['A'] },
      { key: KnownValueKey.TerminalType, values: ['BusTerminal'] },
      { key: KnownValueKey.DeparturePlatforms, values: ['7'] },
      { key: KnownValueKey.ArrivalPlatforms, values: ['6'] },
      { key: KnownValueKey.LoadingPlatforms, values: ['3'] },
      { key: KnownValueKey.ElectricCharging, values: ['2'] },
    ],
    externalLinks: [
      { name: 'Terminaalin Testilinkki', location: 'https://terminaltest.fi' },
    ],
  },
  memberLabels: ['H2003'],
};

const buildScheduledStopPoints = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: 'H1122',
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    scheduled_stop_point_id: 'd4e6478a-adce-4c76-8579-c8ca2a6bb70f',
    timing_place_id: timingPlaces[0].timing_place_id,
    priority: Priority.Draft,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'H2003',
      located_on_infrastructure_link_id: infrastructureLinkIds[2],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '29dfb688-7ecc-4cb5-876d-c2c7f1a1f00a',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[2].coordinates,
    },
  },
  {
    ...buildStop({
      label: 'V1562',
      located_on_infrastructure_link_id: infrastructureLinkIds[1],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '603c8ea9-63f2-469b-9790-790e368a3c7e',
    timing_place_id: timingPlaces[1].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[1].coordinates,
    },
  },
];

describe('Stop details', { tags: [Tag.StopRegistry] }, () => {
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
      terminals: [terminalH2003],
      stopPlaces: stopAreaInput,
      organisations: seedOrganisations,
      infoSpots: seedInfoSpots,
    });

    cy.setupTests();
    cy.mockLogin();
  });

  const verifyInitialBasicDetails = () => {
    const bdView = StopDetailsPage.basicDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getLabel().shouldHaveText('H2003');
    bdView.getPrivateCode().shouldHaveText('10003');
    bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
    bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
    bdView.getElyNumber().shouldHaveText('1234567');

    bdView.getTimingPlaceId().shouldHaveText('1AURLA');
    bdView.getStopType().shouldHaveText('Raideliikennettä korvaava');
    bdView.getTransportMode().shouldHaveText('Bussi');
  };

  const verifyInitialLocationDetails = () => {
    const locationView = StopDetailsPage.locationDetails.viewCard;

    locationView.getContainer().shouldBeVisible();
    locationView.getStreetAddress().shouldHaveText('Mannerheimintie 22-24');
    locationView.getPostalCode().shouldHaveText('00100');
    locationView.getMunicipality().shouldHaveText('Helsinki');
    locationView.getFareZone().shouldHaveText('A');
    locationView.getLatitude().shouldHaveText('60.16600322');
    locationView.getLongitude().shouldHaveText('24.93207242');
    locationView.getAltitude().shouldHaveText('0');
    locationView.getFunctionalArea().shouldHaveText('20 m');
    locationView.getPlatformNumber().shouldHaveText('A2');
    locationView.getSignContentType().shouldHaveText('Kilpi');
    locationView.getMemberPlatforms().shouldHaveText('-');
    locationView.getTerminalPrivateCode().shouldHaveText('TH2003');
    locationView
      .getTerminalLink()
      .shouldBeVisible()
      .should('have.attr', 'href', `/stop-registry/terminals/TH2003`);
    locationView.getTerminalName().shouldHaveText('E2ETH2003');
    locationView.getTerminalStops().shouldHaveText('H2003');
  };

  const verifyInitialSignageDetails = () => {
    const signView = StopDetailsPage.signageDetails.viewCard;

    signView.getContainer().shouldBeVisible();
    signView.getSignType().shouldHaveText('Tolppamerkki');
    signView.getNumberOfFrames().shouldHaveText('12');
    signView.getReplacesRailSign().shouldHaveText('Ei');
    signView.getSignageInstructionExceptions().shouldHaveText('Ohjetekstiä...');
  };

  const verifyInitialExternalLinks = () => {
    const externalLinksView = ExternalLinksSection;

    externalLinksView.getName().shouldHaveText('Testilinkki');
    externalLinksView
      .getLocation()
      .should('have.attr', 'href', 'https://test.fi');
  };

  const verifyInitialShelters = () => {
    const shelterView = StopDetailsPage.shelters.viewCard;

    shelterView.getContainers().shouldBeVisible();
    shelterView.getContainers().should('have.length', 1);
    shelterView.getShelterExternalId().shouldHaveText('12345');
    shelterView.getShelterNumber().shouldHaveText('1');
    shelterView.getShelterType().shouldHaveText('Teräskatos');
    shelterView.getElectricity().shouldHaveText('Jatkuva sähkö');
    shelterView.getLighting().shouldHaveText('Kyllä');
    shelterView.getCondition().shouldHaveText('Välttävä');
    shelterView.getTimetableCabinets().shouldHaveText('1');
    shelterView.getTrashCan().shouldHaveText('Kyllä');
    shelterView.getHasDisplay().shouldHaveText('Kyllä');
    shelterView.getBicycleParking().shouldHaveText('Kyllä');
    shelterView.getLeaningRail().shouldHaveText('Kyllä');
    shelterView.getOutsideBench().shouldHaveText('Kyllä');
    shelterView.getFasciaBoardTaping().shouldHaveText('Kyllä');
  };

  const verifyInitialMeasurements = () => {
    const measurementsView = StopDetailsPage.measurements.viewCard;

    measurementsView.getContainer().shouldBeVisible();
    measurementsView.getStopType().shouldHaveText('Syvennys');
    measurementsView.getCurvedStop().shouldHaveText('Ei');
    measurementsView.getShelterType().shouldHaveText('Leveä');
    measurementsView.getShelterLaneDistance().shouldHaveText('123');
    measurementsView.getCurbBackOfRailDistance().shouldHaveText('45.6');
    measurementsView.getStopAreaSideSlope().shouldHaveText('5.3');
    measurementsView.getStopAreaLengthwiseSlope().shouldHaveText('1.8');

    measurementsView.getStructureLaneDistance().shouldHaveText('6');
    measurementsView.getStopElevationFromRailTop().shouldHaveText('10');
    measurementsView.getStopElevationFromSidewalk().shouldHaveText('7');
    measurementsView.getLowerCleatHeight().shouldHaveText('8');

    measurementsView.getPlatformEdgeWarningArea().shouldHaveText('Kyllä');
    measurementsView.getSidewalkAccessibleConnection().shouldHaveText('Kyllä');
    measurementsView.getGuidanceStripe().shouldHaveText('Kyllä');
    measurementsView.getServiceAreaStripes().shouldHaveText('Kyllä');
    measurementsView.getGuidanceType().shouldHaveText('Pisteopaste');
    measurementsView.getGuidanceTiles().shouldHaveText('Kyllä');
    measurementsView.getMapType().shouldHaveText('Kohokartta');

    measurementsView.getCurbDriveSideOfRailDistance().shouldHaveText('5');
    measurementsView.getEndRampSlope().shouldHaveText('3.5');
    measurementsView.getServiceAreaWidth().shouldHaveText('4.6');
    measurementsView.getServiceAreaLength().shouldHaveText('55.2');
    measurementsView
      .getPedestrianCrossingRampType()
      .shouldHaveText('LR - Luiskattu reunatukiosuus');
    measurementsView
      .getStopAreaSurroundingsAccessible()
      .shouldHaveText('Esteellinen');
  };

  const verifyInitialMaintenanceDetails = () => {
    const maintenanceView = StopDetailsPage.maintenance.viewCard;
    const maintainerView = maintenanceView.maintainerViewCard;

    maintenanceView.getContainer().shouldBeVisible();
    maintenanceView.getContainer().scrollIntoView(); // Measurements section is too fat.

    maintenanceView.getStopOwner().within(() => {
      maintenanceView.getStopOwnerName().shouldHaveText('ELY');
    });

    maintenanceView.getOwner().within(() => {
      maintainerView.getName().shouldHaveText('JCD');
      maintainerView.getPhone().shouldHaveText('+358501234567');
      maintainerView.getEmail().shouldHaveText('jcd@example.com');
      maintainerView.getNotSelectedPlaceholder().should('not.exist');
    });

    maintenanceView.getShelterMaintenance().within(() => {
      maintainerView.getName().shouldHaveText('JCD');
      maintainerView.getPhone().shouldHaveText('+358501234567');
      maintainerView.getEmail().shouldHaveText('jcd@example.com');
      maintainerView.getNotSelectedPlaceholder().should('not.exist');
    });

    maintenanceView.getMaintenance().within(() => {
      maintainerView.getName().shouldHaveText('ELY-keskus');
      maintainerView.getPhone().shouldHaveText('+358501234567');
      maintainerView.getEmail().shouldHaveText('ely-keskus@example.com');
      maintainerView.getNotSelectedPlaceholder().should('not.exist');
    });

    maintenanceView.getWinterMaintenance().within(() => {
      maintainerView.getName().shouldHaveText('ELY-keskus');
      maintainerView.getPhone().shouldHaveText('+358501234567');
      maintainerView.getEmail().shouldHaveText('ely-keskus@example.com');
      maintainerView.getNotSelectedPlaceholder().should('not.exist');
    });

    maintenanceView.getInfoUpkeep().within(() => {
      maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
      maintainerView.getEmail().should('not.exist');
      maintainerView.getName().should('not.exist');
      maintainerView.getPhone().should('not.exist');
    });

    maintenanceView.getCleaning().within(() => {
      maintainerView.getName().shouldHaveText('Clear Channel');
      maintainerView.getPhone().shouldHaveText('+358501223334');
      maintainerView.getEmail().shouldHaveText('clear-channel@example.com');
      maintainerView.getNotSelectedPlaceholder().should('not.exist');
    });
  };

  const verifyInfoSpotJP1234568 = (expectedLocation: {
    readonly lat: string;
    readonly lon: string;
    readonly stops: string;
  }) => {
    const infoSpotView = StopDetailsPage.infoSpots.viewCard;

    infoSpotView
      .getDescription()
      .shouldHaveText('Ensimmäinen kerros, portaiden vieressä');
    infoSpotView.getLabel().shouldHaveText('JP1234568');
    infoSpotView.getPurpose().shouldHaveText('Tiedotteet');
    infoSpotView.getLatitude().shouldHaveText(expectedLocation.lat);
    infoSpotView.getLongitude().shouldHaveText(expectedLocation.lon);
    infoSpotView.getBacklight().shouldHaveText('Kyllä');
    infoSpotView.getSize().shouldHaveText('80 × 120 cm');
    infoSpotView.getPosterSize().shouldHaveText('A4 (21.0 × 29.7 cm)');
    infoSpotView.getPosterLabel().shouldHaveText('PT1234');
    infoSpotView.getPosterLines().shouldHaveText('1, 6, 17');
    infoSpotView.getFloor().shouldHaveText('1');
    infoSpotView.getRailInformation().shouldHaveText('7');
    infoSpotView.getStops().shouldHaveText(expectedLocation.stops);
    infoSpotView.getTerminals().shouldHaveText('-');
    infoSpotView.getZoneLabel().shouldHaveText('A');
    infoSpotView.getNoPosters().should('not.exist');
  };

  const verifyInitialInfoSpots = () => {
    const infoSpotView = StopDetailsPage.infoSpots.viewCard;
    infoSpotView.getNthSectionContainer(0).within(() => {
      verifyInfoSpotJP1234568({
        lat: '60.16490775',
        lon: '24.92904198',
        stops: 'V1562',
      });
    });

    infoSpotView.getNthSectionContainer(1).within(() => {
      infoSpotView
        .getDescription()
        .shouldHaveText('Ensimmäinen kerros, portaiden takana');
      infoSpotView.getLabel().shouldHaveText('JP1234567');
      infoSpotView.getPurpose().shouldHaveText('Dynaaminen näyttö');
      infoSpotView.getLatitude().shouldHaveText('60.16490775');
      infoSpotView.getLongitude().shouldHaveText('24.92904198');
      infoSpotView.getBacklight().shouldHaveText('-');
      infoSpotView.getSize().shouldHaveText('-');
      infoSpotView.getFloor().shouldHaveText('1');
      infoSpotView.getRailInformation().shouldHaveText('8');
      infoSpotView.getStops().shouldHaveText('V1562');
      infoSpotView.getTerminals().shouldHaveText('-');
      infoSpotView.getZoneLabel().shouldHaveText('B');
      infoSpotView.getNoPosters().shouldHaveText('Ei infotuotetta');
    });

    infoSpotView.getNthSectionContainer(2).within(() => {
      infoSpotView.getDescription().shouldHaveText('Tolpassa');
      infoSpotView.getLabel().shouldHaveText('JP1234569');
      infoSpotView.getPurpose().shouldHaveText('Infopaikan käyttötarkoitus');
      infoSpotView.getLatitude().shouldHaveText('60.16490775');
      infoSpotView.getLongitude().shouldHaveText('24.92904198');
      infoSpotView.getBacklight().shouldHaveText('-');
      infoSpotView.getSize().shouldHaveText('-');
      infoSpotView.getFloor().shouldHaveText('1');
      infoSpotView.getRailInformation().shouldHaveText('9');
      infoSpotView.getStops().shouldHaveText('V1562');
      infoSpotView.getTerminals().shouldHaveText('-');
      infoSpotView.getZoneLabel().shouldHaveText('C');
      infoSpotView.getNoPosters().shouldHaveText('Ei infotuotetta');
    });
  };

  it(
    'should view details for a stop',
    { tags: [Tag.StopRegistry, Tag.Smoke] },
    () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      StopDetailsPage.titleRow.label().shouldHaveText('H2003');
      StopDetailsPage.titleRow
        .names()
        .shouldHaveText('Pohjoisesplanadi|Norraesplanaden');
      StopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');

      StopDetailsPage.changeHistoryLink()
        .shouldBeVisible()
        .invoke('text')
        .should('match', /\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}/); // Matches format: DD.MM.YYYY HH:mm

      StopDetailsPage.headerSummaryRow.lineCount().should('have.text', 0);

      StopDetailsPage.basicDetailsTabPanel().should('be.visible');
      StopDetailsPage.technicalFeaturesTabPanel().should('not.exist');
      StopDetailsPage.infoSpotsTabPanel().should('not.exist');
    },
  );

  describe('basic details', () => {
    it('should view stop area basic details text fields', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      BasicDetailsViewCard.getContent().shouldBeVisible();

      BasicDetailsViewCard.getAreaLink().click();
      StopAreaDetailsPage.details.getPrivateCode().shouldHaveText('H2003');
      cy.go('back');

      BasicDetailsViewCard.getAreaPrivateCode().shouldHaveText('H2003');
      BasicDetailsViewCard.getAreaQuays().shouldHaveText('H2003');
      BasicDetailsViewCard.getAreaName().shouldHaveText('Pohjoisesplanadi');
      BasicDetailsViewCard.getAreaNameSwe().shouldHaveText('Norraesplanaden');
      AlternativeNames.getNameEng().shouldHaveText('North esplanade');
      AlternativeNames.getNameLongFin().shouldHaveText(
        'Pohjoisesplanadi (pitkä)',
      );
      AlternativeNames.getNameLongSwe().shouldHaveText(
        'Norraesplanaden (lång)',
      );
      AlternativeNames.getNameLongEng().shouldHaveText(
        'North esplanade (long)',
      );
      AlternativeNames.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
      AlternativeNames.getAbbreviationSwe().shouldHaveText('N.esplanaden');
      AlternativeNames.getAbbreviationEng().shouldHaveText('N.esplanade');

      StopDetailsPage.basicDetails.getEditButton().click();

      // Verify correct values in readonly fields.
      BasicDetailsViewCard.getAreaLink().click();
      StopAreaDetailsPage.details.getPrivateCode().shouldHaveText('H2003');
      cy.go('back');
      StopDetailsPage.basicDetails.getEditButton().click();
      BasicDetailsViewCard.getAreaPrivateCode().shouldHaveText('H2003');
      BasicDetailsViewCard.getAreaQuays().shouldHaveText('H2003');
      BasicDetailsViewCard.getAreaName().shouldHaveText('Pohjoisesplanadi');
      BasicDetailsViewCard.getAreaNameSwe().shouldHaveText('Norraesplanaden');
      AlternativeNames.getNameEng().shouldHaveText('North esplanade');
      AlternativeNames.getNameLongFin().shouldHaveText(
        'Pohjoisesplanadi (pitkä)',
      );
      AlternativeNames.getNameLongSwe().shouldHaveText(
        'Norraesplanaden (lång)',
      );
      AlternativeNames.getNameLongEng().shouldHaveText(
        'North esplanade (long)',
      );
      AlternativeNames.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
      AlternativeNames.getAbbreviationSwe().shouldHaveText('N.esplanaden');
      AlternativeNames.getAbbreviationEng().shouldHaveText('N.esplanade');
    });

    it('should view and edit basic details text fields', {}, () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      BasicDetailsViewCard.getContent().shouldBeVisible();
      BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
      BasicDetailsViewCard.getPrivateCode().shouldHaveText('10003');
      BasicDetailsViewCard.getLocationFin().shouldHaveText(
        'Pohjoisesplanadi (sij.)',
      );
      BasicDetailsViewCard.getLocationSwe().shouldHaveText(
        'Norraesplanaden (plats)',
      );
      BasicDetailsViewCard.getElyNumber().shouldHaveText('1234567');

      StopDetailsPage.basicDetails.getEditButton().click();

      // TODO: when this assert fails, remove this line and implement tests for label change
      BasicDetailsForm.getLabelInput().shouldBeDisabled();

      // Verify correct initial values.
      BasicDetailsForm.getLabelInput().should('have.value', 'H2003');
      BasicDetailsForm.getPrivateCodeInput().should('have.value', '10003');
      BasicDetailsForm.getLocationFinInput().should(
        'have.value',
        'Pohjoisesplanadi (sij.)',
      );
      BasicDetailsForm.getLocationSweInput().should(
        'have.value',
        'Norraesplanaden (plats)',
      );
      BasicDetailsForm.getElyNumberInput().should('have.value', '1234567');

      BasicDetailsForm.getPrivateCodeInput().clearAndType('10004');
      BasicDetailsForm.getLocationFinInput().clearAndType(
        'NewPohjoisesplanadi (sij.)',
      );
      BasicDetailsForm.getLocationSweInput().clearAndType(
        'NewNorraesplanaden (plats)',
      );

      BasicDetailsForm.getElyNumberInput().clearAndType('1234568');
      BasicDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E Testing');

      StopDetailsPage.basicDetails.getSaveButton().click();

      Toast.expectSuccessToast('Pysäkki muokattu');

      BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
      BasicDetailsViewCard.getPrivateCode().shouldHaveText('10004');
      BasicDetailsViewCard.getLocationFin().shouldHaveText(
        'NewPohjoisesplanadi (sij.)',
      );
      BasicDetailsViewCard.getLocationSwe().shouldHaveText(
        'NewNorraesplanaden (plats)',
      );
      BasicDetailsViewCard.getElyNumber().shouldHaveText('1234568');
    });

    it(
      'should view and edit basic details dropdowns and checkboxes',
      {},
      () => {
        StopDetailsPage.visit('H2003');
        StopDetailsPage.page().shouldBeVisible();

        BasicDetailsViewCard.getContent().shouldBeVisible();

        BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
        BasicDetailsViewCard.getTimingPlaceId().shouldHaveText('1AURLA');
        BasicDetailsViewCard.getStopType().shouldHaveText(
          'Raideliikennettä korvaava',
        );
        BasicDetailsViewCard.getTransportMode().shouldHaveText('Bussi');

        // Make sure header row reflects these
        StopDetailsPage.headerSummaryRow
          .stopTypes()
          .should('have.text', 'Raideliikennettä korvaava');

        StopDetailsPage.basicDetails.getEditButton().click();

        // Verify correct initial values.
        BasicDetailsForm.getRailReplacementCheckbox().should('be.checked');
        BasicDetailsForm.getVirtualCheckbox().should('not.be.checked');
        BasicDetailsForm.getTransportModeDropdownButton().shouldHaveText(
          'Bussi',
        );
        BasicDetailsForm.getTimingPlaceDropdown().shouldHaveText(
          '1AURLA (1AURLA)',
        );

        // Rail replacement is only available for transport mode: bus
        BasicDetailsForm.getTransportModeDropdownButton().shouldBeDisabled();
        BasicDetailsForm.getVirtualCheckbox().click();

        StopDetailsPage.basicDetails.getSaveButton().click();

        Toast.expectSuccessToast('Pysäkki muokattu');

        // Tiamat data model has some arrays that stores multiple types
        // of data, so all these checks are here to make sure that
        // the saves do not change other fields.
        BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
        BasicDetailsViewCard.getPrivateCode().shouldHaveText('10003');
        BasicDetailsViewCard.getLocationFin().shouldHaveText(
          'Pohjoisesplanadi (sij.)',
        );
        BasicDetailsViewCard.getLocationSwe().shouldHaveText(
          'Norraesplanaden (plats)',
        );
        BasicDetailsViewCard.getTransportMode().shouldHaveText('Bussi');
        BasicDetailsViewCard.getTimingPlaceId().shouldHaveText('1AURLA');
        BasicDetailsViewCard.getStopType().shouldHaveText(
          'Raideliikennettä korvaava, virtuaalipysäkki',
        );
        BasicDetailsViewCard.getStopState().shouldHaveText('Pois käytöstä');
        BasicDetailsViewCard.getElyNumber().shouldHaveText('1234567');

        // Make sure header row reflects these
        StopDetailsPage.headerSummaryRow
          .stopTypes()
          .should('have.text', 'Raideliikennettä korvaavaVirtuaalipysäkki');
        StopDetailsPage.headerSummaryRow
          .stopState()
          .should('have.text', 'Pois käytöstä');

        StopDetailsPage.basicDetails.getEditButton().click();

        BasicDetailsForm.getRailReplacementCheckbox().click();
        BasicDetailsForm.getTransportModeDropdownButton().click();
        BasicDetailsForm.getTransportModeDropdownOptions()
          .contains('Raitiovaunu')
          .click();

        // Rail replacement is only available for transport mode: bus
        BasicDetailsForm.getRailReplacementCheckbox().shouldBeDisabled();

        BasicDetailsForm.getStopPlaceStateDropdownButton().click();
        BasicDetailsForm.getStopPlaceStateDropdownOptions()
          .contains('Käytössä')
          .click();
        BasicDetailsForm.getTimingPlaceDropdown().type('1AACKT');

        cy.get('[role="option"]').contains('1AACKT').click();

        StopDetailsPage.basicDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        BasicDetailsViewCard.getTransportMode().shouldHaveText('Raitiovaunu');
        BasicDetailsViewCard.getStopState().shouldHaveText('Käytössä');
        BasicDetailsViewCard.getTimingPlaceId().shouldHaveText('1AACKT');

        // Make sure header row reflects these
        StopDetailsPage.headerSummaryRow.stopState().should('not.exist');
      },
    );

    it('Should show character limit reached message for reason for change', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      BasicDetailsViewCard.getContent().shouldBeVisible();
      StopDetailsPage.basicDetails.getEditButton().click();
      // Initial height should be same as input
      BasicDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .invoke('outerHeight')
        .should('be.equal', 44);

      BasicDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .clearAndType(
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula ' +
            'eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient ' +
            'montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, ' +
            'pretium quis',
        );

      // Test that automatic resizing works correctly
      BasicDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .invoke('outerHeight')
        .should('be.gte', 44);

      BasicDetailsForm.reasonForChange
        .characterLimitReached()
        .shouldBeVisible();

      BasicDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .type('{backspace}');

      BasicDetailsForm.reasonForChange
        .characterLimitReached()
        .should('not.exist');
    });

    describe('creating new timing place', () => {
      it('should create new timing place correctly', () => {
        StopDetailsPage.visit('H2003');
        StopDetailsPage.page().shouldBeVisible();

        BasicDetailsViewCard.getContent().shouldBeVisible();
        BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
        BasicDetailsViewCard.getTimingPlaceId().shouldHaveText('1AURLA');

        StopDetailsPage.basicDetails.getEditButton().click();

        BasicDetailsForm.getAddTimingPlaceButton().click();

        CreateTimingPlaceForm.fillTimingPlaceFormAndSave({
          label: '1TEST',
          description: 'Test description',
        });

        Toast.expectSuccessToast('Hastus-paikka luotu');

        BasicDetailsForm.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Creating new timing place for e2e test');

        StopDetailsPage.basicDetails
          .getSaveButton()
          .should('be.enabled')
          .click();

        Toast.expectSuccessToast('Pysäkki muokattu');

        BasicDetailsViewCard.getLabel().shouldHaveText('H2003');
        BasicDetailsViewCard.getTimingPlaceId().shouldHaveText('1TEST');
      });
    });

    // TODO: test for removing timing place from stop that is used
    // as timing point on a route. This is better to be created after
    // e2e test data unification
  });

  describe('location details', () => {
    it('should view location details', {}, () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      verifyInitialLocationDetails();

      StopDetailsPage.locationDetails.getEditButton().click();
      LocationDetailsViewCard.getContainer().should('not.exist');

      LocationDetailsForm.getLatitudeInput()
        .should('be.disabled')
        .should('have.value', 60.16600322);
      LocationDetailsForm.getLongitudeInput()
        .should('be.disabled')
        .should('have.value', 24.93207242);
      LocationDetailsForm.getAltitudeInput()
        .should('be.disabled')
        .should('have.value', 0);

      LocationDetailsForm.getStreetAddressInput()
        .should('have.value', 'Mannerheimintie 22-24')
        .clearAndType('Marskintie 42');
      LocationDetailsForm.getPostalCodeInput()
        .should('have.value', '00100')
        .clearAndType('33720');
      LocationDetailsForm.getMunicipalityReadOnly().shouldHaveText('Helsinki');
      LocationDetailsForm.getFareZoneReadOnly().shouldHaveText('A');
      LocationDetailsForm.getFunctionalAreaInput()
        .should('have.value', '20')
        .clearAndType('7');

      LocationDetailsForm.getPlatformNumber().clearAndType('2');

      LocationDetailsForm.getSignContentTypeDropdownButton()
        .shouldHaveText('Kilpi')
        .click();
      LocationDetailsForm.getSignContentTypeDropdownOptions()
        .contains('Ei opastetta')
        .click();

      LocationDetailsForm.reasonForChange
        .getReasonForChangeInput()
        .clearAndType('E2E Testing');

      StopDetailsPage.locationDetails.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      LocationDetailsViewCard.getContainer().shouldBeVisible();

      LocationDetailsViewCard.getStreetAddress().shouldHaveText(
        'Marskintie 42',
      );
      LocationDetailsViewCard.getPostalCode().shouldHaveText('33720');
      LocationDetailsViewCard.getMunicipality().shouldHaveText('Helsinki');
      LocationDetailsViewCard.getFareZone().shouldHaveText('A');
      LocationDetailsViewCard.getLatitude().shouldHaveText('60.16600322');
      LocationDetailsViewCard.getLongitude().shouldHaveText('24.93207242');
      LocationDetailsViewCard.getFunctionalArea().shouldHaveText('7 m');
      LocationDetailsViewCard.getPlatformNumber().shouldHaveText('2');
      LocationDetailsViewCard.getSignContentType().shouldHaveText(
        'Ei opastetta',
      );
    });
  });

  describe('signage details', () => {
    it('should view and edit signage details', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      verifyInitialSignageDetails();

      StopDetailsPage.signageDetails.getEditButton().click();
      SignageDetailsViewCard.getContainer().should('not.exist');

      SignageDetailsForm.getSignTypeDropdownButton()
        .shouldHaveText('Tolppamerkki')
        .click();
      SignageDetailsForm.getSignTypeDropdownOptions()
        .contains('Katoskehikko')
        .click();
      SignageDetailsForm.getNumberOfFramesInput()
        .should('have.value', 12)
        .clearAndType('7');
      SignageDetailsForm.getReplacesRailSignCheckbox()
        .should('not.be.checked')
        .click();
      SignageDetailsForm.getSignageInstructionExceptionsInput()
        .should('have.value', 'Ohjetekstiä...')
        .clearAndType('Uusi teksti');

      StopDetailsPage.signageDetails.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      SignageDetailsViewCard.getContainer().shouldBeVisible();

      SignageDetailsViewCard.getContainer().shouldBeVisible();
      SignageDetailsViewCard.getSignType().shouldHaveText('Katoskehikko');
      SignageDetailsViewCard.getNumberOfFrames().shouldHaveText('7');
      SignageDetailsViewCard.getReplacesRailSign().shouldHaveText('Kyllä');
      SignageDetailsViewCard.getSignageInstructionExceptions().shouldHaveText(
        'Uusi teksti',
      );
    });
  });

  describe('external links', () => {
    it('should view and edit external links', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      ExternalLinksSection.getTitle().shouldHaveText('Linkit');
      ExternalLinksSection.getExternalLinks().shouldBeVisible();
      ExternalLinksSection.getNthExternalLink(0).within(() => {
        verifyInitialExternalLinks();
      });

      ExternalLinksSection.getEditButton().click();
      ExternalLinksForm.externalLinks
        .getNameInput()
        .clearAndType('Linkin nimi');
      ExternalLinksForm.externalLinks
        .getLocationInput()
        .clearAndType('http://www.example.com');
      ExternalLinksForm.getSaveButton().click();
      ExternalLinksSection.getNoExternalLinks().should('not.exist');
      ExternalLinksSection.getExternalLinks().should('have.length', 1);

      ExternalLinksSection.getNthExternalLink(0).within(() => {
        ExternalLinksSection.getName().shouldHaveText('Linkin nimi');
        ExternalLinksSection.getLocation().should(
          'have.attr',
          'href',
          'http://www.example.com',
        );
      });
    });

    it('should add and delete external links', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      ExternalLinksSection.getTitle().shouldHaveText('Linkit');
      ExternalLinksSection.getExternalLinks().shouldBeVisible();
      ExternalLinksSection.getNthExternalLink(0).within(() => {
        verifyInitialExternalLinks();
      });

      ExternalLinksSection.getEditButton().click();
      ExternalLinksForm.getAddNewButton().click();
      ExternalLinksForm.getNthExternalLink(1).within(() => {
        ExternalLinksForm.externalLinks
          .getNameInput()
          .clearAndType('Linkin nimi 2');
        ExternalLinksForm.externalLinks
          .getLocationInput()
          .clearAndType('http://www.example2.com');
      });
      ExternalLinksForm.getSaveButton().click();
      ExternalLinksSection.getNoExternalLinks().should('not.exist');
      ExternalLinksSection.getExternalLinks().should('have.length', 2);

      ExternalLinksSection.getNthExternalLink(0).within(() => {
        ExternalLinksSection.getName().shouldHaveText('Testilinkki');
      });
      ExternalLinksSection.getNthExternalLink(1).within(() => {
        ExternalLinksSection.getName().shouldHaveText('Linkin nimi 2');
      });

      ExternalLinksSection.getEditButton().click();
      ExternalLinksForm.getNthExternalLink(0).within(() => {
        ExternalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
      });
      ExternalLinksForm.getSaveButton().click();
      ExternalLinksSection.getExternalLinks().should('have.length', 1);
      ExternalLinksSection.getNthExternalLink(0).within(() => {
        ExternalLinksSection.getName().shouldHaveText('Linkin nimi 2');
      });

      ExternalLinksSection.getEditButton().click();
      ExternalLinksForm.getNthExternalLink(0).within(() => {
        ExternalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
      });
      ExternalLinksForm.getSaveButton().click();
      ExternalLinksSection.getExternalLinks().should('have.length', 0);
      ExternalLinksSection.getNoExternalLinks().shouldBeVisible();
      ExternalLinksSection.getNoExternalLinks().shouldHaveText('Ei linkkejä');
    });
  });

  describe('technical features', () => {
    beforeEach(() => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();
      StopDetailsPage.titleRow.label().shouldHaveText('H2003');

      StopDetailsPage.technicalFeaturesTabButton().click();
    });

    it('should view technical features', () => {
      StopDetailsPage.technicalFeaturesTabPanel().should('be.visible');
      StopDetailsPage.basicDetailsTabPanel().should('not.exist');
      StopDetailsPage.infoSpotsTabPanel().should('not.exist');
    });

    describe('shelters', () => {
      it('should view and edit shelter details', () => {
        verifyInitialShelters();

        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        SheltersForm.getShelters().should('have.length', 1);

        SheltersForm.getNthShelter(0).within(() => {
          const shelter = SheltersForm.shelters;
          // Verify correct initial values:
          shelter.getShelterExternalIdInput().should('have.value', '12345');
          shelter.getShelterNumberInput().should('have.value', '1');
          shelter
            .getShelterTypeDropdownButton()
            .should('have.text', 'Teräskatos');
          shelter
            .getShelterElectricityDropdownButton()
            .should('have.text', 'Jatkuva sähkö');
          shelter
            .getShelterLightingDropdownButton()
            .should('have.text', 'Kyllä');
          shelter
            .getShelterConditionDropdownButton()
            .should('have.text', 'Välttävä');
          shelter.getTimetableCabinetsInput().should('have.value', '1');
          shelter.getTrashCanCheckbox().should('be.checked');
          shelter.getShelterHasDisplayCheckbox().should('be.checked');
          shelter.getBicycleParkingCheckbox().should('be.checked');
          shelter.getLeaningRailCheckbox().should('be.checked');
          shelter.getOutsideBenchCheckbox().should('be.checked');
          shelter.getShelterFasciaBoardTapingCheckbox().should('be.checked');

          // Change everything:
          shelter.getShelterExternalIdInput().clearAndType('98765');
          shelter.getShelterNumberInput().clearAndType('2');
          shelter.getShelterTypeDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            shelter
              .getShelterTypeDropdownOptions()
              .contains('Puukatos')
              .click(),
          );
          shelter.getShelterElectricityDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            shelter
              .getShelterElectricityDropdownOptions()
              .contains('Valosähkö')
              .click(),
          );
          shelter.getShelterLightingDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            shelter.getShelterLightingDropdownOptions().contains('Ei').click(),
          );
          shelter.getShelterConditionDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            shelter
              .getShelterConditionDropdownOptions()
              .contains('Hyvä')
              .click(),
          );
          shelter.getTimetableCabinetsInput().clearAndType('42');
          shelter.getTrashCanCheckbox().click();
          shelter.getShelterHasDisplayCheckbox().click();
          shelter.getBicycleParkingCheckbox().click();
          shelter.getLeaningRailCheckbox().click();
          shelter.getOutsideBenchCheckbox().click();
          shelter.getShelterFasciaBoardTapingCheckbox().click();
        });

        // Submit.
        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
        ShelterViewCard.getContainers().shouldBeVisible();

        // Verify changes visible in view card:
        ShelterViewCard.getShelterExternalId().should('have.text', '98765');
        ShelterViewCard.getContainers().should('have.length', 1);
        ShelterViewCard.getShelterNumber().should('have.text', '2');
        ShelterViewCard.getShelterType().should('have.text', 'Puukatos');
        ShelterViewCard.getElectricity().should('have.text', 'Valosähkö');
        ShelterViewCard.getLighting().should('have.text', 'Ei');
        ShelterViewCard.getCondition().should('have.text', 'Hyvä');
        ShelterViewCard.getTimetableCabinets().should('have.text', '42');
        ShelterViewCard.getTrashCan().should('have.text', 'Ei');
        ShelterViewCard.getHasDisplay().should('have.text', 'Ei');
        ShelterViewCard.getBicycleParking().should('have.text', 'Ei');
        ShelterViewCard.getLeaningRail().should('have.text', 'Ei');
        ShelterViewCard.getOutsideBench().should('have.text', 'Ei');
        ShelterViewCard.getFasciaBoardTaping().should('have.text', 'Ei');

        // "enclosed" is not visible anywhere in UI, check from request that it got sent.
        expectGraphQLCallToSucceed('@gqlUpdateStopPlace')
          .its(
            'request.body.variables.input.quays.0.placeEquipments.shelterEquipment.0.enclosed',
          )
          .should('equal', false);
      });

      it('should be able to keep shelter numbers in order', () => {
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');

        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        // Add more shelters.
        SheltersForm.getShelters().should('have.length', 1);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        SheltersForm.getShelters().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (3)');

        // Submit.
        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().shouldBeVisible();
        ShelterViewCard.getContainers().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (3)');

        // Delete the 2nd.
        StopDetailsPage.shelters.getEditButton().click();
        SheltersForm.getShelters().should('have.length', 3);
        SheltersForm.getNthShelter(1).within(() => {
          const shelter = SheltersForm.shelters;
          shelter.getDeleteShelterButton().click();
        });

        SheltersForm.getShelters().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (2)'); // 2 instead of 3 since one of those will be deleted.

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        // Add more shelters.
        SheltersForm.getShelters().should('have.length', 2);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (2)');
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        SheltersForm.getShelters().should('have.length', 4);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (4)');
        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().shouldBeVisible();
        ShelterViewCard.getContainers().should('have.length', 4);
        ShelterViewCard.getNthContainer(0).within(() => {
          ShelterViewCard.getShelterNumber().should('have.text', '1');
        });
        ShelterViewCard.getNthContainer(1).within(() => {
          ShelterViewCard.getShelterNumber().should('have.text', '3');
        });
        ShelterViewCard.getNthContainer(2).within(() => {
          ShelterViewCard.getShelterNumber().should('have.text', '4');
        });
        ShelterViewCard.getNthContainer(3).within(() => {
          ShelterViewCard.getShelterNumber().should('have.text', '5');
        });
      });

      it('should be able to add and delete shelters', () => {
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');

        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        // Add more shelters.
        SheltersForm.getShelters().should('have.length', 1);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        StopDetailsPage.shelters.getAddNewShelterButton().click();
        SheltersForm.getShelters().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (3)');

        SheltersForm.getNthShelter(1).within(() => {
          SheltersForm.shelters.getTimetableCabinetsInput().clearAndType('22');
        });

        SheltersForm.getNthShelter(2).within(() => {
          SheltersForm.shelters.getTimetableCabinetsInput().clearAndType('33');
        });

        // Submit.
        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().shouldBeVisible();
        ShelterViewCard.getContainers().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (3)');

        // Delete the 2nd.
        StopDetailsPage.shelters.getEditButton().click();
        SheltersForm.getShelters().should('have.length', 3);
        SheltersForm.getNthShelter(1).within(() => {
          const shelter = SheltersForm.shelters;
          shelter.getDeleteShelterButton().click();
          // Not actually deleted yet, just marked as to be deleted.
          shelter.getShelterExternalIdInput().shouldBeDisabled();
          shelter.getShelterNumberInput().shouldBeDisabled();
          shelter.getShelterTypeDropdownButton().shouldBeDisabled();
          shelter.getShelterElectricityDropdownButton().shouldBeDisabled();
          shelter.getShelterLightingDropdownButton().shouldBeDisabled();
          shelter.getShelterConditionDropdownButton().shouldBeDisabled();
          shelter.getTimetableCabinetsInput().shouldBeDisabled();
          shelter.getTrashCanCheckbox().shouldBeDisabled();
          shelter.getShelterHasDisplayCheckbox().shouldBeDisabled();
          shelter.getBicycleParkingCheckbox().shouldBeDisabled();
          shelter.getLeaningRailCheckbox().shouldBeDisabled();
          shelter.getOutsideBenchCheckbox().shouldBeDisabled();
          shelter.getShelterFasciaBoardTapingCheckbox().shouldBeDisabled();
        });

        // Delete and cancel the deletion of another shelter,
        // to verify that the cancel actually works.
        SheltersForm.getNthShelter(0).within(() => {
          const shelter = SheltersForm.shelters;
          shelter.getDeleteShelterButton().shouldHaveText('Poista katos');
          shelter.getDeleteShelterButton().click();
          shelter.getDeleteShelterButton().shouldHaveText('Peruuta poisto');
          shelter.getShelterTypeDropdownButton().shouldBeDisabled();

          shelter.getDeleteShelterButton().click();
          shelter.getDeleteShelterButton().shouldHaveText('Poista katos');
          shelter.getShelterTypeDropdownButton().should('not.be.disabled');
        });

        SheltersForm.getShelters().should('have.length', 3);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (2)'); // 2 instead of 3 since one of those will be deleted.

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().shouldBeVisible();
        ShelterViewCard.getContainers().should('have.length', 2);
        ShelterViewCard.getNthContainer(0).within(() => {
          ShelterViewCard.getTimetableCabinets().should('have.text', '1');
        });
        ShelterViewCard.getNthContainer(1).within(() => {
          ShelterViewCard.getTimetableCabinets().should('have.text', '33');
        });
      });

      it('should be able to copy shelter', () => {
        // Ensure view
        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        // Ensure default test shelter
        SheltersForm.getShelters().should('have.length', 1);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');

        // Add more shelters.
        SheltersForm.getCopyNewShelterButton().click();
        SheltersForm.getShelters().should('have.length', 2);

        StopDetailsPage.shelters.getSaveButton().click();

        // Check new shelter is saved with same values
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (2)');
        ShelterViewCard.getNthContainer(0).within(() => {
          ShelterViewCard.getTimetableCabinets().should('have.text', '1');
        });
        ShelterViewCard.getNthContainer(1).within(() => {
          ShelterViewCard.getTimetableCabinets().should('have.text', '1');
        });
      });

      it('should be able to delete all shelters', () => {
        StopDetailsPage.shelters.getAddShelterButton().should('not.exist');
        StopDetailsPage.shelters.getEditButton().click();
        ShelterViewCard.getContainers().should('not.exist');

        SheltersForm.getShelters().should('have.length', 1);
        SheltersForm.getNthShelter(0).within(() => {
          SheltersForm.shelters.getDeleteShelterButton().click();
          SheltersForm.shelters
            .getShelterTypeDropdownButton()
            .shouldBeDisabled();
        });

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().should('not.exist');
        StopDetailsPage.shelters
          .getTitle()
          .should('have.text', 'Ei pysäkkikatosta');

        // No shelters left: edit mode will be started with one new shelter.
        StopDetailsPage.shelters.getAddShelterButton().should('be.visible');
        StopDetailsPage.shelters.getAddShelterButton().click();
        ShelterViewCard.getContainers().should('not.exist');
        SheltersForm.getShelters().should('have.length', 1);
        StopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');

        // A newly added, non persisted shelter is deleted immediately.
        SheltersForm.getNthShelter(0).within(() => {
          SheltersForm.shelters.getDeleteShelterButton().click();
        });
        SheltersForm.getShelters().should('not.exist');
        StopDetailsPage.shelters
          .getTitle()
          .should('have.text', 'Ei pysäkkikatosta');
        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        ShelterViewCard.getContainers().should('not.exist');
        StopDetailsPage.shelters
          .getTitle()
          .should('have.text', 'Ei pysäkkikatosta');
      });
    });

    describe('measurements', () => {
      it('should view and edit measurement details', () => {
        verifyInitialMeasurements();

        StopDetailsPage.measurements.getEditButton().click();
        MeasurementsViewCard.getContainer().should('not.exist');

        StopDetailsPage.measurements
          .getAccessibilityLevel()
          .shouldHaveText('Esteellinen');

        // Verify correct initial values:
        MeasurementsForm.getStopTypeDropdownButton().shouldHaveText('Syvennys');
        MeasurementsForm.getCurvedStopDropdownButton().shouldHaveText('Ei');
        MeasurementsForm.getShelterTypeDropdownButton().shouldHaveText('Leveä');
        MeasurementsForm.getShelterLaneDistanceInput().should(
          'have.value',
          '123',
        );
        MeasurementsForm.getCurbBackOfRailDistanceInput().should(
          'have.value',
          '45.6',
        );
        MeasurementsForm.getStopAreaSideSlopeInput().should(
          'have.value',
          '5.3',
        );
        MeasurementsForm.getStopAreaLengthwiseSlopeInput().should(
          'have.value',
          '1.8',
        );

        MeasurementsForm.getStructureLaneDistanceInput().should(
          'have.value',
          '6',
        );
        MeasurementsForm.getStopElevationFromRailTopInput().should(
          'have.value',
          '10',
        );
        MeasurementsForm.getStopElevationFromSidewalkInput().should(
          'have.value',
          '7',
        );
        MeasurementsForm.getLowerCleatHeightInput().should('have.value', '8');

        MeasurementsForm.getPlatformEdgeWarningAreaCheckbox().should(
          'be.checked',
        );
        MeasurementsForm.getSidewalkAccessibleConnectionCheckbox().should(
          'be.checked',
        );
        MeasurementsForm.getGuidanceStripeCheckbox().should('be.checked');
        MeasurementsForm.getServiceAreaStripesCheckbox().should('be.checked');
        MeasurementsForm.getGuidanceTypeDropdownButton().shouldHaveText(
          'Pisteopaste',
        );
        MeasurementsForm.getGuidanceTilesCheckbox().should('be.checked');
        MeasurementsForm.getMapTypeDropdownButton().shouldHaveText(
          'Kohokartta',
        );

        MeasurementsForm.getCurbDriveSideOfRailDistanceInput().should(
          'have.value',
          '5',
        );
        MeasurementsForm.getEndRampSlopeInput().should('have.value', '3.5');
        MeasurementsForm.getServiceAreaWidthInput().should('have.value', '4.6');
        MeasurementsForm.getServiceAreaLengthInput().should(
          'have.value',
          '55.2',
        );
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownButton().shouldHaveText(
          'LR - Luiskattu reunatukiosuus',
        );
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownButton().shouldHaveText(
          'Esteellinen',
        );

        // Change nearly everything and make the stop accessible:
        MeasurementsForm.getStopTypeDropdownButton().click();
        MeasurementsForm.getStopTypeDropdownOptions().contains('Uloke').click();
        MeasurementsForm.getCurvedStopDropdownButton().click();
        MeasurementsForm.getCurvedStopDropdownOptions()
          .contains('Kyllä')
          .click();
        MeasurementsForm.getShelterTypeDropdownButton().click();
        MeasurementsForm.getShelterTypeDropdownOptions()
          .contains('Kapea')
          .click();
        MeasurementsForm.getShelterLaneDistanceInput().clearAndType('231');
        MeasurementsForm.getCurbBackOfRailDistanceInput().clearAndType('111');
        MeasurementsForm.getStopAreaSideSlopeInput().clearAndType('1.1');
        MeasurementsForm.getStopAreaLengthwiseSlopeInput().clearAndType('2.2');

        MeasurementsForm.getStructureLaneDistanceInput().clearAndType('4');
        MeasurementsForm.getStopElevationFromRailTopInput().clearAndType('25');
        MeasurementsForm.getStopElevationFromSidewalkInput().clearAndType('16');
        MeasurementsForm.getLowerCleatHeightInput().clearAndType('7');

        MeasurementsForm.getSidewalkAccessibleConnectionCheckbox().click();
        MeasurementsForm.getGuidanceStripeCheckbox().click();
        MeasurementsForm.getServiceAreaStripesCheckbox().click();
        MeasurementsForm.getGuidanceTypeDropdownButton().click();
        MeasurementsForm.getGuidanceTypeDropdownOptions()
          .contains('Ei opastetta')
          .click();
        MeasurementsForm.getGuidanceTilesCheckbox().click();
        MeasurementsForm.getMapTypeDropdownButton().click();
        MeasurementsForm.getMapTypeDropdownOptions()
          .contains('Muu kartta')
          .click();

        MeasurementsForm.getCurbDriveSideOfRailDistanceInput().clearAndType(
          '8',
        );
        MeasurementsForm.getEndRampSlopeInput().clearAndType('9.9');
        MeasurementsForm.getServiceAreaWidthInput().clearAndType('1.6');
        MeasurementsForm.getServiceAreaLengthInput().clearAndType('12.23');
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownButton().click();
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownOptions()
          .contains('RK4 - Pystysuora reunatukiosuus')
          .click();
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownButton().click();
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownOptions()
          .contains('Esteetön')
          .click();

        // Submit.
        StopDetailsPage.measurements.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
        MeasurementsViewCard.getContainer().shouldBeVisible();

        // Verify changes visible in view card:
        MeasurementsViewCard.getStopType().shouldHaveText('Uloke');
        MeasurementsViewCard.getCurvedStop().shouldHaveText('Kyllä');
        MeasurementsViewCard.getShelterType().shouldHaveText('Kapea');
        MeasurementsViewCard.getShelterLaneDistance().shouldHaveText('231');
        MeasurementsViewCard.getCurbBackOfRailDistance().shouldHaveText('111');
        MeasurementsViewCard.getStopAreaSideSlope().shouldHaveText('1.1');
        MeasurementsViewCard.getStopAreaLengthwiseSlope().shouldHaveText('2.2');

        MeasurementsViewCard.getStructureLaneDistance().shouldHaveText('4');
        MeasurementsViewCard.getStopElevationFromRailTop().shouldHaveText('25');
        MeasurementsViewCard.getStopElevationFromSidewalk().shouldHaveText(
          '16',
        );
        MeasurementsViewCard.getLowerCleatHeight().shouldHaveText('7');

        MeasurementsViewCard.getPlatformEdgeWarningArea().shouldHaveText(
          'Kyllä',
        );
        MeasurementsViewCard.getSidewalkAccessibleConnection().shouldHaveText(
          'Ei',
        );
        MeasurementsViewCard.getGuidanceStripe().shouldHaveText('Ei');
        MeasurementsViewCard.getServiceAreaStripes().shouldHaveText('Ei');
        MeasurementsViewCard.getGuidanceType().shouldHaveText('Ei opastetta');
        MeasurementsViewCard.getGuidanceTiles().shouldHaveText('Ei');
        MeasurementsViewCard.getMapType().shouldHaveText('Muu kartta');

        MeasurementsViewCard.getCurbDriveSideOfRailDistance().shouldHaveText(
          '8',
        );
        MeasurementsViewCard.getEndRampSlope().shouldHaveText('9.9');
        MeasurementsViewCard.getServiceAreaWidth().shouldHaveText('1.6');
        MeasurementsViewCard.getServiceAreaLength().shouldHaveText('12.23');
        MeasurementsViewCard.getPedestrianCrossingRampType().shouldHaveText(
          'RK4 - Pystysuora reunatukiosuus',
        );
        MeasurementsViewCard.getStopAreaSurroundingsAccessible().shouldHaveText(
          'Esteetön',
        );
        StopDetailsPage.measurements
          .getAccessibilityLevel()
          .shouldHaveText('Täysin esteetön');

        StopDetailsPage.headerSummaryRow.accessibleIcon().shouldBeVisible();
      });

      it('should be able to clear measurement fields', () => {
        StopDetailsPage.measurements.getEditButton().click();
        MeasurementsViewCard.getContainer().should('not.exist');
        // Clear all the fields.
        MeasurementsForm.getStopTypeDropdownButton().click();
        MeasurementsForm.getStopTypeDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getCurvedStopDropdownButton().click();
        MeasurementsForm.getCurvedStopDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getShelterTypeDropdownButton().click();
        MeasurementsForm.getShelterTypeDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getShelterLaneDistanceInput().clear();
        MeasurementsForm.getCurbBackOfRailDistanceInput().clear();
        MeasurementsForm.getStopAreaSideSlopeInput().clear();
        MeasurementsForm.getStopAreaLengthwiseSlopeInput().clear();

        MeasurementsForm.getStructureLaneDistanceInput().clear();
        MeasurementsForm.getStopElevationFromRailTopInput().clear();
        MeasurementsForm.getStopElevationFromSidewalkInput().clear();
        MeasurementsForm.getLowerCleatHeightInput().clear();
        MeasurementsForm.getPlatformEdgeWarningAreaCheckbox().click();
        MeasurementsForm.getSidewalkAccessibleConnectionCheckbox().click();
        MeasurementsForm.getGuidanceStripeCheckbox().click();
        MeasurementsForm.getServiceAreaStripesCheckbox().click();
        MeasurementsForm.getGuidanceTypeDropdownButton().click();
        MeasurementsForm.getGuidanceTypeDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getGuidanceTilesCheckbox().click();
        MeasurementsForm.getMapTypeDropdownButton().click();
        MeasurementsForm.getMapTypeDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getCurbDriveSideOfRailDistanceInput().clear();
        MeasurementsForm.getEndRampSlopeInput().clear();
        MeasurementsForm.getServiceAreaWidthInput().clear();
        MeasurementsForm.getServiceAreaLengthInput().clear();
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownButton().click();
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownOptions()
          .contains('Ei tiedossa')
          .click();
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownButton().click();
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownOptions()
          .contains('Ei tiedossa')
          .click();

        // Submit.
        StopDetailsPage.measurements.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
        MeasurementsViewCard.getContainer().shouldBeVisible();

        // Verify changes visible in view card:
        MeasurementsViewCard.getStopType().shouldHaveText('-');
        MeasurementsViewCard.getCurvedStop().shouldHaveText('-');
        MeasurementsViewCard.getShelterType().shouldHaveText('-');
        MeasurementsViewCard.getShelterLaneDistance().shouldHaveText('-');
        MeasurementsViewCard.getCurbBackOfRailDistance().shouldHaveText('-');
        MeasurementsViewCard.getStopAreaSideSlope().shouldHaveText('-');
        MeasurementsViewCard.getStopAreaLengthwiseSlope().shouldHaveText('-');

        MeasurementsViewCard.getStructureLaneDistance().shouldHaveText('-');
        MeasurementsViewCard.getStopElevationFromRailTop().shouldHaveText('-');
        MeasurementsViewCard.getStopElevationFromSidewalk().shouldHaveText('-');
        MeasurementsViewCard.getLowerCleatHeight().shouldHaveText('-');

        MeasurementsViewCard.getPlatformEdgeWarningArea().shouldHaveText('Ei');
        MeasurementsViewCard.getSidewalkAccessibleConnection().shouldHaveText(
          'Ei',
        );
        MeasurementsViewCard.getGuidanceStripe().shouldHaveText('Ei');
        MeasurementsViewCard.getServiceAreaStripes().shouldHaveText('Ei');
        MeasurementsViewCard.getGuidanceType().shouldHaveText('-');
        MeasurementsViewCard.getGuidanceTiles().shouldHaveText('Ei');
        MeasurementsViewCard.getMapType().shouldHaveText('-');

        MeasurementsViewCard.getCurbDriveSideOfRailDistance().shouldHaveText(
          '-',
        );
        MeasurementsViewCard.getEndRampSlope().shouldHaveText('-');
        MeasurementsViewCard.getServiceAreaWidth().shouldHaveText('-');
        MeasurementsViewCard.getServiceAreaLength().shouldHaveText('-');
        MeasurementsViewCard.getPedestrianCrossingRampType().shouldHaveText(
          '-',
        );
        MeasurementsViewCard.getStopAreaSurroundingsAccessible().shouldHaveText(
          '-',
        );

        // Required data missing so can't calculate accessibility level
        StopDetailsPage.measurements
          .getAccessibilityLevel()
          .shouldHaveText('Esteettömyystietoja puuttuu');
      });
    });

    describe('maintenance details', () => {
      it('should view and edit maintainers', () => {
        verifyInitialMaintenanceDetails();

        StopDetailsPage.maintenance.getEditButton().click();
        MaintenanceViewCard.getContainer().should('not.exist');

        // Verify correct initial values:
        MaintenanceDetailsForm.getStopOwnerDropdownButton().shouldHaveText(
          'ELY',
        );

        MaintenanceDetailsForm.getOwner().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getShelterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.getWinterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.getInfoUpkeep().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('-');
        });
        MaintenanceDetailsForm.getCleaning().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // Change everything:
        MaintenanceDetailsForm.getStopOwnerDropdownButton().click();
        MaintenanceDetailsForm.getStopOwnerDropdownOptions()
          .contains('Kunta')
          .click();
        MaintenanceDetailsForm.getOwner().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Clear Channel').click();
        MaintenanceDetailsForm.getShelterMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Clear Channel').click();
        MaintenanceDetailsForm.getMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('JCD').click();
        MaintenanceDetailsForm.getWinterMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();
        MaintenanceDetailsForm.getInfoUpkeep().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('JCD').click();
        MaintenanceDetailsForm.getCleaning().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('ELY-keskus').click();

        // Submit.
        StopDetailsPage.maintenance.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
        MaintenanceViewCard.getContainer().shouldBeVisible();

        // Verify changes visible.
        const maintainerView = MaintenanceViewCard.maintainerViewCard;
        MaintenanceViewCard.getStopOwnerName().shouldHaveText('Kunta');
        MaintenanceViewCard.getOwner().within(() => {
          maintainerView.getName().shouldHaveText('Clear Channel');
          // Verify that details for new maintainer are shown.
          maintainerView.getPhone().shouldHaveText('+358501223334');
          maintainerView.getEmail().shouldHaveText('clear-channel@example.com');
          maintainerView.getNotSelectedPlaceholder().should('not.exist');
        });
        MaintenanceViewCard.getShelterMaintenance().within(() => {
          maintainerView.getName().shouldHaveText('Clear Channel');
          // Verify that details for new maintainer are shown.
          maintainerView.getPhone().shouldHaveText('+358501223334');
          maintainerView.getEmail().shouldHaveText('clear-channel@example.com');
        });
        MaintenanceViewCard.getMaintenance().within(() => {
          maintainerView.getName().shouldHaveText('JCD');
        });
        MaintenanceViewCard.getWinterMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getInfoUpkeep().within(() => {
          maintainerView.getName().shouldHaveText('JCD');
          // Didn't have any maintainer previously, verify that details of new one shown now.
          maintainerView.getPhone().shouldHaveText('+358501234567');
          maintainerView.getEmail().shouldHaveText('jcd@example.com');
          maintainerView.getNotSelectedPlaceholder().should('not.exist');
        });
        MaintenanceViewCard.getCleaning().within(() => {
          maintainerView.getName().shouldHaveText('ELY-keskus');
        });
      });

      it('should clear maintainers', () => {
        verifyInitialMaintenanceDetails();

        StopDetailsPage.maintenance.getEditButton().click();
        MaintenanceViewCard.getContainer().should('not.exist');
        // Verify correct initial values:
        MaintenanceDetailsForm.getStopOwnerDropdownButton().shouldHaveText(
          'ELY',
        );
        MaintenanceDetailsForm.getOwner().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getShelterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.getWinterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.getInfoUpkeep().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('-');
        });
        MaintenanceDetailsForm.getCleaning().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // Change everything:
        MaintenanceDetailsForm.getOwner().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();
        MaintenanceDetailsForm.getShelterMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();
        MaintenanceDetailsForm.getMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();
        MaintenanceDetailsForm.getWinterMaintenance().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();
        MaintenanceDetailsForm.getCleaning().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Ei toimijaa').click();

        // Submit.
        StopDetailsPage.maintenance.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
        MaintenanceViewCard.getContainer().shouldBeVisible();

        // Verify changes visible.
        const maintainerView = MaintenanceViewCard.maintainerViewCard;
        MaintenanceViewCard.getStopOwnerName().shouldHaveText('ELY');
        MaintenanceViewCard.getOwner().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getShelterMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getWinterMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getInfoUpkeep().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        MaintenanceViewCard.getCleaning().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
      });

      it('should edit maintainer organisation details', () => {
        StopDetailsPage.maintenance.getEditButton().click();
        MaintenanceViewCard.getContainer().should('not.exist');

        MaintenanceDetailsForm.organisationDetailsModal
          .getModal()
          .should('not.exist');
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields.getEditOrganisationButton().click();
        });
        MaintenanceDetailsForm.organisationDetailsModal
          .getModal()
          .should('exist');
        MaintenanceDetailsForm.organisationDetailsModal
          .getTitle()
          .shouldHaveText('Muokkaa toimijan tietoja');

        const organisationForm =
          MaintenanceDetailsForm.organisationDetailsModal.form;
        // Verify initial values.
        organisationForm.getName().should('have.value', 'ELY-keskus');
        organisationForm.getPhone().should('have.value', '+358501234567');
        organisationForm
          .getEmail()
          .should('have.value', 'ely-keskus@example.com');
        // Change everything and submit.
        organisationForm.getName().clearAndType('Uusi Nimi');
        organisationForm.getPhone().clearAndType('+358507777777');
        organisationForm.getEmail().clearAndType('uusi@example.com');
        organisationForm.getSaveButton().click();
        MaintenanceDetailsForm.organisationDetailsModal
          .getModal()
          .should('not.exist');

        // Verify changes visible to this maintainer.
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Uusi Nimi');
          MaintenanceDetailsForm.fields
            .getPhone()
            .shouldHaveText('+358507777777');
          MaintenanceDetailsForm.fields
            .getEmail()
            .shouldHaveText('uusi@example.com');
        });
        // Also updated to other maintainers with this same organisation.
        MaintenanceDetailsForm.getWinterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Uusi Nimi');
          MaintenanceDetailsForm.fields
            .getPhone()
            .shouldHaveText('+358507777777');
          MaintenanceDetailsForm.fields
            .getEmail()
            .shouldHaveText('uusi@example.com');
        });

        // Cancel editing maintainers.
        StopDetailsPage.maintenance.getCancelButton().click();
        MaintenanceViewCard.getContainer().shouldBeVisible();

        // The edited organisation details should have still been persisted.
        MaintenanceViewCard.getMaintenance().within(() => {
          MaintenanceViewCard.maintainerViewCard
            .getName()
            .shouldHaveText('Uusi Nimi');
          MaintenanceViewCard.maintainerViewCard
            .getPhone()
            .shouldHaveText('+358507777777');
          MaintenanceViewCard.maintainerViewCard
            .getEmail()
            .shouldHaveText('uusi@example.com');
        });
      });

      it('should create new organisation and use it as maintainer', () => {
        StopDetailsPage.maintenance.getEditButton().click();
        MaintenanceViewCard.getContainer().should('not.exist');

        // Start creating new organisation.
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            cy.get('[role="option"]').contains('Lisää uusi toimija').click(),
          );
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.organisationDetailsModal
          .getModal()
          .should('exist');
        MaintenanceDetailsForm.organisationDetailsModal
          .getTitle()
          .shouldHaveText('Lisää uusi toimija');

        // Fill organisation details and save.
        const organisationForm =
          MaintenanceDetailsForm.organisationDetailsModal.form;
        organisationForm.getName().clearAndType('Uusi Toimija');
        organisationForm.getPhone().clearAndType('+358507777777');
        organisationForm.getEmail().clearAndType('uusi@example.com');
        organisationForm.getSaveButton().click();
        MaintenanceDetailsForm.organisationDetailsModal
          .getModal()
          .should('not.exist');

        // The new organisation is automatically selected as maintainer for which it was created.
        MaintenanceDetailsForm.getMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Uusi Toimija');
          MaintenanceDetailsForm.fields
            .getPhone()
            .shouldHaveText('+358507777777');
          MaintenanceDetailsForm.fields
            .getEmail()
            .shouldHaveText('uusi@example.com');
        });
        // Other maintainers not affected though.
        MaintenanceDetailsForm.getStopOwnerDropdownButton().shouldHaveText(
          'ELY',
        );
        MaintenanceDetailsForm.getOwner().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getShelterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('JCD');
        });
        MaintenanceDetailsForm.getWinterMaintenance().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        MaintenanceDetailsForm.getInfoUpkeep().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('-');
        });
        MaintenanceDetailsForm.getCleaning().within(() => {
          MaintenanceDetailsForm.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // New maintainer would be visible for other maintainers too.
        MaintenanceDetailsForm.getInfoUpkeep().within(() =>
          MaintenanceDetailsForm.fields.getMaintainerDropdownButton().click(),
        );
        cy.get('[role="option"]').contains('Uusi Toimija').shouldBeVisible();
        cy.closeDropdown();

        // Persist maintainers and check view.
        StopDetailsPage.maintenance.getSaveButton().click();
        MaintenanceViewCard.getContainer().shouldBeVisible();
        MaintenanceViewCard.getMaintenance().within(() => {
          MaintenanceViewCard.maintainerViewCard
            .getName()
            .shouldHaveText('Uusi Toimija');
        });
      });
    });
  });

  describe('info spot details', () => {
    beforeEach(() => {
      StopDetailsPage.visit('V1562');
      StopDetailsPage.page().shouldBeVisible();
      StopDetailsPage.titleRow.label().shouldHaveText('V1562');

      StopDetailsPage.infoSpotsTabButton().click();

      StopDetailsPage.infoSpotsTabPanel().should('be.visible');
      StopDetailsPage.technicalFeaturesTabPanel().should('not.exist');
      StopDetailsPage.basicDetailsTabPanel().should('not.exist');

      InfoSpotViewCard.getSectionContainers().shouldBeVisible();
    });

    it('should view and edit info spot details', {}, () => {
      verifyInitialInfoSpots();

      const infoSpot = InfoSpotsForm.infoSpots;

      // Edit info spot
      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotViewCard.getSectionContainers().should('not.exist');

        infoSpot
          .getDescription()
          .should('have.value', 'Ensimmäinen kerros, portaiden vieressä');
        infoSpot.getLabel().should('have.value', 'JP1234568');
        infoSpot.getPurposeButton().should('have.text', 'Tiedotteet');
        infoSpot.getBacklightButton().should('have.text', 'Kyllä');
        infoSpot.getSizeSelectorButton().should('have.text', '80 × 120 cm');
        infoSpot.getFloor().should('have.value', '1');
        infoSpot.getRailInformation().should('have.value', '7');
        infoSpot.getZoneLabel().should('have.value', 'A');
        infoSpot.getNthPosterContainer(0).within(() => {
          infoSpot
            .getSizeSelectorButton()
            .should('have.text', 'A4 (21.0 × 29.7 cm)');
          infoSpot.getPosterLabel().should('have.value', 'PT1234');
          infoSpot.getPosterLines().should('have.value', '1, 6, 17');
        });
        infoSpot.getNoPostersLabel().should('not.exist');

        // Change everything
        infoSpot.getLabel().clearAndType('IP98765432');
        infoSpot.getPurposeButton().click();
        cy.withinHeadlessPortal(() =>
          infoSpot.getPurposeOptions().contains('Muu käyttötarkoitus').click(),
        );
        infoSpot.getPurposeCustom().shouldBeVisible();
        infoSpot.getPurposeCustom().clearAndType('Custom käyttötarkoitus');
        infoSpot.getSizeSelectorButton().click();
        cy.withinHeadlessPortal(() =>
          infoSpot
            .getSizeSelectorOptions()
            .contains('A4 (21.0 × 29.7 cm)')
            .click(),
        );
        infoSpot.getBacklightButton().click();
        cy.withinHeadlessPortal(() =>
          infoSpot.getBacklightOptions().contains('Ei').click(),
        );
        infoSpot.getDescription().clearAndType('Infopaikan uusi kuvaus');
        infoSpot.getZoneLabel().clearAndType('B');
        infoSpot.getRailInformation().clearAndType('8');
        infoSpot.getFloor().clearAndType('2');
        infoSpot.getNthPosterContainer(0).within(() => {
          infoSpot.getPosterLabel().clearAndType('PT1235');
          infoSpot.getSizeSelectorButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpot
              .getSizeSelectorOptions()
              .contains('A3 (29.7 × 42.0 cm)')
              .click(),
          );
          infoSpot.getPosterLines().clearAndType('2, 7, 18');
        });
      });

      // Submit.
      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      InfoSpotViewCard.getSectionContainers().shouldBeVisible();

      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        InfoSpotViewCard.getDescription().shouldHaveText(
          'Infopaikan uusi kuvaus',
        );
        InfoSpotViewCard.getLabel().shouldHaveText('IP98765432');
        InfoSpotViewCard.getPurpose().shouldHaveText('Custom käyttötarkoitus');
        InfoSpotViewCard.getBacklight().shouldHaveText('Ei');
        InfoSpotViewCard.getSize().shouldHaveText('A4 (21.0 × 29.7 cm)');
        InfoSpotViewCard.getFloor().shouldHaveText('2');
        InfoSpotViewCard.getRailInformation().shouldHaveText('8');
        InfoSpotViewCard.getZoneLabel().shouldHaveText('B');
        InfoSpotViewCard.getNthPosterContainer(0).within(() => {
          InfoSpotViewCard.getPosterSize().shouldHaveText(
            'A3 (29.7 × 42.0 cm)',
          );
          InfoSpotViewCard.getPosterLabel().shouldHaveText('PT1235');
          InfoSpotViewCard.getPosterLines().shouldHaveText('2, 7, 18');
        });
        InfoSpotViewCard.getNoPosters().should('not.exist');
      });

      // Edit second info spot
      InfoSpotViewCard.getNthSectionContainer(1).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotViewCard.getSectionContainers().should('not.exist');

        infoSpot
          .getDescription()
          .should('have.value', 'Ensimmäinen kerros, portaiden takana');
        infoSpot.getLabel().should('have.value', 'JP1234567');
        infoSpot.getPurposeButton().should('have.text', 'Dynaaminen näyttö');
        infoSpot.getFloor().should('have.value', '1');
        infoSpot.getRailInformation().should('have.value', '8');
        infoSpot.getZoneLabel().should('have.value', 'B');
        infoSpot.getNoPostersLabel().shouldHaveText('Ei infotuotetta');

        // Change everything
        infoSpot.getLabel().clearAndType('IP2345678');
        infoSpot.getPurposeButton().click();
        cy.withinHeadlessPortal(() =>
          infoSpot.getPurposeOptions().contains('Pysäkkijuliste').click(),
        );
        infoSpot.getPurposeCustom().should('not.exist');
        infoSpot.getDescription().clearAndType('Dynaaminen kuvaus');
        infoSpot.getZoneLabel().clearAndType('C');
        infoSpot.getRailInformation().clearAndType('9');
        infoSpot.getFloor().clearAndType('2');
      });

      // Submit.
      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      InfoSpotViewCard.getSectionContainers().shouldBeVisible();

      InfoSpotViewCard.getNthSectionContainer(1).within(() => {
        InfoSpotViewCard.getDescription().shouldHaveText('Dynaaminen kuvaus');
        InfoSpotViewCard.getLabel().shouldHaveText('IP2345678');
        InfoSpotViewCard.getPurpose().shouldHaveText('Pysäkkijuliste');
        InfoSpotViewCard.getBacklight().shouldHaveText('-');
        InfoSpotViewCard.getSize().shouldHaveText('-');
        InfoSpotViewCard.getLatitude().shouldHaveText('60.16490775');
        InfoSpotViewCard.getLongitude().shouldHaveText('24.92904198');
        InfoSpotViewCard.getFloor().shouldHaveText('2');
        InfoSpotViewCard.getRailInformation().shouldHaveText('9');
        InfoSpotViewCard.getStops().shouldHaveText('V1562');
        InfoSpotViewCard.getTerminals().shouldHaveText('-');
        InfoSpotViewCard.getZoneLabel().shouldHaveText('C');
        InfoSpotViewCard.getNoPosters().shouldHaveText('Ei infotuotetta');
      });
    });

    it('should be able to add and delete info spots and posters', () => {
      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotViewCard.getSectionContainers().should('not.exist');

        // Add more infoSpots.
        InfoSpotsForm.getInfoSpots().should('have.length', 1);
        StopDetailsPage.infoSpots.getAddNewInfoSpotButton().click();
        InfoSpotsForm.getInfoSpots().should('have.length', 2);

        const infoSpot = InfoSpotsForm.infoSpots;
        InfoSpotsForm.getNthInfoSpot(0).within(() => {
          infoSpot
            .getDeleteInfoSpotButton()
            .shouldHaveText('Poista infopaikka');
          infoSpot.getDeleteInfoSpotButton().click();
          infoSpot.getDeleteInfoSpotButton().shouldHaveText('Peruuta poisto');
          infoSpot.getDeleteInfoSpotButton().click();
          infoSpot
            .getDeleteInfoSpotButton()
            .shouldHaveText('Poista infopaikka');
          infoSpot.getDeleteInfoSpotButton().click();
          infoSpot.getDeleteInfoSpotButton().shouldHaveText('Peruuta poisto');
        });

        InfoSpotsForm.getNthInfoSpot(1).within(() => {
          infoSpot
            .getDeleteInfoSpotButton()
            .shouldHaveText('Poista infopaikka');
          infoSpot.getDeleteInfoSpotButton().click();
        });
      });

      // Submit.
      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      InfoSpotViewCard.getSectionContainers().shouldBeVisible();

      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getTitle().contains('Ei infopaikkoja');
      });

      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getAddNewButton().click();
        InfoSpotViewCard.getSectionContainers().should('not.exist');

        InfoSpotsForm.getInfoSpots().should('have.length', 1);

        const infoSpot = InfoSpotsForm.infoSpots;
        InfoSpotsForm.getNthInfoSpot(0).within(() => {
          infoSpot.getLabel().clearAndType('IP123');
          infoSpot.getPurposeButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpot.getPurposeOptions().contains('Kartta').click(),
          );
          infoSpot.getDescription().clearAndType('Dynaamisen kuvaus');
          infoSpot.getZoneLabel().clearAndType('A');
          infoSpot.getRailInformation().clearAndType('1');
          infoSpot.getFloor().clearAndType('3');
          infoSpot.getNoPostersLabel().shouldHaveText('Ei infotuotetta');
        });

        StopDetailsPage.infoSpots.getAddNewInfoSpotButton().click();
        InfoSpotsForm.getInfoSpots().should('have.length', 2);

        InfoSpotsForm.getNthInfoSpot(1).within(() => {
          infoSpot.getLabel().clearAndType('IP125');
          infoSpot.getPurposeButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpot.getPurposeOptions().contains('Lähialuekartta').click(),
          );
          infoSpot.getSizeSelectorButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpot
              .getSizeSelectorOptions()
              .contains('A3 (29.7 × 42.0 cm)')
              .click(),
          );
          infoSpot.getBacklightButton().click();
          cy.withinHeadlessPortal(() =>
            infoSpot.getBacklightOptions().contains('Kyllä').click(),
          );
          infoSpot.getDescription().clearAndType('Staattisen kuvaus');
          infoSpot.getAddPosterButton().click();
          infoSpot.getNthPosterContainer(0).within(() => {
            infoSpot.getPosterLabel().clearAndType('PT1236');
            infoSpot.getSizeSelectorButton().click();
            cy.withinHeadlessPortal(() =>
              infoSpot
                .getSizeSelectorOptions()
                .contains('A3 (29.7 × 42.0 cm)')
                .click(),
            );
            infoSpot.getPosterLines().clearAndType('2, 7, 1');
          });
          infoSpot.getAddPosterButton().click();
          infoSpot.getNthPosterContainer(1).within(() => {
            infoSpot.getPosterLabel().clearAndType('PT1237');
            infoSpot.getSizeSelectorButton().click();
            cy.withinHeadlessPortal(() =>
              infoSpot
                .getSizeSelectorOptions()
                .contains('A4 (21.0 × 29.7 cm)')
                .click(),
            );
            infoSpot.getPosterLines().clearAndType('2');
          });
          infoSpot.getZoneLabel().clearAndType('A');
          infoSpot.getRailInformation().clearAndType('7');
          infoSpot.getFloor().clearAndType('2');
          infoSpot.getNoPostersLabel().should('not.exist');
        });
      });

      // Submit.
      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      InfoSpotViewCard.getSectionContainers().shouldBeVisible();
      StopDetailsPage.infoSpots.getTitle().contains('Infopaikat');

      InfoSpotViewCard.getNthViewCardContainer(0).within(() => {
        InfoSpotViewCard.getDescription().shouldHaveText('Dynaamisen kuvaus');
        InfoSpotViewCard.getLabel().shouldHaveText('IP123');
        InfoSpotViewCard.getPurpose().shouldHaveText('Kartta');
        InfoSpotViewCard.getLatitude().shouldHaveText('60.16490775');
        InfoSpotViewCard.getLongitude().shouldHaveText('24.92904198');
        InfoSpotViewCard.getFloor().shouldHaveText('3');
        InfoSpotViewCard.getRailInformation().shouldHaveText('1');
        InfoSpotViewCard.getStops().shouldHaveText('V1562');
        InfoSpotViewCard.getTerminals().shouldHaveText('-');
        InfoSpotViewCard.getZoneLabel().shouldHaveText('A');
        InfoSpotViewCard.getNoPosters().shouldHaveText('Ei infotuotetta');
      });

      InfoSpotViewCard.getNthViewCardContainer(1).within(() => {
        InfoSpotViewCard.getDescription().shouldHaveText('Staattisen kuvaus');
        InfoSpotViewCard.getLabel().shouldHaveText('IP125');
        InfoSpotViewCard.getBacklight().shouldHaveText('Kyllä');
        InfoSpotViewCard.getSize().shouldHaveText('A3 (29.7 × 42.0 cm)');
        InfoSpotViewCard.getNthPosterContainer(1).within(() => {
          InfoSpotViewCard.getPosterSize().shouldHaveText(
            'A4 (21.0 × 29.7 cm)',
          );
          InfoSpotViewCard.getPosterLabel().shouldHaveText('PT1237');
          InfoSpotViewCard.getPosterLines().shouldHaveText('2');
        });
        InfoSpotViewCard.getNthPosterContainer(0).within(() => {
          InfoSpotViewCard.getPosterSize().shouldHaveText(
            'A3 (29.7 × 42.0 cm)',
          );
          InfoSpotViewCard.getPosterLabel().shouldHaveText('PT1236');
          InfoSpotViewCard.getPosterLines().shouldHaveText('2, 7, 1');
        });
        InfoSpotViewCard.getPurpose().shouldHaveText('Lähialuekartta');
        InfoSpotViewCard.getLatitude().shouldHaveText('60.16490775');
        InfoSpotViewCard.getLongitude().shouldHaveText('24.92904198');
        InfoSpotViewCard.getFloor().shouldHaveText('2');
        InfoSpotViewCard.getRailInformation().shouldHaveText('7');
        InfoSpotViewCard.getStops().shouldHaveText('V1562');
        InfoSpotViewCard.getTerminals().shouldHaveText('-');
        InfoSpotViewCard.getZoneLabel().shouldHaveText('A');
        InfoSpotViewCard.getNoPosters().should('not.exist');
      });

      // Delete poster
      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotViewCard.getSectionContainers().should('not.exist');

        const infoSpot = InfoSpotsForm.infoSpots;
        InfoSpotsForm.getNthInfoSpot(1).within(() => {
          infoSpot.getLabel().should('have.value', 'IP125');
          infoSpot.getPurposeButton().should('have.text', 'Lähialuekartta');
          infoSpot
            .getSizeSelectorButton()
            .should('have.text', 'A3 (29.7 × 42.0 cm)');
          infoSpot.getBacklightButton().should('have.text', 'Kyllä');
          infoSpot.getDescription().should('have.value', 'Staattisen kuvaus');
          infoSpot.getNthPosterContainer(0).within(() => {
            infoSpot.getPosterLabel().should('have.value', 'PT1236');
            infoSpot
              .getSizeSelectorButton()
              .should('have.text', 'A3 (29.7 × 42.0 cm)');
            infoSpot.getPosterLines().should('have.value', '2, 7, 1');
          });
          infoSpot.getNthPosterContainer(1).within(() => {
            infoSpot.getPosterLabel().should('have.value', 'PT1237');
            infoSpot
              .getSizeSelectorButton()
              .should('have.text', 'A4 (21.0 × 29.7 cm)');
            infoSpot.getPosterLines().should('have.value', '2');
          });
          infoSpot.getZoneLabel().should('have.value', 'A');
          infoSpot.getRailInformation().should('have.value', '7');
          infoSpot.getFloor().should('have.value', '2');

          // Delete poster
          infoSpot.getNthPosterContainer(1).within(() => {
            infoSpot.getDeletePosterButton().shouldHaveText('Poista infotuote');
            infoSpot.getDeletePosterButton().click();
            infoSpot.getDeletePosterButton().shouldHaveText('Peruuta poisto');
            infoSpot.getDeletePosterButton().click();
            infoSpot.getDeletePosterButton().shouldHaveText('Poista infotuote');
            infoSpot.getDeletePosterButton().click();
            infoSpot.getDeletePosterButton().shouldHaveText('Peruuta poisto');
          });
        });
      });

      // Submit.
      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');
      InfoSpotViewCard.getSectionContainers().shouldBeVisible();

      InfoSpotViewCard.getNthViewCardContainer(1).within(() => {
        InfoSpotViewCard.getDescription().shouldHaveText('Staattisen kuvaus');
        InfoSpotViewCard.getLabel().shouldHaveText('IP125');
        InfoSpotViewCard.getBacklight().shouldHaveText('Kyllä');
        InfoSpotViewCard.getSize().shouldHaveText('A3 (29.7 × 42.0 cm)');
        InfoSpotViewCard.getNthPosterContainer(0).within(() => {
          InfoSpotViewCard.getPosterSize().shouldHaveText(
            'A3 (29.7 × 42.0 cm)',
          );
          InfoSpotViewCard.getPosterLabel().shouldHaveText('PT1236');
          InfoSpotViewCard.getPosterLines().shouldHaveText('2, 7, 1');
        });
        InfoSpotViewCard.getPurpose().shouldHaveText('Lähialuekartta');
        InfoSpotViewCard.getLatitude().shouldHaveText('60.16490775');
        InfoSpotViewCard.getLongitude().shouldHaveText('24.92904198');
        InfoSpotViewCard.getFloor().shouldHaveText('2');
        InfoSpotViewCard.getRailInformation().shouldHaveText('7');
        InfoSpotViewCard.getStops().shouldHaveText('V1562');
        InfoSpotViewCard.getTerminals().shouldHaveText('-');
        InfoSpotViewCard.getZoneLabel().shouldHaveText('A');
      });
    });

    it('should allow entering manual spot & poster sizes', () => {
      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotsForm.getNthInfoSpot(0).within(() => {
          InfoSpotsForm.infoSpots.getSizeSelectorButton().click();
          cy.withinHeadlessPortal(() =>
            InfoSpotsForm.infoSpots
              .getSizeSelectorOptions()
              .contains('Syötä mitat')
              .click(),
          );
          InfoSpotsForm.infoSpots.getSizeWidth().clearAndType('176');
          InfoSpotsForm.infoSpots.getSizeHeight().clearAndType('250');
        });
      });

      StopDetailsPage.infoSpots.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');

      InfoSpotViewCard.getNthSectionContainer(0).within(() => {
        StopDetailsPage.infoSpots.getEditButton().click();
        InfoSpotsForm.getNthInfoSpot(0).within(() => {
          InfoSpotsForm.infoSpots.getAddPosterButton().click();
          InfoSpotsForm.infoSpots.getNthPosterContainer(0).within(() => {
            InfoSpotsForm.infoSpots.getSizeSelectorButton().click();
            cy.withinHeadlessPortal(() => {
              const getOption = (index: number) =>
                InfoSpotsForm.infoSpots
                  .getSizeSelectorOptions()
                  .get('[role="option"]')
                  .eq(index);

              getOption(0).contains('80 × 120 cm');
              getOption(1).contains('A3 (29.7 × 42.0 cm)');
              getOption(2).contains('A4 (21.0 × 29.7 cm)');
              getOption(3).contains('Ei tiedossa');
              getOption(4).contains('Syötä mitat');
              getOption(5).contains('B5 (17.6 × 25.0 cm)');
            });
          });
        });
      });
    });

    it('should show info text when there are no shelters', () => {
      // First, delete all existing shelters
      StopDetailsPage.technicalFeaturesTabButton().click();
      StopDetailsPage.shelters.getEditButton().click();
      StopDetailsPage.shelters.viewCard.getContainers().should('not.exist');

      StopDetailsPage.shelters.form.getShelters().each((_shelter, index) => {
        StopDetailsPage.shelters.form.getNthShelter(index).within(() => {
          StopDetailsPage.shelters.form.shelters
            .getDeleteShelterButton()
            .click();
          StopDetailsPage.shelters.form.shelters
            .getShelterTypeDropdownButton()
            .shouldBeDisabled();
        });
      });

      StopDetailsPage.shelters.getSaveButton().click();
      Toast.expectSuccessToast('Pysäkki muokattu');

      StopDetailsPage.shelters.viewCard.getContainers().should('not.exist');
      StopDetailsPage.shelters
        .getTitle()
        .should('have.text', 'Ei pysäkkikatosta');

      StopDetailsPage.infoSpotsTabButton().click();

      StopDetailsPage.infoSpots.getNoSheltersInfoText().should('be.visible');
      StopDetailsPage.infoSpots
        .getNoSheltersInfoText()
        .should(
          'contain.text',
          'Ei infopaikkoja. Mene Tekniset ominaisuudet -välilehdelle ja lisää ensin katostyyppi.',
        );
    });
  });

  describe('version and copies', () => {
    type ValidityPeriodValidationTestData = {
      readonly startDate: string;
      readonly endDate: string | undefined;
      readonly indefinite: boolean;
      readonly expectedError: string | null;
    };

    const validityPeriodValidationTests: ReadonlyArray<ValidityPeriodValidationTestData> =
      [
        {
          startDate: DateTime.now().minus({ day: 1 }).toISODate(),
          endDate: undefined,
          indefinite: true,
          expectedError: 'Voimassaolo ei voi alkaa menneisyydestä',
        },
        {
          startDate: '2050-06-02',
          endDate: '2050-06-01',
          indefinite: false,
          expectedError: 'Alkupäivämäärän pitää tulla ennen loppupäivämäärää.',
        },
        {
          startDate: '2050-06-01',
          endDate: undefined,
          indefinite: false,
          expectedError:
            'Päättymispäivämäärän pitää olla syötetty tai pysäkin tulee olla voimassa toistaiseksi',
        },
        {
          startDate: '2050-05-31',
          endDate: undefined,
          indefinite: true,
          expectedError:
            'Pysäkistä on olemassa jo toinen versio aikavälillä 20.3.2020-31.5.2050',
        },
        {
          startDate: '2050-06-01',
          endDate: undefined,
          indefinite: true,
          expectedError: null,
        },
      ];

    function testValidityPeriodValidation() {
      const form = StopVersionForm;
      validityPeriodValidationTests.forEach(
        ({ startDate, endDate, indefinite, expectedError }) => {
          form.validity.setStartDate(startDate);

          // I wish this was easier 🤦🏻‍♂️
          // Make sure end date field is visible
          form.validity.setAsIndefinite(false);
          // Make sure it is empty
          form.validity.getEndDateInput().clear();
          // Do magic, also touches indefinite field
          form.validity.setEndDate(endDate);
          // Set indefinite field to proper test value
          form.validity.setAsIndefinite(indefinite);

          if (expectedError) {
            form.validityError().shouldHaveText(expectedError);
          } else {
            form.validityError().should('not.exist');
          }
        },
      );
    }

    function createCopyForVersionTesting(
      reasonForChange: string,
      validityStartISODate: string,
      validityEndISODate?: string,
      priority?: Priority,
    ) {
      StopDetailsPage.titleRow.actionsMenuButton().click();
      StopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = StopDetailsPage;
      const { form } = copyModal;

      copyModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType(reasonForChange);

          if (priority) {
            form.priority.setPriority(priority);
          }

          form.validity.fillForm({
            validityStartISODate,
            validityEndISODate: validityEndISODate ?? undefined,
          });

          if (!validityEndISODate) {
            form.validity.setAsIndefinite(true);
          } else {
            form.validity.setAsIndefinite(false);
          }

          form.submitButton().click();
        });

      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
    }

    it('should create a copy', () => {
      StopDetailsPage.visit('H2003');

      StopDetailsPage.titleRow.actionsMenuButton().click();
      StopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = StopDetailsPage;
      copyModal
        .modal()
        .should('exist')
        .within(() => {
          copyModal
            .names()
            .should('contain.text', 'H2003')
            .and('contain.text', 'Pohjoisesplanadi')
            .and('contain.text', 'Norraesplanaden');

          copyModal
            .validity()
            .should('contain.text', 'Perusversio')
            .and('contain.text', '20.3.2020-31.5.2050');

          const { form } = copyModal;

          testValidityPeriodValidation();

          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Uusi versio');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({ validityStartISODate: '2050-06-01' });
          form.submitButton().click();
        });

      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');

      StopDetailsPage.validityPeriod().shouldHaveText('1.6.2050-');

      verifyInitialBasicDetails();
      verifyInitialLocationDetails();
      verifyInitialSignageDetails();
      verifyInitialExternalLinks();

      StopDetailsPage.technicalFeaturesTabButton().click();
      verifyInitialShelters();
      verifyInitialMeasurements();
      verifyInitialMaintenanceDetails();

      StopDetailsPage.infoSpotsTabButton().click();

      StopDetailsPage.infoSpots.viewCard
        .getNthSectionContainer(0)
        .within(() => {
          verifyInfoSpotJP1234568({
            lat: '60.16600322',
            lon: '24.93207242',
            stops: 'H2003',
          });
        });
    });

    it('should allow opening a specified priority version', () => {
      // Create Temp Version
      StopDetailsPage.visit('H2003');
      StopDetailsPage.titleRow.actionsMenuButton().click();
      StopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = StopDetailsPage;
      const { form } = copyModal;

      copyModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Temp version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({ validityStartISODate: '2020-03-20' });
          form.submitButton().click();
        });

      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-');

      // Create Draft Version
      StopDetailsPage.visit('H2003');
      StopDetailsPage.titleRow.actionsMenuButton().click();
      StopDetailsPage.titleRow.actionsMenuCopyButton().click();

      copyModal.modal().within(() => {
        form.reasonForChange
          .getReasonForChangeInput()
          .clearAndType('Draft version');
        form.priority.setPriority(Priority.Draft);
        form.validity.fillForm({
          validityStartISODate: '2020-03-20',
          validityEndISODate: '2020-04-01',
        });
        form.submitButton().click();
      });

      Toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-1.4.2020');

      // Reopen Temp version
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2020-03-20&priority=20`,
      );
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-');

      // Returning to date based versioning should keep the Temp version and
      // not show the Draft version.
      StopDetailsPage.returnToDateBasedVersionSelection()
        .shouldBeVisible()
        .click();
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-');
    });

    it('should modify a version without overlap', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      StopDetailsPage.titleRow.label().shouldHaveText('H2003');
      StopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');

      StopDetailsPage.editStopValidityButton().click();
      const { editStopModal } = StopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Shorter version');
          form.priority.setPriority(Priority.Standard);
          form.validity.fillForm({
            validityStartISODate: '2020-03-20',
            validityEndISODate: '2030-05-31',
          });
          form.submitButton().click();
        });

      Toast.expectSuccessToast('Versio muokattu');
      EditStopModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2030');

      StopDetailsPage.editStopValidityButton().click();
      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Longer version');
          form.priority.setPriority(Priority.Standard);
          form.validity.fillForm({
            validityStartISODate: '2020-03-20',
            validityEndISODate: undefined,
          });
          form.submitButton().click();
        });

      Toast.expectSuccessToast('Versio muokattu');
      EditStopModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '20.3.2020-');
    });

    it('should change priority', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      StopDetailsPage.titleRow.label().shouldHaveText('H2003');

      createCopyForVersionTesting(
        'Draft version',
        '2030-01-01',
        '2030-01-31',
        Priority.Draft,
      );
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      StopDetailsPage.editStopValidityButton().click();
      const { editStopModal } = StopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Temporary version');
          form.priority.setPriority(Priority.Temporary);
          form.submitButton().click();
        });

      Toast.expectSuccessToast('Versio muokattu');
      EditStopModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      // Check that priority has changed
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=30`,
      );
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.page().should(
        'contain',
        'Pysäkki ei ole voimassa valittuna päivänä.',
      );

      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=20`,
      );
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');
    });

    it('should change priority and cut overlap', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      StopDetailsPage.titleRow.label().shouldHaveText('H2003');

      createCopyForVersionTesting(
        'Temporary version',
        '2030-02-01',
        '2030-03-10',
        Priority.Temporary,
      );
      createCopyForVersionTesting(
        'Draft version',
        '2030-01-01',
        '2030-01-31',
        Priority.Draft,
      );
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      StopDetailsPage.editStopValidityButton().click();
      const { editStopModal } = StopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Temporary version with overlap');
          form.validity.fillForm({
            validityStartISODate: '2030-01-01',
            validityEndISODate: '2030-02-28',
          });
          form.priority.setPriority(Priority.Temporary);
          form.submitButton().click();
        });

      // Validate cut confirmation modal
      const { overlappingCutConfirmationModal } = StopDetailsPage;
      const { confirmationModal } = overlappingCutConfirmationModal;

      overlappingCutConfirmationModal
        .modal()
        .should('exist')
        .within(() => {
          overlappingCutConfirmationModal
            .currentVersion()
            .should('contain', '01.02.2030 - 10.03.2030');
          overlappingCutConfirmationModal
            .newVersion()
            .should('contain', '01.01.2030 - 28.02.2030');
          overlappingCutConfirmationModal
            .cutDate()
            .should('contain', '01.03.2030');

          confirmationModal.getConfirmButton().click();
        });

      Toast.expectSuccessToast('Versio muokattu');
      EditStopModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-28.2.2030');

      // Check that priority has changed
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=30`,
      );
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.page().should(
        'contain',
        'Pysäkki ei ole voimassa valittuna päivänä.',
      );

      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=20`,
      );
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '1.1.2030-28.2.2030');
    });

    it('should not allow cut validity when overlapping whole version', () => {
      // Insert two versions with temporary priority
      StopDetailsPage.visit('H2003');

      createCopyForVersionTesting(
        'Temp version #1',
        '2030-03-18',
        '2030-03-19',
        Priority.Temporary,
      );
      createCopyForVersionTesting(
        'Temp version #2',
        '2030-03-20',
        '2030-03-25',
        Priority.Temporary,
      );

      // Modify temp version #2 to overlap with temp version #1
      StopDetailsPage.editStopValidityButton().click();
      const { editStopModal } = StopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Overlapping version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({
            validityStartISODate: '2030-03-15',
            validityEndISODate: '2030-03-25',
          });

          form.submitButton().click();
        });

      Toast.expectDangerToast('Päällekkäisen version leikkaaminen ei onnistu.');
    });

    it('should modify a version with overlapping validity period', () => {
      // Insert two versions with temporary priority
      StopDetailsPage.visit('H2003');

      createCopyForVersionTesting(
        'Temp version #1',
        '2030-03-10',
        '2030-03-19',
        Priority.Temporary,
      );

      createCopyForVersionTesting(
        'Temp version #2',
        '2030-03-20',
        '2030-03-25',
        Priority.Temporary,
      );

      // Modify temp version #2 to overlap with temp version #1
      StopDetailsPage.editStopValidityButton().click();
      const { editStopModal } = StopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.reasonForChange
            .getReasonForChangeInput()
            .clearAndType('Overlapping version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({
            validityStartISODate: '2030-03-15',
            validityEndISODate: '2030-03-25',
          });
          form.submitButton().click();
        });

      // Validate cut confirmation modal
      const { overlappingCutConfirmationModal } = StopDetailsPage;
      const { confirmationModal } = overlappingCutConfirmationModal;

      overlappingCutConfirmationModal
        .modal()
        .should('exist')
        .within(() => {
          overlappingCutConfirmationModal
            .currentVersion()
            .should('contain', '10.03.2030 - 19.03.2030');
          overlappingCutConfirmationModal
            .newVersion()
            .should('contain', '15.03.2030 - 25.03.2030');
          overlappingCutConfirmationModal
            .cutDate()
            .should('contain', '14.03.2030');

          confirmationModal.getConfirmButton().click();
        });

      Toast.expectSuccessToast('Versio muokattu');
      EditStopModal.modal().should('not.exist');
      overlappingCutConfirmationModal.modal().should('not.exist');
      StopDetailsPage.loadingStopDetails().should('not.exist');
      StopDetailsPage.validityPeriod().should('contain', '15.3.2030-25.3.2030');
    });
  });
});
