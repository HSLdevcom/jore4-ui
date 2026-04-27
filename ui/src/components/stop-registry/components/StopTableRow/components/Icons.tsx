import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  StopRegistryAccessibilityLevel,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';
import {
  mapStopAccessibilityLevelToUiName,
  mapStopRegistryShelterElectricityEnumToUiName,
  mapStopRegistryShelterTypeEnumToUiName,
} from '../../../../../i18n/uiNameMappings';
import { StopSearchRow } from '../types';

const placeholderIcon = 'icon-placeholder-dot text-light-grey';

type EquipmentIconDetails = {
  readonly icon: string;
  readonly label: string;
};

type Details = EquipmentIconDetails | false | undefined | null | '';

type EquipmentIconProps = {
  readonly className?: string;
  readonly details: Details;
};

const EquipmentIcon: FC<EquipmentIconProps> = ({ className = '', details }) => {
  if (!details) {
    return (
      <i
        aria-hidden
        className={twMerge(className, placeholderIcon, 'mx-[-0.2em] text-4xl')}
      />
    );
  }

  return (
    <i
      role="img"
      className={twMerge(className, details.icon, 'mx-[-0.2em] text-4xl')}
      aria-label={details.label}
      title={details.label}
    />
  );
};

function getElectricityIcon(electricity: string) {
  switch (electricity) {
    case StopRegistryShelterElectricity.Light:
      return 'icon-time-limited-power';

    case StopRegistryShelterElectricity.ContinuousPlanned:
    case StopRegistryShelterElectricity.ContinuousUnderConstruction:
    case StopRegistryShelterElectricity.TemporarilyOff:
    case StopRegistryShelterElectricity.None:
      return 'icon-no-power';

    case StopRegistryShelterElectricity.Continuous:
    default:
      return 'icon-power';
  }
}

export type IconsProps = { readonly stop: StopSearchRow };

export const Icons: FC<IconsProps> = ({ stop }) => {
  const { t } = useTranslation();

  const replaceRailSignIcon: Details = stop.replacesRailSign && {
    icon: 'icon-replacement-line-grey',
    label: t(($) => $.stopDetails.signs.replacesRailSign),
  };

  const electricityIcon: Details = stop.electricity && {
    icon: getElectricityIcon(stop.electricity),
    label: mapStopRegistryShelterElectricityEnumToUiName(
      t,
      stop.electricity as StopRegistryShelterElectricity,
    ),
  };

  const shelterIcon: Details = stop.shelter && {
    icon:
      stop.shelter.toLowerCase() === StopRegistryShelterType.Post
        ? 'icon-post'
        : 'icon-shelter',
    label: mapStopRegistryShelterTypeEnumToUiName(
      t,
      stop.shelter as StopRegistryShelterType,
    ),
  };

  const accessibilityIcon: Details = stop.accessibility ===
    StopRegistryAccessibilityLevel.FullyAccessible && {
    icon: 'icon-accessible',
    label: mapStopAccessibilityLevelToUiName(
      t,
      stop.accessibility as StopRegistryAccessibilityLevel,
    ),
  };

  return (
    <>
      <EquipmentIcon details={replaceRailSignIcon} />

      <EquipmentIcon details={electricityIcon} />

      <EquipmentIcon details={shelterIcon} />

      <EquipmentIcon details={accessibilityIcon} />
    </>
  );
};
