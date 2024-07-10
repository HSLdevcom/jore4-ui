import { Dialog } from '@headlessui/react';
import React from 'react';
import { CloseIconButton } from './CloseIconButton';
import { SimpleButton } from './SimpleButton';

const testIds = {
  closeButton: 'DialogWithButtons::closeButton',
  textContent: 'DialogWithButtons::textContent',
};

export interface DialogButton {
  onClick: () => void;
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
  // This should be a Tailwind max-width class: https://tailwindcss.com/docs/max-width
  widthClassName?: string;
}

export const DialogWithButtons: React.FC<Props> = ({
  isOpen,
  title,
  description,
  buttons,
  onCancel,
  className = '',
  widthClassName = '',
}) => {
  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onCancel}
      className={`fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 ${className}`}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={`w-full rounded-md bg-white p-5 shadow-md ${
            widthClassName ?? 'max-w-sm'
          }`}
        >
          <Dialog.Title className="flex" as="h3">
            {title}
            <CloseIconButton
              className="ml-auto"
              onClick={onCancel}
              testId={testIds.closeButton}
            />
          </Dialog.Title>
          <Dialog.Description
            className="my-5 whitespace-pre-line"
            data-testid={testIds.textContent}
          >
            {description}
          </Dialog.Description>
          <div className="flex justify-end space-x-5">
            {buttons.map((button) => (
              <SimpleButton
                key={button.text}
                testId={button.testId}
                inverted={button.inverted}
                onClick={button.onClick}
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
