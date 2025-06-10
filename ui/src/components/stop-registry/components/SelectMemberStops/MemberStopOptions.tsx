import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { MdOutlineAddCircle } from 'react-icons/md';
import { mapToShortDate } from '../../../../time';
import { SelectedStop } from './schema';

const testIds = {
  option: 'MemberStopOptions::option',
};

type MemberStopOptionsProps = {
  readonly options: ReadonlyArray<SelectedStop>;
};

export const MemberStopOptions: FC<MemberStopOptionsProps> = ({ options }) => {
  return options.map((stop) => (
    <HUICombobox.Option
      as="div"
      key={stop.quayId}
      value={stop}
      className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
      data-testid={testIds.option}
    >
      <span>
        <strong>{stop.publicCode}</strong> {stop.name}
        <br />
        {mapToShortDate(stop.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(stop.validityEnd)}
      </span>
      <div className="flex-grow" />
      <MdOutlineAddCircle className="text-hsl mx-1 text-2xl text-brand" />
    </HUICombobox.Option>
  ));
};
