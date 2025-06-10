import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdSearch } from 'react-icons/md';

const testIds = {
  button: 'SelectMemberStopsDropdownButton',
};

export const SelectMemberStopsDropdownButton: FC = () => {
  return (
    <HUICombobox.Button
      data-testid={testIds.button}
      className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
    >
      <MdSearch className="mr-1 text-2xl text-tweaked-brand" />
      <i
        className="icon-arrow text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
        style={{ fontSize: 10 }}
      />
    </HUICombobox.Button>
  );
};
