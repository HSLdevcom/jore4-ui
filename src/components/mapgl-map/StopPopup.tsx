import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl';
import { Row } from '../../layoutComponents';
import { Point } from '../../types';
import { Button } from '../../uiComponents';

interface Props extends Point {
  onClose: () => void;
  onDelete: () => void;
}

export const StopPopup = ({
  latitude,
  longitude,
  onClose,
  onDelete,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Popup
      className="w-60"
      tipSize={10}
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      onClose={onClose}
    >
      <Row>
        <Button className="!px-2" onClick={onDelete} inverted>
          <MdDelete aria-label={t('map.deleteRoute')} className="text-xl" />
        </Button>
      </Row>
    </Popup>
  );
};
