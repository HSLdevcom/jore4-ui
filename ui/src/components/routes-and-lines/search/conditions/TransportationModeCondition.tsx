import without from 'lodash/without';
import { FC, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import { mapVehicleModeToUiName } from '../../../../i18n/uiNameMappings';
import { Column, Row } from '../../../../layoutComponents';
import { AllOptionEnum } from '../../../../utils';
import { SearchQueryParameterNames } from '../../../common/search/useSearchQueryParser';
import s from '../../../stop-registry/search/components/StopSearchBar/ExtraFilters/TransportationModeFilter.module.css';

const testIds = {
  transportationModeButton: (mode: ReusableComponentsVehicleModeEnum) =>
    `SearchContainer::transportationMode::${mode}`,
};

const modeIconMap: Readonly<Record<ReusableComponentsVehicleModeEnum, string>> =
  {
    [ReusableComponentsVehicleModeEnum.Bus]: 'icon-bus',
    [ReusableComponentsVehicleModeEnum.Tram]: 'icon-tram',
    [ReusableComponentsVehicleModeEnum.Metro]: 'icon-metro',
    [ReusableComponentsVehicleModeEnum.Train]: 'icon-train',
    [ReusableComponentsVehicleModeEnum.Ferry]: 'icon-ferry',
  };

type TransportationModeButtonProps = {
  readonly isSelected: (mode: ReusableComponentsVehicleModeEnum) => boolean;
  readonly mode: ReusableComponentsVehicleModeEnum;
  readonly onToggle: (mode: ReusableComponentsVehicleModeEnum) => void;
};

const TransportationModeButton: FC<TransportationModeButtonProps> = ({
  isSelected,
  mode,
  onToggle,
}) => {
  const { t } = useTranslation();

  return (
    <button
      aria-checked={isSelected(mode)}
      aria-label={mapVehicleModeToUiName(t, mode)}
      className={twJoin(
        'm-[-1px] cursor-pointer rounded border border-transparent text-[44px] leading-none text-tweaked-brand',
        'hover:border-tweaked-brand',
        'aria-checked:border-tweaked-brand aria-checked:bg-tweaked-brand aria-checked:text-white',
        modeIconMap[mode],
      )}
      data-testid={testIds.transportationModeButton(mode)}
      onClick={() => onToggle(mode)}
      role="checkbox"
      type="button"
    />
  );
};

const options: ReadonlyArray<ReusableComponentsVehicleModeEnum> = [
  ReusableComponentsVehicleModeEnum.Bus,
  ReusableComponentsVehicleModeEnum.Tram,
  ReusableComponentsVehicleModeEnum.Train,
  ReusableComponentsVehicleModeEnum.Ferry,
  ReusableComponentsVehicleModeEnum.Metro,
];

type TransportationModeConditionProps = {
  readonly transportationModes:
    | ReadonlyArray<ReusableComponentsVehicleModeEnum>
    | AllOptionEnum;
  readonly setSearchCondition: (
    attributeName: string,
    value: ReusableComponentsVehicleModeEnum[] | AllOptionEnum,
  ) => void;
};

export const TransportationModeCondition: FC<
  TransportationModeConditionProps
> = ({ transportationModes, setSearchCondition }) => {
  const { t } = useTranslation();
  const transportationModeId = useId();

  const isSelected = (mode: ReusableComponentsVehicleModeEnum): boolean => {
    return (
      transportationModes === AllOptionEnum.All ||
      transportationModes.includes(mode)
    );
  };

  const onToggle = (mode: ReusableComponentsVehicleModeEnum): void => {
    // All selected → Remove clicked and add others
    if (transportationModes === AllOptionEnum.All) {
      return setSearchCondition(
        SearchQueryParameterNames.TransportMode,
        without(options, mode),
      );
    }

    // All not selected, but clicked is selected → remove clicked
    if (transportationModes.includes(mode)) {
      return setSearchCondition(
        SearchQueryParameterNames.TransportMode,
        without(transportationModes, mode),
      );
    }

    // Clicked not selected -> Add to selection
    const newSelection = transportationModes.concat(mode);

    // If All select -> Simplify to meta option [All]
    if (newSelection.length === options.length) {
      return setSearchCondition(
        SearchQueryParameterNames.TransportMode,
        AllOptionEnum.All,
      );
    }

    // All not selected -> Just add to selection.
    return setSearchCondition(
      SearchQueryParameterNames.TransportMode,
      newSelection,
    );
  };

  return (
    <Column>
      <label htmlFor={transportationModeId}>{t(`lines.transportMode`)}</label>
      <Row
        identifier={transportationModeId}
        role="group"
        className={twJoin('gap-1', s.noIconMargins)}
      >
        {options.map((mode) => (
          <TransportationModeButton
            key={mode}
            mode={mode}
            onToggle={onToggle}
            isSelected={isSelected}
          />
        ))}
      </Row>
    </Column>
  );
};
