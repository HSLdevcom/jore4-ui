import { LeafletMouseEvent } from 'leaflet';
import React from 'react';
import { useMapEvent } from 'react-leaflet';
import { useInsertPointMutation } from '../../generated/graphql';

export const EditLayer: React.FC = () => {
  const [insertPoint] = useInsertPointMutation();
  useMapEvent('click', (event: LeafletMouseEvent) => {
    const geojson = {
      type: 'Point',
      coordinates: [event.latlng.lat, event.latlng.lng],
    };
    insertPoint({ variables: { geojson } });
  });
  return null;
};
