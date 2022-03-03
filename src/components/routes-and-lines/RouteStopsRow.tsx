import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../generated/graphql';
import { Row } from '../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';

interface Props {
  className?: string;
  stop: ServicePatternScheduledStopPoint;
}

export const RouteStopsRow = ({ className, stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const stopBelongsToJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns?.length > 0;

  return (
    <tr
      className={`border border-l-8 ${
        stopBelongsToJourneyPattern ? '' : 'text-dark-grey bg-background'
      } ${className}`}
    >
      <td className="py-4 pl-16 pr-4">{stop.label}</td>
      <td>!Pysäkki X</td>
      <td className="pr-16 text-right">
        {stopBelongsToJourneyPattern
          ? t('validity.validDuring', {
              startDate: mapToShortDate(stop.validity_start || MIN_DATE),
              endDate: mapToShortDate(stop.validity_end || MAX_DATE),
            })
          : t('stops.notPartOfRoute')}
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
