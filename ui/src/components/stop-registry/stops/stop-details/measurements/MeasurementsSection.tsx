import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../../hooks';
import { submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { MeasurementsViewCard } from './MeasurementsViewCard';

interface Props {
  stop: StopWithDetails;
}

export const MeasurementsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const defaultValues = {};

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.measurements.title')}
      testIdPrefix="MeasurementsSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode && !!defaultValues ? (
        <span>TODO</span>
      ) : (
        <MeasurementsViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};
