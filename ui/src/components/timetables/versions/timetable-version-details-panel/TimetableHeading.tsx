import { DateTime } from 'luxon';
import { FC } from 'react';
import { MdHistory } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { Column, Row } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import { getTimetableHeadingBgColor } from '../../vehicle-schedule-details';

type TimetableHeadingProps = {
  readonly priority: TimetablePriority;
  readonly dayTypeI18n?: LocalizedString;
  readonly createdAt?: DateTime;
  readonly className?: string;
};

export const TimetableHeading: FC<TimetableHeadingProps> = ({
  priority,
  dayTypeI18n,
  createdAt,
  className,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  return (
    <Row
      className={twMerge(
        'justify-between rounded-md border-2 border-transparent bg-opacity-50 px-4 py-1',
        getTimetableHeadingBgColor(priority),
        className,
      )}
    >
      <Column>
        <span className="text-lg font-bold">
          {getLocalizedTextFromDbBlob(dayTypeI18n)}
        </span>
      </Column>
      <Column className="justify-center">
        <p className="text-sm">
          {mapToShortDateTime(createdAt)}
          <MdHistory className="ml-2 inline" />
        </p>
      </Column>
    </Row>
  );
};
