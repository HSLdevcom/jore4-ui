import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineAddCircle } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../time';
import { SelectedStop } from './schema';

const testIds = {
  option: 'MemberStopOptions::option',
};

type MemberStopOptionsProps = {
  readonly options: ReadonlyArray<SelectedStop>;
};

export const MemberStopOptions: FC<MemberStopOptionsProps> = ({ options }) => {
  const { t } = useTranslation();

  return options.map((stop) => {
    const isDisabled = stop.stopPlaceParentId !== null;

    return (
      <HUICombobox.Option
        as="div"
        key={stop.quayId}
        value={stop}
        className={twMerge(
          'flex items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white',
          isDisabled ? 'cursor-not-allowed bg-light-grey' : 'cursor-pointer',
        )}
        data-testid={testIds.option}
        disabled={isDisabled}
        title={
          isDisabled
            ? t('terminalDetails.location.stopAlreadyBelongsToTerminal')
            : undefined
        }
      >
        <span>
          <strong>{stop.publicCode}</strong> {stop.name}
          <br />
          {mapToShortDate(stop.validityStart)}
          <span className="mx-1">-</span>
          {mapToShortDate(stop.validityEnd)}
        </span>
        <div className="flex-grow" />
        {!isDisabled && (
          <MdOutlineAddCircle className="text-hsl mx-1 text-2xl text-brand" />
        )}
      </HUICombobox.Option>
    );
  });
};
