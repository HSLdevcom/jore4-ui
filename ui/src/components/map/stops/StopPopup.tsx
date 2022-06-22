import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl';
import { Column, Row } from '../../../layoutComponents';
import { Point } from '../../../types';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';

interface Props extends Point {
  label?: string;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export const StopPopup = ({
  label,
  latitude,
  longitude,
  onEdit,
  onMove,
  onClose,
  onDelete,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Popup
      className="w-80"
      tipSize={10}
      offsetLeft={5}
      offsetTop={25}
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row>
              <h3 className="text-xl font-bold">Pysäkki</h3>
              <CloseIconButton className="ml-auto" onClick={onClose} />
            </Row>
            <p className="text-sm">{label}</p>
          </Column>
        </Row>
        <Row className="mt-16">
          <SimpleButton className="h-full !px-3" onClick={onDelete} inverted>
            <MdDelete aria-label={t('map.deleteRoute')} className="text-lg" />
          </SimpleButton>
          <SimpleButton containerClassName="ml-auto" onClick={onMove}>
            {t('move')}
          </SimpleButton>
          <SimpleButton containerClassName="ml-2" onClick={onEdit}>
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
