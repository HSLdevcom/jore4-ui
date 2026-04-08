import {
  Priority,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import {
  EditRoutePage,
  LineChangeHistory,
  LineDetailsPage,
  LineForm,
  LineRouteList,
  LineRouteListItem,
  Pagination,
  RouteRow,
  RouteStopListItem,
  TimingSettingsForm,
  Toast,
  ValidityPeriodForm,
  ViaForm,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import { expectGraphQLCallToSucceed } from '../utils/assertions';

const changed = {
  line: {
    name: 'Muokattu nimi Testilinja FI',
    nameSwedish: 'Muokattu nimi Testilinja SV',
    nameFinnishShort: 'Muokattu lyh.nimi Testilinja FI',
    nameSwedishShort: 'Muokattu lyh.nimi Testilinja SV',
    transportTarget: 'Alueiden välinen',
    vehicleType: 'Metro',
    lineType: 'Metro',
    lineText: 'Muokattu linjateksti',
    validityStart: '2021-01-01',
    validityEnd: '2055-01-01',
  },
  route: {
    finnishName: 'Edited route name',
    label: '901E',
    variant: '8',
    direction: RouteDirectionEnum.Outbound,
    origin: {
      finnishName: 'Edited origin FIN',
      finnishShortName: 'Edited origin FIN shortName',
      swedishName: 'Edited origin SWE',
      swedishShortName: 'Edited origin SWE shortName',
    },
    destination: {
      finnishName: 'Edited destination FIN',
      finnishShortName: 'Edited destination FIN shortName',
      swedishName: 'Edited destination SWE',
      swedishShortName: 'Edited destination SWE shortName',
    },
    priority: Priority.Temporary,
    validityStart: '2022-01-01',
    validityEnd: '2022-01-01',
  },
  viaPoint: {
    finnishName: 'NameFin',
    finnishShortName: 'NameShortFin',
    swedishName: 'NameSwe',
    swedishShortName: 'NameShortSwe',
  },
};

const tags: Array<Tag> = [Tag.ChangeHistory, Tag.Lines, Tag.Routes];

function assertValueChanged([oldValue, newValue]: readonly [string, string]) {
  return () => {
    LineChangeHistory.changeHistoryTable.changedValues
      .getOldValue()
      .shouldHaveText(oldValue);
    LineChangeHistory.changeHistoryTable.changedValues
      .getNewValue()
      .shouldHaveText(newValue);
  };
}

describe('Line & Route Change History', { tags }, () => {
  let dbResources: SupportedResources;
  const baseDbResources = getClonedBaseDbResources();

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

    cy.setupTests();
    cy.mockLogin();

    LineDetailsPage.visit(baseDbResources.lines[0].line_id);
  });

  it('Should show how have change history for line detail edits', () => {
    cy.section('Make changes', () => {
      LineDetailsPage.getEditLineButton().click();
      LineForm.getFinnishNameInput().clearAndType(changed.line.name);
      LineForm.getShowNameVersionButton().click();
      LineForm.getSwedishNameInput().clearAndType(changed.line.nameSwedish);
      LineForm.getFinnishShortNameInput().clearAndType(
        changed.line.nameFinnishShort,
      );
      LineForm.getSwedishShortNameInput().clearAndType(
        changed.line.nameSwedishShort,
      );
      LineForm.selectTransportTarget(changed.line.transportTarget);
      LineForm.selectVehicleType(changed.line.vehicleType);
      LineForm.selectLineType(changed.line.lineType);
      LineForm.getLineTextInput().clearAndType(changed.line.lineText);

      ValidityPeriodForm.setStartDate(changed.line.validityStart);
      ValidityPeriodForm.setAsIndefinite(false);
      ValidityPeriodForm.setEndDate(changed.line.validityEnd);

      LineForm.save();
      LineForm.checkLineSubmitSuccess();
    });

    cy.info('Wait for transition back to the line details page.');
    LineDetailsPage.getLineLabel().shouldHaveText('901');

    cy.info('Go to the change history page');
    LineDetailsPage.getChangeHistoryLink().click();

    cy.section('Verify changes are in the history', () => {
      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByLineLabel('901')
        .eq(0)
        .within(() => {
          LineChangeHistory.changeHistoryTable.sectionHeader
            .getTitle()
            .shouldHaveText('Linja 901 Muokattu nimi Testilinja FI');

          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getNameFi()
            .within(assertValueChanged(['line 901', changed.line.name]));
          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getNameSv()
            .within(
              assertValueChanged(['line 901 SV', changed.line.nameSwedish]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getShortNameFi()
            .within(
              assertValueChanged([
                'line short 901',
                changed.line.nameFinnishShort,
              ]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getShortNameSv()
            .within(
              assertValueChanged([
                'line short 901 SV',
                changed.line.nameSwedishShort,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getValidityStart()
            .within(assertValueChanged(['1.1.2022', '1.1.2021']));
          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getValidityEnd()
            .within(assertValueChanged(['-', '1.1.2055']));

          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getPrimaryVehicleMode()
            .within(assertValueChanged(['Bussi', changed.line.vehicleType]));
          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getTypeOfLine()
            .within(assertValueChanged(['Peruslinja', changed.line.lineType]));
          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getTransportTarget()
            .within(
              assertValueChanged([
                'Helsingin sisäinen liikenne',
                changed.line.transportTarget,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.lineDetails
            .getDescription()
            .within(assertValueChanged(['-', changed.line.lineText]));
        });
    });
  });

  it('Should have change history for Via point changes', () => {
    cy.section('Add a Via point to the route', () => {
      LineRouteList.getNthLineRouteListItem(0).within(() => {
        RouteRow.getToggleAccordionButton().click();
        LineRouteListItem.getNthRouteStopListItem(0).within(() =>
          RouteStopListItem.getStopActionsDropdown().click(),
        );
      });
      RouteStopListItem.stopActionsDropdown.getCreateViaPointButton().click();

      ViaForm.getViaFinnishNameInput().clearAndType(
        changed.viaPoint.finnishName,
      );
      ViaForm.getViaSwedishNameInput().clearAndType(
        changed.viaPoint.swedishName,
      );
      ViaForm.getViaFinnishShortNameInput().clearAndType(
        changed.viaPoint.finnishShortName,
      );
      ViaForm.getViaSwedishShortNameInput().clearAndType(
        changed.viaPoint.swedishShortName,
      );

      ViaForm.getSaveButton().click();
      Toast.expectSuccessToast('Via-tieto asetettu');
    });

    cy.info('Go to the change history page');
    LineDetailsPage.getChangeHistoryLink().click();

    cy.section('Verify changes are in the history', () => {
      const { changedValues } = LineChangeHistory.changeHistoryTable;
      const { routeDetails } = changedValues;
      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByRouteLabel('901')
        .eq(0)
        .within(() => {
          routeDetails.getViaPoints().within(() => {
            changedValues.getOldValue().within(() => {
              routeDetails.getAllViaPointElements().should('have.length', 0);
            });
            changedValues.getNewValue().within(() => {
              routeDetails.getAllViaPointElements().should('have.length', 1);
              routeDetails.getViaPoint().shouldHaveText('E2E001: NameFin');

              routeDetails.viaPointDetails.getOpenButton().click();

              cy.withinHeadlessPortal(() => {
                routeDetails.viaPointDetails
                  .getNameFi()
                  .shouldHaveText(changed.viaPoint.finnishName);
                routeDetails.viaPointDetails
                  .getNameSv()
                  .shouldHaveText(changed.viaPoint.swedishName);
                routeDetails.viaPointDetails
                  .getShortNameFi()
                  .shouldHaveText(changed.viaPoint.finnishShortName);
                routeDetails.viaPointDetails
                  .getShortNameSv()
                  .shouldHaveText(changed.viaPoint.swedishShortName);

                routeDetails.viaPointDetails.getCloseButton().click();
              });
            });
          });
        });
    });
  });

  function disableNthStopRowTimingPoint(row: number) {
    LineRouteListItem.getNthRouteStopListItem(row).within(() =>
      RouteStopListItem.getStopActionsDropdown().click(),
    );
    RouteStopListItem.stopActionsDropdown.getOpenTimingSettingsButton().click();
    TimingSettingsForm.getIsUsedAsTimingPointCheckbox().click();
    TimingSettingsForm.getSavebutton().click();
    Toast.expectSuccessToast('Aika-asetusten tallennus onnistui');
  }

  it('Should have change history for Timing Point changes', () => {
    cy.section('Edit route Timing points', () => {
      LineRouteList.getNthLineRouteListItem(0).within(() =>
        RouteRow.getToggleAccordionButton().click(),
      );

      disableNthStopRowTimingPoint(0);
      disableNthStopRowTimingPoint(2);

      LineRouteListItem.getNthRouteStopListItem(4).within(() =>
        RouteStopListItem.getStopActionsDropdown().click(),
      );
      RouteStopListItem.stopActionsDropdown
        .getOpenTimingSettingsButton()
        .click();
      TimingSettingsForm.getIsRegulatedTimingPointCheckbox().click();
      TimingSettingsForm.getIsLoadingTimeAllowedCheckbox().click();
      TimingSettingsForm.getSavebutton().click();
      Toast.expectSuccessToast('Aika-asetusten tallennus onnistui');
    });

    cy.info('Go to the change history page');
    LineDetailsPage.getChangeHistoryLink().click();

    cy.section('Verify changes are in the history', () => {
      const { changedValues } = LineChangeHistory.changeHistoryTable;
      const { routeDetails } = changedValues;

      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByRouteLabel('901')
        .eq(2)
        .within(() => {
          routeDetails
            .getTimingPoints()
            .within(
              assertValueChanged([
                ['1AACKT', '1AURLA', '1EIRA'].join(''),
                ['1AURLA', '1EIRA'].join(''),
              ]),
            );
        });

      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByRouteLabel('901')
        .eq(1)
        .within(() => {
          routeDetails
            .getTimingPoints()
            .within(
              assertValueChanged([['1AURLA', '1EIRA'].join(''), '1EIRA']),
            );
        });

      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByRouteLabel('901')
        .eq(0)
        .within(() => {
          routeDetails
            .getRegulatedTimingPoints()
            .within(assertValueChanged(['', 'E2E005']));
          routeDetails
            .getLoadingTimeAllowedOn()
            .within(assertValueChanged(['', 'E2E005']));
        });
    });
  });

  it('Should have change history for route basic detail edits', () => {
    RouteRow.getEditRouteButton('901', RouteDirectionEnum.Inbound).click();

    cy.section("Edit the route's information", () => {
      EditRoutePage.routePropertiesForm.fillRouteProperties(changed.route);
      EditRoutePage.priorityForm.setAsTemporary();
      ValidityPeriodForm.setAsIndefinite(false);
      ValidityPeriodForm.setStartDate(changed.route.validityStart);
      ValidityPeriodForm.setEndDate(changed.route.validityEnd);

      EditRoutePage.getSaveRouteButton().click();
    });

    cy.info('Wait for transition back to the line details page.');
    LineDetailsPage.getLineLabel().shouldHaveText('901');

    cy.info('Go to the change history page');
    LineDetailsPage.getChangeHistoryLink().click();

    cy.section('Verify changes are in the history', () => {
      LineChangeHistory.changeHistoryTable.group
        .getAllGroupsByRouteLabel('901E_8')
        .eq(0)
        .within(() => {
          LineChangeHistory.changeHistoryTable.sectionHeader
            .getTitle()
            .shouldHaveText('Reitti 901E_8 1 Edited route name');

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getLabel()
            .within(assertValueChanged(['901', changed.route.label]));
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getVariant()
            .within(assertValueChanged(['-', changed.route.variant]));

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getNameFi()
            .within(
              assertValueChanged(['route 901', changed.route.finnishName]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getNameSv()
            .within(assertValueChanged(['route 901 SV', '-']));

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getOriginNameFi()
            .within(
              assertValueChanged([
                'origin 901',
                changed.route.origin.finnishName,
              ]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getOriginNameSv()
            .within(
              assertValueChanged([
                'origin 901 SV',
                changed.route.origin.swedishName,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getOriginNameShortFi()
            .within(
              assertValueChanged([
                'origin short 901',
                changed.route.origin.finnishShortName,
              ]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getOriginNameShortSv()
            .within(
              assertValueChanged([
                'origin short 901 SV',
                changed.route.origin.swedishShortName,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getDestinationNameFi()
            .within(
              assertValueChanged([
                'destination 901',
                changed.route.destination.finnishName,
              ]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getDestinationNameSv()
            .within(
              assertValueChanged([
                'destination 901 SV',
                changed.route.destination.swedishName,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getDestinationNameShortFi()
            .within(
              assertValueChanged([
                'destination short 901',
                changed.route.destination.finnishShortName,
              ]),
            );
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getDestinationNameShortSv()
            .within(
              assertValueChanged([
                'destination short 901 SV',
                changed.route.destination.swedishShortName,
              ]),
            );

          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getValidityStart()
            .within(assertValueChanged(['11.8.2022', '1.1.2022']));
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getValidityEnd()
            .within(assertValueChanged(['11.8.2032', '1.1.2022']));
          LineChangeHistory.changeHistoryTable.changedValues.routeDetails
            .getPriority()
            .within(assertValueChanged(['Perusversio', 'Väliaikainen']));
        });
    });
  });

  it('Should paginate details', () => {
    cy.visit('/lines/901/history?pageSize=1');

    LineChangeHistory.changeHistoryTable.group
      .getAllGroupsByRouteLabel('901')
      .should('have.length', 1);
    LineChangeHistory.changeHistoryTable.group
      .getAllGroupsByRouteLabel('901')
      .eq(0)
      .within(() =>
        LineChangeHistory.changeHistoryTable.sectionHeader
          .getTitle()
          .shouldHaveText('Reitti 901 1 route 901'),
      );

    Pagination.getPageButton(2).shouldBeVisible().click();
    LineChangeHistory.changeHistoryTable.group
      .getAllGroupsByRouteLabel('901')
      .should('have.length', 1);
    LineChangeHistory.changeHistoryTable.group
      .getAllGroupsByRouteLabel('901')
      .eq(0)
      .within(() =>
        LineChangeHistory.changeHistoryTable.sectionHeader
          .getTitle()
          .shouldHaveText('Reitti 901 2 route 901'),
      );
  });

  it('Should filter by date range', () => {
    cy.visit('/lines/901/history?from=2000-01-01&to=2000-01-02');
    expectGraphQLCallToSucceed('@gqlGetLineChangeHistory');
    LineChangeHistory.changeHistoryTable.group
      .getAllGroupElements()
      .should('have.length', 0);
  });
});
