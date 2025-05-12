import {
  StopAreaInput,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { ConfirmationDialog, MapModal, Toast } from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import {
  expectGraphQLCallToReturnError,
  expectGraphQLCallToSucceed,
} from '../../utils/assertions';
import { mapViewport } from '../utils';

describe('Stop areas on map', mapViewport, () => {
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

  const mapModal = new MapModal();
  const confirmationDialog = new ConfirmationDialog();
  const toast = new Toast();

  beforeEach(() => {
    mapModal.map.visit({
      zoom: 17,
      lat: 60.16596,
      lng: 24.93858,
      path: '/stops',
    });

    expectGraphQLCallToSucceed('@gqlGetStopAreasByLocation');
    mapModal.map.waitForLoadToComplete();
  });

  it('should create new stop area', () => {
    mapModal.mapFooter.mapFooterActionsDropdown.getMenu().click();
    mapModal.mapFooter.mapFooterActionsDropdown.getCreateNewStopArea().click();

    mapModal.map.clickAtPosition(758, 391);

    mapModal.stopAreaForm.getForm().shouldBeVisible();
    mapModal.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    mapModal.stopAreaForm.getName().type('Annankatu 2');
    mapModal.stopAreaForm.getShowHideButton().click();
    mapModal.stopAreaForm.getNameSwe().type('Annasgatan 2');
    mapModal.stopAreaForm.getNameLongFin().type('Pitkä fin');
    mapModal.stopAreaForm.getNameLongSwe().type('Pitkä swe');
    mapModal.stopAreaForm.getAbbreviationFin().type('Lyhyt fin');
    mapModal.stopAreaForm.getAbbreviationSwe().type('Lyhyt swe');
    mapModal.stopAreaForm.getShowHideEngButton().click();
    mapModal.stopAreaForm.getNameEng().type('Annas street 2');
    mapModal.stopAreaForm.getNameLongEng().type('Pitkä eng');
    mapModal.stopAreaForm.getAbbreviationEng().type('Lyhyt eng');
    mapModal.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapModal.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapModal.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapModal.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    mapModal.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    mapModal.stopAreaForm.getForm().should('not.exist');

    mapModal.map.waitForLoadToComplete();

    // Check that the stop area got created.
    cy.get('[data-testid="Map::StopArea::stopArea::700001"]').click();
    mapModal.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('700001 Annankatu 2');
    mapModal.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('23.1.2020 -  Voimassa toistaiseksi');

    // TODO: test that navigation to stop area details page works. Can be done after stop area routing change.
  });

  it('should handle unique private code exception', () => {
    mapModal.mapFooter.mapFooterActionsDropdown.getMenu().click();
    mapModal.mapFooter.mapFooterActionsDropdown.getCreateNewStopArea().click();

    mapModal.map.clickAtPosition(758, 391);

    mapModal.stopAreaForm.getForm().shouldBeVisible();
    mapModal.stopAreaForm
      .getPrivateCode()
      .shouldBeVisible()
      .shouldBeDisabled()
      .should('have.value', '700001');
    mapModal.stopAreaForm.getName().type('Name does not matter');
    mapModal.stopAreaForm.getShowHideButton().click();
    mapModal.stopAreaForm.getNameSwe().type('This must not be empty');
    mapModal.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapModal.stopAreaForm.validityPeriodForm
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

    mapModal.stopAreaForm.save();

    toast.expectDangerToast(
      'Pysäkkialueella tulee olla uniikki tunnus, mutta tunnus 700001 on jo jonkin toisen alueen käytössä!',
    );
    expectGraphQLCallToReturnError('@gqlUpsertStopArea');
  });

  it('should edit stop area details', () => {
    mapModal.map.clickAtPosition(1025, 731);

    mapModal.map.waitForLoadToComplete();

    mapModal.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');

    mapModal.stopAreaPopup.getEditButton().click();
    mapModal.stopAreaForm.getForm().shouldBeVisible();
    mapModal.stopAreaForm.getPrivateCode().shouldBeVisible().shouldBeDisabled();
    mapModal.stopAreaForm.validityPeriodForm.setAsIndefinite();

    mapModal.stopAreaForm.save();

    confirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    mapModal.stopAreaForm.getForm().should('not.exist');

    // Check that edited info was persisted.
    mapModal.map.clickAtPosition(1025, 731);

    mapModal.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
    mapModal.stopAreaPopup
      .getValidityPeriod()
      .shouldHaveText('1.1.2000 -  Voimassa toistaiseksi');
    mapModal.stopAreaPopup.getEditButton().click();
  });

  it('should relocate stop area on map', () => {
    mapModal.map.clickAtPosition(1025, 731);
    mapModal.map.waitForLoadToComplete();

    mapModal.stopAreaPopup.getMoveButton().click();
    mapModal.stopAreaPopup.getLabel().should('not.exist');

    mapModal.map.clickAtPosition(1180, 500);

    confirmationDialog.getConfirmButton().click();
    mapModal.map.waitForLoadToComplete();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    mapModal.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    mapModal.map.clickAtPosition(1025, 731);
    mapModal.stopAreaPopup.getLabel().should('not.exist');

    mapModal.map.clickAtPosition(1180, 500);
    mapModal.stopAreaPopup
      .getLabel()
      .shouldBeVisible()
      .shouldHaveText('X0003 Annankatu 15');
  });

  it('should delete a stop area', () => {
    // Create a stop area without stops
    mapModal.mapFooter.mapFooterActionsDropdown.getMenu().click();
    mapModal.mapFooter.mapFooterActionsDropdown.getCreateNewStopArea().click();

    mapModal.map.clickAtPosition(758, 391);

    mapModal.stopAreaForm.getForm().shouldBeVisible();
    mapModal.stopAreaForm.getName().type('Annankatu 2');
    mapModal.stopAreaForm.getShowHideButton().click();
    mapModal.stopAreaForm.getNameSwe().type('Annasgatan 2');
    mapModal.stopAreaForm
      .getLatitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapModal.stopAreaForm
      .getLongitude()
      .should('have.prop', 'value')
      .should('not.be.empty');
    mapModal.stopAreaForm.validityPeriodForm.setStartDate('2020-01-23');
    mapModal.stopAreaForm.validityPeriodForm
      .getIndefiniteCheckbox()
      .should('be.checked');

    mapModal.stopAreaForm.save();
    expectGraphQLCallToSucceed('@gqlUpsertStopArea');
    mapModal.stopAreaForm.getForm().should('not.exist');
    mapModal.map.waitForLoadToComplete();

    // Delete it
    cy.get('[data-testid="Map::StopArea::stopArea::700001"]').click();
    mapModal.stopAreaPopup.getDeleteButton().click();
    confirmationDialog.getConfirmButton().click();
    mapModal.map.waitForLoadToComplete();
    mapModal.stopAreaPopup.getLabel().should('not.exist');

    // There should be nothing at the old position.
    mapModal.map.clickAtPosition(1025, 731);
    mapModal.stopAreaPopup.getLabel().should('not.exist');

    // should only have cancel-button because it has stops in it
    mapModal.map.clickAtPosition(1025, 731);
    mapModal.map.waitForLoadToComplete();

    mapModal.stopAreaPopup.getDeleteButton().click();
    confirmationDialog.getConfirmButton().should('not.exist');
    confirmationDialog.getCancelButton().click();
  });
});
