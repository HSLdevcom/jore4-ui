import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAlertSharp } from 'react-icons/io5';
import { twMerge } from 'tailwind-merge';

type FutureVersionsAlertPopoverProps = {
  readonly className?: string;
};

export const FutureVersionsAlertPopover: FC<
  FutureVersionsAlertPopoverProps
> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverButton
        className={twMerge(
          'h-8 w-8',
          'flex items-center justify-center',
          'rounded-full border-2 border-brand',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
          'hover:enabled:border-tweaked-brand enabled:hover:outline-tweaked-brand',
          className,
        )}
      >
        <IoAlertSharp className="text-2xl text-brand" />
      </PopoverButton>
      <PopoverPanel className="absolute z-20 mt-2 ml-2 inline-flex w-52 flex-row items-start rounded-lg border border-light-grey bg-white p-2 drop-shadow-md">
        <p className="text-xs">
          {t('stopAreaDetails.memberStops.futureVersionsAlert')}
        </p>
      </PopoverPanel>
    </Popover>
  );
};
