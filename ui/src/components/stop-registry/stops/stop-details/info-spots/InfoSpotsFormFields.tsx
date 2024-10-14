import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
  StopRegistryPosterPlaceSize,
} from '../../../../../generated/graphql';
import {
  mapStopRegistryDisplayTypeEnumToUiName,
  mapStopRegistryInfoSpotTypeEnumToUiName,
  mapStopRegistryPosterPlaceSizeEnumToUiName,
} from '../../../../../i18n/uiNameMappings';
import { Column, Row, Visible } from '../../../../../layoutComponents';
import {
  EnumDropdown,
  InputField,
  NullableBooleanDropdown,
} from '../../../../forms/common';
import { SlimSimpleButton } from '../layout';
import { InfoSpotsFormState } from './schema';
import React, { useState } from 'react';

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
  deleteInfoSpot: 'InfoSpotFormFields::deleteInfoSpot',
};

interface Props {
  index: number;
  onRemove: (index: number) => void;
}

export const InfoSpotFormFields = ({
  index,
  onRemove,
}: Props): React.ReactElement => {
  const { register, watch } = useFormContext<InfoSpotsFormState>();
  const toBeDeleted = watch(`infoSpots.${index}.toBeDeleted`);
  const infoSpotType = watch(`infoSpots.${index}.infoSpotType`);
  const posters = watch(`infoSpots.${index}.poster`);

  const location = watch(`infoSpots.${index}.infoSpotLocations`);

  console.log(watch())

  return (
    <Column className="space-y-4">
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 lg:flex-nowrap py-5">
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
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryInfoSpotType>
              enumType={StopRegistryInfoSpotType}
              placeholder={t('unknown')}
              uiNameMapper={mapStopRegistryInfoSpotTypeEnumToUiName}
              buttonClassName="min-w-36"
              includeNullOption
              disabled={toBeDeleted}
              {...props}
            />
          )}
        />
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
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <Visible visible={infoSpotType == 'static'}>
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${index}.backlight`}
            testId={testIds.backlight}
            // eslint-disable-next-line react/no-unstable-nested-components
            inputElementRenderer={(props) => (
              <NullableBooleanDropdown
                placeholder={t('unknown')}
                buttonClassName="min-w-32"
                disabled={toBeDeleted}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
              />
            )}
          />
        </Visible>
        <Visible visible={infoSpotType == 'static'}>
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.maintenance`}
          testId={testIds.maintenance}
        />
        </Visible>
        <Visible visible={infoSpotType == 'dynamic'}>
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
              disabled={toBeDeleted}
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
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        </Visible>
      </Row>
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap bg-background -mx-5 px-5 !-my-5 py-5">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.description.value`}
          testId={testIds.description}
          customTitlePath="stopDetails.infoSpots.description"
        />
      </Row>
      <Visible visible={infoSpotType == 'static'}>
      <Row>
        {posters?.map((poster, posterIndex) => (
          <React.Fragment key={poster.label}>
            <InputField<InfoSpotsFormState>
              type="text"
              translationPrefix="stopDetails"
              fieldPath={`infoSpots.${index}.poster.${posterIndex}.label`}
              customTitlePath="stopDetails.infoSpots.posterLabel"
              testId={testIds.posterLabel}
            />
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
                  disabled={toBeDeleted}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
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
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap bg-background -mx-5 px-5 py-5">
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
          disabled={toBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.floor`}
          inputClassName="w-20"
          testId={testIds.floor}
          disabled={toBeDeleted}
        />
      </Row>
      <input
        type="checkbox"
        hidden
        {...register(`infoSpots.${index}.toBeDeleted`)}
      />
      <SlimSimpleButton
        testId={testIds.deleteInfoSpot}
        onClick={() => onRemove(index)}
        inverted
      >
        {t(
          toBeDeleted
            ? 'stopDetails.infoSpots.cancelDeleteInfoSpot'
            : 'stopDetails.infoSpots.deleteInfoSpot',
        )}
      </SlimSimpleButton>
    </Column>
  );
};
