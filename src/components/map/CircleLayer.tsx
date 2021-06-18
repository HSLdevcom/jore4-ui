import { LatLng } from 'leaflet';
import React from 'react';
import {
  useDeletePointMutation,
  useSubscribeAllPointsSubscription,
  useUpdatePointMutation,
} from '../../generated/graphql';
import {
  mapLatLngToPointMutation,
  mapToDeletePoint,
} from '../../graphql/mappings';
import { DeletableMarker } from './DeletableMarker';

export const CircleLayer: React.FC = () => {
  const { data } = useSubscribeAllPointsSubscription();
  const [deletePointMutation] = useDeletePointMutation();
  const [updatePointMutation] = useUpdatePointMutation();

  // eslint-disable-next-line camelcase
  const updatePointById = (point_id: string, latlng: LatLng) => {
    updatePointMutation(mapLatLngToPointMutation(point_id, latlng));
  };
  // eslint-disable-next-line camelcase
  const deletePointById = (point_id: string) => {
    deletePointMutation(mapToDeletePoint(point_id));
  };

  return (
    <>
      {data?.playground_points.map(
        // eslint-disable-next-line camelcase
        ({ point_id, point_geog: { coordinates } }) => (
          <DeletableMarker
            // eslint-disable-next-line camelcase
            key={point_id}
            position={coordinates}
            onUpdate={(latlng) => updatePointById(point_id, latlng)}
            onDelete={() => deletePointById(point_id)}
          />
        ),
      )}
    </>
  );
};
