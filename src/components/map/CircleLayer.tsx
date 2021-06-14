import React from 'react';
import { CircleMarker } from 'react-leaflet';
import { useSubscribeAllPointsSubscription } from '../../generated/graphql';

export const CircleLayer: React.FC = () => {
  const { data } = useSubscribeAllPointsSubscription();

  return (
    <>
      {data?.playground_points.map(
        // eslint-disable-next-line camelcase
        ({ point_id, point_geog: { coordinates } }) => (
          // eslint-disable-next-line camelcase
          <CircleMarker key={point_id} center={coordinates} radius={20} />
        ),
      )}
    </>
  );
};
