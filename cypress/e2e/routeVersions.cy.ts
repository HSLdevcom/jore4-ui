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
  RouteVersionsTableHeader,
} from '../pageObjects/routes-and-lines';
import { insertToDbHelper } from '../utils';
import {
  active,
  checkDraftRow,
  checkScheduledRow,
  draft,
  standard,
  temporary,
  testDraftVersionsSorting,
  testScheduledVersionsSorting,
} from './utils/versionTestUtils';

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

const testLine = {
  ...buildLine({ label: 'RV999' }),
  line_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  validity_start: DateTime.fromISO('2016-01-01'),
  validity_end: null, // Always valid
};

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
    version_comment: comment,
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

      RouteVersionPage.visit('RV999', 'outbound');
      RouteVersionPage.pageLoader().should('not.exist');
    });

    function validateDraftVersions() {
      checkDraftRow(
        RouteVersionPage,
        RouteVersionRow,
        0,
        draft,
        draftOneVersion.info,
      );
      checkDraftRow(
        RouteVersionPage,
        RouteVersionRow,
        1,
        draft,
        draftTwoVersion.info,
      );
      checkDraftRow(
        RouteVersionPage,
        RouteVersionRow,
        2,
        draft,
        draftThreeVersion.info,
      );
    }

    it('should have route info', { tags: [Tag.Smoke] }, () => {
      RouteVersionPage.title().should('contain', 'RV999');
      RouteVersionPage.title().should('contain', 'Versiot');
    });

    it('should filter and list versions', () => {
      // Limit to today
      RouteVersionPage.startDate().inputDateValue(today);
      RouteVersionPage.endDate().inputDateValue(today);

      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        0,
        standard,
        currentStandardVersion.info,
      );
      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        1,
        active,
        todayTempVersion.info,
      );
      // Time filters should not affect drafts
      validateDraftVersions();

      // Show all
      RouteVersionPage.startDate().inputDateValue(lineValidityStart);
      RouteVersionPage.endDate().inputDateValue(lineValidityEnd);

      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        0,
        standard,
        pastStandardVersion.info,
      );
      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        1,
        standard,
        currentStandardVersion.info,
      );
      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        2,
        active,
        todayTempVersion.info,
      );
      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        3,
        temporary,
        nextMonthTempVersion.info,
      );
      checkScheduledRow(
        RouteVersionPage,
        RouteVersionRow,
        4,
        standard,
        futureStandardVersion.info,
      );

      // Time filters should not affect drafts
      validateDraftVersions();
    });

    it('should sort versions', () => {
      // Show all
      RouteVersionPage.startDate().inputDateValue(lineValidityStart);
      RouteVersionPage.endDate().inputDateValue(lineValidityEnd);

      // By default, should be sorted on validity Start
      testScheduledVersionsSorting(
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
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
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
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
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
        'VERSION_COMMENT',
        [
          currentStandardVersion.info.comment,
          futureStandardVersion.info.comment,
          pastStandardVersion.info.comment,
          todayTempVersion.info.comment,
          nextMonthTempVersion.info.comment,
        ],
      );

      // Draft versions
      testDraftVersionsSorting(
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
        'VALIDITY_START',
        [
          draftOneVersion.info.validityStart,
          draftTwoVersion.info.validityStart,
          draftThreeVersion.info.validityStart,
        ],
      );

      testDraftVersionsSorting(
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
        'VALIDITY_END',
        [
          draftOneVersion.info.validityEnd,
          draftTwoVersion.info.validityEnd,
          draftThreeVersion.info.validityEnd,
        ],
      );

      testDraftVersionsSorting(
        RouteVersionPage,
        RouteVersionRow,
        RouteVersionsTableHeader,
        'VERSION_COMMENT',
        [
          draftOneVersion.info.comment,
          draftTwoVersion.info.comment,
          draftThreeVersion.info.comment,
        ],
      );
    });
  });
});
