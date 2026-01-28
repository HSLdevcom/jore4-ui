import { useApolloClient } from '@apollo/client';
import mapValues from 'lodash/mapValues';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../types';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { MaintenanceDetailsForm } from './MaintenanceDetailsForm';
import { MaintenanceViewCard } from './MaintenanceViewCard';
import { MaintenanceDetailsFormState } from './schema';
import { useEditStopMaintenanceDetails } from './useEditStopMaintenanceDetails';
import { getMaintainers } from './utils';

const testIds = {
  prefix: 'MaintenanceSection',
};

type MaintenanceSectionProps = {
  readonly stop: StopWithDetails;
};

const mapMaintenanceDetailsToFormState = (
  stop: StopWithDetails,
): MaintenanceDetailsFormState => {
  const maintainers = getMaintainers(stop);

  const maintainerIdsByType = mapValues(maintainers, (maintainer) => {
    return maintainer?.id ?? null;
  });

  const stopOwner = stop.quay?.stopOwner ?? null;

  return { stopOwner, maintainers: maintainerIdsByType };
};

export const MaintenanceSection: FC<MaintenanceSectionProps> = ({ stop }) => {
  const { t } = useTranslation();

  // If an organization's details are updated, it will also trigger an update
  // of the Quay even tough, the save button is not pressed for a CHANGE of
  // an org. Record the changed orgs, and trigged a refech of the Quay if needed.
  const [updatedOrganizations, setUpdatedOrganizations] = useState<
    ReadonlyArray<string>
  >([]);
  const apolloClient = useApolloClient();

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

  const onCancel = () => {
    infoContainerControls.setIsInEditMode(false);
    const activeOrgs = Object.values(maintenanceFormDefaults.maintainers);
    if (updatedOrganizations.some((updated) => activeOrgs.includes(updated))) {
      apolloClient.refetchQueries({
        include: ['GetStopDetails', 'GetLatestQuayChange'],
      });
      setUpdatedOrganizations([]);
    }
  };

  const onOrganizationUpdated = (netexId: string) =>
    setUpdatedOrganizations((p) => p.concat(netexId));

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
          onCancel={onCancel}
          onOrganizationUpdated={onOrganizationUpdated}
          onSubmit={onSubmit}
          testIdPrefix={testIds.prefix}
        />
      ) : (
        <MaintenanceViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
