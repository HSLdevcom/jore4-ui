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
import { Tag } from '../../enums';
import {
  ConfirmationDialog,
  MapFooter,
  MapObservationDateControl,
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

describe('Stop areas on map', { tags: [Tag.StopAreas, Tag.Map] }, () => {
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

  beforeEach(() => {
    MapPage.map.visit({
      zoom: 17,
      lat: 60.16596,
      lng: 24.93858,
    });

    expectGraphQLCallToSucceed('@gqlGetStopAreasByLocation');
    MapPage.map.waitForLoadToComplete();
  });

  it('should create new stop area', { tags: [Tag.Smoke] }, () => {
    MapFooter.addStopArea();

    MapPage.map.clickAtCoordinates(24.9375, 60.1655);

    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    MapPage.stopAreaForm.getName().type('Annankatu 2');
    MapPage.stopAreaForm.getShowHideButton().click();
    MapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    MapPage.stopAreaForm.getNameLongFin().type('Pitkä fin');
    MapPage.stopAreaForm.getNameLongSwe().type('Pitkä swe');
    MapPage.stopAreaForm.getAbbreviationFin().type('Lyhyt fin');
    MapPage.stopAreaForm.getAbbreviationSwe().type('Lyhyt swe');
    MapPage.stopAreaForm.getShowHideEngButton().click();
    MapPage.stopAreaForm.getNameEng().type('Annas street 2');
    MapPage.stopAreaForm.getNameLongEng().type('Pitkä eng');
    MapPage.stopAreaForm.getAbbreviationEng().type('Lyhyt eng');
    MapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    MapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    MapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    Toast.expectSuccessToast('Pysäkkialue luotu');
    MapPage.stopAreaForm.getForm().should('not.exist');

    MapPage.map.waitForLoadToComplete();

    // Check that the stop area got created.
    MapPage.map.getStopAreaById('700001').click();
    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
    MapPage.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('23.1.2020 -  Voimassa toistaiseksi');

    // Check that the stop area label has a correct link
    MapPage.map.getStopAreaById('700001').click();
    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
    MapPage.stopAreaPopup
      .getLabel()
      .should('have.attr', 'href')
      .and('include', '/stop-registry/stop-areas/700001');

    // Verify that transportation mode was auto-selected and persisted
    MapPage.stopAreaPopup.getEditButton().click();
    MapPage.stopAreaForm.getForm().shouldBeVisible();
    // Check that transportMode has a non-empty value (using the ListboxButton which displays the selected value)
    cy.getByTestId('StopAreaFormComponent::transportMode::ListboxButton')
      .invoke('text')
      .should('not.be.empty');
  });

  it('Should create stop area and change observation date', () => {
    MapObservationDateControl.setObservationDate('2025-01-01');

    MapFooter.addStopArea();

    MapPage.map.clickAtCoordinates(24.9375, 60.1655);

    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    MapPage.stopAreaForm.getName().type('Annankatu 2');
    MapPage.stopAreaForm.getShowHideButton().click();
    MapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    MapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm.validityPeriodForm.setStartDate('2030-01-01');
    MapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    MapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');

    MapObservationDateFiltersOverlay.observationDateControl
      .getObservationDateInput()
      .should('have.value', '2030-01-01');

    MapPage.map.waitForLoadToComplete();

    // Check that the stop area got created.
    MapPage.map.getStopAreaById('700001').click();
    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');

    // Verify that transportation mode was auto-selected and persisted
    MapPage.stopAreaPopup.getEditButton().click();
    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm
      .getTransportationMode()
      .invoke('text')
      .should('not.be.empty');
  });

  it('should cancel creating a new stop area', () => {
    MapPage.map.waitForLoadToComplete();

    MapFooter.addStopArea();
    MapFooter.getMapFooter().should('not.exist');

    MapFooter.cancelAddMode();
    MapFooter.getMapFooter().shouldBeVisible();
  });

  it('should handle unique private code exception', () => {
    MapFooter.addStopArea();

    MapPage.map.clickAtCoordinates(24.9375, 60.1655);

    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    MapPage.stopAreaForm.getName().type('Name does not matter');
    MapPage.stopAreaForm.getShowHideButton().click();
    MapPage.stopAreaForm.getNameSwe().type('Name does not matter');
    MapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    MapPage.stopAreaForm.validityPeriodForm
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

    MapPage.stopAreaForm.save();

    Toast.expectDangerToast(
      'Pysäkkialueella tulee olla uniikki tunnus, mutta tunnus 700001 on jo jonkin toisen alueen käytössä!',
    );
    expectGraphQLCallToReturnError('@gqlUpsertStopArea');
  });

  it('should edit stop area details', () => {
    MapPage.map.getStopAreaById('X0003').click();

    MapPage.map.waitForLoadToComplete();

    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');

    MapPage.stopAreaPopup.getEditButton().click();
    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm.getPrivateCode().shouldBeVisible().shouldBeDisabled();

    // Capture the current transport mode value - it should remain unchanged during edit
    // (auto-select should NOT run for existing stop areas)
    cy.getByTestId('StopAreaFormComponent::transportMode::ListboxButton')
      .invoke('text')
      .as('initialTransportMode');

    MapPage.stopAreaForm.validityPeriodForm.setAsIndefinite();

    MapPage.stopAreaForm.save();

    ConfirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    Toast.expectSuccessToast('Pysäkkialue muokattu');
    MapPage.stopAreaForm.getForm().should('not.exist');

    // Check that edited info was persisted.
    MapPage.map.getStopAreaById('X0003').click();

    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
    MapPage.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('1.1.2000 -  Voimassa toistaiseksi');
    MapPage.stopAreaPopup.getEditButton().click();

    // Verify that transport mode did not change (auto-select should NOT run on edits)
    MapPage.stopAreaForm.getForm().shouldBeVisible();
    cy.get('@initialTransportMode').then((initialText) => {
      cy.getByTestId('StopAreaFormComponent::transportMode::ListboxButton')
        .invoke('text')
        .should('equal', initialText);
    });
  });

  it('should set correct observation date after editing ', () => {
    MapObservationDateControl.setObservationDate('2025-01-01');

    MapPage.map.getStopAreaById('X0003').click();
    MapPage.map.waitForLoadToComplete();
    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');

    MapPage.stopAreaPopup.getEditButton().click();
    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm.validityPeriodForm.setStartDate('2030-01-01');
    MapPage.stopAreaForm.validityPeriodForm.setAsIndefinite();

    MapPage.stopAreaForm.save();

    ConfirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    Toast.expectWarningToast('Tarkasteluhetkeä muutettu');
    MapPage.stopAreaForm.getForm().should('not.exist');

    // Check that observation date was correctly set
    MapObservationDateFiltersOverlay.observationDateControl
      .getObservationDateInput()
      .should('have.value', '2030-01-01');

    // Check that edited info was persisted.
    MapPage.map.getStopAreaById('X0003').click();
  });

  it('should relocate stop area on map', () => {
    MapPage.map.getStopAreaById('X0003').click();
    MapPage.map.waitForLoadToComplete();

    MapPage.stopAreaPopup.getMoveButton().click();
    MapPage.stopAreaPopup.getLabel().should('not.exist');

    MapPage.map.clickAtCoordinates(24.937, 60.166);

    ConfirmationDialog.getConfirmButton().click();
    MapPage.map.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    Toast.expectSuccessToast('Pysäkkialue muokattu');
    MapPage.stopAreaPopup.getLabel().shouldBeVisible();
    MapPage.stopAreaPopup.getCloseButton().click();
    MapPage.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    MapPage.map.clickAtCoordinates(24.938927, 60.165433);
    MapPage.stopAreaPopup.getLabel().should('not.exist');

    MapPage.map.clickAtCoordinates(24.937, 60.166);
    MapPage.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
  });

  it('should delete a stop area', () => {
    // Create a stop area without stops
    MapFooter.addStopArea();

    MapPage.map.clickAtCoordinates(24.9375, 60.1655);

    MapPage.stopAreaForm.getForm().shouldBeVisible();
    MapPage.stopAreaForm.getName().type('Annankatu 2');
    MapPage.stopAreaForm.getShowHideButton().click();
    MapPage.stopAreaForm.getNameSwe().type('Annasgatan 2');
    MapPage.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    MapPage.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    MapPage.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    MapPage.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    MapPage.stopAreaForm.getForm().should('not.exist');
    MapPage.map.waitForLoadToComplete();

    // Delete it
    MapPage.map.clickAtCoordinates(24.9375, 60.1655);
    MapPage.stopAreaPopup.getDeleteButton().click();
    ConfirmationDialog.getConfirmButton().click();
    MapPage.map.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlDeleteStopArea');
    Toast.expectSuccessToast('Pysäkkialue poistettu');
    MapPage.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    MapPage.map.clickAtCoordinates(24.9375, 60.1655);
    MapPage.stopAreaPopup.getLabel().should('not.exist');

    // should only have cancel-button because it has stops in it
    MapPage.map.getStopAreaById('X0003').click();
    MapPage.map.waitForLoadToComplete();

    MapPage.stopAreaPopup.getDeleteButton().click();
    ConfirmationDialog.getConfirmButton().should('not.exist');
    ConfirmationDialog.getCancelButton().click();
  });
});
