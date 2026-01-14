import without from 'lodash/without';
import { FC, ReactElement } from 'react';
import { FieldPathByValue, FieldValues, useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { TranslationKey } from '../../../../i18n';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../i18n/uiNameMappings';
import { Row } from '../../../../layoutComponents';
import { JoreStopRegistryTransportModeType } from '../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../utils';
import s from './TransportationModeFilter.module.css';

const testIds = {
  transportationModeButton: (
    prefix: string,
    mode: JoreStopRegistryTransportModeType,
  ) => `${prefix}::transportationMode::${mode}`,
};

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
  readonly testIdPrefix: string;
};

const TransportationModeButton: FC<TransportationModeButtonProps> = ({
  isSelected,
  mode,
  onToggle,
  testIdPrefix,
}) => {
  const { t } = useTranslation();

  return (
    <button
      aria-checked={isSelected(mode)}
      aria-label={mapStopRegistryTransportModeTypeToUiName(t, mode)}
      className={twJoin(
        '-m-px cursor-pointer rounded-sm border border-transparent text-[44px] leading-none text-tweaked-brand',
        'hover:border-tweaked-brand',
        'aria-checked:border-tweaked-brand aria-checked:bg-tweaked-brand aria-checked:text-white',
        modeIconMap[mode],
      )}
      data-testid={testIds.transportationModeButton(testIdPrefix, mode)}
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

type TransportationModeFilterProps<FormState extends FieldValues> = {
  readonly fieldPath: FieldPathByValue<
    FormState,
    ReadonlyArray<JoreStopRegistryTransportModeType | AllOptionEnum>
  >;
  readonly translationPrefix: TranslationKey;
  readonly testIdPrefix: string;
  readonly className?: string;
  readonly disabled?: boolean;
};

export const TransportationModeFilter = <FormState extends FieldValues>({
  fieldPath,
  translationPrefix,
  testIdPrefix,
  className,
  disabled,
}: TransportationModeFilterProps<FormState>): ReactElement => {
  const { t } = useTranslation();

  const {
    field: { value, onBlur, onChange },
  } = useController<FormState, typeof fieldPath>({
    name: fieldPath,
    disabled,
  });

  // Type assertion to help TypeScript understand the correct type
  const typedValue = value as ReadonlyArray<
    JoreStopRegistryTransportModeType | AllOptionEnum
  >;

  const isSelected = (mode: JoreStopRegistryTransportModeType) =>
    typedValue.includes(AllOptionEnum.All) || typedValue.includes(mode);

  const onToggle = (mode: JoreStopRegistryTransportModeType) => {
    // All selected → Remove clicked and add others
    if (typedValue.includes(AllOptionEnum.All)) {
      return onChange(without(options, mode));
    }

    // All not selected, but clicked is selected → remove clicked
    if (typedValue.includes(mode)) {
      return onChange(without(typedValue, mode));
    }

    // Clicked not selected -> Add to selection
    const newSelection = typedValue.concat(mode);

    // If All select -> Simplify to meta option [All]
    if (newSelection.length === options.length) {
      return onChange([AllOptionEnum.All]);
    }

    // All not selected -> Just add to selection.
    return onChange(newSelection);
  };

  return (
    <fieldset className={twMerge('flex flex-col', className)} onBlur={onBlur}>
      <label>{t(`${translationPrefix}.transportMode`)}</label>
      <Row className={twJoin('gap-1', s.noIconMargins)}>
        {options.map((mode) => (
          <TransportationModeButton
            key={mode}
            mode={mode}
            onToggle={onToggle}
            isSelected={isSelected}
            testIdPrefix={testIdPrefix}
          />
        ))}
      </Row>
    </fieldset>
  );
};
