import { Dialog } from '@headlessui/react';
import React from 'react';

const testIds = {
  textContent: 'ErrorDialogItem::textContent',
};

interface Props {
  customTitle: string;
  description: string;
  httpCode?: number;
  httpText?: string;
  className?: string;
}

export const ErrorDialogItem: React.FC<Props> = ({
  customTitle,
  description,
  httpCode,
  httpText,
  className = '',
}) => {
  return (
    <article className={`rounded-sm bg-slate-100 px-4 py-3 ${className}`}>
      {customTitle && <h5 className="inline">{customTitle}</h5>}
      <div className="pl-3">
        <Dialog.Description
          className="whitespace-pre-line"
          data-testid={testIds.textContent}
        >
          {description}
        </Dialog.Description>
        {httpCode && (
          <p className="inline font-mono text-sm text-gray-500">
            {httpCode}: {httpText}
          </p>
        )}
      </div>
    </article>
  );
};
