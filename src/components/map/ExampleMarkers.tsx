import dynamic from 'next/dynamic';
import React from 'react';
import { Props as MapProps } from './Map';

export const ExampleMarkers: React.FC = () => {
  const Map = dynamic<MapProps>(() => import('./Map').then((mod) => mod.Map), {
    ssr: false,
  });

  return <Map />;
};
