import isEqual from 'lodash/isEqual';
import { FC, useCallback, useMemo } from 'react';
import { FieldPathByValue, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../../../i18n';
import { Column } from '../../../../../../layoutComponents';
import { none } from '../../../../../../utils';
import { InputField, InputLabel } from '../../../../../forms/common';
import { SizeSelector } from '../../../../stops/stop-details/info-spots/info-spots-form/SizeSelector';
import { useGetInfoSpotSizes } from '../../../../stops/stop-details/info-spots/queries/useGetInfoSpotSizes';
import {
  ItemSizeState,
  NewMenuItem,
  PosterSizeSubMenu,
  UnknownMenuItem,
  standardPosterSizes,
} from '../../../../stops/stop-details/info-spots/types';
import { TerminalInfoSpotFormState } from '../types';

const testIds = {
  selector: 'TerminalInfoSpotFormFields::size::selector',
  width: 'TerminalInfoSpotFormFields::size::width',
  height: 'TerminalInfoSpotFormFields::size::height',
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

type TerminalSizeFormFragmentProps = {
  readonly sizeStatePath: FieldPathByValue<
    TerminalInfoSpotFormState,
    ItemSizeState
  >;
  readonly titlePath: TranslationKey;
  readonly disabled?: boolean;
};

export const TerminalSizeFormFragment: FC<TerminalSizeFormFragmentProps> = ({
  sizeStatePath,
  titlePath,
  disabled,
}) => {
  const { setValue, watch } = useFormContext<TerminalInfoSpotFormState>();
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
        <InputLabel<TerminalInfoSpotFormState>
          fieldPath={`${sizeStatePath}.uiState`}
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

      <InputField<TerminalInfoSpotFormState>
        inputClassName="w-28"
        disabled={numberInputsDisabled}
        fieldPath={`${sizeStatePath}.width`}
        translationPrefix="stopDetails"
        customTitlePath="stopDetails.infoSpots.sizes.width"
        testId={testIds.width}
        type="number"
        min={0}
      />

      <InputField<TerminalInfoSpotFormState>
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
