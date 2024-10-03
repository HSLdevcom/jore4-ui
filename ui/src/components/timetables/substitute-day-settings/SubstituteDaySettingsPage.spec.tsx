import { render, waitFor } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '@/components/timetables';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetCommonSubstituteOperatingPeriods,
  useGetOccasionalSubstituteOperatingPeriods,
} from '@/hooks/substitute-operating-periods';
import {
  useDateQueryParam,
  useTimeRangeQueryParams,
  useUrlQuery,
} from '@/hooks/urlQuery';
import { selectTimetable } from '@/redux/selectors';
import { SubstituteDaySettingsPage } from './SubstituteDaySettingsPage';

// Mock hooks
jest.mock('@/hooks/substitute-operating-periods');
jest.mock('@/hooks/urlQuery');
jest.mock('@/hooks/redux');
jest.mock('@/redux/selectors');

// Fixed date for testing
const fixedNow = DateTime.fromISO('2024-09-26T09:27:53.572+02:00');
const defaultMockedEndDate = fixedNow;

// Mocked implementation for `useDateQueryParam`
const mockSetStartDate = jest.fn();

function mockDateHooks(mockedStartDate: DateTime, mockedEndDate: DateTime) {
  (useDateQueryParam as jest.Mock).mockImplementation(({ queryParamName }) => {
    if (queryParamName === 'startDate') {
      return { date: mockedStartDate, setDateToUrl: mockSetStartDate };
    }
    if (queryParamName === 'endDate') {
      return { date: mockedEndDate };
    }
    return {};
  });

  (useUrlQuery as jest.Mock).mockImplementation(() => {
    return {
      getDateTimeFromUrlQuery: jest.fn((queryParamName: string) => {
        if (queryParamName === 'startDate') {
          return mockedStartDate;
        }
        if (queryParamName === 'endDate') {
          return mockedEndDate;
        }
        return undefined;
      }),
    };
  });
}

(useTimeRangeQueryParams as jest.Mock).mockImplementation(() => ({
  isInvalidDateRange: jest.fn(),
}));

(useCreateSubstituteOperatingPeriod as jest.Mock).mockImplementation(() => ({
  prepareAndExecute: jest.fn(),
}));

(useEditSubstituteOperatingPeriod as jest.Mock).mockImplementation(() => ({
  prepareAndExecute: jest.fn(),
}));

(useDeleteSubstituteOperatingPeriod as jest.Mock).mockImplementation(() => ({
  deleteSubstituteOperatingPeriod: jest.fn(),
}));

(useAppDispatch as jest.Mock).mockReturnValue(jest.fn());

// Mocked data for `useAppSelector`
// eslint-disable-next-line consistent-return
(useAppSelector as jest.Mock).mockImplementation((selector) => {
  if (selector === selectTimetable) {
    return {
      settings: {
        isOccasionalSubstitutePeriodFormDirty: false,
        isCommonSubstitutePeriodFormDirty: false,
        isInvalidRange: false,
      },
    };
  }
});

// Mocked data for the substitute operating periods hooks
(useGetOccasionalSubstituteOperatingPeriods as jest.Mock).mockReturnValue({
  getOccasionalSubstituteOperatingPeriodData: jest.fn().mockReturnValue({}),
});

(useGetCommonSubstituteOperatingPeriods as jest.Mock).mockReturnValue({
  getCommonSubstituteOperatingPeriodData: jest.fn().mockReturnValue({}),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SubstituteDaySettingsPage', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        {' '}
        {/* Wrap the component with MemoryRouter */}
        <SubstituteDaySettingsPage />
      </MemoryRouter>,
    );

  it('should adjust the start date if the time range exceeds 100 years', async () => {
    const expectedNewStartDate = defaultMockedEndDate.minus({
      years: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
    });
    mockDateHooks(expectedNewStartDate, defaultMockedEndDate);
    renderComponent();

    // Check that `setStartDate` was called with the correct adjusted date
    await waitFor(() => {
      expect(mockSetStartDate).toHaveBeenCalledWith(expectedNewStartDate);
    });

    // Ensure total count
    await waitFor(() => {
      expect(mockSetStartDate.mock.calls).toHaveLength(1);
    });
  });

  it('should not adjust the start date if the time range is less than or equal to 100 years', async () => {
    // Adjust mocked start date to be within 100 years
    const withinRangeStartDate = defaultMockedEndDate.minus({ years: 50 });

    mockDateHooks(withinRangeStartDate, defaultMockedEndDate);

    renderComponent();

    // Ensure `setStartDate` was not called when within 100 years range
    await waitFor(() => {
      expect(
        mockSetStartDate.mock.calls.filter(
          (arg: string) =>
            -DateTime.fromISO(arg).diff(fixedNow).as('years') > 90,
        ),
      ).toHaveLength(0);
    });

    // Ensure total count
    await waitFor(() => {
      expect(mockSetStartDate.mock.calls).toHaveLength(1);
    });
  });
});
