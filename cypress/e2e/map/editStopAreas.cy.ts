import {
  StopAreaInput,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import {
  ConfirmationDialog,
  MapObservationDateFiltersOverlay,
  MapPage,
  Toast,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import {
  expectGraphQLCallToReturnError,
  expectGraphQLCallToSucceed,
} from '../../utils/assertions';

describe('Stop areas on map', () => {
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const baseTestStopAreaInput: StopAreaInput = {
    StopArea: {
      name: { lang: 'fin', value: 'Reserved Private Code' },
      description: { lang: 'fin', value: 'Reserved Private Code Street' },
      privateCode: { type: 'HSL/JORE-4', value: '700000' },
      validBetween: {
        fromDate: DateTime.fromISO('2020-01-01T00:00:00.001'),
        toDate: DateTime.fromISO('2050-01-01T00:00:00.001'),
      },
      geometry: {
        coordinates: [24.1, 60.1],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    organisations: null,
  };

  const stopAreaData: ReadonlyArray<StopAreaInput> = [baseTestStopAreaInput];

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

    cy.task<string[]>('insertStopRegistryData', {
      ...baseStopRegistryData,
      stopPlaces: baseStopRegistryData.stopPlaces.concat(stopAreaData),
      stopPointsRequired: false,
    });

    cy.setupTests();
    cy.mockLogin();
  });

  const mapPage = new MapPage();
  const observationDateFilters = new MapObservationDateFiltersOverlay();
  const confirmationDialog = new ConfirmationDialog();
  const toast = new Toast();

  beforeEach(() => {
    mapPage.map.visit({
      zoom: 17,
      lat: 60.16596,
      lng: 24.93858,
    });

    expectGraphQLCallToSucceed('@gqlGetStopAreasByLocation');
    mapPage.map.waitForLoadToComplete();
  });

  it('should create new stop area', () => {
    mapPage.mapFooter.addStopArea();

    mapPage.map.clickAtCoordinates(24.9375, 60.1655);

    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    mapPage.stopAreaForm.getName().type('Annankatu 2');
    mapPage.stopAreaForm.getShowHideButton().click();
    mapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    mapPage.stopAreaForm.getNameLongFin().type('Pitkä fin');
    mapPage.stopAreaForm.getNameLongSwe().type('Pitkä swe');
    mapPage.stopAreaForm.getAbbreviationFin().type('Lyhyt fin');
    mapPage.stopAreaForm.getAbbreviationSwe().type('Lyhyt swe');
    mapPage.stopAreaForm.getShowHideEngButton().click();
    mapPage.stopAreaForm.getNameEng().type('Annas street 2');
    mapPage.stopAreaForm.getNameLongEng().type('Pitkä eng');
    mapPage.stopAreaForm.getAbbreviationEng().type('Lyhyt eng');
    mapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    mapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    toast.expectSuccessToast('Pysäkkialue luotu');
    mapPage.stopAreaForm.getForm().should('not.exist');

    mapPage.map.waitForLoadToComplete();

    // Check that the stop area got created.
    mapPage.map.getStopAreaById('700001').click();
    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
    mapPage.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('23.1.2020 -  Voimassa toistaiseksi');

    // Check that the stop area label has a correct link
    mapPage.map.getStopAreaById('700001').click();
    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
    mapPage.stopAreaPopup
      .getLabel()
      .should('have.attr', 'href')
      .and('include', '/stop-registry/stop-areas/700001');
  });

  it('Should create stop area and change observation date', () => {
    observationDateFilters.observationDateControl.setObservationDate(
      '2025-01-01',
    );

    mapPage.mapFooter.addStopArea();

    mapPage.map.clickAtCoordinates(24.9375, 60.1655);

    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    mapPage.stopAreaForm.getName().type('Annankatu 2');
    mapPage.stopAreaForm.getShowHideButton().click();
    mapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    mapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm.validityPeriodForm.setStartDate('2030-01-01');
    mapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    mapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');

    observationDateFilters.observationDateControl
      .getObservationDateInput()
      .should('have.value', '2030-01-01');

    mapPage.map.waitForLoadToComplete();

    // Check that the stop area got created.
    mapPage.map.getStopAreaById('700001').click();
    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
  });

  it('should cancel creating a new stop area', () => {
    mapPage.map.waitForLoadToComplete();

    mapPage.mapFooter.addStopArea();
    mapPage.mapFooter.getMapFooter().should('not.exist');

    mapPage.mapFooter.cancelAddMode();
    mapPage.mapFooter.getMapFooter().shouldBeVisible();
  });

  it('should handle unique private code exception', () => {
    mapPage.mapFooter.addStopArea();

    mapPage.map.clickAtCoordinates(24.9375, 60.1655);

    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    mapPage.stopAreaForm.getName().type('Name does not matter');
    mapPage.stopAreaForm.getShowHideButton().click();
    mapPage.stopAreaForm.getNameSwe().type('This must not be empty');
    mapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    // Simulate someone else creating another Stop Area at the same time.
    cy.task<string[]>('insertStopRegistryData', {
      stopPlaces: [
        {
          StopArea: {
            ...baseTestStopAreaInput.StopArea,
            name: { lang: 'fin', value: 'Some other name' },
            privateCode: { type: 'HSL/JORE-4', value: '700001' },
          },
          organisations: null,
        },
      ],
      stopPointsRequired: false,
    });

    mapPage.stopAreaForm.save();

    toast.expectDangerToast(
      'Pysäkkialueella tulee olla uniikki tunnus, mutta tunnus 700001 on jo jonkin toisen alueen käytössä!',
    );
    expectGraphQLCallToReturnError('@gqlUpsertStopArea');
  });

  it('should edit stop area details', () => {
    mapPage.map.getStopAreaById('X0003').click();

    mapPage.map.waitForLoadToComplete();

    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');

    mapPage.stopAreaPopup.getEditButton().click();
    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm.getPrivateCode().shouldBeVisible().shouldBeDisabled();
    mapPage.stopAreaForm.validityPeriodForm.setAsIndefinite();

    mapPage.stopAreaForm.save();

    confirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    toast.expectSuccessToast('Pysäkkialue muokattu');
    mapPage.stopAreaForm.getForm().should('not.exist');

    // Check that edited info was persisted.
    mapPage.map.getStopAreaById('X0003').click();

    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
    mapPage.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('1.1.2000 -  Voimassa toistaiseksi');
    mapPage.stopAreaPopup.getEditButton().click();
  });

  it('should set correct observation date after editing ', () => {
    observationDateFilters.observationDateControl.setObservationDate(
      '2025-01-01',
    );

    mapPage.map.getStopAreaById('X0003').click();
    mapPage.map.waitForLoadToComplete();
    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');

    mapPage.stopAreaPopup.getEditButton().click();
    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm.validityPeriodForm.setStartDate('2030-01-01');
    mapPage.stopAreaForm.validityPeriodForm.setAsIndefinite();

    mapPage.stopAreaForm.save();

    confirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    toast.expectWarningToast('Tarkasteluhetkeä muutettu');
    mapPage.stopAreaForm.getForm().should('not.exist');

    // Check that observation date was correctly set
    observationDateFilters.observationDateControl
      .getObservationDateInput()
      .should('have.value', '2030-01-01');

    // Check that edited info was persisted.
    mapPage.map.getStopAreaById('X0003').click();
  });

  it('should relocate stop area on map', () => {
    mapPage.map.getStopAreaById('X0003').click();
    mapPage.map.waitForLoadToComplete();

    mapPage.stopAreaPopup.getMoveButton().click();
    mapPage.stopAreaPopup.getLabel().should('not.exist');

    mapPage.map.clickAtCoordinates(24.937, 60.166);

    confirmationDialog.getConfirmButton().click();
    mapPage.map.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    toast.expectSuccessToast('Pysäkkialue muokattu');
    mapPage.stopAreaPopup.getLabel().shouldBeVisible();
    mapPage.stopAreaPopup.getCloseButton().click();
    mapPage.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    mapPage.map.clickAtCoordinates(24.938927, 60.165433);
    mapPage.stopAreaPopup.getLabel().should('not.exist');

    mapPage.map.clickAtCoordinates(24.937, 60.166);
    mapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
  });

  it('should delete a stop area', () => {
    // Create a stop area without stops
    mapPage.mapFooter.addStopArea();

    mapPage.map.clickAtCoordinates(24.9375, 60.1655);

    mapPage.stopAreaForm.getForm().shouldBeVisible();
    mapPage.stopAreaForm.getName().type('Annankatu 2');
    mapPage.stopAreaForm.getShowHideButton().click();
    mapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    mapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    mapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    mapPage.stopAreaForm.getForm().should('not.exist');
    mapPage.map.waitForLoadToComplete();

    // Delete it
    mapPage.map.clickAtCoordinates(24.9375, 60.1655);
    mapPage.stopAreaPopup.getDeleteButton().click();
    confirmationDialog.getConfirmButton().click();
    mapPage.map.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlDeleteStopArea');
    toast.expectSuccessToast('Pysäkkialue poistettu');
    mapPage.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    mapPage.map.clickAtCoordinates(24.9375, 60.1655);
    mapPage.stopAreaPopup.getLabel().should('not.exist');

    // should only have cancel-button because it has stops in it
    mapPage.map.getStopAreaById('X0003').click();
    mapPage.map.waitForLoadToComplete();

    mapPage.stopAreaPopup.getDeleteButton().click();
    confirmationDialog.getConfirmButton().should('not.exist');
    confirmationDialog.getCancelButton().click();
  });
});
