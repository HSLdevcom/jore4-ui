import { DateTime } from 'luxon';
import { FC, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import {
  RouteAllFieldsFragment,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { useAlertsAndHighLights, useShowRoutesOnModal } from '../../../hooks';
import { mapDirectionToSymbol } from '../../../i18n/uiNameMappings';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
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
  container: (routeLabel: string, direction: RouteDirectionEnum) =>
    `RouteRow::${routeLabel}-${direction}`,
  label: 'RouteRow::label',
  name: 'RouteRow::name',
  validityPeriod: 'RouteRow::validityPeriod',
  lastEdited: 'RouteRow::lastEdited',
  showRouteButton: 'RouteRow::showRouteButton',
  toggleAccordion: 'RouteRow::toggleAccordion',
  editRouteButton: 'RouteRow::editRouteButton',
};

type RouteRowProps = {
  readonly directionAndLabelId: string;
  readonly className?: string;
  readonly route: RouteAllFieldsFragment;
  readonly observationDate: DateTime;
  readonly isExpanded: boolean;
  readonly isLast: boolean;
  readonly onToggle: () => void;
  readonly controls: string;
};

export const RouteRow: FC<PropsWithChildren<RouteRowProps>> = ({
  directionAndLabelId,
  className = '',
  route,
  observationDate,
  isExpanded,
  isLast,
  onToggle,
  controls,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const { showRouteOnMap } = useShowRoutesOnModal();

  const { getAlertStatus, getAlertStyle } = useAlertsAndHighLights();
  const alertStatus = getAlertStatus(route);
  const alertStyle = getAlertStyle(alertStatus.alertLevel);

  const onClickShowRouteOnMap = () => {
    showRouteOnMap(route);
  };
  const { label } = route;
  const directionNumber = mapDirectionToSymbol(t, route.direction);

  // alertStyle left border is different colour than what we want the bottom border to be
  // and to achieve the correct visual design for the borders, we need to add it with pseudo classes
  const pseudoBottomBorderClassName = !isLast
    ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b-2 after:border-white'
    : '';

  return (
    <div
      className={`relative grid min-h-16 items-center bg-background align-middle sm:grid-cols-12 md:grid-cols-24 ${pseudoBottomBorderClassName} ${alertStyle.listItemBorder ?? ''} ${className}`}
      data-testid={testIds.container(label, route.direction)}
    >
      <div
        id={directionAndLabelId}
        className="col-span-3 flex h-full items-center justify-evenly"
      >
        <DirectionBadge direction={route.direction as RouteDirectionEnum} />
        {/* Route label max is 6 characters including space and the variant */}
        <span className="w-[6ch] text-xl" data-testid={testIds.label}>
          <RouteLabel label={label} variant={route.variant} />
        </span>
      </div>
      <span className="col-span-8 text-xl" data-testid={testIds.name}>
        {getLocalizedTextFromDbBlob(route.name_i18n)}
      </span>
      <EditButton
        href={routeDetails[Path.editRoute].getLink(
          route.route_id,
          observationDate.toISODate(),
        )}
        testId={testIds.editRouteButton}
        tooltip={t('accessibility:routes.editRouteDirection', {
          label,
          directionNumber,
        })}
        className="ml-0"
      />
      <span
        data-testid={testIds.validityPeriod}
        className="col-span-4 text-center md:text-sm lg:text-base"
      >
        {t('validity.validDuring', {
          startDate: mapToShortDate(route.validity_start ?? MIN_DATE),
          endDate: mapToShortDate(route.validity_end ?? MAX_DATE),
        })}
      </span>
      <div className="flex justify-center">
        <AlertPopover
          title={t(alertStatus.title, {
            type: t('routes.route'),
          })}
          description={t(alertStatus.description)}
          alertIcon={alertStyle.icon}
        />
      </div>
      <span className="col-span-4 text-center" data-testid={testIds.lastEdited}>
        !{mapToShortDateTime(DateTime.now())}
        <MdHistory className="aria-hidden ml-1 inline text-xl text-tweaked-brand" />
      </span>
      <div className="col-span-2 flex h-full items-center justify-center border-l-4 border-white">
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
      </div>
      <AccordionButton
        className="h-full border-l-4 border-white"
        iconClassName="text-3xl"
        isOpen={isExpanded}
        onToggle={onToggle}
        testId={testIds.toggleAccordion}
        openTooltip={t('accessibility:routes.expandStops', {
          label,
          directionNumber,
        })}
        closeTooltip={t('accessibility:routes.closeStops', {
          label,
          directionNumber,
        })}
        controls={controls}
      />
    </div>
  );
};
