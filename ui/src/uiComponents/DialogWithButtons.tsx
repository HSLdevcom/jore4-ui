import { Dialog } from '@headlessui/react';
import React from 'react';
import { CloseIconButton } from './CloseIconButton';
import { SimpleButton } from './SimpleButton';

export interface DialogButton {
  onAction: () => void;
  text: string;
  inverted?: boolean;
  testId?: string;
}

interface Props {
  isOpen: boolean;
  title: string;
  description: string;
  buttons: DialogButton[];
  onCancel: () => void;
  className?: string;
  innerClassName?: string;
}

export const DialogWithButtons: React.FC<Props> = ({
  isOpen,
  title,
  description,
  buttons,
  onCancel,
  className = '',
  innerClassName = '',
}) => {
  const descHtml = { __html: description };
  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onCancel}
      className={`fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 ${className}`}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={`w-full rounded-md bg-white p-5 shadow-md ${innerClassName}`}
        >
          <Dialog.Title className="flex" as="h3">
            {title}
            <CloseIconButton className="ml-auto" onClick={onCancel} />
          </Dialog.Title>
          <Dialog.Description
            className="my-5"
            dangerouslySetInnerHTML={descHtml}
          />
          <div className="flex justify-end space-x-5">
            {buttons.map((button) => (
              <SimpleButton
                key={button.text}
                testId={button.testId}
                inverted={button.inverted}
                onClick={button.onAction}
              >
                {button.text}
              </SimpleButton>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
