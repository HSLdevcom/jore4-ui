import { useTranslation } from 'react-i18next';
import { mapStopPlaceStateToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column } from '../../../../../../layoutComponents';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { EnumDropdown, FormRow, InputField } from '../../../../../forms/common';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  label: 'StopBasicDetailsForm::label',
  privateCode: 'StopBasicDetailsForm::privateCode',
  locationFin: 'StopBasicDetailsForm::locationFin',
  locationSwe: 'StopBasicDetailsForm::locationSwe',
  stopPlaceState: 'StopBasicDetailsForm::stopPlaceState',
};

export const StopLabelAndLocationFormRow = () => {
  const { t } = useTranslation();
  return (
    <>
      <h3>{t('stopDetails.basicDetails.stopInformation')}</h3>
      <FormRow mdColumns={5}>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="label"
            // TODO: This is disabled until we add a confirmation dialog, because changing
            // the label of a stop will remove it from routes.
            disabled
            testId={testIds.label}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="privateCode"
            testId={testIds.privateCode}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="locationFin"
            testId={testIds.locationFin}
          />
        </Column>
        <Column>
          <InputField<StopBasicDetailsFormState>
            type="text"
            translationPrefix="stopDetails.basicDetails"
            fieldPath="locationSwe"
            testId={testIds.locationSwe}
          />
        </Column>
        <Column>
          {/* TODO: Currently we can only have one transportMode, so we use dropdown for it.
               Later we need custom icon checkbox inputs here for the transportModes */}
          <InputField<StopBasicDetailsFormState>
            translationPrefix="stopDetails.basicDetails"
            fieldPath="stopState"
            testId={testIds.stopPlaceState}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<StopPlaceState>
                enumType={StopPlaceState}
                placeholder={t('stopDetails.basicDetails.stopState')}
                uiNameMapper={mapStopPlaceStateToUiName}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </Column>
      </FormRow>
    </>
  );
};
