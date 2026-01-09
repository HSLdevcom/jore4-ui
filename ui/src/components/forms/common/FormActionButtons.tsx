import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { SimpleButton } from '../../../uiComponents';

type FormActionButtonsProps = {
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
  readonly isDisabled: boolean;
  readonly className?: string;
  readonly addNewButton?: React.ReactNode;
  readonly onDelete?: () => void;
  readonly deleteButtonText?: string;
};

export const FormActionButtons: FC<FormActionButtonsProps> = ({
  onCancel,
  testIdPrefix,
  isDisabled,
  className,
  addNewButton,
  onDelete,
  deleteButtonText,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        '-mx-5 -mb-5 mt-5 flex items-center space-x-2 border-t border-[--borderColor] bg-[--backgroundColor] px-4 py-2',
        className,
      )}
    >
      {addNewButton && <div className="mr-auto">{addNewButton}</div>}
      {onDelete && (
        <SimpleButton
          className={addNewButton ? '' : 'ml-auto'}
          inverted
          onClick={onDelete}
          testId={`${testIdPrefix}::deleteButton`}
        >
          {deleteButtonText ?? t('remove')}
        </SimpleButton>
      )}
      <SimpleButton
        className={!addNewButton && !onDelete ? 'ml-auto' : ''}
        inverted
        onClick={onCancel}
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
