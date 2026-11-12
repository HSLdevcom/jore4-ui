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
import {
  getRouteLabelVariantText,
  isCurrentEntity,
  mapToValidityPeriod,
} from '../../../../utils';
import { mapDirectionToLabel } from '../../../../utils/i18n';
import { Switch } from '../../../common/Jore';
import { DirectionBadge, RouteLabel } from '../../../LinesAndRoutes/Common';
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

type LineRouteButtonProps = {
  readonly route: DisplayedRouteFragment;
  readonly isSelected: boolean;
  readonly isValidOnObservationDate: boolean;
  readonly onToggleSelected: () => void;
};

const LineRouteButton: FC<LineRouteButtonProps> = ({
  route,
  isSelected,
  isValidOnObservationDate,
  onToggleSelected,
}) => {
  const { t } = useTranslation();
  const routeName = route.name_i18n.fi_FI;

  return (
    <button
      type="button"
      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-left"
      onClick={onToggleSelected}
      aria-expanded={isSelected}
    >
      <DirectionBadge
        direction={route.direction}
        vehicleMode={route.route_line.primary_vehicle_mode}
        lineType={route.route_line.type_of_line}
        className={twJoin(
          'h-6 w-6 rounded-xs text-base',
          !isValidOnObservationDate && 'bg-light-grey',
        )}
      />

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
            className={isValidOnObservationDate ? 'text-black' : 'text-grey'}
          >
            {routeName}
          </span>
        </span>
        <span className="text-xs text-grey">
          {mapToValidityPeriod(t, route.validity_start, route.validity_end)}
        </span>
      </span>
    </button>
  );
};

export const LineRouteRow: FC<LineRouteRowProps> = ({ route, isVisible }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const observationDate = useMapObservationDate();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const isSelected = selectedRouteId === route.route_id;
  const isValidOnObservationDate = isCurrentEntity(observationDate, route);
  const routeLabelWithVariant = getRouteLabelVariantText(route);

  return (
    <div>
      <div
        className={twJoin(
          'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b p-2',
          isValidOnObservationDate ? 'bg-white' : 'bg-background',
        )}
        data-testid={testIds.row(route.label, route.direction)}
      >
        <LineRouteButton
          route={route}
          isSelected={isSelected}
          isValidOnObservationDate={isValidOnObservationDate}
          onToggleSelected={() =>
            dispatch(
              setSelectedRouteIdAction(isSelected ? undefined : route.route_id),
            )
          }
        />
        <Switch
          checked={isVisible}
          onChange={() => dispatch(toggleRouteVisibilityAction(route.route_id))}
          testId={testIds.visibilitySwitch(route.label, route.direction)}
          ariaLabel={t(($) => $.accessibility.map.toggleRouteVisibility, {
            routeLabel: routeLabelWithVariant,
            direction: mapDirectionToLabel(t, route.direction),
          })}
        />
      </div>

      {isSelected && isVisible && <LineRouteStops routeId={route.route_id} />}
    </div>
  );
};
