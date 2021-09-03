import React from 'react';
import { ExampleRoute, routes } from '../data';
import { RoutesTableRow } from './RoutesTableRow'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
}

export const RoutesTable = ({ className }: Props): JSX.Element => {
  return (
    <table className={`w-full ${className}`}>
      <tbody>
        {Object.values(routes).map((item: ExampleRoute) => (
          <RoutesTableRow key={item.id} route={item} />
        ))}
      </tbody>
    </table>
  );
};
