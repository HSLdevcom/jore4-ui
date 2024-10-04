import { renderHook } from '@testing-library/react';
import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '@/components/timetables';
import {
  ReusableComponentsVehicleSubmodeEnum,
  useGetSubstituteOperatingPeriodsQuery,
} from '@/generated/graphql';
import { useDateQueryParam, useUrlQuery } from '@/hooks/urlQuery';
import { useGetOccasionalSubstituteOperatingPeriods } from './useGetOccasionalSubstituteOperatingPeriod';

jest.mock('@/hooks/urlQuery/useUrlQuery');
jest.mock('@/hooks/urlQuery/useDateQueryParam');
jest.mock('react-router-dom');
jest.mock('@/generated/graphql');

const fixedNow = DateTime.fromISO('2024-09-26T09:27:53.572+02:00');

const mockedSubstituteOperatingPeriods = [
  {
    __typename: 'timetables_service_calendar_substitute_operating_period',
    period_name: 'Period 1',
    is_preset: false,
    substitute_operating_period_id: uuidv4(),
    substitute_operating_day_by_line_types: [
      {
        __typename:
          'timetables_service_calendar_substitute_operating_day_by_line_type',
        begin_time: Duration.fromObject({ hours: 9 }),
        end_time: Duration.fromObject({ hours: 17 }),
        substitute_day_of_week: 1,
        substitute_operating_day_by_line_type_id: uuidv4(),
        superseded_date: fixedNow,
        type_of_line: ReusableComponentsVehicleSubmodeEnum.GenericBus,
      },
    ],
  },
];

(useGetSubstituteOperatingPeriodsQuery as jest.Mock).mockReturnValue({
  data: {
    timetables: {
      __typename: 'timetables_timetables_query',
      timetables_service_calendar_substitute_operating_period:
        mockedSubstituteOperatingPeriods,
    },
  },
  loading: false,
  refetch: jest.fn(),
});

describe('useOccasionalGetSubstituteOperatingPeriods', () => {
  it('should replace start date if the time range exceeds 100 years', () => {
    const endDate = fixedNow;
    const originalStartDate = endDate.minus({ years: 150 });

    (useUrlQuery as jest.Mock).mockReturnValue({
      getDateTimeFromUrlQuery: jest.fn(() => {
        return originalStartDate;
      }),
    });
    (useDateQueryParam as jest.Mock).mockImplementation(
      ({ queryParamName }) => {
        const data =
          queryParamName === 'startDate'
            ? {
                date: originalStartDate,
              }
            : {
                date: fixedNow,
              };

        return data;
      },
    );

    const { result } = renderHook(() =>
      useGetOccasionalSubstituteOperatingPeriods(),
    );

    const { occasionalSubstituteOperatingPeriodData: data } = result.current;

    const expectedStartDate = endDate.minus({
      years: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
    });

    // Assert that the startDate is replaced with one that is 100 years before the endDate
    expect(data.occasionalSubstituteOperatingPeriods).toEqual(
      mockedSubstituteOperatingPeriods,
    );
    expect(useGetSubstituteOperatingPeriodsQuery).toHaveBeenCalledWith({
      variables: {
        periodFilters: {
          _and: [
            {
              substitute_operating_day_by_line_types: {
                superseded_date: { _gte: expectedStartDate },
              },
            },
            {
              substitute_operating_day_by_line_types: {
                superseded_date: { _lte: endDate },
              },
            },
          ],
          is_preset: { _eq: false },
        },
      },
    });
  });

  it('should not replace start date if the time range is less than or equal to 100 years', () => {
    const endDate = fixedNow;
    const originalStartDate = endDate.minus({ years: 90 });

    (useDateQueryParam as jest.Mock).mockImplementation(
      ({ queryParamName }) => {
        const data =
          queryParamName === 'startDate'
            ? {
                date: originalStartDate,
              }
            : {
                date: fixedNow,
              };

        return data;
      },
    );

    const { result } = renderHook(() =>
      useGetOccasionalSubstituteOperatingPeriods(),
    );

    const { occasionalSubstituteOperatingPeriodData: data } = result.current;

    // Assert that the start date is not modified
    expect(data.occasionalSubstituteOperatingPeriods).toEqual(
      mockedSubstituteOperatingPeriods,
    );
    expect(useGetSubstituteOperatingPeriodsQuery).toHaveBeenCalledWith({
      variables: {
        periodFilters: {
          _and: [
            {
              substitute_operating_day_by_line_types: {
                superseded_date: { _gte: originalStartDate },
              },
            },
            {
              substitute_operating_day_by_line_types: {
                superseded_date: { _lte: endDate },
              },
            },
          ],
          is_preset: { _eq: false },
        },
      },
    });
  });
});
