import some from 'lodash/some';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import {
  MapEntityEditorViewState,
  Mode,
  isEditorOpen,
  resetRouteCreatingAction,
  selectHasChangesInProgress,
  selectHasDraftRouteGeometry,
  selectIsInViewMode,
  selectMapRouteEditor,
  setRouteMetadataFormOpenAction,
} from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { MapFooterActionsDropdown } from './MapFooterActionsDropdown';
import { useMapViewState } from './utils/useMapViewState';

type MapFooterProps = {
  readonly onDrawRoute: () => void;
  readonly onEditRoute: () => void;
  readonly onDeleteRoute: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

const testIds = {
  drawRouteButton: 'MapFooter::drawRouteButton',
  editRouteButton: 'MapFooter::editRouteButton',
  saveButton: 'MapFooter::saveButton',
  cancelButton: 'MapFooter::cancelButton',
  addStopButton: 'MapFooter:addStopButton',
};

export const MapFooter: FC<MapFooterProps> = ({
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    drawingMode,
    creatingNewRoute,
    isRouteMetadataFormOpen,
    selectedRouteId,
  } = useAppSelector(selectMapRouteEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);

  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);
  const isInViewMode = useAppSelector(selectIsInViewMode);

  const [mapViewState, setMapViewState] = useMapViewState();

  const onAddStops = () => {
    setMapViewState({ stops: MapEntityEditorViewState.PLACE });
  };

  const onAddStopArea = () => {
    setMapViewState({ stopAreas: MapEntityEditorViewState.PLACE });
  };

  const onAddTerminal = () => {
    setMapViewState({ terminals: MapEntityEditorViewState.PLACE });
  };

  const someItemIsSelected = some(
    mapViewState,
    (state) => state !== MapEntityEditorViewState.NONE,
  );

  const someItemIsInPlaceMode = some(
    mapViewState,
    (state) => state === MapEntityEditorViewState.PLACE,
  );

  const isInDrawingMode =
    drawingMode !== undefined || isRouteMetadataFormOpen || creatingNewRoute;

  const onCancelAddMode = () => {
    setMapViewState({
      stops: MapEntityEditorViewState.NONE,
      stopAreas: MapEntityEditorViewState.NONE,
      terminals: MapEntityEditorViewState.NONE,
    });
  };

  const onCancelDrawMode = () => {
    if (isRouteMetadataFormOpen) {
      // Close the metadata form
      dispatch(setRouteMetadataFormOpenAction(false));
      // Cancel route creation entirely since form wasn't completed
      dispatch(resetRouteCreatingAction());
    } else {
      // Use the regular cancel for drawing mode
      onCancel();
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

  const getCancelHandler = () => {
    if (isInDrawingMode) {
      return onCancelDrawMode;
    }
    return onCancelAddMode;
  };

  if (someItemIsInPlaceMode || isInDrawingMode) {
    return (
      <div className="absolute bottom-0 left-1/2 z-[60] w-80 -translate-x-1/2 px-10 py-5">
        <SimpleButton
          onClick={getCancelHandler()}
          containerClassName="w-full"
          className="hover:border-6 relative flex w-full items-center justify-center rounded-md border-2 border-blue-500 bg-white text-brand shadow-lg hover:bg-opacity-100"
        >
          <span className="px-8">{getAddModeText()}</span>
          <span className="absolute right-3 text-lg font-bold">×</span>
        </SimpleButton>
      </div>
    );
  }

  return (
    <Row className="space-x-4 bg-white px-10 py-5">
      <SimpleButton
        testId={testIds.drawRouteButton}
        onClick={onDrawRoute}
        disabled={!isInViewMode || creatingNewRoute || someItemIsSelected}
        inverted={drawingMode !== Mode.Draw}
      >
        {t('map.drawRoute')}
      </SimpleButton>
      <SimpleButton
        testId={testIds.editRouteButton}
        onClick={onEditRoute}
        disabled={
          !(hasDraftRouteGeometry || selectedRouteId) ||
          drawingMode === Mode.Edit
        }
      >
        {t('map.editRoute')}
      </SimpleButton>
      <SimpleButton
        onClick={onAddStops}
        disabled={
          drawingMode !== undefined ||
          creatingNewRoute ||
          // Allow stop area to be pre-selected
          isEditorOpen(mapViewState.stopAreas) ||
          // But nothing else must be selected on the map
          mapViewState.stops !== MapEntityEditorViewState.NONE ||
          mapViewState.terminals !== MapEntityEditorViewState.NONE
        }
        inverted={mapViewState.stops === MapEntityEditorViewState.NONE}
        testId={testIds.addStopButton}
        disabledTooltip={t('dataModelRefactor.disabled')}
      >
        {t('map.addStop')}
      </SimpleButton>
      <MapFooterActionsDropdown
        disabled={
          someItemIsSelected ||
          drawingMode !== undefined ||
          creatingNewRoute ||
          hasChangesInProgress ||
          isRouteMetadataFormOpen
        }
        onCreateNewStopArea={onAddStopArea}
        onCreateNewTerminal={onAddTerminal}
      />
      <SimpleButton
        className="h-full !px-3 text-xl"
        onClick={onDeleteRoute}
        disabled={!hasChangesInProgress || isRouteMetadataFormOpen}
      >
        <MdDelete aria-label={t('map.deleteRoute')} />
      </SimpleButton>
      <Visible visible={hasChangesInProgress && !isRouteMetadataFormOpen}>
        <SimpleButton
          containerClassName="!ml-auto"
          onClick={onCancel}
          disabled={!hasChangesInProgress}
          testId={testIds.cancelButton}
          inverted
        >
          {t('cancel')}
        </SimpleButton>
        <SimpleButton
          onClick={onSave}
          disabled={!(hasChangesInProgress && hasDraftRouteGeometry)}
          testId={testIds.saveButton}
        >
          {t('routes.save')}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
