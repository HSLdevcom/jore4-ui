import { useTranslation } from 'react-i18next';
import {
  useGetLineDetails,
  useRoutesAndLinesDraftOnClose,
} from '../../../hooks';
import { Column, Container, Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';

export const ActionsRow = ({
  className = '',
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();
  const { getDraftsUrl } = useRoutesAndLinesDraftOnClose();

  return (
    <Container className={className}>
      <Row>
        <Column className="w-1/4">
          <Row className="flex-1">
            <ObservationDateControl />
          </Row>
        </Column>

        {line && (
          <SimpleButton
            containerClassName="ml-auto"
            inverted
            href={getDraftsUrl(line.label, line.line_id)}
          >
            {t('lines.showDrafts')}
          </SimpleButton>
        )}
      </Row>
    </Container>
  );
};
