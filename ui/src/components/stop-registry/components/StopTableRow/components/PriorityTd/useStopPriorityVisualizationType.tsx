import { gql, skipToken } from '@apollo/client';
import { DateTime } from 'luxon';
import { useDoesStopHaveNextValidAlternativeSuspenseQuery } from '../../../../../../generated/graphql';
import { mapToISODate } from '../../../../../../time';
import { Priority } from '../../../../../../types/enums';
import { StopSearchRow } from '../../types';
import { PriorityVisualizationType } from './PriorityVisualizationType';

const ABOUT_TO_END_THRESHOLD = 20;

const GQL_DOES_STOP_HAVE_NEXT_VALID_ALTERNATIVE = gql`
  query DoesStopHaveNextValidAlternative(
    $publicCode: String!
    $validAfter: String!
    $validPriorities: [String!]!
  ) {
    stops_database {
      quays: stops_database_quay_newest_version_aggregate(
        where: {
          _and: [
            { public_code: { _eq: $publicCode } }
            { priority: { _in: $validPriorities } }
            {
              _or: [
                { validity_end: { _is_null: true } }
                { validity_end: { _gt: $validAfter } }
              ]
            }
          ]
        }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

const validPriorities = [Priority.Standard, Priority.Temporary].map(String);

export function useStopPriorityVisualizationType({
  publicCode,
  priority,
  validityEnd,
}: StopSearchRow): PriorityVisualizationType {
  const isDraft = priority === Priority.Draft;
  const isEnding =
    !validityEnd ||
    validityEnd.diff(DateTime.now().startOf('day'), 'days').get('days') <
      ABOUT_TO_END_THRESHOLD;

  const { data } = useDoesStopHaveNextValidAlternativeSuspenseQuery(
    isDraft || isEnding
      ? {
          variables: {
            publicCode,
            validAfter: mapToISODate(validityEnd ?? DateTime.now()),
            validPriorities,
          },
        }
      : skipToken,
  );

  // Data comes from a suspense query. The count always exists when we get here.
  // Typings are just imperfect.
  if (!isDraft && isEnding && !data?.stops_database?.quays?.aggregate?.count) {
    return PriorityVisualizationType.ABOUT_TO_END;
  }

  switch (priority) {
    case Priority.Standard:
      return PriorityVisualizationType.STANDARD;

    case Priority.Draft:
      return PriorityVisualizationType.DRAFT;

    case Priority.Temporary:
      return PriorityVisualizationType.TEMPORARY;

    default:
      return PriorityVisualizationType.UNKNOWN;
  }
}
