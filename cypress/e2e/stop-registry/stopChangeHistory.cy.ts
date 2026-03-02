import {
  GetInfrastructureLinksByExternalIdsResult,
  KnownValueKey,
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
  seedOrganisations,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import { Tag } from '../../enums';
import {
  BasicDetailsForm,
  LocationDetailsForm,
  MeasurementsForm,
  Pagination,
  SelectStopDropdown,
  SheltersForm,
  SignageDetailsForm,
  StopAreaDetailsPage,
  StopChangeHistoryPage,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { InsertedStopRegistryIds } from '../utils';

const testInfraLinks = [
  {
    externalId: '7d29bd61-6cf7-4d2c-8bd8-b8e835fe90b7:1',
    coordinates: [24.92669962, 60.16418108, 10.09699999],
  },
];

const timingPlaces = [
  buildTimingPlace('352f8fd6-0eaa-4b01-a2db-734431092d62', '1AACKT'),
  buildTimingPlace('0388c3fb-a08b-461c-8655-581f06e9c2f5', '1AURLA'),
];

const buildScheduledStopPoints = (
  infrastructureLinkIds: UUID[],
): StopInsertInput[] => [
  {
    ...buildStop({
      label: 'H2003',
      located_on_infrastructure_link_id: infrastructureLinkIds[0],
    }),
    validity_start: DateTime.fromISO('2020-03-20'),
    validity_end: DateTime.fromISO('2050-05-31'),
    scheduled_stop_point_id: '29dfb688-7ecc-4cb5-876d-c2c7f1a1f00a',
    timing_place_id: timingPlaces[0].timing_place_id,
    measured_location: {
      type: 'Point',
      coordinates: testInfraLinks[0].coordinates,
    },
  },
];

const stopAreaInput: StopAreaInput = {
  StopArea: {
    privateCode: { type: 'HSL/TEST', value: 'AreaA' },
    name: { lang: 'fin', value: 'Pohjoisesplanadi' },
    transportMode: StopRegistryTransportModeType.Tram,
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
        keyValues: quayH2003.quay.keyValues?.map((it) => {
          if (it?.key === KnownValueKey.RailReplacement) {
            return { key: it.key, values: ['false'] };
          }

          return it;
        }),
        organisations: quayH2003.organisations as
          | StopRegistryStopPlaceOrganisationRefInput[]
          | null,
      },
    ],
  },
  organisations: null,
};

const altStopAreaInput: StopAreaInput = {
  StopArea: {
    privateCode: { type: 'HSL/TEST', value: 'AreaB' },
    name: { lang: 'fin', value: 'Eteläesplanadi' },
    transportMode: StopRegistryTransportModeType.Tram,
    alternativeNames: [
      {
        name: { lang: 'swe', value: 'Södraesplanaden' },
        nameType: StopRegistryNameType.Translation,
      },
    ],
    geometry: quayH2003.quay.geometry,
    quays: [quayV1562.quay],
  },
  organisations: null,
};

const terminalTH2003: TerminalInput = {
  terminal: {
    privateCode: { type: 'HSL/TEST', value: 'TestTerminal' },
    name: { lang: 'fin', value: 'E2ETH2003' },
    description: { lang: 'fin', value: 'E2E testiterminaali TestTerminal' },
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
  memberLabels: ['AreaB'],
};

const tags = [Tag.StopRegistry, Tag.ChangeHistory];
describe('Stop Change History', { tags }, () => {
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
        timingPlaces,
        stops,
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');

    insertToDbHelper(dbResources);

    cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: [stopAreaInput],
      organisations: seedOrganisations,
    });

    cy.setupTests();
    cy.mockLogin();
  });

  describe('Value diffs', () => {
    const changed = {
      baseDetails: {
        reason: ['', 'Testimuutoksia perustietoihin'],
        privateCode: ['10003', '30001'],
        locationFin: ['Pohjoisesplanadi (sij.)', 'LocFin'],
        locationSwe: ['Norraesplanaden (plats)', 'LocSwe'],
        elyCode: ['1234567', '7654321'],
        type: ['Raitiovaunu', 'Bussi'],
        railReplacement: ['Ei', 'Kyllä'],
        virtual: ['Ei', 'Kyllä'],
        timingPlace: ['-', '1AURLA'],
      },

      locationDetails: {
        reason: ['', 'Testimuutoksia sijaintitietoihin'],
        address: ['Mannerheimintie 22-24', 'Mannerheimintie 1'],
        postalCode: ['00100', '00101'],
        functionalArea: ['20 m', '10 m'],
        platformNumber: ['A2', '1'],
        signContentType: ['Kilpi', 'Ei opastetta'],
      },

      signageDetails: {
        type: ['Tolppamerkki', 'Katoskehikko'],
        frames: ['12', '7'],
        replacesRails: ['Ei', 'Kyllä'],
        instructions: ['Ohjetekstiä...', 'Uudet ohjeet'],
      },

      measurements: {
        // Dropdowns
        type: ['Syvennys', 'Uloke'],
        curved: ['Ei', 'Kyllä'],
        shelter: ['Leveä', 'Kapea'],
        guidance: ['Pisteopaste', 'Ei opastetta'],
        map: ['Kohokartta', 'Muu kartta'],
        ramp: [
          'LR - Luiskattu reunatukiosuus',
          'RK4 - Pystysuora reunatukiosuus',
        ],
        accessible: ['Esteellinen', 'Esteetön'],
      },

      updatedShelter: {
        number: ['1', '2'],
        equipmentNumber: ['12345', '54321'],
        type: ['Teräskatos', 'Lasikatos'],
        electricity: ['Jatkuva sähkö', 'Tilapäisesti pois'],
        lightning: ['Kyllä', 'Ei'],
        condition: ['Välttävä', 'Hyvä'],
        timetableCabinets: ['1', '2'],
        // Checkboxes are checked and will be unchecked: assertUnchecked
      },
    } as const satisfies Readonly<
      Record<string, Readonly<Record<string, readonly [string, string]>>>
    >;

    function assertValueChanged([oldValue, newValue]: readonly [
      string,
      string,
    ]) {
      return () => {
        StopChangeHistoryPage.changeHistoryTable.changedValues
          .getOldValue()
          .shouldHaveText(oldValue);
        StopChangeHistoryPage.changeHistoryTable.changedValues
          .getNewValue()
          .shouldHaveText(newValue);
      };
    }

    function assertUnchecked() {
      return assertValueChanged(['Kyllä', 'Ei']);
    }

    function assertChangedToPi() {
      return () => {
        StopChangeHistoryPage.changeHistoryTable.changedValues
          .getOldValue()
          .should('not.contain.text', '3,14');
        StopChangeHistoryPage.changeHistoryTable.changedValues
          .getNewValue()
          .contains('3,14');
      };
    }

    function assertChangedRemoved([, newValue]: readonly [string, string]) {
      return assertValueChanged([newValue, '']);
    }

    function assertChangedAdded([, newValue]: readonly [string, string]) {
      return assertValueChanged(['', newValue]);
    }

    it('Should diff Stop Area and Terminal changes', () => {
      cy.section('Insert Alternative Stop Area', () => {
        cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
          stopPlaces: [altStopAreaInput],
          terminals: [terminalTH2003],
          stopPointsRequired: false,
        });
      });

      cy.section('Move Stop to the Alternative Stop Area', () => {
        StopAreaDetailsPage.visit('AreaB');
        StopAreaDetailsPage.memberStops.getAddStopButton().click();
        StopAreaDetailsPage.memberStops.modal.modal().shouldBeVisible();
        SelectStopDropdown.dropdownButton().click();
        SelectStopDropdown.getInput().click();
        SelectStopDropdown.getInput().clearAndType('H2003');
        SelectStopDropdown.common.getMemberOptions().should('have.length', 1);
        SelectStopDropdown.common
          .getMemberOptions()
          .eq(0)
          .should('contain.text', 'H2003')
          .click();

        StopAreaDetailsPage.memberStops.modal.setTransferDate(
          DateTime.now().toISODate() ?? '',
        );
        StopAreaDetailsPage.memberStops.modal.getStopVersionsButton().click();

        StopAreaDetailsPage.memberStops.modal
          .getStopVersionsList()
          .shouldBeVisible();

        StopAreaDetailsPage.memberStops.modal.saveButton().click();
      });

      cy.section('Check change history', () => {
        StopDetailsPage.visit('H2003');
        StopDetailsPage.page().shouldBeVisible();
        StopDetailsPage.changeHistoryLink().click();

        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getStopPlaceDetails()
          .within(() =>
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains('Pysäkkialue ja terminaali'),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.stopPlaceDetails
          .getStopAreaNameFin()
          .within(assertValueChanged(['Pohjoisesplanadi', 'Eteläesplanadi']));

        StopChangeHistoryPage.changeHistoryTable.changedValues.stopPlaceDetails
          .getStopAreaNameSwe()
          .within(assertValueChanged(['Norraesplanaden', 'Södraesplanaden']));

        StopChangeHistoryPage.changeHistoryTable.changedValues.stopPlaceDetails
          .getTerminalNameFin()
          .within(assertValueChanged(['-', 'E2ETH2003']));
      });
    });

    it('Should diff Basic Details', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      cy.section('Make changes', () => {
        StopDetailsPage.basicDetails.getEditButton().click();

        BasicDetailsForm.getPrivateCodeInput().clearAndType(
          changed.baseDetails.privateCode[1],
        );
        BasicDetailsForm.getLocationFinInput().clearAndType(
          changed.baseDetails.locationFin[1],
        );
        BasicDetailsForm.getLocationSweInput().clearAndType(
          changed.baseDetails.locationSwe[1],
        );
        BasicDetailsForm.getElyNumberInput().clearAndType(
          changed.baseDetails.elyCode[1],
        );

        BasicDetailsForm.getTransportModeDropdownButton().click();
        BasicDetailsForm.getTransportModeDropdownOptions()
          .contains('Bussi')
          .click();
        BasicDetailsForm.getRailReplacementCheckbox().click();
        BasicDetailsForm.getVirtualCheckbox().click();

        BasicDetailsForm.getStopPlaceStateDropdownButton().click();
        BasicDetailsForm.getStopPlaceStateDropdownOptions()
          .contains('Käytössä')
          .click();

        BasicDetailsForm.getTimingPlaceDropdown().type('1AURLA');
        cy.get('[role="option"]').contains('1AURLA').click();

        BasicDetailsForm.reasonForChange
          .getReasonForChangeInput()
          .clearAndType(changed.baseDetails.reason[1]);
        StopDetailsPage.basicDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();

      cy.section('Check change history', () => {
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getBasicDetails()
          .within(() => {
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains('Perustiedot');
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains(changed.baseDetails.reason[1]);
          });

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getPrivateCode()
          .within(assertValueChanged(changed.baseDetails.privateCode));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getLocationFin()
          .within(assertValueChanged(changed.baseDetails.locationFin));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getLocationSwe()
          .within(assertValueChanged(changed.baseDetails.locationSwe));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getElyNumber()
          .within(assertValueChanged(changed.baseDetails.elyCode));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getTransportMode()
          .within(assertValueChanged(changed.baseDetails.type));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getRailReplacement()
          .within(() =>
            assertValueChanged(changed.baseDetails.railReplacement),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getVirtual()
          .within(assertValueChanged(changed.baseDetails.virtual));

        StopChangeHistoryPage.changeHistoryTable.changedValues.basicDetails
          .getTimingPlaceId()
          .within(assertValueChanged(changed.baseDetails.timingPlace));
      });
    });

    it('Should diff Location Details', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      cy.section('Make changes', () => {
        StopDetailsPage.locationDetails.getEditButton().click();
        LocationDetailsForm.getStreetAddressInput().clearAndType(
          changed.locationDetails.address[1],
        );
        LocationDetailsForm.getPostalCodeInput().clearAndType(
          changed.locationDetails.postalCode[1],
        );
        // Altitude, Latitude & Longitude cannot be changed here.
        LocationDetailsForm.getFunctionalAreaInput().clearAndType(
          String(
            Number.parseInt(changed.locationDetails.functionalArea[1], 10),
          ),
        );
        LocationDetailsForm.getPlatformNumber().clearAndType(
          changed.locationDetails.platformNumber[1],
        );
        LocationDetailsForm.getSignContentTypeDropdownButton().click();
        LocationDetailsForm.getSignContentTypeDropdownOptions()
          .contains('Ei opastetta')
          .click();

        LocationDetailsForm.reasonForChange
          .getReasonForChangeInput()
          .clearAndType(changed.locationDetails.reason[1]);
        StopDetailsPage.locationDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();

      cy.section('Check change history', () => {
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getLocationDetails()
          .within(() => {
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains('Sijainti');
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains(changed.locationDetails.reason[1]);
          });

        StopChangeHistoryPage.changeHistoryTable.changedValues.locationDetails
          .getStreetAddress()
          .within(assertValueChanged(changed.locationDetails.address));

        StopChangeHistoryPage.changeHistoryTable.changedValues.locationDetails
          .getPostalCode()
          .within(assertValueChanged(changed.locationDetails.postalCode));

        StopChangeHistoryPage.changeHistoryTable.changedValues.locationDetails
          .getFunctionalArea()
          .within(() =>
            assertValueChanged(changed.locationDetails.functionalArea),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.locationDetails
          .getPlatformNumber()
          .within(() =>
            assertValueChanged(changed.locationDetails.platformNumber),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.locationDetails
          .getSignContentType()
          .within(() =>
            assertValueChanged(changed.locationDetails.signContentType),
          );
      });
    });

    it('Should diff Signage Details', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      cy.section('Make changes', () => {
        StopDetailsPage.signageDetails.getEditButton().click();

        SignageDetailsForm.getSignTypeDropdownButton().click();
        SignageDetailsForm.getSignTypeDropdownOptions()
          .contains('Katoskehikko')
          .click();

        SignageDetailsForm.getNumberOfFramesInput().clearAndType(
          changed.signageDetails.frames[1],
        );
        SignageDetailsForm.getReplacesRailSignCheckbox().click();
        SignageDetailsForm.getSignageInstructionExceptionsInput().clearAndType(
          changed.signageDetails.instructions[1],
        );

        StopDetailsPage.signageDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();

      cy.section('Check change history', () => {
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getSignDetails()
          .within(() =>
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains('Pysäkkikilvet'),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.signDetails
          .getSignType()
          .within(assertValueChanged(changed.signageDetails.type));

        StopChangeHistoryPage.changeHistoryTable.changedValues.signDetails
          .getNumberOfFrames()
          .within(assertValueChanged(changed.signageDetails.frames));

        StopChangeHistoryPage.changeHistoryTable.changedValues.signDetails
          .getReplacesRailSign()
          .within(() =>
            assertValueChanged(changed.signageDetails.replacesRails),
          );

        StopChangeHistoryPage.changeHistoryTable.changedValues.signDetails
          .getSignageInstructionExceptions()
          .within(() =>
            assertValueChanged(changed.signageDetails.instructions),
          );
      });
    });

    it('Should diff Measurement Details', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();
      StopDetailsPage.technicalFeaturesTabButton().click();

      cy.section('Make changes', () => {
        StopDetailsPage.measurements.getEditButton().click();

        // Reset all numeric and text fields to empty.
        MeasurementsForm.getContainer()
          .find('input[type=text],input[type=number]')
          .each((input) => cy.wrap(input).clearAndType('3.14'));

        // Uncheck all checkboxes
        MeasurementsForm.getContainer()
          .find('input[type=checkbox]')
          .click({ multiple: true });

        // Change dropdown values
        MeasurementsForm.getStopTypeDropdownButton().click();
        MeasurementsForm.getStopTypeDropdownOptions()
          .contains(changed.measurements.type[1])
          .click();

        MeasurementsForm.getCurvedStopDropdownButton().click();
        MeasurementsForm.getCurvedStopDropdownOptions()
          .contains(changed.measurements.curved[1])
          .click();

        MeasurementsForm.getShelterTypeDropdownButton().click();
        MeasurementsForm.getShelterTypeDropdownOptions()
          .contains(changed.measurements.shelter[1])
          .click();

        MeasurementsForm.getGuidanceTypeDropdownButton().click();
        MeasurementsForm.getGuidanceTypeDropdownOptions()
          .contains(changed.measurements.guidance[1])
          .click();

        MeasurementsForm.getMapTypeDropdownButton().click();
        MeasurementsForm.getMapTypeDropdownOptions()
          .contains(changed.measurements.map[1])
          .click();

        MeasurementsForm.getPedestrianCrossingRampTypeDropdownButton().click();
        MeasurementsForm.getPedestrianCrossingRampTypeDropdownOptions()
          .contains(changed.measurements.ramp[1])
          .click();

        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownButton().click();
        MeasurementsForm.getStopAreaSurroundingsAccessibleDropdownOptions()
          .contains(changed.measurements.accessible[1])
          .click();

        StopDetailsPage.measurements.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();

      cy.section('Check change history', () => {
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getMeasurementDetails()
          .within(() =>
            StopChangeHistoryPage.changeHistoryTable.sectionHeader
              .getTitle()
              .contains('Mitat ja esteettömyys'),
          );

        // Assert dropdowns were changed to expected values
        const { measurementDetails } =
          StopChangeHistoryPage.changeHistoryTable.changedValues;
        measurementDetails
          .getStopType()
          .within(assertValueChanged(changed.measurements.type));

        measurementDetails
          .getCurvedStop()
          .within(assertValueChanged(changed.measurements.curved));

        measurementDetails
          .getShelterType()
          .within(assertValueChanged(changed.measurements.shelter));

        measurementDetails
          .getGuidanceType()
          .within(assertValueChanged(changed.measurements.guidance));

        measurementDetails
          .getMapType()
          .within(assertValueChanged(changed.measurements.map));

        measurementDetails
          .getPedestrianCrossingRampType()
          .within(assertValueChanged(changed.measurements.ramp));

        measurementDetails
          .getStopAreaSurroundingsAccessible()
          .within(assertValueChanged(changed.measurements.accessible));

        // Assert checkboxes were unset
        measurementDetails
          .getPlatformEdgeWarningArea()
          .within(assertUnchecked());
        measurementDetails
          .getSidewalkAccessibleConnection()
          .within(assertUnchecked());
        measurementDetails.getGuidanceStripe().within(assertUnchecked());
        measurementDetails.getServiceAreaStripes().within(assertUnchecked());
        measurementDetails.getGuidanceTiles().within(assertUnchecked());

        // Assert text/number fields were changed Pi
        measurementDetails.getShelterLaneDistance().within(assertChangedToPi());
        measurementDetails
          .getCurbBackOfRailDistance()
          .within(assertChangedToPi());
        measurementDetails.getStopAreaSideSlope().within(assertChangedToPi());
        measurementDetails
          .getStructureLaneDistance()
          .within(assertChangedToPi());
        measurementDetails
          .getStopElevationFromRailTop()
          .within(assertChangedToPi());
        measurementDetails
          .getStopElevationFromSidewalk()
          .within(assertChangedToPi());
        measurementDetails.getLowerCleatHeight().within(assertChangedToPi());
        measurementDetails
          .getCurbDriveSideOfRailDistance()
          .within(assertChangedToPi());
        measurementDetails.getEndRampSlope().within(assertChangedToPi());
        measurementDetails.getServiceAreaWidth().within(assertChangedToPi());
        measurementDetails.getServiceAreaLength().within(assertChangedToPi());
      });
    });

    it('Should diff Shelter Details', () => {
      cy.section('Init', () => {
        StopDetailsPage.visit('H2003');
        StopDetailsPage.page().shouldBeVisible();
        StopDetailsPage.technicalFeaturesTabButton().click();
      });

      cy.section('Update existing shelter', () => {
        StopDetailsPage.shelters.getEditButton().click();

        SheltersForm.getNthShelter(0).within(() => {
          SheltersForm.shelters
            .getShelterNumberInput()
            .clearAndType(changed.updatedShelter.number[1]);
          SheltersForm.shelters
            .getShelterExternalIdInput()
            .clearAndType(changed.updatedShelter.equipmentNumber[1]);

          SheltersForm.shelters.getShelterTypeDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            SheltersForm.shelters
              .getShelterTypeDropdownOptions()
              .contains(changed.updatedShelter.type[1])
              .click(),
          );

          SheltersForm.shelters.getShelterElectricityDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            SheltersForm.shelters
              .getShelterElectricityDropdownOptions()
              .contains(changed.updatedShelter.electricity[1])
              .click(),
          );

          SheltersForm.shelters.getShelterLightingDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            SheltersForm.shelters
              .getShelterLightingDropdownOptions()
              .contains(changed.updatedShelter.lightning[1])
              .click(),
          );

          SheltersForm.shelters.getShelterConditionDropdownButton().click();
          cy.withinHeadlessPortal(() =>
            SheltersForm.shelters
              .getShelterConditionDropdownOptions()
              .contains(changed.updatedShelter.condition[1])
              .click(),
          );

          SheltersForm.shelters
            .getTimetableCabinetsInput()
            .clearAndType(changed.updatedShelter.timetableCabinets[1]);

          // Uncheck all checkboxes
          cy.get('input[type=checkbox]:not([hidden])').click({
            multiple: true,
          });
        });

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      cy.section('Add new shelter', () => {
        StopDetailsPage.shelters.getEditButton().click();

        SheltersForm.getNthShelter(0).within(() => {
          SheltersForm.getCopyNewShelterButton().click();
        });

        SheltersForm.getNthShelter(1).within(() => {
          SheltersForm.shelters.getShelterNumberInput().clearAndType('1');
        });

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      cy.section('Remove shelter', () => {
        StopDetailsPage.shelters.getEditButton().click();

        // Assuming sort by shelter number is working, this should be
        // the original shelter that was modified in updateExistingShelter step.
        SheltersForm.getNthShelter(1).within(() =>
          SheltersForm.getDeleteShelterButton().click(),
        );

        StopDetailsPage.shelters.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();

      const {
        sectionHeader,
        changedValues: { shelterDetails },
      } = StopChangeHistoryPage.changeHistoryTable;

      const assertShelter = (
        assertChangeTypeHeader: () => void,
        assertShelterNumber: () => void,
        assertProperInputFields: (
          values: readonly [string, string],
        ) => () => void,
        assertCheckboxInput: () => void,
      ) => {
        sectionHeader
          .getShelterDetails()
          .within(() => sectionHeader.getTitle().contains('Pysäkkikatokset'));

        assertChangeTypeHeader();

        shelterDetails.getShelterNumber().within(assertShelterNumber);

        shelterDetails
          .getShelterExternalId()
          .within(
            assertProperInputFields(changed.updatedShelter.equipmentNumber),
          );

        shelterDetails
          .getShelterType()
          .within(assertProperInputFields(changed.updatedShelter.type));

        shelterDetails
          .getShelterElectricity()
          .within(assertProperInputFields(changed.updatedShelter.electricity));

        shelterDetails
          .getShelterLighting()
          .within(assertProperInputFields(changed.updatedShelter.lightning));

        shelterDetails
          .getShelterCondition()
          .within(assertProperInputFields(changed.updatedShelter.condition));

        shelterDetails
          .getTimetableCabinets()
          .within(
            assertProperInputFields(changed.updatedShelter.timetableCabinets),
          );

        shelterDetails.getTrashCan().within(assertCheckboxInput);
        shelterDetails.getShelterHasDisplay().within(assertCheckboxInput);
        shelterDetails.getBicycleParking().within(assertCheckboxInput);
        shelterDetails.getLeaningRail().within(assertCheckboxInput);
        shelterDetails.getOutsideBench().within(assertCheckboxInput);
        shelterDetails
          .getShelterFasciaBoardTaping()
          .within(assertCheckboxInput);
      };

      cy.section('Check removed shelter history', () => {
        StopChangeHistoryPage.changeHistoryTable.group
          .getAllGroupElements()
          .eq(0)
          .within(() =>
            assertShelter(
              () =>
                shelterDetails
                  .getAllRemovedElements()
                  .should('have.length', 1)
                  .within(assertValueChanged(['Poistettu katos', ''])),
              assertValueChanged(['1', '']),
              assertChangedRemoved,
              assertValueChanged(['Ei', '']),
            ),
          );
      });

      cy.section('Check added shelter history', () => {
        StopChangeHistoryPage.changeHistoryTable.group
          .getAllGroupElements()
          .eq(1)
          .within(() =>
            assertShelter(
              () =>
                shelterDetails
                  .getAllAddedElements()
                  .should('have.length', 1)
                  .within(assertValueChanged(['', 'Uusi katos'])),
              assertValueChanged(['', '1']),
              assertChangedAdded,
              assertValueChanged(['', 'Ei']),
            ),
          );
      });

      cy.section('Check updated shelter history', () => {
        StopChangeHistoryPage.changeHistoryTable.group
          .getAllGroupElements()
          .eq(2)
          .within(() =>
            assertShelter(
              () =>
                shelterDetails
                  .getAllUpdatedElements()
                  .should('have.length', 1)
                  .within(assertValueChanged(['Päivitetty katos', ''])),
              assertValueChanged(changed.updatedShelter.number),
              assertValueChanged,
              assertValueChanged(['Kyllä', 'Ei']),
            ),
          );
      });
    });
  });

  describe('Sorting', () => {
    type SortChangeHistoryBy =
      | 'ValidityStart'
      | 'ValidityEnd'
      | 'Changed'
      | 'ChangedBy';
    type SortOrder = 'asc' | 'desc';

    function assertSortButtonState(by: SortChangeHistoryBy, order: SortOrder) {
      StopChangeHistoryPage.changeHistoryTable.sortByButton
        .getValidityStart()
        .should('have.attr', 'data-is-active', String(by === 'ValidityStart'))
        .and('have.attr', 'data-sort-direction', order);

      StopChangeHistoryPage.changeHistoryTable.sortByButton
        .getValidityEnd()
        .should('have.attr', 'data-is-active', String(by === 'ValidityEnd'))
        .and('have.attr', 'data-sort-direction', order);

      StopChangeHistoryPage.changeHistoryTable.sortByButton
        .getChanged()
        .should('have.attr', 'data-is-active', String(by === 'Changed'))
        .and('have.attr', 'data-sort-direction', order);

      StopChangeHistoryPage.changeHistoryTable.sortByButton
        .getChangedBy()
        .should('have.attr', 'data-is-active', String(by === 'ChangedBy'))
        .and('have.attr', 'data-sort-direction', order);
    }

    function assertSectionsAreInOrder(
      assertRowPair: (current: HTMLElement, next: HTMLElement) => void,
    ) {
      StopChangeHistoryPage.changeHistoryTable.sectionHeader
        .getAll()
        .each((current, index, rows) => {
          if (index === rows.length - 1) {
            return false;
          }

          assertRowPair(current[0], rows[index + 1]);
          return true;
        });
    }

    function getAndAssertTimeStamps(current: HTMLElement, next: HTMLElement) {
      const currentTimeStamp = current.dataset.timestamp as string;
      const nextTimeStamp = next.dataset.timestamp as string;

      expect(currentTimeStamp).to.be.a('string');
      expect(nextTimeStamp).to.be.a('string');

      return { currentTimeStamp, nextTimeStamp };
    }

    function getAndAssertValidityStartDates(
      current: HTMLElement,
      next: HTMLElement,
    ) {
      const currentDate = current.dataset.validityStart as string;
      const nextDate = next.dataset.validityStart as string;

      expect(currentDate).to.be.a('string');
      expect(nextDate).to.be.a('string');

      return { currentDate, nextDate };
    }

    function getAndAssertValidityEndDates(
      current: HTMLElement,
      next: HTMLElement,
    ) {
      const currentDate = current.dataset.validityEnd as string;
      const nextDate = next.dataset.validityEnd as string;

      expect(currentDate).to.be.a('string');
      expect(nextDate).to.be.a('string');

      return { currentDate, nextDate };
    }

    it('Should sort by Change Time', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      cy.section('Make changes', () => {
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000); // Ensure we get unique timestamps
        StopDetailsPage.basicDetails.getEditButton().click();
        BasicDetailsForm.getPrivateCodeInput().clearAndType('1');
        StopDetailsPage.basicDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000); // Ensure we get unique timestamps
        StopDetailsPage.basicDetails.getEditButton().click();
        BasicDetailsForm.getPrivateCodeInput().clearAndType('2');
        StopDetailsPage.basicDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();
      expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');

      cy.section('Check sorting by Change time', () => {
        cy.info('Should be sorted from newest to oldest.');
        cy.info('Sort buttons should have correct state by default.');
        assertSortButtonState('Changed', 'desc');

        cy.info('Data rows should be ordered correctly Changed|Desc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentTimeStamp, nextTimeStamp } = getAndAssertTimeStamps(
            current,
            next,
          );

          expect(
            currentTimeStamp >= nextTimeStamp,
            `Expected ${currentTimeStamp} >= ${nextTimeStamp} to be true!`,
          ).to.eq(true);
        });

        cy.info('Reverse sort order');
        StopChangeHistoryPage.changeHistoryTable.sortByButton
          .getChanged()
          .filter(':visible')
          .click();
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');
        cy.info('Sort buttons should have new correct state.');
        assertSortButtonState('Changed', 'asc');
        cy.info('Data rows should be ordered correctly Changed|Asc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentTimeStamp, nextTimeStamp } = getAndAssertTimeStamps(
            current,
            next,
          );

          expect(
            currentTimeStamp <= nextTimeStamp,
            `Expected ${currentTimeStamp} <= ${nextTimeStamp} to be true!`,
          ).to.eq(true);
        });
      });
    });

    it('Should sort by Validity times', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      const today = DateTime.now();

      cy.section('Make changes', () => {
        // First validity period change.
        StopDetailsPage.editStopValidityButton().click();
        StopDetailsPage.editStopModal.form.priority.setAsStandard();
        StopDetailsPage.editStopModal.form.validity.setStartDate(
          today.toISODate(),
        );
        StopDetailsPage.editStopModal.form.validity.setEndDate('2029-12-31');
        StopDetailsPage.editStopModal.form.submitButton().click();
        Toast.expectSuccessToast('Versio muokattu');

        // Another change
        StopDetailsPage.editStopValidityButton().click();
        StopDetailsPage.editStopModal.form.priority.setAsStandard();
        StopDetailsPage.editStopModal.form.validity.setStartDate('2030-01-01');
        StopDetailsPage.editStopModal.form.validity.setEndDate('2039-12-31');
        StopDetailsPage.editStopModal.form.submitButton().click();
        Toast.expectSuccessToast('Versio muokattu');
      });

      StopDetailsPage.changeHistoryLink().click();
      expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');

      cy.section('Check sorting by Validity Start date', () => {
        StopChangeHistoryPage.changeHistoryTable.sortByButton
          .getValidityStart()
          .filter(':visible')
          .click();
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');
        assertSortButtonState('ValidityStart', 'desc');

        cy.info('Data rows should be ordered correctly ValidityStart|Desc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentDate, nextDate } = getAndAssertValidityStartDates(
            current,
            next,
          );

          expect(
            currentDate >= nextDate,
            `Expected ${currentDate} >= ${nextDate} to be true!`,
          ).to.eq(true);
        });

        cy.info('Reverse sort order');
        StopChangeHistoryPage.changeHistoryTable.sortByButton
          .getValidityStart()
          .filter(':visible')
          .click();
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');
        cy.info('Sort buttons should have new correct state.');
        assertSortButtonState('ValidityStart', 'asc');
        cy.info('Data rows should be ordered correctly ValidityStart|Asc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentDate, nextDate } = getAndAssertValidityStartDates(
            current,
            next,
          );

          expect(
            currentDate <= nextDate,
            `Expected ${currentDate} <= ${nextDate} to be true!`,
          ).to.eq(true);
        });
      });

      cy.section('Check sorting by Validity End date', () => {
        StopChangeHistoryPage.changeHistoryTable.sortByButton
          .getValidityEnd()
          .filter(':visible')
          .click();
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');
        assertSortButtonState('ValidityEnd', 'asc');
        cy.info('Data rows should be ordered correctly ValidityEnd|Asc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentDate, nextDate } = getAndAssertValidityEndDates(
            current,
            next,
          );

          expect(
            currentDate <= nextDate,
            `Expected ${currentDate} <= ${nextDate} to be true!`,
          ).to.eq(true);
        });

        cy.info('Reverse sort order');
        StopChangeHistoryPage.changeHistoryTable.sortByButton
          .getValidityEnd()
          .filter(':visible')
          .click();
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');
        cy.info('Sort buttons should have new correct state.');
        assertSortButtonState('ValidityEnd', 'desc');
        cy.info('Data rows should be ordered correctly ValidityEnd|Desc.');
        assertSectionsAreInOrder((current, next) => {
          const { currentDate, nextDate } = getAndAssertValidityEndDates(
            current,
            next,
          );

          expect(
            currentDate >= nextDate,
            `Expected ${currentDate} >= ${nextDate} to be true!`,
          ).to.eq(true);
        });
      });
    });
  });

  describe('Filtering and paging', () => {
    it('Should filter and page items', () => {
      StopDetailsPage.visit('H2003');
      StopDetailsPage.page().shouldBeVisible();

      cy.section('Make a change', () => {
        StopDetailsPage.basicDetails.getEditButton().click();
        BasicDetailsForm.getPrivateCodeInput().clearAndType('1');
        StopDetailsPage.basicDetails.getSaveButton().click();
        Toast.expectSuccessToast('Pysäkki muokattu');
      });

      cy.section('Check paging', () => {
        cy.visit('/stop-registry/stops/H2003/history?pageSize=1');
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');

        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getBasicDetails()
          .shouldBeVisible();
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getCreatedVersion()
          .should('not.exist');

        Pagination.getPageButton(3).should('not.exist');
        Pagination.getPageButton(2).shouldBeVisible().click();

        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getBasicDetails()
          .should('not.exist');
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getCreatedVersion()
          .shouldBeVisible();
      });

      cy.section('Check filtering', () => {
        cy.visit('/stop-registry/stops/H2003/history');
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');

        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getBasicDetails()
          .shouldBeVisible();
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getCreatedVersion()
          .shouldBeVisible();

        StopChangeHistoryPage.dateFilter
          .getToDate()
          .focus()
          .inputDateValue(DateTime.now().minus({ months: 1 }));
        expectGraphQLCallToSucceed('@gqlGetStopChangeHistory');

        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getBasicDetails()
          .should('not.exist');
        StopChangeHistoryPage.changeHistoryTable.sectionHeader
          .getCreatedVersion()
          .should('not.exist');
      });
    });
  });
});
