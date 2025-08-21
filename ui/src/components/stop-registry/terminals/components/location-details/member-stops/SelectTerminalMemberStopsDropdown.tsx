import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import {
  BaseSelectMemberStopsDropdown,
  FloatingBaseSelectMemberStopsDropdown,
  SelectMemberStopsDropdownProps,
  sortByPublicCode,
} from '../../../../components/SelectMemberStops';
import { SelectedStop } from '../../../../components/SelectMemberStops/common/schema';

const testIds = {
  warningText: 'SelectTerminalMemberStopsDropdown::warningText',
};

function findNewlySelectedStop(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
): SelectedStop | undefined {
  return newValue.find(
    (item) =>
      !currentValue.some(
        (existing) =>
          existing.stopPlaceId === item.stopPlaceId &&
          existing.quayId === item.quayId,
      ),
  );
}

function findDeletedStop(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
): SelectedStop | undefined {
  return currentValue.find(
    (item) =>
      !newValue.some(
        (remaining) =>
          remaining.stopPlaceId === item.stopPlaceId &&
          remaining.quayId === item.quayId,
      ),
  );
}

function getRelatedQuays(
  selectedStop: Readonly<SelectedStop>,
  currentSelection: ReadonlyArray<SelectedStop>,
  allQueryResults: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  return allQueryResults.filter((option) => {
    const isSameStopPlace = option.stopPlaceId === selectedStop.stopPlaceId;
    const isDifferentQuay = option.quayId !== selectedStop.quayId;
    const notAlreadySelected = !currentSelection.some(
      (selected) => selected.quayId === option.quayId,
    );

    return isSameStopPlace && isDifferentQuay && notAlreadySelected;
  });
}

function processSelection(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
  allQueryResults: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  const isAddingStops = newValue.length > currentValue.length;
  const isRemovingStops = newValue.length < currentValue.length;

  if (isAddingStops) {
    const newlySelected = findNewlySelectedStop(newValue, currentValue);
    if (!newlySelected) {
      return [...newValue];
    }

    const relatedQuays = getRelatedQuays(
      newlySelected,
      newValue,
      allQueryResults,
    );
    return [...newValue, ...relatedQuays];
  }

  if (isRemovingStops) {
    const deletedStop = findDeletedStop(newValue, currentValue);
    if (!deletedStop) {
      return [...newValue];
    }

    return newValue.filter(
      (stop) => stop.stopPlaceId !== deletedStop.stopPlaceId,
    );
  }

  return [...newValue];
}

type SelectTerminalMemberStopsDropdownProps = SelectMemberStopsDropdownProps & {
  readonly floating?: boolean;
};

export const SelectTerminalMemberStopsDropdown: FC<
  SelectTerminalMemberStopsDropdownProps
> = ({ value = [], onChange, floating, ...restProps }) => {
  const { t } = useTranslation();

  const handleSelectionChange = (
    newValue: readonly SelectedStop[],
    currentValue: SelectedStop[],
    allQueryResults: SelectedStop[],
  ) => {
    const processedSelection = processSelection(
      newValue,
      currentValue,
      allQueryResults,
    );
    onChange(sortByPublicCode(processedSelection));
  };

  const renderWarning = () => {
    const hasNoSelectedStops = value.length === 0;

    if (!hasNoSelectedStops) {
      return null;
    }

    return (
      <div className="text-hsl-red">
        <MdWarning className="mr-2 inline text-lg" />
        <span data-testid={testIds.warningText}>
          {t('terminalDetails.location.noMemberStopsSelected')}
        </span>
      </div>
    );
  };

  // Floating dropdown results, recommended to use when there are
  if (floating) {
    return (
      <FloatingBaseSelectMemberStopsDropdown
        value={value}
        onChange={onChange}
        onSelectionChange={handleSelectionChange}
        renderWarning={renderWarning}
        inputAriaLabel={t('terminalDetails.location.memberStops')}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restProps}
      />
    );
  }

  return (
    <BaseSelectMemberStopsDropdown
      value={value}
      onChange={onChange}
      onSelectionChange={handleSelectionChange}
      renderWarning={renderWarning}
      inputAriaLabel={t('terminalDetails.location.memberStops')}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    />
  );
};
