import { DateTime } from 'luxon';
import qs from 'qs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdOutlineHistory, MdPinDrop } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { RouteRoute } from '../../generated/graphql';
import { Row } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';

interface Props {
  className?: string;
  route: RouteRoute;
  isOpen: boolean;
  onToggle: () => void;
}

export const RouteStopsHeaderRow = ({
  className,
  route,
  isOpen,
  onToggle,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const mapUrl = routes[Path.map].getLink();
  const openInMapUrl = `${mapUrl}?${qs.stringify({
    routeId: route.route_id,
  })}`;
  return (
    <tr className={`border border-white bg-background ${className}`}>
      <td className="border-l-8 py-4 pl-16 pr-4 text-3xl font-bold">
        {route.label}
      </td>
      <td className="text-3xl">{route.description_i18n}</td>
      <td>
        {t('validity.validDuring', {
          startDate: mapToShortDate(route.validity_start || MIN_DATE),
          endDate: mapToShortDate(route.validity_end || MAX_DATE),
        })}
      </td>
      <td>
        <Row className="items-center">
          !{mapToShortDateTime(DateTime.now())}
          <MdOutlineHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td className="w-20 border-l-4 border-r-4 border-white">
        <Link to={openInMapUrl} className="flex justify-center py-3">
          <MdPinDrop className="text-center text-5xl text-tweaked-brand" />
        </Link>
      </td>
      <td className="w-20">
        <button
          type="button"
          className="h-full w-full text-center"
          onClick={onToggle}
          data-testid="RouteStopsHeaderRow::toggleAccordion"
        >
          {isOpen ? (
            <FaChevronUp className="inline text-center text-3xl text-tweaked-brand" />
          ) : (
            <FaChevronDown className="inline text-center text-3xl text-tweaked-brand" />
          )}
        </button>
      </td>
    </tr>
  );
};
