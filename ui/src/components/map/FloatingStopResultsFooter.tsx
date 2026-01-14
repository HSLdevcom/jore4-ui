import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { useGetStopResultsCountQuery } from '../../generated/graphql';
import { theme } from '../../generated/theme';
import { filtersAndResultSelectionToQueryVariables } from '../stop-registry/search/by-stop/filtersToQueryVariables';
import {
  ResultSelection,
  StopSearchFilters,
  defaultFilters,
  defaultResultSelection,
} from '../stop-registry/search/types';
import { FloatingFooter } from './FloatingFooter';
import { useMapUrlStateContext } from './utils/mapUrlState';

const GQL_GET_STOP_RESULT_COUNT = gql`
  query GetStopResultsCount(
    $where: stops_database_quay_newest_version_bool_exp
  ) {
    stopsDb: stops_database {
      stops: stops_database_quay_newest_version_aggregate(where: $where) {
        aggregate {
          count
        }
      }
    }
  }
`;

const testIds = {
  stopResultsFooter: 'StopResultsFooter',
};

function useGetStopResultsCount(
  filters: StopSearchFilters,
  resultSelection: ResultSelection,
) {
  const { data, loading } = useGetStopResultsCountQuery({
    variables: {
      where: filtersAndResultSelectionToQueryVariables(
        filters,
        resultSelection,
      ),
    },
  });

  return {
    count: data?.stopsDb?.stops.aggregate?.count ?? 0,
    loading,
  };
}

export const FloatingStopResultsFooter = () => {
  const { t } = useTranslation();

  const {
    state: { filters, resultSelection },
    setFlatUrlState,
  } = useMapUrlStateContext();

  const { count, loading } = useGetStopResultsCount(filters, resultSelection);

  const onClose = () =>
    setFlatUrlState((p) => ({
      ...p,
      ...defaultFilters,
      ...defaultResultSelection,
    }));

  return (
    <FloatingFooter
      className="gap-3"
      testId={testIds.stopResultsFooter}
      onClose={onClose}
    >
      {loading ? (
        <>
          <span>{t('map.searchResults')}</span>
          <PulseLoader color={theme.colors.brand} size={14} />
          <div className="grow" />
        </>
      ) : (
        <span>{t('map.searchResultCount', { count })}</span>
      )}
    </FloatingFooter>
  );
};
