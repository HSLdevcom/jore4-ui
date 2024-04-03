import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeSubsetToUiName,
} from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { StopRegistryTransportModeTypeSubset } from '../../../../../types/enums';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { SimpleButton } from '../../../../../uiComponents';
import { EnumDropdown, FormRow, InputField } from '../../../common';
import { ChooseTimingPlaceDropdown } from '../../../stop/ChooseTimingPlaceDropdown';

export const stopOtherDetailsSchema = z.object({
  transportMode: z
    .nativeEnum(StopRegistryTransportModeType)
    .optional()
    .nullable(),
  elyNumber: z.string(),
  timingPlaceId: z.string().uuid().nullable(),
  stopState: z.nativeEnum(StopPlaceState),
});

export type StopOtherDetailsFormState = z.infer<typeof stopOtherDetailsSchema>;
const testIds = {
  timingPlaceDropdown: 'StopOtherDetailsForm::timingPlaceDropdown',
  addTimingPlaceButton: 'StopOtherDetailsForm::addTimingPlaceButton',
  elyNumber: 'StopOtherDetailsForm::elyNumber',
  transportMode: 'StopOtherDetailsForm::transportMode',
  stopPlaceState: 'StopOtherDetailsForm::stopPlaceState',
};
interface Props {
  onClickOpenTimingSettingsModal: () => void;
}

export const StopOtherDetailsForm = ({
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
        <InputField<StopOtherDetailsFormState>
          translationPrefix="stopDetails"
          fieldPath="transportMode"
          testId={testIds.transportMode}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryTransportModeTypeSubset>
              enumType={StopRegistryTransportModeTypeSubset}
              placeholder={t('stopDetails.transportMode')}
              uiNameMapper={mapStopRegistryTransportModeSubsetToUiName}
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
        <InputField<StopOtherDetailsFormState>
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
        <InputField<StopOtherDetailsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath="elyNumber"
          testId={testIds.elyNumber}
        />
      </Column>
    </FormRow>
  );
};
