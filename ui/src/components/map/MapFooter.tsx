import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { useAppAction, useAppSelector } from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import {
  Mode,
  selectHasChangesInProgress,
  selectHasDraftRouteGeometry,
  selectIsCreateStopAreaModeEnabled,
  selectIsCreateStopModeEnabled,
  selectIsInViewMode,
  selectIsMoveStopAreaModeEnabled,
  selectIsMoveStopModeEnabled,
  selectMapRouteEditor,
  setIsCreateStopAreaModeEnabledAction,
  setIsCreateStopModeEnabledAction,
} from '../../redux';
import { SimpleButton } from '../../uiComponents';
import { MapFooterActionsDropdown } from './MapFooterActionsDropdown';

interface Props {
  onDrawRoute: () => void;
  onEditRoute: () => void;
  onDeleteRoute: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const testIds = {
  drawRouteButton: 'MapFooter::drawRouteButton',
  editRouteButton: 'MapFooter::editRouteButton',
  saveButton: 'MapFooter::saveButton',
  cancelButton: 'MapFooter::cancelButton',
  addStopButton: 'MapFooter:addStopButton',
};

export const MapFooter: React.FC<Props> = ({
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

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );

  const isCreateStopAreaModeEnabled = useAppSelector(
    selectIsCreateStopAreaModeEnabled,
  );
  const setIsCreateStopAreaModeEnabled = useAppAction(
    setIsCreateStopAreaModeEnabledAction,
  );
  const isMoveStopAreaModeEnabled = useAppSelector(
    selectIsMoveStopAreaModeEnabled,
  );

  const onAddStops = () => {
    setIsCreateStopModeEnabled(!isCreateStopModeEnabled);
  };

  const onAddStopArea = () => {
    setIsCreateStopAreaModeEnabled(!isCreateStopAreaModeEnabled);
  };

  return (
    <Row className="space-x-4 bg-white px-10 py-5">
      <SimpleButton
        testId={testIds.drawRouteButton}
        onClick={onDrawRoute}
        disabled={
          !isInViewMode ||
          creatingNewRoute ||
          isCreateStopModeEnabled ||
          isMoveStopModeEnabled ||
          isCreateStopAreaModeEnabled ||
          isMoveStopAreaModeEnabled
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
          isCreateStopAreaModeEnabled ||
          isMoveStopAreaModeEnabled
        }
        inverted={!isCreateStopModeEnabled}
        testId={testIds.addStopButton}
        disabledTooltip={t('dataModelRefactor.disabled')}
      >
        {t('map.addStop')}
      </SimpleButton>
      <MapFooterActionsDropdown
        disabled={
          isCreateStopModeEnabled ||
          drawingMode !== undefined ||
          creatingNewRoute ||
          hasChangesInProgress ||
          isRouteMetadataFormOpen ||
          isMoveStopAreaModeEnabled
        }
        tooltip={t('map.footerActionsTooltip')}
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
