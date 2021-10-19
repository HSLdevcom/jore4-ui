import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { MapEditorContext } from '../../context/MapEditorContext';
import { Row } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';
import { Mode } from './DrawRouteLayer';

interface Props {
  drawingMode?: Mode;
  onDrawRoute: () => void;
  onEditRoute: () => void;
  onDeleteRoute: () => void;
  canAddStops: boolean;
  onAddStop: () => void;
}

export const MapFooter: React.FC<Props> = ({
  drawingMode,
  onDrawRoute,
  onEditRoute,
  onDeleteRoute,
  canAddStops,
  onAddStop,
}) => {
  const { t } = useTranslation();
  const { hasRoute } = useContext(MapEditorContext);
  return (
    <Row className="px-10 py-11 bg-white space-x-4">
      <SimpleButton
        onClick={onDrawRoute}
        disabled={hasRoute}
        inverted={drawingMode !== Mode.Draw}
      >
        {t('map.drawRoute')}
      </SimpleButton>
      <SimpleButton
        onClick={onEditRoute}
        disabled={!hasRoute}
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
        disabled={!hasRoute}
      >
        <MdDelete aria-label={t('map.deleteRoute')} />
      </SimpleButton>
    </Row>
  );
};
