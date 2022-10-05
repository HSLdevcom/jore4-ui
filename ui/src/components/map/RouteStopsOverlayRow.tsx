import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../hooks';
import { setStopOnRouteAction } from '../../redux';
import { RouteStop } from '../../redux/types';
import { AlignDirection, SimpleDropdownMenu } from '../../uiComponents';
import { PriorityBadge } from './PriorityBadge';

interface Props {
  routeStop: RouteStop;
  isReadOnly?: boolean;
}

const testIds = {
  row: (label: string) => `RouteStopsOverlayRow::${label}`,
  menuButton: (label: string) => `RouteStopsOverlayRow::${label}::menu`,
  addToJourneyPatternButton: (label: string) =>
    `RouteStopsOverlayRow::${label}::menu::addToJourneyPatternButton`,
};

export const RouteStopsOverlayRow = ({
  routeStop: { belongsToJourneyPattern, stop },
  isReadOnly,
}: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setOnRoute = (onRoute: boolean) => {
    dispatch(
      setStopOnRouteAction({
        stopLabel: stop.label,
        belongsToJourneyPattern: onRoute,
      }),
    );
  };

  return (
    <div
      className="flex h-10 items-center justify-between border-b p-2"
      data-testid={testIds.row(stop.label)}
    >
      <div className="flex items-center">
        <div className="w-10">
          <PriorityBadge
            priority={stop.priority}
            validityStart={stop.validity_start}
            validityEnd={stop.validity_end}
          />
        </div>
        <span
          className={`text-sm font-bold ${
            belongsToJourneyPattern ? 'text-black' : 'text-gray-300'
          }`}
        >
          {stop.label}
        </span>
      </div>
      {!isReadOnly && (
        <div className="text-tweaked-brand">
          <SimpleDropdownMenu
            alignItems={AlignDirection.Left}
            testId={testIds.menuButton(stop.label)}
          >
            <button
              type="button"
              onClick={() => setOnRoute(!belongsToJourneyPattern)}
              data-testid={testIds.addToJourneyPatternButton(stop.label)}
            >
              {belongsToJourneyPattern
                ? t('stops.removeFromRoute')
                : t('stops.addToRoute')}
            </button>
          </SimpleDropdownMenu>
        </div>
      )}
    </div>
  );
};
