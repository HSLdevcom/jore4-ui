import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdOutlineClear } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { SelectedStop } from '../location-details-form/schema';

const testIds = {
  option: 'SelectedMemberStops::option',
};

type SelectedMemberStopsProps = {
  readonly selected: ReadonlyArray<SelectedStop>;
  readonly hoveredStopPlaceId?: string;
  readonly onHover?: (stopPlaceId: string | undefined) => void;
};

export const SelectedMemberStops: FC<SelectedMemberStopsProps> = ({
  selected,
  hoveredStopPlaceId,
  onHover,
}) => {
  if (selected.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 border-b border-grey bg-background p-2">
      {selected.map((stop) => {
        const isHovered = hoveredStopPlaceId === stop.stopPlaceId;

        return (
          <HUICombobox.Option
            as="div"
            key={stop.quayId}
            value={stop}
            className={twMerge(
              'flex cursor-pointer flex-row items-center rounded-md px-2 py-1 font-bold text-white transition-colors duration-150',
              isHovered
                ? 'bg-hsl-warning-surface text-hsl-warning-red'
                : 'bg-brand',
            )}
            title={stop.publicCode}
            data-testid={testIds.option}
            onMouseEnter={() => onHover?.(stop.stopPlaceId)}
            onMouseLeave={() => onHover?.(undefined)}
          >
            {stop.publicCode}
            <MdOutlineClear className="ml-1 text-xl" />
          </HUICombobox.Option>
        );
      })}
    </div>
  );
};
