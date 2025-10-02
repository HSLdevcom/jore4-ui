import some from 'lodash/some';
import { FC } from 'react';
import { useAppSelector } from '../../hooks';
import {
  MapEntityEditorViewState,
  Mode,
  selectMapRouteEditor,
} from '../../redux';
import { FloatingAddModeFooter } from './FloatingAddModeFooter';
import { FloatingStopResultsFooter } from './FloatingStopResultsFooter';
import { MapFooterFullBar } from './MapFooterFullBar';
import { useIsInSearchResultMode } from './utils/useIsInSearchResultMode';
import { useMapViewState } from './utils/useMapViewState';

function useActiveModes() {
  const isInSearchResultMode = useIsInSearchResultMode();

  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);

  const [mapViewState] = useMapViewState();

  const isInPlaceMode = some(
    mapViewState,
    (state) => state === MapEntityEditorViewState.PLACE,
  );

  const isInDrawingMode = drawingMode === Mode.Draw && creatingNewRoute;

  return {
    isInSearchResultMode,
    isInPlaceMode,
    isInDrawingMode,
  };
}

type MapFooterProps = {
  readonly onDrawRoute: () => void;
  readonly onEditRoute: () => void;
  readonly onDeleteRoute: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

export const MapFooter: FC<MapFooterProps> = ({
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
}) => {
  const { isInSearchResultMode, isInPlaceMode, isInDrawingMode } =
    useActiveModes();

  if (isInPlaceMode || isInDrawingMode) {
    return (
      <FloatingAddModeFooter
        isInDrawingMode={isInDrawingMode}
        onCancel={onCancel}
      />
    );
  }

  if (isInSearchResultMode) {
    return <FloatingStopResultsFooter />;
  }

  return (
    <MapFooterFullBar
      onDrawRoute={onDrawRoute}
      onEditRoute={onEditRoute}
      onDeleteRoute={onDeleteRoute}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
};
