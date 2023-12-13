import { Dialog } from '@headlessui/react';
import React from 'react';

const testIds = {
  textContent: 'ErrorModalItem::textContent',
};

interface Props {
  message: string;
  details: string;
  additionalDetails?: string;
  className?: string;
}

export const ErrorModalItem: React.FC<Props> = ({
  message,
  details,
  additionalDetails,
  className = '',
}) => {
  return (
    <article className={`rounded-sm bg-slate-100 px-4 py-3 ${className}`}>
      {message && <h5 className="inline">{message}</h5>}
      <div className="pl-3">
        <Dialog.Description data-testid={testIds.textContent}>
          {details}
        </Dialog.Description>
        {additionalDetails && (
          <p className="inline font-mono text-sm text-gray-500">
            {additionalDetails}
          </p>
        )}
      </div>
    </article>
  );
};
