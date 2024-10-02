import { TFunction } from 'i18next';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { useShowRoutesOnModal } from '../../../../hooks';
import { Row } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { LocatorButton } from '../../../../uiComponents';
import { FindStopByLineRouteInfo } from './useFindLinesByStopSearch';

const testIds = {
  container: (id: UUID) => `StopSearchByLine::route::infoContainer::${id}`,
  label: 'StopSearchByLine::route::label',
  direction: 'StopSearchByLine::route::direction',
  name: 'StopSearchByLine::route::name',
  validity: 'StopSearchByLine::route::validity',
  locatorButton: 'StopSearchByLine::route::locatorButton',
};

function getDirectionSymbol(t: TFunction, direction: RouteDirectionEnum) {
  switch (direction) {
    case RouteDirectionEnum.Inbound:
      return t(`directionEnum.symbol.inbound`);

    case RouteDirectionEnum.Outbound:
      return t(`directionEnum.symbol.outbound`);

    default:
      return '?';
  }
}

function getDirectionLabel(t: TFunction, direction: RouteDirectionEnum) {
  switch (direction) {
    case RouteDirectionEnum.Inbound:
      return t(`directionEnum.label.inbound`);

    case RouteDirectionEnum.Outbound:
      return t(`directionEnum.label.outbound`);

    default:
      return String(direction);
  }
}

type RouteInfoRowProps = {
  readonly className?: string;
  readonly route: FindStopByLineRouteInfo;
};

export const RouteInfoRow: FC<RouteInfoRowProps> = ({ className, route }) => {
  const { t } = useTranslation();

  const { showRouteOnMap } = useShowRoutesOnModal();

  return (
    <div
      className={twMerge(
        'flex items-center border-x border-t border-x-light-grey border-t-light-grey',
        className,
      )}
      data-testid={testIds.container(route.route_id)}
    >
      <div className="px-8 py-3 pr-20">
        <Row className="flex items-center">
          <h2 data-testid={testIds.label}>{route.label}</h2>
          <p
            className="ml-4 h-6 w-6 bg-brand text-center font-bold text-white"
            data-testid={testIds.direction}
            title={getDirectionLabel(t, route.direction)}
          >
            {getDirectionSymbol(t, route.direction)}
          </p>
        </Row>

        <Row testId={testIds.name}>
          {route.name_i18n.fi_FI ?? route.name_i18n.sv_FI}
        </Row>
      </div>

      <div className="flex-grow" />

      <div
        className="whitespace-nowrap px-8 py-3 text-right font-bold"
        data-testid={testIds.validity}
      >
        {t('validity.validDuring', {
          startDate: mapToShortDate(route.validity_start),
          endDate: mapToShortDate(route.validity_end),
        })}
      </div>

      <div className="pr-8">
        <LocatorButton
          onClick={() => showRouteOnMap(route)}
          testId={testIds.locatorButton}
          tooltipText={t('accessibility:common.showOnMap', {
            label: route.label,
          })}
        />
      </div>
    </div>
  );
};
