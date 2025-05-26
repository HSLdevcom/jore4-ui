import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { JourneyPatternScheduledStopPointInJourneyPattern } from '../../../generated/graphql';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { defaultLocalizedString, submitFormByRef } from '../../../utils';
import { InputField, localizedStringRequired } from '../../forms/common';

export const schema = z.object({
  viaPointName: localizedStringRequired,
  viaPointShortName: localizedStringRequired,
  isViaPoint: z.boolean(),
});

export type FormState = z.infer<typeof schema>;

type ViaFormProps = {
  readonly defaultValues?: Partial<FormState>;
  readonly className?: string;
  readonly onSubmit: (state: FormState) => void;
  readonly onRemove: () => void;
  readonly onCancel: () => void;
};

const testIds = {
  finnishName: 'ViaForm::finnishName',
  swedishName: 'ViaForm::swedishName',
  finnishShortName: 'ViaForm::finnishShortName',
  swedishShortName: 'ViaForm::swedishShortName',
  saveButton: 'ViaForm::saveButton',
  removeButton: 'ViaForm::removeButton',
};

export const mapStopJourneyPatternToFormState = (
  stopInfo: JourneyPatternScheduledStopPointInJourneyPattern,
) => ({
  isViaPoint: stopInfo.is_via_point,
  viaPointName: defaultLocalizedString(stopInfo.via_point_name_i18n),
  viaPointShortName: defaultLocalizedString(stopInfo.via_point_short_name_i18n),
});

export const ViaForm: FC<ViaFormProps> = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
  onRemove,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className={className}
      >
        <Row className="mb-5 space-x-10">
          <InputField<FormState>
            className="flex-1"
            type="text"
            translationPrefix="viaModal"
            fieldPath="viaPointName.fi_FI"
            testId={testIds.finnishName}
          />
        </Row>
        <Row className="mb-5 space-x-10">
          <InputField<FormState>
            className="flex-1"
            type="text"
            translationPrefix="viaModal"
            fieldPath="viaPointName.sv_FI"
            testId={testIds.swedishName}
          />
        </Row>
        <Row className="mb-5 space-x-10">
          <InputField<FormState>
            className="flex-1"
            type="text"
            translationPrefix="viaModal"
            fieldPath="viaPointShortName.fi_FI"
            testId={testIds.finnishShortName}
          />
        </Row>
        <Row className="mb-5 space-x-10">
          <InputField<FormState>
            className="flex-1"
            type="text"
            translationPrefix="viaModal"
            fieldPath="viaPointShortName.sv_FI"
            testId={testIds.swedishShortName}
          />
        </Row>
        <Row className="space-x-4">
          <SimpleButton onClick={onCancel} inverted>
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            disabled={!defaultValues?.isViaPoint}
            onClick={onRemove}
            inverted
            testId={testIds.removeButton}
          >
            {t('viaModal.removeViaInfo')}
          </SimpleButton>
          <SimpleButton onClick={onSave} testId={testIds.saveButton}>
            {t('viaModal.setViaInfo')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
