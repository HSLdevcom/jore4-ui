import isEqual from 'lodash/isEqual';
import { useCallback, useMemo } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  Path,
  PathValue,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../../../i18n';
import { Column } from '../../../../../../layoutComponents';
import { none } from '../../../../../../utils';
import { InputField, InputLabel } from '../../../../../forms/common';
import { useGetInfoSpotSizes } from '../queries/useGetInfoSpotSizes';
import {
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

// Generic props so the fragment can be reused in terminal forms as well.
type SizeFormFragmentProps<FormState extends FieldValues> = {
  readonly sizeStatePath: FieldPathByValue<FormState, ItemSizeState>;
  readonly titlePath: TranslationKey;
  readonly disabled?: boolean; // Optional external disable (e.g. poster marked for deletion)
};

export const SizeFormFragment = <FormState extends FieldValues>({
  sizeStatePath,
  titlePath,
  disabled,
}: SizeFormFragmentProps<FormState>) => {
  const { setValue, watch } = useFormContext<FormState>();
  const posterSizeMenu = usePosterSizeMenu();
  const state = watch(sizeStatePath);
  const numberInputsDisabled = state.uiState !== 'NEW';

  const onSizeChanged = useCallback(
    (selectedOption: ItemSizeState) => {
      if (
        selectedOption.uiState === 'EXISTING' ||
        selectedOption.uiState === 'UNKNOWN'
      ) {
        setValue(
          sizeStatePath,
          selectedOption as PathValue<FormState, Path<FormState>>,
          {
            shouldTouch: true,
            shouldDirty: true,
          },
        );
      } else {
        setValue(
          `${sizeStatePath}.uiState` as Path<FormState>,
          'NEW' as PathValue<FormState, Path<FormState>>,
          {
            shouldTouch: true,
            shouldDirty: true,
          },
        );
      }
    },
    [setValue, sizeStatePath],
  );

  return (
    <>
      <Column>
        <InputLabel<FormState>
          fieldPath={`${sizeStatePath}.uiState` as Path<FormState>}
          translationPrefix="stopDetails"
          customTitlePath={titlePath}
        />
        <SizeSelector
          className="w-48"
          disabled={!posterSizeMenu.loaded || disabled}
          id={`stopDetails.${sizeStatePath}.uiState`}
          onChange={onSizeChanged}
          subMenus={posterSizeMenu.options}
          selectedItem={getSelectedOption(posterSizeMenu.options, state)}
          testId={testIds.selector}
        />
      </Column>
      <InputField<FormState>
        inputClassName="w-28"
        disabled={numberInputsDisabled || disabled}
        fieldPath={`${sizeStatePath}.width` as Path<FormState>}
        translationPrefix="stopDetails"
        customTitlePath="stopDetails.infoSpots.sizes.width"
        testId={testIds.width}
        type="number"
        min={0}
      />
      <InputField<FormState>
        inputClassName="w-28"
        disabled={numberInputsDisabled || disabled}
        fieldPath={`${sizeStatePath}.height` as Path<FormState>}
        translationPrefix="stopDetails"
        customTitlePath="stopDetails.infoSpots.sizes.height"
        testId={testIds.height}
        type="number"
        min={0}
      />
    </>
  );
};
