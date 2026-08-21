import { DateTime } from 'luxon';
import { FC } from 'react';
import { MdHistory } from 'react-icons/md';
import { twJoin } from 'tailwind-merge';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import { useGetLocalizedTextFromDbBlob } from '../../../../utils/i18n';
import { Column, Row } from '../../../common/LayoutComponents';
import { getTimetableHeadingBgColor } from '../../VehicleScheduleDetails';

type TimetableHeadingProps = {
  readonly priority: TimetablePriority;
  readonly dayTypeI18n: LocalizedString;
  readonly createdAt: DateTime | null;
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
      className={twJoin(
        'justify-between rounded-md border-2 border-transparent px-4 py-1',
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
