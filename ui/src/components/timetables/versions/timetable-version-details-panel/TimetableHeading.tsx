import { DateTime } from 'luxon';
import { MdHistory } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { parseI18nField } from '../../../../i18n/utils';
import { Column, Row } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import { getTimetableHeadingBgColor } from '../../vehicle-schedule-details';

export const TimetableHeading: React.FC<{
  priority: TimetablePriority;
  dayTypeI18n?: LocalizedString;
  createdAt?: DateTime;
  className?: string;
}> = ({ priority, dayTypeI18n, createdAt, className = '' }) => (
  <Row
    className={twMerge(
      'justify-between rounded-md border-2 border-transparent bg-opacity-50 px-4 py-1',
      getTimetableHeadingBgColor(priority),
      className,
    )}
  >
    <Column>
      <span className="text-lg font-bold">{parseI18nField(dayTypeI18n)}</span>
    </Column>
    <Column className="justify-center">
      <p className="text-sm">
        {mapToShortDateTime(createdAt)}
        <MdHistory className="ml-2 inline" />
      </p>
    </Column>
  </Row>
);
