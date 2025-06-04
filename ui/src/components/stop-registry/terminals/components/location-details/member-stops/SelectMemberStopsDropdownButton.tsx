import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdSearch } from 'react-icons/md';
import { SelectedStop } from '../location-details-form/schema';

const testIds = {
  button: 'SelectMemberStopsDropdownButton',
};

type SelectMemberStopsDropdownButtonProps = {
  readonly selected: ReadonlyArray<SelectedStop>;
};

export const SelectMemberStopsDropdownButton: FC<
  SelectMemberStopsDropdownButtonProps
> = ({ selected }) => {
  const selectedText = selected.map((stop) => stop.publicCode).join(', ');

  return (
    <HUICombobox.Button
      data-testid={testIds.button}
      className="absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-none"
    >
      <span className="hidden ui-not-open:block" title={selectedText}>
        {selectedText}
      </span>

      <MdSearch className="ml-auto mr-1 text-2xl text-tweaked-brand" />
      <i
        className="icon-arrow text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
        style={{ fontSize: 10 }}
      />
    </HUICombobox.Button>
  );
};
