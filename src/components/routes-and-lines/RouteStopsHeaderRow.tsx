import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { MdOutlineHistory, MdPinDrop } from 'react-icons/md';
import { RouteDirectionEnum, RouteRoute } from '../../generated/graphql';
import { useShowRoutesOnModal } from '../../hooks';
import { Row } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../time';
import { EditButton, IconButton } from '../../uiComponents';
import { DirectionBadge } from './DirectionBadge';

interface Props {
  className?: string;
  route: RouteRoute;
  showStops: boolean;
  onToggleShowStops: () => void;
  onToggleDirection?: () => void;
}

export const RouteStopsHeaderRow = ({
  className,
  route,
  showStops,
  onToggleShowStops,
  onToggleDirection,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRoutesOnModal } = useShowRoutesOnModal();

  return (
    <tr className={`border border-white bg-background ${className}`}>
      <td className="border-l-8 py-4 pl-16 pr-4 text-3xl font-bold">
        <Row className="items-center">
          <DirectionBadge
            direction={route.direction as RouteDirectionEnum}
            onToggle={onToggleDirection}
          />
          {route.label}
        </Row>
      </td>
      <td className="flex items-center py-4 text-3xl">
        {route.description_i18n}
        <EditButton href={routes[Path.editRoute].getLink(route.route_id)} />
      </td>
      <td className="pr-16 text-right">
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
        <IconButton
          className="h-full w-full"
          onClick={() =>
            showRoutesOnModal(
              [route.route_id],
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              route.validity_start!,
              route.validity_end,
            )
          }
          icon={<MdPinDrop className="text-5xl text-tweaked-brand" />}
          testId="RouteStopsHeaderRow::showRoute"
        />
      </td>
      <td className="w-20">
        <button
          type="button"
          className="h-full w-full text-center"
          onClick={onToggleShowStops}
          data-testid="RouteStopsHeaderRow::toggleAccordion"
        >
          {showStops ? (
            <FaChevronUp className="inline text-center text-3xl text-tweaked-brand" />
          ) : (
            <FaChevronDown className="inline text-center text-3xl text-tweaked-brand" />
          )}
        </button>
      </td>
    </tr>
  );
};
