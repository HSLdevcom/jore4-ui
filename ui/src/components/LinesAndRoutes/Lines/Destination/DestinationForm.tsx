import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ScheduledStopPointInJourneyPatternAllFieldsFragment } from '../../../../generated/graphql';
import { defaultLocalizedString } from '../../../../utils';
import { SimpleButton } from '../../../common/Buttons';
import {
  localizedStringRequired,
  submitFormByRef,
} from '../../../common/Forms';
import { useDirtyFormBlockNavigation } from '../../../common/Forms/NavigationBlocker';
import { InputField } from '../../../common/Inputs';
import { Row } from '../../../common/LayoutComponents';

const testIds = {
  finnishName: 'DestinationForm::finnishName',
  swedishName: 'DestinationForm::swedishName',
  finnishShortName: 'DestinationForm::finnishShortName',
  swedishShortName: 'DestinationForm::swedishShortName',
  removeButton: 'DestinationForm::removeButton',
  saveButton: 'DestinationForm::saveButton',
};

export const destinationSchema = z.object({
  name: localizedStringRequired,
  shortName: localizedStringRequired,
  isDestinationPoint: z.boolean(),
});

export type DestinationFormState = z.infer<typeof destinationSchema>;

type DestinationFormProps = {
  readonly defaultValues: DestinationFormState;
  readonly className?: string;
  readonly isSaving: boolean;
  readonly onSubmit: (state: DestinationFormState) => Promise<void>;
  readonly onRemove: () => void;
  readonly onCancel: () => void;
};

export function mapStopJourneyPatternToFormState(
  stopInfo: ScheduledStopPointInJourneyPatternAllFieldsFragment,
): DestinationFormState {
  return {
    isDestinationPoint: stopInfo.is_destination_point,
    name: defaultLocalizedString(stopInfo.destination_point_name_i18n),
    shortName: defaultLocalizedString(
      stopInfo.destination_point_short_name_i18n,
    ),
  };
}

export const DestinationForm: FC<DestinationFormProps> = ({
  defaultValues,
  className,
  isSaving,
  onSubmit,
  onRemove,
  onCancel,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const methods = useForm<DestinationFormState>({
    defaultValues,
    resolver: zodResolver(destinationSchema),
  });

  useDirtyFormBlockNavigation(methods.formState, 'DestinationForm');

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
        className={className}
      >
        <fieldset disabled={isSaving}>
          <Row className="mb-5 gap-10">
            <InputField<DestinationFormState>
              className="flex-1"
              type="text"
              translationPrefix="destinationModal"
              fieldPath="name.fi_FI"
              testId={testIds.finnishName}
              required
            />
          </Row>
          <Row className="mb-5 gap-10">
            <InputField<DestinationFormState>
              className="flex-1"
              type="text"
              translationPrefix="destinationModal"
              fieldPath="shortName.fi_FI"
              testId={testIds.finnishShortName}
              required
            />
          </Row>
          <Row className="mb-5 gap-10">
            <InputField<DestinationFormState>
              className="flex-1"
              type="text"
              translationPrefix="destinationModal"
              fieldPath="name.sv_FI"
              testId={testIds.swedishName}
              required
            />
          </Row>
          <Row className="mb-5 gap-10">
            <InputField<DestinationFormState>
              className="flex-1"
              type="text"
              translationPrefix="destinationModal"
              fieldPath="shortName.sv_FI"
              testId={testIds.swedishShortName}
              required
            />
          </Row>
          <Row className="gap-4">
            <SimpleButton onClick={onCancel} inverted>
              {t(($) => $.cancel)}
            </SimpleButton>
            <SimpleButton
              onClick={onRemove}
              disabled={!defaultValues.isDestinationPoint}
              inverted
              testId={testIds.removeButton}
            >
              {t(($) => $.remove)}
            </SimpleButton>
            <SimpleButton
              onClick={() => submitFormByRef(formRef)}
              testId={testIds.saveButton}
            >
              {t(($) => $.save)}
            </SimpleButton>
          </Row>
        </fieldset>
      </form>
    </FormProvider>
  );
};
