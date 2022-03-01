import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { JourneyPatternScheduledStopPointInJourneyPattern } from '../../generated/graphql';
import { useEditRouteGeometry } from '../../hooks/useEditRouteGeometry';
import { Row } from '../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';
import { SimpleDropdownMenu } from '../../uiComponents';
import { showToast } from '../../utils';

interface Props {
  className?: string;
  stop: JourneyPatternScheduledStopPointInJourneyPattern;
}

export const RouteStopsRow = ({ className, stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { deleteStopFromJourneyPattern } = useEditRouteGeometry();

  const deleteFromJourneyPattern = async () => {
    try {
      await deleteStopFromJourneyPattern({
        journeyPatternId: stop.journey_pattern_id,
        stopPointId: stop.scheduled_stop_point_id,
      });
      await showToast({
        type: 'success',
        message: t('routes.saveSuccess'),
      });
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

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
      <td>
        <SimpleDropdownMenu>
          <button type="button" onClick={deleteFromJourneyPattern}>
            {t('stops.removeFromRoute')}
          </button>
        </SimpleDropdownMenu>
      </td>
    </tr>
  );
};
