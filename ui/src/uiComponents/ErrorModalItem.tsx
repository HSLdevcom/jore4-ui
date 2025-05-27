import { Dialog } from '@headlessui/react';
import { FC } from 'react';
import { Visible } from '../layoutComponents';

const testIds = {
  modalItem: 'ErrorModalItem::modalItem',
  title: 'ErrorModalItem::title',
  textContent: 'ErrorModalItem::textContent',
  additionalDetails: 'ErrorModalItem::additionalDetails',
};

type ErrorModalItemProps = {
  readonly title?: string;
  readonly details: string;
  readonly additionalDetails?: string;
  readonly className?: string;
};

export const ErrorModalItem: FC<ErrorModalItemProps> = ({
  title,
  details,
  additionalDetails,
  className = '',
}) => {
  return (
    <div
      className={`rounded-sm px-4 py-3 ${className}`}
      data-testid={testIds.modalItem}
    >
      <Visible visible={!!title}>
        <h5 className="inline" data-testid={testIds.title}>
          {title}
        </h5>
      </Visible>
      <div className="pl-3">
        <Dialog.Description data-testid={testIds.textContent}>
          {details}
        </Dialog.Description>
        <Visible visible={!!additionalDetails}>
          <p
            className="inline font-mono text-sm text-gray-500"
            data-testid={testIds.additionalDetails}
          >
            {additionalDetails}
          </p>
        </Visible>
      </div>
    </div>
  );
};
