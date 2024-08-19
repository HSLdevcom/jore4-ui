import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../../hooks';
import { submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { MaintenanceViewCard } from './MaintenanceViewCard';

const testIds = {
  prefix: 'MaintenanceSection',
};

interface Props {
  stop: StopWithDetails;
}

export const MaintenanceSection = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.maintenance.title')}
      testIdPrefix={testIds.prefix}
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode ? <h3>TODO</h3> : <MaintenanceViewCard stop={stop} />}
    </ExpandableInfoContainer>
  );
};
