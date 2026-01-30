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
  TimetableVersionTableRow,
  TimetableVersionsPage,
  Toast,
  VehicleServiceRow,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';

describe('Timetable version details panel', { tags: [Tag.Timetables] }, () => {
  let dbResources: SupportedResources;

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
      const { timetableVersionTable } = TimetableVersionsPage;
      const { timetableVersionTableRow } = timetableVersionTable;

      timetableVersionTable.getRows().should('have.length', 2);

      timetableVersionTable
        .getRows()
        .eq(0)
        .within(() => {
          TimetableVersionTableRow.getDayType().shouldHaveText('Lauantai');
          TimetableVersionTableRow.getActionsButton().click();
        });

      timetableVersionTableRow.getVersionPanelMenuItemButton().click();

      TimetableVersionDetailsPanel.getHeading()
        .should('contain', 'Aikataulu voimassa')
        .and('contain', '1.1.2023 - 31.12.2023');

      timetableVersionTable.getRows().should('have.length', 2);

      TimetableVersionDetailsPanel.getRows()
        .eq(0)
        .findByTestId('DirectionBadge::outbound')
        .should('be.visible');

      timetableVersionTable.getRows().eq(0).should('contain', '901');

      TimetableVersionDetailsPanel.toggleExpandNthRow(0);

      TimetableVersionDetailsPanel.getRows()
        .eq(0)
        .within(() => {
          cy.getByTestId('VehicleServiceRow::row')
            .should('have.length', 3)
            .then((rows) => {
              // hour 07 departures
              cy.wrap(rows)
                .eq(0)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '07');
                  VehicleServiceRow.getMinute().should('have.length', 3);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '05');
                  VehicleServiceRow.getMinute().eq(1).should('contain', '15');
                  VehicleServiceRow.getMinute().eq(2).should('contain', '50');
                });

              // hour 08 departures
              cy.wrap(rows)
                .eq(1)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '08');
                  VehicleServiceRow.getMinute().should('have.length', 1);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '00');
                });

              // hour 09 departures
              cy.wrap(rows)
                .eq(2)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '09');
                  VehicleServiceRow.getMinute().should('have.length', 2);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '30');
                  VehicleServiceRow.getMinute().eq(1).should('contain', '40');
                });
            });
        });

      TimetableVersionDetailsPanel.toggleExpandNthRow(1);
      TimetableVersionDetailsPanel.getRows()
        .eq(1)
        .within(() => {
          cy.getByTestId('VehicleServiceRow::row')
            .should('have.length', 4)
            .then((rows) => {
              // hour 07 departures
              cy.wrap(rows)
                .eq(0)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '07');
                  VehicleServiceRow.getMinute().should('have.length', 2);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '30');
                  VehicleServiceRow.getMinute().eq(1).should('contain', '40');
                });

              // hour 08 departures
              cy.wrap(rows)
                .eq(1)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '08');
                  VehicleServiceRow.getMinute().should('have.length', 2);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '10');
                  VehicleServiceRow.getMinute().eq(1).should('contain', '20');
                });

              // hour 09 departures
              cy.wrap(rows)
                .eq(2)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '09');
                  VehicleServiceRow.getMinute().should('have.length', 1);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '55');
                });

              // hour 10 departures
              cy.wrap(rows)
                .eq(3)
                .within(() => {
                  VehicleServiceRow.getHour().should('contain', '10');
                  VehicleServiceRow.getMinute().should('have.length', 1);
                  VehicleServiceRow.getMinute().eq(0).should('contain', '05');
                });
            });
        });

      TimetableVersionDetailsPanel.getRows()
        .eq(1)
        .findByTestId('DirectionBadge::inbound')
        .should('be.visible');

      TimetableVersionDetailsPanel.close();

      TimetableVersionDetailsPanel.getHeading().should('not.exist');
    },
  );

  it('Should change the validity period and update all correct validities', () => {
    const { timetableVersionTable } = TimetableVersionsPage;
    const { timetableVersionTableRow } = timetableVersionTable;

    timetableVersionTable
      .getRows()
      .eq(0)
      .within(() => {
        timetableVersionTableRow.getDayType().shouldHaveText('Lauantai');
        timetableVersionTableRow.getActionsButton().click();
      });

    timetableVersionTableRow.getVersionPanelMenuItemButton().click();

    TimetableVersionDetailsPanel.getHeading()
      .should('contain', 'Aikataulu voimassa')
      .and('contain', '1.1.2023 - 31.12.2023');

    TimetableVersionDetailsPanel.toggleExpandNthRow(0);
    TimetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getChangeValidityButton()
      .eq(0)
      .click();

    ChangeTimetablesValidityForm.setValidityEndDate('2024-03-31');
    ChangeTimetablesValidityForm.getSaveButton().click();

    Toast.expectSuccessToast('Aikataulun voimassaolo tallennettu');

    // Check that the panel heading's validity changed
    TimetableVersionDetailsPanel.getHeading().should(
      'contain',
      '1.1.2023 - 31.3.2024',
    );

    TimetableVersionDetailsPanel.toggleExpandNthRow(1);
    // Check that both timetable card validity periods changed
    TimetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(0)
      .shouldHaveText('1.1.2023 - 31.3.2024');
    TimetableVersionDetailsPanel.vehicleJourneyGroupInfo
      .getValidityTimeRange()
      .eq(1)
      .shouldHaveText('1.1.2023 - 31.3.2024');

    // Check that the version row's validity changed
    timetableVersionTable.getNthRow(0).within(() => {
      TimetableVersionTableRow.getDayType().shouldHaveText('Lauantai');

      TimetableVersionTableRow.getValidityEnd().shouldHaveText('31.3.2024');
    });
  });
});
