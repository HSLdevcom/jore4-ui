import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useCreateTimingPlace } from '../../../hooks/timing-places/useCreateTimingPlace';
import { useLoader } from '../../../hooks/ui/useLoader';
import { Row } from '../../../layoutComponents';
import { Operation } from '../../../redux';
import { SimpleButton } from '../../../uiComponents';
import {
  showDangerToast,
  showSuccessToast,
  submitFormByRef,
} from '../../../utils';
import {
  FormRow,
  InputField,
  localizedStringOptional,
  requiredString,
} from '../common';

const testIds = {
  label: 'CreateTimingPlaceForm::label',
  finnishDescription: 'CreateTimingPlaceForm::finnishDescription',
  submitButton: 'CreateTimingPlaceForm::submitButton',
  cancelButton: 'CreateTimingPlaceForm::cancelButton',
};

const schema = z.object({
  label: requiredString,
  description: localizedStringOptional,
});

type CreateTimingPlaceFormProps = {
  readonly className?: string;
  readonly onCancel: () => void;
  readonly onTimingPlaceCreated: (timingPlaceId: UUID) => void;
};

export type FormState = z.infer<typeof schema>;

export const CreateTimingPlaceForm: FC<CreateTimingPlaceFormProps> = ({
  className = '',
  onCancel,
  onTimingPlaceCreated,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const { setIsLoading } = useLoader(Operation.SaveTimingPlace);

  const {
    prepareCreate,
    mapCreateChangesToVariables,
    insertTimingPlaceMutation,
    defaultErrorHandler,
  } = useCreateTimingPlace();

  const defaultValues = { label: '', description: { fi_FI: '', sv_FI: '' } };

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { handleSubmit } = methods;

  const onCreate = async (state: FormState) =>
    prepareCreate({
      input: {
        ...state,
      },
    });

  const onFormSubmit = async (state: FormState) => {
    setIsLoading(true);

    try {
      const changes = await onCreate(state);

      if (changes.conflicts?.length) {
        showDangerToast(t('timingPlaces.labelReserved'));
        return;
      }

      const variables = mapCreateChangesToVariables(changes);
      const createResponse = await insertTimingPlaceMutation(variables);

      showSuccessToast(t('timingPlaces.saveSuccess'));

      const createdTimingPlaceId =
        // If creation is successful, response contains created timing place.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        createResponse.data!.insert_timing_pattern_timing_place_one!
          .timing_place_id;

      onTimingPlaceCreated(createdTimingPlaceId);
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        ref={formRef}
        className={`space-y-4 ${className}`}
      >
        <FormRow>
          <InputField<FormState>
            type="text"
            translationPrefix="timingPlaces"
            fieldPath="label"
            testId={testIds.label}
          />
        </FormRow>
        <FormRow>
          <InputField<FormState>
            type="text"
            translationPrefix="timingPlaces"
            fieldPath="description.fi_FI"
            testId={testIds.finnishDescription}
          />
        </FormRow>
        <Row className="justify-end space-x-4">
          <SimpleButton
            inverted
            onClick={onCancel}
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton onClick={onSave} testId={testIds.submitButton}>
            {t('timingPlaces.create')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
