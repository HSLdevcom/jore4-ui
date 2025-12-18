import { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
import { StopRowTdProps } from '../types';

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
        className={`${className} ${placeholderIcon} py-3 text-4xl`}
      />
    );
  }

  return (
    <i
      role="img"
      className={`${className} ${details.icon} py-3 text-4xl`}
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

export const IconsTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const { t } = useTranslation();

  const replaceRailSignIcon: Details = stop.replacesRailSign && {
    icon: 'icon-replacement-line-grey',
    label: t('stopDetails.signs.replacesRailSign'),
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
    <td className={className}>
      <EquipmentIcon
        className="border-r border-r-background pr-2"
        details={replaceRailSignIcon}
      />

      <EquipmentIcon details={electricityIcon} />

      <EquipmentIcon details={shelterIcon} />

      <EquipmentIcon details={accessibilityIcon} />
    </td>
  );
};
