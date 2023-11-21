import { Dialog } from '@headlessui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloseIconButton } from './CloseIconButton';
import { SimpleButton } from './SimpleButton';

const testIds = {
  closeButton: 'ErrorDialog::closeButton',
};

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  title: string;
  className?: string;
  // This should be a Tailwind max-width class: https://tailwindcss.com/docs/max-width
  widthClassName?: string;
}

export const ErrorDialog: React.FC<Props> = ({
  isOpen,
  onCancel,
  title,
  className = '',
  widthClassName = '',
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onCancel}
      className={`fixed inset-0 z-10 bg-black bg-opacity-50 ${className}`}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={`relative flex w-full flex-col rounded-md bg-white p-5 shadow-md ${
            widthClassName || 'max-w-sm'
          }`}
        >
          <CloseIconButton
            className="absolute top-3 right-3"
            onClick={onCancel}
            testId={testIds.closeButton}
          />
          <Dialog.Title className="flex items-center" as="h4">
            <i className="icon-alert-filled -ml-1 mr-1 text-2xl text-hsl-red" />
            {title}
          </Dialog.Title>
          <section className="max-h-96 overflow-y-auto">{children}</section>
          <div className="mt-2 flex justify-end space-x-3">
            <SimpleButton
              key="cancelButton"
              testId={testIds.closeButton}
              onClick={onCancel}
            >
              {t('close')}
            </SimpleButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
