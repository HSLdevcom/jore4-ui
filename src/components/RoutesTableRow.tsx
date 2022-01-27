import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdPinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { RouteRoute } from '../generated/graphql';
import { Column, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { mapToShortDate } from '../time';

interface Props {
  className?: string;
  route: Partial<RouteRoute>;
}

export const RoutesTableRow = ({ className, route }: Props): JSX.Element => {
  const { t } = useTranslation();
  const mapUrl = routes[Path.map].getLink();
  const openInMapUrl = `${mapUrl}?${qs.stringify({
    routeId: route.route_id,
  })}`;
  return (
    <tr className={`border ${className}`}>
      <td className="border-l-8 border-hsl-dark-green py-4 pl-16 pr-4 font-bold">
        <Link to={routes[Path.lineDetails].getLink(route.on_line_id)}>
          <Row>
            <Column className="w-1/2">
              <p className="text-3xl">{route.label}</p>
              <p className="text-lg">
                {route.starts_from_scheduled_stop_point?.label}
                {' - '}
                {route.ends_at_scheduled_stop_point?.label}
              </p>
            </Column>
            <Column className="w-1/2 text-right">
              <p className="text-lg font-bold">
                {t('validity.validDuring', {
                  startDate: mapToShortDate(route.validity_start),
                  endDate: mapToShortDate(route.validity_end),
                })}
              </p>
              <p className="text-lg">
                !Muokattu dd.mm.yyyy hh:mm | S. Suunnittelija
              </p>
            </Column>
          </Row>
        </Link>
      </td>
      <td className="border">
        <Link to={openInMapUrl} className="flex justify-center py-3">
          <MdPinDrop className="text-center text-5xl text-tweaked-brand" />
        </Link>
      </td>
    </tr>
  );
};
