import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { defaultPagingInfo } from '../../../types';
import { PageTitle } from '../../common';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import {
  StopSearchBar,
  StopSearchFilters,
  defaultSortingInfo,
} from '../search';
import {
  stopSearchUrlStateToSearch,
  useStopSearchUrlState,
} from '../search/utils';

export const StopRegistryMainPage: FC = () => {
  const { t } = useTranslation();

  const {
    state: { filters, pagingInfo },
  } = useStopSearchUrlState();

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
      { replace: true },
    );
  };

  return (
    <Container>
      <Row className="justify-between">
        <PageTitle.H1>{t('stops.stops')}</PageTitle.H1>
        <OpenDefaultMapButton containerClassName="ml-auto" />
      </Row>
      <StopSearchBar initialFilters={filters} onSubmit={onSubmit} />
    </Container>
  );
};
