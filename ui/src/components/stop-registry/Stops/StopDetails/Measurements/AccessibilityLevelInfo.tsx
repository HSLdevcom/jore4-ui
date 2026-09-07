import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { defaultAccessibilityLevel } from '../../../../../utils';
import { mapStopAccessibilityLevelToUiName } from '../../../../../utils/i18n';
import { useToggle } from '../../../../common/hooks/useToggle';
import { AccessibilityLevelDescriptionsDialog } from './AccessibilityLevelDescriptionsDialog';

const testIds = {
  accessibilityLevel: 'AccessibilityLevelInfo::accessibilityLevel',
};

type AccessibilityLevelInfoProps = {
  readonly stop: StopWithDetails;
};

export const AccessibilityLevelInfo: FC<AccessibilityLevelInfoProps> = ({
  stop,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, toggleIsModalOpen] = useToggle();
  const accessibilityLevel =
    stop.quay?.accessibilityLevel ?? defaultAccessibilityLevel;

  return (
    <div
      title={t(
        ($) => $.stopDetails.accessibilityLevelDescriptions.modalTriggerTitle,
      )}
    >
      <button
        className="flex items-center"
        type="button"
        onClick={toggleIsModalOpen}
      >
        <span data-testid={testIds.accessibilityLevel}>
          {mapStopAccessibilityLevelToUiName(t, accessibilityLevel)}
        </span>
        <i className="icon-info mx-2 text-xl text-brand" />
      </button>
      <AccessibilityLevelDescriptionsDialog
        isOpen={isModalOpen}
        onClose={toggleIsModalOpen}
      />
    </div>
  );
};
