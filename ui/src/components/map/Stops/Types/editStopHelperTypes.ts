import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  RouteUniqueFieldsFragment,
  ScheduledStopPointAllFieldsFragment,
  ServicePatternScheduledStopPointSetInput,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInput,
} from '../../../../generated/graphql';

export type EditParams = {
  readonly stopLabel: string;
  readonly stopId: UUID;
  readonly stopPointPatch: ServicePatternScheduledStopPointSetInput;
  readonly stopPlaceId: string;
  readonly quayId: string;
  readonly quayPatch: StopRegistryQuayInput;
};

export type EditChanges = {
  readonly stopId: UUID;
  readonly stopLabel: string;
  readonly stopPointPatch: ServicePatternScheduledStopPointSetInput | null;
  readonly stopPlacePatch: StopRegistryStopPlaceInput | null;
  readonly editedStop: ScheduledStopPointAllFieldsFragment;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
  readonly deleteStopFromJourneyPatternIds?: ReadonlyArray<UUID>;
  readonly conflicts?: ReadonlyArray<ScheduledStopPointAllFieldsFragment>;
  readonly quayId: string;
  readonly isMove?: boolean;
};

export type BrokenRouteCheckParams = {
  readonly newLink: InfrastructureNetworkInfrastructureLink;
  readonly newDirection: InfrastructureNetworkDirectionEnum;
  readonly newStop: ServicePatternScheduledStopPointSetInput;
  readonly label: string;
  readonly priority: number;
  readonly stopId: UUID | null;
  readonly vehicleMode?: string | null;
};
