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
import { SlimSimpleButton } from '../../layout';
import { PosterFormFields } from './InfoSpotsFormPosters';
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
  deleteInfoSpot: 'InfoSpotFormFields::deleteInfoSpot',
  addInfoSpotPoster: 'InfoSpotFormFields::addInfoSpotPoster',
};

type Props = {
  readonly infoSpotIndex: number;
  readonly onRemove: (index: number) => void;
  readonly addPoster: (index: number) => void;
};

export const InfoSpotFormFields: FC<Props> = ({
  infoSpotIndex,
  onRemove,
  addPoster,
}) => {
  const { register, watch, getValues, setValue } =
    useFormContext<InfoSpotsFormState>();
  const toBeDeleted = watch(`infoSpots.${infoSpotIndex}.toBeDeleted`);

  const infoSpotType = watch(`infoSpots.${infoSpotIndex}.infoSpotType`);
  const posters = watch(`infoSpots.${infoSpotIndex}.poster`);

  const onRemovePoster = (idx: number, posterIndex: number) => {
    const newToBeDeleted = !getValues(
      `infoSpots.${idx}.poster.${posterIndex}.toBeDeletedPoster`,
    );
    setValue(
      `infoSpots.${idx}.poster.${posterIndex}.toBeDeletedPoster`,
      newToBeDeleted,
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true, // Add this to trigger revalidation
      },
    );
  };

  return (
    <Column className="space-y-4">
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.label`}
          testId={testIds.label}
          disabled={toBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.purpose`}
          testId={testIds.purpose}
          disabled={toBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.infoSpotType`}
          testId={testIds.infoSpotType}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryInfoSpotType>
              enumType={StopRegistryInfoSpotType}
              placeholder={t('unknown')}
              uiNameMapper={mapStopRegistryInfoSpotTypeEnumToUiName}
              buttonClassName="min-w-36"
              includeNullOption
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <Visible visible={infoSpotType === 'static'}>
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.posterPlaceSize`}
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
            fieldPath={`infoSpots.${infoSpotIndex}.backlight`}
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
          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.maintenance`}
            testId={testIds.maintenance}
          />
        </Visible>
        <Visible visible={infoSpotType === 'dynamic'}>
          <InputField<InfoSpotsFormState>
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.displayType`}
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
            fieldPath={`infoSpots.${infoSpotIndex}.speechProperty`}
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
      <Row className="-mx-5 !-mt-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.description.value`}
          testId={testIds.description}
          customTitlePath="stopDetails.infoSpots.description"
          disabled={toBeDeleted}
        />
      </Row>
      <Visible visible={infoSpotType === 'static'}>
        {posters?.length ? (
          [...posters].map((_, posterIndex) => (
            <PosterFormFields
              // eslint-disable-next-line react/no-array-index-key
              key={`poster-${posterIndex}`}
              infoSpotIndex={infoSpotIndex}
              posterIndex={posterIndex}
              onRemovePoster={onRemovePoster}
            />
          ))
        ) : (
          <Row>{t('stopDetails.infoSpots.noPosters')}</Row>
        )}
        <SlimSimpleButton
          testId={testIds.addInfoSpotPoster}
          onClick={() => addPoster(infoSpotIndex)}
        >
          {t('stopDetails.infoSpots.addInfoSpotPoster')}
        </SlimSimpleButton>
      </Visible>
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 py-5 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.zoneLabel`}
          testId={testIds.zoneLabel}
          disabled={toBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.railInformation`}
          inputClassName="w-20"
          testId={testIds.railInformation}
          disabled={toBeDeleted}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.floor`}
          inputClassName="w-20"
          testId={testIds.floor}
          disabled={toBeDeleted}
        />
      </Row>
      <input
        type="checkbox"
        hidden
        {...register(`infoSpots.${infoSpotIndex}.toBeDeleted`)}
      />
      <SlimSimpleButton
        testId={testIds.deleteInfoSpot}
        onClick={() => onRemove(infoSpotIndex)}
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
