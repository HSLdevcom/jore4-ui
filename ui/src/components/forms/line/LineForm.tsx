import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { z } from 'zod';
import { Priority } from '../../../types/enums';
import { FormContainer, SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { Row } from '../../common/LayoutComponents';
import {
  ChangeValidityForm,
  FormState as ChangeValidityFormState,
  schema as changeValidityFormSaveFormSchema,
  hasSavableDirtyFields,
  refineValidityPeriodSchema,
} from '../common';
import { useDirtyFormBlockNavigation } from '../common/NavigationBlocker';
import {
  LinePropertiesForm,
  FormState as LinePropertiesFormState,
  schema as linePropertiesFormSchema,
} from './LinePropertiesForm';
import { lineTypesByVehicleMode } from './LineTypeDropdown';

export type FormState = LinePropertiesFormState &
  ChangeValidityFormState & {
    readonly versionComment?: string;
  };

const testIds = {
  saveButton: 'LineForm::saveButton',
  cancelButton: 'LineForm::cancelButton',
  versionComment: 'LineForm::versionComment',
};

const INVALID_LINE_TYPE = 'invalidLineType';

const formSchema = linePropertiesFormSchema
  .merge(changeValidityFormSaveFormSchema)
  .merge(
    z.object({
      versionComment: z.string().optional(),
    }),
  )
  .superRefine(refineValidityPeriodSchema)
  .superRefine((line, ctx) => {
    const validLineTypes = lineTypesByVehicleMode[line.primaryVehicleMode];
    if (!validLineTypes.includes(line.typeOfLine)) {
      ctx.addIssue({
        code: 'custom',
        message: INVALID_LINE_TYPE,
        path: ['typeOfLine'],
      });
    }
  });

type LineFormProps = {
  readonly defaultValues: Partial<FormState>;
  readonly editing?: boolean;
  readonly onSubmit: (state: FormState) => void;
  readonly validityPeriodTitle?: string;
};

export const LineForm: FC<LineFormProps> = ({
  defaultValues,
  editing = false,
  onSubmit,
  validityPeriodTitle,
}) => {
  const navigate = useNavigate();
  const formRef = useRef<ExplicitAny>(null);
  const { t } = useTranslation();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'LineForm');
  const { handleSubmit } = methods;
  const hasSavableChanges = hasSavableDirtyFields({
    dirtyFields: methods.formState.dirtyFields,
    ignoredFields: ['versionComment'],
  });

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    navigate(-1);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        <Row className="mt-10">
          <FormContainer className="w-full p-6">
            <LinePropertiesForm editing={editing} className="m-2" />
          </FormContainer>
        </Row>
        <Row className="mt-2">
          <FormContainer className="w-full p-6">
            <ChangeValidityForm
              className="mb-2 ml-2"
              hiddenPriorities={[Priority.Temporary]} // Line does not have temporary priority, so hide it
              title={validityPeriodTitle}
              versionCommentField={{
                translationPrefix: 'lines',
                customTitlePath: 'reasonForChangeForm.reasonForChange',
                testId: testIds.versionComment,
              }}
            />
          </FormContainer>
        </Row>
        <Row className="mt-8 justify-end gap-5">
          <SimpleButton
            onClick={onCancel}
            inverted
            testId={testIds.cancelButton}
            disabled={methods.formState.isSubmitting}
          >
            {t(($) => $.cancel)}
          </SimpleButton>
          <SimpleButton
            onClick={onSave}
            id="save-button"
            testId={testIds.saveButton}
            disabled={!hasSavableChanges || methods.formState.isSubmitting}
          >
            {t(($) => $.save)}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
