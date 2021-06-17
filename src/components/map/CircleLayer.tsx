import React from 'react';
import { Marker } from 'react-leaflet';
import { useSubscribeAllPointsSubscription } from '../../generated/graphql';

export const CircleLayer: React.FC = () => {
  const { data } = useSubscribeAllPointsSubscription();

  return (
    <>
      {data?.playground_points.map(
        // eslint-disable-next-line camelcase
        ({ point_id, point_geog: { coordinates } }) => (
          // eslint-disable-next-line camelcase
          <Marker key={point_id} position={coordinates} />
        ),
      )}
    </>
  );
};
