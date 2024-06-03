import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Visible } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import { SlimSimpleButton } from './SlimSimpleButton';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  title: string | ReactNode;
  onCancel?: () => void;
  onSave?: () => void;
  isEditMode?: boolean;
  toggleEditMode?: () => void;
  testIdPrefix?: string;
}

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  content: (prefix: string) => `${prefix}::content`,
  editButton: (prefix: string) => `${prefix}::editButton`,
  cancelButton: (prefix: string) => `${prefix}::cancelButton`,
  saveButton: (prefix: string) => `${prefix}::saveButton`,
};

export const ExpandableInfoContainer: React.FC<Props> = ({
  isExpanded,
  onToggle,
  onCancel,
  onSave,
  title,
  testIdPrefix = '',
  isEditMode,
  toggleEditMode,
  children,
}) => {
  const { t } = useTranslation();

  // When toggling edit mode, if the card is not expanded: expand it.
  const onToggleEditMode = () => {
    if (toggleEditMode) {
      toggleEditMode();
    }
    if (!isExpanded) {
      onToggle();
    }
  };

  return (
    <div className="my-3 [&>*]:border-border-hsl-blue">
      <div
        className={`
          flex h-14 items-center justify-between rounded-t-lg border
          bg-hsl-neutral-blue px-4 py-2 ${isExpanded ? '' : 'rounded-b-lg'}
        `}
      >
        {React.isValidElement(title) ? title : <h4>{title}</h4>}
        <div className="flex space-x-2">
          {!isEditMode && toggleEditMode && (
            <SlimSimpleButton
              testId={testIds.editButton(testIdPrefix)}
              onClick={onToggleEditMode}
            >
              {t('edit')}
            </SlimSimpleButton>
          )}
          {!isEditMode && (
            <SlimSimpleButton
              onClick={onToggle}
              inverted={!isExpanded}
              testId={testIds.toggle(testIdPrefix)}
            >
              {isExpanded ? (
                <FaChevronUp className="text-white" aria-hidden />
              ) : (
                <FaChevronDown className="text-tweaked-brand" aria-hidden />
              )}
            </SlimSimpleButton>
          )}
        </div>
      </div>
      <Visible visible={isExpanded}>
        <div
          data-testid={testIds.content(testIdPrefix)}
          className={`${
            isEditMode ? '' : 'rounded-b-lg border-b'
          } border-x p-5 [&>hr]:mt-5`}
        >
          {children}
        </div>
      </Visible>
      <Visible visible={isExpanded && isEditMode}>
        <div
          className={`
          flex items-center justify-end space-x-2 rounded-b-lg
          border
          bg-hsl-neutral-blue px-4 py-2
        `}
        >
          {onCancel && (
            <SimpleButton
              onClick={onCancel}
              inverted
              testId={testIds.cancelButton(testIdPrefix)}
            >
              {t('cancel')}
            </SimpleButton>
          )}
          {onSave && (
            <SimpleButton
              onClick={onSave}
              id="save-button"
              testId={testIds.saveButton(testIdPrefix)}
            >
              {t('save')}
            </SimpleButton>
          )}
        </div>
      </Visible>
    </div>
  );
};
