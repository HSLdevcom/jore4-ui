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
    state: { hasRoute, drawingMode },
  } = useContext(MapEditorContext);
  return (
    <Row className="px-10 py-5 bg-white space-x-4">
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
      <Visible visible={hasRoute}>
        <SimpleButton
          className="!ml-auto"
          onClick={onCancel}
          disabled={!hasRoute}
          inverted
        >
          {t('cancel')}
        </SimpleButton>
        <SimpleButton onClick={onSave} disabled={!hasRoute}>
          {t('routes.save')}
        </SimpleButton>
      </Visible>
    </Row>
  );
};
