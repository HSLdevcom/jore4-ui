import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  mapDirectionToLabel,
  mapDirectionToSymbol,
} from '../../../../i18n/uiNameMappings';
import { Row } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { LocatorButton } from '../../../../uiComponents';
import { useShowRoutesOnModal } from '../../../common/hooks';
import { FindStopByLineRouteInfo } from './useFindLinesByStopSearch';

const testIds = {
  container: (id: UUID) => `StopSearchByLine::route::infoContainer::${id}`,
  label: 'StopSearchByLine::route::label',
  direction: 'StopSearchByLine::route::direction',
  name: 'StopSearchByLine::route::name',
  validity: 'StopSearchByLine::route::validity',
  locatorButton: 'StopSearchByLine::route::locatorButton',
};

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
            title={mapDirectionToLabel(t, route.direction)}
          >
            {mapDirectionToSymbol(t, route.direction)}
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
