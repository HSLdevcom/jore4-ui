import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl';
import { Column, Row } from '../../layoutComponents';
import { Point } from '../../types';
import { SimpleButton } from '../../uiComponents';

interface Props extends Point {
  finnishName?: string;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}

export const StopPopup = ({
  finnishName,
  latitude,
  longitude,
  onEdit,
  onClose,
  onDelete,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <Popup
      className="w-60"
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
              <button className="ml-auto" type="button" onClick={onClose}>
                <i className="icon-close-large ml-4 text-lg" />
              </button>
            </Row>
            <p className="text-sm">{finnishName}</p>
          </Column>
        </Row>
        <Row className="mt-16">
          <SimpleButton className="!px-3" onClick={onDelete} inverted>
            <MdDelete aria-label={t('map.deleteRoute')} className="text-lg" />
          </SimpleButton>
          <SimpleButton className="ml-auto" onClick={onEdit}>
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
