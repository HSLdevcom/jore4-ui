import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useDoesStopHaveNextValidAlternativeSuspenseQuery } from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import { StopSearchRow } from '../../types';
import { PriorityVisualizationType } from './PriorityVisualizationType';

const ABOUT_TO_END_THRESHOLD = 20;

const GQL_DOES_STOP_HAVE_NEXT_VALID_ALTERNATIVE = gql`
  query DoesStopHaveNextValidAlternative(
    $label: String!
    $validAfter: date
    $validPriorities: [Int!]!
  ) {
    stopPoint: service_pattern_scheduled_stop_point_aggregate(
      where: {
        _and: [
          { label: { _eq: $label } }
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
`;

export function useStopPriorityVisualizationType({
  label,
  priority,
  validity_end: validityEnd,
}: StopSearchRow): PriorityVisualizationType {
  const isDraft = priority === Priority.Draft;
  const isEnding =
    !validityEnd ||
    validityEnd.diff(DateTime.now().startOf('day'), 'days').get('days') <
      ABOUT_TO_END_THRESHOLD;

  const { data } = useDoesStopHaveNextValidAlternativeSuspenseQuery({
    variables: {
      label,
      validAfter: validityEnd ?? DateTime.now().startOf('day'),
      validPriorities: [Priority.Standard, Priority.Temporary],
    },
    // Currently the GrahpQL generator does not generate hooks compatible with
    // the new skipToken API.
    skip: !isDraft && !isEnding,
  });

  // Data comes from a suspense query. The count always exists when we get here.
  // Typings are just imperfect.
  if (!isDraft && isEnding && !data.stopPoint.aggregate?.count) {
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
