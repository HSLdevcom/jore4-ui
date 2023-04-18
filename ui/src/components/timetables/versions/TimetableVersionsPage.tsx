import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
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
  const { journeyPatternIdsGroupedByRouteLabel } =
    useGetJourneyPatternIdsByLineLabel({
      label,
    });
  // Then we can fetch the timetable versions using SQL functions
  const { versions } = useGetTimetableVersions({
    journeyPatternIdsGroupedByRouteLabel,
    beginDate: useMemo(() => DateTime.fromISO('2020-01-01'), []), // TODO: Add timerange components and
    endDate: useMemo(() => DateTime.fromISO('2023-12-31'), []), // remove hardcoded values
  });

  const timetablesExcludingDrafts =
    versions?.filter(
      (version) =>
        version.vehicleScheduleFrame.priority !== TimetablePriority.Draft,
    ) || [];

  const onlyDraftTimetables =
    versions?.filter(
      (version) =>
        version.vehicleScheduleFrame.priority === TimetablePriority.Draft,
    ) || [];
  const { onClose } = useTimetableVersionsReturnToQueryParam();

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
          data={timetablesExcludingDrafts}
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
