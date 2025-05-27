import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import {
  mapStopRegistryGuidanceTypeToUiName,
  mapStopRegistryMapTypeToUiName,
  mapStopRegistryPedestrianCrossingRampTypeToUiName,
  mapStopRegistryShelterWidthTypeToUiName,
  mapStopRegistryStopTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import {
  EnumDropdown,
  InputField,
  NullableBooleanDropdown,
} from '../../../../forms/common';
import { MeasurementsFormState, measurementsFormSchema } from './schema';

const testIds = {
  container: 'MeasurementsForm::container',
  stopType: 'MeasurementsForm::stopType',
  curvedStop: 'MeasurementsForm::curvedStop',
  shelterType: 'MeasurementsForm::shelterType',
  shelterLaneDistance: 'MeasurementsForm::shelterLaneDistance',
  curbBackOfRailDistance: 'MeasurementsForm::curbBackOfRailDistance',
  stopAreaSideSlope: 'MeasurementsForm::stopAreaSideSlope',
  stopAreaLengthwiseSlope: 'MeasurementsForm::stopAreaLengthwiseSlope',
  structureLaneDistance: 'MeasurementsForm::structureLaneDistance',
  stopElevationFromRailTop: 'MeasurementsForm::stopElevationFromRailTop',
  stopElevationFromSidewalk: 'MeasurementsForm::stopElevationFromSidewalk',
  lowerCleatHeight: 'MeasurementsForm::lowerCleatHeight',
  curbDriveSideOfRailDistance: 'MeasurementsForm::curbDriveSideOfRailDistance',
  endRampSlope: 'MeasurementsForm::endRampSlope',
  serviceAreaWidth: 'MeasurementsForm::serviceAreaWidth',
  serviceAreaLength: 'MeasurementsForm::serviceAreaLength',
  pedestrianCrossingRampType: 'MeasurementsForm::pedestrianCrossingRampType',
  stopAreaSurroundingsAccessible:
    'MeasurementsForm::stopAreaSurroundingsAccessible',
  guidanceType: 'MeasurementsForm::guidanceType',
  mapType: 'MeasurementsForm::mapType',
  platformEdgeWarningArea: 'MeasurementsForm::platformEdgeWarningArea',
  sidewalkAccessibleConnection:
    'MeasurementsForm::sidewalkAccessibleConnection',
  guidanceStripe: 'MeasurementsForm::guidanceStripe',
  serviceAreaStripes: 'MeasurementsForm::serviceAreaStripes',
  guidanceTiles: 'MeasurementsForm::guidanceTiles',
};

type MeasurementsFormComponentProps = {
  readonly className?: string;
  readonly defaultValues: Partial<MeasurementsFormState>;
  readonly onSubmit: (state: MeasurementsFormState) => void;
};

const MeasurementsFormComponent = (
  { className = '', defaultValues, onSubmit }: MeasurementsFormComponentProps,
  ref: ExplicitAny,
): React.ReactElement => {
  const { t } = useTranslation();
  const methods = useForm<MeasurementsFormState>({
    defaultValues,
    resolver: zodResolver(measurementsFormSchema),
  });
  const { handleSubmit } = methods;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <Column className="space-y-4">
          <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="stopType"
              testId={testIds.stopType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryStopType>
                  enumType={StopRegistryStopType}
                  placeholder={t('unknown')}
                  uiNameMapper={(value) =>
                    mapStopRegistryStopTypeToUiName(t, value)
                  }
                  includeNullOption
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="curvedStop"
              testId={testIds.curvedStop}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="shelterType"
              testId={testIds.shelterType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryShelterWidthType>
                  enumType={StopRegistryShelterWidthType}
                  placeholder={t('unknown')}
                  uiNameMapper={(value) =>
                    mapStopRegistryShelterWidthTypeToUiName(t, value)
                  }
                  includeNullOption
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="shelterLaneDistance"
              className="max-w-36"
              inputClassName="w-20"
              testId={testIds.shelterLaneDistance}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="curbBackOfRailDistance"
              className="max-w-36"
              inputClassName="w-20"
              testId={testIds.curbBackOfRailDistance}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              fieldPath="stopAreaSideSlope"
              className="max-w-32"
              inputClassName="w-20"
              testId={testIds.stopAreaSideSlope}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="stopAreaLengthwiseSlope"
              className="max-w-32"
              inputClassName="w-20"
              testId={testIds.stopAreaLengthwiseSlope}
            />
          </Row>
          <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="structureLaneDistance"
              className="max-w-44"
              inputClassName="w-20"
              testId={testIds.structureLaneDistance}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="stopElevationFromRailTop"
              className="max-w-40"
              inputClassName="w-20"
              testId={testIds.stopElevationFromRailTop}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="stopElevationFromSidewalk"
              className="max-w-48"
              inputClassName="w-20"
              testId={testIds.stopElevationFromSidewalk}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="lowerCleatHeight"
              className="max-w-24"
              testId={testIds.lowerCleatHeight}
            />
          </Row>
          <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="platformEdgeWarningArea"
              testId={testIds.platformEdgeWarningArea}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="sidewalkAccessibleConnection"
              testId={testIds.sidewalkAccessibleConnection}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="guidanceStripe"
              testId={testIds.guidanceStripe}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="serviceAreaStripes"
              testId={testIds.serviceAreaStripes}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="guidanceType"
              testId={testIds.guidanceType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryGuidanceType>
                  enumType={StopRegistryGuidanceType}
                  placeholder={t('unknown')}
                  uiNameMapper={(value) =>
                    mapStopRegistryGuidanceTypeToUiName(t, value)
                  }
                  includeNullOption
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="guidanceTiles"
              testId={testIds.guidanceTiles}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="mapType"
              testId={testIds.mapType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryMapType>
                  enumType={StopRegistryMapType}
                  placeholder={t('unknown')}
                  uiNameMapper={(value) =>
                    mapStopRegistryMapTypeToUiName(t, value)
                  }
                  includeNullOption
                  buttonClassName="min-w-32"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
          </Row>
          <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="curbDriveSideOfRailDistance"
              className="max-w-44"
              inputClassName="w-20"
              testId={testIds.curbDriveSideOfRailDistance}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              fieldPath="endRampSlope"
              className="max-w-20"
              inputClassName="w-20"
              testId={testIds.endRampSlope}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="serviceAreaWidth"
              className="max-w-24"
              inputClassName="w-20"
              testId={testIds.serviceAreaWidth}
            />
            <InputField<MeasurementsFormState>
              type="number"
              translationPrefix="stopDetails.measurements"
              min={0}
              fieldPath="serviceAreaLength"
              className="max-w-24"
              inputClassName="w-20"
              testId={testIds.serviceAreaLength}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="pedestrianCrossingRampType"
              testId={testIds.pedestrianCrossingRampType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryPedestrianCrossingRampType>
                  enumType={StopRegistryPedestrianCrossingRampType}
                  placeholder={t('unknown')}
                  uiNameMapper={(value) =>
                    mapStopRegistryPedestrianCrossingRampTypeToUiName(t, value)
                  }
                  includeNullOption
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="stopAreaSurroundingsAccessible"
              testId={testIds.stopAreaSurroundingsAccessible}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <NullableBooleanDropdown
                  placeholder={t('unknown')}
                  buttonClassName="min-w-32"
                  translationKeys={{
                    true: 'stopDetails.measurements.accessible',
                    false: 'stopDetails.measurements.inaccessible',
                    null: 'unknown',
                  }}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
          </Row>
        </Column>
      </form>
    </FormProvider>
  );
};

export const MeasurementsForm = React.forwardRef(MeasurementsFormComponent);
