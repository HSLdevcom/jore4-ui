import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { FormRow, InputElement } from '../../../common';

const testIds = {
  mainLine: 'StopTypesForm::mainLine',
  interchange: 'StopTypesForm::interchange',
  railReplacement: 'StopTypesForm::railReplacement',
  virtual: 'StopTypesForm::virtual',
};

export const stopTypesSchema = z.object({
  stopTypes: z.object({
    mainLine: z.boolean(),
    virtual: z.boolean(),
    railReplacement: z.boolean(),
    interchange: z.boolean(),
  }),
});

export type StopTypesFormState = z.infer<typeof stopTypesSchema>;

export const StopTypesForm = () => {
  const { watch } = useFormContext();
  const isBusTransportMode =
    watch('transportMode') === StopRegistryTransportModeType.Bus;

  return (
    <FormRow mdColumns={4}>
      <label htmlFor="mainLine" className="inline-flex font-normal">
        <InputElement<StopTypesFormState>
          type="checkbox"
          id="mainLine"
          fieldPath="stopTypes.mainLine"
          className="mr-3.5 h-6 w-6"
          testId={testIds.mainLine}
        />
        {t('stopPlaceTypes.mainLine')}
      </label>
      <label htmlFor="interchange" className="inline-flex font-normal">
        <InputElement<StopTypesFormState>
          type="checkbox"
          id="interchange"
          fieldPath="stopTypes.interchange"
          className="mr-3.5 h-6 w-6"
          testId={testIds.interchange}
        />
        {t('stopPlaceTypes.interchange')}
      </label>
      <label htmlFor="railReplacement" className="inline-flex font-normal">
        <InputElement<StopTypesFormState>
          type="checkbox"
          id="railReplacement"
          fieldPath="stopTypes.railReplacement"
          className="mr-3.5 h-6 w-6"
          testId={testIds.railReplacement}
          disabled={!isBusTransportMode}
        />
        {t('stopPlaceTypes.railReplacement')}
      </label>
      <label htmlFor="virtual" className="inline-flex font-normal">
        <InputElement<StopTypesFormState>
          type="checkbox"
          id="virtual"
          fieldPath="stopTypes.virtual"
          className="mr-3.5 h-6 w-6"
          testId={testIds.virtual}
        />
        {t('stopPlaceTypes.virtual')}
      </label>
    </FormRow>
  );
};
