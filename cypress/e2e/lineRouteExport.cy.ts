import {
  RouteDirectionEnum,
  buildStopInJourneyPattern,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  journeyPatterns,
  stopsInJourneyPattern901Inbound,
  testInfraLinkExternalIds,
} from '../datasets/base';
import { getClonedBaseStopRegistryData } from '../datasets/stopRegistry';
import { Tag } from '../enums';
import {
  LineDetailsPage,
  RouteReportDownloadMenu,
  RouteRow,
} from '../pageObjects';
import { UUID } from '../types';
import { SupportedResources, insertToDbHelper } from '../utils';
import { InsertedStopRegistryIds } from './utils';

const rootTags: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Routes],
};

// The 901 Outbound route driven order, as seeded into the journey pattern below.
const expectedDrivingOrder = ['E2E001', 'E2E002', 'E2E004', 'E2E005'];

describe('Line details page: route stop CSV export', rootTags, () => {
  let dbResources: SupportedResources;
  const baseDbResources = getClonedBaseDbResources();

  before(() => {
    cy.task<UUID[]>(
      'getInfrastructureLinkIdsByExternalIds',
      testInfraLinkExternalIds,
    ).then((infraLinkIds) => {
      dbResources = {
        ...baseDbResources,
        stopsInJourneyPattern: [
          ...stopsInJourneyPattern901Inbound,
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E001',
            scheduledStopPointSequence: 0,
            isUsedAsTimingPoint: true,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E002',
            scheduledStopPointSequence: 1,
            isUsedAsTimingPoint: false,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E004',
            scheduledStopPointSequence: 2,
            isUsedAsTimingPoint: false,
          }),
          buildStopInJourneyPattern({
            journeyPatternId: journeyPatterns[0].journey_pattern_id,
            stopLabel: 'E2E005',
            scheduledStopPointSequence: 3,
            isUsedAsTimingPoint: true,
          }),
        ],
        stops: buildStopsOnInfraLinks(infraLinkIds),
        infraLinksAlongRoute: buildInfraLinksAlongRoute(infraLinkIds),
      };
    });
  });

  beforeEach(() => {
    cy.task('resetDbs');
    insertToDbHelper(dbResources);
    // Links quays to the scheduled stop points via stop_place_ref, so the
    // route stops have stop registry data to export.
    cy.task<InsertedStopRegistryIds>(
      'insertStopRegistryData',
      getClonedBaseStopRegistryData(),
    );
    cy.setupTests();
    cy.mockLogin();
  });

  function openRouteDownloadMenu(fileName: string) {
    LineDetailsPage.visit(baseDbResources.lines[0].line_id);

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(fileName);
    });

    RouteRow.getRouteHeaderRow('901', RouteDirectionEnum.Outbound)
      .findByTestId('RouteReportDownloadMenu::menu')
      .click();
  }

  function getDataRowLabels(csv: string): ReadonlyArray<string> {
    return csv
      .split('\r\n')
      .slice(2)
      .filter((row) => row.startsWith('E2E'))
      .map((row) => row.split(';')[0]);
  }

  it(
    'lists route stops in driving order with route + direction columns',
    { tags: [Tag.Smoke] },
    () => {
      openRouteDownloadMenu('RouteEquipmentReport.csv');

      RouteReportDownloadMenu.getEquipmentReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      RouteReportDownloadMenu.getDownloadedEquipmentReport().then((csv) => {
        const rows = csv.split('\r\n');
        const header = rows[1];

        // The two new columns are placed between transport mode and Hastus place.
        expect(header).to.contain(
          'Joukkoliikennetyyppi;Reitti;Suunta;Hastus-paikka',
        );

        const dataRows = rows.slice(2).filter((row) => row.startsWith('E2E'));

        // Stops are listed in driving order, not by id.
        expect(dataRows.map((row) => row.split(';')[0])).to.eql(
          expectedDrivingOrder,
        );

        const columns = header.split(';');
        const firstRow = dataRows[0].split(';');
        expect(firstRow[columns.indexOf('Reitti')]).to.contain('901');
        expect(firstRow[columns.indexOf('Suunta')].length).to.be.greaterThan(0);
      });

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    },
  );

  it(
    'exports the info spot report for a route in driving order',
    { tags: [Tag.Smoke] },
    () => {
      openRouteDownloadMenu('RouteInfoSpotReport.csv');

      RouteReportDownloadMenu.getInfoSpotReportButton()
        .shouldBeVisible()
        .click();

      cy.getByTestId('TaskWithProgressBar').shouldBeVisible();

      RouteReportDownloadMenu.getDownloadedInfoSpotReport().then((csv) => {
        const header = csv.split('\r\n')[1];
        expect(header).to.contain(
          'Joukkoliikennetyyppi;Reitti;Suunta;Hastus-paikka',
        );

        const labels = getDataRowLabels(csv);
        expect(labels[0]).to.eq('E2E001');
        expect(labels).to.include.members(expectedDrivingOrder);
      });

      cy.getByTestId('TaskWithProgressBar').should('not.exist');
    },
  );
});
