import { t } from 'i18next';
import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  InfoSpotDetailsFragment,
  StopRegistryPosterPlaceSize,
} from '../../../../../../generated/graphql';
import { mapStopRegistryPosterPlaceSizeEnumToUiName } from '../../../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../../../layoutComponents';
import { AddNewButton } from '../../../../../../uiComponents/AddNewButton';
import {
  EnumDropdown,
  FormRow,
  InputField,
  NullableBooleanDropdown,
} from '../../../../../forms/common';
import { SlimSimpleButton } from '../../layout';
import { PosterFormFields } from './InfoSpotsFormPosters';
import { InfoSpotsFormState } from './schema';

const testIds = {
  description: 'InfoSpotFormFields::description',
  label: 'InfoSpotFormFields::label',
  purpose: 'InfoSpotFormFields::purpose',
  latitude: 'InfoSpotFormFields::latitude',
  longitude: 'InfoSpotFormFields::longitude',
  backlight: 'InfoSpotFormFields::backlight',
  posterPlaceSize: 'InfoSpotFormFields::posterPlaceSize',
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
  noPosters: 'InfoSpotFormFields::noPosters',
};

type Props = {
  readonly infoSpotIndex: number;
  readonly infoSpotsData: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly onRemove: (index: number) => void;
  readonly addPoster: (index: number) => void;
};

export const InfoSpotFormFields: FC<Props> = ({
  infoSpotIndex,
  infoSpotsData,
  onRemove,
  addPoster,
}) => {
  const { register, watch, getValues, setValue } =
    useFormContext<InfoSpotsFormState>();
  const toBeDeleted = watch(`infoSpots.${infoSpotIndex}.toBeDeleted`);
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
      <div className="bg-background p-5">
        <span className="mb-2.5 block text-xl">
          <i className="icon-passenger-info mr-2.5 text-brand" aria-hidden />
          {t('stopDetails.infoSpots.infoSpot')}{' '}
          {infoSpotsData[infoSpotIndex]?.label ?? ''}
        </span>
        <Row className="flex-wrap items-end gap-4 py-2.5 lg:flex-nowrap">
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
        </Row>
        <Row className="flex-wrap items-end gap-4 py-2.5 lg:flex-nowrap">
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
        <FormRow
          mdColumns={1}
          className="flex-wrap items-end gap-4 bg-background py-2.5 lg:flex-nowrap"
        >
          <InputField<InfoSpotsFormState>
            type="text"
            translationPrefix="stopDetails"
            fieldPath={`infoSpots.${infoSpotIndex}.description.value`}
            testId={testIds.description}
            customTitlePath="stopDetails.infoSpots.description"
            disabled={toBeDeleted}
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
        </FormRow>
      </div>
      {posters?.length ? (
        posters.map((_, posterIndex) => (
          <PosterFormFields
            // eslint-disable-next-line react/no-array-index-key
            key={`poster-${posterIndex}`}
            infoSpotIndex={infoSpotIndex}
            posterIndex={posterIndex}
            addPoster={addPoster}
            onRemovePoster={onRemovePoster}
          />
        ))
      ) : (
        <Row className="!mt-0 items-center p-5">
          <span data-testid={testIds.noPosters}>
            <i className="icon-alert mr-2.5 text-hsl-red" aria-hidden />
            {t('stopDetails.infoSpots.noPosters')}
          </span>
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t('stopDetails.infoSpots.addInfoSpotPoster')}
            onClick={() => addPoster(infoSpotIndex)}
            className="ml-auto"
          />
        </Row>
      )}

      <input
        type="checkbox"
        hidden
        {...register(`infoSpots.${infoSpotIndex}.toBeDeleted`)}
      />
    </Column>
  );
};
