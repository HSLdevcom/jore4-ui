import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks';
import {
  excludeStopFromJourneyPatternAction,
  includeStopToJourneyPatternAction,
} from '../../../redux';
import {
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../uiComponents';
import { PriorityBadge } from '../PriorityBadge';

type RouteStopsOverlayRowProps = {
  readonly belongsToJourneyPattern: boolean;
  readonly stop: RouteStopFieldsFragment;
  readonly isReadOnly?: boolean;
};

const testIds = {
  row: 'RouteStopsOverlayRow',
  rowLabel: (label: string) => `RouteStopsOverlayRow::label::${label}`,
  menuButton: 'RouteStopsOverlayRow::menu',
  toggleStopInJourneyPatternButton:
    'RouteStopsOverlayRow::menu::toggleStopInJourneyPatternButton',
};

export const RouteStopsOverlayRow: FC<RouteStopsOverlayRowProps> = ({
  belongsToJourneyPattern,
  stop,
  isReadOnly,
}) => {
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
          className={`text-sm ${
            belongsToJourneyPattern ? 'text-black' : 'text-gray-300'
          }`}
        >
          <span className="font-bold">{stop.label}</span>{' '}
          {stop.stop_place?.at(0)?.name?.value ?? '-'}
        </span>
      </div>
      {!isReadOnly && (
        <div className="text-tweaked-brand">
          <SimpleDropdownMenu
            testId={testIds.menuButton}
            tooltip={t('accessibility:map.routeStopsOverlayRowActions', {
              stopLabel: stop.label,
            })}
          >
            <SimpleDropdownMenuItem
              onClick={() =>
                setBelongsToJourneyPattern(!belongsToJourneyPattern)
              }
              testId={testIds.toggleStopInJourneyPatternButton}
            >
              {belongsToJourneyPattern
                ? t('stops.removeFromRoute')
                : t('stops.addToRoute')}
            </SimpleDropdownMenuItem>
          </SimpleDropdownMenu>
        </div>
      )}
    </div>
  );
};
