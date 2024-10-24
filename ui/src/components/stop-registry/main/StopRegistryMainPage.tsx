import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import { StopSearchBar, StopSearchFilters } from '../search';
import {
  stopSearchUrlStateToSearch,
  useStopSearchUrlState,
} from '../search/utils';

const testIds = {
  createStopButton: 'StopRegistryMainPage::createStopButton',
};

export const StopRegistryMainPage: FC = () => {
  const { t } = useTranslation();

  const [urlState] = useStopSearchUrlState();

  const navigate = useNavigate();
  const onSubmit = (filters: StopSearchFilters) => {
    navigate(
      {
        pathname: Path.stopSearch,
        search: stopSearchUrlStateToSearch(filters),
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
      <StopSearchBar initialFilters={urlState} onSubmit={onSubmit} />
    </Container>
  );
};
