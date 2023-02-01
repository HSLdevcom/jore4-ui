import { useTranslation } from 'react-i18next';
import { TimetablesVersionsRowData as TimetableVersionsRowData } from '../../../hooks';
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

  // NOTE: These widths are given to prevent width jumping depending on data
  // It will also keep the headings in line when there are multiple tables
  // on same page. This is not by any means optimal solution, so feel free to
  // change if a better solution comes up.
  return (
    <table className={`${className}`}>
      <thead className="text-center [&>th]:p-4">
        <tr>
          <th className="w-[10%]">
            {t('timetableVersionsTableHeaders.status')}
          </th>
          <th className="w-[15%]">
            {t('timetableVersionsTableHeaders.dayType')}
          </th>
          <th className="w-[10%]">
            {t('timetableVersionsTableHeaders.validityStart')}
          </th>
          <th className="w-[10%]">
            {t('timetableVersionsTableHeaders.validityEnd')}
          </th>
          <th className="w-[7%]">{t('timetableVersionsTableHeaders.label')}</th>
          <th className="w-[20%]">
            {t('timetableVersionsTableHeaders.version')}
          </th>
          <th className="w-[12.5%]">
            {t('timetableVersionsTableHeaders.modified')}
          </th>
          <th className="w-[12.5%]">
            {t('timetableVersionsTableHeaders.modifier')}
          </th>
          <th className="invisible w-[3%]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
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
