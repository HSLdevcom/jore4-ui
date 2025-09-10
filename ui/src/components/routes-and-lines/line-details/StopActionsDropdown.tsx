import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  Operation,
  openTimingSettingsModalAction,
  openViaModalAction,
  selectIsJoreOperationLoading,
} from '../../../redux';
import {
  AlignDirection,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';
import { useLoader } from '../../common/hooks/useLoader';
import { useEditRouteJourneyPattern } from '../edit-route/useEditRouteJourneyPattern';

const testIds = {
  menu: 'StopActionsDropdown::menu',
  addStop: 'StopActionsDropdown::addStopToRouteButton',
  removeStop: 'StopActionsDropdown::removeStopFromRouteButton',
  createViaPoint: 'StopActionsDropdown::createViaPoint',
  editViaPoint: 'StopActionsDropdown::editViaPoint',
  openTimingSettings: 'StopActionsDropdown::openTimingSettings',
};

type StopActionsDropdownProps = {
  readonly journeyPatternId: UUID | undefined;
  readonly scheduledStopPointSequence: number | undefined;
  readonly stopLabel: string;
  readonly stopBelongsToJourneyPattern: boolean;
  readonly isViaPoint: boolean | undefined;
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly tooltip: string;
};

export const StopActionsDropdown: FC<StopActionsDropdownProps> = ({
  journeyPatternId,
  scheduledStopPointSequence,
  stopLabel,
  stopBelongsToJourneyPattern,
  isViaPoint,
  route,
  tooltip,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoader(Operation.UpdateRouteJourneyPattern);
  const isLoading = useAppSelector(selectIsJoreOperationLoading);

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
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const onRemoveFromRoute = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <SimpleDropdownMenu
      alignItems={AlignDirection.Left}
      testId={testIds.menu}
      disabled={isLoading}
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
