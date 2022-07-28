import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { useAppAction, useAppSelector } from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import {
  Mode,
  selectHasChangesInProgress,
  selectHasDraftRouteGeometry,
  selectIsCreateStopModeEnabled,
  selectIsInViewMode,
  selectMapEditor,
  setIsCreateStopModeEnabledAction,
} from '../../redux';
import { SimpleButton } from '../../uiComponents';

interface Props {
  onDrawRoute: () => void;
  onEditRoute: () => void;
  onDeleteRoute: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const testIds = {
  drawRouteButton: 'mapFooter:drawRouteButton',
  editRouteButton: 'mapFooter:editRouteButton',
  saveButton: 'mapFooter:saveButton',
  cancelButton: 'mapFooter:cancelButton',
  addStopButton: 'mapFooter:addStopButton',
};

export const MapFooter: React.FC<Props> = ({
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();

  const { drawingMode, creatingNewRoute, selectedRouteId } =
    useAppSelector(selectMapEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);

  const hasChangesInProgress = useAppSelector(selectHasChangesInProgress);
  const isInViewMode = useAppSelector(selectIsInViewMode);

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const setIsCreateStopModeEnabled = useAppAction(
    setIsCreateStopModeEnabledAction,
  );

  const onAddStops = () => {
    setIsCreateStopModeEnabled(!isCreateStopModeEnabled);
  };

  return (
    <Row className="space-x-4 bg-white px-10 py-5">
      <SimpleButton
        testId={testIds.drawRouteButton}
        onClick={onDrawRoute}
        disabled={!isInViewMode || creatingNewRoute}
        inverted={drawingMode !== Mode.Draw}
      >
        {t('map.drawRoute')}
      </SimpleButton>
      <SimpleButton
        testId={testIds.editRouteButton}
        onClick={onEditRoute}
        disabled={!(hasDraftRouteGeometry || selectedRouteId)}
        inverted={drawingMode !== Mode.Edit}
      >
        {t('map.editRoute')}
      </SimpleButton>
      <SimpleButton
        onClick={onAddStops}
        disabled={drawingMode !== undefined}
        inverted={!isCreateStopModeEnabled}
        testId={testIds.addStopButton}
      >
        {t('map.addStop')}
      </SimpleButton>
      <SimpleButton
        className="h-full !px-3"
        onClick={onDeleteRoute}
        disabled={!hasChangesInProgress}
      >
        <MdDelete aria-label={t('map.deleteRoute')} />
      </SimpleButton>
      <Visible visible={hasChangesInProgress}>
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
