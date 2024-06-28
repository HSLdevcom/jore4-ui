import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { SimpleButton } from '../../../../../uiComponents';
import { EditableContainerHeaderButtons } from './EditableContainerHeaderButtons';

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
  title: string | ReactNode;
  headerButtons?: ReactNode;
  onCancel?: () => void;
  onSave?: () => void;
  isEditMode?: boolean;
  toggleEditMode?: () => void;
  testIdPrefix?: string;
}

const testIds = {
  title: (prefix: string) => `${prefix}::title`,
  content: (prefix: string) => `${prefix}::content`,
  cancelButton: (prefix: string) => `${prefix}::cancelButton`,
  saveButton: (prefix: string) => `${prefix}::saveButton`,
};

export const ExpandableInfoContainer: React.FC<Props> = ({
  isExpanded,
  onToggle,
  onCancel,
  onSave,
  title,
  headerButtons,
  testIdPrefix = '',
  isEditMode,
  toggleEditMode,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className="my-3 [&>*]:border-border-hsl-blue">
      <div
        className={`
          flex h-14 items-center justify-between rounded-t-lg border
          bg-hsl-neutral-blue px-4 py-2 ${isExpanded ? '' : 'rounded-b-lg'}
        `}
      >
        <span data-testid={testIds.title(testIdPrefix)}>
          {React.isValidElement(title) ? title : <h4>{title}</h4>}
        </span>
        <div className="flex space-x-2">
          {React.isValidElement(headerButtons) ? (
            headerButtons
          ) : (
            <EditableContainerHeaderButtons
              isEditMode={isEditMode}
              toggleEditMode={toggleEditMode}
              testIdPrefix={testIdPrefix}
              onToggle={onToggle}
              isExpanded={isExpanded}
            />
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
