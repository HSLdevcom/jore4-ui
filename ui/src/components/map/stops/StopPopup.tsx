import { DateTime } from 'luxon';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl';
import { StopWithLocation } from '../../../graphql';
import { Column, Row } from '../../../layoutComponents';
import { mapToShortDate } from '../../../time';
import { Priority } from '../../../types/Priority';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { mapLngLatToPoint } from '../../../utils';

interface Props {
  stop: StopWithLocation;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
  onDelete: () => void;
}

const mapToValidityPeriod = (
  t: TFunction,
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) => {
  return `${mapToShortDate(validityStart)} -  ${
    mapToShortDate(validityEnd) || t('saveChangesModal.indefinite')
  }`;
};

const mapPriorityToPresentation = (
  t: TFunction,
  priority: Priority = Priority.Standard,
) => {
  const presentations: Record<Priority, JSX.Element | null> = {
    [Priority.Standard]: null,
    [Priority.Temporary]: (
      <i className="icon-temporary mr-1.5 text-lg text-city-bicycle-yellow" />
    ),
    [Priority.Draft]: (
      <span className="font-bold">{t('priority.draft')} | </span>
    ),
  };
  return presentations[priority];
};

export const StopPopup = ({
  stop,
  onEdit,
  onMove,
  onClose,
  onDelete,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  // eslint-disable-next-line camelcase
  const { label, priority, validity_start, validity_end } = stop;
  const location = mapLngLatToPoint(stop.measured_location.coordinates);
  return (
    <Popup
      className="w-80"
      tipSize={10}
      offsetLeft={5}
      offsetTop={25}
      anchor="top"
      longitude={location.longitude}
      latitude={location.latitude}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row>
              <h3 className="text-xl font-bold">
                {t('stops.stopWithLabel', { stopLabel: label })}
              </h3>
              <CloseIconButton className="ml-auto" onClick={onClose} />
            </Row>
          </Column>
        </Row>
        <Row>
          <span className="text-sm">
            {mapPriorityToPresentation(t, priority)}
            {mapToValidityPeriod(t, validity_start, validity_end)}
          </span>
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
