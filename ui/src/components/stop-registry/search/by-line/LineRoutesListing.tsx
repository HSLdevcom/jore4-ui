import React, { FC, useDeferredValue } from 'react';
import { RouteStopsTable } from './RouteStopsTable';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';

type LineRoutesListingProps = {
  readonly line: FindStopByLineInfo;
};

export const LineRoutesListing: FC<LineRoutesListingProps> = ({ line }) => {
  // Rendering all the routes into tables is a slow process.
  // Show a spinner while React is doing the rendering.
  const lineTransitionInProgress = line !== useDeferredValue(line);

  return (
    <>
      {line.line_routes.map((route) => (
        <RouteStopsTable
          className="mt-6"
          key={route.route_id}
          lineTransitionInProgress={lineTransitionInProgress}
          route={route}
        />
      ))}
    </>
  );
};