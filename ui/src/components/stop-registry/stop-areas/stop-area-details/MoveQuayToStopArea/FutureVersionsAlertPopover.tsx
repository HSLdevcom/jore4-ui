import { Popover } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAlertSharp } from 'react-icons/io5';
import { twMerge } from 'tailwind-merge';
import { getHoverStyles } from '../../../../../uiComponents';

type FutureVersionsAlertPopoverProps = {
  readonly className?: string;
};

export const FutureVersionsAlertPopover: FC<
  FutureVersionsAlertPopoverProps
> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <Popover.Button
        className={twMerge(
          'h-8 w-8',
          'flex items-center justify-center',
          'rounded-full border-2 border-brand',
          'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
          getHoverStyles(),
          className,
        )}
      >
        <IoAlertSharp className="text-2xl text-brand" />
      </Popover.Button>
      <Popover.Panel className="absolute z-20 ml-2 mt-2 inline-flex w-52 flex-row items-start rounded-lg border border-light-grey bg-white p-2 drop-shadow-md">
        <p className="text-xs">
          {t('stopAreaDetails.memberStops.futureVersionsAlert')}
        </p>
      </Popover.Panel>
    </Popover>
  );
};
