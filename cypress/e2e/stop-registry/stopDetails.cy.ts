import {
  GetInfrastructureLinksByExternalIdsResult,
  Priority,
  StopAreaInput,
  StopInsertInput,
  StopRegistryNameType,
  StopRegistryTransportModeType,
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
    externalId: '445156',
    coordinates: [24.926699622176628, 60.164181083308065, 10.0969999999943],
  },
  {
    externalId: '442424',
    coordinates: [24.92904198486008, 60.16490775039894, 0],
  },
  {
    externalId: '442325',
    coordinates: [24.932072417514647, 60.166003223527824, 0],
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
      quays: [quayH2003.quay],
    },
    organisations: {
      cleaning: 'Clear Channel',
      infoUpkeep: null,
      maintenance: 'ELY-keskus',
      owner: 'JCD',
      winterMaintenance: 'ELY-keskus',
    },
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

describe('Stop details', () => {
  let stopDetailsPage: StopDetailsPage;
  let toast: Toast;

  const externalLinks = new ExternalLinksSection();

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
    toast = new Toast();
    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      // Inserting the terminals here causes it's child stop H0003,
      // to generate extra versions of it's quay, which breaks info spots.
      // terminals: seedTerminals,
      stopPlaces: stopAreaInput,
      organisations: seedOrganisations,
      infoSpots: seedInfoSpots,
    });

    stopDetailsPage = new StopDetailsPage();

    cy.setupTests();
    cy.mockLogin();
  });

  const verifyInitialBasicDetails = () => {
    const bdView = stopDetailsPage.basicDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getLabel().shouldHaveText('H2003');
    bdView.getPrivateCode().shouldHaveText('10003');
    bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
    bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
    bdView.getElyNumber().shouldHaveText('1234567');

    bdView.getTimingPlaceId().shouldHaveText('1AURLA');
    bdView.getStopType().shouldHaveText('Runkolinja, vaihtopysäkki');
    bdView.getTransportMode().shouldHaveText('Bussi');
  };

  const verifyInitialLocationDetails = () => {
    const locationView = stopDetailsPage.locationDetails.viewCard;

    locationView.getContainer().shouldBeVisible();
    locationView.getStreetAddress().shouldHaveText('Mannerheimintie 22-24');
    locationView.getPostalCode().shouldHaveText('00100');
    locationView.getMunicipality().shouldHaveText('Helsinki');
    locationView.getFareZone().shouldHaveText('A');
    locationView.getLatitude().shouldHaveText('60.166003223527824');
    locationView.getLongitude().shouldHaveText('24.932072417514647');
    locationView.getAltitude().shouldHaveText('0');
    locationView.getFunctionalArea().shouldHaveText('20 m');
    locationView.getStopArea().shouldHaveText('-');
    locationView.getStopAreaName().shouldHaveText('-');
    locationView.getStopAreaStops().shouldHaveText('-');
    locationView.getQuay().shouldHaveText('-');
    locationView.getStopAreaQuays().shouldHaveText('-');
    locationView.getTerminal().shouldHaveText('-');
    locationView.getTerminalName().shouldHaveText('-');
    locationView.getTerminalStops().shouldHaveText('-');
  };

  const verifyInitialSignageDetails = () => {
    const signView = stopDetailsPage.signageDetails.viewCard;

    signView.getContainer().shouldBeVisible();
    signView.getSignType().shouldHaveText('Tolppamerkki');
    signView.getNumberOfFrames().shouldHaveText('12');
    signView.getLineSignage().shouldHaveText('Kyllä');
    signView.getMainLineSign().shouldHaveText('Ei');
    signView.getReplacesRailSign().shouldHaveText('Ei');
    signView.getSignageInstructionExceptions().shouldHaveText('Ohjetekstiä...');
  };

  const verifyInitialExternalLinks = () => {
    const externalLinksView = externalLinks;

    externalLinksView.getName().shouldHaveText('Testilinkki');
    externalLinksView
      .getLocation()
      .should('have.attr', 'href', 'https://test.fi');
  };

  const verifyInitialShelters = () => {
    const shelterView = stopDetailsPage.shelters.viewCard;

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
    const measurementsView = stopDetailsPage.measurements.viewCard;

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
    const maintenanceView = stopDetailsPage.maintenance.viewCard;
    const maintainerView = maintenanceView.maintainerViewCard;

    maintenanceView.getContainer().shouldBeVisible();
    maintenanceView.getContainer().scrollIntoView(); // Measurements section is too fat.

    maintenanceView.getOwner().within(() => {
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
    const infoSpotView = stopDetailsPage.infoSpots.viewCard;

    infoSpotView
      .getDescription()
      .shouldHaveText('Ensimmäinen kerros, portaiden vieressä');
    infoSpotView.getLabel().shouldHaveText('JP1234568');
    infoSpotView.getPurpose().shouldHaveText('Tiedotteet');
    infoSpotView.getLatitude().shouldHaveText(expectedLocation.lat);
    infoSpotView.getLongitude().shouldHaveText(expectedLocation.lon);
    infoSpotView.getBacklight().shouldHaveText('Kyllä');
    infoSpotView.getPosterPlaceSize().shouldHaveText('80x120cm');
    infoSpotView.getPosterSize().shouldHaveText('a4');
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
    const infoSpotView = stopDetailsPage.infoSpots.viewCard;
    infoSpotView.getNthSectionContainer(0).within(() => {
      verifyInfoSpotJP1234568({
        lat: '60.16490775039894',
        lon: '24.92904198486008',
        stops: 'V1562',
      });
    });

    infoSpotView.getNthSectionContainer(1).within(() => {
      infoSpotView
        .getDescription()
        .shouldHaveText('Ensimmäinen kerros, portaiden takana');
      infoSpotView.getLabel().shouldHaveText('JP1234567');
      infoSpotView.getPurpose().shouldHaveText('Dynaaminen näyttö');
      infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
      infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
      infoSpotView.getBacklight().shouldHaveText('-');
      infoSpotView.getPosterPlaceSize().shouldHaveText('-');
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
      infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
      infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
      infoSpotView.getBacklight().shouldHaveText('-');
      infoSpotView.getPosterPlaceSize().shouldHaveText('-');
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
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();

      stopDetailsPage.titleRow.label().shouldHaveText('H2003');
      stopDetailsPage.titleRow
        .names()
        .shouldHaveText('Pohjoisesplanadi|Norraesplanaden');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');

      stopDetailsPage.basicDetailsTabPanel().should('be.visible');
      stopDetailsPage.technicalFeaturesTabPanel().should('not.exist');
      stopDetailsPage.infoSpotsTabPanel().should('not.exist');
    },
  );

  describe('basic details', () => {
    let bdForm: BasicDetailsForm;
    let bdView: BasicDetailsViewCard;

    beforeEach(() => {
      bdView = stopDetailsPage.basicDetails.viewCard;
      bdForm = stopDetailsPage.basicDetails.form;
    });

    it(
      'should view stop area basic details text fields',
      { tags: [Tag.StopRegistry] },
      () => {
        const stopAreaDetailsPage = new StopAreaDetailsPage();
        const alternativeNames = new AlternativeNames();

        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        bdView.getContent().shouldBeVisible();

        bdView.getAreaLink().click();
        stopAreaDetailsPage.details.getPrivateCode().shouldHaveText('H2003');
        cy.go('back');

        bdView.getAreaPrivateCode().shouldHaveText('H2003');
        bdView.getAreaQuays().shouldHaveText('H2003');
        bdView.getAreaName().shouldHaveText('Pohjoisesplanadi');
        bdView.getAreaNameSwe().shouldHaveText('Norraesplanaden');
        alternativeNames.getNameEng().shouldHaveText('North esplanade');
        alternativeNames
          .getNameLongFin()
          .shouldHaveText('Pohjoisesplanadi (pitkä)');
        alternativeNames
          .getNameLongSwe()
          .shouldHaveText('Norraesplanaden (lång)');
        alternativeNames
          .getNameLongEng()
          .shouldHaveText('North esplanade (long)');
        alternativeNames.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
        alternativeNames.getAbbreviationSwe().shouldHaveText('N.esplanaden');
        alternativeNames.getAbbreviationEng().shouldHaveText('N.esplanade');

        stopDetailsPage.basicDetails.getEditButton().click();

        // Verify correct values in readonly fields.
        bdView.getAreaLink().click();
        stopAreaDetailsPage.details.getPrivateCode().shouldHaveText('H2003');
        cy.go('back');
        stopDetailsPage.basicDetails.getEditButton().click();
        bdView.getAreaPrivateCode().shouldHaveText('H2003');
        bdView.getAreaQuays().shouldHaveText('H2003');
        bdView.getAreaName().shouldHaveText('Pohjoisesplanadi');
        bdView.getAreaNameSwe().shouldHaveText('Norraesplanaden');
        alternativeNames.getNameEng().shouldHaveText('North esplanade');
        alternativeNames
          .getNameLongFin()
          .shouldHaveText('Pohjoisesplanadi (pitkä)');
        alternativeNames
          .getNameLongSwe()
          .shouldHaveText('Norraesplanaden (lång)');
        alternativeNames
          .getNameLongEng()
          .shouldHaveText('North esplanade (long)');
        alternativeNames.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
        alternativeNames.getAbbreviationSwe().shouldHaveText('N.esplanaden');
        alternativeNames.getAbbreviationEng().shouldHaveText('N.esplanade');

        // Should be able to save without changing anything.
        stopDetailsPage.basicDetails.getSaveButton().click();

        toast.expectSuccessToast('Pysäkki muokattu');
      },
    );

    it(
      'should view and edit basic details text fields',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        bdView.getContent().shouldBeVisible();
        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPrivateCode().shouldHaveText('10003');
        bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
        bdView.getElyNumber().shouldHaveText('1234567');

        stopDetailsPage.basicDetails.getEditButton().click();

        // TODO: when this assert fails, remove this line and implement tests for label change
        bdForm.getLabelInput().shouldBeDisabled();

        // Verify correct initial values.
        bdForm.getLabelInput().should('have.value', 'H2003');
        bdForm.getPrivateCodeInput().should('have.value', '10003');
        bdForm
          .getLocationFinInput()
          .should('have.value', 'Pohjoisesplanadi (sij.)');
        bdForm
          .getLocationSweInput()
          .should('have.value', 'Norraesplanaden (plats)');
        bdForm.getElyNumberInput().should('have.value', '1234567');

        bdForm.getPrivateCodeInput().clearAndType('10004');
        bdForm.getLocationFinInput().clearAndType('NewPohjoisesplanadi (sij.)');
        bdForm.getLocationSweInput().clearAndType('NewNorraesplanaden (plats)');

        bdForm.getElyNumberInput().clearAndType('1234568');

        stopDetailsPage.basicDetails.getSaveButton().click();

        toast.expectSuccessToast('Pysäkki muokattu');

        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPrivateCode().shouldHaveText('10004');
        bdView.getLocationFin().shouldHaveText('NewPohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('NewNorraesplanaden (plats)');
        bdView.getElyNumber().shouldHaveText('1234568');
      },
    );

    it(
      'should view and edit basic details dropdowns and checkboxes',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        bdView.getContent().shouldBeVisible();

        bdView.getLabel().shouldHaveText('H2003');
        bdView.getTimingPlaceId().shouldHaveText('1AURLA');
        bdView.getStopType().shouldHaveText('Runkolinja, vaihtopysäkki');
        bdView.getTransportMode().shouldHaveText('Bussi');

        stopDetailsPage.basicDetails.getEditButton().click();

        // Verify correct initial values.
        bdForm.getMainLineCheckbox().should('be.checked');
        bdForm.getInterchangeCheckbox().should('be.checked');
        bdForm.getRailReplacementCheckbox().should('not.be.checked');
        bdForm.getVirtualCheckbox().should('not.be.checked');
        bdForm.getTransportModeDropdownButton().shouldHaveText('Bussi');
        bdForm.getTimingPlaceDropdown().shouldHaveText('1AURLA (1AURLA)');

        bdForm.getMainLineCheckbox().click();
        bdForm.getInterchangeCheckbox().click();

        // Rail replacement is only available for transport mode: bus
        bdForm.getRailReplacementCheckbox().click();
        bdForm.getTransportModeDropdownButton().shouldBeDisabled();

        bdForm.getVirtualCheckbox().click();

        stopDetailsPage.basicDetails.getSaveButton().click();

        toast.expectSuccessToast('Pysäkki muokattu');

        // Tiamat data model has some arrays that stores multiple types
        // of data, so all these checks are here to make sure that
        // the saves do not change other fields.
        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPrivateCode().shouldHaveText('10003');
        bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
        bdView.getTransportMode().shouldHaveText('Bussi');
        bdView.getTimingPlaceId().shouldHaveText('1AURLA');
        bdView
          .getStopType()
          .shouldHaveText('Raideliikennettä korvaava, virtuaalipysäkki');
        bdView.getStopState().shouldHaveText('Pois käytöstä');
        bdView.getElyNumber().shouldHaveText('1234567');

        stopDetailsPage.basicDetails.getEditButton().click();

        bdForm.getRailReplacementCheckbox().click();
        bdForm.getTransportModeDropdownButton().click();
        bdForm
          .getTransportModeDropdownOptions()
          .contains('Raitiovaunu')
          .click();

        // Rail replacement is only available for transport mode: bus
        bdForm.getRailReplacementCheckbox().shouldBeDisabled();

        bdForm.getStopPlaceStateDropdownButton().click();
        bdForm.getStopPlaceStateDropdownOptions().contains('Käytössä').click();
        bdForm.getTimingPlaceDropdown().type('1AACKT');

        bdForm
          .getTimingPlaceDropdown()
          .find('[role="option"]')
          .contains('1AACKT')
          .click();

        stopDetailsPage.basicDetails.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');

        bdView.getTransportMode().shouldHaveText('Raitiovaunu');
        bdView.getStopState().shouldHaveText('Käytössä');
        bdView.getTimingPlaceId().shouldHaveText('1AACKT');
      },
    );

    describe('creating new timing place', () => {
      it(
        'should create new timing place correctly',
        { tags: [Tag.StopRegistry] },
        () => {
          const { createTimingPlaceForm } = bdForm;
          stopDetailsPage.visit('H2003');
          stopDetailsPage.page().shouldBeVisible();

          bdView.getContent().shouldBeVisible();

          bdView.getLabel().shouldHaveText('H2003');
          bdView.getTimingPlaceId().shouldHaveText('1AURLA');

          stopDetailsPage.basicDetails.getEditButton().click();

          bdForm.getAddTimingPlaceButton().click();

          createTimingPlaceForm.fillTimingPlaceFormAndSave({
            label: '1TEST',
            description: 'Test description',
          });

          toast.expectSuccessToast('Hastus-paikka luotu');

          stopDetailsPage.basicDetails.getSaveButton().click();

          toast.expectSuccessToast('Pysäkki muokattu');

          bdView.getLabel().shouldHaveText('H2003');
          bdView.getTimingPlaceId().shouldHaveText('1TEST');
        },
      );
    });

    // TODO: test for removing timing place from stop that is used
    // as timing point on a route. This is better to be created after
    // e2e test data unification
  });

  describe('location details', () => {
    let locationForm: LocationDetailsForm;
    let locationView: LocationDetailsViewCard;

    beforeEach(() => {
      locationForm = stopDetailsPage.locationDetails.form;
      locationView = stopDetailsPage.locationDetails.viewCard;
    });

    it('should view location details', { tags: [Tag.StopRegistry] }, () => {
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();

      verifyInitialLocationDetails();

      stopDetailsPage.locationDetails.getEditButton().click();
      locationView.getContainer().should('not.exist');

      locationForm
        .getLatitudeInput()
        .should('be.disabled')
        .should('have.value', 60.166003223527824);
      locationForm
        .getLongitudeInput()
        .should('be.disabled')
        .should('have.value', 24.932072417514647);
      locationForm
        .getAltitudeInput()
        .should('be.disabled')
        .should('have.value', 0);

      locationForm
        .getStreetAddressInput()
        .should('have.value', 'Mannerheimintie 22-24')
        .clearAndType('Marskintie 42');
      locationForm
        .getPostalCodeInput()
        .should('have.value', '00100')
        .clearAndType('33720');
      locationForm.getMunicipalityReadOnly().shouldHaveText('Helsinki');
      locationForm.getFareZoneReadOnly().shouldHaveText('A');
      locationForm
        .getFunctionalAreaInput()
        .should('have.value', '20')
        .clearAndType('7');

      stopDetailsPage.locationDetails.getSaveButton().click();
      toast.expectSuccessToast('Pysäkki muokattu');
      locationView.getContainer().shouldBeVisible();

      locationView.getStreetAddress().shouldHaveText('Marskintie 42');
      locationView.getPostalCode().shouldHaveText('33720');
      locationView.getMunicipality().shouldHaveText('Helsinki');
      locationView.getFareZone().shouldHaveText('A');
      locationView.getLatitude().shouldHaveText('60.166003223527824');
      locationView.getLongitude().shouldHaveText('24.932072417514647');
      locationView.getFunctionalArea().shouldHaveText('7 m');
    });
  });

  describe('signage details', () => {
    let signForm: SignageDetailsForm;
    let signView: SignageDetailsViewCard;

    beforeEach(() => {
      signForm = stopDetailsPage.signageDetails.form;
      signView = stopDetailsPage.signageDetails.viewCard;
    });

    it(
      'should view and edit signage details',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        verifyInitialSignageDetails();

        stopDetailsPage.signageDetails.getEditButton().click();
        signView.getContainer().should('not.exist');

        signForm
          .getSignTypeDropdownButton()
          .shouldHaveText('Tolppamerkki')
          .click();
        signForm.getSignTypeDropdownOptions().contains('Katoskehikko').click();
        signForm
          .getNumberOfFramesInput()
          .should('have.value', 12)
          .clearAndType('7');
        signForm.getLineSignageCheckbox().should('be.checked').click();
        signForm.getReplacesRailSignCheckbox().should('not.be.checked').click();
        signForm.getMainLineSignCheckbox().should('not.be.checked').click();
        signForm
          .getSignageInstructionExceptionsInput()
          .should('have.value', 'Ohjetekstiä...')
          .clearAndType('Uusi teksti');

        stopDetailsPage.signageDetails.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        signView.getContainer().shouldBeVisible();

        signView.getContainer().shouldBeVisible();
        signView.getSignType().shouldHaveText('Katoskehikko');
        signView.getNumberOfFrames().shouldHaveText('7');
        signView.getLineSignage().shouldHaveText('Ei');
        signView.getMainLineSign().shouldHaveText('Kyllä');
        signView.getReplacesRailSign().shouldHaveText('Kyllä');
        signView
          .getSignageInstructionExceptions()
          .shouldHaveText('Uusi teksti');
      },
    );
  });

  describe('external links', () => {
    let externalLinksForm: ExternalLinksForm;
    let externalLinksSection: ExternalLinksSection;

    beforeEach(() => {
      externalLinksForm = externalLinks.form;
      externalLinksSection = externalLinks;
    });

    it(
      'should view and edit external links',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        externalLinksSection.getTitle().shouldHaveText('Linkit');
        externalLinksSection.getExternalLinks().shouldBeVisible();
        externalLinksSection.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        externalLinksSection.getEditButton().click();
        externalLinksForm.externalLinks
          .getNameInput()
          .clearAndType('Linkin nimi');
        externalLinksForm.externalLinks
          .getLocationInput()
          .clearAndType('http://www.example.com');
        externalLinksForm.getSaveButton().click();
        externalLinksSection.getNoExternalLinks().should('not.exist');
        externalLinksSection.getExternalLinks().should('have.length', 1);

        externalLinksSection.getNthExternalLink(0).within(() => {
          externalLinksSection.getName().shouldHaveText('Linkin nimi');
          externalLinksSection
            .getLocation()
            .should('have.attr', 'href', 'http://www.example.com');
        });
      },
    );

    it(
      'should add and delete external links',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit('H2003');
        stopDetailsPage.page().shouldBeVisible();

        externalLinksSection.getTitle().shouldHaveText('Linkit');
        externalLinksSection.getExternalLinks().shouldBeVisible();
        externalLinksSection.getNthExternalLink(0).within(() => {
          verifyInitialExternalLinks();
        });

        externalLinksSection.getEditButton().click();
        externalLinksForm.getAddNewButton().click();
        externalLinksForm.getNthExternalLink(1).within(() => {
          externalLinksForm.externalLinks
            .getNameInput()
            .clearAndType('Linkin nimi 2');
          externalLinksForm.externalLinks
            .getLocationInput()
            .clearAndType('http://www.example2.com');
        });
        externalLinksForm.getSaveButton().click();
        externalLinksSection.getNoExternalLinks().should('not.exist');
        externalLinksSection.getExternalLinks().should('have.length', 2);

        externalLinksSection.getNthExternalLink(0).within(() => {
          externalLinksSection.getName().shouldHaveText('Testilinkki');
        });
        externalLinksSection.getNthExternalLink(1).within(() => {
          externalLinksSection.getName().shouldHaveText('Linkin nimi 2');
        });

        externalLinksSection.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        externalLinksSection.getExternalLinks().should('have.length', 1);
        externalLinksSection.getNthExternalLink(0).within(() => {
          externalLinksSection.getName().shouldHaveText('Linkin nimi 2');
        });

        externalLinksSection.getEditButton().click();
        externalLinksForm.getNthExternalLink(0).within(() => {
          externalLinksForm.externalLinks.getDeleteExternalLinkButton().click();
        });
        externalLinksForm.getSaveButton().click();
        externalLinksSection.getExternalLinks().should('have.length', 0);
        externalLinksSection.getNoExternalLinks().shouldBeVisible();
        externalLinksSection.getNoExternalLinks().shouldHaveText('Ei linkkejä');
      },
    );
  });

  describe('technical features', () => {
    beforeEach(() => {
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();
      stopDetailsPage.titleRow.label().shouldHaveText('H2003');

      stopDetailsPage.technicalFeaturesTabButton().click();
    });

    it('should view technical features', { tags: [Tag.StopRegistry] }, () => {
      stopDetailsPage.technicalFeaturesTabPanel().should('be.visible');
      stopDetailsPage.basicDetailsTabPanel().should('not.exist');
      stopDetailsPage.infoSpotsTabPanel().should('not.exist');
    });

    describe('shelters', () => {
      let form: SheltersForm;
      let view: ShelterViewCard;

      beforeEach(() => {
        form = stopDetailsPage.shelters.form;
        view = stopDetailsPage.shelters.viewCard;
      });

      it(
        'should view and edit shelter details',
        { tags: [Tag.StopRegistry] },
        () => {
          verifyInitialShelters();

          stopDetailsPage.shelters.getEditButton().click();
          view.getContainers().should('not.exist');

          form.getShelters().should('have.length', 1);

          form.getNthShelter(0).within(() => {
            const shelter = form.shelters;
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
            shelter
              .getShelterTypeDropdownOptions()
              .contains('Puukatos')
              .click();
            shelter.getShelterElectricityDropdownButton().click();
            shelter
              .getShelterElectricityDropdownOptions()
              .contains('Valosähkö')
              .click();
            shelter.getShelterLightingDropdownButton().click();
            shelter.getShelterLightingDropdownOptions().contains('Ei').click();
            shelter.getShelterConditionDropdownButton().click();
            shelter
              .getShelterConditionDropdownOptions()
              .contains('Hyvä')
              .click();
            shelter.getTimetableCabinetsInput().clearAndType('42');
            shelter.getTrashCanCheckbox().click();
            shelter.getShelterHasDisplayCheckbox().click();
            shelter.getBicycleParkingCheckbox().click();
            shelter.getLeaningRailCheckbox().click();
            shelter.getOutsideBenchCheckbox().click();
            shelter.getShelterFasciaBoardTapingCheckbox().click();
          });

          // Submit.
          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');
          view.getContainers().shouldBeVisible();

          // Verify changes visible in view card:
          view.getShelterExternalId().should('have.text', '98765');
          view.getContainers().should('have.length', 1);
          view.getShelterNumber().should('have.text', '2');
          view.getShelterType().should('have.text', 'Puukatos');
          view.getElectricity().should('have.text', 'Valosähkö');
          view.getLighting().should('have.text', 'Ei');
          view.getCondition().should('have.text', 'Hyvä');
          view.getTimetableCabinets().should('have.text', '42');
          view.getTrashCan().should('have.text', 'Ei');
          view.getHasDisplay().should('have.text', 'Ei');
          view.getBicycleParking().should('have.text', 'Ei');
          view.getLeaningRail().should('have.text', 'Ei');
          view.getOutsideBench().should('have.text', 'Ei');
          view.getFasciaBoardTaping().should('have.text', 'Ei');

          // "enclosed" is not visible anywhere in UI, check from request that it got sent.
          expectGraphQLCallToSucceed('@gqlUpdateStopPlace')
            .its(
              'request.body.variables.input.quays.0.placeEquipments.shelterEquipment.0.enclosed',
            )
            .should('equal', false);
        },
      );

      it(
        'should be able to keep shelter numbers in order',
        { tags: [Tag.StopRegistry] },
        () => {
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (1)');

          stopDetailsPage.shelters.getEditButton().click();
          view.getContainers().should('not.exist');

          // Add more shelters.
          form.getShelters().should('have.length', 1);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (1)');
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          form.getShelters().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (3)');

          // Submit.
          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().shouldBeVisible();
          view.getContainers().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (3)');

          // Delete the 2nd.
          stopDetailsPage.shelters.getEditButton().click();
          form.getShelters().should('have.length', 3);
          form.getNthShelter(1).within(() => {
            const shelter = form.shelters;
            shelter.getDeleteShelterButton().click();
          });

          form.getShelters().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (2)'); // 2 instead of 3 since one of those will be deleted.

          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          stopDetailsPage.shelters.getEditButton().click();
          view.getContainers().should('not.exist');

          // Add more shelters.
          form.getShelters().should('have.length', 2);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (2)');
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          form.getShelters().should('have.length', 4);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (4)');
          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().shouldBeVisible();
          view.getContainers().should('have.length', 4);
          view.getNthContainer(0).within(() => {
            view.getShelterNumber().should('have.text', '1');
          });
          view.getNthContainer(1).within(() => {
            view.getShelterNumber().should('have.text', '3');
          });
          view.getNthContainer(2).within(() => {
            view.getShelterNumber().should('have.text', '4');
          });
          view.getNthContainer(3).within(() => {
            view.getShelterNumber().should('have.text', '5');
          });
        },
      );

      it(
        'should be able to add and delete shelters',
        { tags: [Tag.StopRegistry] },
        () => {
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (1)');

          stopDetailsPage.shelters.getEditButton().click();
          view.getContainers().should('not.exist');

          // Add more shelters.
          form.getShelters().should('have.length', 1);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (1)');
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          stopDetailsPage.shelters.getAddNewShelterButton().click();
          form.getShelters().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (3)');

          form.getNthShelter(1).within(() => {
            form.shelters.getTimetableCabinetsInput().clearAndType('22');
          });

          form.getNthShelter(2).within(() => {
            form.shelters.getTimetableCabinetsInput().clearAndType('33');
          });

          // Submit.
          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().shouldBeVisible();
          view.getContainers().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (3)');

          // Delete the 2nd.
          stopDetailsPage.shelters.getEditButton().click();
          form.getShelters().should('have.length', 3);
          form.getNthShelter(1).within(() => {
            const shelter = form.shelters;
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
          form.getNthShelter(0).within(() => {
            const shelter = form.shelters;
            shelter.getDeleteShelterButton().shouldHaveText('Poista katos');
            shelter.getDeleteShelterButton().click();
            shelter.getDeleteShelterButton().shouldHaveText('Peruuta poisto');
            shelter.getShelterTypeDropdownButton().shouldBeDisabled();

            shelter.getDeleteShelterButton().click();
            shelter.getDeleteShelterButton().shouldHaveText('Poista katos');
            shelter.getShelterTypeDropdownButton().should('not.be.disabled');
          });

          form.getShelters().should('have.length', 3);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (2)'); // 2 instead of 3 since one of those will be deleted.

          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().shouldBeVisible();
          view.getContainers().should('have.length', 2);
          view.getNthContainer(0).within(() => {
            view.getTimetableCabinets().should('have.text', '1');
          });
          view.getNthContainer(1).within(() => {
            view.getTimetableCabinets().should('have.text', '33');
          });
        },
      );

      it('should be able to copy shelter', { tags: [Tag.StopRegistry] }, () => {
        // Ensure view
        stopDetailsPage.shelters.getEditButton().click();
        view.getContainers().should('not.exist');

        // Ensure default test shelter
        form.getShelters().should('have.length', 1);
        stopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (1)');

        // Add more shelters.
        form.getCopyNewShelterButton().click();
        form.getShelters().should('have.length', 2);

        stopDetailsPage.shelters.getSaveButton().click();

        // Check new shelter is saved with same values
        stopDetailsPage.shelters.getTitle().shouldHaveText('Pysäkkikatos (2)');
        view.getNthContainer(0).within(() => {
          view.getTimetableCabinets().should('have.text', '1');
        });
        view.getNthContainer(1).within(() => {
          view.getTimetableCabinets().should('have.text', '1');
        });
      });

      it(
        'should be able to delete all shelters',
        { tags: [Tag.StopRegistry] },
        () => {
          stopDetailsPage.shelters.getAddShelterButton().should('not.exist');
          stopDetailsPage.shelters.getEditButton().click();
          view.getContainers().should('not.exist');

          form.getShelters().should('have.length', 1);
          form.getNthShelter(0).within(() => {
            form.shelters.getDeleteShelterButton().click();
            form.shelters.getShelterTypeDropdownButton().shouldBeDisabled();
          });

          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().should('not.exist');
          stopDetailsPage.shelters
            .getTitle()
            .should('have.text', 'Ei pysäkkikatosta');

          // No shelters left: edit mode will be started with one new shelter.
          stopDetailsPage.shelters.getAddShelterButton().should('be.visible');
          stopDetailsPage.shelters.getAddShelterButton().click();
          view.getContainers().should('not.exist');
          form.getShelters().should('have.length', 1);
          stopDetailsPage.shelters
            .getTitle()
            .shouldHaveText('Pysäkkikatos (1)');

          // A newly added, non persisted shelter is deleted immediately.
          form.getNthShelter(0).within(() => {
            form.shelters.getDeleteShelterButton().click();
          });
          form.getShelters().should('not.exist');
          stopDetailsPage.shelters
            .getTitle()
            .should('have.text', 'Ei pysäkkikatosta');
          stopDetailsPage.shelters.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');

          view.getContainers().should('not.exist');
          stopDetailsPage.shelters
            .getTitle()
            .should('have.text', 'Ei pysäkkikatosta');
        },
      );
    });

    describe('measurements', () => {
      let form: MeasurementsForm;
      let view: MeasurementsViewCard;

      beforeEach(() => {
        form = stopDetailsPage.measurements.form;
        view = stopDetailsPage.measurements.viewCard;
      });

      it(
        'should view and edit measurement details',
        { tags: [Tag.StopRegistry] },
        () => {
          verifyInitialMeasurements();

          stopDetailsPage.measurements.getEditButton().click();
          view.getContainer().should('not.exist');

          stopDetailsPage.measurements
            .getAccessibilityLevel()
            .shouldHaveText('Esteellinen');

          // Verify correct initial values:
          form.getStopTypeDropdownButton().shouldHaveText('Syvennys');
          form.getCurvedStopDropdownButton().shouldHaveText('Ei');
          form.getShelterTypeDropdownButton().shouldHaveText('Leveä');
          form.getShelterLaneDistanceInput().should('have.value', '123');
          form.getCurbBackOfRailDistanceInput().should('have.value', '45.6');
          form.getStopAreaSideSlopeInput().should('have.value', '5.3');
          form.getStopAreaLengthwiseSlopeInput().should('have.value', '1.8');

          form.getStructureLaneDistanceInput().should('have.value', '6');
          form.getStopElevationFromRailTopInput().should('have.value', '10');
          form.getStopElevationFromSidewalkInput().should('have.value', '7');
          form.getLowerCleatHeightInput().should('have.value', '8');

          form.getPlatformEdgeWarningAreaCheckbox().should('be.checked');
          form.getSidewalkAccessibleConnectionCheckbox().should('be.checked');
          form.getGuidanceStripeCheckbox().should('be.checked');
          form.getServiceAreaStripesCheckbox().should('be.checked');
          form.getGuidanceTypeDropdownButton().shouldHaveText('Pisteopaste');
          form.getGuidanceTilesCheckbox().should('be.checked');
          form.getMapTypeDropdownButton().shouldHaveText('Kohokartta');

          form.getCurbDriveSideOfRailDistanceInput().should('have.value', '5');
          form.getEndRampSlopeInput().should('have.value', '3.5');
          form.getServiceAreaWidthInput().should('have.value', '4.6');
          form.getServiceAreaLengthInput().should('have.value', '55.2');
          form
            .getPedestrianCrossingRampTypeDropdownButton()
            .shouldHaveText('LR - Luiskattu reunatukiosuus');
          form
            .getStopAreaSurroundingsAccessibleDropdownButton()
            .shouldHaveText('Esteellinen');

          // Change everything:
          form.getStopTypeDropdownButton().click();
          form.getStopTypeDropdownOptions().contains('Uloke').click();
          form.getCurvedStopDropdownButton().click();
          form.getCurvedStopDropdownOptions().contains('Kyllä').click();
          form.getShelterTypeDropdownButton().click();
          form.getShelterTypeDropdownOptions().contains('Kapea').click();
          form.getShelterLaneDistanceInput().clearAndType('231');
          form.getCurbBackOfRailDistanceInput().clearAndType('111');
          form.getStopAreaSideSlopeInput().clearAndType('1.1');
          form.getStopAreaLengthwiseSlopeInput().clearAndType('2.2');

          form.getStructureLaneDistanceInput().clearAndType('4');
          form.getStopElevationFromRailTopInput().clearAndType('55');
          form.getStopElevationFromSidewalkInput().clearAndType('20');
          form.getLowerCleatHeightInput().clearAndType('7');

          form.getPlatformEdgeWarningAreaCheckbox().click();

          form.getSidewalkAccessibleConnectionCheckbox().click();
          form.getGuidanceStripeCheckbox().click();
          form.getServiceAreaStripesCheckbox().click();
          form.getGuidanceTypeDropdownButton().click();
          form
            .getGuidanceTypeDropdownOptions()
            .contains('Ei opastetta')
            .click();
          form.getGuidanceTilesCheckbox().click();
          form.getMapTypeDropdownButton().click();
          form.getMapTypeDropdownOptions().contains('Muu kartta').click();

          form.getCurbDriveSideOfRailDistanceInput().clearAndType('8');
          form.getEndRampSlopeInput().clearAndType('9.9');
          form.getServiceAreaWidthInput().clearAndType('1.6');
          form.getServiceAreaLengthInput().clearAndType('12.23');
          form.getPedestrianCrossingRampTypeDropdownButton().click();
          form
            .getPedestrianCrossingRampTypeDropdownOptions()
            .contains('RK4 - Pystysuora reunatukiosuus')
            .click();
          form.getStopAreaSurroundingsAccessibleDropdownButton().click();
          form
            .getStopAreaSurroundingsAccessibleDropdownOptions()
            .contains('Esteetön')
            .click();

          // Submit.
          stopDetailsPage.measurements.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');
          view.getContainer().shouldBeVisible();

          // Verify changes visible in view card:
          view.getStopType().shouldHaveText('Uloke');
          view.getCurvedStop().shouldHaveText('Kyllä');
          view.getShelterType().shouldHaveText('Kapea');
          view.getShelterLaneDistance().shouldHaveText('231');
          view.getCurbBackOfRailDistance().shouldHaveText('111');
          view.getStopAreaSideSlope().shouldHaveText('1.1');
          view.getStopAreaLengthwiseSlope().shouldHaveText('2.2');

          view.getStructureLaneDistance().shouldHaveText('4');
          view.getStopElevationFromRailTop().shouldHaveText('55');
          view.getStopElevationFromSidewalk().shouldHaveText('20');
          view.getLowerCleatHeight().shouldHaveText('7');

          view.getPlatformEdgeWarningArea().shouldHaveText('Ei');
          view.getSidewalkAccessibleConnection().shouldHaveText('Ei');
          view.getGuidanceStripe().shouldHaveText('Ei');
          view.getServiceAreaStripes().shouldHaveText('Ei');
          view.getGuidanceType().shouldHaveText('Ei opastetta');
          view.getGuidanceTiles().shouldHaveText('Ei');
          view.getMapType().shouldHaveText('Muu kartta');

          view.getCurbDriveSideOfRailDistance().shouldHaveText('8');
          view.getEndRampSlope().shouldHaveText('9.9');
          view.getServiceAreaWidth().shouldHaveText('1.6');
          view.getServiceAreaLength().shouldHaveText('12.23');
          view
            .getPedestrianCrossingRampType()
            .shouldHaveText('RK4 - Pystysuora reunatukiosuus');
          view.getStopAreaSurroundingsAccessible().shouldHaveText('Esteetön');

          stopDetailsPage.measurements
            .getAccessibilityLevel()
            .shouldHaveText('Osittain esteellinen');
        },
      );

      it(
        'should be able to clear measurement fields',
        { tags: [Tag.StopRegistry] },
        () => {
          stopDetailsPage.measurements.getEditButton().click();
          view.getContainer().should('not.exist');

          // Clear all the fields.
          form.getStopTypeDropdownButton().click();
          form.getStopTypeDropdownOptions().contains('Ei tiedossa').click();
          form.getCurvedStopDropdownButton().click();
          form.getCurvedStopDropdownOptions().contains('Ei tiedossa').click();
          form.getShelterTypeDropdownButton().click();
          form.getShelterTypeDropdownOptions().contains('Ei tiedossa').click();
          form.getShelterLaneDistanceInput().clear();
          form.getCurbBackOfRailDistanceInput().clear();
          form.getStopAreaSideSlopeInput().clear();
          form.getStopAreaLengthwiseSlopeInput().clear();

          form.getStructureLaneDistanceInput().clear();
          form.getStopElevationFromRailTopInput().clear();
          form.getStopElevationFromSidewalkInput().clear();
          form.getLowerCleatHeightInput().clear();

          form.getPlatformEdgeWarningAreaCheckbox().click();
          form.getSidewalkAccessibleConnectionCheckbox().click();
          form.getGuidanceStripeCheckbox().click();
          form.getServiceAreaStripesCheckbox().click();
          form.getGuidanceTypeDropdownButton().click();
          form.getGuidanceTypeDropdownOptions().contains('Ei tiedossa').click();
          form.getGuidanceTilesCheckbox().click();
          form.getMapTypeDropdownButton().click();
          form.getMapTypeDropdownOptions().contains('Ei tiedossa').click();

          form.getCurbDriveSideOfRailDistanceInput().clear();
          form.getEndRampSlopeInput().clear();
          form.getServiceAreaWidthInput().clear();
          form.getServiceAreaLengthInput().clear();
          form.getPedestrianCrossingRampTypeDropdownButton().click();
          form
            .getPedestrianCrossingRampTypeDropdownOptions()
            .contains('Ei tiedossa')
            .click();
          form.getStopAreaSurroundingsAccessibleDropdownButton().click();
          form
            .getStopAreaSurroundingsAccessibleDropdownOptions()
            .contains('Ei tiedossa')
            .click();

          // Submit.
          stopDetailsPage.measurements.getSaveButton().click();
          toast.expectSuccessToast('Pysäkki muokattu');
          view.getContainer().shouldBeVisible();

          // Verify changes visible in view card:
          view.getStopType().shouldHaveText('-');
          view.getCurvedStop().shouldHaveText('-');
          view.getShelterType().shouldHaveText('-');
          view.getShelterLaneDistance().shouldHaveText('-');
          view.getCurbBackOfRailDistance().shouldHaveText('-');
          view.getStopAreaSideSlope().shouldHaveText('-');
          view.getStopAreaLengthwiseSlope().shouldHaveText('-');

          view.getStructureLaneDistance().shouldHaveText('-');
          view.getStopElevationFromRailTop().shouldHaveText('-');
          view.getStopElevationFromSidewalk().shouldHaveText('-');
          view.getLowerCleatHeight().shouldHaveText('-');

          view.getPlatformEdgeWarningArea().shouldHaveText('Ei');
          view.getSidewalkAccessibleConnection().shouldHaveText('Ei');
          view.getGuidanceStripe().shouldHaveText('Ei');
          view.getServiceAreaStripes().shouldHaveText('Ei');
          view.getGuidanceType().shouldHaveText('-');
          view.getGuidanceTiles().shouldHaveText('Ei');
          view.getMapType().shouldHaveText('-');

          view.getCurbDriveSideOfRailDistance().shouldHaveText('-');
          view.getEndRampSlope().shouldHaveText('-');
          view.getServiceAreaWidth().shouldHaveText('-');
          view.getServiceAreaLength().shouldHaveText('-');
          view.getPedestrianCrossingRampType().shouldHaveText('-');
          view.getStopAreaSurroundingsAccessible().shouldHaveText('-');

          // Required data missing so can't calculate accessibility level
          stopDetailsPage.measurements
            .getAccessibilityLevel()
            .shouldHaveText('Esteettömyystietoja puuttuu');
        },
      );
    });

    describe('maintenance details', () => {
      let form: MaintenanceDetailsForm;
      let view: MaintenanceViewCard;

      beforeEach(() => {
        form = stopDetailsPage.maintenance.form;
        view = stopDetailsPage.maintenance.viewCard;
      });

      it('should view and edit maintainers', () => {
        verifyInitialMaintenanceDetails();

        stopDetailsPage.maintenance.getEditButton().click();
        view.getContainer().should('not.exist');

        // Verify correct initial values:
        form.getOwner().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('JCD');
        });
        form.getMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.getWinterMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.getInfoUpkeep().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('-');
        });
        form.getCleaning().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // Change everything:
        form.getOwner().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields
            .getMaintainerDropdownOptions()
            .contains('Clear Channel')
            .click();
        });
        form.getMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('JCD').click();
        });
        form.getWinterMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('-').click();
        });
        form.getInfoUpkeep().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('JCD').click();
        });
        form.getCleaning().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields
            .getMaintainerDropdownOptions()
            .contains('ELY-keskus')
            .click();
        });

        // Submit.
        stopDetailsPage.maintenance.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        view.getContainer().shouldBeVisible();

        // Verify changes visible.
        const maintainerView = view.maintainerViewCard;
        view.getOwner().within(() => {
          maintainerView.getName().shouldHaveText('Clear Channel');
          // Verify that details for new maintainer are shown.
          maintainerView.getPhone().shouldHaveText('+358501223334');
          maintainerView.getEmail().shouldHaveText('clear-channel@example.com');
          maintainerView.getNotSelectedPlaceholder().should('not.exist');
        });
        view.getMaintenance().within(() => {
          maintainerView.getName().shouldHaveText('JCD');
        });
        view.getWinterMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        view.getInfoUpkeep().within(() => {
          maintainerView.getName().shouldHaveText('JCD');
          // Didn't have any maintainer previously, verify that details of new one shown now.
          maintainerView.getPhone().shouldHaveText('+358501234567');
          maintainerView.getEmail().shouldHaveText('jcd@example.com');
          maintainerView.getNotSelectedPlaceholder().should('not.exist');
        });
        view.getCleaning().within(() => {
          maintainerView.getName().shouldHaveText('ELY-keskus');
        });
      });

      it('should clear maintainers', () => {
        verifyInitialMaintenanceDetails();

        stopDetailsPage.maintenance.getEditButton().click();
        view.getContainer().should('not.exist');

        // Verify correct initial values:
        form.getOwner().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('JCD');
        });
        form.getMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.getWinterMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.getInfoUpkeep().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('-');
        });
        form.getCleaning().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // Change everything:
        form.getOwner().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('-').click();
        });
        form.getMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('-').click();
        });
        form.getWinterMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('-').click();
        });
        form.getCleaning().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields.getMaintainerDropdownOptions().contains('-').click();
        });

        // Submit.
        stopDetailsPage.maintenance.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        view.getContainer().shouldBeVisible();

        // Verify changes visible.
        const maintainerView = view.maintainerViewCard;
        view.getOwner().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        view.getMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        view.getWinterMaintenance().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        view.getInfoUpkeep().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
        view.getCleaning().within(() => {
          maintainerView.getNotSelectedPlaceholder().shouldBeVisible();
        });
      });

      it('should edit maintainer organisation details', () => {
        stopDetailsPage.maintenance.getEditButton().click();
        view.getContainer().should('not.exist');

        form.organisationDetailsModal.getModal().should('not.exist');
        form.getMaintenance().within(() => {
          form.fields.getEditOrganisationButton().click();
        });
        form.organisationDetailsModal.getModal().should('exist');
        form.organisationDetailsModal
          .getTitle()
          .shouldHaveText('Muokkaa toimijan tietoja');

        const organisationForm = form.organisationDetailsModal.form;
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
        form.organisationDetailsModal.getModal().should('not.exist');

        // Verify changes visible to this maintainer.
        form.getMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('Uusi Nimi');
          form.fields.getPhone().shouldHaveText('+358507777777');
          form.fields.getEmail().shouldHaveText('uusi@example.com');
        });
        // Also updated to other maintainers with this same organisation.
        form.getWinterMaintenance().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('Uusi Nimi');
          form.fields.getPhone().shouldHaveText('+358507777777');
          form.fields.getEmail().shouldHaveText('uusi@example.com');
        });

        // Cancel editing maintainers.
        stopDetailsPage.maintenance.getCancelButton().click();
        view.getContainer().shouldBeVisible();

        // The edited organisation details should have still been persisted.
        view.getMaintenance().within(() => {
          view.maintainerViewCard.getName().shouldHaveText('Uusi Nimi');
          view.maintainerViewCard.getPhone().shouldHaveText('+358507777777');
          view.maintainerViewCard.getEmail().shouldHaveText('uusi@example.com');
        });
      });

      it('should create new organisation and use it as maintainer', () => {
        stopDetailsPage.maintenance.getEditButton().click();
        view.getContainer().should('not.exist');

        // Start creating new organisation.
        form.getMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
          form.fields.getMaintainerDropdownButton().click();
          form.fields
            .getMaintainerDropdownOptions()
            .contains('Lisää uusi toimija')
            .click();
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.organisationDetailsModal.getModal().should('exist');
        form.organisationDetailsModal
          .getTitle()
          .shouldHaveText('Uusi ylläpitäjä');

        // Fill organisation details and save.
        const organisationForm = form.organisationDetailsModal.form;
        organisationForm.getName().clearAndType('Uusi Toimija');
        organisationForm.getPhone().clearAndType('+358507777777');
        organisationForm.getEmail().clearAndType('uusi@example.com');
        organisationForm.getSaveButton().click();
        form.organisationDetailsModal.getModal().should('not.exist');

        // The new organisation is automatically selected as maintainer for which it was created.
        form.getMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Uusi Toimija');
          form.fields.getPhone().shouldHaveText('+358507777777');
          form.fields.getEmail().shouldHaveText('uusi@example.com');
        });
        // Other maintainers not affected though.
        form.getOwner().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('JCD');
        });
        form.getWinterMaintenance().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('ELY-keskus');
        });
        form.getInfoUpkeep().within(() => {
          form.fields.getMaintainerDropdownButton().shouldHaveText('-');
        });
        form.getCleaning().within(() => {
          form.fields
            .getMaintainerDropdownButton()
            .shouldHaveText('Clear Channel');
        });

        // New maintainer would be visible for other maintainers too.
        form.getInfoUpkeep().within(() => {
          form.fields.getMaintainerDropdownButton().click();
          form.fields
            .getMaintainerDropdownOptions()
            .contains('Uusi Toimija')
            .shouldBeVisible();
          form.fields.getMaintainerDropdownButton().click();
        });

        // Persist maintainers and check view.
        stopDetailsPage.maintenance.getSaveButton().click();
        view.getContainer().shouldBeVisible();
        view.getMaintenance().within(() => {
          view.maintainerViewCard.getName().shouldHaveText('Uusi Toimija');
        });
      });
    });
  });

  describe('info spot details', () => {
    let infoSpotForm: InfoSpotsForm;
    let infoSpotView: InfoSpotViewCard;

    beforeEach(() => {
      infoSpotView = stopDetailsPage.infoSpots.viewCard;
      infoSpotForm = stopDetailsPage.infoSpots.form;

      stopDetailsPage.visit('V1562');
      stopDetailsPage.page().shouldBeVisible();
      stopDetailsPage.titleRow.label().shouldHaveText('V1562');

      stopDetailsPage.infoSpotsTabButton().click();

      stopDetailsPage.infoSpotsTabPanel().should('be.visible');
      stopDetailsPage.technicalFeaturesTabPanel().should('not.exist');
      stopDetailsPage.basicDetailsTabPanel().should('not.exist');

      infoSpotView.getSectionContainers().shouldBeVisible();
    });

    it(
      'should view and edit info spot details',
      { tags: [Tag.StopRegistry] },
      () => {
        verifyInitialInfoSpots();

        const infoSpot = infoSpotForm.infoSpots;

        // Edit info spot
        infoSpotView.getNthSectionContainer(0).within(() => {
          stopDetailsPage.infoSpots.getEditButton().click();
          infoSpotView.getSectionContainers().should('not.exist');

          infoSpot
            .getDescription()
            .should('have.value', 'Ensimmäinen kerros, portaiden vieressä');
          infoSpot.getLabel().should('have.value', 'JP1234568');
          infoSpot.getPurpose().should('have.value', 'Tiedotteet');
          infoSpot.getBacklightButton().should('have.text', 'Kyllä');
          infoSpot.getPosterPlaceSizeButton().should('have.text', '80x120cm');
          infoSpot.getPosterSizeButton().should('have.text', 'A4');
          infoSpot.getPosterLabel().should('have.value', 'PT1234');
          infoSpot.getPosterLines().should('have.value', '1, 6, 17');
          infoSpot.getFloor().should('have.value', '1');
          infoSpot.getRailInformation().should('have.value', '7');
          infoSpot.getZoneLabel().should('have.value', 'A');
          infoSpot.getNoPostersLabel().should('not.exist');

          // Change everything
          infoSpot.getLabel().clearAndType('IP98765432');
          infoSpot.getPurpose().clearAndType('Uusi tarkoitus');
          infoSpot.getPosterPlaceSizeButton().click();
          infoSpot.getPosterPlaceSizeOptions().contains('A4').click();
          infoSpot.getBacklightButton().click();
          infoSpot.getBacklightOptions().contains('Ei').click();
          infoSpot.getDescription().clearAndType('Infopaikan uusi kuvaus');
          infoSpot.getPosterLabel().clearAndType('PT1235');
          infoSpot.getPosterSizeButton().click();
          infoSpot.getPosterSizeOptions().contains('A3').click();
          infoSpot.getPosterLines().clearAndType('2, 7, 18');
          infoSpot.getZoneLabel().clearAndType('B');
          infoSpot.getRailInformation().clearAndType('8');
          infoSpot.getFloor().clearAndType('2');
        });

        // Submit.
        stopDetailsPage.infoSpots.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        infoSpotView.getSectionContainers().shouldBeVisible();

        infoSpotView.getNthSectionContainer(0).within(() => {
          infoSpotView
            .getDescription()
            .shouldHaveText('Infopaikan uusi kuvaus');
          infoSpotView.getLabel().shouldHaveText('IP98765432');
          infoSpotView.getPurpose().shouldHaveText('Uusi tarkoitus');
          infoSpotView.getBacklight().shouldHaveText('Ei');
          infoSpotView.getPosterPlaceSize().shouldHaveText('a4');
          infoSpotView.getPosterSize().shouldHaveText('a3');
          infoSpotView.getPosterLabel().shouldHaveText('PT1235');
          infoSpotView.getPosterLines().shouldHaveText('2, 7, 18');
          infoSpotView.getFloor().shouldHaveText('2');
          infoSpotView.getRailInformation().shouldHaveText('8');
          infoSpotView.getZoneLabel().shouldHaveText('B');
          infoSpotView.getNoPosters().should('not.exist');
        });

        // Edit second info spot
        infoSpotView.getNthSectionContainer(1).within(() => {
          stopDetailsPage.infoSpots.getEditButton().click();
          infoSpotView.getSectionContainers().should('not.exist');

          infoSpot
            .getDescription()
            .should('have.value', 'Ensimmäinen kerros, portaiden takana');
          infoSpot.getLabel().should('have.value', 'JP1234567');
          infoSpot.getPurpose().should('have.value', 'Dynaaminen näyttö');
          infoSpot.getFloor().should('have.value', '1');
          infoSpot.getRailInformation().should('have.value', '8');
          infoSpot.getZoneLabel().should('have.value', 'B');
          infoSpot.getNoPostersLabel().shouldHaveText('Ei infotuotetta');

          // Change everything
          infoSpot.getLabel().clearAndType('IP2345678');
          infoSpot.getPurpose().clearAndType('Dynaaminen näyttö uusi');
          infoSpot.getDescription().clearAndType('Dynaaminen kuvaus');
          infoSpot.getZoneLabel().clearAndType('C');
          infoSpot.getRailInformation().clearAndType('9');
          infoSpot.getFloor().clearAndType('2');
        });

        // Submit.
        stopDetailsPage.infoSpots.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        infoSpotView.getSectionContainers().shouldBeVisible();

        infoSpotView.getNthSectionContainer(1).within(() => {
          infoSpotView.getDescription().shouldHaveText('Dynaaminen kuvaus');
          infoSpotView.getLabel().shouldHaveText('IP2345678');
          infoSpotView.getPurpose().shouldHaveText('Dynaaminen näyttö uusi');
          infoSpotView.getBacklight().shouldHaveText('-');
          infoSpotView.getPosterPlaceSize().shouldHaveText('-');
          infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
          infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
          infoSpotView.getFloor().shouldHaveText('2');
          infoSpotView.getRailInformation().shouldHaveText('9');
          infoSpotView.getStops().shouldHaveText('V1562');
          infoSpotView.getTerminals().shouldHaveText('-');
          infoSpotView.getZoneLabel().shouldHaveText('C');
          infoSpotView.getNoPosters().shouldHaveText('Ei infotuotetta');
        });
      },
    );

    it(
      'should be able to add and delete info spots and posters',
      { tags: [Tag.StopRegistry] },
      () => {
        infoSpotView.getNthSectionContainer(0).within(() => {
          stopDetailsPage.infoSpots.getEditButton().click();
          infoSpotView.getSectionContainers().should('not.exist');

          // Add more infoSpots.
          infoSpotForm.getInfoSpots().should('have.length', 1);
          stopDetailsPage.infoSpots.getAddNewInfoSpotButton().click();
          infoSpotForm.getInfoSpots().should('have.length', 2);

          const infoSpot = infoSpotForm.infoSpots;
          infoSpotForm.getNthInfoSpot(0).within(() => {
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

          infoSpotForm.getNthInfoSpot(1).within(() => {
            infoSpot
              .getDeleteInfoSpotButton()
              .shouldHaveText('Poista infopaikka');
            infoSpot.getDeleteInfoSpotButton().click();
          });
        });

        // Submit.
        stopDetailsPage.infoSpots.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        infoSpotView.getSectionContainers().shouldBeVisible();

        infoSpotView.getNthSectionContainer(0).within(() => {
          stopDetailsPage.infoSpots.getTitle().contains('Ei infopaikkoja');
        });

        infoSpotView.getNthSectionContainer(0).within(() => {
          stopDetailsPage.infoSpots.getAddNewButton().click();
          infoSpotView.getSectionContainers().should('not.exist');

          infoSpotForm.getInfoSpots().should('have.length', 1);

          const infoSpot = infoSpotForm.infoSpots;
          infoSpotForm.getNthInfoSpot(0).within(() => {
            infoSpot.getLabel().clearAndType('IP123');
            infoSpot.getPurpose().clearAndType('Dynaaminen tarkoitus');
            infoSpot.getDescription().clearAndType('Dynaamisen kuvaus');
            infoSpot.getZoneLabel().clearAndType('A');
            infoSpot.getRailInformation().clearAndType('1');
            infoSpot.getFloor().clearAndType('3');
            infoSpot.getNoPostersLabel().shouldHaveText('Ei infotuotetta');
          });

          stopDetailsPage.infoSpots.getAddNewInfoSpotButton().click();
          infoSpotForm.getInfoSpots().should('have.length', 2);

          infoSpotForm.getNthInfoSpot(1).within(() => {
            infoSpot.getLabel().clearAndType('IP125');
            infoSpot.getPurpose().clearAndType('Staattisen tarkoitus');
            infoSpot.getPosterPlaceSizeButton().click();
            infoSpot.getPosterPlaceSizeOptions().contains('A3').click();
            infoSpot.getBacklightButton().click();
            infoSpot.getBacklightOptions().contains('Kyllä').click();
            infoSpot.getDescription().clearAndType('Staattisen kuvaus');
            infoSpot.getAddPosterButton().click();
            infoSpot.getNthPosterContainer(0).within(() => {
              infoSpot.getPosterLabel().clearAndType('PT1236');
              infoSpot.getPosterSizeButton().click();
              infoSpot.getPosterSizeOptions().contains('A3').click();
              infoSpot.getPosterLines().clearAndType('2, 7, 1');
            });
            infoSpot.getAddPosterButton().click();
            infoSpot.getNthPosterContainer(1).within(() => {
              infoSpot.getPosterLabel().clearAndType('PT1237');
              infoSpot.getPosterSizeButton().click();
              infoSpot.getPosterSizeOptions().contains('A4').click();
              infoSpot.getPosterLines().clearAndType('2');
            });
            infoSpot.getZoneLabel().clearAndType('A');
            infoSpot.getRailInformation().clearAndType('7');
            infoSpot.getFloor().clearAndType('2');
            infoSpot.getNoPostersLabel().should('not.exist');
          });
        });

        // Submit.
        stopDetailsPage.infoSpots.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        infoSpotView.getSectionContainers().shouldBeVisible();
        stopDetailsPage.infoSpots.getTitle().contains('Infopaikat');

        infoSpotView.getNthViewCardContainer(0).within(() => {
          infoSpotView.getDescription().shouldHaveText('Dynaamisen kuvaus');
          infoSpotView.getLabel().shouldHaveText('IP123');
          infoSpotView.getPurpose().shouldHaveText('Dynaaminen tarkoitus');
          infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
          infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
          infoSpotView.getFloor().shouldHaveText('3');
          infoSpotView.getRailInformation().shouldHaveText('1');
          infoSpotView.getStops().shouldHaveText('V1562');
          infoSpotView.getTerminals().shouldHaveText('-');
          infoSpotView.getZoneLabel().shouldHaveText('A');
          infoSpotView.getNoPosters().shouldHaveText('Ei infotuotetta');
        });

        infoSpotView.getNthViewCardContainer(1).within(() => {
          infoSpotView.getDescription().shouldHaveText('Staattisen kuvaus');
          infoSpotView.getLabel().shouldHaveText('IP125');
          infoSpotView.getBacklight().shouldHaveText('Kyllä');
          infoSpotView.getPosterPlaceSize().shouldHaveText('a3');
          infoSpotView.getNthPosterContainer(1).within(() => {
            infoSpotView.getPosterSize().shouldHaveText('a4');
            infoSpotView.getPosterLabel().shouldHaveText('PT1237');
            infoSpotView.getPosterLines().shouldHaveText('2');
          });
          infoSpotView.getNthPosterContainer(0).within(() => {
            infoSpotView.getPosterSize().shouldHaveText('a3');
            infoSpotView.getPosterLabel().shouldHaveText('PT1236');
            infoSpotView.getPosterLines().shouldHaveText('2, 7, 1');
          });
          infoSpotView.getPurpose().shouldHaveText('Staattisen tarkoitus');
          infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
          infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
          infoSpotView.getFloor().shouldHaveText('2');
          infoSpotView.getRailInformation().shouldHaveText('7');
          infoSpotView.getStops().shouldHaveText('V1562');
          infoSpotView.getTerminals().shouldHaveText('-');
          infoSpotView.getZoneLabel().shouldHaveText('A');
          infoSpotView.getNoPosters().should('not.exist');
        });

        // Delete poster
        infoSpotView.getNthSectionContainer(0).within(() => {
          stopDetailsPage.infoSpots.getEditButton().click();
          infoSpotView.getSectionContainers().should('not.exist');

          const infoSpot = infoSpotForm.infoSpots;
          infoSpotForm.getNthInfoSpot(1).within(() => {
            infoSpot.getLabel().should('have.value', 'IP125');
            infoSpot.getPurpose().should('have.value', 'Staattisen tarkoitus');
            infoSpot.getPosterPlaceSizeButton().should('have.text', 'A3');
            infoSpot.getBacklightButton().should('have.text', 'Kyllä');
            infoSpot.getDescription().should('have.value', 'Staattisen kuvaus');
            infoSpot.getNthPosterContainer(0).within(() => {
              infoSpot.getPosterLabel().should('have.value', 'PT1236');
              infoSpot.getPosterSizeButton().should('have.text', 'A3');
              infoSpot.getPosterLines().should('have.value', '2, 7, 1');
            });
            infoSpot.getNthPosterContainer(1).within(() => {
              infoSpot.getPosterLabel().should('have.value', 'PT1237');
              infoSpot.getPosterSizeButton().should('have.text', 'A4');
              infoSpot.getPosterLines().should('have.value', '2');
            });
            infoSpot.getZoneLabel().should('have.value', 'A');
            infoSpot.getRailInformation().should('have.value', '7');
            infoSpot.getFloor().should('have.value', '2');

            // Delete poster
            infoSpot.getNthPosterContainer(1).within(() => {
              infoSpot
                .getDeletePosterButton()
                .shouldHaveText('Poista infotuote');
              infoSpot.getDeletePosterButton().click();
              infoSpot.getDeletePosterButton().shouldHaveText('Peruuta poisto');
              infoSpot.getDeletePosterButton().click();
              infoSpot
                .getDeletePosterButton()
                .shouldHaveText('Poista infotuote');
              infoSpot.getDeletePosterButton().click();
              infoSpot.getDeletePosterButton().shouldHaveText('Peruuta poisto');
            });
          });
        });

        // Submit.
        stopDetailsPage.infoSpots.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');
        infoSpotView.getSectionContainers().shouldBeVisible();

        infoSpotView.getNthViewCardContainer(1).within(() => {
          infoSpotView.getDescription().shouldHaveText('Staattisen kuvaus');
          infoSpotView.getLabel().shouldHaveText('IP125');
          infoSpotView.getBacklight().shouldHaveText('Kyllä');
          infoSpotView.getPosterPlaceSize().shouldHaveText('a3');
          infoSpotView.getNthPosterContainer(0).within(() => {
            infoSpotView.getPosterSize().shouldHaveText('a3');
            infoSpotView.getPosterLabel().shouldHaveText('PT1236');
            infoSpotView.getPosterLines().shouldHaveText('2, 7, 1');
          });
          infoSpotView.getPurpose().shouldHaveText('Staattisen tarkoitus');
          infoSpotView.getLatitude().shouldHaveText('60.16490775039894');
          infoSpotView.getLongitude().shouldHaveText('24.92904198486008');
          infoSpotView.getFloor().shouldHaveText('2');
          infoSpotView.getRailInformation().shouldHaveText('7');
          infoSpotView.getStops().shouldHaveText('V1562');
          infoSpotView.getTerminals().shouldHaveText('-');
          infoSpotView.getZoneLabel().shouldHaveText('A');
        });
      },
    );
    it(
      'should show info text when there are no shelters',
      { tags: [Tag.StopRegistry] },
      () => {
        // First, delete all existing shelters
        stopDetailsPage.technicalFeaturesTabButton().click();
        stopDetailsPage.shelters.getEditButton().click();
        stopDetailsPage.shelters.viewCard.getContainers().should('not.exist');

        stopDetailsPage.shelters.form.getShelters().each(($shelter, index) => {
          stopDetailsPage.shelters.form.getNthShelter(index).within(() => {
            stopDetailsPage.shelters.form.shelters
              .getDeleteShelterButton()
              .click();
            stopDetailsPage.shelters.form.shelters
              .getShelterTypeDropdownButton()
              .shouldBeDisabled();
          });
        });

        stopDetailsPage.shelters.getSaveButton().click();
        toast.expectSuccessToast('Pysäkki muokattu');

        stopDetailsPage.shelters.viewCard.getContainers().should('not.exist');
        stopDetailsPage.shelters
          .getTitle()
          .should('have.text', 'Ei pysäkkikatosta');

        stopDetailsPage.infoSpotsTabButton().click();

        stopDetailsPage.infoSpots.getNoSheltersInfoText().should('be.visible');
        stopDetailsPage.infoSpots
          .getNoSheltersInfoText()
          .should(
            'contain.text',
            'Ei infopaikkoja. Mene Tekniset ominaisuudet -välilehdelle ja lisää ensin katostyyppi.',
          );
      },
    );
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

    function testValidityPeriodValidation(form: StopVersionForm) {
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
      versionName: string,
      validityStartISODate: string,
      validityEndISODate?: string,
      priority?: Priority,
    ) {
      stopDetailsPage.titleRow.actionsMenuButton().click();
      stopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = stopDetailsPage;
      const { form } = copyModal;

      copyModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType(versionName);

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

      toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
    }

    it('should create a copy', () => {
      stopDetailsPage.visit('H2003');

      stopDetailsPage.titleRow.actionsMenuButton().click();
      stopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = stopDetailsPage;
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

          testValidityPeriodValidation(form);

          form.versionName().clearAndType('Uusi versio');
          form.versionDescription().shouldBeDisabled();
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({ validityStartISODate: '2050-06-01' });
          form.submitButton().click();
        });

      toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');

      stopDetailsPage.validityPeriod().shouldHaveText('1.6.2050-');

      verifyInitialBasicDetails();
      verifyInitialLocationDetails();
      verifyInitialSignageDetails();
      verifyInitialExternalLinks();

      stopDetailsPage.technicalFeaturesTabButton().click();
      verifyInitialShelters();
      verifyInitialMeasurements();
      verifyInitialMaintenanceDetails();

      stopDetailsPage.infoSpotsTabButton().click();

      stopDetailsPage.infoSpots.viewCard
        .getNthSectionContainer(0)
        .within(() => {
          verifyInfoSpotJP1234568({
            lat: '60.166003223527824',
            lon: '24.932072417514647',
            stops: 'H2003',
          });
        });
    });

    it('should allow opening a specified priority version', () => {
      // Create Temp Version
      stopDetailsPage.visit('H2003');
      stopDetailsPage.titleRow.actionsMenuButton().click();
      stopDetailsPage.titleRow
        .actionsMenuCopyButton()
        .should('not.be.disabled')
        .click();

      const { copyModal } = stopDetailsPage;
      const { form } = copyModal;

      copyModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Temp version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({ validityStartISODate: '2020-03-20' });
          form.submitButton().click();
        });

      toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-');

      // Create Draft Version
      stopDetailsPage.visit('H2003');
      stopDetailsPage.titleRow.actionsMenuButton().click();
      stopDetailsPage.titleRow.actionsMenuCopyButton().click();

      copyModal.modal().within(() => {
        form.versionName().clearAndType('Draft version');
        form.priority.setPriority(Priority.Draft);
        form.validity.fillForm({
          validityStartISODate: '2020-03-20',
          validityEndISODate: '2020-04-01',
        });
        form.submitButton().click();
      });

      toast.expectSuccessToast('Uusi versio luotu\nAvataan uusi versio');
      copyModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-1.4.2020');

      // Reopen Temp version
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2020-03-20&priority=20`,
      );
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-');

      // Return to showing the Draft version
      stopDetailsPage
        .returnToDateBasedVersionSelection()
        .shouldBeVisible()
        .click();
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().shouldHaveText('20.3.2020-1.4.2020');
    });

    it('should modify a version without overlap', () => {
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();

      stopDetailsPage.titleRow.label().shouldHaveText('H2003');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');

      stopDetailsPage.titleRow.editValidityButton().click();
      const { editStopModal } = stopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Shorter version');
          form.priority.setPriority(Priority.Standard);
          form.validity.fillForm({
            validityStartISODate: '2020-03-20',
            validityEndISODate: '2030-05-31',
          });
          form.submitButton().click();
        });

      toast.expectSuccessToast('Versio muokattu');
      editStopModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2030');

      stopDetailsPage.titleRow.editValidityButton().click();
      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Longer version');
          form.priority.setPriority(Priority.Standard);
          form.validity.fillForm({
            validityStartISODate: '2020-03-20',
            validityEndISODate: undefined,
          });
          form.submitButton().click();
        });

      toast.expectSuccessToast('Versio muokattu');
      editStopModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-');
    });

    it('should change priority', () => {
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();

      stopDetailsPage.titleRow.label().shouldHaveText('H2003');

      createCopyForVersionTesting(
        'Draft version',
        '2030-01-01',
        '2030-01-31',
        Priority.Draft,
      );
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      stopDetailsPage.titleRow.editValidityButton().click();
      const { editStopModal } = stopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Temporary version');
          form.priority.setPriority(Priority.Temporary);
          form.submitButton().click();
        });

      toast.expectSuccessToast('Versio muokattu');
      editStopModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      // Check that priority has changed
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=30`,
      );
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage
        .page()
        .should('contain', 'Pysäkki ei ole voimassa valittuna päivänä.');

      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=20`,
      );
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');
    });

    it('should change priority and cut overlap', () => {
      stopDetailsPage.visit('H2003');
      stopDetailsPage.page().shouldBeVisible();

      stopDetailsPage.titleRow.label().shouldHaveText('H2003');

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
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-31.1.2030');

      stopDetailsPage.titleRow.editValidityButton().click();
      const { editStopModal } = stopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Temporary version with overlap');
          form.validity.fillForm({
            validityStartISODate: '2030-01-01',
            validityEndISODate: '2030-02-28',
          });
          form.priority.setPriority(Priority.Temporary);
          form.submitButton().click();
        });

      // Validate cut confirmation modal
      const { overlappingCutConfirmationModal } = stopDetailsPage;
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

      toast.expectSuccessToast('Versio muokattu');
      editStopModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-28.2.2030');

      // Check that priority has changed
      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=30`,
      );
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage
        .page()
        .should('contain', 'Pysäkki ei ole voimassa valittuna päivänä.');

      cy.visit(
        `/stop-registry/stops/H2003?observationDate=2030-01-01&priority=20`,
      );
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '1.1.2030-28.2.2030');
    });

    it('should not allow cut validity when overlapping whole version', () => {
      // Insert two versions with temporary priority
      stopDetailsPage.visit('H2003');

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
      stopDetailsPage.titleRow.editValidityButton().click();
      const { editStopModal } = stopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Overlapping version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({
            validityStartISODate: '2030-03-15',
            validityEndISODate: '2030-03-25',
          });

          form.submitButton().click();
        });

      toast.expectDangerToast('Päällekkäisen version leikkaaminen ei onnistu.');
    });

    it('should modify a version with overlapping validity period', () => {
      // Insert two versions with temporary priority
      stopDetailsPage.visit('H2003');

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
      stopDetailsPage.titleRow.editValidityButton().click();
      const { editStopModal } = stopDetailsPage;
      const { form } = editStopModal;

      editStopModal
        .modal()
        .should('exist')
        .within(() => {
          form.versionName().clearAndType('Overlapping version');
          form.priority.setPriority(Priority.Temporary);
          form.validity.fillForm({
            validityStartISODate: '2030-03-15',
            validityEndISODate: '2030-03-25',
          });
          form.submitButton().click();
        });

      // Validate cut confirmation modal
      const { overlappingCutConfirmationModal } = stopDetailsPage;
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

      toast.expectSuccessToast('Versio muokattu');
      editStopModal.modal().should('not.exist');
      overlappingCutConfirmationModal.modal().should('not.exist');
      stopDetailsPage.loadingStopDetails().should('not.exist');
      stopDetailsPage.validityPeriod().should('contain', '15.3.2030-25.3.2030');
    });
  });

  // A regression test to ensure that our mutations don't eg. reset any fields they are not supposed to.
  it('should keep stop place intact when submitting without actual changes', () => {
    stopDetailsPage.visit('H2003');
    stopDetailsPage.page().shouldBeVisible();

    verifyInitialBasicDetails();
    verifyInitialLocationDetails();
    verifyInitialSignageDetails();

    // Submit each section, without any actual changes.
    stopDetailsPage.basicDetails.getEditButton().click();
    stopDetailsPage.basicDetails.getSaveButton().click();
    toast.expectSuccessToast('Pysäkki muokattu');

    stopDetailsPage.locationDetails.getEditButton().click();
    stopDetailsPage.locationDetails.getSaveButton().click();
    toast.expectSuccessToast('Pysäkki muokattu');

    stopDetailsPage.signageDetails.getEditButton().click();
    stopDetailsPage.signageDetails.getSaveButton().click();
    toast.expectSuccessToast('Pysäkki muokattu');

    stopDetailsPage.technicalFeaturesTabButton().click();
    stopDetailsPage.shelters.getEditButton().click();
    stopDetailsPage.shelters.getSaveButton().click();
    toast.expectSuccessToast('Pysäkki muokattu');

    stopDetailsPage.measurements.getEditButton().click();
    stopDetailsPage.measurements.getSaveButton().click();
    toast.expectSuccessToast('Pysäkki muokattu');

    // The stop should have same data as when we started.
    stopDetailsPage.basicDetailsTabButton().click();
    verifyInitialBasicDetails();
    verifyInitialLocationDetails();
    verifyInitialSignageDetails();
    verifyInitialExternalLinks();

    stopDetailsPage.technicalFeaturesTabButton().click();
    verifyInitialShelters();
    verifyInitialMeasurements();
    verifyInitialMaintenanceDetails();
  });
});
