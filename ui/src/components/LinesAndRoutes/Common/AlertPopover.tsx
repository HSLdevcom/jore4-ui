import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../common/LayoutComponents';

const testIds = {
  closeButton: 'AlertPopover::closeButton',
};

type AlertPopoverProps = {
  readonly title: string;
  readonly description: string;
  readonly alertIcon: string | undefined;
};

export const AlertPopover: FC<AlertPopoverProps> = ({
  title,
  description,
  alertIcon,
}) => {
  const { t } = useTranslation();

  return (
    <Visible visible={!!alertIcon}>
      <Popover>
        <PopoverButton>
          <i className={`${alertIcon} my-auto flex text-3xl`} />
        </PopoverButton>
        <PopoverPanel className="absolute z-20 ml-10 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md">
          <div className="mr-6">
            <h5 className="mb-1 text-lg">{title}</h5>
            <p className="text-sm">{description}</p>
          </div>
          <PopoverButton
            aria-label={t(($) => $.close)}
            data-testid={testIds.closeButton}
          >
            <i className="icon-close-large text-lg" aria-hidden="true" />
          </PopoverButton>
        </PopoverPanel>
      </Popover>
    </Visible>
  );
};
