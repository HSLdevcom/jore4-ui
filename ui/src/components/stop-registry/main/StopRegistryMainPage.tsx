import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { defaultPagingInfo } from '../../../types';
import { SimpleButton } from '../../../uiComponents';
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

const testIds = {
  createStopButton: 'StopRegistryMainPage::createStopButton',
};

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
        <h1>{t('stops.stops')}</h1>
        <OpenDefaultMapButton containerClassName="ml-auto" />
        <SimpleButton
          // TODO: actual implementation for this button.
          id="create-stop-button"
          testId={testIds.createStopButton}
          href="/"
          disabled
          containerClassName="ml-3"
        >
          {t('stops.createStop')}
        </SimpleButton>
      </Row>
      <StopSearchBar initialFilters={filters} onSubmit={onSubmit} />
    </Container>
  );
};
