import { gql } from '@apollo/client';
import { t } from 'i18next';
import React, { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  StopRegistryPosterPlaceSize,
  useFindExistingPosterNamesQuery,
} from '../../../../../../generated/graphql';
import { mapStopRegistryPosterPlaceSizeEnumToUiName } from '../../../../../../i18n/uiNameMappings';
import { Row } from '../../../../../../layoutComponents';
import { EnumDropdown, InputField } from '../../../../../forms/common';
import { SlimSimpleButton } from '../../layout';
import { InfoSpotsFormState } from './schema';

const GQL_GET_POSTER_LABELS = gql`
  query findExistingPosterNames($query: String!) {
    stops_database {
      stops_database_info_spot_poster(
        where: { label: { _ilike: $query } }
        limit: 20
        order_by: [{ label: asc }]
        distinct_on: [label]
      ) {
        id
        label
      }
    }
  }
`;

const testIds = {
  posterContainer: 'InfoSpotPosterFormFields::container',
  posterSize: 'InfoSpotPosterFormFields::posterSize',
  posterLabel: 'InfoSpotPosterFormFields::posterLabel',
  posterLines: 'InfoSpotPosterFormFields::posterLines',
  deleteInfoSpotPoster: 'InfoSpotFormFields::deleteInfoSpotPoster',
};

type Props = {
  readonly infoSpotIndex: number;
  readonly posterIndex: number;
  readonly onRemovePoster: (index: number, posterIndex: number) => void;
};

const usePosterNames = () => {
  const { data } = useFindExistingPosterNamesQuery({
    variables: {
      query: '%',
    },
  });

  return useMemo(
    () =>
      (data?.stops_database?.stops_database_info_spot_poster ?? []).map(
        ({ label }) => (
          <option key={label} value={label ?? ''}>
            {label}
          </option>
        ),
      ),
    [data],
  );
};

export const PosterFormFields: FC<Props> = ({
  infoSpotIndex,
  posterIndex,
  onRemovePoster,
}) => {
  const { watch } = useFormContext<InfoSpotsFormState>();
  const toBeDeletedPoster = watch(
    `infoSpots.${infoSpotIndex}.poster.${posterIndex}.toBeDeletedPoster`,
  );

  const posterOptions = usePosterNames();

  return (
    <div data-testid={testIds.posterContainer}>
      <Row className="flex-wrap items-end gap-4 px-5 lg:flex-nowrap">
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
              uiNameMapper={mapStopRegistryPosterPlaceSizeEnumToUiName}
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
        <datalist id="posternames-data-list">{posterOptions}</datalist>
        <InputField<InfoSpotsFormState>
          type="text"
          translationPrefix="stopDetails"
          fieldPath={`infoSpots.${infoSpotIndex}.poster.${posterIndex}.lines`}
          customTitlePath="stopDetails.infoSpots.posterLines"
          testId={testIds.posterLines}
          disabled={toBeDeletedPoster}
        />
      </Row>
      <Row className="mt-5 px-5">
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
      </Row>
    </div>
  );
};
