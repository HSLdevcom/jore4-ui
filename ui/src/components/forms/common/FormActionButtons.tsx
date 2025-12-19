import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { SimpleButton } from '../../../uiComponents';

const baseStyles = 'flex items-center gap-2 px-4 py-2';

const variantStyles = {
  infoContainer:
    '-mx-5 -mb-5 mt-5 border-t border-[--borderColor] bg-[--backgroundColor]',
  modal: 'mx-0 my-0 border border-light-grey bg-background',
} as const;

type FormActionButtonsProps = {
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
  readonly isDisabled: boolean;
  readonly isSubmitting?: boolean;
  readonly className?: string;
  readonly addNewButton?: React.ReactNode;
  readonly onDelete?: () => void;
  readonly deleteButtonText?: string;
  readonly variant?: keyof typeof variantStyles;
};

export const FormActionButtons: FC<FormActionButtonsProps> = ({
  onCancel,
  testIdPrefix,
  isDisabled,
  isSubmitting,
  className,
  addNewButton,
  onDelete,
  deleteButtonText,
  variant,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        baseStyles,
        variant && variantStyles[variant],
        className,
      )}
    >
      {addNewButton}
      <div className="flex-grow" />
      {onDelete && (
        <SimpleButton
          inverted
          onClick={onDelete}
          disabled={isSubmitting}
          testId={`${testIdPrefix}::deleteButton`}
        >
          {deleteButtonText ?? t('remove')}
        </SimpleButton>
      )}
      <SimpleButton
        inverted
        onClick={onCancel}
        disabled={isSubmitting}
        testId={`${testIdPrefix}::cancelButton`}
      >
        {t('cancel')}
      </SimpleButton>
      <SimpleButton
        type="submit"
        disabled={isDisabled}
        testId={`${testIdPrefix}::saveButton`}
      >
        {t('save')}
      </SimpleButton>
    </div>
  );
};
