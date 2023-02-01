import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  useGetLineTimetableVersions,
  useTimetableVersionsOnClose,
} from '../../../hooks';
import { Container } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { FormColumn, FormRow } from '../../forms/common';
import { TimetableVersionTable } from './TimetableVersionTable';

export const LineTimetableVersionsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { label } = useParams<{ label: string }>();

  const { timetablesExcludingDrafts, onlyDraftTimetables } =
    useGetLineTimetableVersions({ label });
  const { onClose } = useTimetableVersionsOnClose();

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
