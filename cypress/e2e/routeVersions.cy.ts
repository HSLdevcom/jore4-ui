import {
  Priority,
  RouteDirectionEnum,
  RouteInsertInput,
  buildLine,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DateTime } from 'luxon';
import { Tag } from '../enums';
import {
  RouteVersionPage,
  RouteVersionRow,
  RouteVersionTableColumn,
  RouteVersionsTableHeader,
} from '../pageObjects/routes-and-lines';
import { insertToDbHelper } from '../utils';
import Chainable = Cypress.Chainable;

// Make route version utilities
type RouteVersionInfo = {
  readonly priority: Priority;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime | null;
  readonly comment: string;
};

type RouteVersionOutput = {
  readonly info: RouteVersionInfo;
  readonly input: RouteInsertInput;
};

// Create a dedicated line for our test route versions
const testLine = {
  ...buildLine({ label: 'RV999' }),
  line_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  validity_start: DateTime.fromISO('2016-01-01'),
  validity_end: null, // Always valid
};

// Pre-generated UUIDs for test route versions
const routeIds = [
  '11111111-1111-4111-a111-111111111111',
  '22222222-2222-4222-a222-222222222222',
  '33333333-3333-4333-a333-333333333333',
  '44444444-4444-4444-a444-444444444444',
  '55555555-5555-4555-a555-555555555555',
  '66666666-6666-4666-a666-666666666666',
  '77777777-7777-4777-a777-777777777777',
  '88888888-8888-4888-a888-888888888888',
];

let routeIdCounter = 0;
function makeRouteVersion(info: RouteVersionInfo): RouteVersionOutput {
  const { priority, validityStart, validityEnd, comment } = info;

  const label = 'RV999';
  const input: RouteInsertInput = {
    route_id: routeIds[routeIdCounter++],
    name_i18n: { fi_FI: `Route ${label}` },
    description_i18n: { fi_FI: comment },
    origin_name_i18n: { fi_FI: `Origin ${label}` },
    origin_short_name_i18n: { fi_FI: `Origin ${label}` },
    destination_name_i18n: { fi_FI: `Destination ${label}` },
    destination_short_name_i18n: { fi_FI: `Destination ${label}` },
    direction: RouteDirectionEnum.Outbound,
    on_line_id: testLine.line_id,
    priority,
    label,
    validity_start: validityStart,
    validity_end: validityEnd,
    variant: null,
    legacy_hsl_municipality_code: 'helsinki',
  };

  return { info, input };
}

// Base validity period values
const today = DateTime.now().startOf('day');
const lineValidityStart = today.minus({ years: 10 });
const lineValidityEnd = today.plus({ years: 10 });

// Base route versions
const pastStandardEnd = today.minus({ year: 1 });
const pastStandardVersion = makeRouteVersion({
  priority: Priority.Standard,
  validityStart: lineValidityStart,
  validityEnd: pastStandardEnd,
  comment: 'Past Standard Version',
});

const currentStandardEnd = today.plus({ years: 5 });
const currentStandardVersion = makeRouteVersion({
  priority: Priority.Standard,
  validityStart: pastStandardEnd.plus({ day: 1 }),
  validityEnd: currentStandardEnd,
  comment: 'Current Standard Version',
});

const futureStandardVersion = makeRouteVersion({
  priority: Priority.Standard,
  validityStart: currentStandardEnd.plus({ days: 1 }),
  validityEnd: null,
  comment: 'Future Standard Version',
});

const todayTempVersion = makeRouteVersion({
  priority: Priority.Temporary,
  validityStart: today,
  validityEnd: today,
  comment: 'Temporarily out of use due to a parade',
});

const nextMonthTempVersion = makeRouteVersion({
  priority: Priority.Temporary,
  validityStart: today.plus({ month: 1 }).startOf('month'),
  validityEnd: today.plus({ month: 1 }).endOf('month'),
  comment: 'Temporarily out of use due to road works',
});

const draftOneEnd = lineValidityStart.plus({ years: 6, months: 8 });
const draftOneVersion = makeRouteVersion({
  priority: Priority.Draft,
  validityStart: lineValidityStart,
  validityEnd: draftOneEnd,
  comment: '1st Draft Version',
});

const draftTwoEnd = draftOneEnd.plus({ years: 6, months: 8 });
const draftTwoVersion = makeRouteVersion({
  priority: Priority.Draft,
  validityStart: draftOneEnd.plus({ day: 1 }),
  validityEnd: draftTwoEnd,
  comment: '2nd Draft Version',
});

const draftThreeVersion = makeRouteVersion({
  priority: Priority.Draft,
  validityStart: draftTwoEnd.plus({ day: 1 }),
  validityEnd: lineValidityEnd,
  comment: '3rd Draft Version',
});

type TranslatedStatus = 'Voimassa' | 'Perusversio' | 'Väliaikainen' | 'Luonnos';

type RouteVersionRowValues = {
  readonly status?: TranslatedStatus;
  readonly validityStart?: string | DateTime | null;
  readonly validityEnd?: string | DateTime | null;
  readonly versionComment?: string | null;
  readonly changed?: string | null;
  readonly changedBy?: string | null;
};

const active: RouteVersionRowValues = { status: 'Voimassa' };
const standard: RouteVersionRowValues = { status: 'Perusversio' };
const temporary: RouteVersionRowValues = { status: 'Väliaikainen' };
const draft: RouteVersionRowValues = { status: 'Luonnos' };

/**
 * Check that the column/Cypress jQuery element has the given value
 * @param column Route version row column
 * @param value Expected value
 */
function checkColumn(
  column: Chainable<JQuery>,
  value: string | DateTime | undefined | null,
) {
  if (value === null || value === '') {
    column.should('be.empty');
  } else if (value instanceof DateTime) {
    column.shouldHaveDate(value);
  } else if (typeof value === 'string') {
    column.shouldHaveText(value);
  }

  // Else undefined → Ignore / dont test
}

// Check all defined columns for expected values.
function checkRowColumns(version: Partial<RouteVersionRowValues>) {
  checkColumn(RouteVersionRow.status(), version.status);
  checkColumn(RouteVersionRow.validityStart(), version.validityStart);
  checkColumn(RouteVersionRow.validityEnd(), version.validityEnd);
  checkColumn(RouteVersionRow.versionComment(), version.versionComment);
  checkColumn(RouteVersionRow.changed(), version.changed);
  checkColumn(RouteVersionRow.changedBy(), version.changedBy);
}

// Get row by index and check it has the given version info.
function checkRow(
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<RouteVersionRowValues>>
) {
  const versionInfo = versionInfoFragments.reduce(
    (r, f) => ({ ...r, ...f }),
    {},
  );

  RouteVersionRow.rows().should('have.length.at.least', index + 1);
  RouteVersionRow.rows()
    .eq(index)
    .within(() => checkRowColumns(versionInfo));
}

function checkScheduledRow(
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<RouteVersionRowValues>>
) {
  RouteVersionPage.scheduledVersions().within(() =>
    checkRow(index, ...versionInfoFragments),
  );
}

function checkDraftRow(
  index: number,
  ...versionInfoFragments: ReadonlyArray<Partial<RouteVersionRowValues>>
) {
  RouteVersionPage.draftVersions().within(() =>
    checkRow(index, ...versionInfoFragments),
  );
}

function getTdsByTableColumn(
  column: RouteVersionTableColumn,
): Chainable<JQuery> {
  switch (column) {
    case 'STATUS':
      return RouteVersionRow.status();

    case 'VALIDITY_START':
      return RouteVersionRow.validityStart();

    case 'VALIDITY_END':
      return RouteVersionRow.validityEnd();

    case 'VERSION_COMMENT':
      return RouteVersionRow.versionComment();

    case 'CHANGED':
      return RouteVersionRow.changed();

    case 'CHANGED_BY':
      return RouteVersionRow.changedBy();

    default:
      throw new Error(`Unknown Table column: ${column}`);
  }
}

// Check whether the table is sorted on a column
function checkSortedOnColumn(
  column: RouteVersionTableColumn,
  expectedValues: ReadonlyArray<string | DateTime | null>,
) {
  const rows = RouteVersionRow.rows();

  rows.should('have.length', expectedValues.length);

  for (let i = 0; i < expectedValues.length; i += 1) {
    const expectedValue = expectedValues[i];
    RouteVersionRow.rows()
      .eq(i)
      .within(() => checkColumn(getTdsByTableColumn(column), expectedValue));
  }
}

function checkSortingWorksOnColumnInBothDirections(
  table: 'scheduled' | 'drafts',
  column: RouteVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  (table === 'scheduled'
    ? RouteVersionPage.scheduledVersions()
    : RouteVersionPage.draftVersions()
  ).within(() => {
    RouteVersionsTableHeader.setSorting(column, 'ascending');
    checkSortedOnColumn(column, expectedAscendingOrder);

    RouteVersionsTableHeader.setSorting(column, 'descending');
    checkSortedOnColumn(column, [...expectedAscendingOrder].reverse());
  });
}

function testScheduledVersionsSorting(
  column: RouteVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    'scheduled',
    column,
    expectedAscendingOrder,
  );
}

function testDraftVersionsSorting(
  column: RouteVersionTableColumn,
  expectedAscendingOrder: ReadonlyArray<string | DateTime | null>,
) {
  checkSortingWorksOnColumnInBothDirections(
    'drafts',
    column,
    expectedAscendingOrder,
  );
}

describe('Route Versions Page', { tags: [Tag.Routes] }, () => {
  before(() => {
    cy.task('resetDbs');
    insertToDbHelper({ lines: [testLine] });
  });

  describe('Full set of versions', () => {
    before(() => {
      insertToDbHelper({
        routes: [
          pastStandardVersion.input,
          currentStandardVersion.input,
          futureStandardVersion.input,
          todayTempVersion.input,
          nextMonthTempVersion.input,
          draftOneVersion.input,
          draftTwoVersion.input,
          draftThreeVersion.input,
        ],
      });
    });

    beforeEach(() => {
      cy.setupTests();
      cy.mockLogin();

      RouteVersionPage.visit('RV999', '1');
      RouteVersionPage.pageLoader().should('not.exist');
    });

    function validateDraftVersions() {
      checkDraftRow(0, draft, draftOneVersion.info);
      checkDraftRow(1, draft, draftTwoVersion.info);
      checkDraftRow(2, draft, draftThreeVersion.info);
    }

    it('should have route info', { tags: [Tag.Smoke] }, () => {
      RouteVersionPage.title().should('contain', 'RV999');
      RouteVersionPage.title().should('contain', 'Versiot');
    });

    it('should filter and list versions', () => {
      // Limit to today
      RouteVersionPage.startDate().inputDateValue(today);
      RouteVersionPage.endDate().inputDateValue(today);

      checkScheduledRow(0, standard, currentStandardVersion.info);
      checkScheduledRow(1, active, todayTempVersion.info);
      // Time filters should not affect drafts
      validateDraftVersions();

      // Show all
      RouteVersionPage.startDate().inputDateValue(lineValidityStart);
      RouteVersionPage.endDate().inputDateValue(lineValidityEnd);

      checkScheduledRow(0, standard, pastStandardVersion.info);
      checkScheduledRow(1, standard, currentStandardVersion.info);
      checkScheduledRow(2, active, todayTempVersion.info);
      checkScheduledRow(3, temporary, nextMonthTempVersion.info);
      checkScheduledRow(4, standard, futureStandardVersion.info);

      // Time filters should not affect drafts
      validateDraftVersions();
    });

    it('should sort versions', () => {
      // Show all
      RouteVersionPage.startDate().inputDateValue(lineValidityStart);
      RouteVersionPage.endDate().inputDateValue(lineValidityEnd);

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

      // Draft versions
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
    });
  });
});
