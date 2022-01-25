import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { JourneyPatternScheduledStopPointInJourneyPattern } from '../../generated/graphql';
import { Row } from '../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';

interface Props {
  className?: string;
  stop: JourneyPatternScheduledStopPointInJourneyPattern;
}

export const RouteStopsRow = ({ className, stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <tr className={`border border-l-8 ${className}`}>
      <td className="py-4 pl-16 pr-4">{stop.scheduled_stop_point?.label}</td>
      <td>!Pysäkki X</td>
      <td>
        {t('validity.validDuring', {
          startDate: mapToShortDate(
            stop.scheduled_stop_point?.validity_start || MIN_DATE,
          ),
          endDate: mapToShortDate(
            stop.scheduled_stop_point?.validity_end || MAX_DATE,
          ),
        })}
      </td>
      <td>
        <Row className="items-center">
          !{mapToShortDateTime(DateTime.now())}
          <MdOutlineHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td>&nbsp;</td>
      <td>...</td>
    </tr>
  );
};
