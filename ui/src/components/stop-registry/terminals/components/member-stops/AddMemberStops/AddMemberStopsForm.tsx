import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { SelectTerminalMemberStopsDropdown } from '../../location-details/member-stops';
import { useAddMemberStopsFormUtils } from './useAddMemberStopsFormUtils';

const testIds = {
  memberStops: 'AddMemberStopsForm::memberStops',
};

type AddMemberStopsFormProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly onSuccess: () => void;
  readonly onError: () => void;
};

const AddMemberStopsFormImpl: ForwardRefRenderFunction<
  HTMLFormElement,
  AddMemberStopsFormProps
> = ({ terminal, onSuccess, onError }, ref) => {
  const { t } = useTranslation();
  const { methods, onFormSubmit } = useAddMemberStopsFormUtils(terminal);

  const {
    field: { value: selectedStops, onChange: onSelectedStopsChange },
  } = useController({
    name: 'selectedStops',
    control: methods.control,
  });

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className="mx-8 my-8"
        onSubmit={methods.handleSubmit((state) =>
          onFormSubmit(state, onSuccess, onError),
        )}
        ref={ref}
      >
        <div className="mb-2 text-sm font-bold">
          {t('terminalDetails.location.memberStopsTotal', {
            total: selectedStops.length,
          })}
        </div>

        <SelectTerminalMemberStopsDropdown
          value={selectedStops}
          onChange={onSelectedStopsChange}
          testId={testIds.memberStops}
        />
      </form>
    </FormProvider>
  );
};

export const AddMemberStopsForm = forwardRef(AddMemberStopsFormImpl);
