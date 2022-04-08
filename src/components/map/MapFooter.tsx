import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import {
  hasChangesInProgressSelector,
  isInViewModeSelector,
  MapEditorContext,
  Mode,
} from '../../context/MapEditor';
import {
  useAppAction,
  useAppSelector,
  useContextStateSelector,
} from '../../hooks';
import { Row, Visible } from '../../layoutComponents';
import {
  selectIsCreateStopModeEnabled,
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

export const MapFooter: React.FC<Props> = ({
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();
  const {
    state: { drawingMode, displayedRouteIds, creatingNewRoute, hasRoute },
  } = useContext(MapEditorContext);

  const hasChangesInProgress = useContextStateSelector(
    MapEditorContext,
    hasChangesInProgressSelector,
  );
  const isInViewMode = useContextStateSelector(
    MapEditorContext,
    isInViewModeSelector,
  );
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
        onClick={onDrawRoute}
        disabled={!isInViewMode || creatingNewRoute}
        inverted={drawingMode !== Mode.Draw}
      >
        {t('map.drawRoute')}
      </SimpleButton>
      <SimpleButton
        onClick={onEditRoute}
        disabled={
          // Don't enable editing when multiple routes are visible since there is no way
          // to select which one of the visible routes to edit
          !(creatingNewRoute || displayedRouteIds?.length === 1)
        }
        inverted={drawingMode !== Mode.Edit}
      >
        {t('map.editRoute')}
      </SimpleButton>
      <SimpleButton
        onClick={onAddStops}
        disabled={drawingMode !== undefined}
        inverted={!isCreateStopModeEnabled}
      >
        {t('map.addStop')}
      </SimpleButton>
      <SimpleButton
        className="!px-3"
        onClick={onDeleteRoute}
        disabled={!hasChangesInProgress}
      >
        <MdDelete aria-label={t('map.deleteRoute')} />
      </SimpleButton>
      <Visible visible={hasChangesInProgress}>
        <SimpleButton
          className="!ml-auto"
          onClick={onCancel}
          disabled={!hasChangesInProgress}
          inverted
        >
          {t('cancel')}
        </SimpleButton>
        <SimpleButton
          onClick={onSave}
          disabled={!(hasChangesInProgress && hasRoute)}
        >
          {t('routes.save')}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
