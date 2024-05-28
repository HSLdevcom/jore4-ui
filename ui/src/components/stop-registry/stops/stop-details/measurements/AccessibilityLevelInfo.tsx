import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useCalculateStopAccessibilityLevel,
  useToggle,
} from '../../../../../hooks';
import { mapStopAccessibilityLevelToUiName } from '../../../../../i18n/uiNameMappings';
import { AccessibilityLevelDescriptionsDialog } from './AccessibilityLevelDescriptionsDialog';

const testIds = {
  accessibilityLevel: 'AccessibilityLevelInfo::accessibilityLevel',
};

interface Props {
  stop: StopWithDetails;
}

export const AccessibilityLevelInfo: React.FC<Props> = ({ stop }) => {
  const { t } = useTranslation();
  const [isModalOpen, toggleIsModalOpen] = useToggle();
  const { calculateStopAccessibilityLevel } =
    useCalculateStopAccessibilityLevel();
  const accessibilityLevel = calculateStopAccessibilityLevel(stop.stop_place);

  return (
    <div
      title={t('stopDetails.accessibilityLevelDescriptions.modalTriggerTitle')}
    >
      <button
        className="flex items-center"
        type="button"
        onClick={toggleIsModalOpen}
      >
        <span data-testid={testIds.accessibilityLevel}>
          {mapStopAccessibilityLevelToUiName(accessibilityLevel)}
        </span>
        <i className="icon-info text-xl text-brand" />
      </button>
      <AccessibilityLevelDescriptionsDialog
        isOpen={isModalOpen}
        onClose={toggleIsModalOpen}
      />
    </div>
  );
};
