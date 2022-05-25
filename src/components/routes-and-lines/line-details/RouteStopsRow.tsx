import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import { useEditRouteJourneyPattern } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../../time';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';

interface Props {
  className?: string;
  stop: ServicePatternScheduledStopPoint;
  routeId: UUID;
  onAddToRoute: (stopLabel: string) => void;
}

export const RouteStopsRow = ({
  className,
  stop,
  routeId,
  onAddToRoute,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const belongsToJourneyPattern = stopBelongsToJourneyPattern(stop, routeId);

  const {
    prepareDeleteStopFromRoute,
    mapDeleteStopFromRouteChangesToVariables,
    deleteStopFromRouteMutation,
  } = useEditRouteJourneyPattern();

  const deleteFromJourneyPattern = async () => {
    try {
      const changes = prepareDeleteStopFromRoute({
        routeId,
        stopPointLabel: stop.label,
      });
      const variables = mapDeleteStopFromRouteChangesToVariables(changes);

      await deleteStopFromRouteMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  return (
    <tr
      className={`border border-l-8 ${
        belongsToJourneyPattern ? '' : 'bg-background text-dark-grey'
      } ${className}`}
    >
      <td className="py-4 pl-16 pr-4" data-testid="stop-row-label">
        {stop.label}
      </td>
      <td data-testid="stop-row-name">!Pysäkki X</td>
      <td className="pr-16 text-right" data-testid="stop-row-validity-period">
        {belongsToJourneyPattern
          ? t('validity.validDuring', {
              startDate: mapToShortDate(stop.validity_start || MIN_DATE),
              endDate: mapToShortDate(stop.validity_end || MAX_DATE),
            })
          : t('stops.notPartOfRoute')}
      </td>
      <td>
        <Row className="items-center">
          <span data-testid="stop-row-last-edited">
            !{mapToShortDateTime(DateTime.now())}
          </span>
          <MdOutlineHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td>&nbsp;</td>
      <td>
        <SimpleDropdownMenu
          alignItems={AlignDirection.Left}
          testId="stop-row-action-menu"
        >
          {belongsToJourneyPattern ? (
            <button type="button" onClick={deleteFromJourneyPattern}>
              {t('stops.removeFromRoute')}
            </button>
          ) : (
            <button type="button" onClick={() => onAddToRoute(stop.label)}>
              {t('stops.addToRoute')}
            </button>
          )}
        </SimpleDropdownMenu>
      </td>
    </tr>
  );
};
