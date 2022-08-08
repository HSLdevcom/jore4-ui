import { DateTime } from 'luxon';
import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../../generated/graphql';
import {
  useGetLineDetails,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';

const getDraftsUrlWithReturnToQueryString = (line: RouteLine) => {
  const draftUrl = routeDetails[Path.lineDrafts].getLink(line.label);
  const returnToQueryString = qs.stringify({ returnTo: line.line_id });

  return `${draftUrl}?${returnToQueryString}`;
};

export const ActionsRow = ({
  className = '',
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();

  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();

  const onDateChange = (value: string) => {
    setObservationDateToUrl(DateTime.fromISO(value));
  };

  return (
    <Container className={className}>
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

        {line && (
          <SimpleButton
            containerClassName="ml-auto"
            inverted
            href={getDraftsUrlWithReturnToQueryString(line)}
          >
            {t('lines.showDrafts')}
          </SimpleButton>
        )}
      </Row>
    </Container>
  );
};
