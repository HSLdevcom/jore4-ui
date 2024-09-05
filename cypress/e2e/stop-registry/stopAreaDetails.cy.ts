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
import { getCLonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { StopAreaDetailsPage } from '../../pageObjects';
import { UUID } from '../../types';
import { SupportedResources, insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';

describe('Stop area details', () => {
  const stopAreaDetailsPage = new StopAreaDetailsPage();

  let dbResources: SupportedResources;

  const baseDbResources = getClonedBaseDbResources();
  const baseStopRegistryData = getCLonedBaseStopRegistryData();

  const stopAreaData: Array<StopAreaInput> = [
    {
      memberLabels: ['E2E001', 'E2E009'],
      stopArea: {
        name: { lang: 'fin', value: 'X0003' },
        description: { lang: 'fin', value: 'Annankatu 15' },
        validBetween: {
          fromDate: DateTime.fromISO('2020-01-01T00:00:00.001'),
          toDate: DateTime.fromISO('2050-01-01T00:00:00.001'),
        },
        geometry: {
          coordinates: [24.938927, 60.165433],
          type: StopRegistryGeoJsonType.Point,
        },
      },
    },
  ];

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

  describe('View basic details', () => {
    let insertedData: InsertedStopRegistryIds;

    before(() => {
      cy.task('resetDbs');

      insertToDbHelper(dbResources);

      cy.task<InsertedStopRegistryIds>('insertStopRegistryData', {
        ...baseStopRegistryData,
        stopAreas: stopAreaData,
      }).then((data) => {
        insertedData = data;
      });
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();

      const id = insertedData.stopAreaIdsByName.X0003;

      stopAreaDetailsPage.visit(id);
    });

    it('should have title & description', () => {
      stopAreaDetailsPage.titleRow.getName().shouldHaveText('X0003');
      stopAreaDetailsPage.titleRow
        .getDescription()
        .shouldHaveText('Annankatu 15');
    });

    it('should have version info', () => {
      stopAreaDetailsPage.versioningRow
        .getValidityPeriod()
        .shouldHaveText('1.1.2020-1.1.2050');
    });

    it('should have details', () => {
      const { details } = stopAreaDetailsPage;
      details.getName().shouldHaveText('X0003');
      details.getDescription().shouldHaveText('Annankatu 15');
      details.getParentStopPlace().shouldHaveText('-');
      details.getAreaSize().shouldHaveText('-');
      details.getValidityPeriod().shouldHaveText('1.1.2020-1.1.2050');
    });

    ['E2E001', 'E2E009'].forEach((label) =>
      it(`should have member stop ${label}`, () => {
        const row = stopAreaDetailsPage.memberStops.getStopRow(label);

        row.getSelf().shouldBeVisible();

        row
          .getLink()
          .shouldBeVisible()
          .should('have.attr', 'href', `/stop-registry/stops/${label}`);

        row.getShowOnMapButton().shouldBeVisible();

        row.getActionMenu().click();
        row
          .getShowStopDetailsMenuItem()
          .shouldBeVisible()
          .shouldHaveText('Näytä pysäkin tiedot');
        row
          .getShowOnMapMenuItem()
          .shouldBeVisible()
          .shouldHaveText('Näytä pysäkki kartalla');
        row
          .getRemoveStopMenuItem()
          .shouldBeVisible()
          .shouldBeDisabled()
          .shouldHaveText('Poista pysäkki pysäkkialueelta');
      }),
    );
  });
});
