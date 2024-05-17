import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import {
  mapStopRegistryGuidanceTypeToUiName,
  mapStopRegistryMapTypeToUiName,
  mapStopRegistryPedestrianCrossingRampTypeToShortUiName,
  mapStopRegistryShelterTypeToUiName,
  mapStopRegistryStopTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../layoutComponents';
import { EnumDropdown, InputField } from '../../../../forms/common';
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

interface Props {
  className?: string;
  defaultValues: Partial<MeasurementsFormState>;
  onSubmit: (state: MeasurementsFormState) => void;
}

const MeasurementsFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
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
                  placeholder={t('stopDetails.measurements.stopType')}
                  uiNameMapper={mapStopRegistryStopTypeToUiName}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            {/* curvedStop */}
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="shelterType"
              testId={testIds.shelterType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryShelterType>
                  enumType={StopRegistryShelterType}
                  placeholder={t('stopDetails.measurements.shelterType')}
                  uiNameMapper={mapStopRegistryShelterTypeToUiName}
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
          <Row className="flex-wrap items-end gap-4 md:flex-nowrap">
            {/* platformEdgeWarningArea */}
            {/* sidewalkAccessibleConnection */}
            {/* guidanceStripe */}
            {/* serviceAreaStripes */}
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="guidanceType"
              testId={testIds.guidanceType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryGuidanceType>
                  enumType={StopRegistryGuidanceType}
                  placeholder={t('stopDetails.measurements.guidanceType')}
                  uiNameMapper={mapStopRegistryGuidanceTypeToUiName}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
            />
            {/* guidanceTiles */}
            <InputField<MeasurementsFormState>
              translationPrefix="stopDetails.measurements"
              fieldPath="mapType"
              testId={testIds.mapType}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <EnumDropdown<StopRegistryMapType>
                  enumType={StopRegistryMapType}
                  placeholder={t('stopDetails.measurements.mapType')}
                  uiNameMapper={mapStopRegistryMapTypeToUiName}
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
            <div>
              <InputField<MeasurementsFormState>
                translationPrefix="stopDetails.measurements"
                fieldPath="pedestrianCrossingRampType"
                testId={testIds.pedestrianCrossingRampType}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <div className="inline-flex items-center">
                    <EnumDropdown<StopRegistryPedestrianCrossingRampType>
                      enumType={StopRegistryPedestrianCrossingRampType}
                      placeholder={t(
                        'stopDetails.measurements.pedestrianCrossingRampType',
                      )}
                      uiNameMapper={
                        mapStopRegistryPedestrianCrossingRampTypeToShortUiName
                      }
                      buttonClassName="min-w-28"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...props}
                    />
                    <i
                      className="icon-info text-2xl text-brand"
                      title="Luiskaus info, TODO"
                    />
                  </div>
                )}
              />
            </div>
            {/* stopAreaSurroundingsAccessible */}
          </Row>
        </Column>
      </form>
    </FormProvider>
  );
};

export const MeasurementsForm = React.forwardRef(MeasurementsFormComponent);
