import React, { FunctionComponent } from 'react';
import { useSubscribeAllPointsSubscription } from '../../generated/graphql';
import { Spinner } from '../Spinner';

export const ExampleMarkers: FunctionComponent = () => {
  const { loading, error, data } = useSubscribeAllPointsSubscription();

  if (error) {
    return <p>Cannot fetch content. Is hasura running in port 8080?</p>;
  }
  return (
    <pre>
      <Spinner showSpinner={loading} />
      {JSON.stringify(data?.playground_points, null, 2)}
    </pre>
  );
};
