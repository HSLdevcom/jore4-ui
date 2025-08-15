import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Visible } from '../../../layoutComponents';
import { SlimSimpleButton } from '../../stop-registry/stops/stop-details/layout';
import { InfoContainerHeaderButtonsProps } from './InfoContainerHeaderButtonsProps';

const testIds = {
  toggle: (prefix: string) => `${prefix}::toggle`,
  editButton: (prefix: string) => `${prefix}::editButton`,
};

export const DefaultHeaderButtons: FC<InfoContainerHeaderButtonsProps> = ({
  controls: {
    isExpandable,
    isExpanded,
    setIsExpanded,
    isEditable,
    isInEditMode,
    setIsInEditMode,
  },
  testIdPrefix,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex space-x-2">
      <Visible visible={isEditable && !isInEditMode}>
        <SlimSimpleButton
          testId={testIds.editButton(testIdPrefix)}
          onClick={() => setIsInEditMode(true)}
        >
          {t('edit')}
        </SlimSimpleButton>
      </Visible>

      <Visible visible={isExpandable && !isInEditMode}>
        <SlimSimpleButton
          onClick={() => setIsExpanded((expanded) => !expanded)}
          inverted={!isExpanded}
          testId={testIds.toggle(testIdPrefix)}
        >
          {isExpanded ? (
            <FaChevronUp className="text-white" aria-hidden />
          ) : (
            <FaChevronDown className="text-tweaked-brand" aria-hidden />
          )}
        </SlimSimpleButton>
      </Visible>
    </div>
  );
};
