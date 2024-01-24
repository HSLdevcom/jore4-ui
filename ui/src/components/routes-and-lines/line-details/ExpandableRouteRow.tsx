import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import {
  RouteAllFieldsFragment,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { useAlertsAndHighLights, useShowRoutesOnModal } from '../../../hooks';
import { mapDirectionToShortUiName } from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import {
  MAX_DATE,
  MIN_DATE,
  mapToShortDate,
  mapToShortDateTime,
} from '../../../time';
import {
  AccordionButton,
  EditButton,
  LocatorButton,
} from '../../../uiComponents';
import { AlertPopover } from '../../common/AlertPopover';
import { RouteLabel } from '../../common/RouteLabel';
import { DirectionBadge } from './DirectionBadge';

const testIds = {
  container: (routeLabel: string) => `ExpandableRouteRow::${routeLabel}`,
  label: 'ExpandableRouteRow::label',
  name: 'ExpandableRouteRow::name',
  validityPeriod: 'ExpandableRouteRow::validityPeriod',
  lastEdited: 'ExpandableRouteRow::lastEdited',
  showRouteButton: 'ExpandableRouteRow::showRouteButton',
  toggleAccordion: 'ExpandableRouteRow::toggleAccordion',
  editRouteButton: (routeName?: string) =>
    `ExpandableRouteRow::editRouteButton::${routeName}`,
};

interface Props {
  className?: string;
  route: RouteAllFieldsFragment;
  observationDate: DateTime;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ExpandableRouteRow = ({
  className = '',
  route,
  observationDate,
  isExpanded,
  onToggle,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { showRouteOnMap } = useShowRoutesOnModal();

  const { getAlertStatus, getAlertStyle } = useAlertsAndHighLights();
  const alertStatus = getAlertStatus(route);
  const alertStyle = getAlertStyle(alertStatus.alertLevel);

  const onClickShowRouteOnMap = () => {
    showRouteOnMap(route);
  };
  const { label } = route;
  const directionNumber = mapDirectionToShortUiName(route.direction);
  return (
    <tr
      className={`border border-white bg-background ${className} p-4`}
      data-testid={testIds.container(label)}
    >
      <td className={`${alertStyle.listItemBorder || ''} p-4 pl-12`}>
        <Row className="items-center">
          <DirectionBadge
            direction={route.direction as RouteDirectionEnum}
            className="mr-4"
            titleName={t(`directionEnum.${route.direction}`)}
          />
          <span className="text-xl" data-testid={testIds.label}>
            <RouteLabel label={label} variant={route.variant} />
          </span>
        </Row>
      </td>
      <td className="py-4">
        <Row className="items-center">
          <span className="text-xl" data-testid={testIds.name}>
            {parseI18nField(route.name_i18n)}
          </span>
          <EditButton
            href={routeDetails[Path.editRoute].getLink(
              route.route_id,
              observationDate.toISODate(),
            )}
            testId={testIds.editRouteButton(parseI18nField(route.name_i18n))}
          />
        </Row>
      </td>
      <td className="p-4" data-testid={testIds.validityPeriod}>
        <Row className="items-center justify-end">
          {t('validity.validDuring', {
            startDate: mapToShortDate(route.validity_start || MIN_DATE),
            endDate: mapToShortDate(route.validity_end || MAX_DATE),
          })}
          <AlertPopover
            title={t(alertStatus.title, {
              type: t('routes.route'),
            })}
            description={t(alertStatus.description)}
            alertIcon={alertStyle.icon}
          />
        </Row>
      </td>
      <td className="p-4">
        <Row className="items-center justify-end">
          <span data-testid={testIds.lastEdited}>
            !{mapToShortDateTime(DateTime.now())}
          </span>
          <MdHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td className="w-20 border-l-4 border-r-4 border-white px-6 text-center">
        <LocatorButton
          onClick={onClickShowRouteOnMap}
          disabled={
            !route.route_shape /* some routes imported from jore3 are missing the geometry */
          }
          testId={testIds.showRouteButton}
          tooltipText={t('accessibility:routes.showOnMapDirection', {
            label,
            directionNumber,
          })}
        />
      </td>
      <td className="w-20">
        <AccordionButton
          className="h-full w-full"
          iconClassName="text-3xl"
          isOpen={isExpanded}
          onToggle={onToggle}
          testId={testIds.toggleAccordion}
        />
      </td>
    </tr>
  );
};
