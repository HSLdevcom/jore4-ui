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
  SignageDetailsViewCard,
  StopDetailsPage,
  Toast,
} from '../../pageObjects';
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

        stopDetailsPage.basicDetails.getEditButton().click();

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
    it('should view location details', { tags: [Tag.StopRegistry] }, () => {
      stopDetailsPage.visit(dbResources.stops[1].scheduled_stop_point_id);
      stopDetailsPage.page().shouldBeVisible();

      const details = stopDetailsPage.locationDetailsViewCard;
      details.getContainer().shouldBeVisible();
      details.getStopAddress().shouldHaveText('Mannerheimintie 22-24');
      details.getPostalCode().shouldHaveText('00100');
      details.getMunicipality().shouldHaveText('-');
      details.getTariffZone().shouldHaveText('-');
      details.getLatitude().shouldHaveText('60.166003223527824');
      details.getLongitude().shouldHaveText('24.932072417514647');
      details.getAltitude().shouldHaveText('0');
      details.getFunctionalArea().shouldHaveText('20 m');
      details.getStopArea().shouldHaveText('-');
      details.getStopAreaName().shouldHaveText('-');
      details.getStopAreaStops().shouldHaveText('-');
      details.getQuay().shouldHaveText('-');
      details.getStopAreaQuays().shouldHaveText('-');
      details.getTerminal().shouldHaveText('-');
      details.getTerminalName().shouldHaveText('-');
      details.getTerminalStops().shouldHaveText('-');
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

        signView.getContainer().shouldBeVisible();
        signView.getSignType().shouldHaveText('Tolppamerkki');
        signView.getNumberOfFrames().shouldHaveText('12');
        signView.getLineSignage().shouldHaveText('Kyllä');
        signView.getMainLineSign().shouldHaveText('Ei');
        signView.getReplacesRailSign().shouldHaveText('Ei');
        signView
          .getSignageInstructionExceptions()
          .shouldHaveText('Ohjetekstiä...');

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
});
