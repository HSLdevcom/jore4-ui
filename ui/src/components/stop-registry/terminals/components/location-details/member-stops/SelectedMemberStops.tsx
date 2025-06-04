import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdOutlineClear } from 'react-icons/md';
import { SelectedStop } from '../location-details-form/schema';

const testIds = {
  option: 'SelectedMemberStops::option',
};

type SelectedMemberStopsProps = {
  readonly selected: ReadonlyArray<SelectedStop>;
};
export const SelectedMemberStops: FC<SelectedMemberStopsProps> = ({
  selected,
}) => {
  if (selected.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 border-b border-grey bg-background p-2">
      {selected.map((stop) => (
        <HUICombobox.Option
          as="div"
          key={stop.quayId}
          value={stop}
          className="flex cursor-pointer flex-row items-center rounded-md bg-brand px-2 py-1 font-bold text-white ui-active:bg-brand-darker"
          title={`${stop.publicCode}`}
          data-testid={testIds.option}
        >
          {stop.publicCode}
          <MdOutlineClear className="ml-1 text-xl" />
        </HUICombobox.Option>
      ))}
    </div>
  );
};
