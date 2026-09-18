import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import { Operation, useLoader } from '../../../../redux';
import { showSuccessToast } from '../../../../utils';
import { mapVehicleModeToUiName } from '../../../../utils/i18n';
import { InputField } from '../../../common/Inputs';
import { FormColumn, FormRow } from '../../../common/LayoutComponents';
import { FormActionButtons } from '../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../forms/common/NavigationBlocker';
import { useDefaultErrorHandler } from '../utils';
import { DepotStopFormState, depotStopFormSchema } from './DepotStopFormSchema';
import { useCreateDepotStop } from './useCreateDepotStop';
import { useEditDepotStop } from './useEditDepotStop';

const testIds = {
  label: 'DepotStopForm::label',
  latitude: 'DepotStopForm::latitude',
  longitude: 'DepotStopForm::longitude',
};

type DepotStopFormProps = {
  readonly className?: string;
  readonly editing?: boolean;
  readonly depotStopId?: string;
  readonly defaultValues?: Partial<DepotStopFormState>;
  readonly onCancel: () => void;
  readonly onCreated: () => void;
};

export const DepotStopForm: FC<DepotStopFormProps> = ({
  className,
  editing = false,
  depotStopId,
  defaultValues,
  onCancel,
  onCreated,
}) => {
  const { t } = useTranslation();
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const createDepotStop = useCreateDepotStop();
  const editDepotStop = useEditDepotStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  const methods = useForm<DepotStopFormState>({
    defaultValues: { label: '', ...defaultValues },
    resolver: zodResolver(depotStopFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'DepotStopForm');
  const { handleSubmit } = methods;

  const onFormSubmit = async (state: DepotStopFormState) => {
    setIsLoading(true);

    try {
      if (editing) {
        if (!depotStopId) {
          throw new Error('depotStopId is required when editing');
        }
        await editDepotStop(depotStopId, state);
        showSuccessToast(t(($) => $.stops.editSuccess));
      } else {
        await createDepotStop(state);
        showSuccessToast(t(($) => $.stops.saveSuccess));
      }
      onCreated();
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={twMerge('space-y-4', className)}
      >
        <FormColumn className="bg-background px-4 py-4">
          <span className="text-sm font-bold">
            {t(($) => $.map.depotStopTransportMode)}:{' '}
            {mapVehicleModeToUiName(t, ReusableComponentsVehicleModeEnum.Tram)}
          </span>
        </FormColumn>
        <FormColumn className="px-4 py-2">
          <FormRow className="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" mdColumns={3}>
            <InputField<DepotStopFormState>
              type="text"
              translationPrefix="map"
              customTitlePath="map.depotStopLabel"
              fieldPath="label"
              testId={testIds.label}
              required
            />
            <InputField<DepotStopFormState>
              type="number"
              translationPrefix="map"
              fieldPath="latitude"
              testId={testIds.latitude}
              step="any"
              required
            />
            <InputField<DepotStopFormState>
              type="number"
              translationPrefix="map"
              fieldPath="longitude"
              testId={testIds.longitude}
              step="any"
              required
            />
          </FormRow>
        </FormColumn>
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix="DepotStopForm"
          isDisabled={methods.formState.isSubmitting}
          isSubmitting={methods.formState.isSubmitting}
          variant="modal"
        />
      </form>
    </FormProvider>
  );
};
