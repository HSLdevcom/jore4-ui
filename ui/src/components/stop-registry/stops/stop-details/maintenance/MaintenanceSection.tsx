import mapValues from 'lodash/mapValues';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditStopMaintenanceDetails } from '../../../../../hooks';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
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

  const { saveStopMaintenanceDetails, defaultErrorHandler } =
    useEditStopMaintenanceDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const onSubmit = async (state: MaintenanceDetailsFormState) => {
    try {
      await saveStopMaintenanceDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const maintenanceFormDefaults = mapMaintenanceDetailsToFormState(stop);

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={t('stopDetails.maintenance.title')}
      testIdPrefix={testIds.prefix}
    >
      {infoContainerControls.isInEditMode ? (
        <MaintenanceDetailsForm
          defaultValues={maintenanceFormDefaults}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <MaintenanceViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
