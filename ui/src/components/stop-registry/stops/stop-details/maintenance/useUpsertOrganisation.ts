import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryOrganisationInput,
  useUpsertOrganisationMutation,
} from '../../../../../generated/graphql';
import { showDangerToastWithError } from '../../../../../utils';

const GQL_UPSERT_ORGANISATION = gql`
  mutation UpsertOrganisation($objects: [stop_registry_OrganisationInput]) {
    stop_registry {
      mutateOrganisation(Organisation: $objects) {
        id
        version
      }
    }
  }
`;

export const useUpsertOrganisation = () => {
  const { t } = useTranslation();
  const [upsertOrganisationMutation] = useUpsertOrganisationMutation();

  const upsertOrganisation = async (input: StopRegistryOrganisationInput) => {
    const result = await upsertOrganisationMutation({
      variables: { objects: [input] },
    });
    const organisation = result.data?.stop_registry?.mutateOrganisation?.[0];
    return organisation;
  };

  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    upsertOrganisation,
    defaultErrorHandler,
  };
};
