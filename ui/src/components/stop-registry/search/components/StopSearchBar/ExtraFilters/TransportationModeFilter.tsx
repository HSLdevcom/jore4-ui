import without from 'lodash/without';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../../i18n/uiNameMappings';
import { Row } from '../../../../../../layoutComponents';
import { JoreStopRegistryTransportModeType } from '../../../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../../../utils';
import { StopSearchFilters } from '../../../types';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';
import { DisableableFilterProps } from '../Types/DisableableFilterProps';
import s from './TransportationModeFilter.module.css';

const modeIconMap: Readonly<Record<JoreStopRegistryTransportModeType, string>> =
  {
    [JoreStopRegistryTransportModeType.Bus]: 'icon-bus',
    [JoreStopRegistryTransportModeType.Tram]: 'icon-tram',
    [JoreStopRegistryTransportModeType.Metro]: 'icon-metro',
    [JoreStopRegistryTransportModeType.Rail]: 'icon-train',
    [JoreStopRegistryTransportModeType.Water]: 'icon-ferry',
  };

type TransportationModeButtonProps = {
  readonly isSelected: (mode: JoreStopRegistryTransportModeType) => boolean;
  readonly mode: JoreStopRegistryTransportModeType;
  readonly onToggle: (mode: JoreStopRegistryTransportModeType) => void;
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
      aria-label={mapStopRegistryTransportModeTypeToUiName(t, mode)}
      className={twJoin(
        'm-[-1px] cursor-pointer rounded border border-transparent text-[44px] leading-none text-tweaked-brand',
        'hover:border-tweaked-brand',
        'aria-checked:border-tweaked-brand aria-checked:bg-tweaked-brand aria-checked:text-white',
        modeIconMap[mode],
      )}
      data-testid={stopSearchBarTestIds.transportationModeButton(mode)}
      onClick={() => onToggle(mode)}
      role="checkbox"
      type="button"
    />
  );
};

const options: ReadonlyArray<JoreStopRegistryTransportModeType> = [
  JoreStopRegistryTransportModeType.Bus,
  JoreStopRegistryTransportModeType.Tram,
  JoreStopRegistryTransportModeType.Rail,
  JoreStopRegistryTransportModeType.Water,
  JoreStopRegistryTransportModeType.Metro,
];

export const TransportationModeFilter: FC<DisableableFilterProps> = ({
  className,
  disabled,
}) => {
  const { t } = useTranslation();

  const {
    field: { value, onBlur, onChange },
  } = useController<StopSearchFilters, 'transportationMode'>({
    name: 'transportationMode',
    disabled,
  });

  const isSelected = (mode: JoreStopRegistryTransportModeType) =>
    value.includes(AllOptionEnum.All) || value.includes(mode);

  const onToggle = (mode: JoreStopRegistryTransportModeType) => {
    // All selected → Remove clicked and add others
    if (value.includes(AllOptionEnum.All)) {
      return onChange(without(options, mode));
    }

    // All not selected, but clicked is selected → remove clicked
    if (value.includes(mode)) {
      return onChange(without(value, mode));
    }

    // Clicked not selected -> Add to selection
    const newSelection = value.concat(mode);

    // If All select -> Simplify to meta option [All]
    if (newSelection.length === options.length) {
      return onChange([AllOptionEnum.All]);
    }

    // All not selected -> Just add to selection.
    return onChange(newSelection);
  };

  return (
    <fieldset className={twMerge('flex flex-col', className)} onBlur={onBlur}>
      <label>{t('stopRegistrySearch.fieldLabels.transportMode')}</label>
      <Row className={twJoin('gap-1', s.noIconMargins)}>
        {options.map((mode) => (
          <TransportationModeButton
            key={mode}
            mode={mode}
            onToggle={onToggle}
            isSelected={isSelected}
          />
        ))}
      </Row>
    </fieldset>
  );
};
