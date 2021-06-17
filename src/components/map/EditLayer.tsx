import { LeafletMouseEvent } from 'leaflet';
import React from 'react';
import { useMapEvent } from 'react-leaflet';
import { useInsertPointMutation } from '../../generated/graphql';
import { mapInsertPointInput } from '../../graphql/mappings';

export const EditLayer: React.FC = () => {
  const [insertPoint] = useInsertPointMutation();
  useMapEvent('click', (event: LeafletMouseEvent) => {
    insertPoint(mapInsertPointInput(event.latlng.lat, event.latlng.lng));
  });
  return null;
};
