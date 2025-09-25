import {
  StopRegistryGeoJsonType,
  TerminalInput,
} from '@hsl/jore4-test-db-manager';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { Tag } from '../../enums';
import { ConfirmationDialog, MapPage } from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';

const mapPage = new MapPage();
const confirmationDialog = new ConfirmationDialog();

describe('Terminals on map', () => {
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
    mapPage.map.visit({
      zoom: 17,
      lat: 60.16993,
      lng: 24.92596,
    });

    expectGraphQLCallToSucceed('@gqlGetStopTerminalsByLocation');
    mapPage.map.waitForLoadToComplete();
  });

  it(
    'should edit terminal details',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapPage.map.getTerminalById('T2').click();

      mapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = mapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');

      terminalPopup.getEditButton().click();
      terminalForm.getForm().shouldBeVisible();
      terminalForm
        .getPrivateCodeInput()
        .shouldBeVisible()
        .shouldBeDisabled()
        .should('have.value', 'T2');
      terminalForm.getNameInput().clearAndType('New Name');
      terminalForm.validityPeriodForm.setAsIndefinite();

      terminalForm.save();

      confirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');
      terminalForm.getForm().should('not.exist');

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
    'should move a terminal with form inputs',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapPage.map.getTerminalById('T2').click();

      mapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = mapPage;

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

      confirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');
      terminalForm.getForm().should('not.exist');

      expectGraphQLCallToSucceed('@gqlGetStopTerminalsByLocation');
      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T2 E2ET001');
    },
  );

  it(
    'should move terminal on map',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapPage.map.visit({
        zoom: 14,
        lat: 60.16993,
        lng: 24.92596,
      });

      mapPage.map.getTerminalById('T3').click();

      mapPage.map.waitForLoadToComplete();

      const { terminalPopup, terminalForm } = mapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T3 E2ET002');
      terminalPopup.getMoveButton().click();

      // Move the terminal to around Rautatientori
      mapPage.map.clickRelativePoint(70, 45);

      confirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlUpdateTerminal');

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
    },
  );

  it(
    'should delete terminal on map',
    { tags: [Tag.Terminals, Tag.Map], scrollBehavior: 'bottom' },
    () => {
      mapPage.map.getTerminalById('T3').click();

      mapPage.map.waitForLoadToComplete();

      const { terminalPopup } = mapPage;

      terminalPopup.getLabel().shouldBeVisible().shouldHaveText('T3 E2ET002');
      terminalPopup.getDeleteButton().click();

      // Should list member stops on the confirmation dialog
      confirmationDialog.dialogWithButtons
        .getTextContent()
        .should('contain', 'E2E007');

      confirmationDialog.getConfirmButton().click();
      expectGraphQLCallToSucceed('@gqlDeleteTerminal');

      // Make sure that the terminal is not visible on the map
      mapPage.map.getTerminalById('T3').should('not.exist');
    },
  );
});
