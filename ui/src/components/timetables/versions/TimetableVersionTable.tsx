import { useTranslation } from 'react-i18next';
import { TimetablesVersionsRowData as TimetableVersionsRowData } from '../../../hooks';
import { TimetableVersionsTableHeader } from './TimetableVersionTableHeader';
import { TimetableVersionTableRow } from './TimetableVersionTableRow';

interface Props {
  data: TimetableVersionsRowData[];
  className: string;
}

export const TimetableVersionTable = ({
  data,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <table className={`${className}`}>
      <TimetableVersionsTableHeader />
      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <TimetableVersionTableRow
              key={row.id + row.routeLabelAndVariant}
              data={row}
            />
          ))
        ) : (
          <tr>
            <td>{t('timetables.noTimetables')}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
