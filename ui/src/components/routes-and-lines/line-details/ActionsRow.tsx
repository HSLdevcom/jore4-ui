import qs from 'qs';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../../generated/graphql';
import { useGetLineDetails } from '../../../hooks';
import { Column, Container } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormRow } from '../../forms/common';

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
      <FormRow mdColumns={2}>
        <ObservationDateControl className="max-w-max" />
        {line && (
          <Column className="items-end justify-end">
            <SimpleButton
              inverted
              href={getDraftsUrlWithReturnToQueryString(line)}
            >
              {t('lines.showDrafts')}
            </SimpleButton>
          </Column>
        )}
      </FormRow>
    </Container>
  );
};
