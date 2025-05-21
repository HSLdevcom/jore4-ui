import orderBy from 'lodash/orderBy';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TimetableVersionRowData,
  useAppDispatch,
  useAppSelector,
  useGetJourneyPatternIdsByLineLabel,
  useGetTimetableVersions,
  useRequiredParams,
  useTimeRangeQueryParams,
  useTimetableVersionsReturnToQueryParam,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import {
  closeChangeTimetableValidityModalAction,
  selectChangeTimetableValidityModal,
} from '../../../redux';
import { TimetablePriority } from '../../../types/enums';
import { CloseIconButton } from '../../../uiComponents';
import { PageTitle, TimeRangeControl } from '../../common';
import { FormColumn, FormRow } from '../../forms/common';
import { ChangeTimetablesValidityModal } from '../common/ChangeTimetablesValidityModal';
import { DeleteTimetableModal } from './DeleteTimetableModal';
import { TimetableVersionDetailsPanel } from './timetable-version-details-panel/TimetableVersionDetailsPanel';
import { TimetableVersionTable } from './TimetableVersionTable';

const testIds = {
  closeButton: 'TimetableVersionsPage::closeButton',
};

export const TimetableVersionsPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const { label } = useRequiredParams<{ label: string }>();
  const { startDate, endDate } = useTimeRangeQueryParams();
  const dispatch = useAppDispatch();

  const onCloseTimetableValidityModal = () => {
    dispatch(closeChangeTimetableValidityModalAction());
  };
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );

  // We first need to get the journey pattern ids for all line routes by line label
  const { journeyPatternIdsGroupedByRouteLabel, loading } =
    useGetJourneyPatternIdsByLineLabel({
      label,
      startDate,
      endDate,
    });
  // Then we can fetch the timetable versions using SQL functions
  const { versions, fetchTimetableVersions } = useGetTimetableVersions({
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
    ) ?? [];

  const onlyDraftTimetables =
    versions?.filter(
      (version) =>
        version.vehicleScheduleFrame?.priority === TimetablePriority.Draft,
    ) ?? [];
  const { onClose } = useTimetableVersionsReturnToQueryParam();

  const sortTimetables = (
    timetables: ReadonlyArray<TimetableVersionRowData>,
  ) => {
    return orderBy(
      timetables,
      [
        (version) => version.inEffect,
        (version) => version.routeLabelAndVariant,
        (version) => version.vehicleScheduleFrame.validityStart,
        (version) => version.dayType.label,
      ],
      ['desc', 'asc', 'asc', 'asc'],
    );
  };

  // If the validity of a vehicleScheduleFrame is changed, we need to
  // re-fetch the timetableVersion to update the view
  const onChangeValidity = () => {
    fetchTimetableVersions();
  };

  return (
    <Container>
      <FormRow mdColumns={2}>
        <PageTitle.H1>
          {`${t('timetables.versionsTitle')} | ${t('lines.line', { label })}`}
        </PageTitle.H1>
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
        <h2 className="text-xl">{t('timetables.timeline')}</h2>
        <TimeRangeControl className="mb-8" />
        <h2 className="text-xl">{t('timetables.operatingCalendar')}</h2>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={sortTimetables(timetablesExcludingDrafts)}
        />
        <h2 className="text-xl">{t('timetables.drafts')}</h2>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={onlyDraftTimetables}
        />
      </Container>
      <DeleteTimetableModal fetchTimetableVersions={fetchTimetableVersions} />
      <TimetableVersionDetailsPanel />
      <ChangeTimetablesValidityModal
        isOpen={changeTimetableValidityModalState.isOpen}
        onClose={onCloseTimetableValidityModal}
        onChange={onChangeValidity}
      />
    </Container>
  );
};
