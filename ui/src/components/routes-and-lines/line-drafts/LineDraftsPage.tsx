import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { useObservationDateQueryParam, useUrlQuery } from '../../../hooks';
import { useGetLineDraftDetails } from '../../../hooks/line-drafts/useGetLineDraftDetails';
import { Column, Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { CloseIconButton } from '../../../uiComponents';
import { RouteStopsTable } from '../line-details/RouteStopsTable';

export const LineDraftsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { label } = useParams<{ label: string }>();
  const { queryParams } = useUrlQuery();
  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();
  const { routes } = useGetLineDraftDetails();

  const onClose = () => {
    // If there is no returnTo set, we return to 'routes and lines' page
    const pathname = queryParams.returnTo
      ? routeDetails[Path.lineDetails].getLink(queryParams.returnTo as string)
      : routeDetails[Path.routes].getLink();

    history.push({
      pathname,
    });
  };

  const onDateChange = (value: string) => {
    setObservationDateToUrl(value);
  };

  return (
    <Container>
      <Row>
        <h1 className="text-2xl font-bold">
          {`${t('lines.draftsTitle')} | ${t('lines.line', { label })}`}
        </h1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={onClose}
        />
      </Row>
      <Row>
        <h2 className="text-sm font-bold">{t('filters.observationDate')}</h2>
      </Row>
      <Row>
        <Column className="w-1/4">
          <input
            type="date"
            required
            value={observationDate?.toISODate() || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1"
          />
        </Column>
      </Row>

      {routes?.length && observationDate ? (
        <RouteStopsTable routes={routes} observationDate={observationDate} />
      ) : (
        <Row className="py-20">
          <p className="mx-auto flex text-2xl font-bold">
            {t('lines.noDrafts')}
          </p>
        </Row>
      )}
    </Container>
  );
};
