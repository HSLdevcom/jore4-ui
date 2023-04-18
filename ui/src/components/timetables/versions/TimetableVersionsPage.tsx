import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  TimetableVersionRowData,
  useGetJourneyPatternIdsByLineLabel,
  useGetTimetableVersions,
  useTimetableVersionsReturnToQueryParam,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { CloseIconButton } from '../../../uiComponents';
import { FormColumn, FormRow } from '../../forms/common';
import { TimetableVersionTable } from './TimetableVersionTable';

const testIds = {
  closeButton: 'TimetableVersionsPage::closeButton',
};

export const TimetableVersionsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { label } = useParams<{ label: string }>();

  // We first need to get the journey pattern ids for all line routes by line label
  const { journeyPatternIdsGroupedByRouteLabel, loading } =
    useGetJourneyPatternIdsByLineLabel({
      // TODO: Add timerange filter here also
      label,
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
    // TODO: Add timerange components and remove hardcoded values
    startDate: useMemo(() => DateTime.fromISO('2020-01-01'), []),
    endDate: useMemo(() => DateTime.fromISO('2023-12-31'), []),
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

  const sortByInEffect = (
    a: TimetableVersionRowData,
    b: TimetableVersionRowData,
  ) => (b.inEffect ? 1 : 0) - (a.inEffect ? 1 : 0);

  const sortByValidityStart = (
    a: TimetableVersionRowData,
    b: TimetableVersionRowData,
  ) =>
    // vehicleScheduleFrame always has validityStart
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    +b.vehicleScheduleFrame.validityStart! -
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    +a.vehicleScheduleFrame.validityStart!;

  const sortByLabelAndVariant = (
    a: TimetableVersionRowData,
    b: TimetableVersionRowData,
  ) => {
    if (a.routeLabelAndVariant > b.routeLabelAndVariant) {
      return 1;
    }
    if (a.routeLabelAndVariant < b.routeLabelAndVariant) {
      return -1;
    }
    return 0;
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
        <h3>{t('timetables.operatingCalendar')}</h3>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={timetablesExcludingDrafts
            .sort(sortByValidityStart)
            .sort(sortByLabelAndVariant)
            .sort(sortByInEffect)}
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
