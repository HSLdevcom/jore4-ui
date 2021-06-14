import dynamic from 'next/dynamic';
import React from 'react';
import { useSubscribeAllPointsSubscription } from '../../generated/graphql';
import { Spinner } from '../Spinner';
import { Props as MapProps } from './Map';

export const ExampleMarkers: React.FC = () => {
  const { loading, error, data } = useSubscribeAllPointsSubscription();

  if (error) {
    return <p>Cannot fetch content. Is hasura running in port 8080?</p>;
  }

  const Map = dynamic<MapProps>(() => import('./Map').then((mod) => mod.Map), {
    ssr: false,
  });

  return (
    <div>
      <Map />
      <pre>
        <Spinner showSpinner={loading} />
        {JSON.stringify(data?.playground_points, null, 2)}
      </pre>
    </div>
  );
};
