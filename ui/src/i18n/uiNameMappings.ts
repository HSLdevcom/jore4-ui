import { TFunction } from 'i18next';
import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
  StopRegistryAccessibilityLevel,
  StopRegistryDisplayType,
  StopRegistryGuidanceType,
  StopRegistryInfoSpotType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryPosterPlaceSize,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
  StopRegistryTransportModeType,
} from '../generated/graphql';
import { i18n } from '../i18n';
import {
  DayOfWeek,
  Priority,
  StopRegistryMunicipality,
  SubstituteDayOfWeek,
  TimetablePriority,
} from '../types/enums';
import {
  JoreStopRegistryTransportModeType,
  StopPlaceSignType,
  StopPlaceState,
} from '../types/stop-registry';
import { AllOptionEnum, NullOptionEnum } from '../utils';

export const mapPriorityToUiName = (key: Priority) => {
  const uiStrings: Record<Priority, string> = {
    [Priority.Standard]: i18n.t('priority.standard'),
    [Priority.Temporary]: i18n.t('priority.temporary'),
    [Priority.Draft]: i18n.t('priority.draft'),
  };
  return uiStrings[key];
};

export const mapTimetablePriorityToUiName = (key: TimetablePriority) => {
  const uiStrings: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: i18n.t('priority.standard'),
    [TimetablePriority.Temporary]: i18n.t('priority.temporary'),
    [TimetablePriority.Draft]: i18n.t('priority.draft'),
    [TimetablePriority.SubstituteByLineType]: i18n.t('priority.substitute'),
    [TimetablePriority.Special]: i18n.t('priority.special'),
    [TimetablePriority.Staging]: '', // NOTE: staging priorities are not intented to be shown in UI
  };
  return uiStrings[key];
};

export const mapDayOfWeekToUiName = (key: DayOfWeek) => {
  const uiStrings: Record<DayOfWeek, string> = {
    [DayOfWeek.Monday]: i18n.t('dayOfWeek.monday'),
    [DayOfWeek.Tuesday]: i18n.t('dayOfWeek.tuesday'),
    [DayOfWeek.Wednesday]: i18n.t('dayOfWeek.wednesday'),
    [DayOfWeek.Thursday]: i18n.t('dayOfWeek.thursday'),
    [DayOfWeek.Friday]: i18n.t('dayOfWeek.friday'),
    [DayOfWeek.Saturday]: i18n.t('dayOfWeek.saturday'),
    [DayOfWeek.Sunday]: i18n.t('dayOfWeek.sunday'),
  };
  return uiStrings[key];
};

export const mapVehicleModeToUiName = (
  key: ReusableComponentsVehicleModeEnum | AllOptionEnum.All,
) => i18n.t(key === AllOptionEnum.All ? 'all' : `vehicleModeEnum.${key}`);

export const mapStopRegistryTransportModeTypeToUiName = (
  key: StopRegistryTransportModeType | JoreStopRegistryTransportModeType,
) => i18n.t(`stopRegistryTransportModeTypeEnum.${key}`);

export const mapStopPlaceStateToUiName = (key: StopPlaceState) =>
  i18n.t(`stopPlaceStateEnum.${key}`);

export const mapStopPlaceSignTypeToUiName = (key: StopPlaceSignType) =>
  i18n.t(`stopPlaceSignTypeEnum.${key}`);

export const mapStopRegistryStopTypeToUiName = (
  key: StopRegistryStopType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null ? 'unknown' : `stopRegistryStopTypeEnum.${key}`,
  );

export const mapStopRegistryShelterWidthTypeToUiName = (
  key: StopRegistryShelterWidthType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryShelterWidthTypeEnum.${key}`,
  );

export const mapStopRegistryPedestrianCrossingRampTypeToUiName = (
  key: StopRegistryPedestrianCrossingRampType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryPedestrianCrossingRampTypeEnum.${key}`,
  );

export const mapStopRegistryGuidanceTypeToUiName = (
  key: StopRegistryGuidanceType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryGuidanceTypeEnum.${key}`,
  );

export const mapStopRegistryMapTypeToUiName = (
  key: StopRegistryMapType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null ? 'unknown' : `stopRegistryMapTypeEnum.${key}`,
  );

export const mapStopRegistryShelterConditionEnumToUiName = (
  key: StopRegistryShelterCondition | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryShelterConditionEnum.${key}`,
  );

export const mapStopRegistryShelterElectricityEnumToUiName = (
  key: StopRegistryShelterElectricity | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryShelterElectricityEnum.${key}`,
  );

export const mapStopRegistryShelterTypeEnumToUiName = (
  key: StopRegistryShelterType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopRegistryShelterTypeEnum.${key}`,
  );

export const mapStopRegistryInfoSpotTypeEnumToUiName = (
  key: StopRegistryInfoSpotType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopDetails.infoSpots.type.${key}`,
  );

export const mapStopRegistryDisplayTypeEnumToUiName = (
  key: StopRegistryDisplayType | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopDetails.infoSpots.displayTypes.${key}`,
  );

export const mapStopRegistryPosterPlaceSizeEnumToUiName = (
  key: StopRegistryPosterPlaceSize | NullOptionEnum,
) =>
  i18n.t(
    key === NullOptionEnum.Null
      ? 'unknown'
      : `stopDetails.infoSpots.posterPlaceSizes.${key}`,
  );

export const mapStopAccessibilityLevelToUiName = (
  key: StopRegistryAccessibilityLevel,
) => i18n.t(`stopAccessibilityLevelEnum.${key}`);

export const mapLineTypeToUiName = (
  key: RouteTypeOfLineEnum | AllOptionEnum.All,
) => i18n.t(key === AllOptionEnum.All ? 'all' : `lineTypeEnum.${key}`);

export function mapDirectionToUiName(
  t: TFunction,
  direction: RouteDirectionEnum,
) {
  switch (direction) {
    case RouteDirectionEnum.Inbound:
      return t(`directionEnum.inbound`);

    case RouteDirectionEnum.Outbound:
      return t(`directionEnum.outbound`);

    default:
      return `? - ${direction}`;
  }
}

export function mapDirectionToSymbol(
  t: TFunction,
  direction: RouteDirectionEnum,
) {
  switch (direction) {
    case RouteDirectionEnum.Inbound:
      return t(`directionEnum.symbol.inbound`);

    case RouteDirectionEnum.Outbound:
      return t(`directionEnum.symbol.outbound`);

    default:
      return '?';
  }
}

export function mapDirectionToLabel(
  t: TFunction,
  direction: RouteDirectionEnum,
) {
  switch (direction) {
    case RouteDirectionEnum.Inbound:
      return t(`directionEnum.label.inbound`);

    case RouteDirectionEnum.Outbound:
      return t(`directionEnum.label.outbound`);

    default:
      return String(direction);
  }
}

export const mapTransportTargetToUiName = (key: HslRouteTransportTargetEnum) =>
  i18n.t(`transportTargetEnum.${key}`);

export const mapSubstituteDayOfWeekToUiName = (key: SubstituteDayOfWeek) => {
  const uiStrings: Record<SubstituteDayOfWeek, string> = {
    [SubstituteDayOfWeek.NoTraffic]: i18n.t('timetableDayEnum.noTraffic'),
    [SubstituteDayOfWeek.Monday]: i18n.t('timetableDayEnum.monday'),
    [SubstituteDayOfWeek.Tuesday]: i18n.t('timetableDayEnum.tuesday'),
    [SubstituteDayOfWeek.Wednesday]: i18n.t('timetableDayEnum.wednesday'),
    [SubstituteDayOfWeek.Thursday]: i18n.t('timetableDayEnum.thursday'),
    [SubstituteDayOfWeek.Friday]: i18n.t('timetableDayEnum.friday'),
    [SubstituteDayOfWeek.Saturday]: i18n.t('timetableDayEnum.saturday'),
    [SubstituteDayOfWeek.Sunday]: i18n.t('timetableDayEnum.sunday'),
  };
  return uiStrings[key];
};

export const mapMunicipalityToUiName = (
  key: StopRegistryMunicipality | AllOptionEnum,
) => {
  return key === AllOptionEnum.All ? i18n.t('all') : key.toString();
};
