import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useRoutesAndLinesDraftReturnToQueryParam } from '../../../hooks';
import { useGetLineDraftDetails } from '../../../hooks/line-drafts/useGetLineDraftDetails';
import { Column, Container, Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { RouteStopsTable } from '../line-details/RouteStopsTable';

const testIds = {
  closeButton: 'LineDraftsPage::closeButton',
};

export const LineDraftsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { label } = useParams<{ label: string }>();
  const { routes } = useGetLineDraftDetails();

  const { onClose } = useRoutesAndLinesDraftReturnToQueryParam();

  return (
    <Container>
      <Row>
        <h2>{`${t('lines.draftsTitle')} | ${t('lines.line', { label })}`}</h2>
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
        <RouteStopsTable routes={routes} />
      ) : (
        <Row className="py-20">
          <h2 className="mx-auto flex">{t('lines.noDrafts')}</h2>
        </Row>
      )}
    </Container>
  );
};
