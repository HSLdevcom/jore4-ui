import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetLineDetails,
  useRoutesAndLinesDraftReturnToQueryParam,
} from '../../../hooks';
import { Column, Container } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ObservationDateControl } from '../../common/ObservationDateControl';
import { FormRow } from '../../forms/common';

const testIds = {
  showDraftsButton: 'ActionsRow::showDraftsButton',
};

type ActionsRowProps = {
  readonly className?: string;
};

export const ActionsRow: FC<ActionsRowProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  const { line } = useGetLineDetails();
  const { getDraftsUrl } = useRoutesAndLinesDraftReturnToQueryParam();

  return (
    <Container className={className}>
      <FormRow mdColumns={2}>
        <ObservationDateControl className="max-w-max" />
        {line && (
          <Column className="items-end justify-end">
            <SimpleButton
              inverted
              href={getDraftsUrl(line.label, line.line_id)}
              testId={testIds.showDraftsButton}
            >
              {t('lines.showDrafts')}
            </SimpleButton>
          </Column>
        )}
      </FormRow>
    </Container>
  );
};
