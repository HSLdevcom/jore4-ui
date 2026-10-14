import some from 'lodash/some';
import { FC } from 'react';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import {
  MapEntityEditorViewState,
  Mode,
  selectMapRouteEditor,
  useAppSelector,
} from '../../../redux';
import { useIsInSearchResultMode } from '../Utils/useIsInSearchResultMode';
import { useMapViewState } from '../Utils/useMapViewState';
import { FloatingAddModeFooter } from './FloatingAddModeFooter';
import { FloatingStopResultsFooter } from './FloatingStopResultsFooter';
import { MapFooterFullBar } from './MapFooterFullBar';

function useActiveModes() {
  const isInSearchResultMode = useIsInSearchResultMode();

  const { drawingMode, creatingNewRoute } =
    useAppSelector(selectMapRouteEditor);

  const [mapViewState] = useMapViewState();

  const isInPlaceMode = some(
    mapViewState,
    (state) =>
      state === MapEntityEditorViewState.PLACE ||
      state === MapEntityEditorViewState.PLACECOPY,
  );

  const isInDrawingMode = drawingMode === Mode.Draw && creatingNewRoute;

  return {
    isInSearchResultMode,
    isInPlaceMode,
    isInDrawingMode,
  };
}

type MapFooterProps = {
  readonly onDrawRoute: (
    vehicleMode: ReusableComponentsVehicleModeEnum,
  ) => void;
  readonly onRedrawRoute: () => void;
  readonly onEditRoute: () => void;
  readonly onStopEditRoute: () => void;
  readonly onDeleteRouteGeometry: () => void;
  readonly onDeleteRoute: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

export const MapFooter: FC<MapFooterProps> = ({
  onDrawRoute,
  onRedrawRoute,
  onEditRoute,
  onStopEditRoute,
  onDeleteRouteGeometry,
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
      onRedrawRoute={onRedrawRoute}
      onEditRoute={onEditRoute}
      onStopEditRoute={onStopEditRoute}
      onDeleteRouteGeometry={onDeleteRouteGeometry}
      onDeleteRoute={onDeleteRoute}
      onCancel={onCancel}
      onSave={onSave}
    />
  );
};
