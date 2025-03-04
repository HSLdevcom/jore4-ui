import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequiredParams } from '../../../../hooks';
import { Container, Row } from '../../../../layoutComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { PageTitle } from '../../../common';
import { StopVersionContainers } from './components/StopVersionContainers';
import { useGetStopVersionPageInfo } from './queries/useGetStopVersionPageInfo';

const testIds = {
  container: 'StopVersionsPage::Container',
  loadingWrapper: 'StopVersionsPage::LoadingWrapper',
};

export const StopVersionsPage: FC = () => {
  const { t } = useTranslation();

  const { label: publicCode } = useRequiredParams<{ label: string }>();
  const { loading, stopVersions, stopPlaceName } =
    useGetStopVersionPageInfo(publicCode);

  const titleText = stopPlaceName?.name
    ? t('stopVersion.titleWithName', { publicCode, name: stopPlaceName.name })
    : t(t('stopVersion.title', { publicCode }));

  return (
    <Container testId={testIds.container}>
      <Row>
        <PageTitle.H1 titleText={titleText}>
          {t('stopVersion.title', { publicCode })}
        </PageTitle.H1>
      </Row>
      <Row>
        {stopPlaceName && (
          <h2>
            <span>{stopPlaceName.name}</span>
            {' - '}
            <span>{stopPlaceName.nameSwe}</span>
          </h2>
        )}
      </Row>

      <LoadingWrapper
        className="flex justify-center"
        loadingText={t('stopVersion.loading')}
        loading={loading}
        testId={testIds.loadingWrapper}
      >
        <StopVersionContainers
          publicCode={publicCode}
          stopVersions={stopVersions}
        />
      </LoadingWrapper>
    </Container>
  );
};
