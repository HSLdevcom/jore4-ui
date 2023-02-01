import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useGetLineTimetableVersions, useUrlQuery } from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { TimetablePriority } from '../../../types/Priority';
import { CloseIconButton } from '../../../uiComponents';
import { FormColumn, FormRow } from '../../forms/common';
import { TimetableVersionTable } from './TimetableVersionTable';

export const LineTimetableVersionsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { label } = useParams<{ label: string }>();
  const { queryParams } = useUrlQuery();
  const history = useHistory();

  const { timetableVersionsTableData } = useGetLineTimetableVersions({ label });

  const onClose = () => {
    // If there is no returnTo set, we return to 'timetables' page
    const pathname = queryParams.returnTo
      ? routeDetails[Path.lineTimetables].getLink(
          queryParams.returnTo as string,
        )
      : routeDetails[Path.timetables].getLink();

    history.push({
      pathname,
    });
  };

  const timetablesExcludingDrafts = timetableVersionsTableData.filter(
    (item) => item.vehicle_schedule_frame.priority !== TimetablePriority.Draft,
  );
  const onlyDraftTimetables = timetableVersionsTableData.filter(
    (item) => item.vehicle_schedule_frame.priority === TimetablePriority.Draft,
  );

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
          />
        </FormColumn>
      </FormRow>
      <Container>
        <h3>{t('timetables.operatingCalendar')}</h3>
        <TimetableVersionTable
          className="mb-8"
          data={timetablesExcludingDrafts}
        />
        <h3>{t('timetables.drafts')}</h3>
        <TimetableVersionTable className="mb-8" data={onlyDraftTimetables} />
      </Container>
    </Container>
  );
};
