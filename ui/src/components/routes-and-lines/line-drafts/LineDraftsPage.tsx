import { useTranslation } from 'react-i18next';
import {
  useRequiredParams,
  useRoutesAndLinesDraftReturnToQueryParam,
} from '../../../hooks';
import { useGetLineDraftDetails } from '../../../hooks/line-drafts/useGetLineDraftDetails';
import { Column, Container, Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { PageTitle } from '../../common';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { LineRouteList } from '../line-details/LineRouteList';

const testIds = {
  closeButton: 'LineDraftsPage::closeButton',
};

export const LineDraftsPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const { label } = useRequiredParams<{ label: string }>();
  const { routes } = useGetLineDraftDetails();

  const { onClose } = useRoutesAndLinesDraftReturnToQueryParam();

  return (
    <Container>
      <Row>
        <PageTitle.H1>{`${t('lines.draftsTitle')} | ${t('lines.line', { label })}`}</PageTitle.H1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={onClose}
          testId={testIds.closeButton}
        />
      </Row>
      <Row>
        <Column className="w-1/4">
          <ObservationDateControl className="flex-1" />
        </Column>
      </Row>

      {routes?.length ? (
        <LineRouteList routes={routes} />
      ) : (
        <Row className="py-20">
          <h2 className="mx-auto flex">{t('lines.noDrafts')}</h2>
        </Row>
      )}
    </Container>
  );
};
