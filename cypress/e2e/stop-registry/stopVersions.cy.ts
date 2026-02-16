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
import { Tag } from '../../enums';
import { Map, MapObservationDateFiltersOverlay } from '../../pageObjects/map';
import {
  StopDetailsPage,
  StopPopUp,
  StopVersionPage,
  StopVersionRow,
  StopVersionTableColumn,
  StopVersionsTableHeader,
} from '../../pageObjects/stop-registry';
import { UUID } from '../../types';
import { insertToDbHelper } from '../../utils';
import { InsertedStopRegistryIds } from '../utils';
import Chainable = Cypress.Chainable;

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

type TranslatedStatus = 'Voimassa' | 'Perusversio' | 'Väliaikainen' | 'Luonnos';

type StopVersionRowValues = {
  readonly status?: TranslatedStatus;
  readonly validityStart?: string | DateTime | null;
  readonly validityEnd?: string | DateTime | null;
  readonly versionComment?: string | null;
  readonly changed?: string | null;
  readonly changedBy?: string | null;
};

const active: StopVersionRowValues = { status: 'Voimassa' };
const standard: StopVersionRowValues = { status: 'Perusversio' };
const temporary: StopVersionRowValues = { status: 'Väliaikainen' };
const draft: StopVersionRowValues = { status: 'Luonnos' };

/**
 * Check that the column/Cypress jQuery element has the given value
 * @param column Stop version row column
 * @param value Expected value
 */
function checkColumn(
  column: Chainable<JQuery>,
  value: string | DateTime | undefined | null,
) {
  if (value === null || value === '') {
    column.should('be.empty');
  } else if (value instanceof DateTime) {
    column.shouldHaveText(value.toFormat('d.L.yyyy'));
  } else if (typeof value === 'string') {
    column.shouldHaveText(value);
  }

  // Else undefined → Ignore / dont test
}

// Check all defined columns for expected values.
function checkRowColumns(version: Partial<StopVersionRowValues>) {
  checkColumn(StopVersionRow.status(), version.status);
  checkColumn(StopVersionRow.validityStart(), version.validityStart);
  checkColumn(StopVersionRow.validityEnd(), version.validityEnd);
  checkColumn(StopVersionRow.versionComment(), version.versionComment);
  checkColumn(StopVersionRow.changed(), version.changed);
  checkColumn(StopVersionRow.changedBy(), version.changedBy);
}

// Get row by index and check it has the given version info.
function checkRow(
  index: number,
  // Typed this way to help keep actual test code visually "pretty",
  // and simple to read.
  ...versionInfoFragments: ReadonlyArray<
    Partial<StopVersionRowValues & StopVersionOutput>
  >
) {
  const versionInfo = versionInfoFragments.reduce(
    (r, f) => ({ ...r, ...f }),
    {},
  );

  StopVersionRow.rows().should('have.length.at.least', index + 1);
  StopVersionRow.rows()
    .eq(index)
    .within(() => checkRowColumns(versionInfo));
}

function checkScheduledRow(
  index: number,
  ...versionInfoFragments: ReadonlyArray<
    Partial<StopVersionRowValues & StopVersionOutput>
  >
) {
  StopVersionPage.scheduledVersions().within(() =>
    checkRow(index, ...versionInfoFragments),
  );
}

function checkDraftRow(
  index: number,
  ...versionInfoFragments: ReadonlyArray<
    Partial<StopVersionRowValues & StopVersionOutput>
  >
) {
  StopVersionPage.draftVersions().within(() =>
    checkRow(index, ...versionInfoFragments),
  );
}

function getTdsByTableColumn(
  column: StopVersionTableColumn,
): Chainable<JQuery> {
  switch (column) {
    case 'STATUS':
      return StopVersionRow.status();

    case 'VALIDITY_START':
      return StopVersionRow.validityStart();

    case 'VALIDITY_END':
      return StopVersionRow.validityEnd();

    case 'VERSION_COMMENT':
      return StopVersionRow.versionComment();

    case 'CHANGED':
      return StopVersionRow.changed();

    case 'CHANGED_BY':
      return StopVersionRow.changedBy();

    default:
      throw new Error(`Unknown Table column: ${column}`);
  }
}

// Check whether the table is sorted on a column
function checkSortedOnColumn(
  column: StopVersionTableColumn,
  expectedValues: ReadonlyArray<string | DateTime | null>,
) {
  const rows = StopVersionRow.rows();

  rows.should('have.length', expectedValues.length);

  for (let i = 0; i < expectedValues.length; i += 1) {
    const expectedValue = expectedValues[i];
    StopVersionRow.rows()
      .eq(i)
      .within(() => checkColumn(getTdsByTableColumn(column), expectedValue));
  }
}

function checkSortingWorksOnColumnInBothDirections(
  table: 'scheduled' | 'drafts',
  column: StopVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  (table === 'scheduled'
    ? StopVersionPage.scheduledVersions()
    : StopVersionPage.draftVersions()
  ).within(() => {
    StopVersionsTableHeader.setSorting(column, 'ascending');
    checkSortedOnColumn(column, expectedAscendingOrder);

    StopVersionsTableHeader.setSorting(column, 'descending');
    checkSortedOnColumn(column, [...expectedAscendingOrder].reverse());
  });
}

function testScheduledVersionsSorting(
  column: StopVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    'scheduled',
    column,
    expectedAscendingOrder,
  );
}

function testDraftVersionsSorting(
  column: StopVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    'drafts',
    column,
    expectedAscendingOrder,
  );
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
      checkDraftRow(0, draft, draftOneVersion);
      checkDraftRow(0, draft, draftTwoVersion);
      checkDraftRow(0, draft, draftThreeVersion);
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

      checkScheduledRow(0, standard, currentStandardVersion.info);
      checkScheduledRow(1, active, todayTempVersion.info);
      // Time filters should affect drafts
      validateDraftVersions();

      // Show all
      StopVersionPage.startDate().inputDateValue(areaValidityStart);
      StopVersionPage.endDate().inputDateValue(areaValidityEnd);

      checkScheduledRow(0, standard, pastStandardVersion.info);
      checkScheduledRow(1, standard, currentStandardVersion.info);
      checkScheduledRow(2, active, todayTempVersion.info);
      checkScheduledRow(3, temporary, nextMonthTempVersion.info);
      checkScheduledRow(4, standard, futureStandardVersion.info);

      // Time filters should affect drafts
      validateDraftVersions();
    });

    it('should sort versions', () => {
      // Show all
      StopVersionPage.startDate().inputDateValue(areaValidityStart);
      StopVersionPage.endDate().inputDateValue(areaValidityEnd);

      // By default, should be sorted on validity Start
      testScheduledVersionsSorting('VALIDITY_START', [
        pastStandardVersion.info.validityStart,
        currentStandardVersion.info.validityStart,
        todayTempVersion.info.validityStart,
        nextMonthTempVersion.info.validityStart,
        futureStandardVersion.info.validityStart,
      ]);

      testScheduledVersionsSorting('VALIDITY_END', [
        pastStandardVersion.info.validityEnd,
        todayTempVersion.info.validityEnd,
        nextMonthTempVersion.info.validityEnd,
        currentStandardVersion.info.validityEnd,
        futureStandardVersion.info.validityEnd,
      ]);

      testScheduledVersionsSorting('VERSION_COMMENT', [
        currentStandardVersion.info.comment,
        futureStandardVersion.info.comment,
        pastStandardVersion.info.comment,
        todayTempVersion.info.comment,
        nextMonthTempVersion.info.comment,
      ]);

      // Draft version
      testDraftVersionsSorting('VALIDITY_START', [
        draftOneVersion.info.validityStart,
        draftTwoVersion.info.validityStart,
        draftThreeVersion.info.validityStart,
      ]);

      testDraftVersionsSorting('VALIDITY_END', [
        draftOneVersion.info.validityEnd,
        draftTwoVersion.info.validityEnd,
        draftThreeVersion.info.validityEnd,
      ]);

      testDraftVersionsSorting('VERSION_COMMENT', [
        draftOneVersion.info.comment,
        draftTwoVersion.info.comment,
        draftThreeVersion.info.comment,
      ]);

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
