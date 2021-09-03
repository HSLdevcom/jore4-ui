import qs from 'qs';
import React from 'react';
import { Link } from 'react-router-dom';
import { Column } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  route: {
    name: string;
    id: string;
  };
}

export const RoutesTableRow = ({ className, route }: Props): JSX.Element => {
  const mapUrl = routes[Path.mapgl].getLink();
  const openInMapUrl = `${mapUrl}?${qs.stringify({
    routeId: route.id,
  })}`;
  return (
    <tr className={`border border-l-8 ${className}`}>
      <td className="pl-16 py-4 font-bold">
        <Column>
          <p className="text-4xl">{route.name}</p>
          <p className="text-lg">Jostain - Johonkin</p>
        </Column>
      </td>
      <td>
        <Column>
          <p className="text-lg font-bold">Voimassa dd.mm.yyyy - dd.mm.yyyy</p>
          <p className="text-lg">
            Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija
          </p>
        </Column>
      </td>
      <td className="text-center border">
        <Link to={openInMapUrl} className="p-2">
          <i className="icon-location text-tweaked-brand text-4xl" />
        </Link>
      </td>
    </tr>
  );
};
