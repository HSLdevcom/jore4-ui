import orderBy from 'lodash/orderBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TimetableVersionRowData,
  useGetJourneyPatternIdsByLineLabel,
  useGetTimetableVersions,
  useRequiredParams,
  useTimeRangeQueryParams,
  useTimetableVersionsReturnToQueryParam,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { CloseIconButton } from '../../../uiComponents';
import { TimeRangeControl } from '../../common';
import { FormColumn, FormRow } from '../../forms/common';
import { TimetableVersionTable } from './TimetableVersionTable';

const testIds = {
  closeButton: 'TimetableVersionsPage::closeButton',
};

export const TimetableVersionsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { label } = useRequiredParams<{ label: string }>();
  const { startDate, endDate } = useTimeRangeQueryParams();

  // We first need to get the journey pattern ids for all line routes by line label
  const { journeyPatternIdsGroupedByRouteLabel, loading } =
    useGetJourneyPatternIdsByLineLabel({
      label,
      startDate,
      endDate,
    });
  // Then we can fetch the timetable versions using SQL functions
  const { versions } = useGetTimetableVersions({
    // We need to use memoized value which only changes when the loading status is changed. Otherwise we
    // end up in infinite loop
    journeyPatternIdsGroupedByRouteLabel: useMemo(
      () => journeyPatternIdsGroupedByRouteLabel,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [loading],
    ),
    startDate,
    endDate,
  });

  const timetablesExcludingDrafts =
    versions?.filter(
      (version) =>
        version.vehicleScheduleFrame?.priority !== TimetablePriority.Draft,
    ) || [];

  const onlyDraftTimetables =
    versions?.filter(
      (version) =>
        version.vehicleScheduleFrame?.priority === TimetablePriority.Draft,
    ) || [];
  const { onClose } = useTimetableVersionsReturnToQueryParam();

  const sortTimetables = (timetables: TimetableVersionRowData[]) => {
    return orderBy(
      timetables,
      [
        (version) => version.inEffect,
        (version) => version.routeLabelAndVariant,
        (version) => version.vehicleScheduleFrame.validityStart,
      ],
      ['desc', 'asc', 'asc'],
    );
  };

  return (
    <Container>
      <FormRow mdColumns={2}>
        <h2>{`${t('timetables.versionsTitle')} | ${t('lines.line', {
          label,
        })}`}</h2>
        <FormColumn className="items-end">
          <CloseIconButton
            label={t('close')}
            className="text-base font-bold text-brand"
            onClick={onClose}
            testId={testIds.closeButton}
          />
        </FormColumn>
      </FormRow>
      <Container>
        <h3>{t('timetables.timeline')}</h3>
        <TimeRangeControl className="mb-8" />
        <h3>{t('timetables.operatingCalendar')}</h3>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={sortTimetables(timetablesExcludingDrafts)}
        />
        <h3>{t('timetables.drafts')}</h3>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={onlyDraftTimetables}
        />
      </Container>
    </Container>
  );
};
