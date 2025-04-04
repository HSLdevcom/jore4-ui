import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../generated/graphql';
import { useAppDispatch } from '../../hooks';
import {
  excludeStopFromJourneyPatternAction,
  includeStopToJourneyPatternAction,
} from '../../redux';
import { AlignDirection, SimpleDropdownMenu } from '../../uiComponents';
import { PriorityBadge } from './PriorityBadge';

interface Props {
  belongsToJourneyPattern: boolean;
  stop: RouteStopFieldsFragment;
  isReadOnly?: boolean;
}

const testIds = {
  row: 'RouteStopsOverlayRow',
  rowLabel: (label: string) => `RouteStopsOverlayRow::label::${label}`,
  menuButton: 'RouteStopsOverlayRow::menu',
  toggleStopInJourneyPatternButton:
    'RouteStopsOverlayRow::menu::toggleStopInJourneyPatternButton',
};

export const RouteStopsOverlayRow = ({
  belongsToJourneyPattern,
  stop,
  isReadOnly,
}: Props) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const setBelongsToJourneyPattern = (onRoute: boolean) => {
    const setBelongsToJourneyPatternAction = onRoute
      ? includeStopToJourneyPatternAction
      : excludeStopFromJourneyPatternAction;

    dispatch(setBelongsToJourneyPatternAction(stop.label));
  };

  return (
    <div
      data-testid={testIds.row}
      className="flex h-10 items-center justify-between border-b p-2"
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
          data-testid={testIds.rowLabel(stop.label)}
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
            testId={testIds.menuButton}
            tooltip={t('accessibility:map.routeStopsOverlayRowActions', {
              stopLabel: stop.label,
            })}
          >
            <button
              type="button"
              onClick={() =>
                setBelongsToJourneyPattern(!belongsToJourneyPattern)
              }
              data-testid={testIds.toggleStopInJourneyPatternButton}
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
