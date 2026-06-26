import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TimetablesRouteDirectionEnum } from '../../../generated/graphql';
import { useNavigateBackSafely, useRequiredParams } from '../../../hooks';
import { mapDirectionToUiName } from '../../../i18n/uiNameMappings';
import { Path, routeDetails } from '../../../router/routeDetails';
import { LoadingWrapper } from '../../../uiComponents/LoadingWrapper';
import { PageTitle } from '../../common';
import { CloseIconButton } from '../../common/Buttons';
import { Container, Row } from '../../common/LayoutComponents';
import { RouteVersionContainers } from './components/RouteVersionContainers';
import { useGetRouteVersionPageInfo } from './queries';

const testIds = {
  container: 'RouteVersionsPage::Container',
  loadingWrapper: 'RouteVersionsPage::LoadingWrapper',
  title: 'RouteVersionsPage::title',
  returnButton: 'RouteVersionsPage::returnButton',
  lineName: 'RouteVersionsPage::lineName',
};

export const RouteVersionsPage: FC = () => {
  const { t } = useTranslation();
  const goBack = useNavigateBackSafely();

  const { label, direction } = useRequiredParams<{
    label: string;
    direction: string;
  }>();

  const directionEnum = direction as TimetablesRouteDirectionEnum;

  const pageInfo = useGetRouteVersionPageInfo(label, directionEnum);

  const routeVersions = pageInfo.loading ? [] : pageInfo.routeVersions;
  const lineName = pageInfo.loading ? undefined : pageInfo.lineName;

  const titleText = t(($) => $.routeVersion.title, {
    label,
    direction: mapDirectionToUiName(t, directionEnum),
  });

  return (
    <Container testId={testIds.container}>
      <Row className="items-end justify-between">
        <PageTitle.H1 titleText={titleText} testId={testIds.title}>
          {titleText}
        </PageTitle.H1>

        <CloseIconButton
          className="font-bold text-brand [&>i]:text-xl"
          onClick={() =>
            goBack(routeDetails[Path.lineDetails].getLink(label), {
              replace: true,
            })
          }
          testId={testIds.returnButton}
          label={t(($) => $.versions.goBack)}
        />
      </Row>
      <Row>
        {lineName && (
          <h2 data-testid={testIds.lineName}>
            <span>{lineName}</span>
          </h2>
        )}
      </Row>
      <LoadingWrapper
        className="flex justify-center"
        loadingText={t(($) => $.versions.loading)}
        loading={pageInfo.loading}
        testId={testIds.loadingWrapper}
      >
        <RouteVersionContainers routeVersions={routeVersions} />
      </LoadingWrapper>
    </Container>
  );
};
