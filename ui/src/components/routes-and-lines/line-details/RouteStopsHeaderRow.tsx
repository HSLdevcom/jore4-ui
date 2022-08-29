import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { RouteDirectionEnum, RouteRoute } from '../../../generated/graphql';
import { useAlertsAndHighLights, useShowRoutesOnModal } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../../time';
import { Priority } from '../../../types/Priority';
import {
  AccordionButton,
  EditButton,
  LocatorButton,
} from '../../../uiComponents';
import { DirectionBadge } from './DirectionBadge';

const testIds = {
  label: 'RouteStopsHeaderRow::label',
  name: 'RouteStopsHeaderRow::name',
  validityPeriod: 'RouteStopsHeaderRow::validityPeriod',
  lastEdited: 'RouteStopsHeaderRow::lastEdited',
  showRouteButton: 'RouteStopsHeaderRow::showRouteButton',
  toggleAccordion: 'RouteStopsHeaderRow::toggleAccordion',
};

interface Props {
  className?: string;
  route: RouteRoute;
  isOpen: boolean;
  onToggle: () => void;
}

export const RouteStopsHeaderRow = ({
  className = '',
  route,
  isOpen,
  onToggle,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRouteOnMapByLabel, showRouteOnMapById } = useShowRoutesOnModal();

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(route));

  const onClickShowRouteOnMap = () => {
    // When viewing a draft route, we want to show the specific route instance by id
    if (route.priority === Priority.Draft) {
      showRouteOnMapById(route);
    } else {
      showRouteOnMapByLabel(route);
    }
  };

  return (
    <tr
      className={`border border-white bg-background ${className} p-4`}
      data-testid={`RouteStopsHeaderRow::${route.route_id}`}
    >
      <td className={`${alertStyle.listItemBorder || ''} p-4 pl-12`}>
        <Row className="items-center">
          <DirectionBadge direction={route.direction as RouteDirectionEnum} />
          <span className="text-xl font-bold" data-testid={testIds.label}>
            {route.label}
          </span>
        </Row>
      </td>
      <td className="py-4">
        <Row className="items-center">
          <span className="text-xl" data-testid={testIds.name}>
            {route.name_i18n?.fi_FI}
          </span>
          <EditButton
            href={routeDetails[Path.editRoute].getLink(route.route_id)}
            testId="edit-route-button"
          />
        </Row>
      </td>
      <td className="p-4" data-testid={testIds.validityPeriod}>
        <Row className="items-center justify-end">
          {t('validity.validDuring', {
            startDate: mapToShortDate(route.validity_start || MIN_DATE),
            endDate: mapToShortDate(route.validity_end || MAX_DATE),
          })}
          {alertStyle.icon ? (
            <i className={`${alertStyle.icon} ml-2 text-3xl`} />
          ) : (
            ''
          )}
        </Row>
      </td>
      <td className="p-4">
        <Row className="items-center justify-end">
          <span data-testid={testIds.lastEdited}>
            !{mapToShortDateTime(DateTime.now())}
          </span>
          <MdOutlineHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td className="w-20 border-l-4 border-r-4 border-white text-center">
        <LocatorButton
          onClick={onClickShowRouteOnMap}
          disabled={
            !route.route_shape /* some routes imported from jore3 are missing the geometry */
          }
          testId={testIds.showRouteButton}
        />
      </td>
      <td className="w-20">
        <AccordionButton
          className="h-full w-full"
          iconClassName="text-3xl"
          isOpen={isOpen}
          onToggle={onToggle}
          testId={testIds.toggleAccordion}
        />
      </td>
    </tr>
  );
};
