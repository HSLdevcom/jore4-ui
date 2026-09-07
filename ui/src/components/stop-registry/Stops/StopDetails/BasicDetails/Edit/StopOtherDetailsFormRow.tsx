import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JoreStopRegistryTransportModeType } from '../../../../../../types/stop-registry';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../../utils/i18n';
import { SimpleButton } from '../../../../../common/Buttons';
import { EnumDropdown } from '../../../../../common/Dropdowns';
import { InputField } from '../../../../../common/Inputs';
import { Column, FormRow, Row } from '../../../../../common/LayoutComponents';
import { ChooseTimingPlaceDropdown } from '../../../../../forms/stop/TimingPlace';
import { StopBasicDetailsFormState } from './schema';

const testIds = {
  timingPlaceDropdown: 'StopBasicDetailsForm::timingPlaceDropdown',
  addTimingPlaceButton: 'StopBasicDetailsForm::addTimingPlaceButton',
  elyNumber: 'StopBasicDetailsForm::elyNumber',
  transportMode: 'StopBasicDetailsForm::transportMode',
};
type StopOtherDetailsFormRowProps = {
  readonly onClickOpenTimingSettingsModal: () => void;
  readonly isTransportModeLocked?: boolean;
};

export const StopOtherDetailsFormRow: FC<StopOtherDetailsFormRowProps> = ({
  onClickOpenTimingSettingsModal,
  isTransportModeLocked,
}) => {
  const { t } = useTranslation();

  const { watch } = useFormContext();
  const isRailReplacement = !!watch('stopTypes.railReplacement');
  const isTrunkLine = !!watch('stopTypes.trunkLineStop');

  return (
    <FormRow mdColumns={4}>
      <Column>
        {/* Currently we can only have one transportMode, so use dropdown for it.
               Later we need checkboxes here for the transportModes */}
        <InputField<StopBasicDetailsFormState>
          translationPrefix="stopDetails.basicDetails"
          fieldPath="transportMode"
          testId={testIds.transportMode}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<JoreStopRegistryTransportModeType>
              enumType={JoreStopRegistryTransportModeType}
              placeholder={t(($) => $.stopDetails.basicDetails.transportMode)}
              uiNameMapper={(value) =>
                mapStopRegistryTransportModeTypeToUiName(t, value)
              }
              disabled={
                isRailReplacement || isTrunkLine || isTransportModeLocked
              }
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
      </Column>
      <Column>
        <InputField<StopBasicDetailsFormState>
          type="text"
          translationPrefix="stopDetails.basicDetails"
          fieldPath="elyNumber"
          testId={testIds.elyNumber}
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
            className="ml-6 self-end"
            onClick={onClickOpenTimingSettingsModal}
            testId={testIds.addTimingPlaceButton}
            inverted
          >
            {t(($) => $.stops.createTimingPlace)}
          </SimpleButton>
        </Row>
      </Column>
    </FormRow>
  );
};
