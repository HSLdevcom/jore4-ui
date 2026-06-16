import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { StopRegistryTransportModeType } from '../../../../../../generated/graphql';
import { FormRow, InputElement } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  railReplacement: 'StopBasicDetailsForm::railReplacement',
  virtual: 'StopBasicDetailsForm::virtual',
  trunkLineStop: 'StopBasicDetailsForm::trunkLineStop',
  speedTramStop: 'StopBasicDetailsForm::speedTramStop',
};

export const StopTypesFormRow: FC = () => {
  const { watch } = useFormContext();

  const transportMode = watch('transportMode');
  const isBusStop = transportMode === StopRegistryTransportModeType.Bus;
  const isTramStop = transportMode === StopRegistryTransportModeType.Tram;

  return (
    <FormRow mdColumns={4}>
      <label htmlFor="railReplacement" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="railReplacement"
          fieldPath="stopTypes.railReplacement"
          className="mr-3.5 h-6 w-6"
          testId={testIds.railReplacement}
          disabled={!isBusStop}
        />
        {t(($) => $.stopPlaceTypes.railReplacement)}
      </label>
      <label htmlFor="virtual" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="virtual"
          fieldPath="stopTypes.virtual"
          className="mr-3.5 h-6 w-6"
          testId={testIds.virtual}
        />
        {t(($) => $.stopPlaceTypes.virtual)}
      </label>
      <label htmlFor="trunkLineStop" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="trunkLineStop"
          fieldPath="stopTypes.trunkLineStop"
          className="mr-3.5 h-6 w-6"
          testId={testIds.trunkLineStop}
          disabled={!isBusStop}
        />
        {t(($) => $.stopPlaceTypes.trunkLineStop)}
      </label>
      <label htmlFor="speedTramStop" className="inline-flex font-normal">
        <InputElement<StopBasicDetailsFormState>
          type="checkbox"
          id="speedTramStop"
          fieldPath="stopTypes.speedTramStop"
          className="mr-3.5 h-6 w-6"
          testId={testIds.speedTramStop}
          disabled={!isTramStop}
        />
        {t(($) => $.stopPlaceTypes.speedTramStop)}
      </label>
    </FormRow>
  );
};
