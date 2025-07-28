import isEqual from 'lodash/isEqual';
import React, { FC, useCallback, useMemo } from 'react';
import { FieldPathByValue, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../../layoutComponents';
import { none } from '../../../../../../utils';
import { InputField, InputLabel } from '../../../../../forms/common';
import { useGetInfoSpotSizes } from '../queries/useGetInfoSpotSizes';
import {
  InfoSpotsFormState,
  ItemSizeState,
  NewMenuItem,
  PosterSizeSubMenu,
  UnknownMenuItem,
  standardPosterSizes,
} from '../types';
import { SizeSelector } from './SizeSelector';

const testIds = {
  selector: 'InfoSpotFormFields::size::selector',
  width: 'InfoSpotFormFields::size::width',
  height: 'InfoSpotFormFields::size::height',
};

function usePosterSizeMenu() {
  const { t } = useTranslation();

  const { sizes, loading } = useGetInfoSpotSizes();

  const options = useMemo<ReadonlyArray<PosterSizeSubMenu>>(
    () => [
      {
        label: t('stopDetails.infoSpots.sizes.standardSizes'),
        options: standardPosterSizes.map((it) => ({
          uiState: 'EXISTING',
          ...it.size,
        })),
      },
      {
        label: t('stopDetails.infoSpots.sizes.extraSizes'),
        options: [
          UnknownMenuItem,
          NewMenuItem,
          ...sizes
            .filter((size) =>
              none(
                (standardSize) => isEqual(standardSize.size, size),
                standardPosterSizes,
              ),
            )
            .map(
              (size): ItemSizeState => ({
                uiState: 'EXISTING',
                ...size,
              }),
            ),
        ],
      },
    ],
    [sizes, t],
  );

  const loaded = sizes.length > 0 || !loading;
  return { options, loaded };
}

function getSelectedOption(
  menu: ReadonlyArray<PosterSizeSubMenu>,
  state: ItemSizeState,
): ItemSizeState {
  const allMenuOptions = menu.flatMap((subMenu) => subMenu.options);
  const selectedOption = allMenuOptions.find((option) =>
    isEqual(option, state),
  );

  // Unknown always has null size and will be found from the menu items,
  // but if we are dealing with a new size, we might have some in between state.
  return selectedOption ?? NewMenuItem;
}

type SizeFormFragmentProps = {
  readonly sizeStatePath: FieldPathByValue<InfoSpotsFormState, ItemSizeState>;
};

export const SizeFormFragment: FC<SizeFormFragmentProps> = ({
  sizeStatePath,
}) => {
  const { setValue, watch } = useFormContext<InfoSpotsFormState>();
  const posterSizeMenu = usePosterSizeMenu();

  const state = watch(sizeStatePath);
  const numberInputsDisabled = state.uiState !== 'NEW';

  const onSizeChanged = useCallback(
    (selectedOption: ItemSizeState) => {
      if (
        selectedOption.uiState === 'EXISTING' ||
        selectedOption.uiState === 'UNKNOWN'
      ) {
        setValue(sizeStatePath, selectedOption, {
          shouldTouch: true,
          shouldDirty: true,
        });
      } else {
        setValue(`${sizeStatePath}.uiState`, 'NEW', {
          shouldTouch: true,
          shouldDirty: true,
        });
      }
    },
    [setValue, sizeStatePath],
  );

  return (
    <>
      <Column>
        <InputLabel<InfoSpotsFormState>
          fieldPath={`${sizeStatePath}.uiState`}
          translationPrefix="stopDetails"
          customTitlePath="stopDetails.infoSpots.size"
        />
        <SizeSelector
          className="w-48"
          disabled={!posterSizeMenu.loaded}
          id={`stopDetails.${sizeStatePath}.uiState`}
          onChange={onSizeChanged}
          subMenus={posterSizeMenu.options}
          selectedItem={getSelectedOption(posterSizeMenu.options, state)}
          testId={testIds.selector}
        />
      </Column>

      <InputField<InfoSpotsFormState>
        inputClassName="w-28"
        disabled={numberInputsDisabled}
        fieldPath={`${sizeStatePath}.width`}
        translationPrefix="stopDetails"
        customTitlePath="stopDetails.infoSpots.sizes.width"
        testId={testIds.width}
        type="number"
        min={0}
      />

      <InputField<InfoSpotsFormState>
        inputClassName="w-28"
        disabled={numberInputsDisabled}
        fieldPath={`${sizeStatePath}.height`}
        translationPrefix="stopDetails"
        customTitlePath="stopDetails.infoSpots.sizes.height"
        testId={testIds.height}
        type="number"
        min={0}
      />
    </>
  );
};
