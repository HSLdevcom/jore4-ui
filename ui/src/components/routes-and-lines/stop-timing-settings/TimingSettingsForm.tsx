import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ScheduledStopPointWithTimingSettingsFragment } from '../../../generated/graphql';
import { Row } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { InputElement } from '../../forms/common';

export const schema = z.object({
  isUsedAsTimingPoint: z.boolean(),
  isRegulatedTimingPoint: z.boolean(),
  isLoadingTimeAllowed: z.boolean(),
});

export type FormState = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormState>;
  className?: string;
  onSubmit: (state: FormState) => void;
  onCancel: () => void;
  stopHasTimingPlace: boolean;
}

const testIds = {
  isUsedAsTimingPoint: 'TimingSettingsForm::isUsedAsTimingPoint',
  isRegulatedTimingPoint: 'TimingSettingsForm::isRegulatedTimingPoint',
  isLoadingTimeAllowed: 'TimingSettingsForm::isLoadingTimeAllowed',
  saveButton: 'TimingSettingsForm::saveButton',
};

export const mapStopJourneyPatternToFormState = (
  stopInfo: ScheduledStopPointWithTimingSettingsFragment,
) => ({
  isUsedAsTimingPoint: stopInfo.is_used_as_timing_point,
  isRegulatedTimingPoint: stopInfo.is_regulated_timing_point,
  isLoadingTimeAllowed: stopInfo.is_loading_time_allowed,
});

export const TimingSettingsForm = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
  stopHasTimingPlace,
}: Props): JSX.Element => {
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
        <Row>
          <label
            htmlFor="isUsedAsTimingPoint"
            className="inline-flex font-normal"
          >
            <InputElement<FormState>
              type="checkbox"
              id="isUsedAsTimingPoint"
              fieldPath="isUsedAsTimingPoint"
              className="mr-3.5 h-6 w-6"
              testId={testIds.isUsedAsTimingPoint}
              disabled={!stopHasTimingPlace}
            />
            {t('timingSettingsModal.isUsedAsTimingPoint')}
          </label>
        </Row>
        <Row>
          <label
            htmlFor="isRegulatedTimingPoint"
            className="mt-3.5 inline-flex font-normal"
          >
            <InputElement<FormState>
              type="checkbox"
              id="isRegulatedTimingPoint"
              fieldPath="isRegulatedTimingPoint"
              testId={testIds.isRegulatedTimingPoint}
              className="mr-3.5 h-6 w-6"
            />
            {t('timingSettingsModal.isRegulatedTimingPoint')}
          </label>
        </Row>
        <Row>
          <label
            htmlFor="isLoadingTimeAllowed"
            className="mt-3.5 inline-flex font-normal"
          >
            <InputElement<FormState>
              type="checkbox"
              id="isLoadingTimeAllowed"
              fieldPath="isLoadingTimeAllowed"
              testId={testIds.isLoadingTimeAllowed}
              className="mr-3.5 h-6 w-6"
            />
            {t('timingSettingsModal.isLoadingTimeAllowed')}
          </label>
        </Row>
        <Row className="mt-4 space-x-4">
          <SimpleButton onClick={onCancel} inverted>
            {t('cancel')}
          </SimpleButton>

          <SimpleButton onClick={onSave} testId={testIds.saveButton}>
            {t('save')}
          </SimpleButton>
        </Row>
      </form>
    </FormProvider>
  );
};
