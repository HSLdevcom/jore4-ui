import { t } from 'i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SlimSimpleButton } from './SlimSimpleButton';

interface Props {
  isExpanded: boolean;
  isEditMode?: boolean;
  onToggle: () => void;
  onToggleEditMode?: () => void;
  testIdPrefix?: string;
}

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  editButton: (prefix: string) => `${prefix}::editButton`,
};

export const EditableContainerHeaderButtons = ({
  isExpanded,
  isEditMode,
  onToggleEditMode,
  onToggle,
  testIdPrefix = '',
}: Props) => {
  return (
    <>
      {!isEditMode && onToggleEditMode && (
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
    </>
  );
};
