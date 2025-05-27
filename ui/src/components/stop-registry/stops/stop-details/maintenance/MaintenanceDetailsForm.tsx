import { gql } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  StopRegistryStopPlaceOrganisationRelationshipType as MaintainerType,
  StopPlaceOrganisationFieldsFragment,
  StopRegistryStopPlaceOrganisationRelationshipType,
  useGetOrganisationsQuery,
} from '../../../../../generated/graphql';
import { MaintainerFormFields } from './MaintainerFormFields';
import { OrganisationDetailsModal } from './OrganisationDetailsModal';
import {
  MaintenanceDetailsFormState,
  maintenanceDetailsFormSchema,
} from './schema';

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
};

type MaintenanceDetailsFormComponentProps = {
  readonly className?: string;
  readonly defaultValues: Partial<MaintenanceDetailsFormState>;
  readonly onSubmit: (state: MaintenanceDetailsFormState) => void;
};

const MaintenanceDetailsFormComponent: ForwardRefRenderFunction<
  ExplicitAny,
  MaintenanceDetailsFormComponentProps
> = ({ className = '', defaultValues, onSubmit }, ref) => {
  const organisationsResult = useGetOrganisationsQuery();
  const organisations = (organisationsResult.data?.stop_registry
    ?.organisation ?? []) as Array<StopPlaceOrganisationFieldsFragment>;

  const methods = useForm<MaintenanceDetailsFormState>({
    defaultValues,
    resolver: zodResolver(maintenanceDetailsFormSchema),
  });
  const { handleSubmit, setValue } = methods;

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
      setValue(`maintainers.${editedMaintainerType}`, organisationId);
    }
    organisationsResult.refetch();
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={`grid grid-cols-3 gap-4 lg:grid-cols-5 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <MaintainerFormFields
          testId={testIds.owner}
          maintainerType={MaintainerType.Owner}
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

export const MaintenanceDetailsForm = React.forwardRef(
  MaintenanceDetailsFormComponent,
);
