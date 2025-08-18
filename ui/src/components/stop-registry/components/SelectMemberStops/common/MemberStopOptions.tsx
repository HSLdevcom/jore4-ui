import { Combobox as HUICombobox } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineAddCircle } from 'react-icons/md';
import { mapToShortDate } from '../../../../../time';
import { SelectedStop } from './schema';

const testIds = {
  option: 'MemberStopOptions::option',
};

type MemberStopOptionsProps = {
  readonly options: ReadonlyArray<SelectedStop>;
  readonly allowDisable?: boolean;
};

export const MemberStopOptions: FC<MemberStopOptionsProps> = ({
  options,
  allowDisable,
}) => {
  const { t } = useTranslation();

  return options.map((stop) => {
    const isDisabled = stop.stopPlaceParentId !== null && allowDisable;

    return (
      <HUICombobox.Option
        as="div"
        key={stop.quayId}
        value={stop}
        className="flex items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white ui-disabled:cursor-not-allowed ui-disabled:bg-light-grey"
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
