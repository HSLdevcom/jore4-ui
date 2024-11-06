import { t } from 'i18next';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
  StopRegistryPosterPlaceSize,
} from '../../../../../../generated/graphql';
import {
  mapStopRegistryDisplayTypeEnumToUiName,
  mapStopRegistryInfoSpotTypeEnumToUiName,
  mapStopRegistryPosterPlaceSizeEnumToUiName,
} from '../../../../../../i18n/uiNameMappings';
import { Column, Row, Visible } from '../../../../../../layoutComponents';
import {
  EnumDropdown,
  InputField,
  NullableBooleanDropdown,
} from '../../../../../forms/common';
import { InfoSpotsFormState } from './schema';

const testIds = {
  description: 'InfoSpotFormFields::description',
  label: 'InfoSpotFormFields::label',
  infoSpotType: 'InfoSpotFormFields::infoSpotType',
  purpose: 'InfoSpotFormFields::purpose',
  latitude: 'InfoSpotFormFields::latitude',
  longitude: 'InfoSpotFormFields::longitude',
  backlight: 'InfoSpotFormFields::backlight',
  posterPlaceSize: 'InfoSpotFormFields::posterPlaceSize',
  maintenance: 'InfoSpotFormFields::maintenance',
  displayType: 'InfoSpotFormFields::displayType',
  speechProperty: 'InfoSpotFormFields::speechProperty',
  floor: 'InfoSpotFormFields::floor',
  railInformation: 'InfoSpotFormFields::railInformation',
  stops: 'InfoSpotFormFields::stops',
  terminals: 'InfoSpotFormFields::terminals',
  zoneLabel: 'InfoSpotFormFields::zoneLabel',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLabel: 'InfoSpotPosterFormFields::posterLabel',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
};

type Props = {
  readonly index: number;
};

export const InfoSpotFormFields: FC<Props> = ({ index }) => {
  const { watch } = useFormContext<InfoSpotsFormState>();
  const infoSpotType = watch(`infoSpots.${index}.infoSpotType`);
  const posters = watch(`infoSpots.${index}.poster`);

  return (
    <Column className="space-y-4">
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.label`}
          testId={testIds.label}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.purpose`}
          testId={testIds.purpose}
        />
        <InputField<InfoSpotsFormState>
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.infoSpotType`}
          testId={testIds.infoSpotType}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryInfoSpotType>
              enumType={StopRegistryInfoSpotType}
              placeholder={t('unknown')}
              uiNameMapper={mapStopRegistryInfoSpotTypeEnumToUiName}
              buttonClassName="min-w-36"
              includeNullOption
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <Visible visible={infoSpotType === 'static'}>
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.posterPlaceSize`}
            testId={testIds.posterPlaceSize}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<StopRegistryPosterPlaceSize>
                enumType={StopRegistryPosterPlaceSize}
                placeholder={t('unknown')}
                uiNameMapper={mapStopRegistryPosterPlaceSizeEnumToUiName}
                buttonClassName="min-w-36"
                includeNullOption
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.backlight`}
            testId={testIds.backlight}
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
          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.maintenance`}
            testId={testIds.maintenance}
          />
        </Visible>
        <Visible visible={infoSpotType === 'dynamic'}>
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.displayType`}
            testId={testIds.displayType}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <EnumDropdown<StopRegistryDisplayType>
                enumType={StopRegistryDisplayType}
                placeholder={t('unknown')}
                uiNameMapper={mapStopRegistryDisplayTypeEnumToUiName}
                buttonClassName="min-w-36"
                includeNullOption
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.speechProperty`}
            testId={testIds.speechProperty}
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
        </Visible>
      </Row>
      <Row className="!-my-5 -mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.description.value`}
          testId={testIds.description}
          customTitlePath="stopDetails.infoSpots.description"
        />
      </Row>
      <Visible visible={infoSpotType === 'static'}>
        <Row>
          {posters?.map((_, posterIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={`poster-${posterIndex}`}>
              <InputField<InfoSpotsFormState>
                translationPrefix="stopDetails"
                fieldPath={`infoSpots.${index}.poster.${posterIndex}.posterSize`}
                customTitlePath="stopDetails.infoSpots.posterSize"
                testId={testIds.posterSize}
                // eslint-disable-next-line react/no-unstable-nested-components
                inputElementRenderer={(props) => (
                  <EnumDropdown<StopRegistryPosterPlaceSize>
                    enumType={StopRegistryPosterPlaceSize}
                    placeholder={t('unknown')}
                    uiNameMapper={mapStopRegistryPosterPlaceSizeEnumToUiName}
                    buttonClassName="min-w-36"
                    includeNullOption
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...props}
                  />
                )}
              />
              <InputField<InfoSpotsFormState>
                type="text"
                translationPrefix="stopDetails"
                fieldPath={`infoSpots.${index}.poster.${posterIndex}.label`}
                customTitlePath="stopDetails.infoSpots.posterLabel"
                testId={testIds.posterLabel}
              />
              <InputField<InfoSpotsFormState>
                type="text"
                translationPrefix="stopDetails"
                fieldPath={`infoSpots.${index}.poster.${posterIndex}.lines`}
                customTitlePath="stopDetails.infoSpots.posterLines"
                testId={testIds.posterLines}
              />
            </React.Fragment>
          ))}
        </Row>
      </Visible>
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.zoneLabel`}
          testId={testIds.zoneLabel}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.railInformation`}
          inputClassName="w-20"
          testId={testIds.railInformation}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.floor`}
          inputClassName="w-20"
          testId={testIds.floor}
        />
      </Row>
    </Column>
  );
};
