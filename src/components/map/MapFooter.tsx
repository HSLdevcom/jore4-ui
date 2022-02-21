import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { Row, Visible } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';

interface Props {
  onDrawRoute: () => void;
  onEditRoute: () => void;
  onDeleteRoute: () => void;
  onCancel: () => void;
  onSave: () => void;
  canAddStops: boolean;
  onAddStop: () => void;
}

export const MapFooter: React.FC<Props> = ({
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  onCancel,
  onSave,
  canAddStops,
  onAddStop,
}) => {
  const { t } = useTranslation();
  const {
    state: { drawingMode, displayedRouteIds, creatingNewRoute, hasRoute },
  } = useContext(MapEditorContext);

  const viewMode = drawingMode === undefined;
  const changesInProgress = creatingNewRoute || !viewMode;

  return (
    <Row className="space-x-4 bg-white px-10 py-5">
      <SimpleButton
        onClick={onDrawRoute}
        disabled={!viewMode || creatingNewRoute}
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
        onClick={onAddStop}
        disabled={drawingMode !== undefined}
        inverted={!canAddStops}
      >
        {t('map.addStop')}
      </SimpleButton>
      <SimpleButton
        className="!px-3"
        onClick={onDeleteRoute}
        disabled={!changesInProgress}
      >
        <MdDelete aria-label={t('map.deleteRoute')} />
      </SimpleButton>
      <Visible visible={changesInProgress}>
        <SimpleButton
          className="!ml-auto"
          onClick={onCancel}
          disabled={!changesInProgress}
          inverted
        >
          {t('cancel')}
        </SimpleButton>
        <SimpleButton
          onClick={onSave}
          disabled={!(changesInProgress && hasRoute)}
        >
          {t('routes.save')}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
