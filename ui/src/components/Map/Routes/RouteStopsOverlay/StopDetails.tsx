import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { RouteStopFieldsFragment } from '../../../../generated/graphql';
import { PriorityBadge } from '../../PriorityBadge';

const testIds = {
  rowLabel: (label: string) => `RouteStopsOverlayRow::label::${label}`,
};

type StopDetailsProps = {
  readonly belongsToJourneyPattern: boolean;
  readonly stop: RouteStopFieldsFragment;
};

export const StopDetails: FC<StopDetailsProps> = ({
  belongsToJourneyPattern,
  stop,
}) => {
  return (
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
        className={twMerge(
          'text-sm',
          belongsToJourneyPattern ? 'text-black' : 'text-gray-300',
        )}
      >
        <span className="font-bold">{stop.label}</span>{' '}
        {stop.stop_place?.at(0)?.name?.value ?? '-'}
      </span>
    </div>
  );
};
