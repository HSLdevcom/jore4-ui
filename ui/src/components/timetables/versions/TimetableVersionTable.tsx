import { useTranslation } from 'react-i18next';
import { TimetablesVersionsRowData } from '../../../hooks';
import { TimetableVersionsTableHeader } from './TimetableVersionTableHeader';
import { TimetableVersionTableRow } from './TimetableVersionTableRow';

export const TimetableVersionTable = ({
  data,
  className,
}: {
  data: TimetablesVersionsRowData[];
  className: string;
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <table className={`${className} w-full`}>
      <TimetableVersionsTableHeader />
      <tbody>
        {data.length > 0 ? (
          data.map((row) => (
            <TimetableVersionTableRow
              key={row.vehicle_service_id + row.routeLabelAndVariant}
              data={row}
            />
          ))
        ) : (
          <span>{t('timetables.noTimetables')}</span>
        )}
      </tbody>
    </table>
  );
};
