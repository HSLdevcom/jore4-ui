import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import { StopAreaFormMember } from '../stopAreaFormSchema';

type MemberStopOptionsProps = {
  readonly options: ReadonlyArray<StopAreaFormMember>;
};

export const MemberStopOptions: FC<MemberStopOptionsProps> = ({ options }) => {
  return options.map((stop) => (
    <HUICombobox.Option
      as="div"
      key={stop.id}
      value={stop}
      className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
    >
      <span>
        <b>{stop.scheduled_stop_point.label}</b> <span>{stop.name?.value}</span>
      </span>
      <div className="flex-grow" />
      <MdOutlineAddCircle className="text-hsl mx-1 text-2xl text-brand" />
    </HUICombobox.Option>
  ));
};
