import { gql } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  StopRegistryStopPlaceOrganisationRelationshipType as MaintainerType,
  StopPlaceOrganisationFieldsFragment,
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
  streetAddress: 'MaintenanceDetailsForm::streetAddress',
  owner: 'MaintenanceDetailsForm::owner',
  maintenance: 'MaintenanceDetailsForm::maintenance',
  winterMaintenance: 'MaintenanceDetailsForm::winterMaintenance',
  infoUpkeep: 'MaintenanceDetailsForm::infoUpkeep',
  cleaning: 'MaintenanceDetailsForm::cleaning',
};

interface Props {
  className?: string;
  defaultValues: Partial<MaintenanceDetailsFormState>;
  onSubmit: (state: MaintenanceDetailsFormState) => void;
}

const MaintenanceDetailsFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): React.ReactElement => {
  const organisationsResult = useGetOrganisationsQuery();
  const organisations = (organisationsResult.data?.stop_registry
    ?.organisation ?? []) as Array<StopPlaceOrganisationFieldsFragment>;

  const methods = useForm<MaintenanceDetailsFormState>({
    defaultValues,
    resolver: zodResolver(maintenanceDetailsFormSchema),
  });
  const { handleSubmit } = methods;

  const [isEditingOrganisation, setIsEditingOrganisation] = useState(false);
  const [editedOrganisation, setEditedOrganisation] = useState<
    StopPlaceOrganisationFieldsFragment | undefined
  >(undefined);
  const onEditOrganisation = (
    org: StopPlaceOrganisationFieldsFragment | undefined,
  ) => {
    setIsEditingOrganisation(true);
    setEditedOrganisation(org);
  };
  const onStopEditingOrganisation = () => {
    setIsEditingOrganisation(false);
    setEditedOrganisation(undefined);
  };
  const onOrganisationUpdated =
    (/* org: StopPlaceOrganisationFieldsFragment */) => {
      onStopEditingOrganisation();
      organisationsResult.refetch();
    };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={`grid grid-cols-3 gap-x-4 gap-y-4 lg:grid-cols-5 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        <MaintainerFormFields
          data-testid={testIds.owner}
          maintainerType={MaintainerType.Owner}
          organisations={organisations}
          editOrganisation={onEditOrganisation}
        />
        <MaintainerFormFields
          data-testid={testIds.maintenance}
          maintainerType={MaintainerType.Maintenance}
          organisations={organisations}
          editOrganisation={onEditOrganisation}
        />
        <MaintainerFormFields
          data-testid={testIds.winterMaintenance}
          maintainerType={MaintainerType.WinterMaintenance}
          organisations={organisations}
          editOrganisation={onEditOrganisation}
        />
        <MaintainerFormFields
          data-testid={testIds.infoUpkeep}
          maintainerType={MaintainerType.InfoUpkeep}
          organisations={organisations}
          editOrganisation={onEditOrganisation}
        />
        <MaintainerFormFields
          data-testid={testIds.cleaning}
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
