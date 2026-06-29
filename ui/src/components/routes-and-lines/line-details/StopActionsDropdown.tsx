import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  Operation,
  openTimingSettingsModalAction,
  openViaModalAction,
  selectIsJoreOperationLoading,
} from '../../../redux';
import { showDangerToast, showSuccessToast } from '../../../utils';
import {
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../common/Dropdowns';
import { useLoader } from '../../common/hooks/useLoader';
import { StopsNeedingUpdateModal } from '../common/StopsNeedingUpdateModal';
import {
  UpdateJourneyPatternChanges,
  useEditRouteJourneyPattern,
} from '../edit-route/useEditRouteJourneyPattern';

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

// TODO: Fix this to be a simple presentation component, and externalize the actial update logic.
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

  const [pendingChanges, setPendingChanges] =
    useState<UpdateJourneyPatternChanges | null>(null);

  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoader(Operation.UpdateRouteJourneyPattern);
  const isLoading = useAppSelector(selectIsJoreOperationLoading);

  const { prepareAddStopToRoute, prepareDeleteStopFromRoute, performUpdate } =
    useEditRouteJourneyPattern();

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

  const onCommitUpdate = async (changes: UpdateJourneyPatternChanges) => {
    setIsLoading(true);
    setPendingChanges(null);

    try {
      await performUpdate(changes);
      showSuccessToast(t(($) => $.routes.saveSuccess));
    } catch (err) {
      showDangerToast(`${t(($) => $.errors.saveFailed)}, '${err}'`);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddToRoute = async () => {
    setIsLoading(true);
    try {
      const changes = await prepareAddStopToRoute({
        stopPointLabels: [stopLabel],
        route,
      });

      if (changes.stopsNeedingUpdate.length) {
        setPendingChanges(changes);
      } else {
        await onCommitUpdate(changes);
      }
    } catch (err) {
      showDangerToast(`${t(($) => $.errors.saveFailed)}, '${err}'`);
    }
    setIsLoading(false);
  };

  const onRemoveFromRoute = async () => {
    setIsLoading(true);
    try {
      const changes = await prepareDeleteStopFromRoute({
        stopPointLabels: [stopLabel],
        route,
      });

      if (changes.stopsNeedingUpdate.length) {
        setPendingChanges(changes);
      } else {
        await onCommitUpdate(changes);
      }
    } catch (err) {
      showDangerToast(`${t(($) => $.errors.saveFailed)}, '${err}'`);
    }
    setIsLoading(false);
  };

  return (
    <>
      {' '}
      <SimpleDropdownMenu
        testId={testIds.menu}
        disabled={isLoading}
        tooltip={tooltip}
      >
        {stopBelongsToJourneyPattern ? (
          <SimpleDropdownMenuItem
            onClick={onRemoveFromRoute}
            text={t(($) => $.stops.removeFromRoute)}
            testId={testIds.removeStop}
          />
        ) : (
          <SimpleDropdownMenuItem
            onClick={onAddToRoute}
            text={t(($) => $.stops.addToRoute)}
            testId={testIds.addStop}
          />
        )}
        {isViaPoint ? (
          <SimpleDropdownMenuItem
            onClick={showViaModal}
            text={t(($) => $.viaModal.editViaPoint)}
            testId={testIds.editViaPoint}
          />
        ) : (
          <SimpleDropdownMenuItem
            disabled={!stopBelongsToJourneyPattern}
            onClick={showViaModal}
            text={t(($) => $.viaModal.createViaPoint)}
            testId={testIds.createViaPoint}
          />
        )}
        <SimpleDropdownMenuItem
          disabled={!stopBelongsToJourneyPattern}
          onClick={showTimingSettingsModal}
          text={t(($) => $.timingSettingsModal.timingSettings)}
          testId={testIds.openTimingSettings}
        />
      </SimpleDropdownMenu>
      {pendingChanges ? (
        <StopsNeedingUpdateModal
          onCancel={() => setPendingChanges(null)}
          onConfirm={() => onCommitUpdate(pendingChanges)}
          isOpen
          stops={pendingChanges.stopsNeedingUpdate}
          typeOfLine={route.route_line.type_of_line}
        />
      ) : null}
    </>
  );
};
