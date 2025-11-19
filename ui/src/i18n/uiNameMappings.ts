import { TFunction } from 'i18next';
import { InfoSpotPurposeEnum } from '../components/stop-registry/stops/stop-details/info-spots/types';
import { TerminalType } from '../components/stop-registry/types/TerminalType';
import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
  StopRegistryAccessibilityLevel,
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
  StopRegistryShelterWidthType,
  StopRegistrySignContentType,
  StopRegistryStopType,
  StopRegistryTransportModeType,
} from '../generated/graphql';
import {
  DayOfWeek,
  Priority,
  SubstituteDayOfWeek,
  TimetablePriority,
} from '../types/enums';
import {
  JoreStopRegistryTransportModeType,
  StopOwner,
  StopPlaceSignType,
  StopPlaceState,
} from '../types/stop-registry';
import { AllOptionEnum, NullOptionEnum } from '../utils';

class UnknownTranslationRequestedError extends Error {
  constructor(value: unknown) {
    super(
      `Requested translation for value (${value}), but no mapper or defaultValue was found for it!`,
    );
  }
}

export type Translatable = string | number | symbol;

type TranslationMapping<MappedValue extends Translatable> = Readonly<
  Record<MappedValue, (t: TFunction) => string>
>;

export interface TranslationMapper<
  MappedValue extends Translatable,
  InputValue extends Translatable = MappedValue,
> {
  (t: TFunction, value: InputValue): string;
}

export interface ExtendableTranslationMapper<
  MappedValue extends Translatable,
  InputValue extends Translatable = MappedValue,
> extends TranslationMapper<MappedValue, InputValue> {
  extend<
    MappedValueExtensions extends Translatable,
    InputValueExtension extends Translatable = MappedValueExtensions,
  >(
    extensions: TranslationMapping<MappedValueExtensions>,
    extendedDefaultValue?: (
      t: TFunction,
      value: InputValue | InputValueExtension,
    ) => string,
  ): ExtendableTranslationMapper<
    MappedValue | MappedValueExtensions,
    InputValue | InputValueExtension
  >;
}

function genTranslationMapper<
  MappedValue extends Translatable,
  InputValue extends Translatable = MappedValue,
>(
  mapping: TranslationMapping<MappedValue>,
  defaultValue?: (t: TFunction, value: InputValue) => string,
): ExtendableTranslationMapper<MappedValue, InputValue> {
  const mapper = ((t: TFunction, value: InputValue): string => {
    if (value in mapping) {
      return mapping[value as unknown as MappedValue](t);
    }

    if (defaultValue) {
      return defaultValue(t, value);
    }

    throw new UnknownTranslationRequestedError(value);
  }) as ExtendableTranslationMapper<MappedValue, InputValue>;

  mapper.extend = function extend<
    MappedValueExtensions extends Translatable,
    InputValueExtension extends Translatable = MappedValueExtensions,
  >(
    extensions: TranslationMapping<MappedValueExtensions>,
    extendedDefaultValue?: (
      t: TFunction,
      value: InputValue | InputValueExtension,
    ) => string,
  ) {
    return genTranslationMapper<
      MappedValue | MappedValueExtensions,
      InputValue | InputValueExtension
    >({ ...mapping, ...extensions }, extendedDefaultValue);
  };

  return mapper;
}

export const mapPriorityToUiName = genTranslationMapper<Priority>({
  [Priority.Standard]: (t) => t('priority.standard'),
  [Priority.Temporary]: (t) => t('priority.temporary'),
  [Priority.Draft]: (t) => t('priority.draft'),
});

export const mapTimetablePriorityToUiName =
  genTranslationMapper<TimetablePriority>({
    [TimetablePriority.Standard]: (t) => t('priority.standard'),
    [TimetablePriority.Temporary]: (t) => t('priority.temporary'),
    [TimetablePriority.Draft]: (t) => t('priority.draft'),
    [TimetablePriority.SubstituteByLineType]: (t) => t('priority.substitute'),
    [TimetablePriority.Special]: (t) => t('priority.special'),
    [TimetablePriority.Staging]: () => '', // NOTE: staging priorities are not intented to be shown in UI
  });

export const mapDayOfWeekToUiName = genTranslationMapper<DayOfWeek>({
  [DayOfWeek.Monday]: (t) => t('dayOfWeek.monday'),
  [DayOfWeek.Tuesday]: (t) => t('dayOfWeek.tuesday'),
  [DayOfWeek.Wednesday]: (t) => t('dayOfWeek.wednesday'),
  [DayOfWeek.Thursday]: (t) => t('dayOfWeek.thursday'),
  [DayOfWeek.Friday]: (t) => t('dayOfWeek.friday'),
  [DayOfWeek.Saturday]: (t) => t('dayOfWeek.saturday'),
  [DayOfWeek.Sunday]: (t) => t('dayOfWeek.sunday'),
});

export const mapVehicleModeToUiName = genTranslationMapper<
  ReusableComponentsVehicleModeEnum | AllOptionEnum.All
>({
  [AllOptionEnum.All]: (t) => t('all'),
  [ReusableComponentsVehicleModeEnum.Bus]: (t) => t('vehicleModeEnum.bus'),
  [ReusableComponentsVehicleModeEnum.Ferry]: (t) => t('vehicleModeEnum.ferry'),
  [ReusableComponentsVehicleModeEnum.Metro]: (t) => t('vehicleModeEnum.metro'),
  [ReusableComponentsVehicleModeEnum.Train]: (t) => t('vehicleModeEnum.train'),
  [ReusableComponentsVehicleModeEnum.Tram]: (t) => t('vehicleModeEnum.tram'),
});

export const mapStopRegistryTransportModeTypeToUiName = genTranslationMapper<
  JoreStopRegistryTransportModeType,
  JoreStopRegistryTransportModeType | StopRegistryTransportModeType
>({
  [JoreStopRegistryTransportModeType.Bus]: (t) =>
    t('stopRegistryTransportModeTypeEnum.bus'),
  [JoreStopRegistryTransportModeType.Metro]: (t) =>
    t('stopRegistryTransportModeTypeEnum.metro'),
  [JoreStopRegistryTransportModeType.Rail]: (t) =>
    t('stopRegistryTransportModeTypeEnum.rail'),
  [JoreStopRegistryTransportModeType.Tram]: (t) =>
    t('stopRegistryTransportModeTypeEnum.tram'),
  [JoreStopRegistryTransportModeType.Water]: (t) =>
    t('stopRegistryTransportModeTypeEnum.water'),
});

export const mapStopPlaceStateToUiName = genTranslationMapper<StopPlaceState>({
  [StopPlaceState.InOperation]: (t) => t('stopPlaceStateEnum.InOperation'),
  [StopPlaceState.OutOfOperation]: (t) =>
    t('stopPlaceStateEnum.OutOfOperation'),
  [StopPlaceState.PermanentlyOutOfOperation]: (t) =>
    t('stopPlaceStateEnum.PermanentlyOutOfOperation'),
  [StopPlaceState.Removed]: (t) => t('stopPlaceStateEnum.Removed'),
});

export const mapStopPlaceSignTypeToUiName =
  genTranslationMapper<StopPlaceSignType>({
    [StopPlaceSignType.None]: (t) => t('stopPlaceSignTypeEnum.None'),
    [StopPlaceSignType.StopSign]: (t) => t('stopPlaceSignTypeEnum.StopSign'),
    [StopPlaceSignType.CanopyFrame]: (t) =>
      t('stopPlaceSignTypeEnum.CanopyFrame'),
    [StopPlaceSignType.PoleSign]: (t) => t('stopPlaceSignTypeEnum.PoleSign'),
    [StopPlaceSignType.JokerSign]: (t) => t('stopPlaceSignTypeEnum.JokerSign'),
    [StopPlaceSignType.Minibuses]: (t) => t('stopPlaceSignTypeEnum.Minibuses'),
  });

export const mapSignContentTypeToUiName = genTranslationMapper<
  | StopRegistrySignContentType.TransportModePoint
  | StopRegistrySignContentType.Other
  | NullOptionEnum,
  StopRegistrySignContentType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('signContentTypeEnum.none'),
  [StopRegistrySignContentType.TransportModePoint]: (t) =>
    t('signContentTypeEnum.transportModePoint'),
  [StopRegistrySignContentType.Other]: (t) => t('signContentTypeEnum.other'),
});

export const mapStopRegistryStopTypeToUiName = genTranslationMapper<
  StopRegistryStopType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryStopType.BusBulb]: (t) => t('stopRegistryStopTypeEnum.busBulb'),
  [StopRegistryStopType.InLane]: (t) => t('stopRegistryStopTypeEnum.inLane'),
  [StopRegistryStopType.Other]: (t) => t('stopRegistryStopTypeEnum.other'),
  [StopRegistryStopType.PullOut]: (t) => t('stopRegistryStopTypeEnum.pullOut'),
});

export const mapStopRegistryShelterWidthTypeToUiName = genTranslationMapper<
  StopRegistryShelterWidthType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryShelterWidthType.Narrow]: (t) =>
    t('stopRegistryShelterWidthTypeEnum.narrow'),
  [StopRegistryShelterWidthType.Other]: (t) =>
    t('stopRegistryShelterWidthTypeEnum.other'),
  [StopRegistryShelterWidthType.Wide]: (t) =>
    t('stopRegistryShelterWidthTypeEnum.wide'),
});

export const mapStopRegistryPedestrianCrossingRampTypeToUiName =
  genTranslationMapper<StopRegistryPedestrianCrossingRampType | NullOptionEnum>(
    {
      [NullOptionEnum.Null]: (t) => t('unknown'),
      [StopRegistryPedestrianCrossingRampType.Lr]: (t) =>
        t('stopRegistryPedestrianCrossingRampTypeEnum.LR'),
      [StopRegistryPedestrianCrossingRampType.Rk4]: (t) =>
        t('stopRegistryPedestrianCrossingRampTypeEnum.RK4'),
      [StopRegistryPedestrianCrossingRampType.Rk4Lr]: (t) =>
        t('stopRegistryPedestrianCrossingRampTypeEnum.RK4_LR'),
      [StopRegistryPedestrianCrossingRampType.Other]: (t) =>
        t('stopRegistryPedestrianCrossingRampTypeEnum.other'),
    },
  );

export const mapStopRegistryGuidanceTypeToUiName = genTranslationMapper<
  StopRegistryGuidanceType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryGuidanceType.Braille]: (t) =>
    t('stopRegistryGuidanceTypeEnum.braille'),
  [StopRegistryGuidanceType.None]: (t) =>
    t('stopRegistryGuidanceTypeEnum.none'),
  [StopRegistryGuidanceType.Other]: (t) =>
    t('stopRegistryGuidanceTypeEnum.other'),
});

export const mapStopRegistryMapTypeToUiName = genTranslationMapper<
  StopRegistryMapType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryMapType.None]: (t) => t('stopRegistryMapTypeEnum.none'),
  [StopRegistryMapType.Other]: (t) => t('stopRegistryMapTypeEnum.other'),
  [StopRegistryMapType.Tactile]: (t) => t('stopRegistryMapTypeEnum.tactile'),
});

export const mapStopRegistryShelterConditionEnumToUiName = genTranslationMapper<
  StopRegistryShelterCondition | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryShelterCondition.Bad]: (t) =>
    t('stopRegistryShelterConditionEnum.bad'),
  [StopRegistryShelterCondition.Good]: (t) =>
    t('stopRegistryShelterConditionEnum.good'),
  [StopRegistryShelterCondition.Mediocre]: (t) =>
    t('stopRegistryShelterConditionEnum.mediocre'),
});

export const mapStopRegistryShelterElectricityEnumToUiName =
  genTranslationMapper<StopRegistryShelterElectricity | NullOptionEnum>({
    [NullOptionEnum.Null]: (t) => t('unknown'),
    [StopRegistryShelterElectricity.Continuous]: (t) =>
      t('stopRegistryShelterElectricityEnum.continuous'),
    [StopRegistryShelterElectricity.ContinuousPlanned]: (t) =>
      t('stopRegistryShelterElectricityEnum.continuousPlanned'),
    [StopRegistryShelterElectricity.ContinuousUnderConstruction]: (t) =>
      t('stopRegistryShelterElectricityEnum.continuousUnderConstruction'),
    [StopRegistryShelterElectricity.Light]: (t) =>
      t('stopRegistryShelterElectricityEnum.light'),
    [StopRegistryShelterElectricity.None]: (t) =>
      t('stopRegistryShelterElectricityEnum.none'),
    [StopRegistryShelterElectricity.TemporarilyOff]: (t) =>
      t('stopRegistryShelterElectricityEnum.temporarilyOff'),
  });

export const mapStopRegistryShelterTypeEnumToUiName = genTranslationMapper<
  StopRegistryShelterType | NullOptionEnum
>({
  [NullOptionEnum.Null]: (t) => t('unknown'),
  [StopRegistryShelterType.Concrete]: (t) =>
    t('stopRegistryShelterTypeEnum.concrete'),
  [StopRegistryShelterType.Glass]: (t) =>
    t('stopRegistryShelterTypeEnum.glass'),
  [StopRegistryShelterType.Post]: (t) => t('stopRegistryShelterTypeEnum.post'),
  [StopRegistryShelterType.Steel]: (t) =>
    t('stopRegistryShelterTypeEnum.steel'),
  [StopRegistryShelterType.Urban]: (t) =>
    t('stopRegistryShelterTypeEnum.urban'),
  [StopRegistryShelterType.Virtual]: (t) =>
    t('stopRegistryShelterTypeEnum.virtual'),
  [StopRegistryShelterType.Wooden]: (t) =>
    t('stopRegistryShelterTypeEnum.wooden'),
});

export const mapStopAccessibilityLevelToUiName =
  genTranslationMapper<StopRegistryAccessibilityLevel>({
    [StopRegistryAccessibilityLevel.FullyAccessible]: (t) =>
      t('stopAccessibilityLevelEnum.fullyAccessible'),
    [StopRegistryAccessibilityLevel.Inaccessible]: (t) =>
      t('stopAccessibilityLevelEnum.inaccessible'),
    [StopRegistryAccessibilityLevel.MostlyAccessible]: (t) =>
      t('stopAccessibilityLevelEnum.mostlyAccessible'),
    [StopRegistryAccessibilityLevel.PartiallyInaccessible]: (t) =>
      t('stopAccessibilityLevelEnum.partiallyInaccessible'),
    [StopRegistryAccessibilityLevel.Unknown]: (t) =>
      t('stopAccessibilityLevelEnum.unknown'),
  });

export const mapLineTypeToUiName = genTranslationMapper<
  RouteTypeOfLineEnum | AllOptionEnum
>({
  [AllOptionEnum.All]: (t) => t('all'),
  [RouteTypeOfLineEnum.CityTramService]: (t) =>
    t('lineTypeEnum.city_tram_service'),
  [RouteTypeOfLineEnum.DemandAndResponseBusService]: (t) =>
    t('lineTypeEnum.demand_and_response_bus_service'),
  [RouteTypeOfLineEnum.ExpressBusService]: (t) =>
    t('lineTypeEnum.express_bus_service'),
  [RouteTypeOfLineEnum.FerryService]: (t) => t('lineTypeEnum.ferry_service'),
  [RouteTypeOfLineEnum.MetroService]: (t) => t('lineTypeEnum.metro_service'),
  [RouteTypeOfLineEnum.RegionalBusService]: (t) =>
    t('lineTypeEnum.regional_bus_service'),
  [RouteTypeOfLineEnum.RegionalRailService]: (t) =>
    t('lineTypeEnum.regional_rail_service'),
  [RouteTypeOfLineEnum.RegionalTramService]: (t) =>
    t('lineTypeEnum.regional_tram_service'),
  [RouteTypeOfLineEnum.SpecialNeedsBus]: (t) =>
    t('lineTypeEnum.special_needs_bus'),
  [RouteTypeOfLineEnum.StoppingBusService]: (t) =>
    t('lineTypeEnum.stopping_bus_service'),
  [RouteTypeOfLineEnum.SuburbanRailway]: (t) =>
    t('lineTypeEnum.suburban_railway'),
});

export const mapDirectionToUiName = genTranslationMapper<
  RouteDirectionEnum.Inbound | RouteDirectionEnum.Outbound,
  RouteDirectionEnum
>(
  {
    [RouteDirectionEnum.Inbound]: (t) => t('directionEnum.inbound'),
    [RouteDirectionEnum.Outbound]: (t) => t('directionEnum.outbound'),
  },
  (_, direction) => `? - ${direction}`,
);

export const mapDirectionToSymbol = genTranslationMapper<
  RouteDirectionEnum.Inbound | RouteDirectionEnum.Outbound,
  RouteDirectionEnum
>(
  {
    [RouteDirectionEnum.Inbound]: (t) => t('directionEnum.symbol.inbound'),
    [RouteDirectionEnum.Outbound]: (t) => t('directionEnum.symbol.outbound'),
  },
  () => '?',
);

export const mapDirectionToLabel = genTranslationMapper<
  RouteDirectionEnum.Inbound | RouteDirectionEnum.Outbound,
  RouteDirectionEnum
>(
  {
    [RouteDirectionEnum.Inbound]: (t) => t('directionEnum.label.inbound'),
    [RouteDirectionEnum.Outbound]: (t) => t('directionEnum.label.outbound'),
  },
  (_, direction) => String(direction),
);

export const mapTransportTargetToUiName =
  genTranslationMapper<HslRouteTransportTargetEnum>({
    [HslRouteTransportTargetEnum.EspooAndKauniainenInternalTraffic]: (t) =>
      t('transportTargetEnum.espoo_and_kauniainen_internal_traffic'),
    [HslRouteTransportTargetEnum.EspooRegionalTraffic]: (t) =>
      t('transportTargetEnum.espoo_regional_traffic'),
    [HslRouteTransportTargetEnum.HelsinkiInternalTraffic]: (t) =>
      t('transportTargetEnum.helsinki_internal_traffic'),
    [HslRouteTransportTargetEnum.KeravaInternalTraffic]: (t) =>
      t('transportTargetEnum.kerava_internal_traffic'),
    [HslRouteTransportTargetEnum.KeravaRegionalTraffic]: (t) =>
      t('transportTargetEnum.kerava_regional_traffic'),
    [HslRouteTransportTargetEnum.KirkkonummiInternalTraffic]: (t) =>
      t('transportTargetEnum.kirkkonummi_internal_traffic'),
    [HslRouteTransportTargetEnum.KirkkonummiRegionalTraffic]: (t) =>
      t('transportTargetEnum.kirkkonummi_regional_traffic'),
    [HslRouteTransportTargetEnum.SipooInternalTraffic]: (t) =>
      t('transportTargetEnum.sipoo_internal_traffic'),
    [HslRouteTransportTargetEnum.SiuntioInternalTraffic]: (t) =>
      t('transportTargetEnum.siuntio_internal_traffic'),
    [HslRouteTransportTargetEnum.SiuntioRegionalTraffic]: (t) =>
      t('transportTargetEnum.siuntio_regional_traffic'),
    [HslRouteTransportTargetEnum.TransverseRegional]: (t) =>
      t('transportTargetEnum.transverse_regional'),
    [HslRouteTransportTargetEnum.TuusulaInternalTraffic]: (t) =>
      t('transportTargetEnum.tuusula_internal_traffic'),
    [HslRouteTransportTargetEnum.TuusulaRegionalTraffic]: (t) =>
      t('transportTargetEnum.tuusula_regional_traffic'),
    [HslRouteTransportTargetEnum.VantaaInternalTraffic]: (t) =>
      t('transportTargetEnum.vantaa_internal_traffic'),
    [HslRouteTransportTargetEnum.VantaaRegionalTraffic]: (t) =>
      t('transportTargetEnum.vantaa_regional_traffic'),
  });

export const mapSubstituteDayOfWeekToUiName = genTranslationMapper<
  SubstituteDayOfWeek | AllOptionEnum
>({
  [AllOptionEnum.All]: (t) => t('all'),
  [SubstituteDayOfWeek.NoTraffic]: (t) => t('timetableDayEnum.noTraffic'),
  [SubstituteDayOfWeek.Monday]: (t) => t('timetableDayEnum.monday'),
  [SubstituteDayOfWeek.Tuesday]: (t) => t('timetableDayEnum.tuesday'),
  [SubstituteDayOfWeek.Wednesday]: (t) => t('timetableDayEnum.wednesday'),
  [SubstituteDayOfWeek.Thursday]: (t) => t('timetableDayEnum.thursday'),
  [SubstituteDayOfWeek.Friday]: (t) => t('timetableDayEnum.friday'),
  [SubstituteDayOfWeek.Saturday]: (t) => t('timetableDayEnum.saturday'),
  [SubstituteDayOfWeek.Sunday]: (t) => t('timetableDayEnum.sunday'),
});

export const mapTerminalTypeToUiName = genTranslationMapper<TerminalType>({
  [TerminalType.RailwayStation]: (t) => t('terminalTypeEnum.railwayStation'),
  [TerminalType.BusTerminal]: (t) => t('terminalTypeEnum.busTerminal'),
  [TerminalType.TramTerminal]: (t) => t('terminalTypeEnum.tramTerminal'),
  [TerminalType.MetroTerminal]: (t) => t('terminalTypeEnum.metroTerminal'),
  [TerminalType.FerryTerminal]: (t) => t('terminalTypeEnum.ferryTerminal'),
  [TerminalType.FerryStation]: (t) => t('terminalTypeEnum.ferryStation'),
});

export const mapInfoSpotPurposeToUiName =
  genTranslationMapper<InfoSpotPurposeEnum>({
    [InfoSpotPurposeEnum.NULL]: (t) => t('stopDetails.infoSpots.purposes.null'),
    [InfoSpotPurposeEnum.POSTER]: (t) =>
      t('stopDetails.infoSpots.purposes.poster'),
    [InfoSpotPurposeEnum.MAP]: (t) => t('stopDetails.infoSpots.purposes.map'),
    [InfoSpotPurposeEnum.INSTRUCTION]: (t) =>
      t('stopDetails.infoSpots.purposes.instruction'),
    [InfoSpotPurposeEnum.NEIGHBORHOOD_MAP]: (t) =>
      t('stopDetails.infoSpots.purposes.neighborhoodMap'),
    [InfoSpotPurposeEnum.ANNOUNCEMENT]: (t) =>
      t('stopDetails.infoSpots.purposes.announcement'),
    [InfoSpotPurposeEnum.OTHER]: (t) =>
      t('stopDetails.infoSpots.purposes.other'),
  });

export const mapStopOwnerToUiName = genTranslationMapper<StopOwner>({
  [StopOwner.Municipality]: (t) =>
    t('stopDetails.maintenance.stopOwnerOptions.municipality'),
  [StopOwner.Finavia]: (t) =>
    t('stopDetails.maintenance.stopOwnerOptions.finavia'),
  [StopOwner.Hkl]: (t) => t('stopDetails.maintenance.stopOwnerOptions.hkl'),
  [StopOwner.Hkr]: (t) => t('stopDetails.maintenance.stopOwnerOptions.hkr'),
  [StopOwner.Vr]: (t) => t('stopDetails.maintenance.stopOwnerOptions.vr'),
  [StopOwner.Ely]: (t) => t('stopDetails.maintenance.stopOwnerOptions.ely'),
  [StopOwner.FinnishTransportAgency]: (t) =>
    t('stopDetails.maintenance.stopOwnerOptions.finnishTransportAgency'),
  [StopOwner.PrivateRoad]: (t) =>
    t('stopDetails.maintenance.stopOwnerOptions.privateRoad'),
  [StopOwner.Other]: (t) => t('stopDetails.maintenance.stopOwnerOptions.other'),
});
