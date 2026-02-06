import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { Tag } from '../enums';
import {
  ExportToolBar,
  LineDetailsPage,
  LineRouteList,
  Navbar,
  RouteLineTableRow,
  RoutesAndLinesPage,
  TimingSettingsForm,
  Toast,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

const exportDate = DateTime.now().toISODate();
const exportFilePath = `${Cypress.config(
  'downloadsFolder',
)}/901_Perusversio_${exportDate}.csv`;

const comparisonRouteExportFilePath = `${Cypress.config(
  'fixturesFolder',
)}/hastusExport/comparison-export-901-route.csv`;

describe('Hastus export', { tags: [Tag.HastusExport] }, () => {
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
    cy.task('emptyDownloadsFolder');
    insertToDbHelper(dbResources);
    cy.setupTests();
    cy.mockLogin();
  });

  describe('Success cases', () => {
    // TODO: Add another route to the line. Currently this practically tests the same thing as
    // 'should export route', since there is only one route within this line. So should skip until
    // we have more data.
    it('Should export a line', { tags: [Tag.Lines, Tag.Smoke] }, () => {
      cy.visit('/routes');

      RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');
      RoutesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      RoutesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('901')
        .check();
      RoutesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath).then((exportedFile) => {
        cy.readFile(comparisonRouteExportFilePath).should('eq', exportedFile);
      });
    });

    it('Should export a route', { tags: [Tag.Routes] }, () => {
      // Skip searching via UI
      cy.visit('/routes/search?label=901&priorities=10&displayedType=routes');
      RoutesAndLinesPage.exportToolBar.getToggleSelectingButton().click();
      RoutesAndLinesPage.routeLineTableRow
        .getRouteLineTableRowCheckbox('901')
        .check();
      RoutesAndLinesPage.exportToolBar.getExportSelectedButton().click();
      cy.wait('@hastusExport').its('response.statusCode').should('equal', 200);
      cy.readFile(exportFilePath).then((exportedFile) => {
        cy.readFile(comparisonRouteExportFilePath).should('eq', exportedFile);
      });
    });
  });

  describe('Fail cases, first and/or last stop are not used as timing points', () => {
    it(
      'should show an error, when the first stop is not a timing point',
      { tags: [Tag.Routes] },
      () => {
        const { lineRouteListItem } = LineRouteList;
        const { routeRow, routeStopListItem } = lineRouteListItem;
        LineDetailsPage.visit(baseDbResources.lines[0].line_id);

        LineRouteList.getNthLineRouteListItem(0).within(() => {
          routeRow.getToggleAccordionButton().click();

          // Open E2E001 timing settings
          lineRouteListItem
            .getNthRouteStopListItem(0)
            .within(() => routeStopListItem.getStopActionsDropdown().click());
        });
        routeStopListItem.stopActionsDropdown
          .getOpenTimingSettingsButton()
          .click();

        // Set route 901 (outbound) first stop to not be used as timing point
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should(
          'be.checked',
        );
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().click();
        TimingSettingsForm.getSavebutton().click();

        Navbar.getRoutesAndLinesLink().click();
        RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

        ExportToolBar.getToggleSelectingButton().click();
        RouteLineTableRow.getRouteLineTableRowCheckbox('901').check();
        ExportToolBar.getExportSelectedButton().click();
        Toast.expectDangerToast(
          'Seuraavia reittejä ei voida viedä: 901 (outbound). Ensimmäisen ja viimeisen pysäkin täytyy olla asetettuna käyttämään Hastus-paikkaa.',
        );
      },
    );

    it(
      'should show an error, when the last stop is not a timing point',
      { tags: [Tag.Routes] },
      () => {
        const { lineRouteListItem } = LineRouteList;
        const { routeRow, routeStopListItem } = lineRouteListItem;
        LineDetailsPage.visit(baseDbResources.lines[0].line_id);

        LineRouteList.getNthLineRouteListItem(0).within(() => {
          routeRow.getToggleAccordionButton().click();

          // Open E2E005 timing settings
          lineRouteListItem
            .getNthRouteStopListItem(4)
            .within(() => routeStopListItem.getStopActionsDropdown().click());
        });
        routeStopListItem.stopActionsDropdown
          .getOpenTimingSettingsButton()
          .click();

        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should(
          'be.checked',
        );
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().click();
        TimingSettingsForm.getSavebutton().click();
        Navbar.getRoutesAndLinesLink().click();
        RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

        ExportToolBar.getToggleSelectingButton().click();
        RouteLineTableRow.getRouteLineTableRowCheckbox('901').check();
        ExportToolBar.getExportSelectedButton().click();
        Toast.expectDangerToast(
          'Seuraavia reittejä ei voida viedä: 901 (outbound). Ensimmäisen ja viimeisen pysäkin täytyy olla asetettuna käyttämään Hastus-paikkaa.',
        );
      },
    );

    it(
      'should show an error, when neither the last stop nor the first stop is a timing point',
      { tags: [Tag.Routes] },
      () => {
        const { lineRouteListItem } = LineRouteList;
        const { routeRow, routeStopListItem } = lineRouteListItem;
        LineDetailsPage.visit(baseDbResources.lines[0].line_id);

        LineRouteList.getNthLineRouteListItem(0).within(() => {
          routeRow.getToggleAccordionButton().click();

          // Open E2E001 timing settings
          lineRouteListItem
            .getNthRouteStopListItem(0)
            .within(() => routeStopListItem.getStopActionsDropdown().click());
        });
        routeStopListItem.stopActionsDropdown
          .getOpenTimingSettingsButton()
          .click();

        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should(
          'be.checked',
        );
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().click();
        TimingSettingsForm.getSavebutton().click();

        LineRouteList.getNthLineRouteListItem(0).within(() => {
          // Open E2E005 timing settings
          lineRouteListItem
            .getNthRouteStopListItem(4)
            .within(() => routeStopListItem.getStopActionsDropdown().click());
        });
        routeStopListItem.stopActionsDropdown
          .getOpenTimingSettingsButton()
          .click();

        // Set route 901 (outbound) last stop to not be used as timing point
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().should(
          'be.checked',
        );
        TimingSettingsForm.getIsUsedAsTimingPointCheckbox().click();
        TimingSettingsForm.getSavebutton().click();
        Navbar.getRoutesAndLinesLink().click();
        RoutesAndLinesPage.searchContainer.getSearchInput().type('901{enter}');

        ExportToolBar.getToggleSelectingButton().click();
        RouteLineTableRow.getRouteLineTableRowCheckbox('901').check();
        ExportToolBar.getExportSelectedButton().click();
        Toast.expectDangerToast(
          'Seuraavia reittejä ei voida viedä: 901 (outbound). Ensimmäisen ja viimeisen pysäkin täytyy olla asetettuna käyttämään Hastus-paikkaa.',
        );
      },
    );
  });
});
