import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import uniqWith from 'lodash/uniqWith';
import { useCallback, useEffect, useState } from 'react';
import { useGetRouteInfoForTimetableVersionsAsyncQuery } from '../generated/graphql';
import {
  buildRouteLineLabelGqlFilter,
  getRouteLabelVariantText,
} from '../utils';

const GQL_GET_ROUTE_INFO_FOR_TIMETABLE_VERSIONS = gql`
  query GetRouteInfoForTimetableVersions($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      route_id
      label
      variant
      validity_start
      validity_end
      route_journey_patterns {
        journey_pattern_id
      }
    }
  }
`;

/**
 * Fetches all distinct journey patterns by line label for timetable versions.
 * Returns object which has route label&text as key and distinct journey pattern ids as value
 */
export const useGetJourneyPatternIdsByLineLabel = ({
  label,
}: {
  label: string;
}) => {
  const [journeyPatterns, setJourneyPatterns] = useState<{
    [key: string]: UUID[];
  }>({});
  const [getJourneyPatterns] = useGetRouteInfoForTimetableVersionsAsyncQuery();

  const fetchJourneyPatterns = useCallback(async () => {
    const routeFilters = {
      ...buildRouteLineLabelGqlFilter(label),
    };
    const result = await getJourneyPatterns({ routeFilters });
    const distinctResult = uniqWith(
      result.data?.route_route,
      (curr, next) =>
        curr.label === next.label &&
        curr.variant === next.variant &&
        curr.validity_start?.toISODate() === next.validity_start?.toISODate() &&
        curr.validity_end?.toISODate() === next.validity_end?.toISODate(),
    );

    const groupedDataByLabelAndVariant = groupBy(distinctResult, (route) =>
      getRouteLabelVariantText(route),
    );

    const journeyPatternIdsByRouteLabel = Object.entries(
      groupedDataByLabelAndVariant,
    ).reduce((object, curr) => {
      const [key, value] = curr;
      return {
        ...object,
        [key]: uniqBy(
          value
            .flatMap((route) => route.route_journey_patterns)
            .map((journeyPattern) => journeyPattern.journey_pattern_id),
          (item) => item,
        ),
      };
    }, {});
    setJourneyPatterns(journeyPatternIdsByRouteLabel);
  }, [getJourneyPatterns, label]);

  useEffect(() => {
    fetchJourneyPatterns();
  }, [fetchJourneyPatterns]);

  return {
    journeyPatternIdsGroupedByRouteLabel: journeyPatterns,
  };
};
