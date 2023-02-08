import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../../generated/graphql';
import { useGetLineDetails } from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';

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

  return (
    <Container className={className}>
      <Row>
        <Column className="w-1/4">
          <ObservationDateControl className="flex-1" />
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
