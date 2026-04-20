import { FieldValues, Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../i18n';
import { Row } from '../../../layoutComponents';
import { Priority } from '../../../types/enums';
import { FormRow } from './FormRow';
import { InputField } from './InputField';
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

type VersionCommentFieldProps = {
  readonly translationPrefix: TranslationKey;
  readonly testId: string;
  readonly customTitlePath?: TranslationKey;
};

const testIds = {
  container: 'ChangeValidityForm::container',
  priorityButton: (priorityLabel: string) =>
    `ChangeValidityForm::${priorityLabel}PriorityButton`,
};

type ChangeValidityFormProps = {
  readonly className?: string;
  readonly hiddenPriorities?: ReadonlyArray<Priority>;
  readonly dateInputRowClassName?: string;
  readonly modalLayout?: boolean;
  readonly title?: string;
  readonly versionCommentField?: VersionCommentFieldProps;
};

/**
 * Component for selecting priority and validity period for an entity (e.g. line, route, stop).
 * Can be merged with other forms.
 */
export const ChangeValidityForm = <TFormState extends FieldValues = FormState>({
  className,
  hiddenPriorities,
  dateInputRowClassName,
  modalLayout = false,
  title,
  versionCommentField,
}: ChangeValidityFormProps) => {
  const { t } = useTranslation();

  return (
    <div className={className} data-testid={testIds.container}>
      <h3>{title ?? t(($) => $.saveChangesModal.validityPeriod)}</h3>
      <div className={modalLayout ? undefined : 'w-full lg:w-fit'}>
        {versionCommentField && (
          <FormRow className="mb-4 pt-6 md:gap-x-4" mdColumns={1} smColumns={1}>
            <InputField<TFormState>
              type="text"
              translationPrefix={versionCommentField.translationPrefix}
              customTitlePath={versionCommentField.customTitlePath}
              fieldPath={'versionComment' as Path<TFormState>}
              testId={versionCommentField.testId}
            />
          </FormRow>
        )}
        {modalLayout ? (
          <>
            <Row className="mb-4 pt-6">
              <PriorityForm hiddenPriorities={hiddenPriorities} />
            </Row>
            <ValidityPeriodForm dateInputRowClassName={dateInputRowClassName} />
          </>
        ) : (
          <Row className="mb-4 items-start gap-6 pt-2">
            <PriorityForm
              hiddenPriorities={hiddenPriorities}
              priorityButtonClassName="w-auto min-w-[128px] shrink-0 grow-0"
            />
            <ValidityPeriodForm dateInputRowClassName={dateInputRowClassName} />
          </Row>
        )}
      </div>
    </div>
  );
};
