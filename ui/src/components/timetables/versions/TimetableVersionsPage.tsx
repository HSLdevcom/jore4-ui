import orderBy from 'lodash/orderBy';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useAppSelector,
  useRequiredParams,
  useTimeRangeQueryParams,
} from '../../../hooks';
import {
  closeChangeTimetableValidityModalAction,
  selectChangeTimetableValidityModal,
} from '../../../redux';
import { TimetablePriority } from '../../../types/enums';
import { CloseIconButton } from '../../common/Buttons';
import { PageTitle } from '../../common/Jore';
import { Container, FormColumn, FormRow } from '../../common/LayoutComponents';
import { ChangeTimetablesValidityModal } from '../common/ChangeTimetablesValidityModal';
import { DeleteTimetableModal } from './DeleteTimetableModal';
import {
  TimetableVersionRowData,
  useGetJourneyPatternIdsByLineLabel,
  useGetTimetableVersions,
  useTimetableVersionsReturnToQueryParam,
} from './hooks';
import { TimeRangeControl } from './TimeRangeControl';
import { TimetableVersionDetailsPanel } from './timetable-version-details-panel';
import { TimetableVersionTable } from './TimetableVersionTable';

const testIds = {
  closeButton: 'TimetableVersionsPage::closeButton',
};

function sortTimetables(timetables: ReadonlyArray<TimetableVersionRowData>) {
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
}

export const TimetableVersionsPage: FC = () => {
  const { t } = useTranslation();

  const { label } = useRequiredParams<{ label: string }>();
  const { startDate, endDate } = useTimeRangeQueryParams();
  const { onClose } = useTimetableVersionsReturnToQueryParam();

  const dispatch = useAppDispatch();

  const onCloseTimetableValidityModal = () => {
    dispatch(closeChangeTimetableValidityModalAction());
  };
  const changeTimetableValidityModalState = useAppSelector(
    selectChangeTimetableValidityModal,
  );

  // We first need to get the journey pattern ids for all line routes by line label
  const { journeyPatternIdsGroupedByRouteLabel } =
    useGetJourneyPatternIdsByLineLabel({
      label,
      startDate,
      endDate,
    });

  // Then we can fetch the timetable versions using SQL functions
  const { versions, refetch } = useGetTimetableVersions(
    useMemo(
      () => ({
        journeyPatternIdsGroupedByRouteLabel,
        startDate,
        endDate,
      }),
      [journeyPatternIdsGroupedByRouteLabel, startDate, endDate],
    ),
  );

  const timetablesExcludingDrafts = useMemo(
    () =>
      sortTimetables(
        versions.filter(
          (version) =>
            version.vehicleScheduleFrame?.priority !== TimetablePriority.Draft,
        ),
      ),
    [versions],
  );

  const onlyDraftTimetables = useMemo(
    () =>
      versions.filter(
        (version) =>
          version.vehicleScheduleFrame?.priority === TimetablePriority.Draft,
      ),

    [versions],
  );

  return (
    <Container>
      <FormRow mdColumns={2}>
        <PageTitle.H1>
          {`${t(($) => $.timetables.versionsTitle)} | ${t(($) => $.lines.line, {
            label,
          })}`}
        </PageTitle.H1>
        <FormColumn className="items-end">
          <CloseIconButton
            label={t(($) => $.close)}
            className="text-base font-bold text-brand"
            onClick={onClose}
            testId={testIds.closeButton}
          />
        </FormColumn>
      </FormRow>
      <Container>
        <h2 className="text-xl">{t(($) => $.timetables.timeline)}</h2>
        <TimeRangeControl className="mb-8" />
        <h2 className="text-xl">{t(($) => $.timetables.operatingCalendar)}</h2>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={timetablesExcludingDrafts}
        />
        <h2 className="text-xl">{t(($) => $.timetables.drafts)}</h2>
        <TimetableVersionTable
          className="mb-8 w-full"
          data={onlyDraftTimetables}
        />
      </Container>
      <DeleteTimetableModal fetchTimetableVersions={refetch} />
      <TimetableVersionDetailsPanel />
      <ChangeTimetablesValidityModal
        isOpen={changeTimetableValidityModalState.isOpen}
        onClose={onCloseTimetableValidityModal}
        onChange={refetch}
      />
    </Container>
  );
};
