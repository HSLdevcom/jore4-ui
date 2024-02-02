import { Dialog } from '@headlessui/react';
import React from 'react';
import { Visible } from '../layoutComponents';

const testIds = {
  modalItem: 'ErrorModalItem::modalItem',
  title: 'ErrorModalItem::title',
  textContent: 'ErrorModalItem::textContent',
  additionalDetails: 'ErrorModalItem::additionalDetails',
};

interface Props {
  title?: string;
  details: string;
  additionalDetails?: string;
  className?: string;
}

export const ErrorModalItem: React.FC<Props> = ({
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
