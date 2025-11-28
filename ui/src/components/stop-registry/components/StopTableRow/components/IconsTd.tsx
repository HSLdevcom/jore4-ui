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
import { Column, Row } from '../../../../../layoutComponents';
import { StopRowTdProps } from '../types';

type EquipmentIconProps = {
  readonly className: string;
  readonly ariaLabel: string;
};

const EquipmentIcon: FC<EquipmentIconProps> = ({ className, ariaLabel }) => (
  <i
    className={`${className} py-3 text-4xl`}
    aria-label={ariaLabel}
    title={ariaLabel}
  />
);

const PLACEHOLDER_ICON_CLASS = 'icon-placeholder-icon text-light-grey';

const ELECTRICITY_ICON_MAP: Record<
  StopRegistryShelterElectricity,
  string | null
> = {
  [StopRegistryShelterElectricity.Light]: 'icon-time-limited-power',
  [StopRegistryShelterElectricity.ContinuousPlanned]: 'icon-no-power',
  [StopRegistryShelterElectricity.ContinuousUnderConstruction]: 'icon-no-power',
  [StopRegistryShelterElectricity.TemporarilyOff]: 'icon-no-power',
  [StopRegistryShelterElectricity.None]: 'icon-no-power',
  [StopRegistryShelterElectricity.Continuous]: 'icon-power',
};

export const IconsTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const { t } = useTranslation();

  const shelterIcon = stop.shelter
    ? {
        className:
          stop.shelter.toLowerCase() ===
          StopRegistryShelterType.Post.toLowerCase()
            ? 'icon-post'
            : 'icon-shelter',
        ariaLabel: mapStopRegistryShelterTypeEnumToUiName(
          t,
          stop.shelter as StopRegistryShelterType,
        ),
      }
    : { className: PLACEHOLDER_ICON_CLASS, ariaLabel: '' };

  const electricityIcon = stop.electricity
    ? {
        className:
          ELECTRICITY_ICON_MAP[
            stop.electricity as StopRegistryShelterElectricity
          ] ?? 'icon-power',
        ariaLabel: mapStopRegistryShelterElectricityEnumToUiName(
          t,
          stop.electricity as StopRegistryShelterElectricity,
        ),
      }
    : { className: PLACEHOLDER_ICON_CLASS, ariaLabel: '' };

  const accessibilityIcon =
    stop.accessibility === StopRegistryAccessibilityLevel.FullyAccessible
      ? {
          className: 'icon-accessible',
          ariaLabel: mapStopAccessibilityLevelToUiName(
            t,
            stop.accessibility as StopRegistryAccessibilityLevel,
          ),
        }
      : { className: PLACEHOLDER_ICON_CLASS, ariaLabel: '' };

  const replaceRailSignIcon = stop.replacesRailSign
    ? {
        className:
          'icon-replacement-line-grey border-r border-r-background pr-2',
        ariaLabel: t('stopDetails.signs.replacesRailSign'),
      }
    : {
        className: `${PLACEHOLDER_ICON_CLASS} border-r border-r-background pr-2`,
        ariaLabel: '',
      };

  return (
    <td className={className}>
      <Row>
        <Column>
          <EquipmentIcon
            className={replaceRailSignIcon.className}
            ariaLabel={replaceRailSignIcon.ariaLabel}
          />
        </Column>
        <Column>
          <EquipmentIcon
            className={electricityIcon.className}
            ariaLabel={electricityIcon.ariaLabel}
          />
        </Column>
        <Column>
          <EquipmentIcon
            className={shelterIcon.className}
            ariaLabel={shelterIcon.ariaLabel}
          />
        </Column>
        <Column>
          <EquipmentIcon
            className={accessibilityIcon.className}
            ariaLabel={accessibilityIcon.ariaLabel}
          />
        </Column>
      </Row>
    </td>
  );
};
