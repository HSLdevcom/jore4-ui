import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { useGetStopResultsCountQuery } from '../../generated/graphql';
import { theme } from '../../generated/theme';
import { useNavigateBackSafely } from '../../hooks';
import { Path, routeDetails } from '../../router/routeDetails';
import { defaultPagingInfo } from '../../types';
import { StopSearchFilters, defaultSortingInfo } from '../stop-registry';
import { buildSearchStopsGqlQueryVariables } from '../stop-registry/search/by-stop/filtersToQueryVariables';
import { stopSearchUrlStateToSearch } from '../stop-registry/search/utils';
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

function useGetStopResultsCount(filters: StopSearchFilters) {
  const { data, loading } = useGetStopResultsCountQuery({
    variables: {
      where: buildSearchStopsGqlQueryVariables(filters),
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
    state: { filters },
  } = useMapUrlStateContext();

  const { count, loading } = useGetStopResultsCount(filters);

  const navigateBackSafely = useNavigateBackSafely();

  const onClose = () => {
    navigateBackSafely({
      pathname: routeDetails[Path.stopSearch].getLink(),
      search: stopSearchUrlStateToSearch({
        filters,
        pagingInfo: defaultPagingInfo,
        sortingInfo: defaultSortingInfo,
      }),
    });
  };

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
          <div className="flex-grow" />
        </>
      ) : (
        <span>{t('map.searchResultCount', { count })}</span>
      )}
    </FloatingFooter>
  );
};
