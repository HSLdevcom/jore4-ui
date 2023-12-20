import { Dialog } from '@headlessui/react';
import React from 'react';
import { Visible } from '../layoutComponents';

const testIds = {
  textContent: 'ErrorModalItem::textContent',
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
    <div className={`rounded-sm px-4 py-3 ${className}`}>
      <Visible visible={!!title}>
        <h5 className="inline">{title}</h5>
      </Visible>
      <div className="pl-3">
        <Dialog.Description data-testid={testIds.textContent}>
          {details}
        </Dialog.Description>
        <Visible visible={!!additionalDetails}>
          <p className="inline font-mono text-sm text-gray-500">
            {additionalDetails}
          </p>
        </Visible>
      </div>
    </div>
  );
};
