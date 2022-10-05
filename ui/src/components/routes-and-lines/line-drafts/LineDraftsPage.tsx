import { DateTime } from 'luxon';
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
    setObservationDateToUrl(DateTime.fromISO(value));
  };

  const dateInputId = 'observation-date-input';

  return (
    <Container>
      <Row>
        <h2>{`${t('lines.draftsTitle')} | ${t('lines.line', { label })}`}</h2>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={onClose}
        />
      </Row>
      <Row>
        <Column className="w-1/4">
          <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
          <input
            type="date"
            required
            value={observationDate.toISODate() || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1"
            id={dateInputId}
          />
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
