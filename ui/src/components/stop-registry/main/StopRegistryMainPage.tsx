import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { StopSearchBar } from '../search/StopSearchBar';

const testIds = {
  createStopButton: 'StopRegistryMainPage::createStopButton',
};

export const StopRegistryMainPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <Row className="justify-between">
        <h1>{t('stops.stops')}</h1>
        <div className="space-x-4">
          <SimpleButton
            id="create-stop-button"
            testId={testIds.createStopButton}
            href="/"
            disabled
          >
            {t('stops.createStop')}
          </SimpleButton>
        </div>
      </Row>
      <StopSearchBar />
    </Container>
  );
};
