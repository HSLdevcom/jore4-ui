import React, { FC } from 'react';
import { InputField } from './InputField';
import { StopRegistryNamedEntityFormState } from './StopRegistryNamedEntitySchema';

const testIds = {
  nameFin: 'StopRegistryNamedEntityFormFields::nameFin',
  nameSwe: 'StopRegistryNamedEntityFormFields::nameSwe',
  locationFin: 'StopRegistryNamedEntityFormFields::locationFin',
  locationSwe: 'StopRegistryNamedEntityFormFields::locationSwe',
  nameLongFin: 'StopRegistryNamedEntityFormFields::nameLongFin',
  nameLongSwe: 'StopRegistryNamedEntityFormFields::nameLongSwe',
  abbreviationFin: 'StopRegistryNamedEntityFormFields::abbreviationFin',
  abbreviationSwe: 'StopRegistryNamedEntityFormFields::abbreviationSwe',
};

// Was not needed for the Stop Modal. But will be needed to the Stop Area modal.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StopRegistryNamedEntityFormFields: FC = () => {
  return (
    <fieldset>
      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="nameSwe"
        testId={testIds.nameSwe}
      />

      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="locationFin"
        testId={testIds.locationFin}
      />
      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="locationFin"
        testId={testIds.locationSwe}
      />

      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="nameLongFin"
        testId={testIds.nameLongFin}
      />
      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="nameLongSwe"
        testId={testIds.nameLongSwe}
      />

      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="abbreviationFin"
        testId={testIds.abbreviationFin}
      />
      <InputField<StopRegistryNamedEntityFormState>
        type="text"
        translationPrefix="stopRegistryNamedEntity"
        fieldPath="abbreviationSwe"
        testId={testIds.abbreviationSwe}
      />
    </fieldset>
  );
};
