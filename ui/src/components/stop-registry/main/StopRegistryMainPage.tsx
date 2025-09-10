import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { defaultPagingInfo } from '../../../types';
import { PageTitle } from '../../common';
import { useToggle } from '../../common/hooks/useToggle';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import {
  StopSearchBar,
  StopSearchFilters,
  StopSearchNavigationState,
  defaultSortingInfo,
} from '../search';
import {
  stopSearchUrlStateToSearch,
  useStopSearchUrlState,
} from '../search/utils';

function getNavigationState(
  searchIsExpanded: boolean,
): StopSearchNavigationState {
  return { searchExpanded: searchIsExpanded };
}

export const StopRegistryMainPage: FC = () => {
  const { t } = useTranslation();

  const {
    state: { filters, pagingInfo },
  } = useStopSearchUrlState();

  const location = useLocation();

  const [searchIsExpanded, toggleSearchIsExpanded] = useToggle(
    location.state?.searchExpanded,
  );

  const navigate = useNavigate();
  const onSubmit = (nextFilters: StopSearchFilters) => {
    navigate(
      {
        pathname: Path.stopSearch,
        search: stopSearchUrlStateToSearch({
          filters: nextFilters,
          pagingInfo: {
            ...defaultPagingInfo,
            pageSize: pagingInfo.pageSize,
          },
          sortingInfo: defaultSortingInfo,
        }),
      },
      { replace: true, state: getNavigationState(searchIsExpanded) },
    );
  };

  return (
    <Container>
      <Row className="justify-between">
        <PageTitle.H1>{t('stops.stops')}</PageTitle.H1>
        <OpenDefaultMapButton containerClassName="ml-auto" />
      </Row>
      <StopSearchBar
        initialFilters={filters}
        searchIsExpanded={searchIsExpanded}
        toggleSearchIsExpanded={toggleSearchIsExpanded}
        onSubmit={onSubmit}
      />
    </Container>
  );
};
