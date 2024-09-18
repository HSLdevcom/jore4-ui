import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdSearch } from 'react-icons/md';
import { StopAreaFormMember } from '../stopAreaFormSchema';

const testIds = {
  button: 'SelectMemberStopsDropdownButton',
};

type SelectMemberStopsDropdownButtonProps = {
  readonly selected: ReadonlyArray<StopAreaFormMember>;
};

export const SelectMemberStopsDropdownButton: FC<
  SelectMemberStopsDropdownButtonProps
> = ({ selected }) => {
  return (
    <HUICombobox.Button
      data-testid={testIds.button}
      className="absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-none"
    >
      <span className="hidden ui-not-open:block">
        {selected.map((stop, i) => (
          <span
            key={stop.id}
            title={`${stop.scheduled_stop_point.label}: ${stop.name.value}`}
          >
            {stop.scheduled_stop_point.label}
            {i < selected.length - 1 ? ', ' : ''}
          </span>
        ))}
      </span>

      <MdSearch className="ml-auto mr-1 text-2xl text-tweaked-brand" />
      <i
        className="icon-arrow text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
        style={{ fontSize: 10 }}
      />
    </HUICombobox.Button>
  );
};
