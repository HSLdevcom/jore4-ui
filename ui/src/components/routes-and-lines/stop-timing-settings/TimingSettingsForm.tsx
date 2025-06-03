import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ScheduledStopPointWithTimingSettingsFragment } from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks/redux';
import { Row } from '../../../layoutComponents';
import { openTimingPlaceModalAction } from '../../../redux';
import { SimpleButton } from '../../../uiComponents';
import { submitFormByRef } from '../../../utils';
import { InputElement, InputField } from '../../forms/common';
import { useDirtyFormBlockNavigation } from '../../forms/common/NavigationBlocker';
import { ChooseTimingPlaceDropdown } from '../../forms/stop/ChooseTimingPlaceDropdown';

export const schema = z.object({
  isUsedAsTimingPoint: z.boolean(),
  isRegulatedTimingPoint: z.boolean(),
  isLoadingTimeAllowed: z.boolean(),
  timingPlaceId: z.string().uuid().nullable(),
});

export type FormState = z.infer<typeof schema>;

type TimingSettingsFormProps = {
  readonly defaultValues?: Partial<FormState>;
  readonly className?: string;
  readonly onSubmit: (state: FormState) => void;
  readonly onCancel: () => void;
};

const testIds = {
  isUsedAsTimingPoint: 'TimingSettingsForm::isUsedAsTimingPoint',
  isRegulatedTimingPoint: 'TimingSettingsForm::isRegulatedTimingPoint',
  isLoadingTimeAllowed: 'TimingSettingsForm::isLoadingTimeAllowed',
  saveButton: 'TimingSettingsForm::saveButton',
  timingPlaceDropdown: 'TimingSettingsForm::timingPlaceDropdown',
  addTimingPlaceButton: 'TimingSettingsForm::addTimingPlaceButton',
};

export const mapStopJourneyPatternToFormState = (
  stopInfo: ScheduledStopPointWithTimingSettingsFragment,
) => ({
  isUsedAsTimingPoint: stopInfo.is_used_as_timing_point,
  isRegulatedTimingPoint: stopInfo.is_regulated_timing_point,
  isLoadingTimeAllowed: stopInfo.is_loading_time_allowed,
  timingPlaceId: stopInfo?.scheduled_stop_points[0].timing_place_id,
});

export const TimingSettingsForm: FC<TimingSettingsFormProps> = ({
  defaultValues,
  className = '',
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const dispatch = useAppDispatch();

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'TimingSettingsForm');

  const { handleSubmit, watch, setValue } = methods;

  const onSave = () => {
    submitFormByRef(formRef);
  };
  const { isUsedAsTimingPoint, isRegulatedTimingPoint, timingPlaceId } =
    watch();

  useEffect(() => {
    if (!isUsedAsTimingPoint) {
      setValue('isRegulatedTimingPoint', false);
    }
  }, [isUsedAsTimingPoint, setValue]);

  useEffect(() => {
    if (!isRegulatedTimingPoint) {
      setValue('isLoadingTimeAllowed', false);
    }
  }, [isRegulatedTimingPoint, setValue]);

  useEffect(() => {
    if (!timingPlaceId) {
      setValue('isUsedAsTimingPoint', false);
    }
  }, [timingPlaceId, setValue]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
        className={className}
      >
        <Row>
          <InputField
            translationPrefix="stops"
            fieldPath="timingPlaceId"
            testId={testIds.timingPlaceDropdown}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <ChooseTimingPlaceDropdown
                optionAmount={4}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
            className="w-[400px] max-w-full flex-1"
          />
          <SimpleButton
            containerClassName="self-end ml-6"
            onClick={() => dispatch(openTimingPlaceModalAction())}
            testId={testIds.addTimingPlaceButton}
          >
            {t('stops.createTimingPlace')}
          </SimpleButton>
        </Row>
        <Row>
          <label
            htmlFor="isUsedAsTimingPoint"
            className="mt-6 inline-flex font-normal"
          >
            <InputElement<FormState>
              type="checkbox"
              id="isUsedAsTimingPoint"
              fieldPath="isUsedAsTimingPoint"
              className="mr-3.5 h-6 w-6"
              testId={testIds.isUsedAsTimingPoint}
              disabled={!timingPlaceId}
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
              disabled={!isUsedAsTimingPoint}
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
              disabled={!isRegulatedTimingPoint}
              testId={testIds.isLoadingTimeAllowed}
              className="mr-3.5 h-6 w-6"
            />
            {t('timingSettingsModal.isLoadingTimeAllowed')}
          </label>
        </Row>
        <Row className="mt-4 space-x-4">
          <SimpleButton
            onClick={onCancel}
            inverted
            containerClassName="ml-auto"
          >
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
