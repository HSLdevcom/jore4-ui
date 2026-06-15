import {
  KnownValueKey,
  Priority,
  StopAreaInput,
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  StopRegistryQuayInput,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import {
  buildInfraLinksAlongRoute,
  buildStopsOnInfraLinks,
  getClonedBaseDbResources,
  testInfraLinkExternalIds,
} from '../../datasets/base';
import { getClonedBaseStopRegistryData } from '../../datasets/stopRegistry';
import { StopPlaceState, Tag } from '../../enums';
import { Map, MapObservationDateFiltersOverlay } from '../../pageObjects/map';
import {
  StopDetailsPage,
  StopPopUp,
  StopVersionPage,
  StopVersionRow,
  StopVersionsTableHeader,
} from '../../pageObjects/stop-registry';
import { UUID } from '../../types';
import { insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';
import {
  active,
  checkDraftRow,
  checkScheduledRow,
  draft,
  standard,
  temporary,
  testDraftVersionsSorting,
  testScheduledVersionsSorting,
} from '../utils/versionTestUtils';

// Make stop version utilities
type StopVersionInfo = {
  readonly priority: Priority;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | null;
  readonly comment: string;
};

type StopVersionOutput = {
  readonly info: StopVersionInfo;
  readonly input: StopRegistryQuayInput;
};

let importedId = 0;
function makeStopVersion(info: StopVersionInfo): StopVersionOutput {
  const { priority, validityStart, validityEnd, comment } = info;

  const input: StopRegistryQuayInput = {
    keyValues: compact([
      { key: KnownValueKey.Priority, values: [priority.toString(10)] },
      {
        key: KnownValueKey.ValidityStart,
        values: [validityStart.toISODate()],
      },
      validityEnd
        ? {
            key: KnownValueKey.ValidityEnd,
            values: [validityEnd.toISODate()],
          }
        : null,
      {
        key: KnownValueKey.ImportedId,
        values: [(importedId++).toString(10)],
      },
      { key: KnownValueKey.StopState, values: [StopPlaceState.InOperation] },
    ]),
    versionComment: comment,
    geometry: {
      coordinates: [24.938927, 60.165433],
      type: StopRegistryGeoJsonType.Point,
    },
  };

  return { info, input };
}

// Base validity period values
const today = DateTime.now().startOf('day');
const areaValidityStart = today.minus({ years: 10 });
const areaValidityEnd = today.plus({ years: 10 });

// Base stop versions
const pastStandardEnd = today.minus({ year: 1 });
const pastStandardVersion = makeStopVersion({
  priority: Priority.Standard,
  validityStart: areaValidityStart,
  validityEnd: pastStandardEnd,
  comment: 'Past Standard Version',
});

const currentStandardEnd = today.plus({ years: 5 });
const currentStandardVersion = makeStopVersion({
  priority: Priority.Standard,
  validityStart: pastStandardEnd.plus({ day: 1 }),
  validityEnd: currentStandardEnd,
  comment: 'Current Standard Version',
});

const futureStandardVersion = makeStopVersion({
  priority: Priority.Standard,
  validityStart: currentStandardEnd.plus({ days: 1 }),
  validityEnd: null,
  comment: 'Future Standard Version',
});

const todayTempVersion = makeStopVersion({
  priority: Priority.Temporary,
  validityStart: today,
  validityEnd: today,
  comment: 'Temporarily out of use due to a parade',
});

const nextMonthTempVersion = makeStopVersion({
  priority: Priority.Temporary,
  validityStart: today.plus({ month: 1 }).startOf('month'),
  validityEnd: today.plus({ month: 1 }).endOf('month'),
  comment: 'Temporarily out of use due to sewer works',
});

const draftOneEnd = areaValidityStart.plus({ years: 6, months: 8 });
const draftOneVersion = makeStopVersion({
  priority: Priority.Draft,
  validityStart: areaValidityStart,
  validityEnd: draftOneEnd,
  comment: '1st Draft Version',
});

const draftTwoEnd = draftOneEnd.plus({ years: 6, months: 8 });
const draftTwoVersion = makeStopVersion({
  priority: Priority.Draft,
  validityStart: draftOneEnd.plus({ day: 1 }),
  validityEnd: draftTwoEnd,
  comment: '2nd Draft Version',
});

const draftThreeVersion = makeStopVersion({
  priority: Priority.Draft,
  validityStart: draftTwoEnd.plus({ day: 1 }),
  validityEnd: areaValidityEnd,
  comment: '3rd Draft Version',
});

// Utils to ake and save a stop area with the given versions of a stop.
type StopAreaOutput = {
  readonly input: StopAreaInput;
  readonly index: number;
  readonly privateCode: string;
  readonly publicCode: string;
};

let codeIndex = 1;
function makeStopArea(
  ...stops: ReadonlyArray<StopVersionOutput>
): StopAreaOutput {
  const index = codeIndex++;
  const indexName = index.toString(10).padStart(4, '0');
  const privateCode = `SA${indexName}`;
  const publicCode = `SV${indexName}`;

  const input: StopAreaInput = {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: privateCode },
      name: { lang: 'fin', value: `Versiokatu ${index.toString(10)}` },
      alternativeNames: [
        {
          nameType: StopRegistryNameType.Translation,
          name: { lang: 'swe', value: `Versiongatan ${index.toString(10)}` },
        },
      ],
      keyValues: [
        {
          key: KnownValueKey.ValidityStart,
          values: [areaValidityStart.toISODate()],
        },
        {
          key: KnownValueKey.ValidityEnd,
          values: [areaValidityEnd.toISODate()],
        },
      ],
      geometry: {
        coordinates: [24.938927, 60.165433],
        type: StopRegistryGeoJsonType.Point,
      },
      quays: stops.map((it) => ({ ...it.input, publicCode })),
    },
    organisations: null,
  };

  return { input, index, privateCode, publicCode };
}

type InsertedStopArea = {
  readonly netexId: string;
  readonly stopArea: StopAreaOutput;
};
function insertStopArea(stopArea: StopAreaOutput) {
  return cy
    .task<InsertedStopRegistryIds>('insertStopRegistryData', {
      stopPlaces: [stopArea.input],
      stopPointsRequired: false,
    })
    .then((registryIds): InsertedStopArea => {
      const netexId = registryIds.stopPlaceIdsByName[stopArea.privateCode];
      return { netexId, stopArea };
    });
}

describe('Stop Versions Page', { tags: [Tag.StopRegistry] }, () => {
  before(() => cy.task('resetDbs'));

  describe('Full set of versions', () => {
    let stopArea: InsertedStopArea;

    before(() => {
      insertStopArea(
        makeStopArea(
          pastStandardVersion,
          currentStandardVersion,
          futureStandardVersion,
          todayTempVersion,
          nextMonthTempVersion,
          draftOneVersion,
          draftTwoVersion,
          draftThreeVersion,
        ),
      ).then((inserted) => {
        stopArea = inserted;
      });
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();

      StopVersionPage.visit(stopArea.stopArea.publicCode);
      StopVersionPage.pageLoader().should('not.exist');
    });

    function validateDraftVersions() {
      checkDraftRow(
        StopVersionPage,
        StopVersionRow,
        0,
        draft,
        draftOneVersion.info,
      );
      checkDraftRow(
        StopVersionPage,
        StopVersionRow,
        1,
        draft,
        draftTwoVersion.info,
      );
      checkDraftRow(
        StopVersionPage,
        StopVersionRow,
        2,
        draft,
        draftThreeVersion.info,
      );
    }

    it('should have name info', { tags: [Tag.Smoke] }, () => {
      const { index, publicCode } = stopArea.stopArea;
      const titleBase = `Versiot | Pysäkki ${publicCode}`;

      StopVersionPage.title().shouldHaveText(titleBase);
      cy.title().should(
        'eq',
        `${titleBase} Versiokatu ${index} - Jore4 Testiversio`,
      );

      StopVersionPage.names().shouldHaveText(
        `Versiokatu ${index} - Versiongatan ${index}`,
      );
    });

    it('should filter and list versions', () => {
      // Limit to today
      StopVersionPage.startDate().inputDateValue(today);
      StopVersionPage.endDate().inputDateValue(today);

      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        0,
        standard,
        currentStandardVersion.info,
      );
      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        1,
        active,
        todayTempVersion.info,
      );
      // Time filters should affect drafts
      validateDraftVersions();

      // Show all
      StopVersionPage.startDate().inputDateValue(areaValidityStart);
      StopVersionPage.endDate().inputDateValue(areaValidityEnd);

      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        0,
        standard,
        pastStandardVersion.info,
      );
      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        1,
        standard,
        currentStandardVersion.info,
      );
      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        2,
        active,
        todayTempVersion.info,
      );
      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        3,
        temporary,
        nextMonthTempVersion.info,
      );
      checkScheduledRow(
        StopVersionPage,
        StopVersionRow,
        4,
        standard,
        futureStandardVersion.info,
      );

      // Time filters should affect drafts
      validateDraftVersions();
    });

    it('should sort versions', () => {
      // Show all
      StopVersionPage.startDate().inputDateValue(areaValidityStart);
      StopVersionPage.endDate().inputDateValue(areaValidityEnd);

      // By default, should be sorted on validity Start
      testScheduledVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VALIDITY_START',
        [
          pastStandardVersion.info.validityStart,
          currentStandardVersion.info.validityStart,
          todayTempVersion.info.validityStart,
          nextMonthTempVersion.info.validityStart,
          futureStandardVersion.info.validityStart,
        ],
      );

      testScheduledVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VALIDITY_END',
        [
          pastStandardVersion.info.validityEnd,
          todayTempVersion.info.validityEnd,
          nextMonthTempVersion.info.validityEnd,
          currentStandardVersion.info.validityEnd,
          futureStandardVersion.info.validityEnd,
        ],
      );

      testScheduledVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VERSION_COMMENT',
        [
          currentStandardVersion.info.comment,
          futureStandardVersion.info.comment,
          pastStandardVersion.info.comment,
          todayTempVersion.info.comment,
          nextMonthTempVersion.info.comment,
        ],
      );

      // Draft version
      testDraftVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VALIDITY_START',
        [
          draftOneVersion.info.validityStart,
          draftTwoVersion.info.validityStart,
          draftThreeVersion.info.validityStart,
        ],
      );

      testDraftVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VALIDITY_END',
        [
          draftOneVersion.info.validityEnd,
          draftTwoVersion.info.validityEnd,
          draftThreeVersion.info.validityEnd,
        ],
      );

      testDraftVersionsSorting(
        StopVersionPage,
        StopVersionRow,
        StopVersionsTableHeader,
        'VERSION_COMMENT',
        [
          draftOneVersion.info.comment,
          draftTwoVersion.info.comment,
          draftThreeVersion.info.comment,
        ],
      );

      // Changed cannot be tested as all the versions get inserted simultaneously.
      // We would need a direct DB connection so that we could 🔪 proper data in.

      // Changed by is not implemented yet.
    });
  });

  describe('Actions', { tags: [Tag.Map] }, () => {
    before(() => {
      cy.task<UUID[]>(
        'getInfrastructureLinkIdsByExternalIds',
        testInfraLinkExternalIds,
      )
        .then((infraLinkIds) => {
          const stops = buildStopsOnInfraLinks(infraLinkIds);
          const infraLinksAlongRoute = buildInfraLinksAlongRoute(infraLinkIds);

          return insertToDbHelper({
            ...getClonedBaseDbResources(),
            stops,
            infraLinksAlongRoute,
          });
        })
        .then(() =>
          cy.task<InsertedStopRegistryIds>(
            'insertStopRegistryData',
            getClonedBaseStopRegistryData(),
          ),
        );
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();

      StopVersionPage.visit('E2E001');
      StopVersionPage.pageLoader().should('not.exist');
    });

    it('should have working locator button on row', () => {
      StopVersionPage.scheduledVersions().within(() => {
        StopVersionRow.rows()
          .eq(0)
          .within(() => StopVersionRow.locatorButton().click());
      });

      Map.waitForLoadToComplete();

      MapObservationDateFiltersOverlay.observationDateControl
        .getObservationDateInput()
        .should('have.attr', 'value', '2020-03-20');

      StopPopUp.getLabel().shouldHaveText('E2E001 Annankatu 15');
    });

    it('should have working map link in action menu', () => {
      StopVersionPage.scheduledVersions().within(() => {
        StopVersionRow.rows()
          .eq(0)
          .within(() => StopVersionRow.actionMenu().click());
      });
      StopVersionRow.actionMenuShowOnMap().click();

      Map.waitForLoadToComplete();

      MapObservationDateFiltersOverlay.observationDateControl
        .getObservationDateInput()
        .should('have.attr', 'value', '2020-03-20');

      StopPopUp.getLabel().shouldHaveText('E2E001 Annankatu 15');
    });

    it('should have working show details action menu', () => {
      StopVersionPage.scheduledVersions().within(() => {
        StopVersionRow.rows()
          .eq(0)
          .within(() => StopVersionRow.actionMenu().click());
      });
      StopVersionRow.actionMenuShowStopDetails().click();

      StopDetailsPage.loadingStopDetails().should('not.exist');

      StopDetailsPage.titleRow.label().shouldHaveText('E2E001');
      StopDetailsPage.returnToDateBasedVersionSelection()
        .shouldBeVisible()
        .click();
      StopDetailsPage.observationDateControl
        .getObservationDateInput()
        .should('have.attr', 'value', '2020-03-20');
    });
  });
});
