import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import {
  DisplayedRouteFragment,
  RouteDirectionEnum,
} from '../../../../generated/graphql';
import {
  selectSelectedRouteId,
  setSelectedRouteIdAction,
  toggleRouteVisibilityAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { isCurrentEntity, mapToValidityPeriod } from '../../../../utils';
import { mapVehicleModeToRouteColor } from '../../../../utils/colors';
import {
  mapDirectionToLabel,
  mapDirectionToSymbol,
} from '../../../../utils/i18n';
import { Switch } from '../../../common/Jore';
import { RouteLabel } from '../../../LinesAndRoutes/Common';
import { useMapObservationDate } from '../../Utils/mapUrlState';
import { LineRouteStops } from './LineRouteStops';

const testIds = {
  row: (label: string, direction: RouteDirectionEnum) =>
    `LineRouteRow::${label}-${direction}`,
  visibilitySwitch: (label: string, direction: RouteDirectionEnum) =>
    `LineRouteRow::visibility::${label}-${direction}`,
};
export const lineRouteRowTestIds = testIds;

type LineRouteRowProps = {
  readonly route: DisplayedRouteFragment;
  readonly isVisible: boolean;
};

export const LineRouteRow: FC<LineRouteRowProps> = ({ route, isVisible }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const observationDate = useMapObservationDate();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const isSelected = selectedRouteId === route.route_id;
  const isValidOnObservationDate = isCurrentEntity(observationDate, route);
  const routeName = route.name_i18n.fi_FI;
  const routeLabelWithVariant = route.variant
    ? `${route.label} ${route.variant}`
    : route.label;

  const onToggleSelected = () => {
    dispatch(setSelectedRouteIdAction(isSelected ? undefined : route.route_id));
  };

  return (
    <div>
      <div
        className={twJoin(
          'flex items-start gap-2 border-b p-2',
          isValidOnObservationDate ? 'bg-white' : 'bg-background',
        )}
        data-testid={testIds.row(route.label, route.direction)}
      >
        <button
          type="button"
          className="flex flex-1 items-start gap-2 text-left"
          onClick={onToggleSelected}
          aria-expanded={isSelected}
        >
          <span
            className={twJoin(
              'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xs font-bold text-white',
              !isValidOnObservationDate && 'bg-light-grey',
            )}
            style={{
              backgroundColor: isValidOnObservationDate
                ? mapVehicleModeToRouteColor(
                    route.route_line.primary_vehicle_mode,
                    route.route_line.type_of_line,
                  )
                : undefined,
            }}
          >
            {mapDirectionToSymbol(t, route.direction)}
          </span>

          <span className="flex flex-col">
            <span className="text-sm">
              <span
                className={twJoin(
                  'font-bold',
                  isValidOnObservationDate ? 'text-tweaked-brand' : 'text-grey',
                )}
              >
                <RouteLabel label={route.label} variant={route.variant} />
              </span>{' '}
              <span
                className={
                  isValidOnObservationDate ? 'text-black' : 'text-grey'
                }
              >
                {routeName}
              </span>
            </span>
            <span className="text-xs text-grey">
              {mapToValidityPeriod(t, route.validity_start, route.validity_end)}
            </span>
          </span>
        </button>

        <Switch
          checked={isVisible}
          onChange={() => dispatch(toggleRouteVisibilityAction(route.route_id))}
          testId={testIds.visibilitySwitch(route.label, route.direction)}
          ariaLabel={t(($) => $.accessibility.map.toggleRouteVisibility, {
            routeLabel: routeLabelWithVariant,
            direction: mapDirectionToLabel(t, route.direction),
          })}
          className="mt-0.5 shrink-0"
        />
      </div>

      {isSelected && <LineRouteStops routeId={route.route_id} />}
    </div>
  );
};
