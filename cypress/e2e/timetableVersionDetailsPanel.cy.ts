import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { getClonedBaseTimetableDataInput } from '../datasets/timetables';
import { Tag } from '../enums';
import {
  ChangeTimetablesValidityForm,
  TimetableVersionDetailsPanel,
  TimetableVersionsPage,
  Toast,
  VehicleServiceRow,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable version details panel', { tags: [Tag.Timetables] }, () => {
  let dbResources: SupportedResources;
  let timetableVersionsPage: TimetableVersionsPage;
  let timetableVersionDetailsPanel: TimetableVersionDetailsPanel;
  let changeTimetablesValidityForm: ChangeTimetablesValidityForm;
  let vehicleServiceRow: VehicleServiceRow;
  let toast: Toast;

  const baseDbResources = getClonedBaseDbResources();
  const baseTimetableDataInput = getClonedBaseTimetableDataInput();

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
    cy.task('insertHslTimetablesDatasetToDb', baseTimetableDataInput);

    timetableVersionsPage = new TimetableVersionsPage();
    timetableVersionDetailsPanel = new TimetableVersionDetailsPanel();
    changeTimetablesValidityForm = new ChangeTimetablesValidityForm();
    vehicleServiceRow = new VehicleServiceRow();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
    cy.visit(
      `/timetables/lines/901/versions?startDate=2023-03-04&endDate=2024-03-04`,
    );
  });

  it(
    'Should open, have correct details, and close',
    { tags: [Tag.Smoke] },
    () => {
      const { timetableVersionTable } = timetableVersionsPage;
      const { timetableVersionTableRow } = timetableVersionTable;

      timetableVersionsPage.timetableVersionTable
        .getRows()
        .should('have.length', 2);

      timetableVersionTable
        .getRows()
        .eq(0)
        .within(() => {
          timetableVersionTableRow.getDayType().shouldHaveText('Lauantai');
          timetableVersionTableRow.getActionsButton().click();
        });

      timetableVersionTableRow.getVersionPanelMenuItemButton().click();

      timetableVersionDetailsPanel
        .getHeading()
        .should('contain', 'Aikataulu voimassa')
        .and('contain', '1.1.2023 - 31.12.2023');

      timetableVersionDetailsPanel.getRows().should('have.length', 2);

      timetableVersionDetailsPanel
        .getRows()
        .eq(0)
        .findByTestId('DirectionBadge::outbound')
        .should('be.visible');

      timetableVersionDetailsPanel.getRows().eq(0).should('contain', '901');

      timetableVersionDetailsPanel.toggleExpandNthRow(0);

      timetableVersionDetailsPanel
        .getRows()
        .eq(0)
        .findByTestId('VehicleServiceRow::row')
        .then((rows) => {
          cy.wrap(rows).should('have.length', 3);
          // hour 07 departures
          cy.wrap(rows)
            .eq(0)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '07');
              vehicleServiceRow.getMinute().should('have.length', 3);
              vehicleServiceRow.getMinute().eq(0).should('contain', '05');
              vehicleServiceRow.getMinute().eq(1).should('contain', '15');
              vehicleServiceRow.getMinute().eq(2).should('contain', '50');
            });

          // hour 08 departures
          cy.wrap(rows)
            .eq(1)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '08');
              vehicleServiceRow.getMinute().should('have.length', 1);
              vehicleServiceRow.getMinute().eq(0).should('contain', '00');
            });

          // hour 09 departures
          cy.wrap(rows)
            .eq(2)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '09');
              vehicleServiceRow.getMinute().should('have.length', 2);
              vehicleServiceRow.getMinute().eq(0).should('contain', '30');
              vehicleServiceRow.getMinute().eq(1).should('contain', '40');
            });
        });

      timetableVersionDetailsPanel.toggleExpandNthRow(1);
      timetableVersionDetailsPanel
        .getRows()
        .eq(1)
        .findByTestId('VehicleServiceRow::row')
        .then((rows) => {
          cy.wrap(rows).should('have.length', 4);
          // hour 07 departures
          cy.wrap(rows)
            .eq(0)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '07');
              vehicleServiceRow.getMinute().should('have.length', 2);
              vehicleServiceRow.getMinute().eq(0).should('contain', '30');
              vehicleServiceRow.getMinute().eq(1).should('contain', '40');
            });

          // hour 08 departures
          cy.wrap(rows)
            .eq(1)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '08');
              vehicleServiceRow.getMinute().should('have.length', 2);
              vehicleServiceRow.getMinute().eq(0).should('contain', '10');
              vehicleServiceRow.getMinute().eq(1).should('contain', '20');
            });

          // hour 09 departures
          cy.wrap(rows)
            .eq(2)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '09');
              vehicleServiceRow.getMinute().should('have.length', 1);
              vehicleServiceRow.getMinute().eq(0).should('contain', '55');
            });

          // hour 10 departures
          cy.wrap(rows)
            .eq(3)
            .within(() => {
              vehicleServiceRow.getHour().should('contain', '10');
              vehicleServiceRow.getMinute().should('have.length', 1);
              vehicleServiceRow.getMinute().eq(0).should('contain', '05');
            });
        });

      timetableVersionDetailsPanel
        .getRows()
        .eq(1)
        .findByTestId('DirectionBadge::inbound')
        .should('be.visible');

      timetableVersionDetailsPanel.close();

      timetableVersionDetailsPanel.getHeading().should('not.exist');
    },
  );

  it('Should change the validity period and update all correct validities', () => {
    const { timetableVersionTable } = timetableVersionsPage;
    const { timetableVersionTableRow } = timetableVersionTable;

    timetableVersionTable
      .getRows()
      .eq(0)
      .within(() => {
        timetableVersionTableRow.getDayType().shouldHaveText('Lauantai');
        timetableVersionTableRow.getActionsButton().click();
      });

    timetableVersionTableRow.getVersionPanelMenuItemButton().click();

    timetableVersionDetailsPanel
      .getHeading()
      .should('contain', 'Aikataulu voimassa')
      .and('contain', '1.1.2023 - 31.12.2023');

    timetableVersionDetailsPanel.toggleExpandNthRow(0);
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getChangeValidityButton()
      .eq(0)
      .click();

    changeTimetablesValidityForm.setValidityEndDate('2024-03-31');
    changeTimetablesValidityForm.getSaveButton().click();

    toast.expectSuccessToast('Aikataulun voimassaolo tallennettu');

    // Check that the panel heading's validity changed
    timetableVersionDetailsPanel
      .getHeading()
      .should('contain', '1.1.2023 - 31.3.2024');

    timetableVersionDetailsPanel.toggleExpandNthRow(1);

    // Check that both timetable card validity periods changed
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(0)
      .shouldHaveText('1.1.2023 - 31.3.2024');
    timetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(1)
      .shouldHaveText('1.1.2023 - 31.3.2024');

    // Check that the version row's validity changed
    timetableVersionTable.getNthRow(0).within(() => {
      timetableVersionTableRow.getDayType().shouldHaveText('Lauantai');

      timetableVersionTableRow.getValidityEnd().shouldHaveText('31.3.2024');
    });
  });
});
