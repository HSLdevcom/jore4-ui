import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';
import { useGetTimetableVersionsByLineLabelQuery } from '../../generated/graphql';
import { isDateInRange } from '../../time';
import { TimetablePriority } from '../../types/Priority';
import { buildRouteLineLabelGqlFilter, mapToVariables } from '../../utils';
import { getRouteLabelVariantText } from '../../utils/route';

export interface TimetablesVersionsRowData {
  routeLabelAndVariant: string;
  vehicle_service_id: UUID;
  day_type: {
    day_type_id: UUID;
    label: string;
    name_i18n: LocalizedString;
  };
  vehicle_schedule_frame: {
    name_i18n: LocalizedString;
    priority: TimetablePriority;
    validity_start?: DateTime | null;
    validity_end?: DateTime | null;
  };
  inEffect?: boolean;
}

const GQL_GET_TIMETABLE_VERSIONS_BY_LINE_LABEL = gql`
  query GetTimetableVersionsByLineLabel($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      route_id
      label
      variant
      route_journey_patterns {
        journey_pattern_id
        journey_pattern_refs {
          journey_pattern_ref_id
          vehicle_journeys {
            vehicle_journey_id
            block {
              block_id
              vehicle_service {
                vehicle_service_id
                vehicle_schedule_frame {
                  vehicle_schedule_frame_id
                  priority
                  validity_start
                  validity_end
                  priority
                  name_i18n
                }
                day_type {
                  day_type_id
                  label
                  name_i18n
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Check which vehicle services are currently in effect (highest priority
 * vehicle service that is valid 'today') and change it's inEffect value to true
 */
const enrichDataWithInEffectAttribute = (
  timetables: TimetablesVersionsRowData[],
) => {
  // TODO: This logic will be changed a bit since this will be an SQL function
  // also it needs to compare the upcoming reference days as well.
  const inEffectTimetables = timetables.filter(
    (timetable) =>
      timetable.vehicle_schedule_frame.priority !== TimetablePriority.Draft &&
      isDateInRange(
        DateTime.now(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        timetable.vehicle_schedule_frame.validity_start!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        timetable.vehicle_schedule_frame.validity_end!,
      ),
  );

  // Group the currently valid timetables and group them by route label(+variant) and daytype
  const grouped = groupBy(
    inEffectTimetables,
    (timetable) =>
      `${timetable.routeLabelAndVariant}${timetable.day_type.day_type_id}`,
  );

  // Pick only those timetables that are on highest priority per route&daytype combination
  const highestPriorities = Object.values(grouped).map((timetableGroup) => {
    return maxBy(timetableGroup, 'vehicle_schedule_frame.priority')
      ?.vehicle_service_id;
  });

  // Enrich the data with setting inEffect = true to the ones that were on highest priority
  return timetables.map((timetable) => {
    if (highestPriorities.includes(timetable.vehicle_service_id)) {
      return { ...timetable, inEffect: true };
    }
    return timetable;
  });
};

export const useGetLineTimetableVersions = ({ label }: { label: string }) => {
  const routeFilters = {
    ...buildRouteLineLabelGqlFilter(label),
  };
  const routeTimetableVersionsData = useGetTimetableVersionsByLineLabelQuery(
    mapToVariables({ routeFilters }),
  );

  const groupedDataByLabelAndVariant = groupBy(
    routeTimetableVersionsData.data?.route_route,
    (route) => getRouteLabelVariantText(route),
  );

  const distinctMappedVersionsData = Object.entries(
    groupedDataByLabelAndVariant,
  ).map(([key, value]) => ({
    routeLabelAndVariant: key,
    vehicleServices: uniqBy(
      value
        .flatMap((route) => route.route_journey_patterns)
        .flatMap((journeyPattern) => journeyPattern.journey_pattern_refs)
        .flatMap((journeyPatternRef) => journeyPatternRef.vehicle_journeys)
        .flatMap((vehicleJourney) => vehicleJourney.block)
        .flatMap((block) => block.vehicle_service),
      (vehicleService) => vehicleService,
    ),
  }));

  const timetableVersionsTableData: TimetablesVersionsRowData[] = [];

  distinctMappedVersionsData.forEach((route) => {
    route.vehicleServices.forEach((foo) => {
      timetableVersionsTableData.push({
        routeLabelAndVariant: route.routeLabelAndVariant,
        ...foo,
      });
    });
  });

  return {
    timetableVersionsTableData: enrichDataWithInEffectAttribute(
      timetableVersionsTableData,
    ),
  };
};
