import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import noop from 'lodash/noop';
import { FC } from 'react';
import { Visible } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';

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
  return (
    <Visible visible={!!alertIcon}>
      <Popover>
        <PopoverButton>
          <i className={`${alertIcon} my-auto flex text-3xl`} />
        </PopoverButton>
        <PopoverPanel className="absolute z-20 ml-10 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md">
          <div className="mr-6">
            <div className="mb-1 space-x-3">
              <h5 className="inline text-lg">{title}</h5>
            </div>
            <p className="text-sm">{description}</p>
          </div>
          <PopoverButton>
            <CloseIconButton onClick={noop} testId={testIds.closeButton} />
          </PopoverButton>
        </PopoverPanel>
      </Popover>
    </Visible>
  );
};
