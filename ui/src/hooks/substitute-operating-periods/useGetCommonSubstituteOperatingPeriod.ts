import { DateTime } from 'luxon';
// eslint-disable-next-line import/no-cycle
import { SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '../../components/timetables';
import {
  GetSubstituteOperatingPeriodsQuery,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriodsQuery,
} from '../../generated/graphql';
import {
  buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods,
  buildIsPresetSubstituteOperatingPeriodFilter,
} from '../../utils';

/*
// NOT IN USE ?
const GQL_GET_SUBSTITUTE_OPERATING_PERIODS = gql`
  query GetSubstituteOperatingPeriods(
    $periodFilters: timetables_service_calendar_substitute_operating_period_bool_exp
  ) {
    timetables {
      timetables_service_calendar_substitute_operating_period(
        where: $periodFilters
      ) {
        period_name
        is_preset
        substitute_operating_period_id
        substitute_operating_day_by_line_types {
          begin_time
          end_time
          substitute_day_of_week
          substitute_operating_day_by_line_type_id
          superseded_date
          type_of_line
        }
      }
    }
  }
`; */

export type CommonSubstituteOperatingPeriodsData = {
  isLoadingCommonSubstituteOperatingPeriods: boolean;
  commonSubstituteOperatingPeriods: TimetablesServiceCalendarSubstituteOperatingPeriod[];
  refetchCommonSubstituteOperatingPeriods: () => void;
};

export const useGetCommonSubstituteOperatingPeriods = ({
  startDate: originalStartDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  let startDate = originalStartDate;

  if (startDate && endDate) {
    const timeDiff = endDate.diff(startDate);
    if (timeDiff.as('year') > SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS) {
      startDate = endDate.minus({
        year: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
      });
    }
  }
  const mapSubstituteOperatingPeriodsResult = (
    result?: GetSubstituteOperatingPeriodsQuery,
  ) => {
    return result?.timetables
      ?.timetables_service_calendar_substitute_operating_period as TimetablesServiceCalendarSubstituteOperatingPeriod[];
  };
  const periodDateRangeFilter = {
    ...buildActiveDateRangeGqlFilterForSubstituteOperatingPeriods(
      startDate,
      endDate,
    ),
  };

  const commonPeriodFilter = {
    ...periodDateRangeFilter,
    ...buildIsPresetSubstituteOperatingPeriodFilter(true),
  };

  const query = useGetSubstituteOperatingPeriodsQuery({
    variables: { periodFilters: commonPeriodFilter },
  });

  const getCommonSubstituteOperatingPeriodData =
    (): CommonSubstituteOperatingPeriodsData => {
      const commonSubstituteOperatingPeriods =
        mapSubstituteOperatingPeriodsResult(query.data);

      return {
        isLoadingCommonSubstituteOperatingPeriods: query.loading,
        refetchCommonSubstituteOperatingPeriods: query.refetch,
        commonSubstituteOperatingPeriods,
      };
    };

  return {
    getCommonSubstituteOperatingPeriodData,
  };
};
