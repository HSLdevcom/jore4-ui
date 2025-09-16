import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import isEqual from 'lodash/isEqual';
import { FC, useCallback, useMemo } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../../layoutComponents';
import { AllOptionEnum, NullOptionEnum, none } from '../../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../../forms/common';
import { useGetInfoSpotSizes } from '../../../../stops/stop-details/info-spots/queries/useGetInfoSpotSizes';
import {
  PosterSize,
  standardPosterSizes,
} from '../../../../stops/stop-details/info-spots/types';
import { formatSizeOption } from '../../../../stops/stop-details/info-spots/utils';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import {
  MenuGroup,
  MultiselectDropdownFilter,
} from './MultiselectDropdownFilter';
import {
  AugmentedOnChangeHandlerMetaData,
  useAugmentOnChangeHandlerWithMetaOptions,
} from './useAugmentOnChangeHandlerWithMetaOptions';

type InfoSpotFilterMenuOption =
  | AllOptionEnum.All
  | NullOptionEnum.Null
  | PosterSize;

const metaOptionGroupKey = 'metaOptions';
const defaultValue: ReadonlyArray<InfoSpotFilterMenuOption> = [
  AllOptionEnum.All,
];

function keyOption(option: InfoSpotFilterMenuOption): string {
  if (typeof option === 'string') {
    return option;
  }

  return `${option.width}-${option.height}`;
}

function useFormatOption(t: TFunction) {
  return useCallback(
    (option: InfoSpotFilterMenuOption) => {
      if (option === AllOptionEnum.All) {
        return t('all');
      }

      if (option === NullOptionEnum.Null) {
        return t('stopRegistrySearch.noOptions.infoSpot');
      }

      return formatSizeOption(option);
    },
    [t],
  );
}

function useOptionGroups(t: TFunction) {
  const { sizes, loading } = useGetInfoSpotSizes();

  const groups = useMemo<
    ReadonlyArray<MenuGroup<InfoSpotFilterMenuOption>>
  >(() => {
    const standardOptions = standardPosterSizes.map((it) => it.size);

    const extraOptions = sizes.filter((size) =>
      none(
        (standardSize) => isEqual(standardSize.size, size),
        standardPosterSizes,
      ),
    );

    return compact([
      {
        key: metaOptionGroupKey,
        options: [AllOptionEnum.All, NullOptionEnum.Null],
      },
      {
        key: 'standardSizes',
        label: t('stopDetails.infoSpots.sizes.standardSizes'),
        options: standardOptions,
      },
      extraOptions.length
        ? {
            key: 'extraSizes',
            label: t('stopDetails.infoSpots.sizes.extraSizes'),
            options: extraOptions,
          }
        : null,
    ]);
  }, [sizes, t]);

  const loaded = sizes.length > 0 || !loading;
  return { groups, loaded };
}

function useMetaOptionInfo(
  groups: ReadonlyArray<MenuGroup<InfoSpotFilterMenuOption>>,
) {
  return useMemo<AugmentedOnChangeHandlerMetaData>(() => {
    const properOptionCount = groups
      .filter((group) => group.key !== metaOptionGroupKey)
      .reduce((count, group) => count + group.options.length, 0);

    return { properOptionCount, supportsAllMetaOption: true };
  }, [groups]);
}

export const InfoSpotsFilter: FC<DisableableFilterProps> = ({
  className,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const formatOption = useFormatOption(t);
  const optionGroups = useOptionGroups(t);
  const metaOptionInfo = useMetaOptionInfo(optionGroups.groups);

  const {
    field: { onChange, onBlur, value },
  } = useController<StopSearchFilters, 'infoSpots'>({
    name: 'infoSpots',
    disabled,
  });

  const onChangeHandler = useAugmentOnChangeHandlerWithMetaOptions({
    ...metaOptionInfo,
    onChange,
    defaultValue,
  });

  return (
    <Column className={className}>
      <InputLabel<StopSearchFilters>
        fieldPath="infoSpots"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <MultiselectDropdownFilter<InfoSpotFilterMenuOption>
        disabled={disabled || !optionGroups.loaded}
        formatOption={formatOption}
        groups={optionGroups.groups}
        id="stopRegistrySearch.fieldLabels.infoSpots"
        keyOption={keyOption}
        onBlur={onBlur}
        onChange={onChangeHandler}
        testId={stopSearchBarTestIds.infoSpotsFilter}
        value={value}
      />

      <ValidationErrorList fieldPath="infoSpots" />
    </Column>
  );
};
