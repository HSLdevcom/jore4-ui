import {
  StopPlaceOrganisationFieldsFragment,
  useGetOrganisationsQuery,
} from '../../../../../../generated/graphql';
import { useDebouncedString } from '../../../../../../hooks';

export const useChooseOrganisationDropdown = (
  query: string,
  organisationId?: string,
  limit: number = 15,
): {
  organisations: ReadonlyArray<StopPlaceOrganisationFieldsFragment>;
  selectedOrganisation?: StopPlaceOrganisationFieldsFragment;
} => {
  const [debouncedQuery] = useDebouncedString(query, 300);

  const organisationsResult = useGetOrganisationsQuery();
  const allOrganisations =
    organisationsResult.data?.stop_registry?.organisation ?? [];

  const filteredOrganisations = debouncedQuery
    ? allOrganisations.filter((org) =>
        org?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : allOrganisations;

  const sortedAndLimitedOrganisations = [...filteredOrganisations]
    .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
    .slice(0, limit);

  const selectedOrganisation = allOrganisations.find(
    (org) => org?.id === organisationId,
  );

  return {
    organisations:
      sortedAndLimitedOrganisations as ReadonlyArray<StopPlaceOrganisationFieldsFragment>,
    selectedOrganisation: selectedOrganisation as
      | StopPlaceOrganisationFieldsFragment
      | undefined,
  };
};
