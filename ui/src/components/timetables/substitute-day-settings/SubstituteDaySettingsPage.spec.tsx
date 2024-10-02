import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
import { useDateQueryParam, useTimeRangeQueryParams } from '@/hooks/urlQuery';
import { selectTimetable } from '@/redux';
import { SubstituteDaySettingsPage } from './SubstituteDaySettingsPage';

// Mock hooks
jest.mock('@/hooks/substitute-operating-periods');
jest.mock('@/hooks/urlQuery');
jest.mock('@/hooks/redux');
jest.mock('@/redux');

// Fixed date for testing
const fixedNow = DateTime.fromISO('2024-09-26T09:27:53.572+02:00');
const mockedEndDate = fixedNow;
const mockedStartDate = fixedNow.minus({ years: 150 });

// Mocked implementation for `useDateQueryParam`
const mockSetStartDate = jest.fn();
(useDateQueryParam as jest.Mock).mockImplementation(({ queryParamName }) => {
  if (queryParamName === 'startDate') {
    return { date: mockedStartDate, setDateToUrl: mockSetStartDate };
  }
  if (queryParamName === 'endDate') {
    return { date: mockedEndDate };
  }
  return {};
});

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
    renderComponent();

    const expectedNewStartDate = mockedEndDate.minus({
      years: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
    });

    // Check that `setStartDate` was called with the correct adjusted date
    await waitFor(() => {
      expect(mockSetStartDate).toHaveBeenCalledWith(expectedNewStartDate);
    });
  });

  it('should not adjust the start date if the time range is less than or equal to 100 years', async () => {
    // Adjust mocked start date to be within 100 years
    const withinRangeStartDate = mockedEndDate.minus({ years: 50 });

    (useDateQueryParam as jest.Mock).mockImplementation(
      ({ queryParamName }) => {
        if (queryParamName === 'startDate') {
          return { date: withinRangeStartDate, setDateToUrl: mockSetStartDate };
        }
        if (queryParamName === 'endDate') {
          return { date: mockedEndDate };
        }
        return {};
      },
    );

    renderComponent();

    // Ensure `setStartDate` was not called when within 100 years range
    await waitFor(() => {
      expect(mockSetStartDate.mock.calls.filter((arg: string) => -DateTime.fromISO(arg).diff(fixedNow).as('years') > 90)).toHaveLength(0);
    });
  });

  it('handles close button action correctly', () => {
    renderComponent();

    const closeButton = screen.getByTestId(
      'SubstituteDaySettingsPage::closeButton',
    );
    fireEvent.click(closeButton);

    expect(
      screen.findByTestId('SubstituteDaySettingsPage::closeButton'),
    ).toBeTruthy();
  });
});
