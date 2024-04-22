import {
  GetInfrastructureLinksByExternalIdsResult,
  Priority,
  StopInsertInput,
  StopRegistryStopPlace,
  buildStop,
  buildTimingPlace,
  extractInfrastructureLinkIdsFromResponse,
  mapToDeleteStopPlaceMutation,
  mapToGetInfrastructureLinksByExternalIdsQuery,
  stopPlaceH2003,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { Tag } from '../../enums';
import {
  BasicDetailsForm,
  BasicDetailsViewCard,
  LocationDetailsViewCard,
  SignageDetailsViewCard,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
import { LocationDetailsForm } from '../../pageObjects/stop-registry/stop-details/LocationDetailsForm';
import { SignageDetailsForm } from '../../pageObjects/stop-registry/stop-details/SignageDetailsForm';
import { UUID } from '../../types';
import {
  SupportedResources,
  insertToDbHelper,
  removeFromDbHelper,
} from '../../utils';
import { deleteTimingPlacesByLabel } from '../utils';

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

const stopPlaceData: Array<Partial<StopRegistryStopPlace>> = [
  {
    name: { lang: 'fin', value: 'Puistokaari' },
  },
  stopPlaceH2003,
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
];

describe('Stop details', () => {
  let stopDetailsPage: StopDetailsPage;
  let toast: Toast;
  const baseDbResources = {
    timingPlaces,
  };
  let dbResources: SupportedResources &
    Required<Pick<SupportedResources, 'stops'>>;
  let stopPlaceIds: Array<string>;

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
    removeFromDbHelper(dbResources);
    insertToDbHelper(dbResources);
    toast = new Toast();

    cy.task<string[]>('insertStopPlaces', {
      scheduledStopPoints: dbResources.stops,
      stopPlaces: stopPlaceData,
    }).then((_stopPlaceIds) => {
      stopPlaceIds = _stopPlaceIds;
    });

    stopDetailsPage = new StopDetailsPage();

    cy.setupTests();
    cy.mockLogin();
  });

  afterEach(() => {
    removeFromDbHelper(dbResources);

    cy.task(
      'hasuraAPIMultiple',
      stopPlaceIds.map((stopPlaceId) =>
        mapToDeleteStopPlaceMutation(stopPlaceId),
      ),
    );
  });

  const verifyInitialBasicDetails = () => {
    const bdView = stopDetailsPage.basicDetails.viewCard;

    bdView.getContent().shouldBeVisible();
    bdView.getLabel().shouldHaveText('H2003');
    bdView.getPublicCode().shouldHaveText('10003');
    bdView.getNameFin().shouldHaveText('Pohjoisesplanadi');
    bdView.getNameSwe().shouldHaveText('Norraesplanaden');
    bdView.getNameLongFin().shouldHaveText('Pohjoisesplanadi (pitkä)');
    bdView.getNameLongSwe().shouldHaveText('Norraesplanaden (lång)');
    bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
    bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
    bdView.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
    bdView.getAbbreviationSwe().shouldHaveText('N.esplanaden');
    bdView.getAbbreviation5CharFin().shouldHaveText('P.Esp');
    bdView.getAbbreviation5CharSwe().shouldHaveText('N.Esp');
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

  it(
    'should view details for a stop',
    { tags: [Tag.StopRegistry, Tag.Smoke] },
    () => {
      stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
      stopDetailsPage.page().shouldBeVisible();

      stopDetailsPage.label().shouldHaveText('H2003');
      stopDetailsPage
        .names()
        .shouldHaveText('Pohjoisesplanadi|Norraesplanaden');
      stopDetailsPage.validityPeriod().should('contain', '20.3.2020-31.5.2050');
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
      'should view and edit basic details text fields',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
        stopDetailsPage.page().shouldBeVisible();

        bdView.getContent().shouldBeVisible();
        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPublicCode().shouldHaveText('10003');
        bdView.getNameFin().shouldHaveText('Pohjoisesplanadi');
        bdView.getNameSwe().shouldHaveText('Norraesplanaden');

        bdView.getNameLongFin().shouldHaveText('Pohjoisesplanadi (pitkä)');
        bdView.getNameLongSwe().shouldHaveText('Norraesplanaden (lång)');
        bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
        bdView.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
        bdView.getAbbreviationSwe().shouldHaveText('N.esplanaden');
        bdView.getAbbreviation5CharFin().shouldHaveText('P.Esp');
        bdView.getAbbreviation5CharSwe().shouldHaveText('N.Esp');
        bdView.getElyNumber().shouldHaveText('1234567');

        stopDetailsPage.basicDetails.getEditButton().click();

        // TODO: when this assert fails, remove this line and implement tests for label change
        bdForm.getLabelInput().shouldBeDisabled();

        // Verify correct initial values.
        bdForm.getLabelInput().should('have.value', 'H2003');
        bdForm.getPublicCodeInput().should('have.value', '10003');
        bdForm.getNameFinInput().should('have.value', 'Pohjoisesplanadi');
        bdForm.getNameSweInput().should('have.value', 'Norraesplanaden');
        bdForm
          .getNameLongFinInput()
          .should('have.value', 'Pohjoisesplanadi (pitkä)');
        bdForm
          .getNameLongSweInput()
          .should('have.value', 'Norraesplanaden (lång)');
        bdForm
          .getLocationFinInput()
          .should('have.value', 'Pohjoisesplanadi (sij.)');
        bdForm
          .getLocationSweInput()
          .should('have.value', 'Norraesplanaden (plats)');
        bdForm.getAbbreviationFinInput().should('have.value', 'Pohj.esplanadi');
        bdForm.getAbbreviationSweInput().should('have.value', 'N.esplanaden');
        bdForm.getAbbreviation5CharFinInput().should('have.value', 'P.Esp');
        bdForm.getAbbreviation5CharSweInput().should('have.value', 'N.Esp');
        bdForm.getElyNumberInput().should('have.value', '1234567');

        bdForm.getPublicCodeInput().clearAndType('10004');
        bdForm.getNameFinInput().clearAndType('NewPohjoisesplanadi');
        bdForm.getNameSweInput().clearAndType('NewNorraesplanaden');

        bdForm
          .getNameLongFinInput()
          .clearAndType('NewPohjoisesplanadi (pitkä)');
        bdForm.getNameLongSweInput().clearAndType('NewNorraesplanaden (lång)');
        bdForm.getLocationFinInput().clearAndType('NewPohjoisesplanadi (sij.)');
        bdForm.getLocationSweInput().clearAndType('NewNorraesplanaden (plats)');
        bdForm.getAbbreviationFinInput().clearAndType('NewPohj.esplanadi');
        bdForm.getAbbreviationSweInput().clearAndType('NewN.esplanaden');
        bdForm.getAbbreviation5CharFinInput().clearAndType('NewP.Esp');
        bdForm.getAbbreviation5CharSweInput().clearAndType('NewN.Esp');

        bdForm.getElyNumberInput().clearAndType('1234568');

        stopDetailsPage.basicDetails.getSaveButton().click();

        toast.checkSuccessToastHasMessage('Pysäkki muokattu');

        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPublicCode().shouldHaveText('10004');
        bdView.getNameFin().shouldHaveText('NewPohjoisesplanadi');
        bdView.getNameSwe().shouldHaveText('NewNorraesplanaden');
        bdView.getNameLongFin().shouldHaveText('NewPohjoisesplanadi (pitkä)');
        bdView.getNameLongSwe().shouldHaveText('NewNorraesplanaden (lång)');
        bdView.getLocationFin().shouldHaveText('NewPohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('NewNorraesplanaden (plats)');
        bdView.getAbbreviationFin().shouldHaveText('NewPohj.esplanadi');
        bdView.getAbbreviationSwe().shouldHaveText('NewN.esplanaden');
        bdView.getAbbreviation5CharFin().shouldHaveText('NewP.Esp');
        bdView.getAbbreviation5CharSwe().shouldHaveText('NewN.Esp');
        bdView.getElyNumber().shouldHaveText('1234568');
      },
    );

    it(
      'should view and edit basic details dropdowns and checkboxes',
      { tags: [Tag.StopRegistry] },
      () => {
        stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
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

        toast.checkSuccessToastHasMessage('Pysäkki muokattu');

        // Tiamat data model has some arrays that stores multiple types
        // of data, so all these checks are here to make sure that
        // the saves do not change other fields.
        bdView.getLabel().shouldHaveText('H2003');
        bdView.getPublicCode().shouldHaveText('10003');
        bdView.getNameFin().shouldHaveText('Pohjoisesplanadi');
        bdView.getNameSwe().shouldHaveText('Norraesplanaden');
        bdView.getNameLongFin().shouldHaveText('Pohjoisesplanadi (pitkä)');
        bdView.getNameLongSwe().shouldHaveText('Norraesplanaden (lång)');
        bdView.getLocationFin().shouldHaveText('Pohjoisesplanadi (sij.)');
        bdView.getLocationSwe().shouldHaveText('Norraesplanaden (plats)');
        bdView.getAbbreviationFin().shouldHaveText('Pohj.esplanadi');
        bdView.getAbbreviationSwe().shouldHaveText('N.esplanaden');
        bdView.getAbbreviation5CharFin().shouldHaveText('P.Esp');
        bdView.getAbbreviation5CharSwe().shouldHaveText('N.Esp');
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

        bdForm.getTimingPlaceDropdown().find('li').contains('1AACKT').click();

        stopDetailsPage.basicDetails.getSaveButton().click();
        bdView.getTransportMode().shouldHaveText('Raitiovaunu');
        bdView.getStopState().shouldHaveText('Käytössä');
        bdView.getTimingPlaceId().shouldHaveText('1AACKT');
      },
    );

    describe('creating new timing place', () => {
      before(() => {
        deleteTimingPlacesByLabel(['1TEST']);
      });

      after(() => {
        deleteTimingPlacesByLabel(['1TEST']);
      });

      it(
        'should create new timing place correctly',
        { tags: [Tag.StopRegistry] },
        () => {
          const { createTimingPlaceForm } = bdForm;
          stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
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

          toast.checkSuccessToastHasMessage('Hastus-paikka luotu');

          stopDetailsPage.basicDetails.getSaveButton().click();

          toast.checkSuccessToastHasMessage('Pysäkki muokattu');

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
      stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
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
      toast.checkSuccessToastHasMessage('Pysäkki muokattu');
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
        stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
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
        toast.checkSuccessToastHasMessage('Pysäkki muokattu');
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

  // A regression test to ensure that our mutations don't eg. reset any fields they are not supposed to.
  it('should keep stop place intact when submitting without actual changes', () => {
    stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
    stopDetailsPage.page().shouldBeVisible();

    verifyInitialBasicDetails();
    verifyInitialLocationDetails();
    verifyInitialSignageDetails();

    // Submit each section, without any actual changes.
    stopDetailsPage.basicDetails.getEditButton().click();
    stopDetailsPage.basicDetails.getSaveButton().click();
    toast.checkSuccessToastHasMessage('Pysäkki muokattu');

    stopDetailsPage.locationDetails.getEditButton().click();
    stopDetailsPage.locationDetails.getSaveButton().click();
    toast.checkSuccessToastHasMessage('Pysäkki muokattu');

    stopDetailsPage.signageDetails.getEditButton().click();
    stopDetailsPage.signageDetails.getSaveButton().click();
    toast.checkSuccessToastHasMessage('Pysäkki muokattu');

    // The stop should have same data as when we started.
    verifyInitialBasicDetails();
    verifyInitialLocationDetails();
    verifyInitialSignageDetails();
  });
});
