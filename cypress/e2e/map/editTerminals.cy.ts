import {
  StopRegistryGeoJsonType,
  TerminalInput,
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
  ConfirmationDialog,
  MapObservationDateControl,
  MapObservationDateFiltersOverlay,
  MapPage,
  Toast,
  ValidityPeriodForm,
} from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';

describe('Terminals on map', { tags: [Tag.Terminals, Tag.Map] }, () => {
  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getClonedBaseStopRegistryData();

  const baseTerminalInput: TerminalInput = {
    terminal: {
      ...baseStopRegistryData.terminals[0].terminal,
      privateCode: { type: 'HSL/TEST', value: 'T3' },
      name: { lang: 'fin', value: 'E2ET002' },
      description: { lang: 'fin', value: 'E2E testiterminaali #2' },
      geometry: {
        coordinates: [24.927445210156606, 60.169740177140625],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    memberLabels: ['E2E007'],
  };

  const terminalData: ReadonlyArray<TerminalInput> = [baseTerminalInput];

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
      terminals: baseStopRegistryData.terminals.concat(terminalData),
      stopPointsRequired: false,
    });

    cy.setupTests();
    cy.mockLogin();
  });

  beforeEach(() => {
    MapPage.map.visit({
      zoom: 17,
      lat: 60.16993,
      lng: 24.92596,
    });

    expectGraphQLCallToSucceed('@gqlGetStopTerminalsByLocation');
    MapPage.map.waitForLoadToComplete();
  });

  it(
    'should edit terminal details',
    { tags: [Tag.Smoke], scrollBehavior: 'bottom' },
    () => {
      MapPage.map.getTerminalById('T2').click();

      MapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = MapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');

      terminalPopup.getEditButton().click();
      terminalForm.getForm().shouldBeVisible();
      terminalForm
        .getPrivateCodeInput()
        .shouldBeVisible()
        .shouldBeDisabled()
        .should('have.value', 'T2');
      terminalForm.getNameInput().clearAndType('New Name');
      ValidityPeriodForm.setAsIndefinite();

      terminalForm.save();

      ConfirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');
      terminalForm.getForm().should('not.exist');
      Toast.expectSuccessToast('Terminaali muokattu');

      // Check that edited info was persisted.
      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 New Name');
      terminalPopup
        .getValidityPeriod()
        .shouldHaveText('1.1.2020 -  Voimassa toistaiseksi');
      terminalPopup.getCloseButton().click();
      terminalPopup.getLabel().should('not.exist');
    },
  );

  it(
    'should set correct observation date after editing',
    { scrollBehavior: 'bottom' },
    () => {
      MapObservationDateControl.setObservationDate('2025-01-01');

      MapPage.map.getTerminalById('T2').click();
      MapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = MapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');

      terminalPopup.getEditButton().click();
      terminalForm.getForm().shouldBeVisible();
      ValidityPeriodForm.setStartDate('2030-01-01');
      ValidityPeriodForm.setAsIndefinite();

      terminalForm.save();

      ConfirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');
      terminalForm.getForm().should('not.exist');
      Toast.expectWarningToast('Tarkasteluhetkeä muutettu');

      // Check that observation date was correctly set
      MapObservationDateFiltersOverlay.observationDateControl
        .getObservationDateInput()
        .should('have.value', '2030-01-01');

      // Check that edited info was persisted.
      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');
    },
  );

  it(
    'should move a terminal with form inputs',
    { scrollBehavior: 'bottom' },
    () => {
      MapPage.map.getTerminalById('T2').click();

      MapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = MapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');

      terminalPopup.getEditButton().click();
      terminalForm.getForm().shouldBeVisible();
      terminalForm
        .getPrivateCodeInput()
        .shouldBeVisible()
        .shouldBeDisabled()
        .should('have.value', 'T2');

      terminalForm.getLatitudeInput().clearAndType('60.17049');
      terminalForm.getLongitudeInput().clearAndType('24.94342');

      terminalForm.save();

      ConfirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');
      terminalForm.getForm().should('not.exist');
      Toast.expectSuccessToast('Terminaali muokattu');

      expectGraphQLCallToSucceed('@gqlGetStopTerminalsByLocation');
      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');
    },
  );

  it('should move terminal on map', { scrollBehavior: 'bottom' }, () => {
    MapPage.map.visit({
      zoom: 14,
      lat: 60.16993,
      lng: 24.92596,
    });

    MapPage.map.getTerminalById('T3').click();

    MapPage.map.waitForLoadToComplete();

    const { terminalPopup, terminalForm } = MapPage;

    terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T3 E2ET002');
    terminalPopup.getMoveButton().click();

    // Move the terminal to around Rautatientori
    MapPage.map.clickRelativePoint(70, 45);

    ConfirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlUpdateTerminal');
    Toast.expectSuccessToast('Terminaali muokattu');

    terminalPopup.getLabel().shouldBeVisible();
    terminalPopup.getEditButton().click();

    // Confirm that the coordinates have changed
    terminalForm.getForm().shouldBeVisible();
    terminalForm
      .getLatitudeInput()
      .should('not.have.value', '60.169740177140625');
    terminalForm
      .getLongitudeInput()
      .should('not.have.value', '24.927445210156606');
  });

  it('should delete terminal on map', { scrollBehavior: 'bottom' }, () => {
    MapPage.map.getTerminalById('T3').click();

    MapPage.map.waitForLoadToComplete();

    const { terminalPopup } = MapPage;

    terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T3 E2ET002');
    terminalPopup.getDeleteButton().click();

    // Should list member stops on the confirmation dialog
    ConfirmationDialog.dialogWithButtons
      .getTextContent()
      .should('contain', 'E2E007');

    ConfirmationDialog.getConfirmButton().click();
    expectGraphQLCallToSucceed('@gqlDeleteTerminal');
    Toast.expectSuccessToast('Terminaali poistettu');

    // Make sure that the terminal is not visible on the map
    MapPage.map.getTerminalById('T3').should('not.exist');
  });
});
