import qs from 'qs';
import React from 'react';
import { MdPinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { RouteRoute } from '../generated/graphql';
import { Column, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  route: Partial<RouteRoute>;
}

export const RoutesTableRow = ({ className, route }: Props): JSX.Element => {
  const mapUrl = routes[Path.map].getLink();
  const openInMapUrl = `${mapUrl}?${qs.stringify({
    routeId: route.route_id,
  })}`;
  return (
    <tr className={`border border-l-8 ${className}`}>
      <td className="pl-16 pr-4 py-4 font-bold">
        <Row>
          <Column className="w-1/2">
            <p className="text-4xl">{route.label}</p>
            <p className="text-lg">
              {route.starts_from_scheduled_stop_point?.label} -{' '}
              {route.ends_at_scheduled_stop_point?.label}
            </p>
          </Column>
          <Column className="w-1/2 text-right">
            <p className="text-lg font-bold">
              Voimassa {route.validity_start} - {route.validity_end}
            </p>
            <p className="text-lg">
              Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija
            </p>
          </Column>
        </Row>
      </td>
      <td className="border">
        <Link to={openInMapUrl} className="flex justify-center py-3">
          <MdPinDrop className="text-center text-tweaked-brand text-5xl" />
        </Link>
      </td>
    </tr>
  );
};
