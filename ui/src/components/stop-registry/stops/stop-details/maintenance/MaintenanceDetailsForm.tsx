import { gql } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  StopRegistryStopPlaceOrganisationRelationshipType as MaintainerType,
  StopPlaceOrganisationFieldsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
  useGetOrganisationsQuery,
} from '../../../../../generated/graphql';
import { FormActionButtons } from '../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';
import { MaintainerFormFields } from './MaintainerFormFields';
import { OrganisationDetailsModal } from './OrganisationDetailsModal';
import {
  MaintenanceDetailsFormState,
  maintenanceDetailsFormSchema,
} from './schema';
import { StopOwnerFormField } from './StopOwnerFormField';

const GQL_GET_ORGANISATIONS = gql`
  query GetOrganisations {
    stop_registry {
      organisation {
        ...stop_place_organisation_fields
      }
    }
  }
`;

const testIds = {
  owner: 'MaintenanceDetailsForm::owner',
  maintenance: 'MaintenanceDetailsForm::maintenance',
  winterMaintenance: 'MaintenanceDetailsForm::winterMaintenance',
  infoUpkeep: 'MaintenanceDetailsForm::infoUpkeep',
  cleaning: 'MaintenanceDetailsForm::cleaning',
  shelterMaintenance: 'MaintenanceDetailsForm::shelterMaintenance',
};

type MaintenanceDetailsFormComponentProps = {
  readonly className?: string;
  readonly defaultValues: Partial<MaintenanceDetailsFormState>;
  readonly onSubmit: (state: MaintenanceDetailsFormState) => void;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
};

const MaintenanceDetailsFormComponent: ForwardRefRenderFunction<
  ExplicitAny,
  MaintenanceDetailsFormComponentProps
> = ({ className, defaultValues, onSubmit, onCancel, testIdPrefix }, ref) => {
  const organisationsResult = useGetOrganisationsQuery();
  const organisations = (organisationsResult.data?.stop_registry
    ?.organisation ?? []) as ReadonlyArray<StopPlaceOrganisationFieldsFragment>;

  const methods = useForm<MaintenanceDetailsFormState>({
    defaultValues,
    resolver: zodResolver(maintenanceDetailsFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'MaintenanceDetailsForm');
  const { handleSubmit, setValue, control } = methods;

  const [isEditingOrganisation, setIsEditingOrganisation] = useState(false);
  const [editedMaintainerType, setEditedMaintainerType] =
    useState<StopRegistryStopPlaceOrganisationRelationshipType | null>(null);
  const [editedOrganisation, setEditedOrganisation] = useState<
    StopPlaceOrganisationFieldsFragment | undefined
  >(undefined);

  const onEditOrganisation = (
    org: StopPlaceOrganisationFieldsFragment | undefined,
    relationshipType: StopRegistryStopPlaceOrganisationRelationshipType,
  ) => {
    setIsEditingOrganisation(true);
    setEditedOrganisation(org);
    setEditedMaintainerType(relationshipType);
  };

  const onStopEditingOrganisation = () => {
    setIsEditingOrganisation(false);
    setEditedOrganisation(undefined);
    setEditedMaintainerType(null);
  };

  const onOrganisationUpdated = (org: StopPlaceOrganisationFieldsFragment) => {
    const organisationId = org.id;
    onStopEditingOrganisation();
    // Select the newly created organisation as a maintainer (already selected if editing).
    if (editedMaintainerType && organisationId) {
      setValue(`maintainers.${editedMaintainerType}`, organisationId, {
        shouldDirty: true,
      });
    }
    organisationsResult.refetch();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
          <StopOwnerFormField control={control} />
          <MaintainerFormFields
            testId={testIds.owner}
            maintainerType={MaintainerType.Owner}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
          <MaintainerFormFields
            testId={testIds.shelterMaintenance}
            maintainerType={MaintainerType.ShelterMaintenance}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
          <MaintainerFormFields
            testId={testIds.maintenance}
            maintainerType={MaintainerType.Maintenance}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
          <MaintainerFormFields
            testId={testIds.winterMaintenance}
            maintainerType={MaintainerType.WinterMaintenance}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
          <MaintainerFormFields
            testId={testIds.infoUpkeep}
            maintainerType={MaintainerType.InfoUpkeep}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
          <MaintainerFormFields
            testId={testIds.cleaning}
            maintainerType={MaintainerType.Cleaning}
            organisations={organisations}
            editOrganisation={onEditOrganisation}
          />
        </div>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={
            !methods.formState.isDirty || methods.formState.isSubmitting
          }
        />
      </form>
      <OrganisationDetailsModal
        isOpen={isEditingOrganisation}
        organisation={editedOrganisation}
        onClose={onStopEditingOrganisation}
        onSubmit={onOrganisationUpdated}
      />
    </FormProvider>
  );
};

export const MaintenanceDetailsForm = forwardRef(
  MaintenanceDetailsFormComponent,
);
