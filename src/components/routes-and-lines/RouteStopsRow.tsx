import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../generated/graphql';
import { useEditRouteGeometry } from '../../hooks/useEditRouteGeometry';
import { Row } from '../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';
import { SimpleDropdownMenu } from '../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../utils';

interface Props {
  className?: string;
  stop: ServicePatternScheduledStopPoint;
  routeId: UUID;
}

export const RouteStopsRow = ({
  className,
  stop,
  routeId,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  // check if the stop belongs to any of the current route's journey patterns
  const stopBelongsToJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.some(
      (item) => item.journey_pattern?.on_route_id === routeId,
    );

  const { deleteStopFromJourneyPattern } = useEditRouteGeometry();

  const deleteFromJourneyPattern = async () => {
    try {
      await deleteStopFromJourneyPattern({
        routeId,
        stopPointId: stop.scheduled_stop_point_id,
      });
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  return (
    <tr
      className={`border border-l-8 ${
        stopBelongsToJourneyPattern ? '' : 'bg-background text-dark-grey'
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
      <td>
        {stopBelongsToJourneyPattern && (
          <SimpleDropdownMenu>
            <button type="button" onClick={deleteFromJourneyPattern}>
              {t('stops.removeFromRoute')}
            </button>
          </SimpleDropdownMenu>
        )}
      </td>
    </tr>
  );
};
