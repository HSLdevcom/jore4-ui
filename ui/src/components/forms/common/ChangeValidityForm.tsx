import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import {
  PriorityForm,
  PriorityFormState,
  priorityFormSchema,
} from './PriorityForm';
import {
  ValidityPeriodForm,
  ValidityPeriodFormState,
  validityPeriodFormSchema,
} from './ValidityPeriodForm';

export const schema = validityPeriodFormSchema.merge(priorityFormSchema);

export type FormState = ValidityPeriodFormState & PriorityFormState;

const testIds = {
  container: 'ChangeValidityForm::container',
  priorityButton: (priorityLabel: string) =>
    `ChangeValidityForm::${priorityLabel}PriorityButton`,
};

type ChangeValidityFormProps = {
  readonly className?: string;
  readonly hiddenPriorities?: ReadonlyArray<Priority>;
  readonly dateInputRowClassName?: string;
};

/**
 * Component for selecting priority and validity period for an entity (e.g. line, route, stop).
 * Can be merged with other forms.
 */
export const ChangeValidityForm: FC<ChangeValidityFormProps> = ({
  className = '',
  hiddenPriorities,
  dateInputRowClassName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className} data-testid={testIds.container}>
      <h3>{t('saveChangesModal.validityPeriod')}</h3>
      <Row className="mb-4 pt-6">
        <PriorityForm hiddenPriorities={hiddenPriorities} />
      </Row>
      <ValidityPeriodForm dateInputRowClassName={dateInputRowClassName} />
    </div>
  );
};
