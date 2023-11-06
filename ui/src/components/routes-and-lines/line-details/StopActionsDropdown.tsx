import { useTranslation } from 'react-i18next';
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
  journeyPatternId: UUID | undefined;
  scheduledStopPointSequence: number | undefined;
  stopLabel: string;
  stopBelongsToJourneyPattern: boolean;
  isViaPoint: boolean | undefined;
  onAddToRoute: (stopLabel: string) => void;
  onRemoveFromRoute: (stopLabel: string) => void;
}

export const StopActionsDropdown = ({
  journeyPatternId,
  scheduledStopPointSequence,
  stopLabel,
  stopBelongsToJourneyPattern,
  isViaPoint,
  onAddToRoute,
  onRemoveFromRoute,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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

  return (
    <SimpleDropdownMenu alignItems={AlignDirection.Left} testId={testIds.menu}>
      {stopBelongsToJourneyPattern ? (
        <SimpleDropdownMenuItem
          onClick={() => onRemoveFromRoute(stopLabel)}
          text={t('stops.removeFromRoute')}
          testId={testIds.removeStop}
        />
      ) : (
        <SimpleDropdownMenuItem
          onClick={() => onAddToRoute(stopLabel)}
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
