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
import { Column, Row } from '../../../../../layoutComponents';
import {
  EnumDropdown,
  InputField,
  NullableBooleanDropdown,
} from '../../../../forms/common';
import { SlimSimpleButton } from '../layout';
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

  return (
    <Column className="space-y-4">
      <Row className="-mx-5 flex-wrap items-end gap-4 bg-background px-5 lg:flex-nowrap">
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
              disabled={toBeDeleted}
              // eslint-disable-next-line react/jsx-props-no-spreading
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
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.maintenance`}
          testId={testIds.maintenance}
        />
      </Row>
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.description.value`}
          testId={testIds.description}
          customTitlePath="stopDetails.infoSpots.description"
        />
      </Row>
      <Row>
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.poster.${index}.label`}
          customTitlePath="stopDetails.infoSpots.posterLabel"
          testId={testIds.posterLabel}
        />
        <InputField<InfoSpotsFormState>
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${index}.poster.${index}.posterSize`}
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
          fieldPath={`infoSpots.${index}.poster.${index}.lines`}
          customTitlePath="stopDetails.infoSpots.posterLines"
          testId={testIds.posterLines}
        />
      </Row>
      <Row className="flex-wrap items-end gap-4 lg:flex-nowrap">
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
