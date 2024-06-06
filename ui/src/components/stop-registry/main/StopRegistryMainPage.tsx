import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import { StopSearchBar } from '../search';

const testIds = {
  createStopButton: 'StopRegistryMainPage::createStopButton',
};

export const StopRegistryMainPage = (): JSX.Element => {
  const { t } = useTranslation();

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
      <StopSearchBar />
    </Container>
  );
};
