import { LatLng } from 'leaflet';
import React from 'react';
import { MarkerProps, Popup } from 'react-leaflet';
import { SimpleButton } from '../../uiComponents';
import { DraggableMarker } from './DraggableMarker';

interface Props {
  position: MarkerProps['position'];
  onUpdate: (latlng: LatLng) => void;
  onDelete: () => void;
}

export const DeletableMarker = ({
  position,
  onUpdate,
  onDelete,
}: Props): JSX.Element => {
  return (
    <DraggableMarker position={position} onUpdate={onUpdate}>
      <Popup>
        <SimpleButton onClick={onDelete}>Delete</SimpleButton>
      </Popup>
    </DraggableMarker>
  );
};
