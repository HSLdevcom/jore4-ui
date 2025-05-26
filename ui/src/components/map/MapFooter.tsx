import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
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
  selectMapStopAreaViewState,
  selectMapStopViewState,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
} from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { MapFooterActionsDropdown } from './MapFooterActionsDropdown';

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

  const {
    drawingMode,
    creatingNewRoute,
    isRouteMetadataFormOpen,
    selectedRouteId,
  } = useAppSelector(selectMapRouteEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);

  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);
  const isInViewMode = useAppSelector(selectIsInViewMode);

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);
  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const onAddStops = () => {
    setMapStopViewState(MapEntityEditorViewState.PLACE);
  };

  const onAddStopArea = () => {
    setMapStopAreaViewState(MapEntityEditorViewState.PLACE);
  };

  return (
    <Row className="space-x-4 bg-white px-10 py-5">
      <SimpleButton
        testId={testIds.drawRouteButton}
        onClick={onDrawRoute}
        disabled={
          !isInViewMode ||
          creatingNewRoute ||
          mapStopViewState !== MapEntityEditorViewState.NONE ||
          mapStopAreaViewState !== MapEntityEditorViewState.NONE
        }
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
          isEditorOpen(mapStopAreaViewState)
        }
        inverted={mapStopViewState === MapEntityEditorViewState.NONE}
        testId={testIds.addStopButton}
        disabledTooltip={t('dataModelRefactor.disabled')}
      >
        {t('map.addStop')}
      </SimpleButton>
      <MapFooterActionsDropdown
        disabled={
          mapStopViewState !== MapEntityEditorViewState.NONE ||
          drawingMode !== undefined ||
          creatingNewRoute ||
          hasChangesInProgress ||
          isRouteMetadataFormOpen ||
          mapStopAreaViewState !== MapEntityEditorViewState.NONE
        }
        onCreateNewStopArea={onAddStopArea}
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
