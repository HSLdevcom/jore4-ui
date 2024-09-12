import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdOutlineClear } from 'react-icons/md';
import { StopAreaFormMember } from '../stopAreaFormSchema';

type SelectedMemberStopsProps = {
  readonly selected: ReadonlyArray<StopAreaFormMember>;
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
          key={stop.id}
          value={stop}
          className="flex cursor-pointer flex-row items-center rounded-md bg-brand px-2 py-1 font-bold text-white ui-active:bg-brand-darker"
          title={`${stop.scheduled_stop_point.label}: ${stop.name.value}`}
        >
          {stop.scheduled_stop_point.label}
          <MdOutlineClear className="ml-1 text-xl" />
        </HUICombobox.Option>
      ))}
    </div>
  );
};
