import { ApolloQueryResult, QueryResult } from '@apollo/client';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { DateTime } from 'luxon';
import { QueryRoot } from '../generated/graphql';

export type GqlQueryResultData = { __typename?: 'query_root' };
export type GqlMutationResultData = { __typename?: 'mutation_root' };

export type GqlQueryResult<TData extends GqlQueryResultData> = Pick<
  | QueryResult<TData> // from useQuery
  | ApolloQueryResult<TData>, // from apolloClient.query
  'data'
>;

export type GqlScalar =
  | string
  | number
  | boolean
  | null
  | undefined
  | DateTime
  | GeoJSON.Geometry
  | LocalizedString;

// For stop registry, there doesn't seem to be any nice way to pick the typenames automatically.
// This list has been handpicked from generated graphql.
type StopRegistryEntities =
  | 'stop_registry_AccessibilityAssessment'
  | 'stop_registry_AccessibilityLimitations'
  | 'stop_registry_AddressablePlace'
  | 'stop_registry_AlternativeName'
  | 'stop_registry_AuthorizationCheck'
  | 'stop_registry_BoardingPosition'
  | 'stop_registry_CycleStorageEquipment'
  | 'stop_registry_EmbeddableMultilingualString'
  | 'stop_registry_EntityRef'
  | 'stop_registry_FareZone'
  | 'stop_registry_GeneralSign'
  | 'stop_registry_GeoJSON'
  | 'stop_registry_GroupOfStopPlaces'
  | 'stop_registry_GroupOfTariffZones'
  | 'stop_registry_HslAccessibilityProperties'
  | 'stop_registry_KeyValues'
  | 'stop_registry_ParentStopPlace'
  | 'stop_registry_Parking'
  | 'stop_registry_ParkingArea'
  | 'stop_registry_ParkingCapacity'
  | 'stop_registry_ParkingProperties'
  | 'stop_registry_PathLink'
  | 'stop_registry_PathLinkEnd'
  | 'stop_registry_PlaceEquipments'
  | 'stop_registry_PrivateCode'
  | 'stop_registry_PurposeOfGrouping'
  | 'stop_registry_Quay'
  | 'stop_registry_SanitaryEquipment'
  | 'stop_registry_ShelterEquipment'
  | 'stop_registry_StopPlace'
  | 'stop_registry_Tag'
  | 'stop_registry_TariffZone'
  | 'stop_registry_TicketingEquipment'
  | 'stop_registry_TopographicPlace'
  | 'stop_registry_TransferDuration'
  | 'stop_registry_TransportModes'
  | 'stop_registry_ValidBetween'
  | 'stop_registry_VersionLessEntityRef'
  | 'stop_registry_WaitingRoomEquipment';

// this actually includes more than just the entity types, but at least is updated automatically by graphql-codegen
// Note: this does NOT include eg. timetables and stop registry DBs.
export type GqlEntityType = keyof QueryRoot | StopRegistryEntities;

export type GqlEntity = {
  __typename?: GqlEntityType;
  [key: string]: GqlEntity | GqlEntity[] | GqlScalar;
};

/**
 * Like `isGqlEntity` but not as type safe.
 * Can be used to check entity types that are not included in `GqlEntityType`.
 */
export const hasTypeName = (
  entity: unknown,
): entity is { __typename: string } =>
  isObject(entity) && '__typename' in entity;

export const isGqlEntity = (entity: unknown): entity is GqlEntity =>
  hasTypeName(entity);

export const isGqlEntityArray = (entity: unknown): entity is GqlEntity[] =>
  isArray(entity) && entity.every(isGqlEntity);
