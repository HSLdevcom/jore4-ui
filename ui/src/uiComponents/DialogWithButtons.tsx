import { Description, Dialog, DialogTitle } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { CloseIconButton } from './CloseIconButton';
import { SimpleButton } from './SimpleButton';

const testIds = {
  closeButton: 'DialogWithButtons::closeButton',
  textContent: 'DialogWithButtons::textContent',
};

export type DialogButton = {
  readonly onClick: () => void;
  readonly text: ReactNode;
  readonly inverted?: boolean;
  readonly testId?: string;
};

function getDialogButtonKey(button: DialogButton, index: number) {
  if (button.testId) {
    return button.testId;
  }

  if (typeof button.text === 'string') {
    return button.text;
  }

  return `${button.text}-${button.inverted}-${button.onClick}-${index}`;
}

type DialogWithButtonsProps = {
  readonly isOpen: boolean;
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly buttons: ReadonlyArray<DialogButton>;
  readonly onCancel: () => void;
  readonly className?: string;
  // This should be a Tailwind max-width class: https://tailwindcss.com/docs/max-width
  readonly widthClassName?: string;
};

export const DialogWithButtons: FC<DialogWithButtonsProps> = ({
  isOpen,
  title,
  description,
  buttons,
  onCancel,
  className,
  widthClassName = 'max-w-sm',
}) => {
  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onCancel}
      className={twMerge(
        'fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50',
        className,
      )}
    >
      <div className="flex h-full items-center justify-center">
        <div
          className={twMerge(
            'w-full rounded-md bg-white p-5 shadow-md',
            widthClassName,
          )}
        >
          <DialogTitle className="flex" as="h3">
            {title}
            <CloseIconButton
              className="ml-auto"
              onClick={onCancel}
              testId={testIds.closeButton}
            />
          </DialogTitle>
          <Description
            className="my-5 whitespace-pre-line"
            data-testid={testIds.textContent}
          >
            {description}
          </Description>
          <div className="flex justify-end space-x-2">
            {buttons.map((button, i) => (
              <SimpleButton
                key={getDialogButtonKey(button, i)}
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
