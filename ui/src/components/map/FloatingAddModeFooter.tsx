import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import {
  MapEntityEditorViewState,
  setRouteMetadataFormOpenAction,
} from '../../redux';
import { FloatingFooter } from './FloatingFooter';
import { useMapViewState } from './utils/useMapViewState';

type FloatingAddModeFooterProps = {
  readonly isInDrawingMode: boolean;
  readonly onCancel: () => void;
};

export const FloatingAddModeFooter: FC<FloatingAddModeFooterProps> = ({
  isInDrawingMode,
  onCancel,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [mapViewState, setMapViewState] = useMapViewState();

  const onCancelAddMode = () => {
    setMapViewState({
      stops: MapEntityEditorViewState.NONE,
      stopAreas: MapEntityEditorViewState.NONE,
      terminals: MapEntityEditorViewState.NONE,
    });
  };

  const onCancelDrawMode = () => {
    // Return to route modal mode when canceling drawing mode
    dispatch(setRouteMetadataFormOpenAction(true));
    // Stop the drawing mode but keep the route creation process
    onCancel();
  };

  const onClose = () => {
    if (isInDrawingMode) {
      onCancelDrawMode();
    } else {
      onCancelAddMode();
    }
  };

  const getAddModeText = () => {
    if (isInDrawingMode) {
      return t('map.drawRoute');
    }
    if (mapViewState.stops === MapEntityEditorViewState.PLACE) {
      return t('map.addStop');
    }
    if (mapViewState.stopAreas === MapEntityEditorViewState.PLACE) {
      return t('map.createNewStopArea');
    }
    if (mapViewState.terminals === MapEntityEditorViewState.PLACE) {
      return t('map.createNewTerminal');
    }
    return '';
  };

  return (
    <FloatingFooter onClose={onClose} testId="MapFooter">
      {getAddModeText()}
    </FloatingFooter>
  );
};
