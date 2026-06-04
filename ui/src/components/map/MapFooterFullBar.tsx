import some from 'lodash/some';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { ReusableComponentsVehicleModeEnum } from '../../generated/graphql';
import { useAppAction, useAppSelector } from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import {
  MapEntityEditorViewState,
  Mode,
  isEditorOpen,
  selectHasChangesInProgress,
  selectHasDraftRouteGeometry,
  selectIsInViewMode,
  selectMapRouteEditor,
  setDraftVehicleModeAction,
} from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { MapFooterActionsDropdown } from './MapFooterActionsDropdown';
import { MapFooterAddRouteDropdown } from './MapFooterAddRouteDropdown';
import { MapFooterAddStopDropdown } from './MapFooterAddStopDropdown';
import { useMapViewState } from './utils/useMapViewState';

const testIds = {
  mapFooter: 'MapFooter::mapFooter',
  drawRouteButton: 'MapFooter::drawRouteButton',
  editRouteButton: 'MapFooter::editRouteButton',
  saveButton: 'MapFooter::saveButton',
  cancelButton: 'MapFooter::cancelButton',
  addStopButton: 'MapFooter:addStopButton',
};

type MapFooterFullBarProps = {
  readonly onDrawRoute: (
    vehicleMode: ReusableComponentsVehicleModeEnum,
  ) => void;
  readonly onEditRoute: () => void;
  readonly onStopEditRoute: () => void;
  readonly onDeleteRoute: () => void;
  readonly onCancel: () => void;
  readonly onSave: () => void;
};

export const MapFooterFullBar: FC<MapFooterFullBarProps> = ({
  onDrawRoute,
  onEditRoute,
  onStopEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();

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
  const setDraftVehicleMode = useAppAction(setDraftVehicleModeAction);

  const onAddStops = (vehicleMode: ReusableComponentsVehicleModeEnum) => {
    setDraftVehicleMode(vehicleMode);
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

  const isEditingExistingRoute = drawingMode === Mode.Edit && !creatingNewRoute;
  const isEditRouteActionAvailable =
    hasDraftRouteGeometry ||
    !!selectedRouteId ||
    (creatingNewRoute && !isRouteMetadataFormOpen);

  const handleEditRouteClick =
    drawingMode === Mode.Edit && !isEditingExistingRoute
      ? onStopEditRoute
      : onEditRoute;

  return (
    <Row testId={testIds.mapFooter} className="gap-4 bg-white px-10 py-5">
      <MapFooterAddRouteDropdown
        testId={testIds.drawRouteButton}
        onAddRoute={onDrawRoute}
        disabled={!isInViewMode || creatingNewRoute || someItemIsSelected}
        inverted={drawingMode !== Mode.Draw}
      />
      <SimpleButton
        testId={testIds.editRouteButton}
        onClick={handleEditRouteClick}
        disabled={isEditingExistingRoute || !isEditRouteActionAvailable}
      >
        {drawingMode === Mode.Edit && !isEditingExistingRoute
          ? t(($) => $.map.stopEditing)
          : t(($) => $.map.editRoute)}
      </SimpleButton>
      <MapFooterAddStopDropdown
        onAddStops={onAddStops}
        testId={testIds.addStopButton}
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
      />
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
        shape="round"
        className="h-full text-xl"
        onClick={onDeleteRoute}
        disabled={!hasChangesInProgress || isRouteMetadataFormOpen}
      >
        <MdDelete aria-label={t(($) => $.map.deleteRoute)} />
      </SimpleButton>
      <Visible visible={hasChangesInProgress && !isRouteMetadataFormOpen}>
        <SimpleButton
          className="ml-auto"
          onClick={onCancel}
          disabled={!hasChangesInProgress}
          testId={testIds.cancelButton}
          inverted
        >
          {t(($) => $.cancel)}
        </SimpleButton>
        <SimpleButton
          onClick={onSave}
          disabled={!(hasChangesInProgress && hasDraftRouteGeometry)}
          testId={testIds.saveButton}
        >
          {t(($) => $.routes.save)}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
