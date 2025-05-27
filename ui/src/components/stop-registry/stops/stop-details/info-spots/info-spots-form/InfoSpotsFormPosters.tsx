import { t } from 'i18next';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { StopRegistryPosterPlaceSize } from '../../../../../../generated/graphql';
import { mapStopRegistryPosterPlaceSizeEnumToUiName } from '../../../../../../i18n/uiNameMappings';
import { Row } from '../../../../../../layoutComponents';
import { AddNewButton } from '../../../../../../uiComponents/AddNewButton';
import { EnumDropdown, InputField } from '../../../../../forms/common';
import { SlimSimpleButton } from '../../layout';
import { usePosterNames } from './InfoSpotsPosterNames';
import { InfoSpotsFormState } from './schema';

const testIds = {
  addInfoSpotPoster: 'InfoSpotFormFields::addInfoSpotPoster',
  posterContainer: 'InfoSpotPosterFormFields::container',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLabel: 'InfoSpotPosterFormFields::posterLabel',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
  deleteInfoSpotPoster: 'InfoSpotFormFields::deleteInfoSpotPoster',
};

type InfoSpotsFormPostersProps = {
  readonly infoSpotIndex: number;
  readonly posterIndex: number;
  readonly addPoster: (index: number) => void;
  readonly onRemovePoster: (index: number, posterIndex: number) => void;
};

export const InfoSpotsFormPosters: FC<InfoSpotsFormPostersProps> = ({
  infoSpotIndex,
  posterIndex,
  addPoster,
  onRemovePoster,
}) => {
  const { watch } = useFormContext<InfoSpotsFormState>();
  const toBeDeletedPoster = watch(
    `infoSpots.${infoSpotIndex}.poster.${posterIndex}.toBeDeletedPoster`,
  );

  const posters = watch(`infoSpots.${infoSpotIndex}.poster`) ?? [];
  const isLastPoster = posterIndex === posters.length - 1;

  const posterOptions = usePosterNames();

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="my-5 flex-wrap items-end gap-4 px-10 lg:flex-nowrap">
        <InputField<InfoSpotsFormState>
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.posterSize`}
          customTitlePath="stopDetails.infoSpots.posterSize"
          testId={testIds.posterSize}
          // eslint-disable-next-line react/no-unstable-nested-components
          inputElementRenderer={(props) => (
            <EnumDropdown<StopRegistryPosterPlaceSize>
              enumType={StopRegistryPosterPlaceSize}
              placeholder={t('unknown')}
              uiNameMapper={(value) =>
                mapStopRegistryPosterPlaceSizeEnumToUiName(t, value)
              }
              buttonClassName="min-w-36"
              includeNullOption
              disabled={toBeDeletedPoster}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
            />
          )}
        />
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.label`}
          customTitlePath="stopDetails.infoSpots.posterLabel"
          testId={testIds.posterLabel}
          disabled={toBeDeletedPoster}
          list="posternames-data-list"
        />
        <datalist id="posternames-data-list">
          {posterOptions.map(({ label }) => (
            <option key={label} value={label ?? ''}>
              {label}
            </option>
          ))}
        </datalist>
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.lines`}
          customTitlePath="stopDetails.infoSpots.posterLines"
          testId={testIds.posterLines}
          disabled={toBeDeletedPoster}
        />
      </Row>
      <Row className="px-10 pb-5">
        <SlimSimpleButton
          testId={testIds.deleteInfoSpotPoster}
          onClick={() => onRemovePoster(infoSpotIndex, posterIndex)}
          inverted
        >
          {t(
            toBeDeletedPoster
              ? 'stopDetails.infoSpots.cancelDeleteInfoSpot'
              : 'stopDetails.infoSpots.deleteInfoSpotPoster',
          )}
        </SlimSimpleButton>
        {isLastPoster && (
          <AddNewButton
            testId={testIds.addInfoSpotPoster}
            label={t('stopDetails.infoSpots.addInfoSpotPoster')}
            onClick={() => addPoster(infoSpotIndex)}
            className="ml-auto"
          />
        )}
      </Row>
    </div>
  );
};
