import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../../layoutComponents';
import {
  JoreStopRegistryTransportModeType,
  StopPlaceState,
} from '../../../../../../types/stop-registry';
import { SimpleButton } from '../../../../../../uiComponents';
import { EnumDropdown, FormRow, InputField } from '../../../../../forms/common';
import { ChooseTimingPlaceDropdown } from '../../../../../forms/stop/ChooseTimingPlaceDropdown';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  timingPlaceDropdown: 'StopBasicDetailsForm::timingPlaceDropdown',
  addTimingPlaceButton: 'StopBasicDetailsForm::addTimingPlaceButton',
  elyNumber: 'StopBasicDetailsForm::elyNumber',
  transportMode: 'StopBasicDetailsForm::transportMode',
  stopPlaceState: 'StopBasicDetailsForm::stopPlaceState',
};
interface Props {
  onClickOpenTimingSettingsModal: () => void;
}

export const StopOtherDetailsFormRow = ({
  onClickOpenTimingSettingsModal,
}: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const isRailReplacement = watch('stopTypes.railReplacement');

  return (
    <FormRow mdColumns={5}>
      <Column>
        {/* Currently we can only have one transportMode, so use dropdown for it.
               Later we need checkboxes here for the transportModes */}
        <InputField<StopBasicDetailsFormState>
          translationPrefix="stopDetails"
          fieldPath="transportMode"
          testId={testIds.transportMode}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<JoreStopRegistryTransportModeType>
              enumType={JoreStopRegistryTransportModeType}
              placeholder={t('stopDetails.transportMode')}
              uiNameMapper={mapStopRegistryTransportModeTypeToUiName}
              disabled={isRailReplacement}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Column>
      <Column className="col-span-2">
        <Row>
          <InputField
            translationPrefix="stops"
            fieldPath="timingPlaceId"
            testId={testIds.timingPlaceDropdown}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <ChooseTimingPlaceDropdown
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
            className="flex-1"
          />
          <SimpleButton
            containerClassName="self-end ml-6"
            onClick={onClickOpenTimingSettingsModal}
            testId={testIds.addTimingPlaceButton}
          >
            {t('stops.createTimingPlace')}
          </SimpleButton>
        </Row>
      </Column>
      <Column>
        {/* TODO: Currently we can only have one transportMode, so we use dropdown for it.
               Later we need custom icon checkbox inputs here for the transportModes */}
        <InputField<StopBasicDetailsFormState>
          translationPrefix="stopDetails"
          fieldPath="stopState"
          testId={testIds.stopPlaceState}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopPlaceState>
              enumType={StopPlaceState}
              placeholder={t('stopDetails.stopState')}
              uiNameMapper={mapStopPlaceStateToUiName}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="elyNumber"
          testId={testIds.elyNumber}
        />
      </Column>
    </FormRow>
  );
};
