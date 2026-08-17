import { DateTime } from 'luxon';

/** Builds an object for gql to filter out all
 * results which are not active on the given date
 */
export function buildActiveDateGqlFilter(date?: DateTime | null) {
  return {
    _and: [
      {
        _or: [
          { validity_start: { _lte: date } },
          { validity_start: { _is_null: true } },
        ],
      },
      {
        _or: [
          { validity_end: { _gte: date } },
          { validity_end: { _is_null: true } },
        ],
      },
    ],
  };
}
