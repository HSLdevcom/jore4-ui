import { Popover } from '@headlessui/react';
import noop from 'lodash/noop';
import { Visible } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';

const testIds = {
  closeButton: 'AlertPopover::closeButton',
};

interface Props {
  title: string;
  description: string;
  alertIcon: string | undefined;
}

export const AlertPopover = ({
  title,
  description,
  alertIcon,
}: Props): JSX.Element => {
  return (
    <Visible visible={!!alertIcon}>
      <Popover>
        <Popover.Button>
          <i className={`${alertIcon} my-auto flex text-3xl`} />
        </Popover.Button>
        <Popover.Panel className="absolute z-20 ml-10 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md">
          <div className="mr-6">
            <div className="mb-1 space-x-3">
              <h5 className="inline text-lg">{title}</h5>
            </div>
            <p className="text-sm">{description}</p>
          </div>
          <Popover.Button>
            <CloseIconButton onClick={noop} testId={testIds.closeButton} />
          </Popover.Button>
        </Popover.Panel>
      </Popover>
    </Visible>
  );
};
