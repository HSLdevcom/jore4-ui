import type { SharedConfig } from '@typescript-eslint/utils/ts-eslint';
import { RestrictedSyntax, restrictedSyntax } from './style';

// Guardrails for the Luxon -> Temporal migration of the ui project.

const LODASH_ORDERING_FN = '/^(orderBy|sortBy|minBy|maxBy)$/';

// Property paths (e.g. 'validity_start', 'vehicleScheduleFrame.validityStart',
// 'supersededDate', 'start_time', 'created_at', 'changed') that hold dates,
// times or durations.
const DATE_FIELD =
  '/^([\\w.]*\\.)?(\\w*[Vv]alidity\\w*|\\w*(Date|_date|Time|_time|Timestamp|_timestamp|_at)|changed|created|removed)$/';

const temporalSyntax: ReadonlyArray<RestrictedSyntax> = [
  {
    selector:
      "CallExpression[arguments.length=0] > MemberExpression.callee[object.type='MemberExpression'][object.object.name='Temporal'][object.property.name='Now'][property.name=/ISO$|^timeZoneId$/]",
    message:
      "This reads the system time zone, which differs from Europe/Helsinki e.g. when working abroad. Use today()/now() from time.ts, or pass 'Europe/Helsinki' explicitly.",
  },
  {
    selector:
      "MemberExpression[object.name='Temporal'][property.name='PlainDateTime'], TSQualifiedName[left.name='Temporal'][right.name='PlainDateTime'], CallExpression > MemberExpression.callee[property.name='toPlainDateTime']",
    message:
      'Temporal.PlainDateTime has no time zone, so do not use it for domain values. Use PlainDate for dates and ZonedDateTime (Europe/Helsinki) for points in time.',
  },
  {
    selector: `CallExpression[callee.name=${LODASH_ORDERING_FN}] > Literal.arguments[value=${DATE_FIELD}], CallExpression[callee.name=${LODASH_ORDERING_FN}] > ArrayExpression.arguments > Literal[value=${DATE_FIELD}]`,
    message:
      'Ordering dates/times/durations by a property path compares them with valueOf(), which throws for Temporal objects. Use an explicit comparator (compareDates, compareDateTimes, …) or a numeric key (e.g. durationToSeconds) instead.',
  },
];

const dateSyntax: ReadonlyArray<RestrictedSyntax> = [
  {
    selector:
      "NewExpression[callee.name='Date'], CallExpression[callee.name='Date'], MemberExpression[object.name='Date'][property.name=/^(now|parse)$/]",
    message:
      'Date depends on the system time zone. Use Temporal values through the time.ts helpers (today(), now(), …) instead.',
  },
];

const useAreEqualMessage =
  'Use areEqual from utils instead. lodash isEqual considers any two Temporal objects equal.';

// Date is allowed for measuring UI timings that are not domain values.
export const uiRestrictedSyntaxAllowingDate: SharedConfig.RuleEntry = [
  'error',
  ...restrictedSyntax,
  ...temporalSyntax,
];

export const rules: SharedConfig.RulesRecord = {
  'no-restricted-syntax': [...uiRestrictedSyntaxAllowingDate, ...dateSyntax],

  'no-restricted-imports': [
    'error',
    {
      paths: [
        { name: 'lodash/isEqual', message: useAreEqualMessage },
        { name: 'lodash/fp/isEqual', message: useAreEqualMessage },
        {
          name: 'lodash',
          importNames: ['isEqual'],
          message: useAreEqualMessage,
        },
        {
          name: 'lodash/fp',
          importNames: ['isEqual'],
          message: useAreEqualMessage,
        },
      ],
    },
  ],
};
