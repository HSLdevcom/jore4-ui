import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks';
import {
  openTimingSettingsModalAction,
  openViaModalAction,
} from '../../../redux';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';
import { SimpleDropdownMenuItem } from './SimpleDropdownMenuItem';

const testIds = {
  menu: 'StopActionsDrowdown::menu',
  addStop: 'StopActionsDrowdown::addStopToRouteButton',
  removeStop: 'StopActionsDrowdown::removeStopFromRouteButton',
  createViaPoint: 'StopActionsDrowdown::createViaPoint',
  editViaPoint: 'StopActionsDrowdown::editViaPoint',
  openTimingSettings: 'StopActionsDrowdown::openTimingSettings',
};

interface Props {
  stop: RouteStopFieldsFragment;
  routeId: UUID;
  onAddToRoute: (stopLabel: string) => void;
  onRemoveFromRoute: (stopLabel: string) => void;
}

export const StopActionsDropdown = ({
  stop,
  routeId,
  onAddToRoute,
  onRemoveFromRoute,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // find the journey pattern instance that belongs to this route
  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (item) => item.journey_pattern.on_route_id === routeId,
    );

  // does the stop belong to this route's journey pattern?
  const stopBelongsToJourneyPattern = !!scheduledStopPointInJourneyPattern;

  // is the stop via point on this route's journey pattern?
  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;

  const showViaModal = () => {
    const journeyPatternId =
      scheduledStopPointInJourneyPattern?.journey_pattern_id;

    if (journeyPatternId) {
      dispatch(
        openViaModalAction({
          stopLabel: stop.label,
          journeyPatternId,
        }),
      );
    }
  };

  const showTimingSettingsModal = () => {
    const journeyPatternId =
      scheduledStopPointInJourneyPattern?.journey_pattern_id;

    if (journeyPatternId) {
      dispatch(
        openTimingSettingsModalAction({
          stopLabel: stop.label,
          journeyPatternId,
          sequence:
            scheduledStopPointInJourneyPattern.scheduled_stop_point_sequence,
        }),
      );
    }
  };
  return (
    <SimpleDropdownMenu alignItems={AlignDirection.Left} testId={testIds.menu}>
      {stopBelongsToJourneyPattern ? (
        <SimpleDropdownMenuItem
          onClick={() => onRemoveFromRoute(stop.label)}
          text={t('stops.removeFromRoute')}
          testId={testIds.removeStop}
        />
      ) : (
        <SimpleDropdownMenuItem
          onClick={() => onAddToRoute(stop.label)}
          text={t('stops.addToRoute')}
          testId={testIds.addStop}
        />
      )}
      {isViaPoint ? (
        <SimpleDropdownMenuItem
          onClick={showViaModal}
          text={t('viaModal.editViaPoint')}
          testId={testIds.editViaPoint}
        />
      ) : (
        <SimpleDropdownMenuItem
          disabled={!stopBelongsToJourneyPattern}
          onClick={showViaModal}
          text={t('viaModal.createViaPoint')}
          testId={testIds.createViaPoint}
        />
      )}
      <SimpleDropdownMenuItem
        disabled={!stopBelongsToJourneyPattern}
        onClick={showTimingSettingsModal}
        text={t('timingSettingsModal.timingSettings')}
        testId={testIds.openTimingSettings}
      />
    </SimpleDropdownMenu>
  );
};
