import { FC } from 'react';
import { FormColumn, FormRow, InputField } from '../../common';
import { StopFormState } from '../types';
import { TimingPlace } from './TimingPlace';

const testIds = {
  latitude: 'StopFormComponent::latitude',
  longitude: 'StopFormComponent::longitude',
  locationFin: 'StopFormComponent::locationFin',
  locationSwe: 'StopFormComponent::locationSwe',
};

type LocationProps = { readonly className?: string };

export const Location: FC<LocationProps> = ({ className }) => {
  return (
    <FormColumn className={className}>
      <FormRow className="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" mdColumns={2}>
        <InputField<StopFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="locationFin"
          testId={testIds.locationFin}
        />
        <InputField<StopFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="locationSwe"
          testId={testIds.locationSwe}
        />
      </FormRow>

      <FormRow className="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" mdColumns={2}>
        <InputField<StopFormState>
          type="number"
          translationPrefix="map"
          fieldPath="latitude"
          testId={testIds.latitude}
          step="any"
        />
        <InputField<StopFormState>
          type="number"
          translationPrefix="map"
          fieldPath="longitude"
          testId={testIds.longitude}
          step="any"
        />
      </FormRow>

      <TimingPlace />
    </FormColumn>
  );
};
