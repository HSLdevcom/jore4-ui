import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { FormRow, InputElement } from '../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  mainLine: 'StopBasicDetailsForm::mainLine',
  interchange: 'StopBasicDetailsForm::interchange',
  railReplacement: 'StopBasicDetailsForm::railReplacement',
  virtual: 'StopBasicDetailsForm::virtual',
};

export const StopTypesFormRow = () => {
  const { watch } = useFormContext();
  const isBusTransportMode =
    watch('transportMode') === StopRegistryTransportModeType.Bus;

  return (
    <FormRow mdColumns={4}>
      <label htmlFor="mainLine" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="mainLine"
          fieldPath="stopTypes.mainLine"
          className="mr-3.5 h-6 w-6"
          testId={testIds.mainLine}
        />
        {t('stopPlaceTypes.mainLine')}
      </label>
      <label htmlFor="interchange" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="interchange"
          fieldPath="stopTypes.interchange"
          className="mr-3.5 h-6 w-6"
          testId={testIds.interchange}
        />
        {t('stopPlaceTypes.interchange')}
      </label>
      <label htmlFor="railReplacement" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
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
        <InputElement<StopBasicDetailsFormState>
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
