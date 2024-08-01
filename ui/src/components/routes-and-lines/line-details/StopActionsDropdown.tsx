import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../generated/graphql';
import { useAppDispatch, useEditRouteJourneyPattern } from '../../../hooks';
import {
  openTimingSettingsModalAction,
  openViaModalAction,
} from '../../../redux';
import {
  AlignDirection,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';

const testIds = {
  menu: 'StopActionsDropdown::menu',
  addStop: 'StopActionsDropdown::addStopToRouteButton',
  removeStop: 'StopActionsDropdown::removeStopFromRouteButton',
  createViaPoint: 'StopActionsDropdown::createViaPoint',
  editViaPoint: 'StopActionsDropdown::editViaPoint',
  openTimingSettings: 'StopActionsDropdown::openTimingSettings',
};

interface Props {
  journeyPatternId: UUID | undefined;
  scheduledStopPointSequence: number | undefined;
  stopLabel: string;
  stopBelongsToJourneyPattern: boolean;
  isViaPoint: boolean | undefined;
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  tooltip: string;
}

export const StopActionsDropdown = ({
  journeyPatternId,
  scheduledStopPointSequence,
  stopLabel,
  stopBelongsToJourneyPattern,
  isViaPoint,
  route,
  tooltip,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    prepareAddStopToRoute,
    prepareDeleteStopFromRoute,
    mapEditJourneyPatternChangesToVariables,
    updateRouteGeometryMutation,
  } = useEditRouteJourneyPattern();

  const showViaModal = () => {
    if (journeyPatternId) {
      dispatch(
        openViaModalAction({
          stopLabel,
          journeyPatternId,
        }),
      );
    }
  };

  const showTimingSettingsModal = () => {
    if (journeyPatternId && scheduledStopPointSequence !== undefined) {
      dispatch(
        openTimingSettingsModalAction({
          stopLabel,
          journeyPatternId,
          sequence: scheduledStopPointSequence,
        }),
      );
    }
  };

  const onAddToRoute = async () => {
    try {
      const changes = prepareAddStopToRoute({
        stopPointLabels: [stopLabel],
        route,
      });

      const variables = mapEditJourneyPatternChangesToVariables(changes);

      await updateRouteGeometryMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  const onRemoveFromRoute = async () => {
    try {
      const changes = prepareDeleteStopFromRoute({
        stopPointLabels: [stopLabel],
        route,
      });

      const variables = mapEditJourneyPatternChangesToVariables(changes);

      await updateRouteGeometryMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  return (
    <SimpleDropdownMenu
      alignItems={AlignDirection.Left}
      testId={testIds.menu}
      tooltip={tooltip}
    >
      {stopBelongsToJourneyPattern ? (
        <SimpleDropdownMenuItem
          onClick={onRemoveFromRoute}
          text={t('stops.removeFromRoute')}
          testId={testIds.removeStop}
        />
      ) : (
        <SimpleDropdownMenuItem
          onClick={onAddToRoute}
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
