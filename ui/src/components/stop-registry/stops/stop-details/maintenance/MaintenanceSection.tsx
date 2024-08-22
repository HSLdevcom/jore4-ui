import mapValues from 'lodash/mapValues';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useEditStopMaintenanceDetails,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { MaintenanceDetailsForm } from './MaintenanceDetailsForm';
import { MaintenanceViewCard } from './MaintenanceViewCard';
import { MaintenanceDetailsFormState } from './schema';
import { getMaintainers } from './utils';

const testIds = {
  prefix: 'MaintenanceSection',
};

interface Props {
  stop: StopWithDetails;
}

const mapMaintenanceDetailsToFormState = (
  stop: StopWithDetails,
): MaintenanceDetailsFormState => {
  const maintainers = getMaintainers(stop);

  const maintainerIdsByType = mapValues(maintainers, (maintainer) => {
    return maintainer?.id ?? null;
  });

  return { maintainers: maintainerIdsByType };
};

export const MaintenanceSection = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);
  const { saveStopMaintenanceDetails, defaultErrorHandler } =
    useEditStopMaintenanceDetails();

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: MaintenanceDetailsFormState) => {
    try {
      await saveStopMaintenanceDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const maintenanceFormDefaults = mapMaintenanceDetailsToFormState(stop);

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
      {isEditMode ? (
        <MaintenanceDetailsForm
          defaultValues={maintenanceFormDefaults}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <MaintenanceViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};
