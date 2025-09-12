import without from 'lodash/without';
import { useCallback } from 'react';
import { AllOptionEnum, NullOptionEnum } from '../../../../../../utils';

type OnChangeHandler<OptionT> = (value: ReadonlyArray<OptionT>) => void;

export type AugmentedOnChangeHandlerMetaData = {
  readonly properOptionCount: number;
  readonly supportsAllMetaOption: boolean;
};

type AugmentOnChangeHandlerWithMetaOptionsParams<OptionT> =
  AugmentedOnChangeHandlerMetaData & {
  readonly defaultValue: ReadonlyArray<OptionT>;
  readonly onChange: OnChangeHandler<OptionT>;
};

export function useAugmentOnChangeHandlerWithMetaOptions<OptionT>({
                                                             defaultValue,
                                                             onChange,
                                                             properOptionCount,
                                                             supportsAllMetaOption,
                                                           }: AugmentOnChangeHandlerWithMetaOptionsParams<OptionT>) {
  return useCallback(
    (newSelection: Array<OptionT>) => {
      // If empty → Reselect default options
      if (newSelection.length === 0) {
        return onChange(defaultValue);
      }

      const newSelectioWithoutMetaOptions = without(
        newSelection,
        AllOptionEnum.All as OptionT,
        NullOptionEnum.Null as OptionT,
      );

      const lastSelected = newSelection[newSelection.length - 1];
      const allSelected =
        (supportsAllMetaOption && lastSelected === AllOptionEnum.All) ||
        newSelectioWithoutMetaOptions.length === properOptionCount;

      if (allSelected) {
        return onChange([AllOptionEnum.All as OptionT]);
        // If Null was just selected (last item) → [Null]
      }

      if (lastSelected === NullOptionEnum.Null) {
        return onChange([NullOptionEnum.Null as OptionT]);
      }

      return onChange(newSelectioWithoutMetaOptions);
    },
    [onChange, defaultValue, supportsAllMetaOption, properOptionCount],
  );
}
