import * as luxon from 'luxon';
import { useAsyncQuery } from '../hooks/useAsyncQuery';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  date: luxon.DateTime;
  float8: number;
  geography: GeoJSON.Geometry;
  geography_linestring: GeoJSON.LineString;
  geography_point: GeoJSON.Point;
  geometry: GeoJSON.Geometry;
  interval: luxon.Duration;
  jsonb: any;
  localized_string: LocalizedString;
  smallint: number;
  timestamptz: luxon.DateTime;
  uuid: UUID;
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type BooleanComparisonExp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Maybe<Scalars['String']>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
};

/** ordering argument of a cursor */
export enum CursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type DateComparisonExp = {
  _eq?: Maybe<Scalars['date']>;
  _gt?: Maybe<Scalars['date']>;
  _gte?: Maybe<Scalars['date']>;
  _in?: Maybe<Array<Scalars['date']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['date']>;
  _lte?: Maybe<Scalars['date']>;
  _neq?: Maybe<Scalars['date']>;
  _nin?: Maybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8ComparisonExp = {
  _eq?: Maybe<Scalars['float8']>;
  _gt?: Maybe<Scalars['float8']>;
  _gte?: Maybe<Scalars['float8']>;
  _in?: Maybe<Array<Scalars['float8']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['float8']>;
  _lte?: Maybe<Scalars['float8']>;
  _neq?: Maybe<Scalars['float8']>;
  _nin?: Maybe<Array<Scalars['float8']>>;
};

export type GeographyCastExp = {
  geometry?: Maybe<GeometryComparisonExp>;
};

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export type GeographyComparisonExp = {
  _cast?: Maybe<GeographyCastExp>;
  _eq?: Maybe<Scalars['geography']>;
  _gt?: Maybe<Scalars['geography']>;
  _gte?: Maybe<Scalars['geography']>;
  _in?: Maybe<Array<Scalars['geography']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['geography']>;
  _lte?: Maybe<Scalars['geography']>;
  _neq?: Maybe<Scalars['geography']>;
  _nin?: Maybe<Array<Scalars['geography']>>;
  /** is the column within a given distance from the given geography value */
  _st_d_within?: Maybe<StDWithinGeographyInput>;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: Maybe<Scalars['geography']>;
};

export type GeometryCastExp = {
  geography?: Maybe<GeographyComparisonExp>;
};

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export type GeometryComparisonExp = {
  _cast?: Maybe<GeometryCastExp>;
  _eq?: Maybe<Scalars['geometry']>;
  _gt?: Maybe<Scalars['geometry']>;
  _gte?: Maybe<Scalars['geometry']>;
  _in?: Maybe<Array<Scalars['geometry']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['geometry']>;
  _lte?: Maybe<Scalars['geometry']>;
  _neq?: Maybe<Scalars['geometry']>;
  _nin?: Maybe<Array<Scalars['geometry']>>;
  /** is the column within a given 3D distance from the given geometry value */
  _st_3d_d_within?: Maybe<StDWithinInput>;
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: Maybe<Scalars['geometry']>;
  /** does the column contain the given geometry value */
  _st_contains?: Maybe<Scalars['geometry']>;
  /** does the column cross the given geometry value */
  _st_crosses?: Maybe<Scalars['geometry']>;
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: Maybe<StDWithinInput>;
  /** is the column equal to given geometry value (directionality is ignored) */
  _st_equals?: Maybe<Scalars['geometry']>;
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: Maybe<Scalars['geometry']>;
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: Maybe<Scalars['geometry']>;
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: Maybe<Scalars['geometry']>;
  /** is the column contained in the given geometry value */
  _st_within?: Maybe<Scalars['geometry']>;
};

/** Transport target, can be used e.g. for cost sharing. */
export type HslRouteTransportTarget = {
  __typename?: 'hsl_route_transport_target';
  /** An array relationship */
  lines: Array<RouteLine>;
  /** An aggregate relationship */
  lines_aggregate: RouteLineAggregate;
  transport_target: Scalars['String'];
};

/** Transport target, can be used e.g. for cost sharing. */
export type HslRouteTransportTargetLinesArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/** Transport target, can be used e.g. for cost sharing. */
export type HslRouteTransportTargetLinesAggregateArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/** aggregated selection of "hsl_route.transport_target" */
export type HslRouteTransportTargetAggregate = {
  __typename?: 'hsl_route_transport_target_aggregate';
  aggregate?: Maybe<HslRouteTransportTargetAggregateFields>;
  nodes: Array<HslRouteTransportTarget>;
};

/** aggregate fields of "hsl_route.transport_target" */
export type HslRouteTransportTargetAggregateFields = {
  __typename?: 'hsl_route_transport_target_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<HslRouteTransportTargetMaxFields>;
  min?: Maybe<HslRouteTransportTargetMinFields>;
};

/** aggregate fields of "hsl_route.transport_target" */
export type HslRouteTransportTargetAggregateFieldsCountArgs = {
  columns?: Maybe<Array<HslRouteTransportTargetSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "hsl_route.transport_target". All fields are combined with a logical 'AND'. */
export type HslRouteTransportTargetBoolExp = {
  _and?: Maybe<Array<HslRouteTransportTargetBoolExp>>;
  _not?: Maybe<HslRouteTransportTargetBoolExp>;
  _or?: Maybe<Array<HslRouteTransportTargetBoolExp>>;
  lines?: Maybe<RouteLineBoolExp>;
  lines_aggregate?: Maybe<RouteLineAggregateBoolExp>;
  transport_target?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "hsl_route.transport_target" */
export enum HslRouteTransportTargetConstraint {
  /** unique or primary key constraint on columns "transport_target" */
  TransportTargetPkey = 'transport_target_pkey',
}

export enum HslRouteTransportTargetEnum {
  EspooAndKauniainenInternalTraffic = 'espoo_and_kauniainen_internal_traffic',
  EspooRegionalTraffic = 'espoo_regional_traffic',
  HelsinkiInternalTraffic = 'helsinki_internal_traffic',
  KeravaInternalTraffic = 'kerava_internal_traffic',
  KeravaRegionalTraffic = 'kerava_regional_traffic',
  KirkkonummiInternalTraffic = 'kirkkonummi_internal_traffic',
  KirkkonummiRegionalTraffic = 'kirkkonummi_regional_traffic',
  SipooInternalTraffic = 'sipoo_internal_traffic',
  SiuntioInternalTraffic = 'siuntio_internal_traffic',
  SiuntioRegionalTraffic = 'siuntio_regional_traffic',
  TransverseRegional = 'transverse_regional',
  TuusulaInternalTraffic = 'tuusula_internal_traffic',
  TuusulaRegionalTraffic = 'tuusula_regional_traffic',
  VantaaInternalTraffic = 'vantaa_internal_traffic',
  VantaaRegionalTraffic = 'vantaa_regional_traffic',
}

/** Boolean expression to compare columns of type "hsl_route_transport_target_enum". All fields are combined with logical 'AND'. */
export type HslRouteTransportTargetEnumComparisonExp = {
  _eq?: Maybe<HslRouteTransportTargetEnum>;
  _in?: Maybe<Array<HslRouteTransportTargetEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<HslRouteTransportTargetEnum>;
  _nin?: Maybe<Array<HslRouteTransportTargetEnum>>;
};

/** input type for inserting data into table "hsl_route.transport_target" */
export type HslRouteTransportTargetInsertInput = {
  lines?: Maybe<RouteLineArrRelInsertInput>;
  transport_target?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type HslRouteTransportTargetMaxFields = {
  __typename?: 'hsl_route_transport_target_max_fields';
  transport_target?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type HslRouteTransportTargetMinFields = {
  __typename?: 'hsl_route_transport_target_min_fields';
  transport_target?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "hsl_route.transport_target" */
export type HslRouteTransportTargetMutationResponse = {
  __typename?: 'hsl_route_transport_target_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<HslRouteTransportTarget>;
};

/** input type for inserting object relation for remote table "hsl_route.transport_target" */
export type HslRouteTransportTargetObjRelInsertInput = {
  data: HslRouteTransportTargetInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<HslRouteTransportTargetOnConflict>;
};

/** on_conflict condition type for table "hsl_route.transport_target" */
export type HslRouteTransportTargetOnConflict = {
  constraint: HslRouteTransportTargetConstraint;
  update_columns?: Array<HslRouteTransportTargetUpdateColumn>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

/** Ordering options when selecting data from "hsl_route.transport_target". */
export type HslRouteTransportTargetOrderBy = {
  lines_aggregate?: Maybe<RouteLineAggregateOrderBy>;
  transport_target?: Maybe<OrderBy>;
};

/** primary key columns input for table: hsl_route.transport_target */
export type HslRouteTransportTargetPkColumnsInput = {
  transport_target: Scalars['String'];
};

/** select columns of table "hsl_route.transport_target" */
export enum HslRouteTransportTargetSelectColumn {
  /** column name */
  TransportTarget = 'transport_target',
}

/** input type for updating data in table "hsl_route.transport_target" */
export type HslRouteTransportTargetSetInput = {
  transport_target?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "hsl_route_transport_target" */
export type HslRouteTransportTargetStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: HslRouteTransportTargetStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type HslRouteTransportTargetStreamCursorValueInput = {
  transport_target?: Maybe<Scalars['String']>;
};

/** update columns of table "hsl_route.transport_target" */
export enum HslRouteTransportTargetUpdateColumn {
  /** column name */
  TransportTarget = 'transport_target',
}

export type HslRouteTransportTargetUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<HslRouteTransportTargetSetInput>;
  where: HslRouteTransportTargetBoolExp;
};

/** The direction in which an e.g. infrastructure link can be traversed */
export type InfrastructureNetworkDirection = {
  __typename?: 'infrastructure_network_direction';
  /** An array relationship */
  infrastructure_links: Array<InfrastructureNetworkInfrastructureLink>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  value: InfrastructureNetworkDirectionEnum;
};

/** The direction in which an e.g. infrastructure link can be traversed */
export type InfrastructureNetworkDirectionInfrastructureLinksArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** The direction in which an e.g. infrastructure link can be traversed */
export type InfrastructureNetworkDirectionInfrastructureLinksAggregateArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** aggregated selection of "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionAggregate = {
  __typename?: 'infrastructure_network_direction_aggregate';
  aggregate?: Maybe<InfrastructureNetworkDirectionAggregateFields>;
  nodes: Array<InfrastructureNetworkDirection>;
};

/** aggregate fields of "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionAggregateFields = {
  __typename?: 'infrastructure_network_direction_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<InfrastructureNetworkDirectionMaxFields>;
  min?: Maybe<InfrastructureNetworkDirectionMinFields>;
};

/** aggregate fields of "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionAggregateFieldsCountArgs = {
  columns?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.direction". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkDirectionBoolExp = {
  _and?: Maybe<Array<InfrastructureNetworkDirectionBoolExp>>;
  _not?: Maybe<InfrastructureNetworkDirectionBoolExp>;
  _or?: Maybe<Array<InfrastructureNetworkDirectionBoolExp>>;
  infrastructure_links?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_links_aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExp>;
  value?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionConstraint {
  /** unique or primary key constraint on columns "value" */
  DirectionPkey = 'direction_pkey',
}

export enum InfrastructureNetworkDirectionEnum {
  Backward = 'backward',
  Bidirectional = 'bidirectional',
  Forward = 'forward',
}

/** Boolean expression to compare columns of type "infrastructure_network_direction_enum". All fields are combined with logical 'AND'. */
export type InfrastructureNetworkDirectionEnumComparisonExp = {
  _eq?: Maybe<InfrastructureNetworkDirectionEnum>;
  _in?: Maybe<Array<InfrastructureNetworkDirectionEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<InfrastructureNetworkDirectionEnum>;
  _nin?: Maybe<Array<InfrastructureNetworkDirectionEnum>>;
};

/** input type for inserting data into table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionInsertInput = {
  infrastructure_links?: Maybe<InfrastructureNetworkInfrastructureLinkArrRelInsertInput>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type InfrastructureNetworkDirectionMaxFields = {
  __typename?: 'infrastructure_network_direction_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type InfrastructureNetworkDirectionMinFields = {
  __typename?: 'infrastructure_network_direction_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionMutationResponse = {
  __typename?: 'infrastructure_network_direction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<InfrastructureNetworkDirection>;
};

/** input type for inserting object relation for remote table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionObjRelInsertInput = {
  data: InfrastructureNetworkDirectionInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<InfrastructureNetworkDirectionOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionOnConflict = {
  constraint: InfrastructureNetworkDirectionConstraint;
  update_columns?: Array<InfrastructureNetworkDirectionUpdateColumn>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.direction". */
export type InfrastructureNetworkDirectionOrderBy = {
  infrastructure_links_aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateOrderBy>;
  value?: Maybe<OrderBy>;
};

/** primary key columns input for table: infrastructure_network.direction */
export type InfrastructureNetworkDirectionPkColumnsInput = {
  value: Scalars['String'];
};

/** select columns of table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionSelectColumn {
  /** column name */
  Value = 'value',
}

/** input type for updating data in table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionSetInput = {
  value?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "infrastructure_network_direction" */
export type InfrastructureNetworkDirectionStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkDirectionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkDirectionStreamCursorValueInput = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionUpdateColumn {
  /** column name */
  Value = 'value',
}

export type InfrastructureNetworkDirectionUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<InfrastructureNetworkDirectionSetInput>;
  where: InfrastructureNetworkDirectionBoolExp;
};

/** An external source from which infrastructure network parts are imported */
export type InfrastructureNetworkExternalSource = {
  __typename?: 'infrastructure_network_external_source';
  /** An array relationship */
  infrastructure_links: Array<InfrastructureNetworkInfrastructureLink>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  value: Scalars['String'];
};

/** An external source from which infrastructure network parts are imported */
export type InfrastructureNetworkExternalSourceInfrastructureLinksArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** An external source from which infrastructure network parts are imported */
export type InfrastructureNetworkExternalSourceInfrastructureLinksAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

/** aggregated selection of "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceAggregate = {
  __typename?: 'infrastructure_network_external_source_aggregate';
  aggregate?: Maybe<InfrastructureNetworkExternalSourceAggregateFields>;
  nodes: Array<InfrastructureNetworkExternalSource>;
};

/** aggregate fields of "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceAggregateFields = {
  __typename?: 'infrastructure_network_external_source_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<InfrastructureNetworkExternalSourceMaxFields>;
  min?: Maybe<InfrastructureNetworkExternalSourceMinFields>;
};

/** aggregate fields of "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceAggregateFieldsCountArgs = {
  columns?: Maybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.external_source". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkExternalSourceBoolExp = {
  _and?: Maybe<Array<InfrastructureNetworkExternalSourceBoolExp>>;
  _not?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
  _or?: Maybe<Array<InfrastructureNetworkExternalSourceBoolExp>>;
  infrastructure_links?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_links_aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExp>;
  value?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceConstraint {
  /** unique or primary key constraint on columns "value" */
  ExternalSourcePkey = 'external_source_pkey',
}

export enum InfrastructureNetworkExternalSourceEnum {
  DigiroadR = 'digiroad_r',
  Fixup = 'fixup',
}

/** Boolean expression to compare columns of type "infrastructure_network_external_source_enum". All fields are combined with logical 'AND'. */
export type InfrastructureNetworkExternalSourceEnumComparisonExp = {
  _eq?: Maybe<InfrastructureNetworkExternalSourceEnum>;
  _in?: Maybe<Array<InfrastructureNetworkExternalSourceEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<InfrastructureNetworkExternalSourceEnum>;
  _nin?: Maybe<Array<InfrastructureNetworkExternalSourceEnum>>;
};

/** input type for inserting data into table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceInsertInput = {
  infrastructure_links?: Maybe<InfrastructureNetworkInfrastructureLinkArrRelInsertInput>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type InfrastructureNetworkExternalSourceMaxFields = {
  __typename?: 'infrastructure_network_external_source_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type InfrastructureNetworkExternalSourceMinFields = {
  __typename?: 'infrastructure_network_external_source_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceMutationResponse = {
  __typename?: 'infrastructure_network_external_source_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<InfrastructureNetworkExternalSource>;
};

/** input type for inserting object relation for remote table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceObjRelInsertInput = {
  data: InfrastructureNetworkExternalSourceInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceOnConflict = {
  constraint: InfrastructureNetworkExternalSourceConstraint;
  update_columns?: Array<InfrastructureNetworkExternalSourceUpdateColumn>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.external_source". */
export type InfrastructureNetworkExternalSourceOrderBy = {
  infrastructure_links_aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateOrderBy>;
  value?: Maybe<OrderBy>;
};

/** primary key columns input for table: infrastructure_network.external_source */
export type InfrastructureNetworkExternalSourcePkColumnsInput = {
  value: Scalars['String'];
};

/** select columns of table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceSelectColumn {
  /** column name */
  Value = 'value',
}

/** input type for updating data in table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceSetInput = {
  value?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "infrastructure_network_external_source" */
export type InfrastructureNetworkExternalSourceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkExternalSourceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkExternalSourceStreamCursorValueInput = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceUpdateColumn {
  /** column name */
  Value = 'value',
}

export type InfrastructureNetworkExternalSourceUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<InfrastructureNetworkExternalSourceSetInput>;
  where: InfrastructureNetworkExternalSourceBoolExp;
};

export type InfrastructureNetworkFindPointDirectionOnLinkArgs = {
  infrastructure_link_uuid?: Maybe<Scalars['uuid']>;
  point_max_distance_in_meters?: Maybe<Scalars['float8']>;
  point_of_interest?: Maybe<Scalars['geography']>;
};

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLink = {
  __typename?: 'infrastructure_network_infrastructure_link';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** An object relationship */
  directionByDirection: InfrastructureNetworkDirection;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id: Scalars['String'];
  external_link_source: InfrastructureNetworkExternalSourceEnum;
  /** An object relationship */
  external_source: InfrastructureNetworkExternalSource;
  /** An array relationship */
  infrastructure_link_along_routes: Array<RouteInfrastructureLinkAlongRoute>;
  /** An aggregate relationship */
  infrastructure_link_along_routes_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_points_located_on_infrastructure_link: Array<ServicePatternScheduledStopPoint>;
  /** An aggregate relationship */
  scheduled_stop_points_located_on_infrastructure_link_aggregate: ServicePatternScheduledStopPointAggregate;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape: Scalars['geography_linestring'];
  /** An array relationship */
  vehicle_submode_on_infrastructure_link: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** An aggregate relationship */
  vehicle_submode_on_infrastructure_link_aggregate: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate;
  /** An array relationship */
  vehicle_submode_on_infrastructure_links: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** An aggregate relationship */
  vehicle_submode_on_infrastructure_links_aggregate: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate;
};

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkInfrastructureLinkAlongRoutesArgs =
  {
    distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkInfrastructureLinkAlongRoutesAggregateArgs =
  {
    distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinksArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinksAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** aggregated selection of "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregate = {
  __typename?: 'infrastructure_network_infrastructure_link_aggregate';
  aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateFields>;
  nodes: Array<InfrastructureNetworkInfrastructureLink>;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExp = {
  avg?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpAvg>;
  corr?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorr>;
  count?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCount>;
  covar_samp?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSamp>;
  max?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpMax>;
  min?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpMin>;
  stddev_samp?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSamp>;
  sum?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpSum>;
  var_samp?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSamp>;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpAvg = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpAvgArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorr = {
  arguments: InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArguments;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArguments =
  {
    X: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArgumentsColumns;
    Y: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArgumentsColumns;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCount = {
  arguments?: Maybe<Array<InfrastructureNetworkInfrastructureLinkSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: IntComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSamp = {
  arguments: InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArguments;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArguments =
  {
    X: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArgumentsColumns;
    Y: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArgumentsColumns;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpMax = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMaxArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpMin = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMinArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSamp =
  {
    arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSampArgumentsColumns;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
    predicate: Float8ComparisonExp;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpSum = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpSumArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSamp = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSampArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

/** aggregate fields of "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregateFields = {
  __typename?: 'infrastructure_network_infrastructure_link_aggregate_fields';
  avg?: Maybe<InfrastructureNetworkInfrastructureLinkAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<InfrastructureNetworkInfrastructureLinkMaxFields>;
  min?: Maybe<InfrastructureNetworkInfrastructureLinkMinFields>;
  stddev?: Maybe<InfrastructureNetworkInfrastructureLinkStddevFields>;
  stddev_pop?: Maybe<InfrastructureNetworkInfrastructureLinkStddevPopFields>;
  stddev_samp?: Maybe<InfrastructureNetworkInfrastructureLinkStddevSampFields>;
  sum?: Maybe<InfrastructureNetworkInfrastructureLinkSumFields>;
  var_pop?: Maybe<InfrastructureNetworkInfrastructureLinkVarPopFields>;
  var_samp?: Maybe<InfrastructureNetworkInfrastructureLinkVarSampFields>;
  variance?: Maybe<InfrastructureNetworkInfrastructureLinkVarianceFields>;
};

/** aggregate fields of "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregateFieldsCountArgs = {
  columns?: Maybe<Array<InfrastructureNetworkInfrastructureLinkSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregateOrderBy = {
  avg?: Maybe<InfrastructureNetworkInfrastructureLinkAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<InfrastructureNetworkInfrastructureLinkMaxOrderBy>;
  min?: Maybe<InfrastructureNetworkInfrastructureLinkMinOrderBy>;
  stddev?: Maybe<InfrastructureNetworkInfrastructureLinkStddevOrderBy>;
  stddev_pop?: Maybe<InfrastructureNetworkInfrastructureLinkStddevPopOrderBy>;
  stddev_samp?: Maybe<InfrastructureNetworkInfrastructureLinkStddevSampOrderBy>;
  sum?: Maybe<InfrastructureNetworkInfrastructureLinkSumOrderBy>;
  var_pop?: Maybe<InfrastructureNetworkInfrastructureLinkVarPopOrderBy>;
  var_samp?: Maybe<InfrastructureNetworkInfrastructureLinkVarSampOrderBy>;
  variance?: Maybe<InfrastructureNetworkInfrastructureLinkVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkArrRelInsertInput = {
  data: Array<InfrastructureNetworkInfrastructureLinkInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** aggregate avg on columns */
export type InfrastructureNetworkInfrastructureLinkAvgFields = {
  __typename?: 'infrastructure_network_infrastructure_link_avg_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAvgOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.infrastructure_link". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkInfrastructureLinkBoolExp = {
  _and?: Maybe<Array<InfrastructureNetworkInfrastructureLinkBoolExp>>;
  _not?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  _or?: Maybe<Array<InfrastructureNetworkInfrastructureLinkBoolExp>>;
  direction?: Maybe<InfrastructureNetworkDirectionEnumComparisonExp>;
  directionByDirection?: Maybe<InfrastructureNetworkDirectionBoolExp>;
  estimated_length_in_metres?: Maybe<Float8ComparisonExp>;
  external_link_id?: Maybe<StringComparisonExp>;
  external_link_source?: Maybe<InfrastructureNetworkExternalSourceEnumComparisonExp>;
  external_source?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
  infrastructure_link_along_routes?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  infrastructure_link_along_routes_aggregate?: Maybe<RouteInfrastructureLinkAlongRouteAggregateBoolExp>;
  infrastructure_link_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_points_located_on_infrastructure_link?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_located_on_infrastructure_link_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  shape?: Maybe<GeographyComparisonExp>;
  vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_link_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
  vehicle_submode_on_infrastructure_links?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
};

/** unique or primary key constraints on table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkConstraint {
  /** unique or primary key constraint on columns "external_link_source", "external_link_id" */
  InfrastructureLinkExternalLinkIdExternalLinkSourceIdx = 'infrastructure_link_external_link_id_external_link_source_idx',
  /** unique or primary key constraint on columns "infrastructure_link_id" */
  InfrastructureLinkPkey = 'infrastructure_link_pkey',
}

/** input type for incrementing numeric columns in table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkIncInput = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** input type for inserting data into table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkInsertInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  directionByDirection?: Maybe<InfrastructureNetworkDirectionObjRelInsertInput>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<InfrastructureNetworkExternalSourceEnum>;
  external_source?: Maybe<InfrastructureNetworkExternalSourceObjRelInsertInput>;
  infrastructure_link_along_routes?: Maybe<RouteInfrastructureLinkAlongRouteArrRelInsertInput>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_points_located_on_infrastructure_link?: Maybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: Maybe<Scalars['geography']>;
  vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
  vehicle_submode_on_infrastructure_links?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
};

/** aggregate max on columns */
export type InfrastructureNetworkInfrastructureLinkMaxFields = {
  __typename?: 'infrastructure_network_infrastructure_link_max_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkMaxOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
  external_link_id?: Maybe<OrderBy>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type InfrastructureNetworkInfrastructureLinkMinFields = {
  __typename?: 'infrastructure_network_infrastructure_link_min_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkMinOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
  external_link_id?: Maybe<OrderBy>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkMutationResponse = {
  __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<InfrastructureNetworkInfrastructureLink>;
};

/** input type for inserting object relation for remote table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkObjRelInsertInput = {
  data: InfrastructureNetworkInfrastructureLinkInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkOnConflict = {
  constraint: InfrastructureNetworkInfrastructureLinkConstraint;
  update_columns?: Array<InfrastructureNetworkInfrastructureLinkUpdateColumn>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.infrastructure_link". */
export type InfrastructureNetworkInfrastructureLinkOrderBy = {
  direction?: Maybe<OrderBy>;
  directionByDirection?: Maybe<InfrastructureNetworkDirectionOrderBy>;
  estimated_length_in_metres?: Maybe<OrderBy>;
  external_link_id?: Maybe<OrderBy>;
  external_link_source?: Maybe<OrderBy>;
  external_source?: Maybe<InfrastructureNetworkExternalSourceOrderBy>;
  infrastructure_link_along_routes_aggregate?: Maybe<RouteInfrastructureLinkAlongRouteAggregateOrderBy>;
  infrastructure_link_id?: Maybe<OrderBy>;
  scheduled_stop_points_located_on_infrastructure_link_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  shape?: Maybe<OrderBy>;
  vehicle_submode_on_infrastructure_link_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
};

/** primary key columns input for table: infrastructure_network.infrastructure_link */
export type InfrastructureNetworkInfrastructureLinkPkColumnsInput = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
};

/** select columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
  /** column name */
  ExternalLinkId = 'external_link_id',
  /** column name */
  ExternalLinkSource = 'external_link_source',
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  Shape = 'shape',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_avg_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpAvgArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_corr_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_covar_samp_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_max_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMaxArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_min_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMinArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_stddev_samp_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSampArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_sum_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpSumArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** select "infrastructure_network_infrastructure_link_aggregate_bool_exp_var_samp_arguments_columns" columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSampArgumentsColumns {
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
}

/** input type for updating data in table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkSetInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<InfrastructureNetworkExternalSourceEnum>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: Maybe<Scalars['geography']>;
};

/** aggregate stddev on columns */
export type InfrastructureNetworkInfrastructureLinkStddevFields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkStddevOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type InfrastructureNetworkInfrastructureLinkStddevPopFields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_pop_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkStddevPopOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type InfrastructureNetworkInfrastructureLinkStddevSampFields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_samp_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkStddevSampOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** Streaming cursor of the table "infrastructure_network_infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkInfrastructureLinkStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkInfrastructureLinkStreamCursorValueInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<InfrastructureNetworkExternalSourceEnum>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: Maybe<Scalars['geography']>;
};

/** aggregate sum on columns */
export type InfrastructureNetworkInfrastructureLinkSumFields = {
  __typename?: 'infrastructure_network_infrastructure_link_sum_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** order by sum() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkSumOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** update columns of table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkUpdateColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  EstimatedLengthInMetres = 'estimated_length_in_metres',
  /** column name */
  ExternalLinkId = 'external_link_id',
  /** column name */
  ExternalLinkSource = 'external_link_source',
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  Shape = 'shape',
}

export type InfrastructureNetworkInfrastructureLinkUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<InfrastructureNetworkInfrastructureLinkIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<InfrastructureNetworkInfrastructureLinkSetInput>;
  where: InfrastructureNetworkInfrastructureLinkBoolExp;
};

/** aggregate var_pop on columns */
export type InfrastructureNetworkInfrastructureLinkVarPopFields = {
  __typename?: 'infrastructure_network_infrastructure_link_var_pop_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkVarPopOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type InfrastructureNetworkInfrastructureLinkVarSampFields = {
  __typename?: 'infrastructure_network_infrastructure_link_var_samp_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkVarSampOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type InfrastructureNetworkInfrastructureLinkVarianceFields = {
  __typename?: 'infrastructure_network_infrastructure_link_variance_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkVarianceOrderBy = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<OrderBy>;
};

export type InfrastructureNetworkResolvePointToClosestLinkArgs = {
  geog?: Maybe<Scalars['geography']>;
};

/** Which infrastructure links are safely traversed by which vehicle submodes? */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLink = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link';
  /** An object relationship */
  infrastructure_link: InfrastructureNetworkInfrastructureLink;
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id: Scalars['uuid'];
  /** An object relationship */
  vehicleSubmodeByVehicleSubmode: ReusableComponentsVehicleSubmode;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
};

/** aggregated selection of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate';
  aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateFields>;
  nodes: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
};

export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp =
  {
    count?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExpCount>;
  };

export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExpCount =
  {
    arguments?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
    predicate: IntComparisonExp;
  };

/** aggregate fields of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateFields =
  {
    __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate_fields';
    count: Scalars['Int'];
    max?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMaxFields>;
    min?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMinFields>;
  };

/** aggregate fields of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy =
  {
    count?: Maybe<OrderBy>;
    max?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMaxOrderBy>;
    min?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMinOrderBy>;
  };

/** input type for inserting array relation for remote table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput =
  {
    data: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput>;
    /** upsert condition */
    on_conflict?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** Boolean expression to filter rows from the table "infrastructure_network.vehicle_submode_on_infrastructure_link". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp = {
  _and?: Maybe<
    Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>
  >;
  _not?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  _or?: Maybe<
    Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>
  >;
  infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_link_id?: Maybe<UuidComparisonExp>;
  vehicleSubmodeByVehicleSubmode?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
  vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeEnumComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkConstraint {
  /** unique or primary key constraint on columns "infrastructure_link_id", "vehicle_submode" */
  VehicleSubmodeOnInfrastructureLinkPkey = 'vehicle_submode_on_infrastructure_link_pkey',
}

/** input type for inserting data into table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput =
  {
    infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: Maybe<Scalars['uuid']>;
    vehicleSubmodeByVehicleSubmode?: Maybe<ReusableComponentsVehicleSubmodeObjRelInsertInput>;
    /** The vehicle submode that can safely traverse the infrastructure link. */
    vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeEnum>;
  };

/** aggregate max on columns */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMaxFields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_max_fields';
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMaxOrderBy =
  {
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: Maybe<OrderBy>;
  };

/** aggregate min on columns */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMinFields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_min_fields';
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMinOrderBy =
  {
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: Maybe<OrderBy>;
  };

/** response of any mutation on the table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse =
  {
    __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: Scalars['Int'];
    /** data from the rows affected by the mutation */
    returning: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  };

/** on_conflict condition type for table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict =
  {
    constraint: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkConstraint;
    update_columns?: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdateColumn>;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** Ordering options when selecting data from "infrastructure_network.vehicle_submode_on_infrastructure_link". */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy = {
  infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  infrastructure_link_id?: Maybe<OrderBy>;
  vehicleSubmodeByVehicleSubmode?: Maybe<ReusableComponentsVehicleSubmodeOrderBy>;
  vehicle_submode?: Maybe<OrderBy>;
};

/** primary key columns input for table: infrastructure_network.vehicle_submode_on_infrastructure_link */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkPkColumnsInput =
  {
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id: Scalars['uuid'];
    /** The vehicle submode that can safely traverse the infrastructure link. */
    vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
  };

/** select columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

/** input type for updating data in table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeEnum>;
};

/** Streaming cursor of the table "infrastructure_network_vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorValueInput;
    /** cursor ordering */
    ordering?: Maybe<CursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorValueInput =
  {
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: Maybe<Scalars['uuid']>;
    /** The vehicle submode that can safely traverse the infrastructure link. */
    vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeEnum>;
  };

/** update columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdateColumn {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
  where: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp;
};

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type IntervalComparisonExp = {
  _eq?: Maybe<Scalars['interval']>;
  _gt?: Maybe<Scalars['interval']>;
  _gte?: Maybe<Scalars['interval']>;
  _in?: Maybe<Array<Scalars['interval']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['interval']>;
  _lte?: Maybe<Scalars['interval']>;
  _neq?: Maybe<Scalars['interval']>;
  _nin?: Maybe<Array<Scalars['interval']>>;
};

export type JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    new_direction?: Maybe<Scalars['String']>;
    new_label?: Maybe<Scalars['String']>;
    new_located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
    new_measured_location?: Maybe<Scalars['geography']>;
    new_priority?: Maybe<Scalars['Int']>;
    new_validity_end?: Maybe<Scalars['date']>;
    new_validity_start?: Maybe<Scalars['date']>;
    replace_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  };

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPattern = {
  __typename?: 'journey_pattern_journey_pattern';
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  journey_pattern_refs: Array<TimetablesJourneyPatternJourneyPatternRef>;
  journey_pattern_refs_aggregate: TimetablesJourneyPatternJourneyPatternRefAggregate;
  /** An object relationship */
  journey_pattern_route?: Maybe<RouteRoute>;
  /** The ID of the route the journey pattern is on. */
  on_route_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_point_in_journey_patterns: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_patterns_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
};

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternJourneyPatternRefsArgs = {
  distinct_on?: Maybe<
    Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
  where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternJourneyPatternRefsAggregateArgs = {
  distinct_on?: Maybe<
    Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
  where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternScheduledStopPointInJourneyPatternsArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternScheduledStopPointInJourneyPatternsAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** aggregated selection of "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregate = {
  __typename?: 'journey_pattern_journey_pattern_aggregate';
  aggregate?: Maybe<JourneyPatternJourneyPatternAggregateFields>;
  nodes: Array<JourneyPatternJourneyPattern>;
};

export type JourneyPatternJourneyPatternAggregateBoolExp = {
  count?: Maybe<JourneyPatternJourneyPatternAggregateBoolExpCount>;
};

export type JourneyPatternJourneyPatternAggregateBoolExpCount = {
  arguments?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregateFields = {
  __typename?: 'journey_pattern_journey_pattern_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<JourneyPatternJourneyPatternMaxFields>;
  min?: Maybe<JourneyPatternJourneyPatternMinFields>;
};

/** aggregate fields of "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregateFieldsCountArgs = {
  columns?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<JourneyPatternJourneyPatternMaxOrderBy>;
  min?: Maybe<JourneyPatternJourneyPatternMinOrderBy>;
};

/** input type for inserting array relation for remote table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternArrRelInsertInput = {
  data: Array<JourneyPatternJourneyPatternInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<JourneyPatternJourneyPatternOnConflict>;
};

/** Boolean expression to filter rows from the table "journey_pattern.journey_pattern". All fields are combined with a logical 'AND'. */
export type JourneyPatternJourneyPatternBoolExp = {
  _and?: Maybe<Array<JourneyPatternJourneyPatternBoolExp>>;
  _not?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  _or?: Maybe<Array<JourneyPatternJourneyPatternBoolExp>>;
  journey_pattern_id?: Maybe<UuidComparisonExp>;
  journey_pattern_route?: Maybe<RouteRouteBoolExp>;
  on_route_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp>;
};

/** unique or primary key constraints on table "journey_pattern.journey_pattern" */
export enum JourneyPatternJourneyPatternConstraint {
  /** unique or primary key constraint on columns "on_route_id" */
  JourneyPatternOnRouteIdIdx = 'journey_pattern_on_route_id_idx',
  /** unique or primary key constraint on columns "journey_pattern_id" */
  JourneyPatternPkey = 'journey_pattern_pkey',
}

/** input type for inserting data into table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternInsertInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_route?: Maybe<RouteRouteObjRelInsertInput>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput>;
};

/** aggregate max on columns */
export type JourneyPatternJourneyPatternMaxFields = {
  __typename?: 'journey_pattern_journey_pattern_max_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternMaxOrderBy = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<OrderBy>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type JourneyPatternJourneyPatternMinFields = {
  __typename?: 'journey_pattern_journey_pattern_min_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternMinOrderBy = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<OrderBy>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternMutationResponse = {
  __typename?: 'journey_pattern_journey_pattern_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<JourneyPatternJourneyPattern>;
};

/** input type for inserting object relation for remote table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternObjRelInsertInput = {
  data: JourneyPatternJourneyPatternInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<JourneyPatternJourneyPatternOnConflict>;
};

/** on_conflict condition type for table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternOnConflict = {
  constraint: JourneyPatternJourneyPatternConstraint;
  update_columns?: Array<JourneyPatternJourneyPatternUpdateColumn>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.journey_pattern". */
export type JourneyPatternJourneyPatternOrderBy = {
  journey_pattern_id?: Maybe<OrderBy>;
  journey_pattern_route?: Maybe<RouteRouteOrderBy>;
  on_route_id?: Maybe<OrderBy>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy>;
};

/** primary key columns input for table: journey_pattern.journey_pattern */
export type JourneyPatternJourneyPatternPkColumnsInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
};

/** select columns of table "journey_pattern.journey_pattern" */
export enum JourneyPatternJourneyPatternSelectColumn {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  OnRouteId = 'on_route_id',
}

/** input type for updating data in table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternSetInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "journey_pattern_journey_pattern" */
export type JourneyPatternJourneyPatternStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: JourneyPatternJourneyPatternStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type JourneyPatternJourneyPatternStreamCursorValueInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "journey_pattern.journey_pattern" */
export enum JourneyPatternJourneyPatternUpdateColumn {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  OnRouteId = 'on_route_id',
}

export type JourneyPatternJourneyPatternUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<JourneyPatternJourneyPatternSetInput>;
  where: JourneyPatternJourneyPatternBoolExp;
};

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPattern = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
  is_loading_time_allowed: Scalars['Boolean'];
  /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
  is_regulated_timing_point: Scalars['Boolean'];
  /** Is this scheduled stop point used as a timing point in the journey pattern? */
  is_used_as_timing_point: Scalars['Boolean'];
  /** Is this scheduled stop point a via point? */
  is_via_point: Scalars['Boolean'];
  /** An object relationship */
  journey_pattern: JourneyPatternJourneyPattern;
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  scheduled_stop_point_label: Scalars['String'];
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence: Scalars['Int'];
  /** An array relationship */
  scheduled_stop_points: Array<ServicePatternScheduledStopPoint>;
  /** An aggregate relationship */
  scheduled_stop_points_aggregate: ServicePatternScheduledStopPointAggregate;
  via_point_name_i18n?: Maybe<Scalars['localized_string']>;
  via_point_short_name_i18n?: Maybe<Scalars['localized_string']>;
};

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternScheduledStopPointsArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternScheduledStopPointsAggregateArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternViaPointNameI18nArgs =
  {
    path?: Maybe<Scalars['String']>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternViaPointShortNameI18nArgs =
  {
    path?: Maybe<Scalars['String']>;
  };

/** aggregated selection of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregate = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate';
  aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateFields>;
  nodes: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
};

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp = {
  bool_and?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAnd>;
  bool_or?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOr>;
  count?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpCount>;
};

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAnd =
  {
    arguments: JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAndArgumentsColumns;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
    predicate: BooleanComparisonExp;
  };

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOr =
  {
    arguments: JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOrArgumentsColumns;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
    predicate: BooleanComparisonExp;
  };

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpCount =
  {
    arguments?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
    predicate: IntComparisonExp;
  };

/** aggregate fields of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregateFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate_fields';
  avg?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMaxFields>;
  min?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMinFields>;
  stddev?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevFields>;
  stddev_pop?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevPopFields>;
  stddev_samp?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevSampFields>;
  sum?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternSumFields>;
  var_pop?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarPopFields>;
  var_samp?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarSampFields>;
  variance?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarianceFields>;
};

/** aggregate fields of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy = {
  avg?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMaxOrderBy>;
  min?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMinOrderBy>;
  stddev?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevOrderBy>;
  stddev_pop?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevPopOrderBy>;
  stddev_samp?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternStddevSampOrderBy>;
  sum?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternSumOrderBy>;
  var_pop?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarPopOrderBy>;
  var_samp?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarSampOrderBy>;
  variance?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type JourneyPatternScheduledStopPointInJourneyPatternAppendInput = {
  via_point_name_i18n?: Maybe<Scalars['jsonb']>;
  via_point_short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput =
  {
    data: Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>;
    /** upsert condition */
    on_conflict?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
  };

/** aggregate avg on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternAvgFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_avg_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAvgOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "journey_pattern.scheduled_stop_point_in_journey_pattern". All fields are combined with a logical 'AND'. */
export type JourneyPatternScheduledStopPointInJourneyPatternBoolExp = {
  _and?: Maybe<Array<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>>;
  _not?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  _or?: Maybe<Array<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>>;
  is_loading_time_allowed?: Maybe<BooleanComparisonExp>;
  is_regulated_timing_point?: Maybe<BooleanComparisonExp>;
  is_used_as_timing_point?: Maybe<BooleanComparisonExp>;
  is_via_point?: Maybe<BooleanComparisonExp>;
  journey_pattern?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  journey_pattern_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_point_label?: Maybe<StringComparisonExp>;
  scheduled_stop_point_sequence?: Maybe<IntComparisonExp>;
  scheduled_stop_points?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  via_point_name_i18n?: Maybe<JsonbComparisonExp>;
  via_point_short_name_i18n?: Maybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_sequence", "journey_pattern_id" */
  ScheduledStopPointInJourneyPatternPkey = 'scheduled_stop_point_in_journey_pattern_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput =
  {
    via_point_name_i18n?: Maybe<Array<Scalars['String']>>;
    via_point_short_name_i18n?: Maybe<Array<Scalars['String']>>;
  };

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput = {
  via_point_name_i18n?: Maybe<Scalars['Int']>;
  via_point_short_name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput = {
  via_point_name_i18n?: Maybe<Scalars['String']>;
  via_point_short_name_i18n?: Maybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternIncInput = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternInsertInput = {
  /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
  is_loading_time_allowed?: Maybe<Scalars['Boolean']>;
  /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
  is_regulated_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point used as a timing point in the journey pattern? */
  is_used_as_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: Maybe<Scalars['Boolean']>;
  journey_pattern?: Maybe<JourneyPatternJourneyPatternObjRelInsertInput>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_label?: Maybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  scheduled_stop_points?: Maybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  via_point_name_i18n?: Maybe<Scalars['localized_string']>;
  via_point_short_name_i18n?: Maybe<Scalars['localized_string']>;
};

/** aggregate max on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternMaxFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_max_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_label?: Maybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternMaxOrderBy = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<OrderBy>;
  scheduled_stop_point_label?: Maybe<OrderBy>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternMinFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_min_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_label?: Maybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternMinOrderBy = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<OrderBy>;
  scheduled_stop_point_label?: Maybe<OrderBy>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** response of any mutation on the table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternMutationResponse = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
};

/** on_conflict condition type for table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternOnConflict = {
  constraint: JourneyPatternScheduledStopPointInJourneyPatternConstraint;
  update_columns?: Array<JourneyPatternScheduledStopPointInJourneyPatternUpdateColumn>;
  where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.scheduled_stop_point_in_journey_pattern". */
export type JourneyPatternScheduledStopPointInJourneyPatternOrderBy = {
  is_loading_time_allowed?: Maybe<OrderBy>;
  is_regulated_timing_point?: Maybe<OrderBy>;
  is_used_as_timing_point?: Maybe<OrderBy>;
  is_via_point?: Maybe<OrderBy>;
  journey_pattern?: Maybe<JourneyPatternJourneyPatternOrderBy>;
  journey_pattern_id?: Maybe<OrderBy>;
  scheduled_stop_point_label?: Maybe<OrderBy>;
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
  scheduled_stop_points_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  via_point_name_i18n?: Maybe<OrderBy>;
  via_point_short_name_i18n?: Maybe<OrderBy>;
};

/** primary key columns input for table: journey_pattern.scheduled_stop_point_in_journey_pattern */
export type JourneyPatternScheduledStopPointInJourneyPatternPkColumnsInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence: Scalars['Int'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type JourneyPatternScheduledStopPointInJourneyPatternPrependInput = {
  via_point_name_i18n?: Maybe<Scalars['jsonb']>;
  via_point_short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternSelectColumn {
  /** column name */
  IsLoadingTimeAllowed = 'is_loading_time_allowed',
  /** column name */
  IsRegulatedTimingPoint = 'is_regulated_timing_point',
  /** column name */
  IsUsedAsTimingPoint = 'is_used_as_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ScheduledStopPointLabel = 'scheduled_stop_point_label',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence',
  /** column name */
  ViaPointNameI18n = 'via_point_name_i18n',
  /** column name */
  ViaPointShortNameI18n = 'via_point_short_name_i18n',
}

/** select "journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate_bool_exp_bool_and_arguments_columns" columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  IsLoadingTimeAllowed = 'is_loading_time_allowed',
  /** column name */
  IsRegulatedTimingPoint = 'is_regulated_timing_point',
  /** column name */
  IsUsedAsTimingPoint = 'is_used_as_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
}

/** select "journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate_bool_exp_bool_or_arguments_columns" columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  IsLoadingTimeAllowed = 'is_loading_time_allowed',
  /** column name */
  IsRegulatedTimingPoint = 'is_regulated_timing_point',
  /** column name */
  IsUsedAsTimingPoint = 'is_used_as_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
}

/** input type for updating data in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternSetInput = {
  /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
  is_loading_time_allowed?: Maybe<Scalars['Boolean']>;
  /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
  is_regulated_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point used as a timing point in the journey pattern? */
  is_used_as_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: Maybe<Scalars['Boolean']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_label?: Maybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  via_point_name_i18n?: Maybe<Scalars['localized_string']>;
  via_point_short_name_i18n?: Maybe<Scalars['localized_string']>;
};

/** aggregate stddev on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevPopFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_pop_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevPopOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevSampFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_samp_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternStddevSampOrderBy =
  {
    /** The order of the scheduled stop point within the journey pattern. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** Streaming cursor of the table "journey_pattern_scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: JourneyPatternScheduledStopPointInJourneyPatternStreamCursorValueInput;
    /** cursor ordering */
    ordering?: Maybe<CursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type JourneyPatternScheduledStopPointInJourneyPatternStreamCursorValueInput =
  {
    /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
    is_loading_time_allowed?: Maybe<Scalars['Boolean']>;
    /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
    is_regulated_timing_point?: Maybe<Scalars['Boolean']>;
    /** Is this scheduled stop point used as a timing point in the journey pattern? */
    is_used_as_timing_point?: Maybe<Scalars['Boolean']>;
    /** Is this scheduled stop point a via point? */
    is_via_point?: Maybe<Scalars['Boolean']>;
    /** The ID of the journey pattern. */
    journey_pattern_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the scheduled stop point within the journey pattern. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
    via_point_name_i18n?: Maybe<Scalars['jsonb']>;
    via_point_short_name_i18n?: Maybe<Scalars['jsonb']>;
  };

/** aggregate sum on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternSumFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_sum_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternSumOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** update columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternUpdateColumn {
  /** column name */
  IsLoadingTimeAllowed = 'is_loading_time_allowed',
  /** column name */
  IsRegulatedTimingPoint = 'is_regulated_timing_point',
  /** column name */
  IsUsedAsTimingPoint = 'is_used_as_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ScheduledStopPointLabel = 'scheduled_stop_point_label',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence',
  /** column name */
  ViaPointNameI18n = 'via_point_name_i18n',
  /** column name */
  ViaPointShortNameI18n = 'via_point_short_name_i18n',
}

export type JourneyPatternScheduledStopPointInJourneyPatternUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
  where: JourneyPatternScheduledStopPointInJourneyPatternBoolExp;
};

/** aggregate var_pop on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternVarPopFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_var_pop_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternVarPopOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternVarSampFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_var_samp_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternVarSampOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type JourneyPatternScheduledStopPointInJourneyPatternVarianceFields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_variance_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternVarianceOrderBy = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
};

export type JsonbCastExp = {
  String?: Maybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: Maybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>;
  _eq?: Maybe<Scalars['jsonb']>;
  _gt?: Maybe<Scalars['jsonb']>;
  _gte?: Maybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>;
  _in?: Maybe<Array<Scalars['jsonb']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['jsonb']>;
  _lte?: Maybe<Scalars['jsonb']>;
  _neq?: Maybe<Scalars['jsonb']>;
  _nin?: Maybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type MutationRoot = {
  __typename?: 'mutation_root';
  /** delete data from the table: "hsl_route.transport_target" */
  delete_hsl_route_transport_target?: Maybe<HslRouteTransportTargetMutationResponse>;
  /** delete single row from the table: "hsl_route.transport_target" */
  delete_hsl_route_transport_target_by_pk?: Maybe<HslRouteTransportTarget>;
  /** delete data from the table: "infrastructure_network.direction" */
  delete_infrastructure_network_direction?: Maybe<InfrastructureNetworkDirectionMutationResponse>;
  /** delete single row from the table: "infrastructure_network.direction" */
  delete_infrastructure_network_direction_by_pk?: Maybe<InfrastructureNetworkDirection>;
  /** delete data from the table: "infrastructure_network.external_source" */
  delete_infrastructure_network_external_source?: Maybe<InfrastructureNetworkExternalSourceMutationResponse>;
  /** delete single row from the table: "infrastructure_network.external_source" */
  delete_infrastructure_network_external_source_by_pk?: Maybe<InfrastructureNetworkExternalSource>;
  /** delete data from the table: "infrastructure_network.infrastructure_link" */
  delete_infrastructure_network_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkMutationResponse>;
  /** delete single row from the table: "infrastructure_network.infrastructure_link" */
  delete_infrastructure_network_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** delete data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  delete_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse>;
  /** delete single row from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  delete_infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** delete data from the table: "journey_pattern.journey_pattern" */
  delete_journey_pattern_journey_pattern?: Maybe<JourneyPatternJourneyPatternMutationResponse>;
  /** delete single row from the table: "journey_pattern.journey_pattern" */
  delete_journey_pattern_journey_pattern_by_pk?: Maybe<JourneyPatternJourneyPattern>;
  /** delete data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMutationResponse>;
  /** delete single row from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** delete data from the table: "reusable_components.vehicle_mode" */
  delete_reusable_components_vehicle_mode?: Maybe<ReusableComponentsVehicleModeMutationResponse>;
  /** delete single row from the table: "reusable_components.vehicle_mode" */
  delete_reusable_components_vehicle_mode_by_pk?: Maybe<ReusableComponentsVehicleMode>;
  /** delete data from the table: "reusable_components.vehicle_submode" */
  delete_reusable_components_vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeMutationResponse>;
  /** delete single row from the table: "reusable_components.vehicle_submode" */
  delete_reusable_components_vehicle_submode_by_pk?: Maybe<ReusableComponentsVehicleSubmode>;
  /** delete data from the table: "route.direction" */
  delete_route_direction?: Maybe<RouteDirectionMutationResponse>;
  /** delete single row from the table: "route.direction" */
  delete_route_direction_by_pk?: Maybe<RouteDirection>;
  /** delete data from the table: "route.infrastructure_link_along_route" */
  delete_route_infrastructure_link_along_route?: Maybe<RouteInfrastructureLinkAlongRouteMutationResponse>;
  /** delete single row from the table: "route.infrastructure_link_along_route" */
  delete_route_infrastructure_link_along_route_by_pk?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** delete data from the table: "route.line" */
  delete_route_line?: Maybe<RouteLineMutationResponse>;
  /** delete single row from the table: "route.line" */
  delete_route_line_by_pk?: Maybe<RouteLine>;
  /** delete data from the table: "route.route" */
  delete_route_route?: Maybe<RouteRouteMutationResponse>;
  /** delete single row from the table: "route.route" */
  delete_route_route_by_pk?: Maybe<RouteRoute>;
  /** delete data from the table: "route.type_of_line" */
  delete_route_type_of_line?: Maybe<RouteTypeOfLineMutationResponse>;
  /** delete single row from the table: "route.type_of_line" */
  delete_route_type_of_line_by_pk?: Maybe<RouteTypeOfLine>;
  /** delete data from the table: "service_pattern.scheduled_stop_point" */
  delete_service_pattern_scheduled_stop_point?: Maybe<ServicePatternScheduledStopPointMutationResponse>;
  /** delete single row from the table: "service_pattern.scheduled_stop_point" */
  delete_service_pattern_scheduled_stop_point_by_pk?: Maybe<ServicePatternScheduledStopPoint>;
  /** delete data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  delete_service_pattern_vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>;
  /** delete single row from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  delete_service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** delete data from the table: "timing_pattern.timing_place" */
  delete_timing_pattern_timing_place?: Maybe<TimingPatternTimingPlaceMutationResponse>;
  /** delete single row from the table: "timing_pattern.timing_place" */
  delete_timing_pattern_timing_place_by_pk?: Maybe<TimingPatternTimingPlace>;
  /** insert data into the table: "hsl_route.transport_target" */
  insert_hsl_route_transport_target?: Maybe<HslRouteTransportTargetMutationResponse>;
  /** insert a single row into the table: "hsl_route.transport_target" */
  insert_hsl_route_transport_target_one?: Maybe<HslRouteTransportTarget>;
  /** insert data into the table: "infrastructure_network.direction" */
  insert_infrastructure_network_direction?: Maybe<InfrastructureNetworkDirectionMutationResponse>;
  /** insert a single row into the table: "infrastructure_network.direction" */
  insert_infrastructure_network_direction_one?: Maybe<InfrastructureNetworkDirection>;
  /** insert data into the table: "infrastructure_network.external_source" */
  insert_infrastructure_network_external_source?: Maybe<InfrastructureNetworkExternalSourceMutationResponse>;
  /** insert a single row into the table: "infrastructure_network.external_source" */
  insert_infrastructure_network_external_source_one?: Maybe<InfrastructureNetworkExternalSource>;
  /** insert data into the table: "infrastructure_network.infrastructure_link" */
  insert_infrastructure_network_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkMutationResponse>;
  /** insert a single row into the table: "infrastructure_network.infrastructure_link" */
  insert_infrastructure_network_infrastructure_link_one?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** insert data into the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  insert_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse>;
  /** insert a single row into the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  insert_infrastructure_network_vehicle_submode_on_infrastructure_link_one?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** insert data into the table: "journey_pattern.journey_pattern" */
  insert_journey_pattern_journey_pattern?: Maybe<JourneyPatternJourneyPatternMutationResponse>;
  /** insert a single row into the table: "journey_pattern.journey_pattern" */
  insert_journey_pattern_journey_pattern_one?: Maybe<JourneyPatternJourneyPattern>;
  /** insert data into the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMutationResponse>;
  /** insert a single row into the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern_one?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** insert data into the table: "reusable_components.vehicle_mode" */
  insert_reusable_components_vehicle_mode?: Maybe<ReusableComponentsVehicleModeMutationResponse>;
  /** insert a single row into the table: "reusable_components.vehicle_mode" */
  insert_reusable_components_vehicle_mode_one?: Maybe<ReusableComponentsVehicleMode>;
  /** insert data into the table: "reusable_components.vehicle_submode" */
  insert_reusable_components_vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeMutationResponse>;
  /** insert a single row into the table: "reusable_components.vehicle_submode" */
  insert_reusable_components_vehicle_submode_one?: Maybe<ReusableComponentsVehicleSubmode>;
  /** insert data into the table: "route.direction" */
  insert_route_direction?: Maybe<RouteDirectionMutationResponse>;
  /** insert a single row into the table: "route.direction" */
  insert_route_direction_one?: Maybe<RouteDirection>;
  /** insert data into the table: "route.infrastructure_link_along_route" */
  insert_route_infrastructure_link_along_route?: Maybe<RouteInfrastructureLinkAlongRouteMutationResponse>;
  /** insert a single row into the table: "route.infrastructure_link_along_route" */
  insert_route_infrastructure_link_along_route_one?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** insert data into the table: "route.line" */
  insert_route_line?: Maybe<RouteLineMutationResponse>;
  /** insert a single row into the table: "route.line" */
  insert_route_line_one?: Maybe<RouteLine>;
  /** insert data into the table: "route.route" */
  insert_route_route?: Maybe<RouteRouteMutationResponse>;
  /** insert a single row into the table: "route.route" */
  insert_route_route_one?: Maybe<RouteRoute>;
  /** insert data into the table: "route.type_of_line" */
  insert_route_type_of_line?: Maybe<RouteTypeOfLineMutationResponse>;
  /** insert a single row into the table: "route.type_of_line" */
  insert_route_type_of_line_one?: Maybe<RouteTypeOfLine>;
  /** insert data into the table: "service_pattern.scheduled_stop_point" */
  insert_service_pattern_scheduled_stop_point?: Maybe<ServicePatternScheduledStopPointMutationResponse>;
  /** insert a single row into the table: "service_pattern.scheduled_stop_point" */
  insert_service_pattern_scheduled_stop_point_one?: Maybe<ServicePatternScheduledStopPoint>;
  /** insert data into the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  insert_service_pattern_vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>;
  /** insert a single row into the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  insert_service_pattern_vehicle_mode_on_scheduled_stop_point_one?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** insert data into the table: "timing_pattern.timing_place" */
  insert_timing_pattern_timing_place?: Maybe<TimingPatternTimingPlaceMutationResponse>;
  /** insert a single row into the table: "timing_pattern.timing_place" */
  insert_timing_pattern_timing_place_one?: Maybe<TimingPatternTimingPlace>;
  timetables?: Maybe<TimetablesTimetablesMutationFrontend>;
  /** update data of the table: "hsl_route.transport_target" */
  update_hsl_route_transport_target?: Maybe<HslRouteTransportTargetMutationResponse>;
  /** update single row of the table: "hsl_route.transport_target" */
  update_hsl_route_transport_target_by_pk?: Maybe<HslRouteTransportTarget>;
  /** update multiples rows of table: "hsl_route.transport_target" */
  update_hsl_route_transport_target_many?: Maybe<
    Array<Maybe<HslRouteTransportTargetMutationResponse>>
  >;
  /** update data of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction?: Maybe<InfrastructureNetworkDirectionMutationResponse>;
  /** update single row of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction_by_pk?: Maybe<InfrastructureNetworkDirection>;
  /** update multiples rows of table: "infrastructure_network.direction" */
  update_infrastructure_network_direction_many?: Maybe<
    Array<Maybe<InfrastructureNetworkDirectionMutationResponse>>
  >;
  /** update data of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source?: Maybe<InfrastructureNetworkExternalSourceMutationResponse>;
  /** update single row of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source_by_pk?: Maybe<InfrastructureNetworkExternalSource>;
  /** update multiples rows of table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source_many?: Maybe<
    Array<Maybe<InfrastructureNetworkExternalSourceMutationResponse>>
  >;
  /** update data of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkMutationResponse>;
  /** update single row of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** update multiples rows of table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link_many?: Maybe<
    Array<Maybe<InfrastructureNetworkInfrastructureLinkMutationResponse>>
  >;
  /** update data of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse>;
  /** update single row of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** update multiples rows of table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link_many?: Maybe<
    Array<
      Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse>
    >
  >;
  /** update data of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern?: Maybe<JourneyPatternJourneyPatternMutationResponse>;
  /** update single row of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern_by_pk?: Maybe<JourneyPatternJourneyPattern>;
  /** update multiples rows of table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern_many?: Maybe<
    Array<Maybe<JourneyPatternJourneyPatternMutationResponse>>
  >;
  /** update data of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMutationResponse>;
  /** update single row of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** update multiples rows of table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern_many?: Maybe<
    Array<
      Maybe<JourneyPatternScheduledStopPointInJourneyPatternMutationResponse>
    >
  >;
  /** update data of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode?: Maybe<ReusableComponentsVehicleModeMutationResponse>;
  /** update single row of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode_by_pk?: Maybe<ReusableComponentsVehicleMode>;
  /** update multiples rows of table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode_many?: Maybe<
    Array<Maybe<ReusableComponentsVehicleModeMutationResponse>>
  >;
  /** update data of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeMutationResponse>;
  /** update single row of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode_by_pk?: Maybe<ReusableComponentsVehicleSubmode>;
  /** update multiples rows of table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode_many?: Maybe<
    Array<Maybe<ReusableComponentsVehicleSubmodeMutationResponse>>
  >;
  /** update data of the table: "route.direction" */
  update_route_direction?: Maybe<RouteDirectionMutationResponse>;
  /** update single row of the table: "route.direction" */
  update_route_direction_by_pk?: Maybe<RouteDirection>;
  /** update multiples rows of table: "route.direction" */
  update_route_direction_many?: Maybe<
    Array<Maybe<RouteDirectionMutationResponse>>
  >;
  /** update data of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route?: Maybe<RouteInfrastructureLinkAlongRouteMutationResponse>;
  /** update single row of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route_by_pk?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** update multiples rows of table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route_many?: Maybe<
    Array<Maybe<RouteInfrastructureLinkAlongRouteMutationResponse>>
  >;
  /** update data of the table: "route.line" */
  update_route_line?: Maybe<RouteLineMutationResponse>;
  /** update single row of the table: "route.line" */
  update_route_line_by_pk?: Maybe<RouteLine>;
  /** update multiples rows of table: "route.line" */
  update_route_line_many?: Maybe<Array<Maybe<RouteLineMutationResponse>>>;
  /** update data of the table: "route.route" */
  update_route_route?: Maybe<RouteRouteMutationResponse>;
  /** update single row of the table: "route.route" */
  update_route_route_by_pk?: Maybe<RouteRoute>;
  /** update multiples rows of table: "route.route" */
  update_route_route_many?: Maybe<Array<Maybe<RouteRouteMutationResponse>>>;
  /** update data of the table: "route.type_of_line" */
  update_route_type_of_line?: Maybe<RouteTypeOfLineMutationResponse>;
  /** update single row of the table: "route.type_of_line" */
  update_route_type_of_line_by_pk?: Maybe<RouteTypeOfLine>;
  /** update multiples rows of table: "route.type_of_line" */
  update_route_type_of_line_many?: Maybe<
    Array<Maybe<RouteTypeOfLineMutationResponse>>
  >;
  /** update data of the table: "service_pattern.scheduled_stop_point" */
  update_service_pattern_scheduled_stop_point?: Maybe<ServicePatternScheduledStopPointMutationResponse>;
  /** update single row of the table: "service_pattern.scheduled_stop_point" */
  update_service_pattern_scheduled_stop_point_by_pk?: Maybe<ServicePatternScheduledStopPoint>;
  /** update multiples rows of table: "service_pattern.scheduled_stop_point" */
  update_service_pattern_scheduled_stop_point_many?: Maybe<
    Array<Maybe<ServicePatternScheduledStopPointMutationResponse>>
  >;
  /** update data of the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  update_service_pattern_vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>;
  /** update single row of the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  update_service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** update multiples rows of table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  update_service_pattern_vehicle_mode_on_scheduled_stop_point_many?: Maybe<
    Array<Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>>
  >;
  /** update data of the table: "timing_pattern.timing_place" */
  update_timing_pattern_timing_place?: Maybe<TimingPatternTimingPlaceMutationResponse>;
  /** update single row of the table: "timing_pattern.timing_place" */
  update_timing_pattern_timing_place_by_pk?: Maybe<TimingPatternTimingPlace>;
  /** update multiples rows of table: "timing_pattern.timing_place" */
  update_timing_pattern_timing_place_many?: Maybe<
    Array<Maybe<TimingPatternTimingPlaceMutationResponse>>
  >;
};

/** mutation root */
export type MutationRootDeleteHslRouteTransportTargetArgs = {
  where: HslRouteTransportTargetBoolExp;
};

/** mutation root */
export type MutationRootDeleteHslRouteTransportTargetByPkArgs = {
  transport_target: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkDirectionArgs = {
  where: InfrastructureNetworkDirectionBoolExp;
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkDirectionByPkArgs = {
  value: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkExternalSourceArgs = {
  where: InfrastructureNetworkExternalSourceBoolExp;
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkExternalSourceByPkArgs = {
  value: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkInfrastructureLinkArgs = {
  where: InfrastructureNetworkInfrastructureLinkBoolExp;
};

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkInfrastructureLinkByPkArgs =
  {
    infrastructure_link_id: Scalars['uuid'];
  };

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    where: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp;
  };

/** mutation root */
export type MutationRootDeleteInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    infrastructure_link_id: Scalars['uuid'];
    vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
  };

/** mutation root */
export type MutationRootDeleteJourneyPatternJourneyPatternArgs = {
  where: JourneyPatternJourneyPatternBoolExp;
};

/** mutation root */
export type MutationRootDeleteJourneyPatternJourneyPatternByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    where: JourneyPatternScheduledStopPointInJourneyPatternBoolExp;
  };

/** mutation root */
export type MutationRootDeleteJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    scheduled_stop_point_sequence: Scalars['Int'];
  };

/** mutation root */
export type MutationRootDeleteReusableComponentsVehicleModeArgs = {
  where: ReusableComponentsVehicleModeBoolExp;
};

/** mutation root */
export type MutationRootDeleteReusableComponentsVehicleModeByPkArgs = {
  vehicle_mode: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteReusableComponentsVehicleSubmodeArgs = {
  where: ReusableComponentsVehicleSubmodeBoolExp;
};

/** mutation root */
export type MutationRootDeleteReusableComponentsVehicleSubmodeByPkArgs = {
  vehicle_submode: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteRouteDirectionArgs = {
  where: RouteDirectionBoolExp;
};

/** mutation root */
export type MutationRootDeleteRouteDirectionByPkArgs = {
  direction: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteRouteInfrastructureLinkAlongRouteArgs = {
  where: RouteInfrastructureLinkAlongRouteBoolExp;
};

/** mutation root */
export type MutationRootDeleteRouteInfrastructureLinkAlongRouteByPkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRouteLineArgs = {
  where: RouteLineBoolExp;
};

/** mutation root */
export type MutationRootDeleteRouteLineByPkArgs = {
  line_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRouteRouteArgs = {
  where: RouteRouteBoolExp;
};

/** mutation root */
export type MutationRootDeleteRouteRouteByPkArgs = {
  route_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteRouteTypeOfLineArgs = {
  where: RouteTypeOfLineBoolExp;
};

/** mutation root */
export type MutationRootDeleteRouteTypeOfLineByPkArgs = {
  type_of_line: Scalars['String'];
};

/** mutation root */
export type MutationRootDeleteServicePatternScheduledStopPointArgs = {
  where: ServicePatternScheduledStopPointBoolExp;
};

/** mutation root */
export type MutationRootDeleteServicePatternScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootDeleteServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    where: ServicePatternVehicleModeOnScheduledStopPointBoolExp;
  };

/** mutation root */
export type MutationRootDeleteServicePatternVehicleModeOnScheduledStopPointByPkArgs =
  {
    scheduled_stop_point_id: Scalars['uuid'];
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  };

/** mutation root */
export type MutationRootDeleteTimingPatternTimingPlaceArgs = {
  where: TimingPatternTimingPlaceBoolExp;
};

/** mutation root */
export type MutationRootDeleteTimingPatternTimingPlaceByPkArgs = {
  timing_place_id: Scalars['uuid'];
};

/** mutation root */
export type MutationRootInsertHslRouteTransportTargetArgs = {
  objects: Array<HslRouteTransportTargetInsertInput>;
  on_conflict?: Maybe<HslRouteTransportTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertHslRouteTransportTargetOneArgs = {
  object: HslRouteTransportTargetInsertInput;
  on_conflict?: Maybe<HslRouteTransportTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkDirectionArgs = {
  objects: Array<InfrastructureNetworkDirectionInsertInput>;
  on_conflict?: Maybe<InfrastructureNetworkDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkDirectionOneArgs = {
  object: InfrastructureNetworkDirectionInsertInput;
  on_conflict?: Maybe<InfrastructureNetworkDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkExternalSourceArgs = {
  objects: Array<InfrastructureNetworkExternalSourceInsertInput>;
  on_conflict?: Maybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkExternalSourceOneArgs = {
  object: InfrastructureNetworkExternalSourceInsertInput;
  on_conflict?: Maybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkInfrastructureLinkArgs = {
  objects: Array<InfrastructureNetworkInfrastructureLinkInsertInput>;
  on_conflict?: Maybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkInfrastructureLinkOneArgs = {
  object: InfrastructureNetworkInfrastructureLinkInsertInput;
  on_conflict?: Maybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    objects: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput>;
    on_conflict?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** mutation root */
export type MutationRootInsertInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOneArgs =
  {
    object: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput;
    on_conflict?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** mutation root */
export type MutationRootInsertJourneyPatternJourneyPatternArgs = {
  objects: Array<JourneyPatternJourneyPatternInsertInput>;
  on_conflict?: Maybe<JourneyPatternJourneyPatternOnConflict>;
};

/** mutation root */
export type MutationRootInsertJourneyPatternJourneyPatternOneArgs = {
  object: JourneyPatternJourneyPatternInsertInput;
  on_conflict?: Maybe<JourneyPatternJourneyPatternOnConflict>;
};

/** mutation root */
export type MutationRootInsertJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    objects: Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>;
    on_conflict?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
  };

/** mutation root */
export type MutationRootInsertJourneyPatternScheduledStopPointInJourneyPatternOneArgs =
  {
    object: JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
    on_conflict?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
  };

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleModeArgs = {
  objects: Array<ReusableComponentsVehicleModeInsertInput>;
  on_conflict?: Maybe<ReusableComponentsVehicleModeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleModeOneArgs = {
  object: ReusableComponentsVehicleModeInsertInput;
  on_conflict?: Maybe<ReusableComponentsVehicleModeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleSubmodeArgs = {
  objects: Array<ReusableComponentsVehicleSubmodeInsertInput>;
  on_conflict?: Maybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleSubmodeOneArgs = {
  object: ReusableComponentsVehicleSubmodeInsertInput;
  on_conflict?: Maybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteDirectionArgs = {
  objects: Array<RouteDirectionInsertInput>;
  on_conflict?: Maybe<RouteDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteDirectionOneArgs = {
  object: RouteDirectionInsertInput;
  on_conflict?: Maybe<RouteDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteInfrastructureLinkAlongRouteArgs = {
  objects: Array<RouteInfrastructureLinkAlongRouteInsertInput>;
  on_conflict?: Maybe<RouteInfrastructureLinkAlongRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteInfrastructureLinkAlongRouteOneArgs = {
  object: RouteInfrastructureLinkAlongRouteInsertInput;
  on_conflict?: Maybe<RouteInfrastructureLinkAlongRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteLineArgs = {
  objects: Array<RouteLineInsertInput>;
  on_conflict?: Maybe<RouteLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteLineOneArgs = {
  object: RouteLineInsertInput;
  on_conflict?: Maybe<RouteLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteRouteArgs = {
  objects: Array<RouteRouteInsertInput>;
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteRouteOneArgs = {
  object: RouteRouteInsertInput;
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteTypeOfLineArgs = {
  objects: Array<RouteTypeOfLineInsertInput>;
  on_conflict?: Maybe<RouteTypeOfLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteTypeOfLineOneArgs = {
  object: RouteTypeOfLineInsertInput;
  on_conflict?: Maybe<RouteTypeOfLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternScheduledStopPointArgs = {
  objects: Array<ServicePatternScheduledStopPointInsertInput>;
  on_conflict?: Maybe<ServicePatternScheduledStopPointOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternScheduledStopPointOneArgs = {
  object: ServicePatternScheduledStopPointInsertInput;
  on_conflict?: Maybe<ServicePatternScheduledStopPointOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    objects: Array<ServicePatternVehicleModeOnScheduledStopPointInsertInput>;
    on_conflict?: Maybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
  };

/** mutation root */
export type MutationRootInsertServicePatternVehicleModeOnScheduledStopPointOneArgs =
  {
    object: ServicePatternVehicleModeOnScheduledStopPointInsertInput;
    on_conflict?: Maybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
  };

/** mutation root */
export type MutationRootInsertTimingPatternTimingPlaceArgs = {
  objects: Array<TimingPatternTimingPlaceInsertInput>;
  on_conflict?: Maybe<TimingPatternTimingPlaceOnConflict>;
};

/** mutation root */
export type MutationRootInsertTimingPatternTimingPlaceOneArgs = {
  object: TimingPatternTimingPlaceInsertInput;
  on_conflict?: Maybe<TimingPatternTimingPlaceOnConflict>;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetArgs = {
  _set?: Maybe<HslRouteTransportTargetSetInput>;
  where: HslRouteTransportTargetBoolExp;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetByPkArgs = {
  _set?: Maybe<HslRouteTransportTargetSetInput>;
  pk_columns: HslRouteTransportTargetPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetManyArgs = {
  updates: Array<HslRouteTransportTargetUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionArgs = {
  _set?: Maybe<InfrastructureNetworkDirectionSetInput>;
  where: InfrastructureNetworkDirectionBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionByPkArgs = {
  _set?: Maybe<InfrastructureNetworkDirectionSetInput>;
  pk_columns: InfrastructureNetworkDirectionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionManyArgs = {
  updates: Array<InfrastructureNetworkDirectionUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceArgs = {
  _set?: Maybe<InfrastructureNetworkExternalSourceSetInput>;
  where: InfrastructureNetworkExternalSourceBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceByPkArgs = {
  _set?: Maybe<InfrastructureNetworkExternalSourceSetInput>;
  pk_columns: InfrastructureNetworkExternalSourcePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceManyArgs = {
  updates: Array<InfrastructureNetworkExternalSourceUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkInfrastructureLinkArgs = {
  _inc?: Maybe<InfrastructureNetworkInfrastructureLinkIncInput>;
  _set?: Maybe<InfrastructureNetworkInfrastructureLinkSetInput>;
  where: InfrastructureNetworkInfrastructureLinkBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkInfrastructureLinkByPkArgs =
  {
    _inc?: Maybe<InfrastructureNetworkInfrastructureLinkIncInput>;
    _set?: Maybe<InfrastructureNetworkInfrastructureLinkSetInput>;
    pk_columns: InfrastructureNetworkInfrastructureLinkPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkInfrastructureLinkManyArgs =
  {
    updates: Array<InfrastructureNetworkInfrastructureLinkUpdates>;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    _set?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
    where: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    _set?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
    pk_columns: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkManyArgs =
  {
    updates: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdates>;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternArgs = {
  _set?: Maybe<JourneyPatternJourneyPatternSetInput>;
  where: JourneyPatternJourneyPatternBoolExp;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternByPkArgs = {
  _set?: Maybe<JourneyPatternJourneyPatternSetInput>;
  pk_columns: JourneyPatternJourneyPatternPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternManyArgs = {
  updates: Array<JourneyPatternJourneyPatternUpdates>;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    _append?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
    _delete_at_path?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
    _delete_elem?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
    _delete_key?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
    _inc?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
    _prepend?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
    _set?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
    where: JourneyPatternScheduledStopPointInJourneyPatternBoolExp;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    _append?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
    _delete_at_path?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
    _delete_elem?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
    _delete_key?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
    _inc?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
    _prepend?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
    _set?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
    pk_columns: JourneyPatternScheduledStopPointInJourneyPatternPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternManyArgs =
  {
    updates: Array<JourneyPatternScheduledStopPointInJourneyPatternUpdates>;
  };

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeArgs = {
  _set?: Maybe<ReusableComponentsVehicleModeSetInput>;
  where: ReusableComponentsVehicleModeBoolExp;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeByPkArgs = {
  _set?: Maybe<ReusableComponentsVehicleModeSetInput>;
  pk_columns: ReusableComponentsVehicleModePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeManyArgs = {
  updates: Array<ReusableComponentsVehicleModeUpdates>;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeArgs = {
  _set?: Maybe<ReusableComponentsVehicleSubmodeSetInput>;
  where: ReusableComponentsVehicleSubmodeBoolExp;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeByPkArgs = {
  _set?: Maybe<ReusableComponentsVehicleSubmodeSetInput>;
  pk_columns: ReusableComponentsVehicleSubmodePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeManyArgs = {
  updates: Array<ReusableComponentsVehicleSubmodeUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionArgs = {
  _set?: Maybe<RouteDirectionSetInput>;
  where: RouteDirectionBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionByPkArgs = {
  _set?: Maybe<RouteDirectionSetInput>;
  pk_columns: RouteDirectionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionManyArgs = {
  updates: Array<RouteDirectionUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteArgs = {
  _inc?: Maybe<RouteInfrastructureLinkAlongRouteIncInput>;
  _set?: Maybe<RouteInfrastructureLinkAlongRouteSetInput>;
  where: RouteInfrastructureLinkAlongRouteBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteByPkArgs = {
  _inc?: Maybe<RouteInfrastructureLinkAlongRouteIncInput>;
  _set?: Maybe<RouteInfrastructureLinkAlongRouteSetInput>;
  pk_columns: RouteInfrastructureLinkAlongRoutePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteManyArgs = {
  updates: Array<RouteInfrastructureLinkAlongRouteUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteLineArgs = {
  _append?: Maybe<RouteLineAppendInput>;
  _delete_at_path?: Maybe<RouteLineDeleteAtPathInput>;
  _delete_elem?: Maybe<RouteLineDeleteElemInput>;
  _delete_key?: Maybe<RouteLineDeleteKeyInput>;
  _inc?: Maybe<RouteLineIncInput>;
  _prepend?: Maybe<RouteLinePrependInput>;
  _set?: Maybe<RouteLineSetInput>;
  where: RouteLineBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteLineByPkArgs = {
  _append?: Maybe<RouteLineAppendInput>;
  _delete_at_path?: Maybe<RouteLineDeleteAtPathInput>;
  _delete_elem?: Maybe<RouteLineDeleteElemInput>;
  _delete_key?: Maybe<RouteLineDeleteKeyInput>;
  _inc?: Maybe<RouteLineIncInput>;
  _prepend?: Maybe<RouteLinePrependInput>;
  _set?: Maybe<RouteLineSetInput>;
  pk_columns: RouteLinePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteLineManyArgs = {
  updates: Array<RouteLineUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteRouteArgs = {
  _append?: Maybe<RouteRouteAppendInput>;
  _delete_at_path?: Maybe<RouteRouteDeleteAtPathInput>;
  _delete_elem?: Maybe<RouteRouteDeleteElemInput>;
  _delete_key?: Maybe<RouteRouteDeleteKeyInput>;
  _inc?: Maybe<RouteRouteIncInput>;
  _prepend?: Maybe<RouteRoutePrependInput>;
  _set?: Maybe<RouteRouteSetInput>;
  where: RouteRouteBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteRouteByPkArgs = {
  _append?: Maybe<RouteRouteAppendInput>;
  _delete_at_path?: Maybe<RouteRouteDeleteAtPathInput>;
  _delete_elem?: Maybe<RouteRouteDeleteElemInput>;
  _delete_key?: Maybe<RouteRouteDeleteKeyInput>;
  _inc?: Maybe<RouteRouteIncInput>;
  _prepend?: Maybe<RouteRoutePrependInput>;
  _set?: Maybe<RouteRouteSetInput>;
  pk_columns: RouteRoutePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteRouteManyArgs = {
  updates: Array<RouteRouteUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineArgs = {
  _set?: Maybe<RouteTypeOfLineSetInput>;
  where: RouteTypeOfLineBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineByPkArgs = {
  _set?: Maybe<RouteTypeOfLineSetInput>;
  pk_columns: RouteTypeOfLinePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineManyArgs = {
  updates: Array<RouteTypeOfLineUpdates>;
};

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointArgs = {
  _inc?: Maybe<ServicePatternScheduledStopPointIncInput>;
  _set?: Maybe<ServicePatternScheduledStopPointSetInput>;
  where: ServicePatternScheduledStopPointBoolExp;
};

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointByPkArgs = {
  _inc?: Maybe<ServicePatternScheduledStopPointIncInput>;
  _set?: Maybe<ServicePatternScheduledStopPointSetInput>;
  pk_columns: ServicePatternScheduledStopPointPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointManyArgs = {
  updates: Array<ServicePatternScheduledStopPointUpdates>;
};

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    _set?: Maybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
    where: ServicePatternVehicleModeOnScheduledStopPointBoolExp;
  };

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointByPkArgs =
  {
    _set?: Maybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
    pk_columns: ServicePatternVehicleModeOnScheduledStopPointPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointManyArgs =
  {
    updates: Array<ServicePatternVehicleModeOnScheduledStopPointUpdates>;
  };

/** mutation root */
export type MutationRootUpdateTimingPatternTimingPlaceArgs = {
  _append?: Maybe<TimingPatternTimingPlaceAppendInput>;
  _delete_at_path?: Maybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  _delete_elem?: Maybe<TimingPatternTimingPlaceDeleteElemInput>;
  _delete_key?: Maybe<TimingPatternTimingPlaceDeleteKeyInput>;
  _prepend?: Maybe<TimingPatternTimingPlacePrependInput>;
  _set?: Maybe<TimingPatternTimingPlaceSetInput>;
  where: TimingPatternTimingPlaceBoolExp;
};

/** mutation root */
export type MutationRootUpdateTimingPatternTimingPlaceByPkArgs = {
  _append?: Maybe<TimingPatternTimingPlaceAppendInput>;
  _delete_at_path?: Maybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  _delete_elem?: Maybe<TimingPatternTimingPlaceDeleteElemInput>;
  _delete_key?: Maybe<TimingPatternTimingPlaceDeleteKeyInput>;
  _prepend?: Maybe<TimingPatternTimingPlacePrependInput>;
  _set?: Maybe<TimingPatternTimingPlaceSetInput>;
  pk_columns: TimingPatternTimingPlacePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateTimingPatternTimingPlaceManyArgs = {
  updates: Array<TimingPatternTimingPlaceUpdates>;
};

/** column ordering options */
export enum OrderBy {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

export type PassingTimesTimetabledPassingTimeAggregateBoolExp = {
  count?: Maybe<PassingTimesTimetabledPassingTimeAggregateBoolExpCount>;
};

export type PassingTimesTimetabledPassingTimeAggregateBoolExpCount = {
  arguments?: Maybe<
    Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
  >;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  predicate: IntComparisonExp;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** fetch data from the table: "hsl_route.transport_target" */
  hsl_route_transport_target: Array<HslRouteTransportTarget>;
  /** fetch aggregated fields from the table: "hsl_route.transport_target" */
  hsl_route_transport_target_aggregate: HslRouteTransportTargetAggregate;
  /** fetch data from the table: "hsl_route.transport_target" using primary key columns */
  hsl_route_transport_target_by_pk?: Maybe<HslRouteTransportTarget>;
  /** fetch data from the table: "infrastructure_network.direction" */
  infrastructure_network_direction: Array<InfrastructureNetworkDirection>;
  /** fetch aggregated fields from the table: "infrastructure_network.direction" */
  infrastructure_network_direction_aggregate: InfrastructureNetworkDirectionAggregate;
  /** fetch data from the table: "infrastructure_network.direction" using primary key columns */
  infrastructure_network_direction_by_pk?: Maybe<InfrastructureNetworkDirection>;
  /** fetch data from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source: Array<InfrastructureNetworkExternalSource>;
  /** fetch aggregated fields from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source_aggregate: InfrastructureNetworkExternalSourceAggregate;
  /** fetch data from the table: "infrastructure_network.external_source" using primary key columns */
  infrastructure_network_external_source_by_pk?: Maybe<InfrastructureNetworkExternalSource>;
  /** execute function "infrastructure_network.find_point_direction_on_link" which returns "infrastructure_network.direction" */
  infrastructure_network_find_point_direction_on_link: Array<InfrastructureNetworkDirection>;
  /** execute function "infrastructure_network.find_point_direction_on_link" and query aggregates on result of table type "infrastructure_network.direction" */
  infrastructure_network_find_point_direction_on_link_aggregate: InfrastructureNetworkDirectionAggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link: Array<InfrastructureNetworkInfrastructureLink>;
  /** fetch aggregated fields from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" using primary key columns */
  infrastructure_network_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** execute function "infrastructure_network.resolve_point_to_closest_link" which returns "infrastructure_network.infrastructure_link" */
  infrastructure_network_resolve_point_to_closest_link: Array<InfrastructureNetworkInfrastructureLink>;
  /** execute function "infrastructure_network.resolve_point_to_closest_link" and query aggregates on result of table type "infrastructure_network.infrastructure_link" */
  infrastructure_network_resolve_point_to_closest_link_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** fetch aggregated fields from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" using primary key columns */
  infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** execute function "journey_pattern.check_infra_link_stop_refs_with_new_scheduled_stop_point" which returns "journey_pattern.journey_pattern" */
  journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point: Array<JourneyPatternJourneyPattern>;
  /** execute function "journey_pattern.check_infra_link_stop_refs_with_new_scheduled_stop_point" and query aggregates on result of table type "journey_pattern.journey_pattern" */
  journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point_aggregate: JourneyPatternJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern: Array<JourneyPatternJourneyPattern>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern_aggregate: JourneyPatternJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" using primary key columns */
  journey_pattern_journey_pattern_by_pk?: Maybe<JourneyPatternJourneyPattern>;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** fetch aggregated fields from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" using primary key columns */
  journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** fetch data from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode: Array<ReusableComponentsVehicleMode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode_aggregate: ReusableComponentsVehicleModeAggregate;
  /** fetch data from the table: "reusable_components.vehicle_mode" using primary key columns */
  reusable_components_vehicle_mode_by_pk?: Maybe<ReusableComponentsVehicleMode>;
  /** fetch data from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode: Array<ReusableComponentsVehicleSubmode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode_aggregate: ReusableComponentsVehicleSubmodeAggregate;
  /** fetch data from the table: "reusable_components.vehicle_submode" using primary key columns */
  reusable_components_vehicle_submode_by_pk?: Maybe<ReusableComponentsVehicleSubmode>;
  /** fetch data from the table: "route.direction" */
  route_direction: Array<RouteDirection>;
  /** fetch aggregated fields from the table: "route.direction" */
  route_direction_aggregate: RouteDirectionAggregate;
  /** fetch data from the table: "route.direction" using primary key columns */
  route_direction_by_pk?: Maybe<RouteDirection>;
  /** fetch data from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route: Array<RouteInfrastructureLinkAlongRoute>;
  /** fetch aggregated fields from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  /** fetch data from the table: "route.infrastructure_link_along_route" using primary key columns */
  route_infrastructure_link_along_route_by_pk?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** fetch data from the table: "route.line" */
  route_line: Array<RouteLine>;
  /** fetch aggregated fields from the table: "route.line" */
  route_line_aggregate: RouteLineAggregate;
  /** fetch data from the table: "route.line" using primary key columns */
  route_line_by_pk?: Maybe<RouteLine>;
  /** fetch data from the table: "route.route" */
  route_route: Array<RouteRoute>;
  /** fetch aggregated fields from the table: "route.route" */
  route_route_aggregate: RouteRouteAggregate;
  /** fetch data from the table: "route.route" using primary key columns */
  route_route_by_pk?: Maybe<RouteRoute>;
  /** fetch data from the table: "route.type_of_line" */
  route_type_of_line: Array<RouteTypeOfLine>;
  /** fetch aggregated fields from the table: "route.type_of_line" */
  route_type_of_line_aggregate: RouteTypeOfLineAggregate;
  /** fetch data from the table: "route.type_of_line" using primary key columns */
  route_type_of_line_by_pk?: Maybe<RouteTypeOfLine>;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point: Array<ServicePatternScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point_aggregate: ServicePatternScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" using primary key columns */
  service_pattern_scheduled_stop_point_by_pk?: Maybe<ServicePatternScheduledStopPoint>;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" using primary key columns */
  service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
  timetables?: Maybe<TimetablesTimetablesQuery>;
  /** fetch data from the table: "timing_pattern.timing_place" */
  timing_pattern_timing_place: Array<TimingPatternTimingPlace>;
  /** fetch aggregated fields from the table: "timing_pattern.timing_place" */
  timing_pattern_timing_place_aggregate: TimingPatternTimingPlaceAggregate;
  /** fetch data from the table: "timing_pattern.timing_place" using primary key columns */
  timing_pattern_timing_place_by_pk?: Maybe<TimingPatternTimingPlace>;
};

export type QueryRootHslRouteTransportTargetArgs = {
  distinct_on?: Maybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

export type QueryRootHslRouteTransportTargetAggregateArgs = {
  distinct_on?: Maybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

export type QueryRootHslRouteTransportTargetByPkArgs = {
  transport_target: Scalars['String'];
};

export type QueryRootInfrastructureNetworkDirectionArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkDirectionAggregateArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkDirectionByPkArgs = {
  value: Scalars['String'];
};

export type QueryRootInfrastructureNetworkExternalSourceArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type QueryRootInfrastructureNetworkExternalSourceAggregateArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type QueryRootInfrastructureNetworkExternalSourceByPkArgs = {
  value: Scalars['String'];
};

export type QueryRootInfrastructureNetworkFindPointDirectionOnLinkArgs = {
  args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
  distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkFindPointDirectionOnLinkAggregateArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type QueryRootInfrastructureNetworkInfrastructureLinkArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkInfrastructureLinkAggregateArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkInfrastructureLinkByPkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};

export type QueryRootInfrastructureNetworkResolvePointToClosestLinkArgs = {
  args: InfrastructureNetworkResolvePointToClosestLinkArgs;
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkResolvePointToClosestLinkAggregateArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: Maybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    infrastructure_link_id: Scalars['uuid'];
    vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
  };

export type QueryRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointAggregateArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternJourneyPatternArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternJourneyPatternAggregateArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternJourneyPatternByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
};

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternArgs = {
  distinct_on?: Maybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
  >;
  where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    scheduled_stop_point_sequence: Scalars['Int'];
  };

export type QueryRootReusableComponentsVehicleModeArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

export type QueryRootReusableComponentsVehicleModeAggregateArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

export type QueryRootReusableComponentsVehicleModeByPkArgs = {
  vehicle_mode: Scalars['String'];
};

export type QueryRootReusableComponentsVehicleSubmodeArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type QueryRootReusableComponentsVehicleSubmodeAggregateArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type QueryRootReusableComponentsVehicleSubmodeByPkArgs = {
  vehicle_submode: Scalars['String'];
};

export type QueryRootRouteDirectionArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

export type QueryRootRouteDirectionAggregateArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

export type QueryRootRouteDirectionByPkArgs = {
  direction: Scalars['String'];
};

export type QueryRootRouteInfrastructureLinkAlongRouteArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type QueryRootRouteInfrastructureLinkAlongRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type QueryRootRouteInfrastructureLinkAlongRouteByPkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};

export type QueryRootRouteLineArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

export type QueryRootRouteLineAggregateArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

export type QueryRootRouteLineByPkArgs = {
  line_id: Scalars['uuid'];
};

export type QueryRootRouteRouteArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

export type QueryRootRouteRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

export type QueryRootRouteRouteByPkArgs = {
  route_id: Scalars['uuid'];
};

export type QueryRootRouteTypeOfLineArgs = {
  distinct_on?: Maybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteTypeOfLineOrderBy>>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

export type QueryRootRouteTypeOfLineAggregateArgs = {
  distinct_on?: Maybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteTypeOfLineOrderBy>>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

export type QueryRootRouteTypeOfLineByPkArgs = {
  type_of_line: Scalars['String'];
};

export type QueryRootServicePatternScheduledStopPointArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternScheduledStopPointAggregateArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
};

export type QueryRootServicePatternVehicleModeOnScheduledStopPointArgs = {
  distinct_on?: Maybe<
    Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type QueryRootServicePatternVehicleModeOnScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
  vehicle_mode: ReusableComponentsVehicleModeEnum;
};

export type QueryRootTimingPatternTimingPlaceArgs = {
  distinct_on?: Maybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

export type QueryRootTimingPatternTimingPlaceAggregateArgs = {
  distinct_on?: Maybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

export type QueryRootTimingPatternTimingPlaceByPkArgs = {
  timing_place_id: Scalars['uuid'];
};

/** The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
export type ReusableComponentsVehicleMode = {
  __typename?: 'reusable_components_vehicle_mode';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode: Scalars['String'];
  /** An array relationship */
  vehicle_submodes: Array<ReusableComponentsVehicleSubmode>;
  /** An aggregate relationship */
  vehicle_submodes_aggregate: ReusableComponentsVehicleSubmodeAggregate;
};

/** The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
export type ReusableComponentsVehicleModeVehicleSubmodesArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/** The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
export type ReusableComponentsVehicleModeVehicleSubmodesAggregateArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/** aggregated selection of "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeAggregate = {
  __typename?: 'reusable_components_vehicle_mode_aggregate';
  aggregate?: Maybe<ReusableComponentsVehicleModeAggregateFields>;
  nodes: Array<ReusableComponentsVehicleMode>;
};

/** aggregate fields of "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeAggregateFields = {
  __typename?: 'reusable_components_vehicle_mode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<ReusableComponentsVehicleModeMaxFields>;
  min?: Maybe<ReusableComponentsVehicleModeMinFields>;
};

/** aggregate fields of "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeAggregateFieldsCountArgs = {
  columns?: Maybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_mode". All fields are combined with a logical 'AND'. */
export type ReusableComponentsVehicleModeBoolExp = {
  _and?: Maybe<Array<ReusableComponentsVehicleModeBoolExp>>;
  _not?: Maybe<ReusableComponentsVehicleModeBoolExp>;
  _or?: Maybe<Array<ReusableComponentsVehicleModeBoolExp>>;
  vehicle_mode?: Maybe<StringComparisonExp>;
  vehicle_submodes?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
  vehicle_submodes_aggregate?: Maybe<ReusableComponentsVehicleSubmodeAggregateBoolExp>;
};

/** unique or primary key constraints on table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeConstraint {
  /** unique or primary key constraint on columns "vehicle_mode" */
  VehicleModePkey = 'vehicle_mode_pkey',
}

export enum ReusableComponentsVehicleModeEnum {
  Bus = 'bus',
  Ferry = 'ferry',
  Metro = 'metro',
  Train = 'train',
  Tram = 'tram',
}

/** Boolean expression to compare columns of type "reusable_components_vehicle_mode_enum". All fields are combined with logical 'AND'. */
export type ReusableComponentsVehicleModeEnumComparisonExp = {
  _eq?: Maybe<ReusableComponentsVehicleModeEnum>;
  _in?: Maybe<Array<ReusableComponentsVehicleModeEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<ReusableComponentsVehicleModeEnum>;
  _nin?: Maybe<Array<ReusableComponentsVehicleModeEnum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeInsertInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
  vehicle_submodes?: Maybe<ReusableComponentsVehicleSubmodeArrRelInsertInput>;
};

/** aggregate max on columns */
export type ReusableComponentsVehicleModeMaxFields = {
  __typename?: 'reusable_components_vehicle_mode_max_fields';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type ReusableComponentsVehicleModeMinFields = {
  __typename?: 'reusable_components_vehicle_mode_min_fields';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeMutationResponse = {
  __typename?: 'reusable_components_vehicle_mode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ReusableComponentsVehicleMode>;
};

/** input type for inserting object relation for remote table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeObjRelInsertInput = {
  data: ReusableComponentsVehicleModeInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<ReusableComponentsVehicleModeOnConflict>;
};

/** on_conflict condition type for table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeOnConflict = {
  constraint: ReusableComponentsVehicleModeConstraint;
  update_columns?: Array<ReusableComponentsVehicleModeUpdateColumn>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_mode". */
export type ReusableComponentsVehicleModeOrderBy = {
  vehicle_mode?: Maybe<OrderBy>;
  vehicle_submodes_aggregate?: Maybe<ReusableComponentsVehicleSubmodeAggregateOrderBy>;
};

/** primary key columns input for table: reusable_components.vehicle_mode */
export type ReusableComponentsVehicleModePkColumnsInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode: Scalars['String'];
};

/** select columns of table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeSelectColumn {
  /** column name */
  VehicleMode = 'vehicle_mode',
}

/** input type for updating data in table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeSetInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "reusable_components_vehicle_mode" */
export type ReusableComponentsVehicleModeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ReusableComponentsVehicleModeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ReusableComponentsVehicleModeStreamCursorValueInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** update columns of table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeUpdateColumn {
  /** column name */
  VehicleMode = 'vehicle_mode',
}

export type ReusableComponentsVehicleModeUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<ReusableComponentsVehicleModeSetInput>;
  where: ReusableComponentsVehicleModeBoolExp;
};

/** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
export type ReusableComponentsVehicleSubmode = {
  __typename?: 'reusable_components_vehicle_submode';
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode: ReusableComponentsVehicleModeEnum;
  /** An object relationship */
  vehicle_mode: ReusableComponentsVehicleMode;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode: Scalars['String'];
  /** An array relationship */
  vehicle_submode_on_infrastructure_links: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** An aggregate relationship */
  vehicle_submode_on_infrastructure_links_aggregate: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate;
};

/** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
export type ReusableComponentsVehicleSubmodeVehicleSubmodeOnInfrastructureLinksArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
export type ReusableComponentsVehicleSubmodeVehicleSubmodeOnInfrastructureLinksAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** aggregated selection of "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregate = {
  __typename?: 'reusable_components_vehicle_submode_aggregate';
  aggregate?: Maybe<ReusableComponentsVehicleSubmodeAggregateFields>;
  nodes: Array<ReusableComponentsVehicleSubmode>;
};

export type ReusableComponentsVehicleSubmodeAggregateBoolExp = {
  count?: Maybe<ReusableComponentsVehicleSubmodeAggregateBoolExpCount>;
};

export type ReusableComponentsVehicleSubmodeAggregateBoolExpCount = {
  arguments?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregateFields = {
  __typename?: 'reusable_components_vehicle_submode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<ReusableComponentsVehicleSubmodeMaxFields>;
  min?: Maybe<ReusableComponentsVehicleSubmodeMinFields>;
};

/** aggregate fields of "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregateFieldsCountArgs = {
  columns?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<ReusableComponentsVehicleSubmodeMaxOrderBy>;
  min?: Maybe<ReusableComponentsVehicleSubmodeMinOrderBy>;
};

/** input type for inserting array relation for remote table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeArrRelInsertInput = {
  data: Array<ReusableComponentsVehicleSubmodeInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_submode". All fields are combined with a logical 'AND'. */
export type ReusableComponentsVehicleSubmodeBoolExp = {
  _and?: Maybe<Array<ReusableComponentsVehicleSubmodeBoolExp>>;
  _not?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
  _or?: Maybe<Array<ReusableComponentsVehicleSubmodeBoolExp>>;
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeBoolExp>;
  vehicle_submode?: Maybe<StringComparisonExp>;
  vehicle_submode_on_infrastructure_links?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
};

/** unique or primary key constraints on table "reusable_components.vehicle_submode" */
export enum ReusableComponentsVehicleSubmodeConstraint {
  /** unique or primary key constraint on columns "vehicle_submode" */
  VehicleSubmodePkey = 'vehicle_submode_pkey',
}

export enum ReusableComponentsVehicleSubmodeEnum {
  /** bus */
  GenericBus = 'generic_bus',
  /** ferry */
  GenericFerry = 'generic_ferry',
  /** metro */
  GenericMetro = 'generic_metro',
  /** train */
  GenericTrain = 'generic_train',
  /** tram */
  GenericTram = 'generic_tram',
  /** bus */
  TallElectricBus = 'tall_electric_bus',
}

/** Boolean expression to compare columns of type "reusable_components_vehicle_submode_enum". All fields are combined with logical 'AND'. */
export type ReusableComponentsVehicleSubmodeEnumComparisonExp = {
  _eq?: Maybe<ReusableComponentsVehicleSubmodeEnum>;
  _in?: Maybe<Array<ReusableComponentsVehicleSubmodeEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<ReusableComponentsVehicleSubmodeEnum>;
  _nin?: Maybe<Array<ReusableComponentsVehicleSubmodeEnum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeInsertInput = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeObjRelInsertInput>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
  vehicle_submode_on_infrastructure_links?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
};

/** aggregate max on columns */
export type ReusableComponentsVehicleSubmodeMaxFields = {
  __typename?: 'reusable_components_vehicle_submode_max_fields';
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeMaxOrderBy = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type ReusableComponentsVehicleSubmodeMinFields = {
  __typename?: 'reusable_components_vehicle_submode_min_fields';
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeMinOrderBy = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<OrderBy>;
};

/** response of any mutation on the table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeMutationResponse = {
  __typename?: 'reusable_components_vehicle_submode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ReusableComponentsVehicleSubmode>;
};

/** input type for inserting object relation for remote table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeObjRelInsertInput = {
  data: ReusableComponentsVehicleSubmodeInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** on_conflict condition type for table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeOnConflict = {
  constraint: ReusableComponentsVehicleSubmodeConstraint;
  update_columns?: Array<ReusableComponentsVehicleSubmodeUpdateColumn>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_submode". */
export type ReusableComponentsVehicleSubmodeOrderBy = {
  belonging_to_vehicle_mode?: Maybe<OrderBy>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeOrderBy>;
  vehicle_submode?: Maybe<OrderBy>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
};

/** primary key columns input for table: reusable_components.vehicle_submode */
export type ReusableComponentsVehicleSubmodePkColumnsInput = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode: Scalars['String'];
};

/** select columns of table "reusable_components.vehicle_submode" */
export enum ReusableComponentsVehicleSubmodeSelectColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

/** input type for updating data in table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeSetInput = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "reusable_components_vehicle_submode" */
export type ReusableComponentsVehicleSubmodeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ReusableComponentsVehicleSubmodeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ReusableComponentsVehicleSubmodeStreamCursorValueInput = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** update columns of table "reusable_components.vehicle_submode" */
export enum ReusableComponentsVehicleSubmodeUpdateColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

export type ReusableComponentsVehicleSubmodeUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<ReusableComponentsVehicleSubmodeSetInput>;
  where: ReusableComponentsVehicleSubmodeBoolExp;
};

/** The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480 */
export type RouteDirection = {
  __typename?: 'route_direction';
  /** The name of the route direction. */
  direction: Scalars['String'];
  /** An object relationship */
  directionByTheOppositeOfDirection?: Maybe<RouteDirection>;
  /** An array relationship */
  directions: Array<RouteDirection>;
  /** An aggregate relationship */
  directions_aggregate: RouteDirectionAggregate;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<RouteDirectionEnum>;
};

/** The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480 */
export type RouteDirectionDirectionsArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

/** The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480 */
export type RouteDirectionDirectionsAggregateArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

/** aggregated selection of "route.direction" */
export type RouteDirectionAggregate = {
  __typename?: 'route_direction_aggregate';
  aggregate?: Maybe<RouteDirectionAggregateFields>;
  nodes: Array<RouteDirection>;
};

export type RouteDirectionAggregateBoolExp = {
  count?: Maybe<RouteDirectionAggregateBoolExpCount>;
};

export type RouteDirectionAggregateBoolExpCount = {
  arguments?: Maybe<Array<RouteDirectionSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteDirectionBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "route.direction" */
export type RouteDirectionAggregateFields = {
  __typename?: 'route_direction_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<RouteDirectionMaxFields>;
  min?: Maybe<RouteDirectionMinFields>;
};

/** aggregate fields of "route.direction" */
export type RouteDirectionAggregateFieldsCountArgs = {
  columns?: Maybe<Array<RouteDirectionSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.direction" */
export type RouteDirectionAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<RouteDirectionMaxOrderBy>;
  min?: Maybe<RouteDirectionMinOrderBy>;
};

/** input type for inserting array relation for remote table "route.direction" */
export type RouteDirectionArrRelInsertInput = {
  data: Array<RouteDirectionInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<RouteDirectionOnConflict>;
};

/** Boolean expression to filter rows from the table "route.direction". All fields are combined with a logical 'AND'. */
export type RouteDirectionBoolExp = {
  _and?: Maybe<Array<RouteDirectionBoolExp>>;
  _not?: Maybe<RouteDirectionBoolExp>;
  _or?: Maybe<Array<RouteDirectionBoolExp>>;
  direction?: Maybe<StringComparisonExp>;
  directionByTheOppositeOfDirection?: Maybe<RouteDirectionBoolExp>;
  directions?: Maybe<RouteDirectionBoolExp>;
  directions_aggregate?: Maybe<RouteDirectionAggregateBoolExp>;
  the_opposite_of_direction?: Maybe<RouteDirectionEnumComparisonExp>;
};

/** unique or primary key constraints on table "route.direction" */
export enum RouteDirectionConstraint {
  /** unique or primary key constraint on columns "direction" */
  DirectionPkey = 'direction_pkey',
}

export enum RouteDirectionEnum {
  /** clockwise */
  Anticlockwise = 'anticlockwise',
  /** anticlockwise */
  Clockwise = 'clockwise',
  /** westbound */
  Eastbound = 'eastbound',
  /** outbound */
  Inbound = 'inbound',
  /** southbound */
  Northbound = 'northbound',
  /** inbound */
  Outbound = 'outbound',
  /** northbound */
  Southbound = 'southbound',
  /** eastbound */
  Westbound = 'westbound',
}

/** Boolean expression to compare columns of type "route_direction_enum". All fields are combined with logical 'AND'. */
export type RouteDirectionEnumComparisonExp = {
  _eq?: Maybe<RouteDirectionEnum>;
  _in?: Maybe<Array<RouteDirectionEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<RouteDirectionEnum>;
  _nin?: Maybe<Array<RouteDirectionEnum>>;
};

/** input type for inserting data into table "route.direction" */
export type RouteDirectionInsertInput = {
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
  directionByTheOppositeOfDirection?: Maybe<RouteDirectionObjRelInsertInput>;
  directions?: Maybe<RouteDirectionArrRelInsertInput>;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<RouteDirectionEnum>;
};

/** aggregate max on columns */
export type RouteDirectionMaxFields = {
  __typename?: 'route_direction_max_fields';
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "route.direction" */
export type RouteDirectionMaxOrderBy = {
  /** The name of the route direction. */
  direction?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteDirectionMinFields = {
  __typename?: 'route_direction_min_fields';
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "route.direction" */
export type RouteDirectionMinOrderBy = {
  /** The name of the route direction. */
  direction?: Maybe<OrderBy>;
};

/** response of any mutation on the table "route.direction" */
export type RouteDirectionMutationResponse = {
  __typename?: 'route_direction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RouteDirection>;
};

/** input type for inserting object relation for remote table "route.direction" */
export type RouteDirectionObjRelInsertInput = {
  data: RouteDirectionInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<RouteDirectionOnConflict>;
};

/** on_conflict condition type for table "route.direction" */
export type RouteDirectionOnConflict = {
  constraint: RouteDirectionConstraint;
  update_columns?: Array<RouteDirectionUpdateColumn>;
  where?: Maybe<RouteDirectionBoolExp>;
};

/** Ordering options when selecting data from "route.direction". */
export type RouteDirectionOrderBy = {
  direction?: Maybe<OrderBy>;
  directionByTheOppositeOfDirection?: Maybe<RouteDirectionOrderBy>;
  directions_aggregate?: Maybe<RouteDirectionAggregateOrderBy>;
  the_opposite_of_direction?: Maybe<OrderBy>;
};

/** primary key columns input for table: route.direction */
export type RouteDirectionPkColumnsInput = {
  /** The name of the route direction. */
  direction: Scalars['String'];
};

/** select columns of table "route.direction" */
export enum RouteDirectionSelectColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  TheOppositeOfDirection = 'the_opposite_of_direction',
}

/** input type for updating data in table "route.direction" */
export type RouteDirectionSetInput = {
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<RouteDirectionEnum>;
};

/** Streaming cursor of the table "route_direction" */
export type RouteDirectionStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteDirectionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteDirectionStreamCursorValueInput = {
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<RouteDirectionEnum>;
};

/** update columns of table "route.direction" */
export enum RouteDirectionUpdateColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  TheOppositeOfDirection = 'the_opposite_of_direction',
}

export type RouteDirectionUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<RouteDirectionSetInput>;
  where: RouteDirectionBoolExp;
};

/** The infrastructure links along which the routes are defined. */
export type RouteInfrastructureLinkAlongRoute = {
  __typename?: 'route_infrastructure_link_along_route';
  /** An object relationship */
  infrastructure_link: InfrastructureNetworkInfrastructureLink;
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence: Scalars['Int'];
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards: Scalars['Boolean'];
  /** The ID of the route. */
  route_id: Scalars['uuid'];
};

/** aggregated selection of "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAggregate = {
  __typename?: 'route_infrastructure_link_along_route_aggregate';
  aggregate?: Maybe<RouteInfrastructureLinkAlongRouteAggregateFields>;
  nodes: Array<RouteInfrastructureLinkAlongRoute>;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExp = {
  bool_and?: Maybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAnd>;
  bool_or?: Maybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOr>;
  count?: Maybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpCount>;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAnd = {
  arguments: RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  predicate: BooleanComparisonExp;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOr = {
  arguments: RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  predicate: BooleanComparisonExp;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpCount = {
  arguments?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAggregateFields = {
  __typename?: 'route_infrastructure_link_along_route_aggregate_fields';
  avg?: Maybe<RouteInfrastructureLinkAlongRouteAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<RouteInfrastructureLinkAlongRouteMaxFields>;
  min?: Maybe<RouteInfrastructureLinkAlongRouteMinFields>;
  stddev?: Maybe<RouteInfrastructureLinkAlongRouteStddevFields>;
  stddev_pop?: Maybe<RouteInfrastructureLinkAlongRouteStddevPopFields>;
  stddev_samp?: Maybe<RouteInfrastructureLinkAlongRouteStddevSampFields>;
  sum?: Maybe<RouteInfrastructureLinkAlongRouteSumFields>;
  var_pop?: Maybe<RouteInfrastructureLinkAlongRouteVarPopFields>;
  var_samp?: Maybe<RouteInfrastructureLinkAlongRouteVarSampFields>;
  variance?: Maybe<RouteInfrastructureLinkAlongRouteVarianceFields>;
};

/** aggregate fields of "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAggregateFieldsCountArgs = {
  columns?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAggregateOrderBy = {
  avg?: Maybe<RouteInfrastructureLinkAlongRouteAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<RouteInfrastructureLinkAlongRouteMaxOrderBy>;
  min?: Maybe<RouteInfrastructureLinkAlongRouteMinOrderBy>;
  stddev?: Maybe<RouteInfrastructureLinkAlongRouteStddevOrderBy>;
  stddev_pop?: Maybe<RouteInfrastructureLinkAlongRouteStddevPopOrderBy>;
  stddev_samp?: Maybe<RouteInfrastructureLinkAlongRouteStddevSampOrderBy>;
  sum?: Maybe<RouteInfrastructureLinkAlongRouteSumOrderBy>;
  var_pop?: Maybe<RouteInfrastructureLinkAlongRouteVarPopOrderBy>;
  var_samp?: Maybe<RouteInfrastructureLinkAlongRouteVarSampOrderBy>;
  variance?: Maybe<RouteInfrastructureLinkAlongRouteVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteArrRelInsertInput = {
  data: Array<RouteInfrastructureLinkAlongRouteInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<RouteInfrastructureLinkAlongRouteOnConflict>;
};

/** aggregate avg on columns */
export type RouteInfrastructureLinkAlongRouteAvgFields = {
  __typename?: 'route_infrastructure_link_along_route_avg_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAvgOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.infrastructure_link_along_route". All fields are combined with a logical 'AND'. */
export type RouteInfrastructureLinkAlongRouteBoolExp = {
  _and?: Maybe<Array<RouteInfrastructureLinkAlongRouteBoolExp>>;
  _not?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  _or?: Maybe<Array<RouteInfrastructureLinkAlongRouteBoolExp>>;
  infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_link_id?: Maybe<UuidComparisonExp>;
  infrastructure_link_sequence?: Maybe<IntComparisonExp>;
  is_traversal_forwards?: Maybe<BooleanComparisonExp>;
  route_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteConstraint {
  /** unique or primary key constraint on columns "route_id", "infrastructure_link_sequence" */
  InfrastructureLinkAlongRoutePkey = 'infrastructure_link_along_route_pkey',
}

/** input type for incrementing numeric columns in table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteIncInput = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteInsertInput = {
  infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: Maybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type RouteInfrastructureLinkAlongRouteMaxFields = {
  __typename?: 'route_infrastructure_link_along_route_max_fields';
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteMaxOrderBy = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<OrderBy>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
  /** The ID of the route. */
  route_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteInfrastructureLinkAlongRouteMinFields = {
  __typename?: 'route_infrastructure_link_along_route_min_fields';
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteMinOrderBy = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<OrderBy>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
  /** The ID of the route. */
  route_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteMutationResponse = {
  __typename?: 'route_infrastructure_link_along_route_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RouteInfrastructureLinkAlongRoute>;
};

/** on_conflict condition type for table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteOnConflict = {
  constraint: RouteInfrastructureLinkAlongRouteConstraint;
  update_columns?: Array<RouteInfrastructureLinkAlongRouteUpdateColumn>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** Ordering options when selecting data from "route.infrastructure_link_along_route". */
export type RouteInfrastructureLinkAlongRouteOrderBy = {
  infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  infrastructure_link_id?: Maybe<OrderBy>;
  infrastructure_link_sequence?: Maybe<OrderBy>;
  is_traversal_forwards?: Maybe<OrderBy>;
  route_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: route.infrastructure_link_along_route */
export type RouteInfrastructureLinkAlongRoutePkColumnsInput = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence: Scalars['Int'];
  /** The ID of the route. */
  route_id: Scalars['uuid'];
};

/** select columns of table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteSelectColumn {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  InfrastructureLinkSequence = 'infrastructure_link_sequence',
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
  /** column name */
  RouteId = 'route_id',
}

/** select "route_infrastructure_link_along_route_aggregate_bool_exp_bool_and_arguments_columns" columns of table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
}

/** select "route_infrastructure_link_along_route_aggregate_bool_exp_bool_or_arguments_columns" columns of table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
}

/** input type for updating data in table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteSetInput = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: Maybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type RouteInfrastructureLinkAlongRouteStddevFields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteStddevOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RouteInfrastructureLinkAlongRouteStddevPopFields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_pop_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteStddevPopOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RouteInfrastructureLinkAlongRouteStddevSampFields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_samp_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteStddevSampOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** Streaming cursor of the table "route_infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteInfrastructureLinkAlongRouteStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteInfrastructureLinkAlongRouteStreamCursorValueInput = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: Maybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** aggregate sum on columns */
export type RouteInfrastructureLinkAlongRouteSumFields = {
  __typename?: 'route_infrastructure_link_along_route_sum_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteSumOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** update columns of table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteUpdateColumn {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  InfrastructureLinkSequence = 'infrastructure_link_sequence',
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
  /** column name */
  RouteId = 'route_id',
}

export type RouteInfrastructureLinkAlongRouteUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<RouteInfrastructureLinkAlongRouteIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<RouteInfrastructureLinkAlongRouteSetInput>;
  where: RouteInfrastructureLinkAlongRouteBoolExp;
};

/** aggregate var_pop on columns */
export type RouteInfrastructureLinkAlongRouteVarPopFields = {
  __typename?: 'route_infrastructure_link_along_route_var_pop_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteVarPopOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RouteInfrastructureLinkAlongRouteVarSampFields = {
  __typename?: 'route_infrastructure_link_along_route_var_samp_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteVarSampOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type RouteInfrastructureLinkAlongRouteVarianceFields = {
  __typename?: 'route_infrastructure_link_along_route_variance_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteVarianceOrderBy = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<OrderBy>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLine = {
  __typename?: 'route_line';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label: Scalars['String'];
  /** The ID of the line. */
  line_id: Scalars['uuid'];
  /** An array relationship */
  line_routes: Array<RouteRoute>;
  /** An aggregate relationship */
  line_routes_aggregate: RouteRouteAggregate;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n: Scalars['localized_string'];
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n: Scalars['localized_string'];
  /** An object relationship */
  transportTargetByTransportTarget: HslRouteTransportTarget;
  transport_target: HslRouteTransportTargetEnum;
  /** An object relationship */
  typeOfLineByTypeOfLine: RouteTypeOfLine;
  /** The type of the line. */
  type_of_line: RouteTypeOfLineEnum;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
  /** An object relationship */
  vehicle_mode: ReusableComponentsVehicleMode;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineLineRoutesArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineLineRoutesAggregateArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "route.line" */
export type RouteLineAggregate = {
  __typename?: 'route_line_aggregate';
  aggregate?: Maybe<RouteLineAggregateFields>;
  nodes: Array<RouteLine>;
};

export type RouteLineAggregateBoolExp = {
  count?: Maybe<RouteLineAggregateBoolExpCount>;
};

export type RouteLineAggregateBoolExpCount = {
  arguments?: Maybe<Array<RouteLineSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteLineBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "route.line" */
export type RouteLineAggregateFields = {
  __typename?: 'route_line_aggregate_fields';
  avg?: Maybe<RouteLineAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<RouteLineMaxFields>;
  min?: Maybe<RouteLineMinFields>;
  stddev?: Maybe<RouteLineStddevFields>;
  stddev_pop?: Maybe<RouteLineStddevPopFields>;
  stddev_samp?: Maybe<RouteLineStddevSampFields>;
  sum?: Maybe<RouteLineSumFields>;
  var_pop?: Maybe<RouteLineVarPopFields>;
  var_samp?: Maybe<RouteLineVarSampFields>;
  variance?: Maybe<RouteLineVarianceFields>;
};

/** aggregate fields of "route.line" */
export type RouteLineAggregateFieldsCountArgs = {
  columns?: Maybe<Array<RouteLineSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.line" */
export type RouteLineAggregateOrderBy = {
  avg?: Maybe<RouteLineAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<RouteLineMaxOrderBy>;
  min?: Maybe<RouteLineMinOrderBy>;
  stddev?: Maybe<RouteLineStddevOrderBy>;
  stddev_pop?: Maybe<RouteLineStddevPopOrderBy>;
  stddev_samp?: Maybe<RouteLineStddevSampOrderBy>;
  sum?: Maybe<RouteLineSumOrderBy>;
  var_pop?: Maybe<RouteLineVarPopOrderBy>;
  var_samp?: Maybe<RouteLineVarSampOrderBy>;
  variance?: Maybe<RouteLineVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RouteLineAppendInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "route.line" */
export type RouteLineArrRelInsertInput = {
  data: Array<RouteLineInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<RouteLineOnConflict>;
};

/** aggregate avg on columns */
export type RouteLineAvgFields = {
  __typename?: 'route_line_avg_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.line" */
export type RouteLineAvgOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.line". All fields are combined with a logical 'AND'. */
export type RouteLineBoolExp = {
  _and?: Maybe<Array<RouteLineBoolExp>>;
  _not?: Maybe<RouteLineBoolExp>;
  _or?: Maybe<Array<RouteLineBoolExp>>;
  label?: Maybe<StringComparisonExp>;
  line_id?: Maybe<UuidComparisonExp>;
  line_routes?: Maybe<RouteRouteBoolExp>;
  line_routes_aggregate?: Maybe<RouteRouteAggregateBoolExp>;
  name_i18n?: Maybe<JsonbComparisonExp>;
  primary_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  priority?: Maybe<IntComparisonExp>;
  short_name_i18n?: Maybe<JsonbComparisonExp>;
  transportTargetByTransportTarget?: Maybe<HslRouteTransportTargetBoolExp>;
  transport_target?: Maybe<HslRouteTransportTargetEnumComparisonExp>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineBoolExp>;
  type_of_line?: Maybe<RouteTypeOfLineEnumComparisonExp>;
  validity_end?: Maybe<DateComparisonExp>;
  validity_start?: Maybe<DateComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

/** unique or primary key constraints on table "route.line" */
export enum RouteLineConstraint {
  /** unique or primary key constraint on columns "line_id" */
  LinePkey = 'line_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RouteLineDeleteAtPathInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Array<Scalars['String']>>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RouteLineDeleteElemInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RouteLineDeleteKeyInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['String']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "route.line" */
export type RouteLineIncInput = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.line" */
export type RouteLineInsertInput = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  line_routes?: Maybe<RouteRouteArrRelInsertInput>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n: Scalars['localized_string'];
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n: Scalars['localized_string'];
  transportTargetByTransportTarget?: Maybe<HslRouteTransportTargetObjRelInsertInput>;
  transport_target?: Maybe<HslRouteTransportTargetEnum>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineObjRelInsertInput>;
  /** The type of the line. */
  type_of_line?: Maybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeObjRelInsertInput>;
};

/** aggregate max on columns */
export type RouteLineMaxFields = {
  __typename?: 'route_line_max_fields';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
};

/** order by max() on columns of table "route.line" */
export type RouteLineMaxOrderBy = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<OrderBy>;
  /** The ID of the line. */
  line_id?: Maybe<OrderBy>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteLineMinFields = {
  __typename?: 'route_line_min_fields';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
};

/** order by min() on columns of table "route.line" */
export type RouteLineMinOrderBy = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<OrderBy>;
  /** The ID of the line. */
  line_id?: Maybe<OrderBy>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<OrderBy>;
};

/** response of any mutation on the table "route.line" */
export type RouteLineMutationResponse = {
  __typename?: 'route_line_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RouteLine>;
};

/** input type for inserting object relation for remote table "route.line" */
export type RouteLineObjRelInsertInput = {
  data: RouteLineInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<RouteLineOnConflict>;
};

/** on_conflict condition type for table "route.line" */
export type RouteLineOnConflict = {
  constraint: RouteLineConstraint;
  update_columns?: Array<RouteLineUpdateColumn>;
  where?: Maybe<RouteLineBoolExp>;
};

/** Ordering options when selecting data from "route.line". */
export type RouteLineOrderBy = {
  label?: Maybe<OrderBy>;
  line_id?: Maybe<OrderBy>;
  line_routes_aggregate?: Maybe<RouteRouteAggregateOrderBy>;
  name_i18n?: Maybe<OrderBy>;
  primary_vehicle_mode?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  short_name_i18n?: Maybe<OrderBy>;
  transportTargetByTransportTarget?: Maybe<HslRouteTransportTargetOrderBy>;
  transport_target?: Maybe<OrderBy>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineOrderBy>;
  type_of_line?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeOrderBy>;
};

/** primary key columns input for table: route.line */
export type RouteLinePkColumnsInput = {
  /** The ID of the line. */
  line_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RouteLinePrependInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "route.line" */
export enum RouteLineSelectColumn {
  /** column name */
  Label = 'label',
  /** column name */
  LineId = 'line_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  PrimaryVehicleMode = 'primary_vehicle_mode',
  /** column name */
  Priority = 'priority',
  /** column name */
  ShortNameI18n = 'short_name_i18n',
  /** column name */
  TransportTarget = 'transport_target',
  /** column name */
  TypeOfLine = 'type_of_line',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
}

/** input type for updating data in table "route.line" */
export type RouteLineSetInput = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['localized_string']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['localized_string']>;
  transport_target?: Maybe<HslRouteTransportTargetEnum>;
  /** The type of the line. */
  type_of_line?: Maybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
};

/** aggregate stddev on columns */
export type RouteLineStddevFields = {
  __typename?: 'route_line_stddev_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.line" */
export type RouteLineStddevOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RouteLineStddevPopFields = {
  __typename?: 'route_line_stddev_pop_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.line" */
export type RouteLineStddevPopOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RouteLineStddevSampFields = {
  __typename?: 'route_line_stddev_samp_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.line" */
export type RouteLineStddevSampOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** Streaming cursor of the table "route_line" */
export type RouteLineStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteLineStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteLineStreamCursorValueInput = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['jsonb']>;
  transport_target?: Maybe<HslRouteTransportTargetEnum>;
  /** The type of the line. */
  type_of_line?: Maybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['date']>;
};

/** aggregate sum on columns */
export type RouteLineSumFields = {
  __typename?: 'route_line_sum_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "route.line" */
export type RouteLineSumOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** update columns of table "route.line" */
export enum RouteLineUpdateColumn {
  /** column name */
  Label = 'label',
  /** column name */
  LineId = 'line_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  PrimaryVehicleMode = 'primary_vehicle_mode',
  /** column name */
  Priority = 'priority',
  /** column name */
  ShortNameI18n = 'short_name_i18n',
  /** column name */
  TransportTarget = 'transport_target',
  /** column name */
  TypeOfLine = 'type_of_line',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
}

export type RouteLineUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<RouteLineAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<RouteLineDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<RouteLineDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<RouteLineDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<RouteLineIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<RouteLinePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<RouteLineSetInput>;
  where: RouteLineBoolExp;
};

/** aggregate var_pop on columns */
export type RouteLineVarPopFields = {
  __typename?: 'route_line_var_pop_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.line" */
export type RouteLineVarPopOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RouteLineVarSampFields = {
  __typename?: 'route_line_var_samp_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.line" */
export type RouteLineVarSampOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type RouteLineVarianceFields = {
  __typename?: 'route_line_variance_fields';
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.line" */
export type RouteLineVarianceOrderBy = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRoute = {
  __typename?: 'route_route';
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  /** The direction of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  direction: RouteDirectionEnum;
  /** An array relationship */
  infrastructure_links_along_route: Array<RouteInfrastructureLinkAlongRoute>;
  /** An aggregate relationship */
  infrastructure_links_along_route_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label: Scalars['String'];
  name_i18n: Scalars['localized_string'];
  /** The line to which this route belongs. */
  on_line_id: Scalars['uuid'];
  origin_name_i18n: Scalars['localized_string'];
  origin_short_name_i18n: Scalars['localized_string'];
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** The ID of the route. */
  route_id: Scalars['uuid'];
  /** An array relationship */
  route_journey_patterns: Array<JourneyPatternJourneyPattern>;
  /** An aggregate relationship */
  route_journey_patterns_aggregate: JourneyPatternJourneyPatternAggregate;
  /** An object relationship */
  route_line: RouteLine;
  /** A computed field, executes function "route.route_shape" */
  route_shape?: Maybe<Scalars['geography_linestring']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDescriptionI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDestinationNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDestinationShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteInfrastructureLinksAlongRouteArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteInfrastructureLinksAlongRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteOriginNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteOriginShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteRouteJourneyPatternsArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteRouteJourneyPatternsAggregateArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

/** aggregated selection of "route.route" */
export type RouteRouteAggregate = {
  __typename?: 'route_route_aggregate';
  aggregate?: Maybe<RouteRouteAggregateFields>;
  nodes: Array<RouteRoute>;
};

export type RouteRouteAggregateBoolExp = {
  count?: Maybe<RouteRouteAggregateBoolExpCount>;
};

export type RouteRouteAggregateBoolExpCount = {
  arguments?: Maybe<Array<RouteRouteSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<RouteRouteBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "route.route" */
export type RouteRouteAggregateFields = {
  __typename?: 'route_route_aggregate_fields';
  avg?: Maybe<RouteRouteAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<RouteRouteMaxFields>;
  min?: Maybe<RouteRouteMinFields>;
  stddev?: Maybe<RouteRouteStddevFields>;
  stddev_pop?: Maybe<RouteRouteStddevPopFields>;
  stddev_samp?: Maybe<RouteRouteStddevSampFields>;
  sum?: Maybe<RouteRouteSumFields>;
  var_pop?: Maybe<RouteRouteVarPopFields>;
  var_samp?: Maybe<RouteRouteVarSampFields>;
  variance?: Maybe<RouteRouteVarianceFields>;
};

/** aggregate fields of "route.route" */
export type RouteRouteAggregateFieldsCountArgs = {
  columns?: Maybe<Array<RouteRouteSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.route" */
export type RouteRouteAggregateOrderBy = {
  avg?: Maybe<RouteRouteAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<RouteRouteMaxOrderBy>;
  min?: Maybe<RouteRouteMinOrderBy>;
  stddev?: Maybe<RouteRouteStddevOrderBy>;
  stddev_pop?: Maybe<RouteRouteStddevPopOrderBy>;
  stddev_samp?: Maybe<RouteRouteStddevSampOrderBy>;
  sum?: Maybe<RouteRouteSumOrderBy>;
  var_pop?: Maybe<RouteRouteVarPopOrderBy>;
  var_samp?: Maybe<RouteRouteVarSampOrderBy>;
  variance?: Maybe<RouteRouteVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RouteRouteAppendInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['jsonb']>;
  destination_name_i18n?: Maybe<Scalars['jsonb']>;
  destination_short_name_i18n?: Maybe<Scalars['jsonb']>;
  name_i18n?: Maybe<Scalars['jsonb']>;
  origin_name_i18n?: Maybe<Scalars['jsonb']>;
  origin_short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "route.route" */
export type RouteRouteArrRelInsertInput = {
  data: Array<RouteRouteInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** aggregate avg on columns */
export type RouteRouteAvgFields = {
  __typename?: 'route_route_avg_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.route" */
export type RouteRouteAvgOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.route". All fields are combined with a logical 'AND'. */
export type RouteRouteBoolExp = {
  _and?: Maybe<Array<RouteRouteBoolExp>>;
  _not?: Maybe<RouteRouteBoolExp>;
  _or?: Maybe<Array<RouteRouteBoolExp>>;
  description_i18n?: Maybe<JsonbComparisonExp>;
  destination_name_i18n?: Maybe<JsonbComparisonExp>;
  destination_short_name_i18n?: Maybe<JsonbComparisonExp>;
  direction?: Maybe<RouteDirectionEnumComparisonExp>;
  infrastructure_links_along_route?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  infrastructure_links_along_route_aggregate?: Maybe<RouteInfrastructureLinkAlongRouteAggregateBoolExp>;
  label?: Maybe<StringComparisonExp>;
  name_i18n?: Maybe<JsonbComparisonExp>;
  on_line_id?: Maybe<UuidComparisonExp>;
  origin_name_i18n?: Maybe<JsonbComparisonExp>;
  origin_short_name_i18n?: Maybe<JsonbComparisonExp>;
  priority?: Maybe<IntComparisonExp>;
  route_id?: Maybe<UuidComparisonExp>;
  route_journey_patterns?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  route_journey_patterns_aggregate?: Maybe<JourneyPatternJourneyPatternAggregateBoolExp>;
  route_line?: Maybe<RouteLineBoolExp>;
  route_shape?: Maybe<GeographyComparisonExp>;
  validity_end?: Maybe<DateComparisonExp>;
  validity_start?: Maybe<DateComparisonExp>;
  variant?: Maybe<SmallintComparisonExp>;
};

/** unique or primary key constraints on table "route.route" */
export enum RouteRouteConstraint {
  /** unique or primary key constraint on columns "route_id" */
  RoutePkey = 'route_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RouteRouteDeleteAtPathInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Array<Scalars['String']>>;
  destination_name_i18n?: Maybe<Array<Scalars['String']>>;
  destination_short_name_i18n?: Maybe<Array<Scalars['String']>>;
  name_i18n?: Maybe<Array<Scalars['String']>>;
  origin_name_i18n?: Maybe<Array<Scalars['String']>>;
  origin_short_name_i18n?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RouteRouteDeleteElemInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['Int']>;
  destination_name_i18n?: Maybe<Scalars['Int']>;
  destination_short_name_i18n?: Maybe<Scalars['Int']>;
  name_i18n?: Maybe<Scalars['Int']>;
  origin_name_i18n?: Maybe<Scalars['Int']>;
  origin_short_name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RouteRouteDeleteKeyInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  destination_name_i18n?: Maybe<Scalars['String']>;
  destination_short_name_i18n?: Maybe<Scalars['String']>;
  name_i18n?: Maybe<Scalars['String']>;
  origin_name_i18n?: Maybe<Scalars['String']>;
  origin_short_name_i18n?: Maybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "route.route" */
export type RouteRouteIncInput = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** input type for inserting data into table "route.route" */
export type RouteRouteInsertInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  /** The direction of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  direction?: Maybe<RouteDirectionEnum>;
  infrastructure_links_along_route?: Maybe<RouteInfrastructureLinkAlongRouteArrRelInsertInput>;
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label: Scalars['String'];
  name_i18n: Scalars['localized_string'];
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  origin_name_i18n: Scalars['localized_string'];
  origin_short_name_i18n: Scalars['localized_string'];
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  route_journey_patterns?: Maybe<JourneyPatternJourneyPatternArrRelInsertInput>;
  route_line?: Maybe<RouteLineObjRelInsertInput>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** aggregate max on columns */
export type RouteRouteMaxFields = {
  __typename?: 'route_route_max_fields';
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by max() on columns of table "route.route" */
export type RouteRouteMaxOrderBy = {
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<OrderBy>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<OrderBy>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The ID of the route. */
  route_id?: Maybe<OrderBy>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteRouteMinFields = {
  __typename?: 'route_route_min_fields';
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by min() on columns of table "route.route" */
export type RouteRouteMinOrderBy = {
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<OrderBy>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<OrderBy>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The ID of the route. */
  route_id?: Maybe<OrderBy>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** response of any mutation on the table "route.route" */
export type RouteRouteMutationResponse = {
  __typename?: 'route_route_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RouteRoute>;
};

/** input type for inserting object relation for remote table "route.route" */
export type RouteRouteObjRelInsertInput = {
  data: RouteRouteInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** on_conflict condition type for table "route.route" */
export type RouteRouteOnConflict = {
  constraint: RouteRouteConstraint;
  update_columns?: Array<RouteRouteUpdateColumn>;
  where?: Maybe<RouteRouteBoolExp>;
};

/** Ordering options when selecting data from "route.route". */
export type RouteRouteOrderBy = {
  description_i18n?: Maybe<OrderBy>;
  destination_name_i18n?: Maybe<OrderBy>;
  destination_short_name_i18n?: Maybe<OrderBy>;
  direction?: Maybe<OrderBy>;
  infrastructure_links_along_route_aggregate?: Maybe<RouteInfrastructureLinkAlongRouteAggregateOrderBy>;
  label?: Maybe<OrderBy>;
  name_i18n?: Maybe<OrderBy>;
  on_line_id?: Maybe<OrderBy>;
  origin_name_i18n?: Maybe<OrderBy>;
  origin_short_name_i18n?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  route_id?: Maybe<OrderBy>;
  route_journey_patterns_aggregate?: Maybe<JourneyPatternJourneyPatternAggregateOrderBy>;
  route_line?: Maybe<RouteLineOrderBy>;
  route_shape?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  variant?: Maybe<OrderBy>;
};

/** primary key columns input for table: route.route */
export type RouteRoutePkColumnsInput = {
  /** The ID of the route. */
  route_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RouteRoutePrependInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['jsonb']>;
  destination_name_i18n?: Maybe<Scalars['jsonb']>;
  destination_short_name_i18n?: Maybe<Scalars['jsonb']>;
  name_i18n?: Maybe<Scalars['jsonb']>;
  origin_name_i18n?: Maybe<Scalars['jsonb']>;
  origin_short_name_i18n?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "route.route" */
export enum RouteRouteSelectColumn {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  DestinationNameI18n = 'destination_name_i18n',
  /** column name */
  DestinationShortNameI18n = 'destination_short_name_i18n',
  /** column name */
  Direction = 'direction',
  /** column name */
  Label = 'label',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  OnLineId = 'on_line_id',
  /** column name */
  OriginNameI18n = 'origin_name_i18n',
  /** column name */
  OriginShortNameI18n = 'origin_short_name_i18n',
  /** column name */
  Priority = 'priority',
  /** column name */
  RouteId = 'route_id',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
  /** column name */
  Variant = 'variant',
}

/** input type for updating data in table "route.route" */
export type RouteRouteSetInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n?: Maybe<Scalars['localized_string']>;
  destination_short_name_i18n?: Maybe<Scalars['localized_string']>;
  /** The direction of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  direction?: Maybe<RouteDirectionEnum>;
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  name_i18n?: Maybe<Scalars['localized_string']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  origin_name_i18n?: Maybe<Scalars['localized_string']>;
  origin_short_name_i18n?: Maybe<Scalars['localized_string']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** aggregate stddev on columns */
export type RouteRouteStddevFields = {
  __typename?: 'route_route_stddev_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.route" */
export type RouteRouteStddevOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RouteRouteStddevPopFields = {
  __typename?: 'route_route_stddev_pop_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.route" */
export type RouteRouteStddevPopOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RouteRouteStddevSampFields = {
  __typename?: 'route_route_stddev_samp_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.route" */
export type RouteRouteStddevSampOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** Streaming cursor of the table "route_route" */
export type RouteRouteStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteRouteStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteRouteStreamCursorValueInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['jsonb']>;
  destination_name_i18n?: Maybe<Scalars['jsonb']>;
  destination_short_name_i18n?: Maybe<Scalars['jsonb']>;
  /** The direction of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  direction?: Maybe<RouteDirectionEnum>;
  /** The label of the route definition, label, variant and direction together are unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  origin_name_i18n?: Maybe<Scalars['jsonb']>;
  origin_short_name_i18n?: Maybe<Scalars['jsonb']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** aggregate sum on columns */
export type RouteRouteSumFields = {
  __typename?: 'route_route_sum_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by sum() on columns of table "route.route" */
export type RouteRouteSumOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** update columns of table "route.route" */
export enum RouteRouteUpdateColumn {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  DestinationNameI18n = 'destination_name_i18n',
  /** column name */
  DestinationShortNameI18n = 'destination_short_name_i18n',
  /** column name */
  Direction = 'direction',
  /** column name */
  Label = 'label',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  OnLineId = 'on_line_id',
  /** column name */
  OriginNameI18n = 'origin_name_i18n',
  /** column name */
  OriginShortNameI18n = 'origin_short_name_i18n',
  /** column name */
  Priority = 'priority',
  /** column name */
  RouteId = 'route_id',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
  /** column name */
  Variant = 'variant',
}

export type RouteRouteUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<RouteRouteAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<RouteRouteDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<RouteRouteDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<RouteRouteDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<RouteRouteIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<RouteRoutePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<RouteRouteSetInput>;
  where: RouteRouteBoolExp;
};

/** aggregate var_pop on columns */
export type RouteRouteVarPopFields = {
  __typename?: 'route_route_var_pop_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.route" */
export type RouteRouteVarPopOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RouteRouteVarSampFields = {
  __typename?: 'route_route_var_samp_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.route" */
export type RouteRouteVarSampOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type RouteRouteVarianceFields = {
  __typename?: 'route_route_variance_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.route" */
export type RouteRouteVarianceOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The variant for route definition, label, variant and direction together are unique for a certain priority and validity period. */
  variant?: Maybe<OrderBy>;
};

/** Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm */
export type RouteTypeOfLine = {
  __typename?: 'route_type_of_line';
  belonging_to_vehicle_mode: ReusableComponentsVehicleModeEnum;
  /** An array relationship */
  lines: Array<RouteLine>;
  /** An aggregate relationship */
  lines_aggregate: RouteLineAggregate;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line: Scalars['String'];
  /** An object relationship */
  vehicle_mode: ReusableComponentsVehicleMode;
};

/** Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm */
export type RouteTypeOfLineLinesArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/** Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm */
export type RouteTypeOfLineLinesAggregateArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/** aggregated selection of "route.type_of_line" */
export type RouteTypeOfLineAggregate = {
  __typename?: 'route_type_of_line_aggregate';
  aggregate?: Maybe<RouteTypeOfLineAggregateFields>;
  nodes: Array<RouteTypeOfLine>;
};

/** aggregate fields of "route.type_of_line" */
export type RouteTypeOfLineAggregateFields = {
  __typename?: 'route_type_of_line_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<RouteTypeOfLineMaxFields>;
  min?: Maybe<RouteTypeOfLineMinFields>;
};

/** aggregate fields of "route.type_of_line" */
export type RouteTypeOfLineAggregateFieldsCountArgs = {
  columns?: Maybe<Array<RouteTypeOfLineSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "route.type_of_line". All fields are combined with a logical 'AND'. */
export type RouteTypeOfLineBoolExp = {
  _and?: Maybe<Array<RouteTypeOfLineBoolExp>>;
  _not?: Maybe<RouteTypeOfLineBoolExp>;
  _or?: Maybe<Array<RouteTypeOfLineBoolExp>>;
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  lines?: Maybe<RouteLineBoolExp>;
  lines_aggregate?: Maybe<RouteLineAggregateBoolExp>;
  type_of_line?: Maybe<StringComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

/** unique or primary key constraints on table "route.type_of_line" */
export enum RouteTypeOfLineConstraint {
  /** unique or primary key constraint on columns "type_of_line" */
  TypeOfLinePkey = 'type_of_line_pkey',
}

export enum RouteTypeOfLineEnum {
  /** tram */
  CityTramService = 'city_tram_service',
  /** bus */
  DemandAndResponseBusService = 'demand_and_response_bus_service',
  /** bus */
  ExpressBusService = 'express_bus_service',
  /** ferry */
  FerryService = 'ferry_service',
  /** metro */
  MetroService = 'metro_service',
  /** bus */
  RegionalBusService = 'regional_bus_service',
  /** train */
  RegionalRailService = 'regional_rail_service',
  /** tram */
  RegionalTramService = 'regional_tram_service',
  /** bus */
  SpecialNeedsBus = 'special_needs_bus',
  /** bus */
  StoppingBusService = 'stopping_bus_service',
  /** train */
  SuburbanRailway = 'suburban_railway',
}

/** Boolean expression to compare columns of type "route_type_of_line_enum". All fields are combined with logical 'AND'. */
export type RouteTypeOfLineEnumComparisonExp = {
  _eq?: Maybe<RouteTypeOfLineEnum>;
  _in?: Maybe<Array<RouteTypeOfLineEnum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<RouteTypeOfLineEnum>;
  _nin?: Maybe<Array<RouteTypeOfLineEnum>>;
};

/** input type for inserting data into table "route.type_of_line" */
export type RouteTypeOfLineInsertInput = {
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  lines?: Maybe<RouteLineArrRelInsertInput>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeObjRelInsertInput>;
};

/** aggregate max on columns */
export type RouteTypeOfLineMaxFields = {
  __typename?: 'route_type_of_line_max_fields';
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type RouteTypeOfLineMinFields = {
  __typename?: 'route_type_of_line_min_fields';
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "route.type_of_line" */
export type RouteTypeOfLineMutationResponse = {
  __typename?: 'route_type_of_line_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<RouteTypeOfLine>;
};

/** input type for inserting object relation for remote table "route.type_of_line" */
export type RouteTypeOfLineObjRelInsertInput = {
  data: RouteTypeOfLineInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<RouteTypeOfLineOnConflict>;
};

/** on_conflict condition type for table "route.type_of_line" */
export type RouteTypeOfLineOnConflict = {
  constraint: RouteTypeOfLineConstraint;
  update_columns?: Array<RouteTypeOfLineUpdateColumn>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

/** Ordering options when selecting data from "route.type_of_line". */
export type RouteTypeOfLineOrderBy = {
  belonging_to_vehicle_mode?: Maybe<OrderBy>;
  lines_aggregate?: Maybe<RouteLineAggregateOrderBy>;
  type_of_line?: Maybe<OrderBy>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeOrderBy>;
};

/** primary key columns input for table: route.type_of_line */
export type RouteTypeOfLinePkColumnsInput = {
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line: Scalars['String'];
};

/** select columns of table "route.type_of_line" */
export enum RouteTypeOfLineSelectColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  TypeOfLine = 'type_of_line',
}

/** input type for updating data in table "route.type_of_line" */
export type RouteTypeOfLineSetInput = {
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
};

/** Streaming cursor of the table "route_type_of_line" */
export type RouteTypeOfLineStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteTypeOfLineStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteTypeOfLineStreamCursorValueInput = {
  belonging_to_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
};

/** update columns of table "route.type_of_line" */
export enum RouteTypeOfLineUpdateColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  TypeOfLine = 'type_of_line',
}

export type RouteTypeOfLineUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<RouteTypeOfLineSetInput>;
  where: RouteTypeOfLineBoolExp;
};

export type ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExp = {
  count?: Maybe<ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExpCount>;
};

export type ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExpCount = {
  arguments?: Maybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  predicate: IntComparisonExp;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPoint = {
  __typename?: 'service_pattern_scheduled_stop_point';
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography_point']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label: Scalars['String'];
  /** An object relationship */
  located_on_infrastructure_link: InfrastructureNetworkInfrastructureLink;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id: Scalars['uuid'];
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location: Scalars['geography_point'];
  /** An array relationship */
  other_label_instances: Array<ServicePatternScheduledStopPoint>;
  /** An aggregate relationship */
  other_label_instances_aggregate: ServicePatternScheduledStopPointAggregate;
  priority: Scalars['Int'];
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start: Scalars['Float'];
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_point_in_journey_patterns: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_patterns_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
  /** An object relationship */
  timing_place?: Maybe<TimingPatternTimingPlace>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
  /** An array relationship */
  vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** An aggregate relationship */
  vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointOtherLabelInstancesArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointOtherLabelInstancesAggregateArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointScheduledStopPointInJourneyPatternsArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointScheduledStopPointInJourneyPatternsAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointVehicleModeOnScheduledStopPointArgs =
  {
    distinct_on?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

/** aggregated selection of "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregate = {
  __typename?: 'service_pattern_scheduled_stop_point_aggregate';
  aggregate?: Maybe<ServicePatternScheduledStopPointAggregateFields>;
  nodes: Array<ServicePatternScheduledStopPoint>;
};

export type ServicePatternScheduledStopPointAggregateBoolExp = {
  count?: Maybe<ServicePatternScheduledStopPointAggregateBoolExpCount>;
};

export type ServicePatternScheduledStopPointAggregateBoolExpCount = {
  arguments?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  predicate: IntComparisonExp;
};

/** aggregate fields of "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregateFields = {
  __typename?: 'service_pattern_scheduled_stop_point_aggregate_fields';
  avg?: Maybe<ServicePatternScheduledStopPointAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<ServicePatternScheduledStopPointMaxFields>;
  min?: Maybe<ServicePatternScheduledStopPointMinFields>;
  stddev?: Maybe<ServicePatternScheduledStopPointStddevFields>;
  stddev_pop?: Maybe<ServicePatternScheduledStopPointStddevPopFields>;
  stddev_samp?: Maybe<ServicePatternScheduledStopPointStddevSampFields>;
  sum?: Maybe<ServicePatternScheduledStopPointSumFields>;
  var_pop?: Maybe<ServicePatternScheduledStopPointVarPopFields>;
  var_samp?: Maybe<ServicePatternScheduledStopPointVarSampFields>;
  variance?: Maybe<ServicePatternScheduledStopPointVarianceFields>;
};

/** aggregate fields of "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregateFieldsCountArgs = {
  columns?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregateOrderBy = {
  avg?: Maybe<ServicePatternScheduledStopPointAvgOrderBy>;
  count?: Maybe<OrderBy>;
  max?: Maybe<ServicePatternScheduledStopPointMaxOrderBy>;
  min?: Maybe<ServicePatternScheduledStopPointMinOrderBy>;
  stddev?: Maybe<ServicePatternScheduledStopPointStddevOrderBy>;
  stddev_pop?: Maybe<ServicePatternScheduledStopPointStddevPopOrderBy>;
  stddev_samp?: Maybe<ServicePatternScheduledStopPointStddevSampOrderBy>;
  sum?: Maybe<ServicePatternScheduledStopPointSumOrderBy>;
  var_pop?: Maybe<ServicePatternScheduledStopPointVarPopOrderBy>;
  var_samp?: Maybe<ServicePatternScheduledStopPointVarSampOrderBy>;
  variance?: Maybe<ServicePatternScheduledStopPointVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointArrRelInsertInput = {
  data: Array<ServicePatternScheduledStopPointInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<ServicePatternScheduledStopPointOnConflict>;
};

/** aggregate avg on columns */
export type ServicePatternScheduledStopPointAvgFields = {
  __typename?: 'service_pattern_scheduled_stop_point_avg_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAvgOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type ServicePatternScheduledStopPointBoolExp = {
  _and?: Maybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  _not?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  _or?: Maybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  closest_point_on_infrastructure_link?: Maybe<GeographyComparisonExp>;
  direction?: Maybe<InfrastructureNetworkDirectionEnumComparisonExp>;
  label?: Maybe<StringComparisonExp>;
  located_on_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  located_on_infrastructure_link_id?: Maybe<UuidComparisonExp>;
  measured_location?: Maybe<GeographyComparisonExp>;
  other_label_instances?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  other_label_instances_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  priority?: Maybe<IntComparisonExp>;
  relative_distance_from_infrastructure_link_start?: Maybe<Float8ComparisonExp>;
  scheduled_stop_point_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp>;
  timing_place?: Maybe<TimingPatternTimingPlaceBoolExp>;
  timing_place_id?: Maybe<UuidComparisonExp>;
  validity_end?: Maybe<DateComparisonExp>;
  validity_start?: Maybe<DateComparisonExp>;
  vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  vehicle_mode_on_scheduled_stop_point_aggregate?: Maybe<ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExp>;
};

/** unique or primary key constraints on table "service_pattern.scheduled_stop_point" */
export enum ServicePatternScheduledStopPointConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_id" */
  ScheduledStopPointPkey = 'scheduled_stop_point_pkey',
}

export type ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExp =
  {
    count?: Maybe<ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExpCount>;
  };

export type ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExpCount =
  {
    arguments?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
    predicate: IntComparisonExp;
  };

/** input type for incrementing numeric columns in table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointIncInput = {
  priority?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointInsertInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label: Scalars['String'];
  located_on_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id: Scalars['uuid'];
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location: Scalars['geography_point'];
  other_label_instances?: Maybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  priority: Scalars['Int'];
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput>;
  timing_place?: Maybe<TimingPatternTimingPlaceObjRelInsertInput>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointArrRelInsertInput>;
};

/** aggregate max on columns */
export type ServicePatternScheduledStopPointMaxFields = {
  __typename?: 'service_pattern_scheduled_stop_point_max_fields';
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
};

/** order by max() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointMaxOrderBy = {
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<OrderBy>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<OrderBy>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type ServicePatternScheduledStopPointMinFields = {
  __typename?: 'service_pattern_scheduled_stop_point_min_fields';
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
};

/** order by min() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointMinOrderBy = {
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<OrderBy>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<OrderBy>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<OrderBy>;
};

/** response of any mutation on the table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointMutationResponse = {
  __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ServicePatternScheduledStopPoint>;
};

/** on_conflict condition type for table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointOnConflict = {
  constraint: ServicePatternScheduledStopPointConstraint;
  update_columns?: Array<ServicePatternScheduledStopPointUpdateColumn>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point". */
export type ServicePatternScheduledStopPointOrderBy = {
  closest_point_on_infrastructure_link?: Maybe<OrderBy>;
  direction?: Maybe<OrderBy>;
  label?: Maybe<OrderBy>;
  located_on_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  measured_location?: Maybe<OrderBy>;
  other_label_instances_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  priority?: Maybe<OrderBy>;
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
  scheduled_stop_point_id?: Maybe<OrderBy>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy>;
  timing_place?: Maybe<TimingPatternTimingPlaceOrderBy>;
  timing_place_id?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  vehicle_mode_on_scheduled_stop_point_aggregate?: Maybe<ServicePatternVehicleModeOnScheduledStopPointAggregateOrderBy>;
};

/** primary key columns input for table: service_pattern.scheduled_stop_point */
export type ServicePatternScheduledStopPointPkColumnsInput = {
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id: Scalars['uuid'];
};

/** select columns of table "service_pattern.scheduled_stop_point" */
export enum ServicePatternScheduledStopPointSelectColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  Label = 'label',
  /** column name */
  LocatedOnInfrastructureLinkId = 'located_on_infrastructure_link_id',
  /** column name */
  MeasuredLocation = 'measured_location',
  /** column name */
  Priority = 'priority',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  TimingPlaceId = 'timing_place_id',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
}

/** input type for updating data in table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointSetInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography_point']>;
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
};

/** aggregate stddev on columns */
export type ServicePatternScheduledStopPointStddevFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ServicePatternScheduledStopPointStddevPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevPopOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type ServicePatternScheduledStopPointStddevSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevSampOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** Streaming cursor of the table "service_pattern_scheduled_stop_point" */
export type ServicePatternScheduledStopPointStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ServicePatternScheduledStopPointStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePatternScheduledStopPointStreamCursorValueInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography']>;
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: Maybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: Maybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: Maybe<Scalars['date']>;
};

/** aggregate sum on columns */
export type ServicePatternScheduledStopPointSumFields = {
  __typename?: 'service_pattern_scheduled_stop_point_sum_fields';
  priority?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointSumOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** update columns of table "service_pattern.scheduled_stop_point" */
export enum ServicePatternScheduledStopPointUpdateColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  Label = 'label',
  /** column name */
  LocatedOnInfrastructureLinkId = 'located_on_infrastructure_link_id',
  /** column name */
  MeasuredLocation = 'measured_location',
  /** column name */
  Priority = 'priority',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  TimingPlaceId = 'timing_place_id',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
}

export type ServicePatternScheduledStopPointUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<ServicePatternScheduledStopPointIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<ServicePatternScheduledStopPointSetInput>;
  where: ServicePatternScheduledStopPointBoolExp;
};

/** aggregate var_pop on columns */
export type ServicePatternScheduledStopPointVarPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarPopOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type ServicePatternScheduledStopPointVarSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarSampOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type ServicePatternScheduledStopPointVarianceFields = {
  __typename?: 'service_pattern_scheduled_stop_point_variance_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarianceOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** Which scheduled stop points are serviced by which vehicle modes? */
export type ServicePatternVehicleModeOnScheduledStopPoint = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode: ReusableComponentsVehicleModeEnum;
};

/** aggregated selection of "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointAggregate = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate';
  aggregate?: Maybe<ServicePatternVehicleModeOnScheduledStopPointAggregateFields>;
  nodes: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
};

export type ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExp = {
  count?: Maybe<ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExpCount>;
};

export type ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExpCount =
  {
    arguments?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
    filter?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
    predicate: IntComparisonExp;
  };

/** aggregate fields of "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointAggregateFields = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMaxFields>;
  min?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMinFields>;
};

/** aggregate fields of "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMaxOrderBy>;
  min?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMinOrderBy>;
};

/** input type for inserting array relation for remote table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointArrRelInsertInput = {
  data: Array<ServicePatternVehicleModeOnScheduledStopPointInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
};

/** Boolean expression to filter rows from the table "service_pattern.vehicle_mode_on_scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type ServicePatternVehicleModeOnScheduledStopPointBoolExp = {
  _and?: Maybe<Array<ServicePatternVehicleModeOnScheduledStopPointBoolExp>>;
  _not?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  _or?: Maybe<Array<ServicePatternVehicleModeOnScheduledStopPointBoolExp>>;
  scheduled_stop_point_id?: Maybe<UuidComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnumComparisonExp>;
};

/** unique or primary key constraints on table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export enum ServicePatternVehicleModeOnScheduledStopPointConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_id", "vehicle_mode" */
  ScheduledStopPointServicedByVehicleModePkey = 'scheduled_stop_point_serviced_by_vehicle_mode_pkey',
}

/** input type for inserting data into table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointInsertInput = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
};

/** aggregate max on columns */
export type ServicePatternVehicleModeOnScheduledStopPointMaxFields = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point_max_fields';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointMaxOrderBy = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type ServicePatternVehicleModeOnScheduledStopPointMinFields = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point_min_fields';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointMinOrderBy = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointMutationResponse = {
  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
};

/** on_conflict condition type for table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointOnConflict = {
  constraint: ServicePatternVehicleModeOnScheduledStopPointConstraint;
  update_columns?: Array<ServicePatternVehicleModeOnScheduledStopPointUpdateColumn>;
  where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
};

/** Ordering options when selecting data from "service_pattern.vehicle_mode_on_scheduled_stop_point". */
export type ServicePatternVehicleModeOnScheduledStopPointOrderBy = {
  scheduled_stop_point_id?: Maybe<OrderBy>;
  vehicle_mode?: Maybe<OrderBy>;
};

/** primary key columns input for table: service_pattern.vehicle_mode_on_scheduled_stop_point */
export type ServicePatternVehicleModeOnScheduledStopPointPkColumnsInput = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode: ReusableComponentsVehicleModeEnum;
};

/** select columns of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export enum ServicePatternVehicleModeOnScheduledStopPointSelectColumn {
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  VehicleMode = 'vehicle_mode',
}

/** input type for updating data in table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointSetInput = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
};

/** Streaming cursor of the table "service_pattern_vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ServicePatternVehicleModeOnScheduledStopPointStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePatternVehicleModeOnScheduledStopPointStreamCursorValueInput =
  {
    /** The scheduled stop point that is serviced by the vehicle mode. */
    scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
    /** The vehicle mode servicing the scheduled stop point. */
    vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnum>;
  };

/** update columns of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export enum ServicePatternVehicleModeOnScheduledStopPointUpdateColumn {
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  VehicleMode = 'vehicle_mode',
}

export type ServicePatternVehicleModeOnScheduledStopPointUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
  where: ServicePatternVehicleModeOnScheduledStopPointBoolExp;
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type SmallintComparisonExp = {
  _eq?: Maybe<Scalars['smallint']>;
  _gt?: Maybe<Scalars['smallint']>;
  _gte?: Maybe<Scalars['smallint']>;
  _in?: Maybe<Array<Scalars['smallint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['smallint']>;
  _lte?: Maybe<Scalars['smallint']>;
  _neq?: Maybe<Scalars['smallint']>;
  _nin?: Maybe<Array<Scalars['smallint']>>;
};

export type StDWithinGeographyInput = {
  distance: Scalars['Float'];
  from: Scalars['geography'];
  use_spheroid?: Maybe<Scalars['Boolean']>;
};

export type StDWithinInput = {
  distance: Scalars['Float'];
  from: Scalars['geometry'];
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "hsl_route.transport_target" */
  hsl_route_transport_target: Array<HslRouteTransportTarget>;
  /** fetch aggregated fields from the table: "hsl_route.transport_target" */
  hsl_route_transport_target_aggregate: HslRouteTransportTargetAggregate;
  /** fetch data from the table: "hsl_route.transport_target" using primary key columns */
  hsl_route_transport_target_by_pk?: Maybe<HslRouteTransportTarget>;
  /** fetch data from the table in a streaming manner: "hsl_route.transport_target" */
  hsl_route_transport_target_stream: Array<HslRouteTransportTarget>;
  /** fetch data from the table: "infrastructure_network.direction" */
  infrastructure_network_direction: Array<InfrastructureNetworkDirection>;
  /** fetch aggregated fields from the table: "infrastructure_network.direction" */
  infrastructure_network_direction_aggregate: InfrastructureNetworkDirectionAggregate;
  /** fetch data from the table: "infrastructure_network.direction" using primary key columns */
  infrastructure_network_direction_by_pk?: Maybe<InfrastructureNetworkDirection>;
  /** fetch data from the table in a streaming manner: "infrastructure_network.direction" */
  infrastructure_network_direction_stream: Array<InfrastructureNetworkDirection>;
  /** fetch data from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source: Array<InfrastructureNetworkExternalSource>;
  /** fetch aggregated fields from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source_aggregate: InfrastructureNetworkExternalSourceAggregate;
  /** fetch data from the table: "infrastructure_network.external_source" using primary key columns */
  infrastructure_network_external_source_by_pk?: Maybe<InfrastructureNetworkExternalSource>;
  /** fetch data from the table in a streaming manner: "infrastructure_network.external_source" */
  infrastructure_network_external_source_stream: Array<InfrastructureNetworkExternalSource>;
  /** execute function "infrastructure_network.find_point_direction_on_link" which returns "infrastructure_network.direction" */
  infrastructure_network_find_point_direction_on_link: Array<InfrastructureNetworkDirection>;
  /** execute function "infrastructure_network.find_point_direction_on_link" and query aggregates on result of table type "infrastructure_network.direction" */
  infrastructure_network_find_point_direction_on_link_aggregate: InfrastructureNetworkDirectionAggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link: Array<InfrastructureNetworkInfrastructureLink>;
  /** fetch aggregated fields from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" using primary key columns */
  infrastructure_network_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** fetch data from the table in a streaming manner: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link_stream: Array<InfrastructureNetworkInfrastructureLink>;
  /** execute function "infrastructure_network.resolve_point_to_closest_link" which returns "infrastructure_network.infrastructure_link" */
  infrastructure_network_resolve_point_to_closest_link: Array<InfrastructureNetworkInfrastructureLink>;
  /** execute function "infrastructure_network.resolve_point_to_closest_link" and query aggregates on result of table type "infrastructure_network.infrastructure_link" */
  infrastructure_network_resolve_point_to_closest_link_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** fetch aggregated fields from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" using primary key columns */
  infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** fetch data from the table in a streaming manner: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link_stream: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** execute function "journey_pattern.check_infra_link_stop_refs_with_new_scheduled_stop_point" which returns "journey_pattern.journey_pattern" */
  journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point: Array<JourneyPatternJourneyPattern>;
  /** execute function "journey_pattern.check_infra_link_stop_refs_with_new_scheduled_stop_point" and query aggregates on result of table type "journey_pattern.journey_pattern" */
  journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point_aggregate: JourneyPatternJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern: Array<JourneyPatternJourneyPattern>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern_aggregate: JourneyPatternJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" using primary key columns */
  journey_pattern_journey_pattern_by_pk?: Maybe<JourneyPatternJourneyPattern>;
  /** fetch data from the table in a streaming manner: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern_stream: Array<JourneyPatternJourneyPattern>;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** fetch aggregated fields from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" using primary key columns */
  journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** fetch data from the table in a streaming manner: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern_stream: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** fetch data from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode: Array<ReusableComponentsVehicleMode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode_aggregate: ReusableComponentsVehicleModeAggregate;
  /** fetch data from the table: "reusable_components.vehicle_mode" using primary key columns */
  reusable_components_vehicle_mode_by_pk?: Maybe<ReusableComponentsVehicleMode>;
  /** fetch data from the table in a streaming manner: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode_stream: Array<ReusableComponentsVehicleMode>;
  /** fetch data from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode: Array<ReusableComponentsVehicleSubmode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode_aggregate: ReusableComponentsVehicleSubmodeAggregate;
  /** fetch data from the table: "reusable_components.vehicle_submode" using primary key columns */
  reusable_components_vehicle_submode_by_pk?: Maybe<ReusableComponentsVehicleSubmode>;
  /** fetch data from the table in a streaming manner: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode_stream: Array<ReusableComponentsVehicleSubmode>;
  /** fetch data from the table: "route.direction" */
  route_direction: Array<RouteDirection>;
  /** fetch aggregated fields from the table: "route.direction" */
  route_direction_aggregate: RouteDirectionAggregate;
  /** fetch data from the table: "route.direction" using primary key columns */
  route_direction_by_pk?: Maybe<RouteDirection>;
  /** fetch data from the table in a streaming manner: "route.direction" */
  route_direction_stream: Array<RouteDirection>;
  /** fetch data from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route: Array<RouteInfrastructureLinkAlongRoute>;
  /** fetch aggregated fields from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  /** fetch data from the table: "route.infrastructure_link_along_route" using primary key columns */
  route_infrastructure_link_along_route_by_pk?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** fetch data from the table in a streaming manner: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route_stream: Array<RouteInfrastructureLinkAlongRoute>;
  /** fetch data from the table: "route.line" */
  route_line: Array<RouteLine>;
  /** fetch aggregated fields from the table: "route.line" */
  route_line_aggregate: RouteLineAggregate;
  /** fetch data from the table: "route.line" using primary key columns */
  route_line_by_pk?: Maybe<RouteLine>;
  /** fetch data from the table in a streaming manner: "route.line" */
  route_line_stream: Array<RouteLine>;
  /** fetch data from the table: "route.route" */
  route_route: Array<RouteRoute>;
  /** fetch aggregated fields from the table: "route.route" */
  route_route_aggregate: RouteRouteAggregate;
  /** fetch data from the table: "route.route" using primary key columns */
  route_route_by_pk?: Maybe<RouteRoute>;
  /** fetch data from the table in a streaming manner: "route.route" */
  route_route_stream: Array<RouteRoute>;
  /** fetch data from the table: "route.type_of_line" */
  route_type_of_line: Array<RouteTypeOfLine>;
  /** fetch aggregated fields from the table: "route.type_of_line" */
  route_type_of_line_aggregate: RouteTypeOfLineAggregate;
  /** fetch data from the table: "route.type_of_line" using primary key columns */
  route_type_of_line_by_pk?: Maybe<RouteTypeOfLine>;
  /** fetch data from the table in a streaming manner: "route.type_of_line" */
  route_type_of_line_stream: Array<RouteTypeOfLine>;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point: Array<ServicePatternScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point_aggregate: ServicePatternScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" using primary key columns */
  service_pattern_scheduled_stop_point_by_pk?: Maybe<ServicePatternScheduledStopPoint>;
  /** fetch data from the table in a streaming manner: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point_stream: Array<ServicePatternScheduledStopPoint>;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" using primary key columns */
  service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** fetch data from the table in a streaming manner: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point_stream: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  timetables?: Maybe<TimetablesTimetablesSubscription>;
  /** fetch data from the table: "timing_pattern.timing_place" */
  timing_pattern_timing_place: Array<TimingPatternTimingPlace>;
  /** fetch aggregated fields from the table: "timing_pattern.timing_place" */
  timing_pattern_timing_place_aggregate: TimingPatternTimingPlaceAggregate;
  /** fetch data from the table: "timing_pattern.timing_place" using primary key columns */
  timing_pattern_timing_place_by_pk?: Maybe<TimingPatternTimingPlace>;
  /** fetch data from the table in a streaming manner: "timing_pattern.timing_place" */
  timing_pattern_timing_place_stream: Array<TimingPatternTimingPlace>;
};

export type SubscriptionRootHslRouteTransportTargetArgs = {
  distinct_on?: Maybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootHslRouteTransportTargetAggregateArgs = {
  distinct_on?: Maybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootHslRouteTransportTargetByPkArgs = {
  transport_target: Scalars['String'];
};

export type SubscriptionRootHslRouteTransportTargetStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<HslRouteTransportTargetStreamCursorInput>>;
  where?: Maybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionAggregateArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionByPkArgs = {
  value: Scalars['String'];
};

export type SubscriptionRootInfrastructureNetworkDirectionStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<InfrastructureNetworkDirectionStreamCursorInput>>;
  where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceAggregateArgs = {
  distinct_on?: Maybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceByPkArgs = {
  value: Scalars['String'];
};

export type SubscriptionRootInfrastructureNetworkExternalSourceStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<InfrastructureNetworkExternalSourceStreamCursorInput>>;
  where?: Maybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkFindPointDirectionOnLinkArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkFindPointDirectionOnLinkAggregateArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: Maybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: Maybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkByPkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<InfrastructureNetworkInfrastructureLinkStreamCursorInput>
    >;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkResolvePointToClosestLinkArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: Maybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkResolvePointToClosestLinkAggregateArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: Maybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
    where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    infrastructure_link_id: Scalars['uuid'];
    vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorInput>
    >;
    where?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointAggregateArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternJourneyPatternArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternJourneyPatternAggregateArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternJourneyPatternByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
};

export type SubscriptionRootJourneyPatternJourneyPatternStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<JourneyPatternJourneyPatternStreamCursorInput>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    scheduled_stop_point_sequence: Scalars['Int'];
  };

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<JourneyPatternScheduledStopPointInJourneyPatternStreamCursorInput>
    >;
    where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type SubscriptionRootReusableComponentsVehicleModeArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleModeAggregateArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleModeByPkArgs = {
  vehicle_mode: Scalars['String'];
};

export type SubscriptionRootReusableComponentsVehicleModeStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<ReusableComponentsVehicleModeStreamCursorInput>>;
  where?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeAggregateArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeByPkArgs = {
  vehicle_submode: Scalars['String'];
};

export type SubscriptionRootReusableComponentsVehicleSubmodeStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<ReusableComponentsVehicleSubmodeStreamCursorInput>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootRouteDirectionArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteDirectionAggregateArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteDirectionByPkArgs = {
  direction: Scalars['String'];
};

export type SubscriptionRootRouteDirectionStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<RouteDirectionStreamCursorInput>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteByPkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<RouteInfrastructureLinkAlongRouteStreamCursorInput>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteLineArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteLineAggregateArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteLineByPkArgs = {
  line_id: Scalars['uuid'];
};

export type SubscriptionRootRouteLineStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<RouteLineStreamCursorInput>>;
  where?: Maybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteRouteArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteRouteByPkArgs = {
  route_id: Scalars['uuid'];
};

export type SubscriptionRootRouteRouteStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<RouteRouteStreamCursorInput>>;
  where?: Maybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineArgs = {
  distinct_on?: Maybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteTypeOfLineOrderBy>>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineAggregateArgs = {
  distinct_on?: Maybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteTypeOfLineOrderBy>>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineByPkArgs = {
  type_of_line: Scalars['String'];
};

export type SubscriptionRootRouteTypeOfLineStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<RouteTypeOfLineStreamCursorInput>>;
  where?: Maybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootServicePatternScheduledStopPointArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternScheduledStopPointAggregateArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
};

export type SubscriptionRootServicePatternScheduledStopPointStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<ServicePatternScheduledStopPointStreamCursorInput>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    distinct_on?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointByPkArgs =
  {
    scheduled_stop_point_id: Scalars['uuid'];
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  };

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<ServicePatternVehicleModeOnScheduledStopPointStreamCursorInput>
    >;
    where?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type SubscriptionRootTimingPatternTimingPlaceArgs = {
  distinct_on?: Maybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

export type SubscriptionRootTimingPatternTimingPlaceAggregateArgs = {
  distinct_on?: Maybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

export type SubscriptionRootTimingPatternTimingPlaceByPkArgs = {
  timing_place_id: Scalars['uuid'];
};

export type SubscriptionRootTimingPatternTimingPlaceStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<Maybe<TimingPatternTimingPlaceStreamCursorInput>>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** ordering argument of a cursor */
export enum TimetablesCursorOrdering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRef = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref';
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id: Scalars['uuid'];
  journey_pattern_instance?: Maybe<JourneyPatternJourneyPattern>;
  journey_pattern_ref_id: Scalars['uuid'];
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp: Scalars['timestamptz'];
  /** An array relationship */
  scheduled_stop_point_in_journey_pattern_refs: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_pattern_refs_aggregate: TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregate;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp: Scalars['timestamptz'];
  /** An array relationship */
  vehicle_journeys: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** An aggregate relationship */
  vehicle_journeys_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
};

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefScheduledStopPointInJourneyPatternRefsArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefScheduledStopPointInJourneyPatternRefsAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefVehicleJourneysArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefVehicleJourneysAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

/** aggregated selection of "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefAggregate = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref_aggregate';
  aggregate?: Maybe<TimetablesJourneyPatternJourneyPatternRefAggregateFields>;
  nodes: Array<TimetablesJourneyPatternJourneyPatternRef>;
};

/** aggregate fields of "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefAggregateFields = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesJourneyPatternJourneyPatternRefMaxFields>;
  min?: Maybe<TimetablesJourneyPatternJourneyPatternRefMinFields>;
};

/** aggregate fields of "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** Boolean expression to filter rows from the table "journey_pattern.journey_pattern_ref". All fields are combined with a logical 'AND'. */
export type TimetablesJourneyPatternJourneyPatternRefBoolExp = {
  _and?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefBoolExp>>;
  _not?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  _or?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefBoolExp>>;
  journey_pattern_id?: Maybe<UuidComparisonExp>;
  journey_pattern_ref_id?: Maybe<UuidComparisonExp>;
  observation_timestamp?: Maybe<TimestamptzComparisonExp>;
  scheduled_stop_point_in_journey_pattern_refs?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  scheduled_stop_point_in_journey_pattern_refs_aggregate?: Maybe<ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExp>;
  snapshot_timestamp?: Maybe<TimestamptzComparisonExp>;
  vehicle_journeys?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journeys_aggregate?: Maybe<VehicleJourneyVehicleJourneyAggregateBoolExp>;
};

/** unique or primary key constraints on table "journey_pattern.journey_pattern_ref" */
export enum TimetablesJourneyPatternJourneyPatternRefConstraint {
  /** unique or primary key constraint on columns "journey_pattern_ref_id" */
  JourneyPatternRefPkey = 'journey_pattern_ref_pkey',
}

/** input type for inserting data into table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefInsertInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: Maybe<Scalars['timestamptz']>;
  scheduled_stop_point_in_journey_pattern_refs?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefArrRelInsertInput>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: Maybe<Scalars['timestamptz']>;
  vehicle_journeys?: Maybe<TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput>;
};

/** aggregate max on columns */
export type TimetablesJourneyPatternJourneyPatternRefMaxFields = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref_max_fields';
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: Maybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type TimetablesJourneyPatternJourneyPatternRefMinFields = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref_min_fields';
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: Maybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefMutationResponse = {
  __typename?: 'timetables_journey_pattern_journey_pattern_ref_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesJourneyPatternJourneyPatternRef>;
};

/** input type for inserting object relation for remote table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefObjRelInsertInput = {
  data: TimetablesJourneyPatternJourneyPatternRefInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
};

/** on_conflict condition type for table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefOnConflict = {
  constraint: TimetablesJourneyPatternJourneyPatternRefConstraint;
  update_columns?: Array<TimetablesJourneyPatternJourneyPatternRefUpdateColumn>;
  where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.journey_pattern_ref". */
export type TimetablesJourneyPatternJourneyPatternRefOrderBy = {
  journey_pattern_id?: Maybe<OrderBy>;
  journey_pattern_ref_id?: Maybe<OrderBy>;
  observation_timestamp?: Maybe<OrderBy>;
  scheduled_stop_point_in_journey_pattern_refs_aggregate?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateOrderBy>;
  snapshot_timestamp?: Maybe<OrderBy>;
  vehicle_journeys_aggregate?: Maybe<TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy>;
};

/** primary key columns input for table: journey_pattern.journey_pattern_ref */
export type TimetablesJourneyPatternJourneyPatternRefPkColumnsInput = {
  journey_pattern_ref_id: Scalars['uuid'];
};

/** select columns of table "journey_pattern.journey_pattern_ref" */
export enum TimetablesJourneyPatternJourneyPatternRefSelectColumn {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  ObservationTimestamp = 'observation_timestamp',
  /** column name */
  SnapshotTimestamp = 'snapshot_timestamp',
}

/** input type for updating data in table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefSetInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: Maybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: Maybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "journey_pattern_journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesJourneyPatternJourneyPatternRefStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesJourneyPatternJourneyPatternRefStreamCursorValueInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: Maybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "journey_pattern.journey_pattern_ref" */
export enum TimetablesJourneyPatternJourneyPatternRefUpdateColumn {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  ObservationTimestamp = 'observation_timestamp',
  /** column name */
  SnapshotTimestamp = 'snapshot_timestamp',
}

export type TimetablesJourneyPatternJourneyPatternRefUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
  where: TimetablesJourneyPatternJourneyPatternRefBoolExp;
};

/** Long-term planned time data concerning public transport vehicles passing a particular POINT IN JOURNEY PATTERN on a specified VEHICLE JOURNEY for a certain DAY TYPE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:4:946  */
export type TimetablesPassingTimesTimetabledPassingTime = {
  __typename?: 'timetables_passing_times_timetabled_passing_time';
  /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
  arrival_time?: Maybe<Scalars['interval']>;
  /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
  departure_time?: Maybe<Scalars['interval']>;
  /** The time when the vehicle can be considered as passing a SCHEDULED STOP POINT. Computed field to ease development; it can never be NULL. */
  passing_time: Scalars['interval'];
  /** An object relationship */
  scheduled_stop_point_in_journey_pattern_ref: TimetablesServicePatternScheduledStopPointInJourneyPatternRef;
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  timetabled_passing_time_id: Scalars['uuid'];
  /** An object relationship */
  vehicle_journey: TimetablesVehicleJourneyVehicleJourney;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id: Scalars['uuid'];
};

/** aggregated selection of "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeAggregate = {
  __typename?: 'timetables_passing_times_timetabled_passing_time_aggregate';
  aggregate?: Maybe<TimetablesPassingTimesTimetabledPassingTimeAggregateFields>;
  nodes: Array<TimetablesPassingTimesTimetabledPassingTime>;
};

/** aggregate fields of "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeAggregateFields = {
  __typename?: 'timetables_passing_times_timetabled_passing_time_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMaxFields>;
  min?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMinFields>;
};

/** aggregate fields of "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMaxOrderBy>;
  min?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMinOrderBy>;
};

/** input type for inserting array relation for remote table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput = {
  data: Array<TimetablesPassingTimesTimetabledPassingTimeInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
};

/** Boolean expression to filter rows from the table "passing_times.timetabled_passing_time". All fields are combined with a logical 'AND'. */
export type TimetablesPassingTimesTimetabledPassingTimeBoolExp = {
  _and?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeBoolExp>>;
  _not?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  _or?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeBoolExp>>;
  arrival_time?: Maybe<IntervalComparisonExp>;
  departure_time?: Maybe<IntervalComparisonExp>;
  passing_time?: Maybe<IntervalComparisonExp>;
  scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<UuidComparisonExp>;
  timetabled_passing_time_id?: Maybe<UuidComparisonExp>;
  vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journey_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "passing_times.timetabled_passing_time" */
export enum TimetablesPassingTimesTimetabledPassingTimeConstraint {
  /** unique or primary key constraint on columns "timetabled_passing_time_id" */
  TimetabledPassingTimePkey = 'timetabled_passing_time_pkey',
}

/** input type for inserting data into table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeInsertInput = {
  /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
  arrival_time?: Maybe<Scalars['interval']>;
  /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
  departure_time?: Maybe<Scalars['interval']>;
  scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefObjRelInsertInput>;
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  timetabled_passing_time_id?: Maybe<Scalars['uuid']>;
  vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyObjRelInsertInput>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesPassingTimesTimetabledPassingTimeMaxFields = {
  __typename?: 'timetables_passing_times_timetabled_passing_time_max_fields';
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  timetabled_passing_time_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeMaxOrderBy = {
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
  timetabled_passing_time_id?: Maybe<OrderBy>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesPassingTimesTimetabledPassingTimeMinFields = {
  __typename?: 'timetables_passing_times_timetabled_passing_time_min_fields';
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  timetabled_passing_time_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeMinOrderBy = {
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
  timetabled_passing_time_id?: Maybe<OrderBy>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeMutationResponse = {
  __typename?: 'timetables_passing_times_timetabled_passing_time_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesPassingTimesTimetabledPassingTime>;
};

/** on_conflict condition type for table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeOnConflict = {
  constraint: TimetablesPassingTimesTimetabledPassingTimeConstraint;
  update_columns?: Array<TimetablesPassingTimesTimetabledPassingTimeUpdateColumn>;
  where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
};

/** Ordering options when selecting data from "passing_times.timetabled_passing_time". */
export type TimetablesPassingTimesTimetabledPassingTimeOrderBy = {
  arrival_time?: Maybe<OrderBy>;
  departure_time?: Maybe<OrderBy>;
  passing_time?: Maybe<OrderBy>;
  scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>;
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
  timetabled_passing_time_id?: Maybe<OrderBy>;
  vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyOrderBy>;
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: passing_times.timetabled_passing_time */
export type TimetablesPassingTimesTimetabledPassingTimePkColumnsInput = {
  timetabled_passing_time_id: Scalars['uuid'];
};

/** select columns of table "passing_times.timetabled_passing_time" */
export enum TimetablesPassingTimesTimetabledPassingTimeSelectColumn {
  /** column name */
  ArrivalTime = 'arrival_time',
  /** column name */
  DepartureTime = 'departure_time',
  /** column name */
  PassingTime = 'passing_time',
  /** column name */
  ScheduledStopPointInJourneyPatternRefId = 'scheduled_stop_point_in_journey_pattern_ref_id',
  /** column name */
  TimetabledPassingTimeId = 'timetabled_passing_time_id',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

/** input type for updating data in table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeSetInput = {
  /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
  arrival_time?: Maybe<Scalars['interval']>;
  /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
  departure_time?: Maybe<Scalars['interval']>;
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  timetabled_passing_time_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "passing_times_timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesPassingTimesTimetabledPassingTimeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesPassingTimesTimetabledPassingTimeStreamCursorValueInput =
  {
    /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
    arrival_time?: Maybe<Scalars['interval']>;
    /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
    departure_time?: Maybe<Scalars['interval']>;
    /** The time when the vehicle can be considered as passing a SCHEDULED STOP POINT. Computed field to ease development; it can never be NULL. */
    passing_time?: Maybe<Scalars['interval']>;
    /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    timetabled_passing_time_id?: Maybe<Scalars['uuid']>;
    /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
    vehicle_journey_id?: Maybe<Scalars['uuid']>;
  };

/** update columns of table "passing_times.timetabled_passing_time" */
export enum TimetablesPassingTimesTimetabledPassingTimeUpdateColumn {
  /** column name */
  ArrivalTime = 'arrival_time',
  /** column name */
  DepartureTime = 'departure_time',
  /** column name */
  ScheduledStopPointInJourneyPatternRefId = 'scheduled_stop_point_in_journey_pattern_ref_id',
  /** column name */
  TimetabledPassingTimeId = 'timetabled_passing_time_id',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

export type TimetablesPassingTimesTimetabledPassingTimeUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
  where: TimetablesPassingTimesTimetabledPassingTimeBoolExp;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayType = {
  __typename?: 'timetables_service_calendar_day_type';
  /** An array relationship */
  active_on_days_of_week: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** An aggregate relationship */
  active_on_days_of_week_aggregate: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregate;
  day_type_id: Scalars['uuid'];
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label: Scalars['String'];
  /** Human-readable name for the DAY TYPE */
  name_i18n: Scalars['jsonb'];
  /** An array relationship */
  vehicle_services: Array<TimetablesVehicleServiceVehicleService>;
  /** An aggregate relationship */
  vehicle_services_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeActiveOnDaysOfWeekArgs = {
  distinct_on?: Maybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
  >;
  where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeActiveOnDaysOfWeekAggregateArgs = {
  distinct_on?: Maybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
  >;
  where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeVehicleServicesArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeVehicleServicesAggregateArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** Tells on which days of week a particular DAY TYPE is active */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeek = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week: Scalars['Int'];
  /** An object relationship */
  day_type: TimetablesServiceCalendarDayType;
  /** The DAY TYPE for which we define the activeness */
  day_type_id: Scalars['uuid'];
};

/** aggregated selection of "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregate = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_aggregate';
  aggregate?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateFields>;
  nodes: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
};

/** aggregate fields of "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_aggregate_fields';
  avg?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMaxFields>;
  min?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMinFields>;
  stddev?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevFields>;
  stddev_pop?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevPopFields>;
  stddev_samp?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevSampFields>;
  sum?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSumFields>;
  var_pop?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarPopFields>;
  var_samp?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarSampFields>;
  variance?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarianceFields>;
};

/** aggregate fields of "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateOrderBy =
  {
    avg?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAvgOrderBy>;
    count?: Maybe<OrderBy>;
    max?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMaxOrderBy>;
    min?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMinOrderBy>;
    stddev?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevOrderBy>;
    stddev_pop?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevPopOrderBy>;
    stddev_samp?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevSampOrderBy>;
    sum?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSumOrderBy>;
    var_pop?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarPopOrderBy>;
    var_samp?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarSampOrderBy>;
    variance?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarianceOrderBy>;
  };

/** input type for inserting array relation for remote table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekArrRelInsertInput =
  {
    data: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput>;
    /** upsert condition */
    on_conflict?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
  };

/** aggregate avg on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAvgFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_avg_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAvgOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_calendar.day_type_active_on_day_of_week". All fields are combined with a logical 'AND'. */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp = {
  _and?: Maybe<Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>>;
  _not?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  _or?: Maybe<Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>>;
  day_of_week?: Maybe<IntComparisonExp>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  day_type_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "service_calendar.day_type_active_on_day_of_week" */
export enum TimetablesServiceCalendarDayTypeActiveOnDayOfWeekConstraint {
  /** unique or primary key constraint on columns "day_type_id", "day_of_week" */
  DayTypeActiveOnDayOfWeekPkey = 'day_type_active_on_day_of_week_pkey',
}

/** input type for incrementing numeric columns in table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeObjRelInsertInput>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMaxFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_max_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMaxOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMinFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_min_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMinOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMutationResponse =
  {
    __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: Scalars['Int'];
    /** data from the rows affected by the mutation */
    returning: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  };

/** on_conflict condition type for table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict = {
  constraint: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekConstraint;
  update_columns?: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekUpdateColumn>;
  where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** Ordering options when selecting data from "service_calendar.day_type_active_on_day_of_week". */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy = {
  day_of_week?: Maybe<OrderBy>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeOrderBy>;
  day_type_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: service_calendar.day_type_active_on_day_of_week */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekPkColumnsInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week: Scalars['Int'];
  /** The DAY TYPE for which we define the activeness */
  day_type_id: Scalars['uuid'];
};

/** select columns of table "service_calendar.day_type_active_on_day_of_week" */
export enum TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn {
  /** column name */
  DayOfWeek = 'day_of_week',
  /** column name */
  DayTypeId = 'day_type_id',
}

/** input type for updating data in table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: Maybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_stddev_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevPopFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_stddev_pop_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevPopOrderBy =
  {
    /** ISO week day definition (1 = Monday, 7 = Sunday) */
    day_of_week?: Maybe<OrderBy>;
  };

/** aggregate stddev_samp on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevSampFields =
  {
    __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_stddev_samp_fields';
    /** ISO week day definition (1 = Monday, 7 = Sunday) */
    day_of_week?: Maybe<Scalars['Float']>;
  };

/** order by stddev_samp() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevSampOrderBy =
  {
    /** ISO week day definition (1 = Monday, 7 = Sunday) */
    day_of_week?: Maybe<OrderBy>;
  };

/** Streaming cursor of the table "service_calendar_day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorValueInput;
    /** cursor ordering */
    ordering?: Maybe<TimetablesCursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorValueInput =
  {
    /** ISO week day definition (1 = Monday, 7 = Sunday) */
    day_of_week?: Maybe<Scalars['Int']>;
    /** The DAY TYPE for which we define the activeness */
    day_type_id?: Maybe<Scalars['uuid']>;
  };

/** aggregate sum on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSumFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_sum_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSumOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** update columns of table "service_calendar.day_type_active_on_day_of_week" */
export enum TimetablesServiceCalendarDayTypeActiveOnDayOfWeekUpdateColumn {
  /** column name */
  DayOfWeek = 'day_of_week',
  /** column name */
  DayTypeId = 'day_type_id',
}

export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
  where: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp;
};

/** aggregate var_pop on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarPopFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_var_pop_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarPopOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarSampFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_var_samp_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarSampOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarianceFields = {
  __typename?: 'timetables_service_calendar_day_type_active_on_day_of_week_variance_fields';
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarianceOrderBy = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: Maybe<OrderBy>;
};

/** aggregated selection of "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeAggregate = {
  __typename?: 'timetables_service_calendar_day_type_aggregate';
  aggregate?: Maybe<TimetablesServiceCalendarDayTypeAggregateFields>;
  nodes: Array<TimetablesServiceCalendarDayType>;
};

/** aggregate fields of "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeAggregateFields = {
  __typename?: 'timetables_service_calendar_day_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesServiceCalendarDayTypeMaxFields>;
  min?: Maybe<TimetablesServiceCalendarDayTypeMinFields>;
};

/** aggregate fields of "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesServiceCalendarDayTypeAppendInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "service_calendar.day_type". All fields are combined with a logical 'AND'. */
export type TimetablesServiceCalendarDayTypeBoolExp = {
  _and?: Maybe<Array<TimetablesServiceCalendarDayTypeBoolExp>>;
  _not?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  _or?: Maybe<Array<TimetablesServiceCalendarDayTypeBoolExp>>;
  active_on_days_of_week?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  active_on_days_of_week_aggregate?: Maybe<ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExp>;
  day_type_id?: Maybe<UuidComparisonExp>;
  label?: Maybe<StringComparisonExp>;
  name_i18n?: Maybe<JsonbComparisonExp>;
  vehicle_services?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_services_aggregate?: Maybe<VehicleServiceVehicleServiceAggregateBoolExp>;
};

/** unique or primary key constraints on table "service_calendar.day_type" */
export enum TimetablesServiceCalendarDayTypeConstraint {
  /** unique or primary key constraint on columns "day_type_id" */
  DayTypePkey = 'day_type_pkey',
  /** unique or primary key constraint on columns "label" */
  ServiceCalendarDayTypeLabelIdx = 'service_calendar_day_type_label_idx',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesServiceCalendarDayTypeDeleteAtPathInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesServiceCalendarDayTypeDeleteElemInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesServiceCalendarDayTypeDeleteKeyInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['String']>;
};

/** input type for inserting data into table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeInsertInput = {
  active_on_days_of_week?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekArrRelInsertInput>;
  day_type_id?: Maybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: Maybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['jsonb']>;
  vehicle_services?: Maybe<TimetablesVehicleServiceVehicleServiceArrRelInsertInput>;
};

/** aggregate max on columns */
export type TimetablesServiceCalendarDayTypeMaxFields = {
  __typename?: 'timetables_service_calendar_day_type_max_fields';
  day_type_id?: Maybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type TimetablesServiceCalendarDayTypeMinFields = {
  __typename?: 'timetables_service_calendar_day_type_min_fields';
  day_type_id?: Maybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeMutationResponse = {
  __typename?: 'timetables_service_calendar_day_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesServiceCalendarDayType>;
};

/** input type for inserting object relation for remote table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeObjRelInsertInput = {
  data: TimetablesServiceCalendarDayTypeInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesServiceCalendarDayTypeOnConflict>;
};

/** on_conflict condition type for table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeOnConflict = {
  constraint: TimetablesServiceCalendarDayTypeConstraint;
  update_columns?: Array<TimetablesServiceCalendarDayTypeUpdateColumn>;
  where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
};

/** Ordering options when selecting data from "service_calendar.day_type". */
export type TimetablesServiceCalendarDayTypeOrderBy = {
  active_on_days_of_week_aggregate?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateOrderBy>;
  day_type_id?: Maybe<OrderBy>;
  label?: Maybe<OrderBy>;
  name_i18n?: Maybe<OrderBy>;
  vehicle_services_aggregate?: Maybe<TimetablesVehicleServiceVehicleServiceAggregateOrderBy>;
};

/** primary key columns input for table: service_calendar.day_type */
export type TimetablesServiceCalendarDayTypePkColumnsInput = {
  day_type_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesServiceCalendarDayTypePrependInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "service_calendar.day_type" */
export enum TimetablesServiceCalendarDayTypeSelectColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  Label = 'label',
  /** column name */
  NameI18n = 'name_i18n',
}

/** input type for updating data in table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeSetInput = {
  day_type_id?: Maybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: Maybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** Streaming cursor of the table "service_calendar_day_type" */
export type TimetablesServiceCalendarDayTypeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesServiceCalendarDayTypeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesServiceCalendarDayTypeStreamCursorValueInput = {
  day_type_id?: Maybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: Maybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** update columns of table "service_calendar.day_type" */
export enum TimetablesServiceCalendarDayTypeUpdateColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  Label = 'label',
  /** column name */
  NameI18n = 'name_i18n',
}

export type TimetablesServiceCalendarDayTypeUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<TimetablesServiceCalendarDayTypeAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<TimetablesServiceCalendarDayTypePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesServiceCalendarDayTypeSetInput>;
  where: TimetablesServiceCalendarDayTypeBoolExp;
};

export type TimetablesServiceCalendarGetActiveDayTypesForDateArgs = {
  observation_date?: Maybe<Scalars['date']>;
};

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRef = {
  __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
  /** An object relationship */
  journey_pattern_ref: TimetablesJourneyPatternJourneyPatternRef;
  /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
  journey_pattern_ref_id: Scalars['uuid'];
  scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  /** The label of the SCHEDULED STOP POINT */
  scheduled_stop_point_label: Scalars['String'];
  /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
  scheduled_stop_point_sequence: Scalars['Int'];
  /** An array relationship */
  timetabled_passing_times: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** An aggregate relationship */
  timetabled_passing_times_aggregate: TimetablesPassingTimesTimetabledPassingTimeAggregate;
};

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefTimetabledPassingTimesArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefTimetabledPassingTimesAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

/** aggregated selection of "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregate =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_aggregate';
    aggregate?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateFields>;
    nodes: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  };

/** aggregate fields of "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_aggregate_fields';
    avg?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAvgFields>;
    count: Scalars['Int'];
    max?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMaxFields>;
    min?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMinFields>;
    stddev?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevFields>;
    stddev_pop?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevPopFields>;
    stddev_samp?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevSampFields>;
    sum?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSumFields>;
    var_pop?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarPopFields>;
    var_samp?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarSampFields>;
    variance?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarianceFields>;
  };

/** aggregate fields of "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateOrderBy =
  {
    avg?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAvgOrderBy>;
    count?: Maybe<OrderBy>;
    max?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMaxOrderBy>;
    min?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMinOrderBy>;
    stddev?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevOrderBy>;
    stddev_pop?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevPopOrderBy>;
    stddev_samp?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevSampOrderBy>;
    sum?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSumOrderBy>;
    var_pop?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarPopOrderBy>;
    var_samp?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarSampOrderBy>;
    variance?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarianceOrderBy>;
  };

/** input type for inserting array relation for remote table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefArrRelInsertInput =
  {
    data: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput>;
    /** upsert condition */
    on_conflict?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

/** aggregate avg on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAvgFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_avg_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by avg() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAvgOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point_in_journey_pattern_ref". All fields are combined with a logical 'AND'. */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp =
  {
    _and?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>
    >;
    _not?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
    _or?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>
    >;
    journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
    journey_pattern_ref_id?: Maybe<UuidComparisonExp>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<UuidComparisonExp>;
    scheduled_stop_point_label?: Maybe<StringComparisonExp>;
    scheduled_stop_point_sequence?: Maybe<IntComparisonExp>;
    timetabled_passing_times?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
    timetabled_passing_times_aggregate?: Maybe<PassingTimesTimetabledPassingTimeAggregateBoolExp>;
  };

/** unique or primary key constraints on table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export enum TimetablesServicePatternScheduledStopPointInJourneyPatternRefConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_in_journey_pattern_ref_id" */
  ScheduledStopPointInJourneyPatternRefPkey = 'scheduled_stop_point_in_journey_pattern_ref_pkey',
  /** unique or primary key constraint on columns "scheduled_stop_point_sequence", "journey_pattern_ref_id" */
  ServicePatternScheduledStopPointInJourneyPatternRefIdx = 'service_pattern_scheduled_stop_point_in_journey_pattern_ref_idx',
}

/** input type for incrementing numeric columns in table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** input type for inserting data into table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput =
  {
    journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefObjRelInsertInput>;
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
    timetabled_passing_times?: Maybe<TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput>;
  };

/** aggregate max on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefMaxFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_max_fields';
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** order by max() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefMaxOrderBy =
  {
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<OrderBy>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** aggregate min on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefMinFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_min_fields';
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** order by min() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefMinOrderBy =
  {
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<OrderBy>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** response of any mutation on the table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefMutationResponse =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: Scalars['Int'];
    /** data from the rows affected by the mutation */
    returning: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  };

/** input type for inserting object relation for remote table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefObjRelInsertInput =
  {
    data: TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput;
    /** upsert condition */
    on_conflict?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

/** on_conflict condition type for table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict =
  {
    constraint: TimetablesServicePatternScheduledStopPointInJourneyPatternRefConstraint;
    update_columns?: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdateColumn>;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point_in_journey_pattern_ref". */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy =
  {
    journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefOrderBy>;
    journey_pattern_ref_id?: Maybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<OrderBy>;
    scheduled_stop_point_label?: Maybe<OrderBy>;
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
    timetabled_passing_times_aggregate?: Maybe<TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy>;
  };

/** primary key columns input for table: service_pattern.scheduled_stop_point_in_journey_pattern_ref */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefPkColumnsInput =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

/** select columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export enum TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn {
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  ScheduledStopPointInJourneyPatternRefId = 'scheduled_stop_point_in_journey_pattern_ref_id',
  /** column name */
  ScheduledStopPointLabel = 'scheduled_stop_point_label',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence',
}

/** input type for updating data in table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput =
  {
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** aggregate stddev on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_stddev_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by stddev() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** aggregate stddev_pop on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevPopFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_stddev_pop_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by stddev_pop() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevPopOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** aggregate stddev_samp on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevSampFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_stddev_samp_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by stddev_samp() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevSampOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** Streaming cursor of the table "service_pattern_scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorValueInput;
    /** cursor ordering */
    ordering?: Maybe<TimetablesCursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorValueInput =
  {
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: Maybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** aggregate sum on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefSumFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_sum_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
  };

/** order by sum() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefSumOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** update columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export enum TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdateColumn {
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  ScheduledStopPointInJourneyPatternRefId = 'scheduled_stop_point_in_journey_pattern_ref_id',
  /** column name */
  ScheduledStopPointLabel = 'scheduled_stop_point_label',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence',
}

export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdates =
  {
    /** increments the numeric columns with given value of the filtered values */
    _inc?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    /** sets the columns of the filtered rows to the given values */
    _set?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    where: TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp;
  };

/** aggregate var_pop on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarPopFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_var_pop_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by var_pop() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarPopOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** aggregate var_samp on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarSampFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_var_samp_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by var_samp() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarSampOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

/** aggregate variance on columns */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarianceFields =
  {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_variance_fields';
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
  };

/** order by variance() on columns of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarianceOrderBy =
  {
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: Maybe<OrderBy>;
  };

export type TimetablesTimetablesMutationFrontend = {
  __typename?: 'timetables_timetables_mutation_frontend';
  /** delete data from the table: "journey_pattern.journey_pattern_ref" */
  timetables_delete_journey_pattern_journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefMutationResponse>;
  /** delete single row from the table: "journey_pattern.journey_pattern_ref" */
  timetables_delete_journey_pattern_journey_pattern_ref_by_pk?: Maybe<TimetablesJourneyPatternJourneyPatternRef>;
  /** delete data from the table: "passing_times.timetabled_passing_time" */
  timetables_delete_passing_times_timetabled_passing_time?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMutationResponse>;
  /** delete single row from the table: "passing_times.timetabled_passing_time" */
  timetables_delete_passing_times_timetabled_passing_time_by_pk?: Maybe<TimetablesPassingTimesTimetabledPassingTime>;
  /** delete data from the table: "service_calendar.day_type" */
  timetables_delete_service_calendar_day_type?: Maybe<TimetablesServiceCalendarDayTypeMutationResponse>;
  /** delete data from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_delete_service_calendar_day_type_active_on_day_of_week?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMutationResponse>;
  /** delete single row from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_delete_service_calendar_day_type_active_on_day_of_week_by_pk?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** delete single row from the table: "service_calendar.day_type" */
  timetables_delete_service_calendar_day_type_by_pk?: Maybe<TimetablesServiceCalendarDayType>;
  /** delete data from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_delete_service_pattern_scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMutationResponse>;
  /** delete single row from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_delete_service_pattern_scheduled_stop_point_in_journey_pattern_ref_by_pk?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** delete data from the table: "vehicle_journey.vehicle_journey" */
  timetables_delete_vehicle_journey_vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyMutationResponse>;
  /** delete single row from the table: "vehicle_journey.vehicle_journey" */
  timetables_delete_vehicle_journey_vehicle_journey_by_pk?: Maybe<TimetablesVehicleJourneyVehicleJourney>;
  /** delete data from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_delete_vehicle_schedule_vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMutationResponse>;
  /** delete single row from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_delete_vehicle_schedule_vehicle_schedule_frame_by_pk?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** delete data from the table: "vehicle_service.block" */
  timetables_delete_vehicle_service_block?: Maybe<TimetablesVehicleServiceBlockMutationResponse>;
  /** delete single row from the table: "vehicle_service.block" */
  timetables_delete_vehicle_service_block_by_pk?: Maybe<TimetablesVehicleServiceBlock>;
  /** delete data from the table: "vehicle_service.vehicle_service" */
  timetables_delete_vehicle_service_vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceMutationResponse>;
  /** delete single row from the table: "vehicle_service.vehicle_service" */
  timetables_delete_vehicle_service_vehicle_service_by_pk?: Maybe<TimetablesVehicleServiceVehicleService>;
  /** insert data into the table: "journey_pattern.journey_pattern_ref" */
  timetables_insert_journey_pattern_journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefMutationResponse>;
  /** insert a single row into the table: "journey_pattern.journey_pattern_ref" */
  timetables_insert_journey_pattern_journey_pattern_ref_one?: Maybe<TimetablesJourneyPatternJourneyPatternRef>;
  /** insert data into the table: "passing_times.timetabled_passing_time" */
  timetables_insert_passing_times_timetabled_passing_time?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMutationResponse>;
  /** insert a single row into the table: "passing_times.timetabled_passing_time" */
  timetables_insert_passing_times_timetabled_passing_time_one?: Maybe<TimetablesPassingTimesTimetabledPassingTime>;
  /** insert data into the table: "service_calendar.day_type" */
  timetables_insert_service_calendar_day_type?: Maybe<TimetablesServiceCalendarDayTypeMutationResponse>;
  /** insert data into the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_insert_service_calendar_day_type_active_on_day_of_week?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMutationResponse>;
  /** insert a single row into the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_insert_service_calendar_day_type_active_on_day_of_week_one?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** insert a single row into the table: "service_calendar.day_type" */
  timetables_insert_service_calendar_day_type_one?: Maybe<TimetablesServiceCalendarDayType>;
  /** insert data into the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_insert_service_pattern_scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMutationResponse>;
  /** insert a single row into the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_insert_service_pattern_scheduled_stop_point_in_journey_pattern_ref_one?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** insert data into the table: "vehicle_journey.vehicle_journey" */
  timetables_insert_vehicle_journey_vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyMutationResponse>;
  /** insert a single row into the table: "vehicle_journey.vehicle_journey" */
  timetables_insert_vehicle_journey_vehicle_journey_one?: Maybe<TimetablesVehicleJourneyVehicleJourney>;
  /** insert data into the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_insert_vehicle_schedule_vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMutationResponse>;
  /** insert a single row into the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_insert_vehicle_schedule_vehicle_schedule_frame_one?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** insert data into the table: "vehicle_service.block" */
  timetables_insert_vehicle_service_block?: Maybe<TimetablesVehicleServiceBlockMutationResponse>;
  /** insert a single row into the table: "vehicle_service.block" */
  timetables_insert_vehicle_service_block_one?: Maybe<TimetablesVehicleServiceBlock>;
  /** insert data into the table: "vehicle_service.vehicle_service" */
  timetables_insert_vehicle_service_vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceMutationResponse>;
  /** insert a single row into the table: "vehicle_service.vehicle_service" */
  timetables_insert_vehicle_service_vehicle_service_one?: Maybe<TimetablesVehicleServiceVehicleService>;
  /** update data of the table: "journey_pattern.journey_pattern_ref" */
  timetables_update_journey_pattern_journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefMutationResponse>;
  /** update single row of the table: "journey_pattern.journey_pattern_ref" */
  timetables_update_journey_pattern_journey_pattern_ref_by_pk?: Maybe<TimetablesJourneyPatternJourneyPatternRef>;
  /** update multiples rows of table: "journey_pattern.journey_pattern_ref" */
  timetables_update_journey_pattern_journey_pattern_ref_many?: Maybe<
    Array<Maybe<TimetablesJourneyPatternJourneyPatternRefMutationResponse>>
  >;
  /** update data of the table: "passing_times.timetabled_passing_time" */
  timetables_update_passing_times_timetabled_passing_time?: Maybe<TimetablesPassingTimesTimetabledPassingTimeMutationResponse>;
  /** update single row of the table: "passing_times.timetabled_passing_time" */
  timetables_update_passing_times_timetabled_passing_time_by_pk?: Maybe<TimetablesPassingTimesTimetabledPassingTime>;
  /** update multiples rows of table: "passing_times.timetabled_passing_time" */
  timetables_update_passing_times_timetabled_passing_time_many?: Maybe<
    Array<Maybe<TimetablesPassingTimesTimetabledPassingTimeMutationResponse>>
  >;
  /** update data of the table: "service_calendar.day_type" */
  timetables_update_service_calendar_day_type?: Maybe<TimetablesServiceCalendarDayTypeMutationResponse>;
  /** update data of the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_update_service_calendar_day_type_active_on_day_of_week?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMutationResponse>;
  /** update single row of the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_update_service_calendar_day_type_active_on_day_of_week_by_pk?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** update multiples rows of table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_update_service_calendar_day_type_active_on_day_of_week_many?: Maybe<
    Array<
      Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMutationResponse>
    >
  >;
  /** update single row of the table: "service_calendar.day_type" */
  timetables_update_service_calendar_day_type_by_pk?: Maybe<TimetablesServiceCalendarDayType>;
  /** update multiples rows of table: "service_calendar.day_type" */
  timetables_update_service_calendar_day_type_many?: Maybe<
    Array<Maybe<TimetablesServiceCalendarDayTypeMutationResponse>>
  >;
  /** update data of the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_update_service_pattern_scheduled_stop_point_in_journey_pattern_ref?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMutationResponse>;
  /** update single row of the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_update_service_pattern_scheduled_stop_point_in_journey_pattern_ref_by_pk?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** update multiples rows of table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_update_service_pattern_scheduled_stop_point_in_journey_pattern_ref_many?: Maybe<
    Array<
      Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMutationResponse>
    >
  >;
  /** update data of the table: "vehicle_journey.vehicle_journey" */
  timetables_update_vehicle_journey_vehicle_journey?: Maybe<TimetablesVehicleJourneyVehicleJourneyMutationResponse>;
  /** update single row of the table: "vehicle_journey.vehicle_journey" */
  timetables_update_vehicle_journey_vehicle_journey_by_pk?: Maybe<TimetablesVehicleJourneyVehicleJourney>;
  /** update multiples rows of table: "vehicle_journey.vehicle_journey" */
  timetables_update_vehicle_journey_vehicle_journey_many?: Maybe<
    Array<Maybe<TimetablesVehicleJourneyVehicleJourneyMutationResponse>>
  >;
  /** update data of the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_update_vehicle_schedule_vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMutationResponse>;
  /** update single row of the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_update_vehicle_schedule_vehicle_schedule_frame_by_pk?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** update multiples rows of table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_update_vehicle_schedule_vehicle_schedule_frame_many?: Maybe<
    Array<Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMutationResponse>>
  >;
  /** update data of the table: "vehicle_service.block" */
  timetables_update_vehicle_service_block?: Maybe<TimetablesVehicleServiceBlockMutationResponse>;
  /** update single row of the table: "vehicle_service.block" */
  timetables_update_vehicle_service_block_by_pk?: Maybe<TimetablesVehicleServiceBlock>;
  /** update multiples rows of table: "vehicle_service.block" */
  timetables_update_vehicle_service_block_many?: Maybe<
    Array<Maybe<TimetablesVehicleServiceBlockMutationResponse>>
  >;
  /** update data of the table: "vehicle_service.vehicle_service" */
  timetables_update_vehicle_service_vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceMutationResponse>;
  /** update single row of the table: "vehicle_service.vehicle_service" */
  timetables_update_vehicle_service_vehicle_service_by_pk?: Maybe<TimetablesVehicleServiceVehicleService>;
  /** update multiples rows of table: "vehicle_service.vehicle_service" */
  timetables_update_vehicle_service_vehicle_service_many?: Maybe<
    Array<Maybe<TimetablesVehicleServiceVehicleServiceMutationResponse>>
  >;
};

export type TimetablesTimetablesMutationFrontendTimetablesDeleteJourneyPatternJourneyPatternRefArgs =
  {
    where: TimetablesJourneyPatternJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteJourneyPatternJourneyPatternRefByPkArgs =
  {
    journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeletePassingTimesTimetabledPassingTimeArgs =
  {
    where: TimetablesPassingTimesTimetabledPassingTimeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeletePassingTimesTimetabledPassingTimeByPkArgs =
  {
    timetabled_passing_time_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServiceCalendarDayTypeArgs =
  {
    where: TimetablesServiceCalendarDayTypeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    where: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    day_of_week: Scalars['Int'];
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServiceCalendarDayTypeByPkArgs =
  {
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    where: TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleJourneyVehicleJourneyArgs =
  {
    where: TimetablesVehicleJourneyVehicleJourneyBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleJourneyVehicleJourneyByPkArgs =
  {
    vehicle_journey_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleScheduleVehicleScheduleFrameArgs =
  {
    where: TimetablesVehicleScheduleVehicleScheduleFrameBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    vehicle_schedule_frame_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleServiceBlockArgs =
  {
    where: TimetablesVehicleServiceBlockBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleServiceBlockByPkArgs =
  {
    block_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleServiceVehicleServiceArgs =
  {
    where: TimetablesVehicleServiceVehicleServiceBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleServiceVehicleServiceByPkArgs =
  {
    vehicle_service_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertJourneyPatternJourneyPatternRefArgs =
  {
    objects: Array<TimetablesJourneyPatternJourneyPatternRefInsertInput>;
    on_conflict?: Maybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertJourneyPatternJourneyPatternRefOneArgs =
  {
    object: TimetablesJourneyPatternJourneyPatternRefInsertInput;
    on_conflict?: Maybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertPassingTimesTimetabledPassingTimeArgs =
  {
    objects: Array<TimetablesPassingTimesTimetabledPassingTimeInsertInput>;
    on_conflict?: Maybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertPassingTimesTimetabledPassingTimeOneArgs =
  {
    object: TimetablesPassingTimesTimetabledPassingTimeInsertInput;
    on_conflict?: Maybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeArgs =
  {
    objects: Array<TimetablesServiceCalendarDayTypeInsertInput>;
    on_conflict?: Maybe<TimetablesServiceCalendarDayTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    objects: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput>;
    on_conflict?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeActiveOnDayOfWeekOneArgs =
  {
    object: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput;
    on_conflict?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeOneArgs =
  {
    object: TimetablesServiceCalendarDayTypeInsertInput;
    on_conflict?: Maybe<TimetablesServiceCalendarDayTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    objects: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput>;
    on_conflict?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServicePatternScheduledStopPointInJourneyPatternRefOneArgs =
  {
    object: TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput;
    on_conflict?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleJourneyVehicleJourneyArgs =
  {
    objects: Array<TimetablesVehicleJourneyVehicleJourneyInsertInput>;
    on_conflict?: Maybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleJourneyVehicleJourneyOneArgs =
  {
    object: TimetablesVehicleJourneyVehicleJourneyInsertInput;
    on_conflict?: Maybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleScheduleVehicleScheduleFrameArgs =
  {
    objects: Array<TimetablesVehicleScheduleVehicleScheduleFrameInsertInput>;
    on_conflict?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleScheduleVehicleScheduleFrameOneArgs =
  {
    object: TimetablesVehicleScheduleVehicleScheduleFrameInsertInput;
    on_conflict?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceBlockArgs =
  {
    objects: Array<TimetablesVehicleServiceBlockInsertInput>;
    on_conflict?: Maybe<TimetablesVehicleServiceBlockOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceBlockOneArgs =
  {
    object: TimetablesVehicleServiceBlockInsertInput;
    on_conflict?: Maybe<TimetablesVehicleServiceBlockOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceVehicleServiceArgs =
  {
    objects: Array<TimetablesVehicleServiceVehicleServiceInsertInput>;
    on_conflict?: Maybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceVehicleServiceOneArgs =
  {
    object: TimetablesVehicleServiceVehicleServiceInsertInput;
    on_conflict?: Maybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefArgs =
  {
    _set?: Maybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
    where: TimetablesJourneyPatternJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefByPkArgs =
  {
    _set?: Maybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
    pk_columns: TimetablesJourneyPatternJourneyPatternRefPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefManyArgs =
  {
    updates: Array<TimetablesJourneyPatternJourneyPatternRefUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeArgs =
  {
    _set?: Maybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
    where: TimetablesPassingTimesTimetabledPassingTimeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeByPkArgs =
  {
    _set?: Maybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
    pk_columns: TimetablesPassingTimesTimetabledPassingTimePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeManyArgs =
  {
    updates: Array<TimetablesPassingTimesTimetabledPassingTimeUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeArgs =
  {
    _append?: Maybe<TimetablesServiceCalendarDayTypeAppendInput>;
    _delete_at_path?: Maybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
    _delete_elem?: Maybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
    _delete_key?: Maybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
    _prepend?: Maybe<TimetablesServiceCalendarDayTypePrependInput>;
    _set?: Maybe<TimetablesServiceCalendarDayTypeSetInput>;
    where: TimetablesServiceCalendarDayTypeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    _inc?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
    _set?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
    where: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    _inc?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
    _set?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
    pk_columns: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekManyArgs =
  {
    updates: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeByPkArgs =
  {
    _append?: Maybe<TimetablesServiceCalendarDayTypeAppendInput>;
    _delete_at_path?: Maybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
    _delete_elem?: Maybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
    _delete_key?: Maybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
    _prepend?: Maybe<TimetablesServiceCalendarDayTypePrependInput>;
    _set?: Maybe<TimetablesServiceCalendarDayTypeSetInput>;
    pk_columns: TimetablesServiceCalendarDayTypePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeManyArgs =
  {
    updates: Array<TimetablesServiceCalendarDayTypeUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    _inc?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    _set?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    where: TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    _inc?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    _set?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    pk_columns: TimetablesServicePatternScheduledStopPointInJourneyPatternRefPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefManyArgs =
  {
    updates: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyArgs =
  {
    _set?: Maybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
    where: TimetablesVehicleJourneyVehicleJourneyBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyByPkArgs =
  {
    _set?: Maybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
    pk_columns: TimetablesVehicleJourneyVehicleJourneyPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyManyArgs =
  {
    updates: Array<TimetablesVehicleJourneyVehicleJourneyUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameArgs =
  {
    _append?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
    _delete_at_path?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
    _delete_elem?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
    _delete_key?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
    _inc?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
    _prepend?: Maybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
    _set?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
    where: TimetablesVehicleScheduleVehicleScheduleFrameBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    _append?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
    _delete_at_path?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
    _delete_elem?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
    _delete_key?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
    _inc?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
    _prepend?: Maybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
    _set?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
    pk_columns: TimetablesVehicleScheduleVehicleScheduleFramePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameManyArgs =
  {
    updates: Array<TimetablesVehicleScheduleVehicleScheduleFrameUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockArgs =
  {
    _set?: Maybe<TimetablesVehicleServiceBlockSetInput>;
    where: TimetablesVehicleServiceBlockBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockByPkArgs =
  {
    _set?: Maybe<TimetablesVehicleServiceBlockSetInput>;
    pk_columns: TimetablesVehicleServiceBlockPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockManyArgs =
  {
    updates: Array<TimetablesVehicleServiceBlockUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceArgs =
  {
    _set?: Maybe<TimetablesVehicleServiceVehicleServiceSetInput>;
    where: TimetablesVehicleServiceVehicleServiceBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceByPkArgs =
  {
    _set?: Maybe<TimetablesVehicleServiceVehicleServiceSetInput>;
    pk_columns: TimetablesVehicleServiceVehicleServicePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceManyArgs =
  {
    updates: Array<TimetablesVehicleServiceVehicleServiceUpdates>;
  };

export type TimetablesTimetablesQuery = {
  __typename?: 'timetables_timetables_query';
  /** fetch data from the table: "journey_pattern.journey_pattern_ref" */
  timetables_journey_pattern_journey_pattern_ref: Array<TimetablesJourneyPatternJourneyPatternRef>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern_ref" */
  timetables_journey_pattern_journey_pattern_ref_aggregate: TimetablesJourneyPatternJourneyPatternRefAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern_ref" using primary key columns */
  timetables_journey_pattern_journey_pattern_ref_by_pk?: Maybe<TimetablesJourneyPatternJourneyPatternRef>;
  /** fetch data from the table: "passing_times.timetabled_passing_time" */
  timetables_passing_times_timetabled_passing_time: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** fetch aggregated fields from the table: "passing_times.timetabled_passing_time" */
  timetables_passing_times_timetabled_passing_time_aggregate: TimetablesPassingTimesTimetabledPassingTimeAggregate;
  /** fetch data from the table: "passing_times.timetabled_passing_time" using primary key columns */
  timetables_passing_times_timetabled_passing_time_by_pk?: Maybe<TimetablesPassingTimesTimetabledPassingTime>;
  /** fetch data from the table: "service_calendar.day_type" */
  timetables_service_calendar_day_type: Array<TimetablesServiceCalendarDayType>;
  /** fetch data from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_service_calendar_day_type_active_on_day_of_week: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** fetch aggregated fields from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_service_calendar_day_type_active_on_day_of_week_aggregate: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregate;
  /** fetch data from the table: "service_calendar.day_type_active_on_day_of_week" using primary key columns */
  timetables_service_calendar_day_type_active_on_day_of_week_by_pk?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** fetch aggregated fields from the table: "service_calendar.day_type" */
  timetables_service_calendar_day_type_aggregate: TimetablesServiceCalendarDayTypeAggregate;
  /** fetch data from the table: "service_calendar.day_type" using primary key columns */
  timetables_service_calendar_day_type_by_pk?: Maybe<TimetablesServiceCalendarDayType>;
  /** execute function "service_calendar.get_active_day_types_for_date" which returns "service_calendar.day_type" */
  timetables_service_calendar_get_active_day_types_for_date: Array<TimetablesServiceCalendarDayType>;
  /** execute function "service_calendar.get_active_day_types_for_date" and query aggregates on result of table type "service_calendar.day_type" */
  timetables_service_calendar_get_active_day_types_for_date_aggregate: TimetablesServiceCalendarDayTypeAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_aggregate: TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" using primary key columns */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_by_pk?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** fetch data from the table: "vehicle_journey.vehicle_journey" */
  timetables_vehicle_journey_vehicle_journey: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** fetch aggregated fields from the table: "vehicle_journey.vehicle_journey" */
  timetables_vehicle_journey_vehicle_journey_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
  /** fetch data from the table: "vehicle_journey.vehicle_journey" using primary key columns */
  timetables_vehicle_journey_vehicle_journey_by_pk?: Maybe<TimetablesVehicleJourneyVehicleJourney>;
  /** fetch data from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_vehicle_schedule_vehicle_schedule_frame: Array<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** fetch aggregated fields from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_vehicle_schedule_vehicle_schedule_frame_aggregate: TimetablesVehicleScheduleVehicleScheduleFrameAggregate;
  /** fetch data from the table: "vehicle_schedule.vehicle_schedule_frame" using primary key columns */
  timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** fetch data from the table: "vehicle_service.block" */
  timetables_vehicle_service_block: Array<TimetablesVehicleServiceBlock>;
  /** fetch aggregated fields from the table: "vehicle_service.block" */
  timetables_vehicle_service_block_aggregate: TimetablesVehicleServiceBlockAggregate;
  /** fetch data from the table: "vehicle_service.block" using primary key columns */
  timetables_vehicle_service_block_by_pk?: Maybe<TimetablesVehicleServiceBlock>;
  /** execute function "vehicle_service.get_vehicle_services_for_date" which returns "vehicle_service.vehicle_service" */
  timetables_vehicle_service_get_vehicle_services_for_date: Array<TimetablesVehicleServiceVehicleService>;
  /** execute function "vehicle_service.get_vehicle_services_for_date" and query aggregates on result of table type "vehicle_service.vehicle_service" */
  timetables_vehicle_service_get_vehicle_services_for_date_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
  /** fetch data from the table: "vehicle_service.vehicle_service" */
  timetables_vehicle_service_vehicle_service: Array<TimetablesVehicleServiceVehicleService>;
  /** fetch aggregated fields from the table: "vehicle_service.vehicle_service" */
  timetables_vehicle_service_vehicle_service_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
  /** fetch data from the table: "vehicle_service.vehicle_service" using primary key columns */
  timetables_vehicle_service_vehicle_service_by_pk?: Maybe<TimetablesVehicleServiceVehicleService>;
};

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
    where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
    where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefByPkArgs =
  {
    journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeByPkArgs =
  {
    timetabled_passing_time_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeArgs = {
  distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
  where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
};

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    day_of_week: Scalars['Int'];
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeAggregateArgs =
  {
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeByPkArgs =
  {
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarGetActiveDayTypesForDateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarGetActiveDayTypesForDateAggregateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyByPkArgs =
  {
    vehicle_journey_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    vehicle_schedule_frame_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockArgs = {
  distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
};

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockAggregateArgs =
  {
    distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockByPkArgs = {
  block_id: Scalars['uuid'];
};

export type TimetablesTimetablesQueryTimetablesVehicleServiceGetVehicleServicesForDateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceGetVehicleServicesForDateAggregateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceByPkArgs =
  {
    vehicle_service_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscription = {
  __typename?: 'timetables_timetables_subscription';
  /** fetch data from the table: "journey_pattern.journey_pattern_ref" */
  timetables_journey_pattern_journey_pattern_ref: Array<TimetablesJourneyPatternJourneyPatternRef>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern_ref" */
  timetables_journey_pattern_journey_pattern_ref_aggregate: TimetablesJourneyPatternJourneyPatternRefAggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern_ref" using primary key columns */
  timetables_journey_pattern_journey_pattern_ref_by_pk?: Maybe<TimetablesJourneyPatternJourneyPatternRef>;
  /** fetch data from the table in a streaming manner: "journey_pattern.journey_pattern_ref" */
  timetables_journey_pattern_journey_pattern_ref_stream: Array<TimetablesJourneyPatternJourneyPatternRef>;
  /** fetch data from the table: "passing_times.timetabled_passing_time" */
  timetables_passing_times_timetabled_passing_time: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** fetch aggregated fields from the table: "passing_times.timetabled_passing_time" */
  timetables_passing_times_timetabled_passing_time_aggregate: TimetablesPassingTimesTimetabledPassingTimeAggregate;
  /** fetch data from the table: "passing_times.timetabled_passing_time" using primary key columns */
  timetables_passing_times_timetabled_passing_time_by_pk?: Maybe<TimetablesPassingTimesTimetabledPassingTime>;
  /** fetch data from the table in a streaming manner: "passing_times.timetabled_passing_time" */
  timetables_passing_times_timetabled_passing_time_stream: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** fetch data from the table: "service_calendar.day_type" */
  timetables_service_calendar_day_type: Array<TimetablesServiceCalendarDayType>;
  /** fetch data from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_service_calendar_day_type_active_on_day_of_week: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** fetch aggregated fields from the table: "service_calendar.day_type_active_on_day_of_week" */
  timetables_service_calendar_day_type_active_on_day_of_week_aggregate: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregate;
  /** fetch data from the table: "service_calendar.day_type_active_on_day_of_week" using primary key columns */
  timetables_service_calendar_day_type_active_on_day_of_week_by_pk?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** fetch data from the table in a streaming manner: "service_calendar.day_type_active_on_day_of_week" */
  timetables_service_calendar_day_type_active_on_day_of_week_stream: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeek>;
  /** fetch aggregated fields from the table: "service_calendar.day_type" */
  timetables_service_calendar_day_type_aggregate: TimetablesServiceCalendarDayTypeAggregate;
  /** fetch data from the table: "service_calendar.day_type" using primary key columns */
  timetables_service_calendar_day_type_by_pk?: Maybe<TimetablesServiceCalendarDayType>;
  /** fetch data from the table in a streaming manner: "service_calendar.day_type" */
  timetables_service_calendar_day_type_stream: Array<TimetablesServiceCalendarDayType>;
  /** execute function "service_calendar.get_active_day_types_for_date" which returns "service_calendar.day_type" */
  timetables_service_calendar_get_active_day_types_for_date: Array<TimetablesServiceCalendarDayType>;
  /** execute function "service_calendar.get_active_day_types_for_date" and query aggregates on result of table type "service_calendar.day_type" */
  timetables_service_calendar_get_active_day_types_for_date_aggregate: TimetablesServiceCalendarDayTypeAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_aggregate: TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" using primary key columns */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_by_pk?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** fetch data from the table in a streaming manner: "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
  timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_stream: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRef>;
  /** fetch data from the table: "vehicle_journey.vehicle_journey" */
  timetables_vehicle_journey_vehicle_journey: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** fetch aggregated fields from the table: "vehicle_journey.vehicle_journey" */
  timetables_vehicle_journey_vehicle_journey_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
  /** fetch data from the table: "vehicle_journey.vehicle_journey" using primary key columns */
  timetables_vehicle_journey_vehicle_journey_by_pk?: Maybe<TimetablesVehicleJourneyVehicleJourney>;
  /** fetch data from the table in a streaming manner: "vehicle_journey.vehicle_journey" */
  timetables_vehicle_journey_vehicle_journey_stream: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** fetch data from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_vehicle_schedule_vehicle_schedule_frame: Array<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** fetch aggregated fields from the table: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_vehicle_schedule_vehicle_schedule_frame_aggregate: TimetablesVehicleScheduleVehicleScheduleFrameAggregate;
  /** fetch data from the table: "vehicle_schedule.vehicle_schedule_frame" using primary key columns */
  timetables_vehicle_schedule_vehicle_schedule_frame_by_pk?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** fetch data from the table in a streaming manner: "vehicle_schedule.vehicle_schedule_frame" */
  timetables_vehicle_schedule_vehicle_schedule_frame_stream: Array<TimetablesVehicleScheduleVehicleScheduleFrame>;
  /** fetch data from the table: "vehicle_service.block" */
  timetables_vehicle_service_block: Array<TimetablesVehicleServiceBlock>;
  /** fetch aggregated fields from the table: "vehicle_service.block" */
  timetables_vehicle_service_block_aggregate: TimetablesVehicleServiceBlockAggregate;
  /** fetch data from the table: "vehicle_service.block" using primary key columns */
  timetables_vehicle_service_block_by_pk?: Maybe<TimetablesVehicleServiceBlock>;
  /** fetch data from the table in a streaming manner: "vehicle_service.block" */
  timetables_vehicle_service_block_stream: Array<TimetablesVehicleServiceBlock>;
  /** execute function "vehicle_service.get_vehicle_services_for_date" which returns "vehicle_service.vehicle_service" */
  timetables_vehicle_service_get_vehicle_services_for_date: Array<TimetablesVehicleServiceVehicleService>;
  /** execute function "vehicle_service.get_vehicle_services_for_date" and query aggregates on result of table type "vehicle_service.vehicle_service" */
  timetables_vehicle_service_get_vehicle_services_for_date_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
  /** fetch data from the table: "vehicle_service.vehicle_service" */
  timetables_vehicle_service_vehicle_service: Array<TimetablesVehicleServiceVehicleService>;
  /** fetch aggregated fields from the table: "vehicle_service.vehicle_service" */
  timetables_vehicle_service_vehicle_service_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
  /** fetch data from the table: "vehicle_service.vehicle_service" using primary key columns */
  timetables_vehicle_service_vehicle_service_by_pk?: Maybe<TimetablesVehicleServiceVehicleService>;
  /** fetch data from the table in a streaming manner: "vehicle_service.vehicle_service" */
  timetables_vehicle_service_vehicle_service_stream: Array<TimetablesVehicleServiceVehicleService>;
};

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
    where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>>;
    where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefByPkArgs =
  {
    journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesJourneyPatternJourneyPatternRefStreamCursorInput>
    >;
    where?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeByPkArgs =
  {
    timetabled_passing_time_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesPassingTimesTimetabledPassingTimeStreamCursorInput>
    >;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeArgs =
  {
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    day_of_week: Scalars['Int'];
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorInput>
    >;
    where?: Maybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeAggregateArgs =
  {
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeByPkArgs =
  {
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<Maybe<TimetablesServiceCalendarDayTypeStreamCursorInput>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarGetActiveDayTypesForDateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarGetActiveDayTypesForDateAggregateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: Maybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorInput>
    >;
    where?: Maybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyByPkArgs =
  {
    vehicle_journey_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesVehicleJourneyVehicleJourneyStreamCursorInput>
    >;
    where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    vehicle_schedule_frame_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorInput>
    >;
    where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockArgs =
  {
    distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockAggregateArgs =
  {
    distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockByPkArgs =
  {
    block_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<Maybe<TimetablesVehicleServiceBlockStreamCursorInput>>;
    where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceGetVehicleServicesForDateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceGetVehicleServicesForDateAggregateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceByPkArgs =
  {
    vehicle_service_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      Maybe<TimetablesVehicleServiceVehicleServiceStreamCursorInput>
    >;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourney = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey';
  /** An object relationship */
  block: TimetablesVehicleServiceBlock;
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id: Scalars['uuid'];
  /** A computed field, executes function "vehicle_journey.vehicle_journey_end_time" */
  end_time: Scalars['interval'];
  /** An object relationship */
  journey_pattern_ref: TimetablesJourneyPatternJourneyPatternRef;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id: Scalars['uuid'];
  /** A computed field, executes function "vehicle_journey.vehicle_journey_start_time" */
  start_time: Scalars['interval'];
  /** An array relationship */
  timetabled_passing_times: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** An aggregate relationship */
  timetabled_passing_times_aggregate: TimetablesPassingTimesTimetabledPassingTimeAggregate;
  vehicle_journey_id: Scalars['uuid'];
};

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourneyTimetabledPassingTimesArgs = {
  distinct_on?: Maybe<
    Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
  where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
};

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourneyTimetabledPassingTimesAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>>;
    where?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

/** aggregated selection of "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyAggregate = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_aggregate';
  aggregate?: Maybe<TimetablesVehicleJourneyVehicleJourneyAggregateFields>;
  nodes: Array<TimetablesVehicleJourneyVehicleJourney>;
};

/** aggregate fields of "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyAggregateFields = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesVehicleJourneyVehicleJourneyMaxFields>;
  min?: Maybe<TimetablesVehicleJourneyVehicleJourneyMinFields>;
};

/** aggregate fields of "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<TimetablesVehicleJourneyVehicleJourneyMaxOrderBy>;
  min?: Maybe<TimetablesVehicleJourneyVehicleJourneyMinOrderBy>;
};

/** input type for inserting array relation for remote table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput = {
  data: Array<TimetablesVehicleJourneyVehicleJourneyInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_journey.vehicle_journey". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleJourneyVehicleJourneyBoolExp = {
  _and?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyBoolExp>>;
  _not?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  _or?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyBoolExp>>;
  block?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  block_id?: Maybe<UuidComparisonExp>;
  end_time?: Maybe<StringComparisonExp>;
  journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  journey_pattern_ref_id?: Maybe<UuidComparisonExp>;
  start_time?: Maybe<StringComparisonExp>;
  timetabled_passing_times?: Maybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  timetabled_passing_times_aggregate?: Maybe<PassingTimesTimetabledPassingTimeAggregateBoolExp>;
  vehicle_journey_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneyConstraint {
  /** unique or primary key constraint on columns "vehicle_journey_id" */
  VehicleJourneyPkey = 'vehicle_journey_pkey',
}

/** input type for inserting data into table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyInsertInput = {
  block?: Maybe<TimetablesVehicleServiceBlockObjRelInsertInput>;
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefObjRelInsertInput>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  timetabled_passing_times?: Maybe<TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleJourneyVehicleJourneyMaxFields = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_max_fields';
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyMaxOrderBy = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<OrderBy>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<OrderBy>;
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesVehicleJourneyVehicleJourneyMinFields = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_min_fields';
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyMinOrderBy = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<OrderBy>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<OrderBy>;
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyMutationResponse = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesVehicleJourneyVehicleJourney>;
};

/** input type for inserting object relation for remote table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyObjRelInsertInput = {
  data: TimetablesVehicleJourneyVehicleJourneyInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
};

/** on_conflict condition type for table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyOnConflict = {
  constraint: TimetablesVehicleJourneyVehicleJourneyConstraint;
  update_columns?: Array<TimetablesVehicleJourneyVehicleJourneyUpdateColumn>;
  where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** Ordering options when selecting data from "vehicle_journey.vehicle_journey". */
export type TimetablesVehicleJourneyVehicleJourneyOrderBy = {
  block?: Maybe<TimetablesVehicleServiceBlockOrderBy>;
  block_id?: Maybe<OrderBy>;
  end_time?: Maybe<OrderBy>;
  journey_pattern_ref?: Maybe<TimetablesJourneyPatternJourneyPatternRefOrderBy>;
  journey_pattern_ref_id?: Maybe<OrderBy>;
  start_time?: Maybe<OrderBy>;
  timetabled_passing_times_aggregate?: Maybe<TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy>;
  vehicle_journey_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: vehicle_journey.vehicle_journey */
export type TimetablesVehicleJourneyVehicleJourneyPkColumnsInput = {
  vehicle_journey_id: Scalars['uuid'];
};

/** select columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneySelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

/** input type for updating data in table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneySetInput = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_journey_vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleJourneyVehicleJourneyStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleJourneyVehicleJourneyStreamCursorValueInput = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneyUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

export type TimetablesVehicleJourneyVehicleJourneyUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
  where: TimetablesVehicleJourneyVehicleJourneyBoolExp;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrame = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n: Scalars['jsonb'];
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_schedule_frame_id: Scalars['uuid'];
  /** An array relationship */
  vehicle_services: Array<TimetablesVehicleServiceVehicleService>;
  /** An aggregate relationship */
  vehicle_services_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameVehicleServicesArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameVehicleServicesAggregateArgs =
  {
    distinct_on?: Maybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

/** aggregated selection of "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameAggregate = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_aggregate';
  aggregate?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameAggregateFields>;
  nodes: Array<TimetablesVehicleScheduleVehicleScheduleFrame>;
};

/** aggregate fields of "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameAggregateFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_aggregate_fields';
  avg?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMaxFields>;
  min?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameMinFields>;
  stddev?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameStddevFields>;
  stddev_pop?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameStddevPopFields>;
  stddev_samp?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameStddevSampFields>;
  sum?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameSumFields>;
  var_pop?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameVarPopFields>;
  var_samp?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameVarSampFields>;
  variance?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameVarianceFields>;
};

/** aggregate fields of "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameAggregateFieldsCountArgs =
  {
    columns?: Maybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    distinct?: Maybe<Scalars['Boolean']>;
  };

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleScheduleVehicleScheduleFrameAppendInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameAvgFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_avg_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "vehicle_schedule.vehicle_schedule_frame". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleScheduleVehicleScheduleFrameBoolExp = {
  _and?: Maybe<Array<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>>;
  _not?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  _or?: Maybe<Array<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>>;
  name_i18n?: Maybe<JsonbComparisonExp>;
  priority?: Maybe<IntComparisonExp>;
  validity_end?: Maybe<DateComparisonExp>;
  validity_start?: Maybe<DateComparisonExp>;
  vehicle_schedule_frame_id?: Maybe<UuidComparisonExp>;
  vehicle_services?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_services_aggregate?: Maybe<VehicleServiceVehicleServiceAggregateBoolExp>;
};

/** unique or primary key constraints on table "vehicle_schedule.vehicle_schedule_frame" */
export enum TimetablesVehicleScheduleVehicleScheduleFrameConstraint {
  /** unique or primary key constraint on columns "vehicle_schedule_frame_id" */
  VehicleScheduleFramePkey = 'vehicle_schedule_frame_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameIncInput = {
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameInsertInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_services?: Maybe<TimetablesVehicleServiceVehicleServiceArrRelInsertInput>;
};

/** aggregate max on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameMaxFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_max_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameMinFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_min_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameMutationResponse = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesVehicleScheduleVehicleScheduleFrame>;
};

/** input type for inserting object relation for remote table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameObjRelInsertInput = {
  data: TimetablesVehicleScheduleVehicleScheduleFrameInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
};

/** on_conflict condition type for table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameOnConflict = {
  constraint: TimetablesVehicleScheduleVehicleScheduleFrameConstraint;
  update_columns?: Array<TimetablesVehicleScheduleVehicleScheduleFrameUpdateColumn>;
  where?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
};

/** Ordering options when selecting data from "vehicle_schedule.vehicle_schedule_frame". */
export type TimetablesVehicleScheduleVehicleScheduleFrameOrderBy = {
  name_i18n?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  vehicle_schedule_frame_id?: Maybe<OrderBy>;
  vehicle_services_aggregate?: Maybe<TimetablesVehicleServiceVehicleServiceAggregateOrderBy>;
};

/** primary key columns input for table: vehicle_schedule.vehicle_schedule_frame */
export type TimetablesVehicleScheduleVehicleScheduleFramePkColumnsInput = {
  vehicle_schedule_frame_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleScheduleVehicleScheduleFramePrependInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "vehicle_schedule.vehicle_schedule_frame" */
export enum TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn {
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  Priority = 'priority',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
}

/** input type for updating data in table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameSetInput = {
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: Maybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: Maybe<Scalars['date']>;
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameStddevFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_stddev_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameStddevPopFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_stddev_pop_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameStddevSampFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_stddev_samp_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "vehicle_schedule_vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorValueInput =
  {
    /** Human-readable name for the VEHICLE SCHEDULE FRAME */
    name_i18n?: Maybe<Scalars['jsonb']>;
    /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
    priority?: Maybe<Scalars['Int']>;
    /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
    validity_end?: Maybe<Scalars['date']>;
    /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
    validity_start?: Maybe<Scalars['date']>;
    vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  };

/** aggregate sum on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameSumFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_sum_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
};

/** update columns of table "vehicle_schedule.vehicle_schedule_frame" */
export enum TimetablesVehicleScheduleVehicleScheduleFrameUpdateColumn {
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  Priority = 'priority',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
}

export type TimetablesVehicleScheduleVehicleScheduleFrameUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
  where: TimetablesVehicleScheduleVehicleScheduleFrameBoolExp;
};

/** aggregate var_pop on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameVarPopFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_var_pop_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameVarSampFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_var_samp_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameVarianceFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_variance_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** The work of a vehicle from the time it leaves a PARKING POINT after parking until its next return to park at a PARKING POINT. Any subsequent departure from a PARKING POINT after parking marks the start of a new BLOCK. The period of a BLOCK has to be covered by DUTies. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:958  */
export type TimetablesVehicleServiceBlock = {
  __typename?: 'timetables_vehicle_service_block';
  block_id: Scalars['uuid'];
  /** An array relationship */
  vehicle_journeys: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** An aggregate relationship */
  vehicle_journeys_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
  /** An object relationship */
  vehicle_service: TimetablesVehicleServiceVehicleService;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id: Scalars['uuid'];
};

/** The work of a vehicle from the time it leaves a PARKING POINT after parking until its next return to park at a PARKING POINT. Any subsequent departure from a PARKING POINT after parking marks the start of a new BLOCK. The period of a BLOCK has to be covered by DUTies. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:958  */
export type TimetablesVehicleServiceBlockVehicleJourneysArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** The work of a vehicle from the time it leaves a PARKING POINT after parking until its next return to park at a PARKING POINT. Any subsequent departure from a PARKING POINT after parking marks the start of a new BLOCK. The period of a BLOCK has to be covered by DUTies. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:958  */
export type TimetablesVehicleServiceBlockVehicleJourneysAggregateArgs = {
  distinct_on?: Maybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** aggregated selection of "vehicle_service.block" */
export type TimetablesVehicleServiceBlockAggregate = {
  __typename?: 'timetables_vehicle_service_block_aggregate';
  aggregate?: Maybe<TimetablesVehicleServiceBlockAggregateFields>;
  nodes: Array<TimetablesVehicleServiceBlock>;
};

/** aggregate fields of "vehicle_service.block" */
export type TimetablesVehicleServiceBlockAggregateFields = {
  __typename?: 'timetables_vehicle_service_block_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesVehicleServiceBlockMaxFields>;
  min?: Maybe<TimetablesVehicleServiceBlockMinFields>;
};

/** aggregate fields of "vehicle_service.block" */
export type TimetablesVehicleServiceBlockAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<TimetablesVehicleServiceBlockMaxOrderBy>;
  min?: Maybe<TimetablesVehicleServiceBlockMinOrderBy>;
};

/** input type for inserting array relation for remote table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockArrRelInsertInput = {
  data: Array<TimetablesVehicleServiceBlockInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleServiceBlockOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_service.block". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleServiceBlockBoolExp = {
  _and?: Maybe<Array<TimetablesVehicleServiceBlockBoolExp>>;
  _not?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  _or?: Maybe<Array<TimetablesVehicleServiceBlockBoolExp>>;
  block_id?: Maybe<UuidComparisonExp>;
  vehicle_journeys?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journeys_aggregate?: Maybe<VehicleJourneyVehicleJourneyAggregateBoolExp>;
  vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_service_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_service.block" */
export enum TimetablesVehicleServiceBlockConstraint {
  /** unique or primary key constraint on columns "block_id" */
  BlockPkey = 'block_pkey',
}

/** input type for inserting data into table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockInsertInput = {
  block_id?: Maybe<Scalars['uuid']>;
  vehicle_journeys?: Maybe<TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput>;
  vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceObjRelInsertInput>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleServiceBlockMaxFields = {
  __typename?: 'timetables_vehicle_service_block_max_fields';
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockMaxOrderBy = {
  block_id?: Maybe<OrderBy>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesVehicleServiceBlockMinFields = {
  __typename?: 'timetables_vehicle_service_block_min_fields';
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockMinOrderBy = {
  block_id?: Maybe<OrderBy>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockMutationResponse = {
  __typename?: 'timetables_vehicle_service_block_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesVehicleServiceBlock>;
};

/** input type for inserting object relation for remote table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockObjRelInsertInput = {
  data: TimetablesVehicleServiceBlockInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleServiceBlockOnConflict>;
};

/** on_conflict condition type for table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockOnConflict = {
  constraint: TimetablesVehicleServiceBlockConstraint;
  update_columns?: Array<TimetablesVehicleServiceBlockUpdateColumn>;
  where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** Ordering options when selecting data from "vehicle_service.block". */
export type TimetablesVehicleServiceBlockOrderBy = {
  block_id?: Maybe<OrderBy>;
  vehicle_journeys_aggregate?: Maybe<TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy>;
  vehicle_service?: Maybe<TimetablesVehicleServiceVehicleServiceOrderBy>;
  vehicle_service_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: vehicle_service.block */
export type TimetablesVehicleServiceBlockPkColumnsInput = {
  block_id: Scalars['uuid'];
};

/** select columns of table "vehicle_service.block" */
export enum TimetablesVehicleServiceBlockSelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

/** input type for updating data in table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockSetInput = {
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_service_block" */
export type TimetablesVehicleServiceBlockStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleServiceBlockStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleServiceBlockStreamCursorValueInput = {
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_service.block" */
export enum TimetablesVehicleServiceBlockUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

export type TimetablesVehicleServiceBlockUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesVehicleServiceBlockSetInput>;
  where: TimetablesVehicleServiceBlockBoolExp;
};

export type TimetablesVehicleServiceGetVehicleServicesForDateArgs = {
  observation_date?: Maybe<Scalars['date']>;
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleService = {
  __typename?: 'timetables_vehicle_service_vehicle_service';
  /** An array relationship */
  blocks: Array<TimetablesVehicleServiceBlock>;
  /** An aggregate relationship */
  blocks_aggregate: TimetablesVehicleServiceBlockAggregate;
  /** An object relationship */
  day_type: TimetablesServiceCalendarDayType;
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id: Scalars['uuid'];
  /** An object relationship */
  vehicle_schedule_frame: TimetablesVehicleScheduleVehicleScheduleFrame;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id: Scalars['uuid'];
  vehicle_service_id: Scalars['uuid'];
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleServiceBlocksArgs = {
  distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleServiceBlocksAggregateArgs = {
  distinct_on?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** aggregated selection of "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceAggregate = {
  __typename?: 'timetables_vehicle_service_vehicle_service_aggregate';
  aggregate?: Maybe<TimetablesVehicleServiceVehicleServiceAggregateFields>;
  nodes: Array<TimetablesVehicleServiceVehicleService>;
};

/** aggregate fields of "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceAggregateFields = {
  __typename?: 'timetables_vehicle_service_vehicle_service_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimetablesVehicleServiceVehicleServiceMaxFields>;
  min?: Maybe<TimetablesVehicleServiceVehicleServiceMinFields>;
};

/** aggregate fields of "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TimetablesVehicleServiceVehicleServiceSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceAggregateOrderBy = {
  count?: Maybe<OrderBy>;
  max?: Maybe<TimetablesVehicleServiceVehicleServiceMaxOrderBy>;
  min?: Maybe<TimetablesVehicleServiceVehicleServiceMinOrderBy>;
};

/** input type for inserting array relation for remote table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceArrRelInsertInput = {
  data: Array<TimetablesVehicleServiceVehicleServiceInsertInput>;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_service.vehicle_service". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleServiceVehicleServiceBoolExp = {
  _and?: Maybe<Array<TimetablesVehicleServiceVehicleServiceBoolExp>>;
  _not?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  _or?: Maybe<Array<TimetablesVehicleServiceVehicleServiceBoolExp>>;
  blocks?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  blocks_aggregate?: Maybe<VehicleServiceBlockAggregateBoolExp>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeBoolExp>;
  day_type_id?: Maybe<UuidComparisonExp>;
  vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  vehicle_schedule_frame_id?: Maybe<UuidComparisonExp>;
  vehicle_service_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceConstraint {
  /** unique or primary key constraint on columns "vehicle_service_id" */
  VehicleServicePkey = 'vehicle_service_pkey',
}

/** input type for inserting data into table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceInsertInput = {
  blocks?: Maybe<TimetablesVehicleServiceBlockArrRelInsertInput>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeObjRelInsertInput>;
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<Scalars['uuid']>;
  vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameObjRelInsertInput>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleServiceVehicleServiceMaxFields = {
  __typename?: 'timetables_vehicle_service_vehicle_service_max_fields';
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<Scalars['uuid']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceMaxOrderBy = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<OrderBy>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<OrderBy>;
  vehicle_service_id?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesVehicleServiceVehicleServiceMinFields = {
  __typename?: 'timetables_vehicle_service_vehicle_service_min_fields';
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<Scalars['uuid']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceMinOrderBy = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<OrderBy>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<OrderBy>;
  vehicle_service_id?: Maybe<OrderBy>;
};

/** response of any mutation on the table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceMutationResponse = {
  __typename?: 'timetables_vehicle_service_vehicle_service_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesVehicleServiceVehicleService>;
};

/** input type for inserting object relation for remote table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceObjRelInsertInput = {
  data: TimetablesVehicleServiceVehicleServiceInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
};

/** on_conflict condition type for table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceOnConflict = {
  constraint: TimetablesVehicleServiceVehicleServiceConstraint;
  update_columns?: Array<TimetablesVehicleServiceVehicleServiceUpdateColumn>;
  where?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** Ordering options when selecting data from "vehicle_service.vehicle_service". */
export type TimetablesVehicleServiceVehicleServiceOrderBy = {
  blocks_aggregate?: Maybe<TimetablesVehicleServiceBlockAggregateOrderBy>;
  day_type?: Maybe<TimetablesServiceCalendarDayTypeOrderBy>;
  day_type_id?: Maybe<OrderBy>;
  vehicle_schedule_frame?: Maybe<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>;
  vehicle_schedule_frame_id?: Maybe<OrderBy>;
  vehicle_service_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: vehicle_service.vehicle_service */
export type TimetablesVehicleServiceVehicleServicePkColumnsInput = {
  vehicle_service_id: Scalars['uuid'];
};

/** select columns of table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceSelectColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

/** input type for updating data in table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceSetInput = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<Scalars['uuid']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_service_vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleServiceVehicleServiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleServiceVehicleServiceStreamCursorValueInput = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: Maybe<Scalars['uuid']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: Maybe<Scalars['uuid']>;
  vehicle_service_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceUpdateColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

export type TimetablesVehicleServiceVehicleServiceUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimetablesVehicleServiceVehicleServiceSetInput>;
  where: TimetablesVehicleServiceVehicleServiceBoolExp;
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlace = {
  __typename?: 'timing_pattern_timing_place';
  description?: Maybe<Scalars['jsonb']>;
  label: Scalars['String'];
  /** An array relationship */
  scheduled_stop_points: Array<ServicePatternScheduledStopPoint>;
  /** An aggregate relationship */
  scheduled_stop_points_aggregate: ServicePatternScheduledStopPointAggregate;
  timing_place_id: Scalars['uuid'];
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlaceDescriptionArgs = {
  path?: Maybe<Scalars['String']>;
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlaceScheduledStopPointsArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlaceScheduledStopPointsAggregateArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/** aggregated selection of "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceAggregate = {
  __typename?: 'timing_pattern_timing_place_aggregate';
  aggregate?: Maybe<TimingPatternTimingPlaceAggregateFields>;
  nodes: Array<TimingPatternTimingPlace>;
};

/** aggregate fields of "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceAggregateFields = {
  __typename?: 'timing_pattern_timing_place_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<TimingPatternTimingPlaceMaxFields>;
  min?: Maybe<TimingPatternTimingPlaceMinFields>;
};

/** aggregate fields of "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceAggregateFieldsCountArgs = {
  columns?: Maybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimingPatternTimingPlaceAppendInput = {
  description?: Maybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "timing_pattern.timing_place". All fields are combined with a logical 'AND'. */
export type TimingPatternTimingPlaceBoolExp = {
  _and?: Maybe<Array<TimingPatternTimingPlaceBoolExp>>;
  _not?: Maybe<TimingPatternTimingPlaceBoolExp>;
  _or?: Maybe<Array<TimingPatternTimingPlaceBoolExp>>;
  description?: Maybe<JsonbComparisonExp>;
  label?: Maybe<StringComparisonExp>;
  scheduled_stop_points?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  timing_place_id?: Maybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "timing_pattern.timing_place" */
export enum TimingPatternTimingPlaceConstraint {
  /** unique or primary key constraint on columns "label" */
  TimingPlaceLabelIdx = 'timing_place_label_idx',
  /** unique or primary key constraint on columns "timing_place_id" */
  TimingPlacePkey = 'timing_place_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimingPatternTimingPlaceDeleteAtPathInput = {
  description?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimingPatternTimingPlaceDeleteElemInput = {
  description?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimingPatternTimingPlaceDeleteKeyInput = {
  description?: Maybe<Scalars['String']>;
};

/** input type for inserting data into table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceInsertInput = {
  description?: Maybe<Scalars['jsonb']>;
  label?: Maybe<Scalars['String']>;
  scheduled_stop_points?: Maybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  timing_place_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimingPatternTimingPlaceMaxFields = {
  __typename?: 'timing_pattern_timing_place_max_fields';
  label?: Maybe<Scalars['String']>;
  timing_place_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type TimingPatternTimingPlaceMinFields = {
  __typename?: 'timing_pattern_timing_place_min_fields';
  label?: Maybe<Scalars['String']>;
  timing_place_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceMutationResponse = {
  __typename?: 'timing_pattern_timing_place_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimingPatternTimingPlace>;
};

/** input type for inserting object relation for remote table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceObjRelInsertInput = {
  data: TimingPatternTimingPlaceInsertInput;
  /** upsert condition */
  on_conflict?: Maybe<TimingPatternTimingPlaceOnConflict>;
};

/** on_conflict condition type for table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceOnConflict = {
  constraint: TimingPatternTimingPlaceConstraint;
  update_columns?: Array<TimingPatternTimingPlaceUpdateColumn>;
  where?: Maybe<TimingPatternTimingPlaceBoolExp>;
};

/** Ordering options when selecting data from "timing_pattern.timing_place". */
export type TimingPatternTimingPlaceOrderBy = {
  description?: Maybe<OrderBy>;
  label?: Maybe<OrderBy>;
  scheduled_stop_points_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  timing_place_id?: Maybe<OrderBy>;
};

/** primary key columns input for table: timing_pattern.timing_place */
export type TimingPatternTimingPlacePkColumnsInput = {
  timing_place_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimingPatternTimingPlacePrependInput = {
  description?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "timing_pattern.timing_place" */
export enum TimingPatternTimingPlaceSelectColumn {
  /** column name */
  Description = 'description',
  /** column name */
  Label = 'label',
  /** column name */
  TimingPlaceId = 'timing_place_id',
}

/** input type for updating data in table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceSetInput = {
  description?: Maybe<Scalars['jsonb']>;
  label?: Maybe<Scalars['String']>;
  timing_place_id?: Maybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "timing_pattern_timing_place" */
export type TimingPatternTimingPlaceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimingPatternTimingPlaceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: Maybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimingPatternTimingPlaceStreamCursorValueInput = {
  description?: Maybe<Scalars['jsonb']>;
  label?: Maybe<Scalars['String']>;
  timing_place_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "timing_pattern.timing_place" */
export enum TimingPatternTimingPlaceUpdateColumn {
  /** column name */
  Description = 'description',
  /** column name */
  Label = 'label',
  /** column name */
  TimingPlaceId = 'timing_place_id',
}

export type TimingPatternTimingPlaceUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: Maybe<TimingPatternTimingPlaceAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: Maybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: Maybe<TimingPatternTimingPlaceDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: Maybe<TimingPatternTimingPlaceDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: Maybe<TimingPatternTimingPlacePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: Maybe<TimingPatternTimingPlaceSetInput>;
  where: TimingPatternTimingPlaceBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
};

export type ValidityPeriod = {
  validity_end?: Maybe<Scalars['date']>;
  validity_start?: Maybe<Scalars['date']>;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExp = {
  count?: Maybe<VehicleJourneyVehicleJourneyAggregateBoolExpCount>;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExpCount = {
  arguments?: Maybe<Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  predicate: IntComparisonExp;
};

export type VehicleServiceBlockAggregateBoolExp = {
  count?: Maybe<VehicleServiceBlockAggregateBoolExpCount>;
};

export type VehicleServiceBlockAggregateBoolExpCount = {
  arguments?: Maybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<TimetablesVehicleServiceBlockBoolExp>;
  predicate: IntComparisonExp;
};

export type VehicleServiceVehicleServiceAggregateBoolExp = {
  count?: Maybe<VehicleServiceVehicleServiceAggregateBoolExpCount>;
};

export type VehicleServiceVehicleServiceAggregateBoolExpCount = {
  arguments?: Maybe<Array<TimetablesVehicleServiceVehicleServiceSelectColumn>>;
  distinct?: Maybe<Scalars['Boolean']>;
  filter?: Maybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  predicate: IntComparisonExp;
};

export type LineTableRowFragment = {
  __typename?: 'route_line';
  name_i18n: LocalizedString;
  short_name_i18n: LocalizedString;
  priority: number;
  line_id: UUID;
  label: string;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  line_routes: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    route_shape?: GeoJSON.LineString | null | undefined;
    label: string;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      journey_pattern_refs: Array<{
        __typename?: 'timetables_journey_pattern_journey_pattern_ref';
        journey_pattern_ref_id: UUID;
        vehicle_journeys: Array<{
          __typename?: 'timetables_vehicle_journey_vehicle_journey';
          vehicle_journey_id: UUID;
        }>;
      }>;
    }>;
  }>;
};

export type RouteTableRowFragment = {
  __typename?: 'route_route';
  name_i18n: LocalizedString;
  direction: RouteDirectionEnum;
  priority: number;
  on_line_id: UUID;
  variant?: number | null | undefined;
  route_id: UUID;
  label: string;
  route_shape?: GeoJSON.LineString | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  route_journey_patterns: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    journey_pattern_refs: Array<{
      __typename?: 'timetables_journey_pattern_journey_pattern_ref';
      journey_pattern_ref_id: UUID;
      vehicle_journeys: Array<{
        __typename?: 'timetables_vehicle_journey_vehicle_journey';
        vehicle_journey_id: UUID;
      }>;
    }>;
  }>;
};

export type GetRouteWithInfrastructureLinksQueryVariables = Exact<{
  route_id: Scalars['uuid'];
}>;

export type GetRouteWithInfrastructureLinksQuery = {
  __typename?: 'query_root';
  route_route_by_pk?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        name_i18n: LocalizedString;
        description_i18n?: LocalizedString | null | undefined;
        origin_name_i18n: LocalizedString;
        origin_short_name_i18n: LocalizedString;
        destination_name_i18n: LocalizedString;
        destination_short_name_i18n: LocalizedString;
        route_shape?: GeoJSON.LineString | null | undefined;
        on_line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        variant?: number | null | undefined;
        direction: RouteDirectionEnum;
        route_line: {
          __typename?: 'route_line';
          line_id: UUID;
          name_i18n: LocalizedString;
          short_name_i18n: LocalizedString;
          primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
          type_of_line: RouteTypeOfLineEnum;
          transport_target: HslRouteTransportTargetEnum;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
        };
        infrastructure_links_along_route: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          route_id: UUID;
          infrastructure_link_sequence: number;
          infrastructure_link_id: UUID;
          is_traversal_forwards: boolean;
          infrastructure_link: {
            __typename?: 'infrastructure_network_infrastructure_link';
            infrastructure_link_id: UUID;
            shape: GeoJSON.LineString;
            direction: InfrastructureNetworkDirectionEnum;
          };
        }>;
        route_journey_patterns: Array<{
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
          scheduled_stop_point_in_journey_patterns: Array<{
            __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
            journey_pattern_id: UUID;
            scheduled_stop_point_label: string;
            scheduled_stop_point_sequence: number;
            is_used_as_timing_point: boolean;
            is_regulated_timing_point: boolean;
            is_loading_time_allowed: boolean;
            is_via_point: boolean;
            via_point_name_i18n?: LocalizedString | null | undefined;
            via_point_short_name_i18n?: LocalizedString | null | undefined;
            scheduled_stop_points: Array<{
              __typename?: 'service_pattern_scheduled_stop_point';
              priority: number;
              direction: InfrastructureNetworkDirectionEnum;
              scheduled_stop_point_id: UUID;
              label: string;
              validity_start?: luxon.DateTime | null | undefined;
              validity_end?: luxon.DateTime | null | undefined;
              located_on_infrastructure_link_id: UUID;
            }>;
            journey_pattern: {
              __typename?: 'journey_pattern_journey_pattern';
              journey_pattern_id: UUID;
              on_route_id: UUID;
            };
          }>;
        }>;
      }
    | null
    | undefined;
};

export type StopPopupInfoFragment = {
  __typename?: 'service_pattern_scheduled_stop_point';
  label: string;
  priority: number;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  measured_location: GeoJSON.Point;
};

export type ListChangingRoutesQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
}>;

export type ListChangingRoutesQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    name_i18n: LocalizedString;
    direction: RouteDirectionEnum;
    priority: number;
    on_line_id: UUID;
    variant?: number | null | undefined;
    route_id: UUID;
    label: string;
    route_shape?: GeoJSON.LineString | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      journey_pattern_refs: Array<{
        __typename?: 'timetables_journey_pattern_journey_pattern_ref';
        journey_pattern_ref_id: UUID;
        vehicle_journeys: Array<{
          __typename?: 'timetables_vehicle_journey_vehicle_journey';
          vehicle_journey_id: UUID;
        }>;
      }>;
    }>;
  }>;
};

export type ListOwnLinesQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
}>;

export type ListOwnLinesQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    priority: number;
    line_id: UUID;
    label: string;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    line_routes: Array<{
      __typename?: 'route_route';
      route_id: UUID;
      route_shape?: GeoJSON.LineString | null | undefined;
      label: string;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      route_journey_patterns: Array<{
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        journey_pattern_refs: Array<{
          __typename?: 'timetables_journey_pattern_journey_pattern_ref';
          journey_pattern_ref_id: UUID;
          vehicle_journeys: Array<{
            __typename?: 'timetables_vehicle_journey_vehicle_journey';
            vehicle_journey_id: UUID;
          }>;
        }>;
      }>;
    }>;
  }>;
};

export type ScheduledStopPointWithTimingSettingsFragment = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  journey_pattern_id: UUID;
  scheduled_stop_point_label: string;
  scheduled_stop_point_sequence: number;
  is_used_as_timing_point: boolean;
  is_regulated_timing_point: boolean;
  is_loading_time_allowed: boolean;
  is_via_point: boolean;
  via_point_name_i18n?: LocalizedString | null | undefined;
  via_point_short_name_i18n?: LocalizedString | null | undefined;
  journey_pattern: {
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    on_route_id: UUID;
    journey_pattern_route?:
      | { __typename?: 'route_route'; route_id: UUID; label: string }
      | null
      | undefined;
  };
  scheduled_stop_points: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    timing_place_id?: UUID | null | undefined;
  }>;
};

export type GetScheduledStopPointWithTimingSettingsQueryVariables = Exact<{
  journeyPatternId: Scalars['uuid'];
  stopLabel: Scalars['String'];
  sequence: Scalars['Int'];
}>;

export type GetScheduledStopPointWithTimingSettingsQuery = {
  __typename?: 'query_root';
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<{
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_label: string;
    scheduled_stop_point_sequence: number;
    is_used_as_timing_point: boolean;
    is_regulated_timing_point: boolean;
    is_loading_time_allowed: boolean;
    is_via_point: boolean;
    via_point_name_i18n?: LocalizedString | null | undefined;
    via_point_short_name_i18n?: LocalizedString | null | undefined;
    journey_pattern: {
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
      journey_pattern_route?:
        | { __typename?: 'route_route'; route_id: UUID; label: string }
        | null
        | undefined;
    };
    scheduled_stop_points: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      scheduled_stop_point_id: UUID;
      timing_place_id?: UUID | null | undefined;
    }>;
  }>;
};

export type VehicleJourneyByStopFragment = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey';
  journey_pattern_ref_id: UUID;
  vehicle_journey_id: UUID;
  timetabled_passing_times: Array<{
    __typename?: 'timetables_passing_times_timetabled_passing_time';
    arrival_time?: luxon.Duration | null | undefined;
    departure_time?: luxon.Duration | null | undefined;
    passing_time: luxon.Duration;
    scheduled_stop_point_in_journey_pattern_ref_id: UUID;
    timetabled_passing_time_id: UUID;
    vehicle_journey_id: UUID;
    scheduled_stop_point_in_journey_pattern_ref: {
      __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
      scheduled_stop_point_in_journey_pattern_ref_id: UUID;
      scheduled_stop_point_label: string;
    };
  }>;
};

export type PassingTimeByStopFragment = {
  __typename?: 'timetables_passing_times_timetabled_passing_time';
  arrival_time?: luxon.Duration | null | undefined;
  departure_time?: luxon.Duration | null | undefined;
  passing_time: luxon.Duration;
  scheduled_stop_point_in_journey_pattern_ref_id: UUID;
  timetabled_passing_time_id: UUID;
  vehicle_journey_id: UUID;
  scheduled_stop_point_in_journey_pattern_ref: {
    __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
    scheduled_stop_point_in_journey_pattern_ref_id: UUID;
    scheduled_stop_point_label: string;
  };
};

export type GetVehicleJourneysQueryVariables = Exact<{ [key: string]: never }>;

export type GetVehicleJourneysQuery = {
  __typename?: 'query_root';
  timetables?:
    | {
        __typename?: 'timetables_timetables_query';
        timetables_vehicle_journey_vehicle_journey: Array<{
          __typename?: 'timetables_vehicle_journey_vehicle_journey';
          journey_pattern_ref_id: UUID;
          vehicle_journey_id: UUID;
          timetabled_passing_times: Array<{
            __typename?: 'timetables_passing_times_timetabled_passing_time';
            arrival_time?: luxon.Duration | null | undefined;
            departure_time?: luxon.Duration | null | undefined;
            passing_time: luxon.Duration;
            scheduled_stop_point_in_journey_pattern_ref_id: UUID;
            timetabled_passing_time_id: UUID;
            vehicle_journey_id: UUID;
            scheduled_stop_point_in_journey_pattern_ref: {
              __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
              scheduled_stop_point_in_journey_pattern_ref_id: UUID;
              scheduled_stop_point_label: string;
            };
          }>;
        }>;
      }
    | null
    | undefined;
};

export type RouteInfraLinkFieldsFragment = {
  __typename?: 'infrastructure_network_infrastructure_link';
  external_link_id: string;
  infrastructure_link_id: UUID;
  shape: GeoJSON.LineString;
  direction: InfrastructureNetworkDirectionEnum;
  scheduled_stop_points_located_on_infrastructure_link: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    other_label_instances: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      priority: number;
      direction: InfrastructureNetworkDirectionEnum;
      scheduled_stop_point_id: UUID;
      label: string;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      located_on_infrastructure_link_id: UUID;
    }>;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
      is_used_as_timing_point: boolean;
      is_regulated_timing_point: boolean;
      is_loading_time_allowed: boolean;
      is_via_point: boolean;
      via_point_name_i18n?: LocalizedString | null | undefined;
      via_point_short_name_i18n?: LocalizedString | null | undefined;
      journey_pattern: {
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        on_route_id: UUID;
      };
    }>;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type InfrastructureLinkAllFieldsFragment = {
  __typename?: 'infrastructure_network_infrastructure_link';
  infrastructure_link_id: UUID;
  direction: InfrastructureNetworkDirectionEnum;
  shape: GeoJSON.LineString;
  estimated_length_in_metres?: number | null | undefined;
  external_link_id: string;
  external_link_source: InfrastructureNetworkExternalSourceEnum;
};

export type InfraLinkMatchingFieldsFragment = {
  __typename?: 'infrastructure_network_infrastructure_link';
  external_link_id: string;
  infrastructure_link_id: UUID;
  shape: GeoJSON.LineString;
  direction: InfrastructureNetworkDirectionEnum;
};

export type QueryClosestLinkQueryVariables = Exact<{
  point?: Maybe<Scalars['geography']>;
}>;

export type QueryClosestLinkQuery = {
  __typename?: 'query_root';
  infrastructure_network_resolve_point_to_closest_link: Array<{
    __typename?: 'infrastructure_network_infrastructure_link';
    infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    shape: GeoJSON.LineString;
    estimated_length_in_metres?: number | null | undefined;
    external_link_id: string;
    external_link_source: InfrastructureNetworkExternalSourceEnum;
  }>;
};

export type QueryPointDirectionOnLinkQueryVariables = Exact<{
  point_of_interest?: Maybe<Scalars['geography']>;
  infrastructure_link_uuid?: Maybe<Scalars['uuid']>;
  point_max_distance_in_meters?: Maybe<Scalars['float8']>;
}>;

export type QueryPointDirectionOnLinkQuery = {
  __typename?: 'query_root';
  infrastructure_network_find_point_direction_on_link: Array<{
    __typename?: 'infrastructure_network_direction';
    value: InfrastructureNetworkDirectionEnum;
  }>;
};

export type GetStopsAlongInfrastructureLinksQueryVariables = Exact<{
  infrastructure_link_ids?: Maybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;

export type GetStopsAlongInfrastructureLinksQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type ScheduledStopPointInJourneyPatternAllFieldsFragment = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  journey_pattern_id: UUID;
  scheduled_stop_point_label: string;
  scheduled_stop_point_sequence: number;
  is_used_as_timing_point: boolean;
  is_regulated_timing_point: boolean;
  is_loading_time_allowed: boolean;
  is_via_point: boolean;
  via_point_name_i18n?: LocalizedString | null | undefined;
  via_point_short_name_i18n?: LocalizedString | null | undefined;
  journey_pattern: {
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    on_route_id: UUID;
  };
};

export type JourneyPatternWithStopsFragment = {
  __typename?: 'journey_pattern_journey_pattern';
  journey_pattern_id: UUID;
  on_route_id: UUID;
  scheduled_stop_point_in_journey_patterns: Array<{
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_label: string;
    scheduled_stop_point_sequence: number;
    is_used_as_timing_point: boolean;
    is_regulated_timing_point: boolean;
    is_loading_time_allowed: boolean;
    is_via_point: boolean;
    via_point_name_i18n?: LocalizedString | null | undefined;
    via_point_short_name_i18n?: LocalizedString | null | undefined;
    scheduled_stop_points: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      priority: number;
      direction: InfrastructureNetworkDirectionEnum;
      scheduled_stop_point_id: UUID;
      label: string;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      located_on_infrastructure_link_id: UUID;
    }>;
    journey_pattern: {
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
    };
  }>;
};

export type PatchScheduledStopPointViaInfoMutationVariables = Exact<{
  stopLabel: Scalars['String'];
  journeyPatternId: Scalars['uuid'];
  patch: JourneyPatternScheduledStopPointInJourneyPatternSetInput;
}>;

export type PatchScheduledStopPointViaInfoMutation = {
  __typename?: 'mutation_root';
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          is_used_as_timing_point: boolean;
          is_regulated_timing_point: boolean;
          is_loading_time_allowed: boolean;
          is_via_point: boolean;
          via_point_name_i18n?: LocalizedString | null | undefined;
          via_point_short_name_i18n?: LocalizedString | null | undefined;
          journey_pattern: {
            __typename?: 'journey_pattern_journey_pattern';
            journey_pattern_id: UUID;
            on_route_id: UUID;
          };
        }>;
      }
    | null
    | undefined;
};

export type RemoveScheduledStopPointViaInfoMutationVariables = Exact<{
  stopLabel: Scalars['String'];
  journeyPatternId: Scalars['uuid'];
}>;

export type RemoveScheduledStopPointViaInfoMutation = {
  __typename?: 'mutation_root';
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          is_used_as_timing_point: boolean;
          is_regulated_timing_point: boolean;
          is_loading_time_allowed: boolean;
          is_via_point: boolean;
          via_point_name_i18n?: LocalizedString | null | undefined;
          via_point_short_name_i18n?: LocalizedString | null | undefined;
          journey_pattern: {
            __typename?: 'journey_pattern_journey_pattern';
            journey_pattern_id: UUID;
            on_route_id: UUID;
          };
        }>;
      }
    | null
    | undefined;
};

export type GetScheduledStopPointWithViaInfoQueryVariables = Exact<{
  journeyPatternId: Scalars['uuid'];
  stopLabel: Scalars['String'];
}>;

export type GetScheduledStopPointWithViaInfoQuery = {
  __typename?: 'query_root';
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<{
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_label: string;
    scheduled_stop_point_sequence: number;
    is_used_as_timing_point: boolean;
    is_regulated_timing_point: boolean;
    is_loading_time_allowed: boolean;
    is_via_point: boolean;
    via_point_name_i18n?: LocalizedString | null | undefined;
    via_point_short_name_i18n?: LocalizedString | null | undefined;
    journey_pattern: {
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
      journey_pattern_route?:
        | { __typename?: 'route_route'; route_id: UUID; label: string }
        | null
        | undefined;
    };
  }>;
};

export type LineDefaultFieldsFragment = {
  __typename?: 'route_line';
  line_id: UUID;
  label: string;
  name_i18n: LocalizedString;
  short_name_i18n: LocalizedString;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
};

export type LineAllFieldsFragment = {
  __typename?: 'route_line';
  line_id: UUID;
  name_i18n: LocalizedString;
  short_name_i18n: LocalizedString;
  primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
  type_of_line: RouteTypeOfLineEnum;
  transport_target: HslRouteTransportTargetEnum;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  label: string;
};

export type RouteValidityFragment = {
  __typename?: 'route_route';
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
};

export type RouteAllFieldsFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString | null | undefined;
  origin_name_i18n: LocalizedString;
  origin_short_name_i18n: LocalizedString;
  destination_name_i18n: LocalizedString;
  destination_short_name_i18n: LocalizedString;
  route_shape?: GeoJSON.LineString | null | undefined;
  on_line_id: UUID;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  label: string;
  variant?: number | null | undefined;
  direction: RouteDirectionEnum;
};

export type RouteDefaultFieldsFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString | null | undefined;
  origin_name_i18n: LocalizedString;
  origin_short_name_i18n: LocalizedString;
  destination_name_i18n: LocalizedString;
  destination_short_name_i18n: LocalizedString;
  on_line_id: UUID;
  label: string;
  variant?: number | null | undefined;
  priority: number;
};

export type RouteWithJourneyPatternStopsFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString | null | undefined;
  origin_name_i18n: LocalizedString;
  origin_short_name_i18n: LocalizedString;
  destination_name_i18n: LocalizedString;
  destination_short_name_i18n: LocalizedString;
  route_shape?: GeoJSON.LineString | null | undefined;
  on_line_id: UUID;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  label: string;
  variant?: number | null | undefined;
  direction: RouteDirectionEnum;
  route_journey_patterns: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    on_route_id: UUID;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
      is_used_as_timing_point: boolean;
      is_regulated_timing_point: boolean;
      is_loading_time_allowed: boolean;
      is_via_point: boolean;
      via_point_name_i18n?: LocalizedString | null | undefined;
      via_point_short_name_i18n?: LocalizedString | null | undefined;
      scheduled_stop_points: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
      journey_pattern: {
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        on_route_id: UUID;
      };
    }>;
  }>;
};

export type RouteWithInfrastructureLinksFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString | null | undefined;
  origin_name_i18n: LocalizedString;
  origin_short_name_i18n: LocalizedString;
  destination_name_i18n: LocalizedString;
  destination_short_name_i18n: LocalizedString;
  route_shape?: GeoJSON.LineString | null | undefined;
  on_line_id: UUID;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  label: string;
  variant?: number | null | undefined;
  direction: RouteDirectionEnum;
  route_line: {
    __typename?: 'route_line';
    line_id: UUID;
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    type_of_line: RouteTypeOfLineEnum;
    transport_target: HslRouteTransportTargetEnum;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
  };
  infrastructure_links_along_route: Array<{
    __typename?: 'route_infrastructure_link_along_route';
    route_id: UUID;
    infrastructure_link_sequence: number;
    infrastructure_link_id: UUID;
    is_traversal_forwards: boolean;
    infrastructure_link: {
      __typename?: 'infrastructure_network_infrastructure_link';
      infrastructure_link_id: UUID;
      shape: GeoJSON.LineString;
      direction: InfrastructureNetworkDirectionEnum;
    };
  }>;
  route_journey_patterns: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    on_route_id: UUID;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
      is_used_as_timing_point: boolean;
      is_regulated_timing_point: boolean;
      is_loading_time_allowed: boolean;
      is_via_point: boolean;
      via_point_name_i18n?: LocalizedString | null | undefined;
      via_point_short_name_i18n?: LocalizedString | null | undefined;
      scheduled_stop_points: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
      journey_pattern: {
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        on_route_id: UUID;
      };
    }>;
  }>;
};

export type GetLineDetailsByIdQueryVariables = Exact<{
  line_id: Scalars['uuid'];
}>;

export type GetLineDetailsByIdQuery = {
  __typename?: 'query_root';
  route_line_by_pk?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        name_i18n: LocalizedString;
        short_name_i18n: LocalizedString;
        primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
        type_of_line: RouteTypeOfLineEnum;
        transport_target: HslRouteTransportTargetEnum;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
      }
    | null
    | undefined;
};

export type GetLineValidityPeriodByIdQueryVariables = Exact<{
  line_id: Scalars['uuid'];
}>;

export type GetLineValidityPeriodByIdQuery = {
  __typename?: 'query_root';
  route_line_by_pk?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
      }
    | null
    | undefined;
};

export type GetLinesByValidityQueryVariables = Exact<{
  filter?: Maybe<RouteLineBoolExp>;
}>;

export type GetLinesByValidityQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    line_id: UUID;
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    type_of_line: RouteTypeOfLineEnum;
    transport_target: HslRouteTransportTargetEnum;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
  }>;
};

export type GetLineDetailsWithRoutesByIdQueryVariables = Exact<{
  line_id: Scalars['uuid'];
}>;

export type GetLineDetailsWithRoutesByIdQuery = {
  __typename?: 'query_root';
  route_line_by_pk?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        name_i18n: LocalizedString;
        short_name_i18n: LocalizedString;
        primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
        type_of_line: RouteTypeOfLineEnum;
        transport_target: HslRouteTransportTargetEnum;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        line_routes: Array<{
          __typename?: 'route_route';
          route_id: UUID;
          name_i18n: LocalizedString;
          description_i18n?: LocalizedString | null | undefined;
          origin_name_i18n: LocalizedString;
          origin_short_name_i18n: LocalizedString;
          destination_name_i18n: LocalizedString;
          destination_short_name_i18n: LocalizedString;
          route_shape?: GeoJSON.LineString | null | undefined;
          on_line_id: UUID;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
          variant?: number | null | undefined;
          direction: RouteDirectionEnum;
          infrastructure_links_along_route: Array<{
            __typename?: 'route_infrastructure_link_along_route';
            route_id: UUID;
            infrastructure_link_id: UUID;
            infrastructure_link_sequence: number;
            is_traversal_forwards: boolean;
            infrastructure_link: {
              __typename?: 'infrastructure_network_infrastructure_link';
              infrastructure_link_id: UUID;
              scheduled_stop_points_located_on_infrastructure_link: Array<{
                __typename?: 'service_pattern_scheduled_stop_point';
                scheduled_stop_point_id: UUID;
                label: string;
                measured_location: GeoJSON.Point;
                located_on_infrastructure_link_id: UUID;
                direction: InfrastructureNetworkDirectionEnum;
                relative_distance_from_infrastructure_link_start: number;
                closest_point_on_infrastructure_link?:
                  | GeoJSON.Point
                  | null
                  | undefined;
                validity_start?: luxon.DateTime | null | undefined;
                validity_end?: luxon.DateTime | null | undefined;
                priority: number;
                timing_place_id?: UUID | null | undefined;
                scheduled_stop_point_in_journey_patterns: Array<{
                  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
                  journey_pattern_id: UUID;
                  scheduled_stop_point_label: string;
                  scheduled_stop_point_sequence: number;
                  is_used_as_timing_point: boolean;
                  is_regulated_timing_point: boolean;
                  is_loading_time_allowed: boolean;
                  is_via_point: boolean;
                  via_point_name_i18n?: LocalizedString | null | undefined;
                  via_point_short_name_i18n?:
                    | LocalizedString
                    | null
                    | undefined;
                  journey_pattern: {
                    __typename?: 'journey_pattern_journey_pattern';
                    journey_pattern_id: UUID;
                    on_route_id: UUID;
                  };
                }>;
                other_label_instances: Array<{
                  __typename?: 'service_pattern_scheduled_stop_point';
                  priority: number;
                  direction: InfrastructureNetworkDirectionEnum;
                  scheduled_stop_point_id: UUID;
                  label: string;
                  validity_start?: luxon.DateTime | null | undefined;
                  validity_end?: luxon.DateTime | null | undefined;
                  located_on_infrastructure_link_id: UUID;
                }>;
                vehicle_mode_on_scheduled_stop_point: Array<{
                  __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
                  vehicle_mode: ReusableComponentsVehicleModeEnum;
                }>;
              }>;
            };
          }>;
        }>;
      }
    | null
    | undefined;
};

export type GetHighestPriorityLineDetailsWithRoutesQueryVariables = Exact<{
  lineFilters?: Maybe<RouteLineBoolExp>;
  lineRouteFilters?: Maybe<RouteRouteBoolExp>;
  routeStopFilters?: Maybe<ServicePatternScheduledStopPointBoolExp>;
}>;

export type GetHighestPriorityLineDetailsWithRoutesQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    line_id: UUID;
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    type_of_line: RouteTypeOfLineEnum;
    transport_target: HslRouteTransportTargetEnum;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    line_routes: Array<{
      __typename?: 'route_route';
      route_id: UUID;
      name_i18n: LocalizedString;
      description_i18n?: LocalizedString | null | undefined;
      origin_name_i18n: LocalizedString;
      origin_short_name_i18n: LocalizedString;
      destination_name_i18n: LocalizedString;
      destination_short_name_i18n: LocalizedString;
      route_shape?: GeoJSON.LineString | null | undefined;
      on_line_id: UUID;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      priority: number;
      label: string;
      variant?: number | null | undefined;
      direction: RouteDirectionEnum;
      infrastructure_links_along_route: Array<{
        __typename?: 'route_infrastructure_link_along_route';
        route_id: UUID;
        infrastructure_link_id: UUID;
        infrastructure_link_sequence: number;
        is_traversal_forwards: boolean;
        infrastructure_link: {
          __typename?: 'infrastructure_network_infrastructure_link';
          infrastructure_link_id: UUID;
          scheduled_stop_points_located_on_infrastructure_link: Array<{
            __typename?: 'service_pattern_scheduled_stop_point';
            scheduled_stop_point_id: UUID;
            label: string;
            measured_location: GeoJSON.Point;
            located_on_infrastructure_link_id: UUID;
            direction: InfrastructureNetworkDirectionEnum;
            relative_distance_from_infrastructure_link_start: number;
            closest_point_on_infrastructure_link?:
              | GeoJSON.Point
              | null
              | undefined;
            validity_start?: luxon.DateTime | null | undefined;
            validity_end?: luxon.DateTime | null | undefined;
            priority: number;
            timing_place_id?: UUID | null | undefined;
            other_label_instances: Array<{
              __typename?: 'service_pattern_scheduled_stop_point';
              priority: number;
              direction: InfrastructureNetworkDirectionEnum;
              scheduled_stop_point_id: UUID;
              label: string;
              validity_start?: luxon.DateTime | null | undefined;
              validity_end?: luxon.DateTime | null | undefined;
              located_on_infrastructure_link_id: UUID;
            }>;
            scheduled_stop_point_in_journey_patterns: Array<{
              __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
              journey_pattern_id: UUID;
              scheduled_stop_point_label: string;
              scheduled_stop_point_sequence: number;
              is_used_as_timing_point: boolean;
              is_regulated_timing_point: boolean;
              is_loading_time_allowed: boolean;
              is_via_point: boolean;
              via_point_name_i18n?: LocalizedString | null | undefined;
              via_point_short_name_i18n?: LocalizedString | null | undefined;
              journey_pattern: {
                __typename?: 'journey_pattern_journey_pattern';
                journey_pattern_id: UUID;
                on_route_id: UUID;
              };
            }>;
            vehicle_mode_on_scheduled_stop_point: Array<{
              __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
              vehicle_mode: ReusableComponentsVehicleModeEnum;
            }>;
          }>;
        };
      }>;
      route_journey_patterns: Array<{
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
      }>;
    }>;
  }>;
};

export type GetRoutesWithStopsQueryVariables = Exact<{
  routeFilters?: Maybe<RouteRouteBoolExp>;
}>;

export type GetRoutesWithStopsQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    route_shape?: GeoJSON.LineString | null | undefined;
    on_line_id: UUID;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    variant?: number | null | undefined;
    direction: RouteDirectionEnum;
    route_line: { __typename?: 'route_line'; line_id: UUID };
    infrastructure_links_along_route: Array<{
      __typename?: 'route_infrastructure_link_along_route';
      route_id: UUID;
      infrastructure_link_id: UUID;
      infrastructure_link_sequence: number;
      is_traversal_forwards: boolean;
      infrastructure_link: {
        __typename?: 'infrastructure_network_infrastructure_link';
        infrastructure_link_id: UUID;
        scheduled_stop_points_located_on_infrastructure_link: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          scheduled_stop_point_id: UUID;
          label: string;
          measured_location: GeoJSON.Point;
          located_on_infrastructure_link_id: UUID;
          direction: InfrastructureNetworkDirectionEnum;
          relative_distance_from_infrastructure_link_start: number;
          closest_point_on_infrastructure_link?:
            | GeoJSON.Point
            | null
            | undefined;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          timing_place_id?: UUID | null | undefined;
          scheduled_stop_point_in_journey_patterns: Array<{
            __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
            journey_pattern_id: UUID;
            scheduled_stop_point_label: string;
            scheduled_stop_point_sequence: number;
            is_used_as_timing_point: boolean;
            is_regulated_timing_point: boolean;
            is_loading_time_allowed: boolean;
            is_via_point: boolean;
            via_point_name_i18n?: LocalizedString | null | undefined;
            via_point_short_name_i18n?: LocalizedString | null | undefined;
            journey_pattern: {
              __typename?: 'journey_pattern_journey_pattern';
              journey_pattern_id: UUID;
              on_route_id: UUID;
            };
          }>;
          vehicle_mode_on_scheduled_stop_point: Array<{
            __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
            vehicle_mode: ReusableComponentsVehicleModeEnum;
          }>;
        }>;
      };
    }>;
  }>;
};

export type GetRouteDetailsByIdQueryVariables = Exact<{
  routeId: Scalars['uuid'];
}>;

export type GetRouteDetailsByIdQuery = {
  __typename?: 'query_root';
  route_route_by_pk?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        name_i18n: LocalizedString;
        description_i18n?: LocalizedString | null | undefined;
        origin_name_i18n: LocalizedString;
        origin_short_name_i18n: LocalizedString;
        destination_name_i18n: LocalizedString;
        destination_short_name_i18n: LocalizedString;
        route_shape?: GeoJSON.LineString | null | undefined;
        on_line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        variant?: number | null | undefined;
        direction: RouteDirectionEnum;
        route_line: {
          __typename?: 'route_line';
          line_id: UUID;
          name_i18n: LocalizedString;
          short_name_i18n: LocalizedString;
          primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
          type_of_line: RouteTypeOfLineEnum;
          transport_target: HslRouteTransportTargetEnum;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
        };
        route_journey_patterns: Array<{
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
          scheduled_stop_point_in_journey_patterns: Array<{
            __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
            journey_pattern_id: UUID;
            scheduled_stop_point_label: string;
            scheduled_stop_point_sequence: number;
            is_used_as_timing_point: boolean;
            is_regulated_timing_point: boolean;
            is_loading_time_allowed: boolean;
            is_via_point: boolean;
            via_point_name_i18n?: LocalizedString | null | undefined;
            via_point_short_name_i18n?: LocalizedString | null | undefined;
            scheduled_stop_points: Array<{
              __typename?: 'service_pattern_scheduled_stop_point';
              priority: number;
              direction: InfrastructureNetworkDirectionEnum;
              scheduled_stop_point_id: UUID;
              label: string;
              validity_start?: luxon.DateTime | null | undefined;
              validity_end?: luxon.DateTime | null | undefined;
              located_on_infrastructure_link_id: UUID;
            }>;
            journey_pattern: {
              __typename?: 'journey_pattern_journey_pattern';
              journey_pattern_id: UUID;
              on_route_id: UUID;
            };
          }>;
        }>;
      }
    | null
    | undefined;
};

export type GetRouteDetailsByIdsQueryVariables = Exact<{
  route_ids?: Maybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;

export type GetRouteDetailsByIdsQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    route_shape?: GeoJSON.LineString | null | undefined;
    on_line_id: UUID;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    variant?: number | null | undefined;
    direction: RouteDirectionEnum;
    infrastructure_links_along_route: Array<{
      __typename?: 'route_infrastructure_link_along_route';
      route_id: UUID;
      infrastructure_link_id: UUID;
      infrastructure_link_sequence: number;
      is_traversal_forwards: boolean;
      infrastructure_link: {
        __typename?: 'infrastructure_network_infrastructure_link';
        infrastructure_link_id: UUID;
        scheduled_stop_points_located_on_infrastructure_link: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          scheduled_stop_point_id: UUID;
          label: string;
          measured_location: GeoJSON.Point;
          located_on_infrastructure_link_id: UUID;
          direction: InfrastructureNetworkDirectionEnum;
          relative_distance_from_infrastructure_link_start: number;
          closest_point_on_infrastructure_link?:
            | GeoJSON.Point
            | null
            | undefined;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          timing_place_id?: UUID | null | undefined;
          scheduled_stop_point_in_journey_patterns: Array<{
            __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
            journey_pattern_id: UUID;
            scheduled_stop_point_label: string;
            scheduled_stop_point_sequence: number;
            is_used_as_timing_point: boolean;
            is_regulated_timing_point: boolean;
            is_loading_time_allowed: boolean;
            is_via_point: boolean;
            via_point_name_i18n?: LocalizedString | null | undefined;
            via_point_short_name_i18n?: LocalizedString | null | undefined;
            journey_pattern: {
              __typename?: 'journey_pattern_journey_pattern';
              journey_pattern_id: UUID;
              on_route_id: UUID;
            };
          }>;
          vehicle_mode_on_scheduled_stop_point: Array<{
            __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
            vehicle_mode: ReusableComponentsVehicleModeEnum;
          }>;
        }>;
      };
    }>;
    route_line: {
      __typename?: 'route_line';
      line_id: UUID;
      label: string;
      primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    };
  }>;
};

export type GetRouteRenderInfoByIdQueryVariables = Exact<{
  routeId: Scalars['uuid'];
}>;

export type GetRouteRenderInfoByIdQuery = {
  __typename?: 'query_root';
  route_route_by_pk?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        route_shape?: GeoJSON.LineString | null | undefined;
        route_line: {
          __typename?: 'route_line';
          line_id: UUID;
          primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
        };
      }
    | null
    | undefined;
};

export type GetRouteDetailsByLabelsQueryVariables = Exact<{
  labels?: Maybe<Array<Scalars['String']> | Scalars['String']>;
  date?: Maybe<Scalars['date']>;
}>;

export type GetRouteDetailsByLabelsQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    route_shape?: GeoJSON.LineString | null | undefined;
    on_line_id: UUID;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    variant?: number | null | undefined;
    direction: RouteDirectionEnum;
    route_line: {
      __typename?: 'route_line';
      line_id: UUID;
      label: string;
      primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    };
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
      scheduled_stop_point_in_journey_patterns: Array<{
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_label: string;
        scheduled_stop_point_sequence: number;
        is_used_as_timing_point: boolean;
        is_regulated_timing_point: boolean;
        is_loading_time_allowed: boolean;
        is_via_point: boolean;
        via_point_name_i18n?: LocalizedString | null | undefined;
        via_point_short_name_i18n?: LocalizedString | null | undefined;
        scheduled_stop_points: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          priority: number;
          direction: InfrastructureNetworkDirectionEnum;
          scheduled_stop_point_id: UUID;
          label: string;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          located_on_infrastructure_link_id: UUID;
        }>;
        journey_pattern: {
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
        };
      }>;
    }>;
  }>;
};

export type GetRoutesWithInfrastructureLinksQueryVariables = Exact<{
  route_ids?: Maybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;

export type GetRoutesWithInfrastructureLinksQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    route_shape?: GeoJSON.LineString | null | undefined;
    on_line_id: UUID;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    variant?: number | null | undefined;
    direction: RouteDirectionEnum;
    route_line: {
      __typename?: 'route_line';
      line_id: UUID;
      name_i18n: LocalizedString;
      short_name_i18n: LocalizedString;
      primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
      type_of_line: RouteTypeOfLineEnum;
      transport_target: HslRouteTransportTargetEnum;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      priority: number;
      label: string;
    };
    infrastructure_links_along_route: Array<{
      __typename?: 'route_infrastructure_link_along_route';
      route_id: UUID;
      infrastructure_link_sequence: number;
      infrastructure_link_id: UUID;
      is_traversal_forwards: boolean;
      infrastructure_link: {
        __typename?: 'infrastructure_network_infrastructure_link';
        infrastructure_link_id: UUID;
        shape: GeoJSON.LineString;
        direction: InfrastructureNetworkDirectionEnum;
      };
    }>;
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
      scheduled_stop_point_in_journey_patterns: Array<{
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_label: string;
        scheduled_stop_point_sequence: number;
        is_used_as_timing_point: boolean;
        is_regulated_timing_point: boolean;
        is_loading_time_allowed: boolean;
        is_via_point: boolean;
        via_point_name_i18n?: LocalizedString | null | undefined;
        via_point_short_name_i18n?: LocalizedString | null | undefined;
        scheduled_stop_points: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          priority: number;
          direction: InfrastructureNetworkDirectionEnum;
          scheduled_stop_point_id: UUID;
          label: string;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          located_on_infrastructure_link_id: UUID;
        }>;
        journey_pattern: {
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
        };
      }>;
    }>;
  }>;
};

export type GetRoutesByValidityQueryVariables = Exact<{
  filter?: Maybe<RouteRouteBoolExp>;
}>;

export type GetRoutesByValidityQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    on_line_id: UUID;
    label: string;
    variant?: number | null | undefined;
    priority: number;
  }>;
};

export type InsertLineOneMutationVariables = Exact<{
  object: RouteLineInsertInput;
}>;

export type InsertLineOneMutation = {
  __typename?: 'mutation_root';
  insert_route_line_one?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        label: string;
        priority: number;
        primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
        transport_target: HslRouteTransportTargetEnum;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
      }
    | null
    | undefined;
};

export type PatchLineMutationVariables = Exact<{
  line_id: Scalars['uuid'];
  object: RouteLineSetInput;
}>;

export type PatchLineMutation = {
  __typename?: 'mutation_root';
  update_route_line_by_pk?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        name_i18n: LocalizedString;
        short_name_i18n: LocalizedString;
        primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
        type_of_line: RouteTypeOfLineEnum;
        transport_target: HslRouteTransportTargetEnum;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
      }
    | null
    | undefined;
};

export type InsertRouteOneMutationVariables = Exact<{
  object: RouteRouteInsertInput;
}>;

export type InsertRouteOneMutation = {
  __typename?: 'mutation_root';
  insert_route_route_one?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        name_i18n: LocalizedString;
        description_i18n?: LocalizedString | null | undefined;
        origin_name_i18n: LocalizedString;
        origin_short_name_i18n: LocalizedString;
        destination_name_i18n: LocalizedString;
        destination_short_name_i18n: LocalizedString;
        route_shape?: GeoJSON.LineString | null | undefined;
        on_line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        variant?: number | null | undefined;
        direction: RouteDirectionEnum;
      }
    | null
    | undefined;
};

export type PatchRouteMutationVariables = Exact<{
  route_id: Scalars['uuid'];
  object: RouteRouteSetInput;
}>;

export type PatchRouteMutation = {
  __typename?: 'mutation_root';
  update_route_route?:
    | {
        __typename?: 'route_route_mutation_response';
        returning: Array<{
          __typename?: 'route_route';
          route_id: UUID;
          name_i18n: LocalizedString;
          description_i18n?: LocalizedString | null | undefined;
          origin_name_i18n: LocalizedString;
          origin_short_name_i18n: LocalizedString;
          destination_name_i18n: LocalizedString;
          destination_short_name_i18n: LocalizedString;
          route_shape?: GeoJSON.LineString | null | undefined;
          on_line_id: UUID;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
          variant?: number | null | undefined;
          direction: RouteDirectionEnum;
        }>;
      }
    | null
    | undefined;
};

export type DeleteRouteMutationVariables = Exact<{
  route_id: Scalars['uuid'];
}>;

export type DeleteRouteMutation = {
  __typename?: 'mutation_root';
  delete_route_route?:
    | {
        __typename?: 'route_route_mutation_response';
        returning: Array<{ __typename?: 'route_route'; route_id: UUID }>;
      }
    | null
    | undefined;
};

export type GetScheduledStopsOnRouteQueryVariables = Exact<{
  routeId: Scalars['uuid'];
}>;

export type GetScheduledStopsOnRouteQuery = {
  __typename?: 'query_root';
  journey_pattern_journey_pattern: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_sequence: number;
      scheduled_stop_points: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
    }>;
  }>;
};

export type ScheduledStopPointDefaultFieldsFragment = {
  __typename?: 'service_pattern_scheduled_stop_point';
  priority: number;
  direction: InfrastructureNetworkDirectionEnum;
  scheduled_stop_point_id: UUID;
  label: string;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  located_on_infrastructure_link_id: UUID;
};

export type ScheduledStopPointAllFieldsFragment = {
  __typename?: 'service_pattern_scheduled_stop_point';
  scheduled_stop_point_id: UUID;
  label: string;
  measured_location: GeoJSON.Point;
  located_on_infrastructure_link_id: UUID;
  direction: InfrastructureNetworkDirectionEnum;
  relative_distance_from_infrastructure_link_start: number;
  closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  timing_place_id?: UUID | null | undefined;
  vehicle_mode_on_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;
};

export type StopWithJourneyPatternFieldsFragment = {
  __typename?: 'service_pattern_scheduled_stop_point';
  scheduled_stop_point_id: UUID;
  label: string;
  measured_location: GeoJSON.Point;
  located_on_infrastructure_link_id: UUID;
  direction: InfrastructureNetworkDirectionEnum;
  relative_distance_from_infrastructure_link_start: number;
  closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  timing_place_id?: UUID | null | undefined;
  scheduled_stop_point_in_journey_patterns: Array<{
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_label: string;
    scheduled_stop_point_sequence: number;
    is_used_as_timing_point: boolean;
    is_regulated_timing_point: boolean;
    is_loading_time_allowed: boolean;
    is_via_point: boolean;
    via_point_name_i18n?: LocalizedString | null | undefined;
    via_point_short_name_i18n?: LocalizedString | null | undefined;
    journey_pattern: {
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
    };
  }>;
  vehicle_mode_on_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;
};

export type RouteStopFieldsFragment = {
  __typename?: 'service_pattern_scheduled_stop_point';
  scheduled_stop_point_id: UUID;
  label: string;
  measured_location: GeoJSON.Point;
  located_on_infrastructure_link_id: UUID;
  direction: InfrastructureNetworkDirectionEnum;
  relative_distance_from_infrastructure_link_start: number;
  closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  timing_place_id?: UUID | null | undefined;
  other_label_instances: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    priority: number;
    direction: InfrastructureNetworkDirectionEnum;
    scheduled_stop_point_id: UUID;
    label: string;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    located_on_infrastructure_link_id: UUID;
  }>;
  scheduled_stop_point_in_journey_patterns: Array<{
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_label: string;
    scheduled_stop_point_sequence: number;
    is_used_as_timing_point: boolean;
    is_regulated_timing_point: boolean;
    is_loading_time_allowed: boolean;
    is_via_point: boolean;
    via_point_name_i18n?: LocalizedString | null | undefined;
    via_point_short_name_i18n?: LocalizedString | null | undefined;
    journey_pattern: {
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      on_route_id: UUID;
    };
  }>;
  vehicle_mode_on_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;
};

export type RemoveStopMutationVariables = Exact<{
  stop_id: Scalars['uuid'];
}>;

export type RemoveStopMutation = {
  __typename?: 'mutation_root';
  delete_service_pattern_scheduled_stop_point?:
    | {
        __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
        returning: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          scheduled_stop_point_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type GetStopsByLocationQueryVariables = Exact<{
  measured_location_filter?: Maybe<GeographyComparisonExp>;
}>;

export type GetStopsByLocationQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type GetStopsByValidityQueryVariables = Exact<{
  filter?: Maybe<ServicePatternScheduledStopPointBoolExp>;
}>;

export type GetStopsByValidityQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type GetStopsByIdsQueryVariables = Exact<{
  stopIds?: Maybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;

export type GetStopsByIdsQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type GetStopsByLabelsQueryVariables = Exact<{
  stopLabels?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type GetStopsByLabelsQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type InsertStopMutationVariables = Exact<{
  object: ServicePatternScheduledStopPointInsertInput;
}>;

export type InsertStopMutation = {
  __typename?: 'mutation_root';
  insert_service_pattern_scheduled_stop_point_one?:
    | {
        __typename?: 'service_pattern_scheduled_stop_point';
        scheduled_stop_point_id: UUID;
        located_on_infrastructure_link_id: UUID;
        direction: InfrastructureNetworkDirectionEnum;
        priority: number;
        measured_location: GeoJSON.Point;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
      }
    | null
    | undefined;
};

export type EditStopMutationVariables = Exact<{
  stop_id: Scalars['uuid'];
  stop_label: Scalars['String'];
  stop_patch: ServicePatternScheduledStopPointSetInput;
  delete_from_journey_pattern_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type EditStopMutation = {
  __typename?: 'mutation_root';
  update_service_pattern_scheduled_stop_point?:
    | {
        __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
        returning: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          scheduled_stop_point_id: UUID;
          label: string;
          measured_location: GeoJSON.Point;
          located_on_infrastructure_link_id: UUID;
          direction: InfrastructureNetworkDirectionEnum;
          relative_distance_from_infrastructure_link_start: number;
          closest_point_on_infrastructure_link?:
            | GeoJSON.Point
            | null
            | undefined;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          timing_place_id?: UUID | null | undefined;
          vehicle_mode_on_scheduled_stop_point: Array<{
            __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
            vehicle_mode: ReusableComponentsVehicleModeEnum;
          }>;
        }>;
      }
    | null
    | undefined;
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          is_used_as_timing_point: boolean;
          is_regulated_timing_point: boolean;
          is_loading_time_allowed: boolean;
          is_via_point: boolean;
          via_point_name_i18n?: LocalizedString | null | undefined;
          via_point_short_name_i18n?: LocalizedString | null | undefined;
          journey_pattern: {
            __typename?: 'journey_pattern_journey_pattern';
            journey_pattern_id: UUID;
            on_route_id: UUID;
          };
        }>;
      }
    | null
    | undefined;
};

export type GetStopWithRouteGraphDataByIdQueryVariables = Exact<{
  stopId: Scalars['uuid'];
}>;

export type GetStopWithRouteGraphDataByIdQuery = {
  __typename?: 'query_root';
  service_pattern_scheduled_stop_point: Array<{
    __typename?: 'service_pattern_scheduled_stop_point';
    scheduled_stop_point_id: UUID;
    label: string;
    measured_location: GeoJSON.Point;
    located_on_infrastructure_link_id: UUID;
    direction: InfrastructureNetworkDirectionEnum;
    relative_distance_from_infrastructure_link_start: number;
    closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    timing_place_id?: UUID | null | undefined;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
      is_used_as_timing_point: boolean;
      is_regulated_timing_point: boolean;
      is_loading_time_allowed: boolean;
      is_via_point: boolean;
      via_point_name_i18n?: LocalizedString | null | undefined;
      via_point_short_name_i18n?: LocalizedString | null | undefined;
      journey_pattern: {
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        on_route_id: UUID;
        journey_pattern_route?:
          | {
              __typename?: 'route_route';
              route_id: UUID;
              name_i18n: LocalizedString;
              description_i18n?: LocalizedString | null | undefined;
              origin_name_i18n: LocalizedString;
              origin_short_name_i18n: LocalizedString;
              destination_name_i18n: LocalizedString;
              destination_short_name_i18n: LocalizedString;
              on_line_id: UUID;
              label: string;
              variant?: number | null | undefined;
              priority: number;
              infrastructure_links_along_route: Array<{
                __typename?: 'route_infrastructure_link_along_route';
                route_id: UUID;
                infrastructure_link_id: UUID;
                infrastructure_link_sequence: number;
              }>;
            }
          | null
          | undefined;
      };
    }>;
    vehicle_mode_on_scheduled_stop_point: Array<{
      __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
      vehicle_mode: ReusableComponentsVehicleModeEnum;
    }>;
  }>;
};

export type GetRoutesBrokenByStopChangeQueryVariables = Exact<{
  new_located_on_infrastructure_link_id: Scalars['uuid'];
  new_direction: Scalars['String'];
  new_label: Scalars['String'];
  new_validity_start?: Maybe<Scalars['date']>;
  new_validity_end?: Maybe<Scalars['date']>;
  new_priority: Scalars['Int'];
  new_measured_location: Scalars['geography'];
  replace_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
}>;

export type GetRoutesBrokenByStopChangeQuery = {
  __typename?: 'query_root';
  journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    journey_pattern_route?:
      | {
          __typename?: 'route_route';
          route_id: UUID;
          name_i18n: LocalizedString;
          description_i18n?: LocalizedString | null | undefined;
          origin_name_i18n: LocalizedString;
          origin_short_name_i18n: LocalizedString;
          destination_name_i18n: LocalizedString;
          destination_short_name_i18n: LocalizedString;
          route_shape?: GeoJSON.LineString | null | undefined;
          on_line_id: UUID;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
          variant?: number | null | undefined;
          direction: RouteDirectionEnum;
        }
      | null
      | undefined;
  }>;
};

export type UpdateRouteGeometryMutationVariables = Exact<{
  route_id: Scalars['uuid'];
  journey_pattern_id: Scalars['uuid'];
  new_infrastructure_links:
    | Array<RouteInfrastructureLinkAlongRouteInsertInput>
    | RouteInfrastructureLinkAlongRouteInsertInput;
  new_stops_in_journey_pattern:
    | Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>
    | JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
}>;

export type UpdateRouteGeometryMutation = {
  __typename?: 'mutation_root';
  delete_route_infrastructure_link_along_route?:
    | {
        __typename?: 'route_infrastructure_link_along_route_mutation_response';
        returning: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          infrastructure_link_id: UUID;
          infrastructure_link_sequence: number;
          route_id: UUID;
        }>;
      }
    | null
    | undefined;
  insert_route_infrastructure_link_along_route?:
    | {
        __typename?: 'route_infrastructure_link_along_route_mutation_response';
        returning: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          route_id: UUID;
          infrastructure_link_id: UUID;
          infrastructure_link_sequence: number;
          is_traversal_forwards: boolean;
          infrastructure_link: {
            __typename?: 'infrastructure_network_infrastructure_link';
            infrastructure_link_id: UUID;
            shape: GeoJSON.LineString;
          };
        }>;
      }
    | null
    | undefined;
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type UpdateRouteJourneyPatternMutationVariables = Exact<{
  journey_pattern_id: Scalars['uuid'];
  new_stops_in_journey_pattern:
    | Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>
    | JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
}>;

export type UpdateRouteJourneyPatternMutation = {
  __typename?: 'mutation_root';
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type GetLinksWithStopsByExternalLinkIdsQueryVariables = Exact<{
  externalLinkIds?: Maybe<Array<Scalars['String']> | Scalars['String']>;
}>;

export type GetLinksWithStopsByExternalLinkIdsQuery = {
  __typename?: 'query_root';
  infrastructure_network_infrastructure_link: Array<{
    __typename?: 'infrastructure_network_infrastructure_link';
    external_link_id: string;
    infrastructure_link_id: UUID;
    shape: GeoJSON.LineString;
    direction: InfrastructureNetworkDirectionEnum;
    scheduled_stop_points_located_on_infrastructure_link: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      scheduled_stop_point_id: UUID;
      label: string;
      measured_location: GeoJSON.Point;
      located_on_infrastructure_link_id: UUID;
      direction: InfrastructureNetworkDirectionEnum;
      relative_distance_from_infrastructure_link_start: number;
      closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      priority: number;
      timing_place_id?: UUID | null | undefined;
      other_label_instances: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
      scheduled_stop_point_in_journey_patterns: Array<{
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_label: string;
        scheduled_stop_point_sequence: number;
        is_used_as_timing_point: boolean;
        is_regulated_timing_point: boolean;
        is_loading_time_allowed: boolean;
        is_via_point: boolean;
        via_point_name_i18n?: LocalizedString | null | undefined;
        via_point_short_name_i18n?: LocalizedString | null | undefined;
        journey_pattern: {
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
        };
      }>;
      vehicle_mode_on_scheduled_stop_point: Array<{
        __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
        vehicle_mode: ReusableComponentsVehicleModeEnum;
      }>;
    }>;
  }>;
};

export type GetLineRoutesByLabelQueryVariables = Exact<{
  lineFilters?: Maybe<RouteLineBoolExp>;
  lineRouteFilters?: Maybe<RouteRouteBoolExp>;
}>;

export type GetLineRoutesByLabelQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    line_id: UUID;
    line_routes: Array<{
      __typename?: 'route_route';
      route_id: UUID;
      label: string;
      variant?: number | null | undefined;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      priority: number;
      direction: RouteDirectionEnum;
      route_journey_patterns: Array<{
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_in_journey_patterns: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
        }>;
      }>;
    }>;
  }>;
};

export type GetRouteByFiltersQueryVariables = Exact<{
  routeFilters?: Maybe<RouteRouteBoolExp>;
}>;

export type GetRouteByFiltersQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    label: string;
    variant?: number | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    direction: RouteDirectionEnum;
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_in_journey_patterns: Array<{
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_label: string;
        scheduled_stop_point_sequence: number;
      }>;
    }>;
  }>;
};

export type DisplayedRouteFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  label: string;
  variant?: number | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  direction: RouteDirectionEnum;
  route_journey_patterns: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
    }>;
  }>;
};

export type RouteMetadataFragment = {
  __typename?: 'route_route';
  name_i18n: LocalizedString;
  label: string;
  priority: number;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  direction: RouteDirectionEnum;
  variant?: number | null | undefined;
};

export type RouteWithInfrastructureLinksWithStopsFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString | null | undefined;
  origin_name_i18n: LocalizedString;
  origin_short_name_i18n: LocalizedString;
  destination_name_i18n: LocalizedString;
  destination_short_name_i18n: LocalizedString;
  route_shape?: GeoJSON.LineString | null | undefined;
  on_line_id: UUID;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  priority: number;
  label: string;
  variant?: number | null | undefined;
  direction: RouteDirectionEnum;
  route_line: {
    __typename?: 'route_line';
    line_id: UUID;
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
    type_of_line: RouteTypeOfLineEnum;
    transport_target: HslRouteTransportTargetEnum;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
  };
  infrastructure_links_along_route: Array<{
    __typename?: 'route_infrastructure_link_along_route';
    route_id: UUID;
    infrastructure_link_sequence: number;
    infrastructure_link_id: UUID;
    is_traversal_forwards: boolean;
    infrastructure_link: {
      __typename?: 'infrastructure_network_infrastructure_link';
      external_link_id: string;
      infrastructure_link_id: UUID;
      shape: GeoJSON.LineString;
      direction: InfrastructureNetworkDirectionEnum;
      scheduled_stop_points_located_on_infrastructure_link: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        scheduled_stop_point_id: UUID;
        label: string;
        measured_location: GeoJSON.Point;
        located_on_infrastructure_link_id: UUID;
        direction: InfrastructureNetworkDirectionEnum;
        relative_distance_from_infrastructure_link_start: number;
        closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        timing_place_id?: UUID | null | undefined;
        other_label_instances: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          priority: number;
          direction: InfrastructureNetworkDirectionEnum;
          scheduled_stop_point_id: UUID;
          label: string;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          located_on_infrastructure_link_id: UUID;
        }>;
        scheduled_stop_point_in_journey_patterns: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          is_used_as_timing_point: boolean;
          is_regulated_timing_point: boolean;
          is_loading_time_allowed: boolean;
          is_via_point: boolean;
          via_point_name_i18n?: LocalizedString | null | undefined;
          via_point_short_name_i18n?: LocalizedString | null | undefined;
          journey_pattern: {
            __typename?: 'journey_pattern_journey_pattern';
            journey_pattern_id: UUID;
            on_route_id: UUID;
          };
        }>;
        vehicle_mode_on_scheduled_stop_point: Array<{
          __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
          vehicle_mode: ReusableComponentsVehicleModeEnum;
        }>;
      }>;
    };
  }>;
  route_journey_patterns: Array<{
    __typename?: 'journey_pattern_journey_pattern';
    journey_pattern_id: UUID;
    on_route_id: UUID;
    scheduled_stop_point_in_journey_patterns: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
      scheduled_stop_point_label: string;
      scheduled_stop_point_sequence: number;
      is_used_as_timing_point: boolean;
      is_regulated_timing_point: boolean;
      is_loading_time_allowed: boolean;
      is_via_point: boolean;
      via_point_name_i18n?: LocalizedString | null | undefined;
      via_point_short_name_i18n?: LocalizedString | null | undefined;
      scheduled_stop_points: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
      journey_pattern: {
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        on_route_id: UUID;
      };
    }>;
  }>;
};

export type InfraLinkAlongRouteWithStopsFragment = {
  __typename?: 'route_infrastructure_link_along_route';
  route_id: UUID;
  infrastructure_link_sequence: number;
  infrastructure_link_id: UUID;
  is_traversal_forwards: boolean;
  infrastructure_link: {
    __typename?: 'infrastructure_network_infrastructure_link';
    external_link_id: string;
    infrastructure_link_id: UUID;
    shape: GeoJSON.LineString;
    direction: InfrastructureNetworkDirectionEnum;
    scheduled_stop_points_located_on_infrastructure_link: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      scheduled_stop_point_id: UUID;
      label: string;
      measured_location: GeoJSON.Point;
      located_on_infrastructure_link_id: UUID;
      direction: InfrastructureNetworkDirectionEnum;
      relative_distance_from_infrastructure_link_start: number;
      closest_point_on_infrastructure_link?: GeoJSON.Point | null | undefined;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      priority: number;
      timing_place_id?: UUID | null | undefined;
      other_label_instances: Array<{
        __typename?: 'service_pattern_scheduled_stop_point';
        priority: number;
        direction: InfrastructureNetworkDirectionEnum;
        scheduled_stop_point_id: UUID;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        located_on_infrastructure_link_id: UUID;
      }>;
      scheduled_stop_point_in_journey_patterns: Array<{
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
        journey_pattern_id: UUID;
        scheduled_stop_point_label: string;
        scheduled_stop_point_sequence: number;
        is_used_as_timing_point: boolean;
        is_regulated_timing_point: boolean;
        is_loading_time_allowed: boolean;
        is_via_point: boolean;
        via_point_name_i18n?: LocalizedString | null | undefined;
        via_point_short_name_i18n?: LocalizedString | null | undefined;
        journey_pattern: {
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
        };
      }>;
      vehicle_mode_on_scheduled_stop_point: Array<{
        __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
        vehicle_mode: ReusableComponentsVehicleModeEnum;
      }>;
    }>;
  };
};

export type GetRouteWithInfrastructureLinksWithStopsQueryVariables = Exact<{
  route_id: Scalars['uuid'];
}>;

export type GetRouteWithInfrastructureLinksWithStopsQuery = {
  __typename?: 'query_root';
  route_route_by_pk?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        name_i18n: LocalizedString;
        description_i18n?: LocalizedString | null | undefined;
        origin_name_i18n: LocalizedString;
        origin_short_name_i18n: LocalizedString;
        destination_name_i18n: LocalizedString;
        destination_short_name_i18n: LocalizedString;
        route_shape?: GeoJSON.LineString | null | undefined;
        on_line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        variant?: number | null | undefined;
        direction: RouteDirectionEnum;
        route_line: {
          __typename?: 'route_line';
          line_id: UUID;
          name_i18n: LocalizedString;
          short_name_i18n: LocalizedString;
          primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
          type_of_line: RouteTypeOfLineEnum;
          transport_target: HslRouteTransportTargetEnum;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
          priority: number;
          label: string;
        };
        infrastructure_links_along_route: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          route_id: UUID;
          infrastructure_link_sequence: number;
          infrastructure_link_id: UUID;
          is_traversal_forwards: boolean;
          infrastructure_link: {
            __typename?: 'infrastructure_network_infrastructure_link';
            external_link_id: string;
            infrastructure_link_id: UUID;
            shape: GeoJSON.LineString;
            direction: InfrastructureNetworkDirectionEnum;
            scheduled_stop_points_located_on_infrastructure_link: Array<{
              __typename?: 'service_pattern_scheduled_stop_point';
              scheduled_stop_point_id: UUID;
              label: string;
              measured_location: GeoJSON.Point;
              located_on_infrastructure_link_id: UUID;
              direction: InfrastructureNetworkDirectionEnum;
              relative_distance_from_infrastructure_link_start: number;
              closest_point_on_infrastructure_link?:
                | GeoJSON.Point
                | null
                | undefined;
              validity_start?: luxon.DateTime | null | undefined;
              validity_end?: luxon.DateTime | null | undefined;
              priority: number;
              timing_place_id?: UUID | null | undefined;
              other_label_instances: Array<{
                __typename?: 'service_pattern_scheduled_stop_point';
                priority: number;
                direction: InfrastructureNetworkDirectionEnum;
                scheduled_stop_point_id: UUID;
                label: string;
                validity_start?: luxon.DateTime | null | undefined;
                validity_end?: luxon.DateTime | null | undefined;
                located_on_infrastructure_link_id: UUID;
              }>;
              scheduled_stop_point_in_journey_patterns: Array<{
                __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
                journey_pattern_id: UUID;
                scheduled_stop_point_label: string;
                scheduled_stop_point_sequence: number;
                is_used_as_timing_point: boolean;
                is_regulated_timing_point: boolean;
                is_loading_time_allowed: boolean;
                is_via_point: boolean;
                via_point_name_i18n?: LocalizedString | null | undefined;
                via_point_short_name_i18n?: LocalizedString | null | undefined;
                journey_pattern: {
                  __typename?: 'journey_pattern_journey_pattern';
                  journey_pattern_id: UUID;
                  on_route_id: UUID;
                };
              }>;
              vehicle_mode_on_scheduled_stop_point: Array<{
                __typename?: 'service_pattern_vehicle_mode_on_scheduled_stop_point';
                vehicle_mode: ReusableComponentsVehicleModeEnum;
              }>;
            }>;
          };
        }>;
        route_journey_patterns: Array<{
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
          on_route_id: UUID;
          scheduled_stop_point_in_journey_patterns: Array<{
            __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
            journey_pattern_id: UUID;
            scheduled_stop_point_label: string;
            scheduled_stop_point_sequence: number;
            is_used_as_timing_point: boolean;
            is_regulated_timing_point: boolean;
            is_loading_time_allowed: boolean;
            is_via_point: boolean;
            via_point_name_i18n?: LocalizedString | null | undefined;
            via_point_short_name_i18n?: LocalizedString | null | undefined;
            scheduled_stop_points: Array<{
              __typename?: 'service_pattern_scheduled_stop_point';
              priority: number;
              direction: InfrastructureNetworkDirectionEnum;
              scheduled_stop_point_id: UUID;
              label: string;
              validity_start?: luxon.DateTime | null | undefined;
              validity_end?: luxon.DateTime | null | undefined;
              located_on_infrastructure_link_id: UUID;
            }>;
            journey_pattern: {
              __typename?: 'journey_pattern_journey_pattern';
              journey_pattern_id: UUID;
              on_route_id: UUID;
            };
          }>;
        }>;
      }
    | null
    | undefined;
};

export type SearchLinesAndRoutesQueryVariables = Exact<{
  lineFilter?: Maybe<RouteLineBoolExp>;
  routeFilter?: Maybe<RouteRouteBoolExp>;
  lineOrderBy?: Maybe<Array<RouteLineOrderBy> | RouteLineOrderBy>;
  routeOrderBy?: Maybe<Array<RouteRouteOrderBy> | RouteRouteOrderBy>;
}>;

export type SearchLinesAndRoutesQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    name_i18n: LocalizedString;
    short_name_i18n: LocalizedString;
    priority: number;
    line_id: UUID;
    label: string;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    line_routes: Array<{
      __typename?: 'route_route';
      route_id: UUID;
      route_shape?: GeoJSON.LineString | null | undefined;
      label: string;
      validity_start?: luxon.DateTime | null | undefined;
      validity_end?: luxon.DateTime | null | undefined;
      route_journey_patterns: Array<{
        __typename?: 'journey_pattern_journey_pattern';
        journey_pattern_id: UUID;
        journey_pattern_refs: Array<{
          __typename?: 'timetables_journey_pattern_journey_pattern_ref';
          journey_pattern_ref_id: UUID;
          vehicle_journeys: Array<{
            __typename?: 'timetables_vehicle_journey_vehicle_journey';
            vehicle_journey_id: UUID;
          }>;
        }>;
      }>;
    }>;
  }>;
  route_route: Array<{
    __typename?: 'route_route';
    name_i18n: LocalizedString;
    direction: RouteDirectionEnum;
    priority: number;
    on_line_id: UUID;
    variant?: number | null | undefined;
    route_id: UUID;
    label: string;
    route_shape?: GeoJSON.LineString | null | undefined;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    route_journey_patterns: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
      journey_pattern_refs: Array<{
        __typename?: 'timetables_journey_pattern_journey_pattern_ref';
        journey_pattern_ref_id: UUID;
        vehicle_journeys: Array<{
          __typename?: 'timetables_vehicle_journey_vehicle_journey';
          vehicle_journey_id: UUID;
        }>;
      }>;
    }>;
  }>;
};

export type PatchScheduledStopPointTimingSettingsMutationVariables = Exact<{
  stopLabel: Scalars['String'];
  journeyPatternId: Scalars['uuid'];
  sequence: Scalars['Int'];
  patch: JourneyPatternScheduledStopPointInJourneyPatternSetInput;
}>;

export type PatchScheduledStopPointTimingSettingsMutation = {
  __typename?: 'mutation_root';
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
          scheduled_stop_point_label: string;
          scheduled_stop_point_sequence: number;
          is_used_as_timing_point: boolean;
          is_regulated_timing_point: boolean;
          is_loading_time_allowed: boolean;
          is_via_point: boolean;
          via_point_name_i18n?: LocalizedString | null | undefined;
          via_point_short_name_i18n?: LocalizedString | null | undefined;
          journey_pattern: {
            __typename?: 'journey_pattern_journey_pattern';
            journey_pattern_id: UUID;
            on_route_id: UUID;
          };
        }>;
      }
    | null
    | undefined;
};

export type NewTimingPlaceFragment = {
  __typename?: 'timing_pattern_timing_place';
  label: string;
  description?: any | null | undefined;
};

export type CreatedTimingPlaceFragment = {
  __typename?: 'timing_pattern_timing_place';
  timing_place_id: UUID;
  label: string;
  description?: any | null | undefined;
};

export type InsertTimingPlaceMutationVariables = Exact<{
  object: TimingPatternTimingPlaceInsertInput;
}>;

export type InsertTimingPlaceMutation = {
  __typename?: 'mutation_root';
  insert_timing_pattern_timing_place_one?:
    | {
        __typename?: 'timing_pattern_timing_place';
        timing_place_id: UUID;
        label: string;
        description?: any | null | undefined;
      }
    | null
    | undefined;
};

export type GetTimingPlacesByLabelQueryVariables = Exact<{
  label: Scalars['String'];
}>;

export type GetTimingPlacesByLabelQuery = {
  __typename?: 'query_root';
  timing_pattern_timing_place: Array<{
    __typename?: 'timing_pattern_timing_place';
    timing_place_id: UUID;
    label: string;
    description?: any | null | undefined;
  }>;
};

export type GetLinesForComboboxQueryVariables = Exact<{
  labelPattern: Scalars['String'];
  date: Scalars['date'];
}>;

export type GetLinesForComboboxQuery = {
  __typename?: 'query_root';
  route_line: Array<{
    __typename?: 'route_line';
    line_id: UUID;
    name_i18n: LocalizedString;
    label: string;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
  }>;
};

export type GetSelectedLineDetailsByIdQueryVariables = Exact<{
  line_id: Scalars['uuid'];
}>;

export type GetSelectedLineDetailsByIdQuery = {
  __typename?: 'query_root';
  route_line_by_pk?:
    | {
        __typename?: 'route_line';
        line_id: UUID;
        name_i18n: LocalizedString;
        label: string;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
      }
    | null
    | undefined;
};

export type LineForComboboxFragment = {
  __typename?: 'route_line';
  line_id: UUID;
  name_i18n: LocalizedString;
  label: string;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
};

export type GetRouteDetailsByLabelWildcardQueryVariables = Exact<{
  labelPattern: Scalars['String'];
  date?: Maybe<Scalars['date']>;
  priorities?: Maybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;

export type GetRouteDetailsByLabelWildcardQuery = {
  __typename?: 'query_root';
  route_route: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    name_i18n: LocalizedString;
    description_i18n?: LocalizedString | null | undefined;
    origin_name_i18n: LocalizedString;
    origin_short_name_i18n: LocalizedString;
    destination_name_i18n: LocalizedString;
    destination_short_name_i18n: LocalizedString;
    route_shape?: GeoJSON.LineString | null | undefined;
    on_line_id: UUID;
    validity_start?: luxon.DateTime | null | undefined;
    validity_end?: luxon.DateTime | null | undefined;
    priority: number;
    label: string;
    variant?: number | null | undefined;
    direction: RouteDirectionEnum;
  }>;
};

export type GetSelectedRouteDetailsByIdQueryVariables = Exact<{
  routeId: Scalars['uuid'];
}>;

export type GetSelectedRouteDetailsByIdQuery = {
  __typename?: 'query_root';
  route_route_by_pk?:
    | {
        __typename?: 'route_route';
        route_id: UUID;
        name_i18n: LocalizedString;
        description_i18n?: LocalizedString | null | undefined;
        origin_name_i18n: LocalizedString;
        origin_short_name_i18n: LocalizedString;
        destination_name_i18n: LocalizedString;
        destination_short_name_i18n: LocalizedString;
        route_shape?: GeoJSON.LineString | null | undefined;
        on_line_id: UUID;
        validity_start?: luxon.DateTime | null | undefined;
        validity_end?: luxon.DateTime | null | undefined;
        priority: number;
        label: string;
        variant?: number | null | undefined;
        direction: RouteDirectionEnum;
      }
    | null
    | undefined;
};

export type GetTimingPlacesForComboboxQueryVariables = Exact<{
  labelPattern: Scalars['String'];
}>;

export type GetTimingPlacesForComboboxQuery = {
  __typename?: 'query_root';
  timing_pattern_timing_place: Array<{
    __typename?: 'timing_pattern_timing_place';
    timing_place_id: UUID;
    label: string;
    description?: any | null | undefined;
  }>;
};

export type GetSelectedTimingPlaceDetailsByIdQueryVariables = Exact<{
  timing_place_id: Scalars['uuid'];
}>;

export type GetSelectedTimingPlaceDetailsByIdQuery = {
  __typename?: 'query_root';
  timing_pattern_timing_place_by_pk?:
    | {
        __typename?: 'timing_pattern_timing_place';
        timing_place_id: UUID;
        label: string;
        description?: any | null | undefined;
      }
    | null
    | undefined;
};

export type TimingPlaceForComboboxFragment = {
  __typename?: 'timing_pattern_timing_place';
  timing_place_id: UUID;
  label: string;
  description?: any | null | undefined;
};

export type RouteInformationForMapFragment = {
  __typename?: 'route_route';
  route_id: UUID;
  label: string;
  route_shape?: GeoJSON.LineString | null | undefined;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
};

export type LineInformationForMapFragment = {
  __typename?: 'route_line';
  line_id: UUID;
  label: string;
  validity_start?: luxon.DateTime | null | undefined;
  validity_end?: luxon.DateTime | null | undefined;
  line_routes: Array<{
    __typename?: 'route_route';
    route_id: UUID;
    route_shape?: GeoJSON.LineString | null | undefined;
  }>;
};

export type DayTypeAllFieldsFragment = {
  __typename?: 'timetables_service_calendar_day_type';
  day_type_id: UUID;
  label: string;
  name_i18n: any;
};

export type VehicleServiceWithJourneysFragment = {
  __typename?: 'timetables_vehicle_service_vehicle_service';
  vehicle_service_id: UUID;
  vehicle_schedule_frame: {
    __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
    vehicle_schedule_frame_id: UUID;
    priority: number;
  };
  day_type: {
    __typename?: 'timetables_service_calendar_day_type';
    day_type_id: UUID;
    label: string;
    name_i18n: any;
  };
  blocks: Array<{
    __typename?: 'timetables_vehicle_service_block';
    block_id: UUID;
    vehicle_journeys: Array<{
      __typename?: 'timetables_vehicle_journey_vehicle_journey';
      start_time: luxon.Duration;
      vehicle_journey_id: UUID;
    }>;
  }>;
};

export type GetTimetablesForOperationDayQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetTimetablesForOperationDayQuery = {
  __typename?: 'query_root';
  timetables?:
    | {
        __typename?: 'timetables_timetables_query';
        timetables_vehicle_schedule_vehicle_schedule_frame: Array<{
          __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
          validity_end?: luxon.DateTime | null | undefined;
          validity_start?: luxon.DateTime | null | undefined;
          name_i18n: any;
          vehicle_schedule_frame_id: UUID;
          priority: number;
          vehicle_services: Array<{
            __typename?: 'timetables_vehicle_service_vehicle_service';
            vehicle_service_id: UUID;
            vehicle_schedule_frame: {
              __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
              vehicle_schedule_frame_id: UUID;
              priority: number;
            };
            day_type: {
              __typename?: 'timetables_service_calendar_day_type';
              day_type_id: UUID;
              label: string;
              name_i18n: any;
            };
            blocks: Array<{
              __typename?: 'timetables_vehicle_service_block';
              block_id: UUID;
              vehicle_journeys: Array<{
                __typename?: 'timetables_vehicle_journey_vehicle_journey';
                start_time: luxon.Duration;
                vehicle_journey_id: UUID;
              }>;
            }>;
          }>;
        }>;
      }
    | null
    | undefined;
};

export type JourneyPatternStopFragment = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  scheduled_stop_point_label: string;
  scheduled_stop_point_sequence: number;
  is_used_as_timing_point: boolean;
  is_via_point: boolean;
  via_point_name_i18n?: LocalizedString | null | undefined;
  via_point_short_name_i18n?: LocalizedString | null | undefined;
};

export const LineInformationForMapFragmentDoc = gql`
  fragment line_information_for_map on route_line {
    line_id
    label
    validity_start
    validity_end
    line_routes {
      route_id
      route_shape
    }
  }
`;
export const RouteInformationForMapFragmentDoc = gql`
  fragment route_information_for_map on route_route {
    route_id
    label
    route_shape
    validity_start
    validity_end
  }
`;
export const LineTableRowFragmentDoc = gql`
  fragment line_table_row on route_line {
    name_i18n
    short_name_i18n
    priority
    ...line_information_for_map
    line_routes {
      ...route_information_for_map
      route_journey_patterns {
        journey_pattern_id
        journey_pattern_refs {
          journey_pattern_ref_id
          vehicle_journeys {
            vehicle_journey_id
          }
        }
      }
    }
  }
  ${LineInformationForMapFragmentDoc}
  ${RouteInformationForMapFragmentDoc}
`;
export const RouteTableRowFragmentDoc = gql`
  fragment route_table_row on route_route {
    ...route_information_for_map
    name_i18n
    direction
    priority
    on_line_id
    variant
    route_journey_patterns {
      journey_pattern_id
      journey_pattern_refs {
        journey_pattern_ref_id
        vehicle_journeys {
          vehicle_journey_id
        }
      }
    }
  }
  ${RouteInformationForMapFragmentDoc}
`;
export const StopPopupInfoFragmentDoc = gql`
  fragment stop_popup_info on service_pattern_scheduled_stop_point {
    label
    priority
    validity_start
    validity_end
    measured_location
  }
`;
export const ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc = gql`
  fragment scheduled_stop_point_in_journey_pattern_all_fields on journey_pattern_scheduled_stop_point_in_journey_pattern {
    journey_pattern_id
    scheduled_stop_point_label
    scheduled_stop_point_sequence
    is_used_as_timing_point
    is_regulated_timing_point
    is_loading_time_allowed
    is_via_point
    via_point_name_i18n
    via_point_short_name_i18n
    journey_pattern {
      journey_pattern_id
      on_route_id
    }
  }
`;
export const ScheduledStopPointWithTimingSettingsFragmentDoc = gql`
  fragment scheduled_stop_point_with_timing_settings on journey_pattern_scheduled_stop_point_in_journey_pattern {
    ...scheduled_stop_point_in_journey_pattern_all_fields
    journey_pattern {
      journey_pattern_id
      journey_pattern_route {
        route_id
        label
      }
    }
    scheduled_stop_points {
      scheduled_stop_point_id
      timing_place_id
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export const PassingTimeByStopFragmentDoc = gql`
  fragment passing_time_by_stop on timetables_passing_times_timetabled_passing_time {
    arrival_time
    departure_time
    passing_time
    scheduled_stop_point_in_journey_pattern_ref_id
    timetabled_passing_time_id
    vehicle_journey_id
    scheduled_stop_point_in_journey_pattern_ref {
      scheduled_stop_point_in_journey_pattern_ref_id
      scheduled_stop_point_label
    }
  }
`;
export const VehicleJourneyByStopFragmentDoc = gql`
  fragment vehicle_journey_by_stop on timetables_vehicle_journey_vehicle_journey {
    timetabled_passing_times {
      ...passing_time_by_stop
    }
    journey_pattern_ref_id
    vehicle_journey_id
  }
  ${PassingTimeByStopFragmentDoc}
`;
export const InfraLinkMatchingFieldsFragmentDoc = gql`
  fragment infra_link_matching_fields on infrastructure_network_infrastructure_link {
    external_link_id
    infrastructure_link_id
    shape
    direction
  }
`;
export const ScheduledStopPointAllFieldsFragmentDoc = gql`
  fragment scheduled_stop_point_all_fields on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    measured_location
    located_on_infrastructure_link_id
    direction
    relative_distance_from_infrastructure_link_start
    closest_point_on_infrastructure_link
    validity_start
    validity_end
    priority
    vehicle_mode_on_scheduled_stop_point {
      vehicle_mode
    }
    timing_place_id
  }
`;
export const StopWithJourneyPatternFieldsFragmentDoc = gql`
  fragment stop_with_journey_pattern_fields on service_pattern_scheduled_stop_point {
    ...scheduled_stop_point_all_fields
    scheduled_stop_point_in_journey_patterns {
      ...scheduled_stop_point_in_journey_pattern_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export const ScheduledStopPointDefaultFieldsFragmentDoc = gql`
  fragment scheduled_stop_point_default_fields on service_pattern_scheduled_stop_point {
    priority
    direction
    scheduled_stop_point_id
    label
    validity_start
    validity_end
    located_on_infrastructure_link_id
  }
`;
export const RouteStopFieldsFragmentDoc = gql`
  fragment route_stop_fields on service_pattern_scheduled_stop_point {
    ...stop_with_journey_pattern_fields
    other_label_instances {
      ...scheduled_stop_point_default_fields
    }
  }
  ${StopWithJourneyPatternFieldsFragmentDoc}
  ${ScheduledStopPointDefaultFieldsFragmentDoc}
`;
export const RouteInfraLinkFieldsFragmentDoc = gql`
  fragment route_infra_link_fields on infrastructure_network_infrastructure_link {
    ...infra_link_matching_fields
    scheduled_stop_points_located_on_infrastructure_link {
      ...route_stop_fields
    }
  }
  ${InfraLinkMatchingFieldsFragmentDoc}
  ${RouteStopFieldsFragmentDoc}
`;
export const InfrastructureLinkAllFieldsFragmentDoc = gql`
  fragment infrastructure_link_all_fields on infrastructure_network_infrastructure_link {
    infrastructure_link_id
    direction
    shape
    estimated_length_in_metres
    external_link_id
    external_link_source
  }
`;
export const LineDefaultFieldsFragmentDoc = gql`
  fragment line_default_fields on route_line {
    line_id
    label
    name_i18n
    short_name_i18n
    validity_start
    validity_end
  }
`;
export const RouteValidityFragmentDoc = gql`
  fragment route_validity on route_route {
    validity_start
    validity_end
    priority
  }
`;
export const RouteDefaultFieldsFragmentDoc = gql`
  fragment route_default_fields on route_route {
    route_id
    name_i18n
    description_i18n
    origin_name_i18n
    origin_short_name_i18n
    destination_name_i18n
    destination_short_name_i18n
    on_line_id
    label
    variant
    priority
  }
`;
export const RouteAllFieldsFragmentDoc = gql`
  fragment route_all_fields on route_route {
    route_id
    name_i18n
    description_i18n
    origin_name_i18n
    origin_short_name_i18n
    destination_name_i18n
    destination_short_name_i18n
    route_shape
    on_line_id
    validity_start
    validity_end
    priority
    label
    variant
    direction
  }
`;
export const JourneyPatternWithStopsFragmentDoc = gql`
  fragment journey_pattern_with_stops on journey_pattern_journey_pattern {
    journey_pattern_id
    on_route_id
    scheduled_stop_point_in_journey_patterns(
      order_by: { scheduled_stop_point_sequence: asc }
    ) {
      ...scheduled_stop_point_in_journey_pattern_all_fields
      scheduled_stop_points {
        ...scheduled_stop_point_default_fields
      }
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
  ${ScheduledStopPointDefaultFieldsFragmentDoc}
`;
export const RouteWithJourneyPatternStopsFragmentDoc = gql`
  fragment route_with_journey_pattern_stops on route_route {
    ...route_all_fields
    route_journey_patterns {
      ...journey_pattern_with_stops
    }
  }
  ${RouteAllFieldsFragmentDoc}
  ${JourneyPatternWithStopsFragmentDoc}
`;
export const LineAllFieldsFragmentDoc = gql`
  fragment line_all_fields on route_line {
    line_id
    name_i18n
    short_name_i18n
    primary_vehicle_mode
    type_of_line
    transport_target
    validity_start
    validity_end
    priority
    label
  }
`;
export const RouteWithInfrastructureLinksFragmentDoc = gql`
  fragment route_with_infrastructure_links on route_route {
    ...route_with_journey_pattern_stops
    route_line {
      ...line_all_fields
    }
    infrastructure_links_along_route {
      route_id
      infrastructure_link_sequence
      infrastructure_link_id
      infrastructure_link {
        infrastructure_link_id
        shape
        direction
      }
      is_traversal_forwards
    }
  }
  ${RouteWithJourneyPatternStopsFragmentDoc}
  ${LineAllFieldsFragmentDoc}
`;
export const DisplayedRouteFragmentDoc = gql`
  fragment displayed_route on route_route {
    route_id
    label
    variant
    validity_start
    validity_end
    priority
    direction
    route_journey_patterns {
      journey_pattern_id
      scheduled_stop_point_in_journey_patterns {
        journey_pattern_id
        scheduled_stop_point_label
        scheduled_stop_point_sequence
      }
    }
  }
`;
export const RouteMetadataFragmentDoc = gql`
  fragment route_metadata on route_route {
    name_i18n
    label
    priority
    validity_start
    validity_end
    direction
    variant
  }
`;
export const InfraLinkAlongRouteWithStopsFragmentDoc = gql`
  fragment infra_link_along_route_with_stops on route_infrastructure_link_along_route {
    route_id
    infrastructure_link_sequence
    infrastructure_link_id
    infrastructure_link {
      ...infra_link_matching_fields
      scheduled_stop_points_located_on_infrastructure_link {
        ...route_stop_fields
      }
    }
    is_traversal_forwards
  }
  ${InfraLinkMatchingFieldsFragmentDoc}
  ${RouteStopFieldsFragmentDoc}
`;
export const RouteWithInfrastructureLinksWithStopsFragmentDoc = gql`
  fragment route_with_infrastructure_links_with_stops on route_route {
    ...route_with_journey_pattern_stops
    route_line {
      ...line_all_fields
    }
    infrastructure_links_along_route {
      ...infra_link_along_route_with_stops
    }
  }
  ${RouteWithJourneyPatternStopsFragmentDoc}
  ${LineAllFieldsFragmentDoc}
  ${InfraLinkAlongRouteWithStopsFragmentDoc}
`;
export const NewTimingPlaceFragmentDoc = gql`
  fragment new_timing_place on timing_pattern_timing_place {
    label
    description
  }
`;
export const CreatedTimingPlaceFragmentDoc = gql`
  fragment created_timing_place on timing_pattern_timing_place {
    timing_place_id
    label
    description
  }
`;
export const LineForComboboxFragmentDoc = gql`
  fragment line_for_combobox on route_line {
    line_id
    name_i18n
    label
    validity_start
    validity_end
  }
`;
export const TimingPlaceForComboboxFragmentDoc = gql`
  fragment timing_place_for_combobox on timing_pattern_timing_place {
    timing_place_id
    label
    description
  }
`;
export const DayTypeAllFieldsFragmentDoc = gql`
  fragment day_type_all_fields on timetables_service_calendar_day_type {
    day_type_id
    label
    name_i18n
  }
`;
export const VehicleServiceWithJourneysFragmentDoc = gql`
  fragment vehicle_service_with_journeys on timetables_vehicle_service_vehicle_service {
    vehicle_service_id
    vehicle_schedule_frame {
      vehicle_schedule_frame_id
      priority
    }
    day_type {
      ...day_type_all_fields
    }
    blocks {
      block_id
      vehicle_journeys {
        start_time
        vehicle_journey_id
      }
    }
  }
  ${DayTypeAllFieldsFragmentDoc}
`;
export const JourneyPatternStopFragmentDoc = gql`
  fragment journey_pattern_stop on journey_pattern_scheduled_stop_point_in_journey_pattern {
    scheduled_stop_point_label
    scheduled_stop_point_sequence
    is_used_as_timing_point
    is_via_point
    via_point_name_i18n
    via_point_short_name_i18n
  }
`;
export const GetRouteWithInfrastructureLinksDocument = gql`
  query GetRouteWithInfrastructureLinks($route_id: uuid!) {
    route_route_by_pk(route_id: $route_id) {
      ...route_with_infrastructure_links
    }
  }
  ${RouteWithInfrastructureLinksFragmentDoc}
`;

/**
 * __useGetRouteWithInfrastructureLinksQuery__
 *
 * To run a query within a React component, call `useGetRouteWithInfrastructureLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteWithInfrastructureLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteWithInfrastructureLinksQuery({
 *   variables: {
 *      route_id: // value for 'route_id'
 *   },
 * });
 */
export function useGetRouteWithInfrastructureLinksQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >(GetRouteWithInfrastructureLinksDocument, options);
}
export function useGetRouteWithInfrastructureLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >(GetRouteWithInfrastructureLinksDocument, options);
}
export type GetRouteWithInfrastructureLinksQueryHookResult = ReturnType<
  typeof useGetRouteWithInfrastructureLinksQuery
>;
export type GetRouteWithInfrastructureLinksLazyQueryHookResult = ReturnType<
  typeof useGetRouteWithInfrastructureLinksLazyQuery
>;
export type GetRouteWithInfrastructureLinksQueryResult = Apollo.QueryResult<
  GetRouteWithInfrastructureLinksQuery,
  GetRouteWithInfrastructureLinksQueryVariables
>;
export const ListChangingRoutesDocument = gql`
  query ListChangingRoutes($limit: Int) {
    route_route(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...route_table_row
    }
  }
  ${RouteTableRowFragmentDoc}
`;

/**
 * __useListChangingRoutesQuery__
 *
 * To run a query within a React component, call `useListChangingRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListChangingRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListChangingRoutesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useListChangingRoutesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ListChangingRoutesQuery,
    ListChangingRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ListChangingRoutesQuery,
    ListChangingRoutesQueryVariables
  >(ListChangingRoutesDocument, options);
}
export function useListChangingRoutesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListChangingRoutesQuery,
    ListChangingRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ListChangingRoutesQuery,
    ListChangingRoutesQueryVariables
  >(ListChangingRoutesDocument, options);
}
export type ListChangingRoutesQueryHookResult = ReturnType<
  typeof useListChangingRoutesQuery
>;
export type ListChangingRoutesLazyQueryHookResult = ReturnType<
  typeof useListChangingRoutesLazyQuery
>;
export type ListChangingRoutesQueryResult = Apollo.QueryResult<
  ListChangingRoutesQuery,
  ListChangingRoutesQueryVariables
>;
export const ListOwnLinesDocument = gql`
  query ListOwnLines($limit: Int = 10) {
    route_line(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_table_row
    }
  }
  ${LineTableRowFragmentDoc}
`;

/**
 * __useListOwnLinesQuery__
 *
 * To run a query within a React component, call `useListOwnLinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListOwnLinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListOwnLinesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useListOwnLinesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ListOwnLinesQuery,
    ListOwnLinesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<ListOwnLinesQuery, ListOwnLinesQueryVariables>(
    ListOwnLinesDocument,
    options,
  );
}
export function useListOwnLinesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ListOwnLinesQuery,
    ListOwnLinesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<ListOwnLinesQuery, ListOwnLinesQueryVariables>(
    ListOwnLinesDocument,
    options,
  );
}
export type ListOwnLinesQueryHookResult = ReturnType<
  typeof useListOwnLinesQuery
>;
export type ListOwnLinesLazyQueryHookResult = ReturnType<
  typeof useListOwnLinesLazyQuery
>;
export type ListOwnLinesQueryResult = Apollo.QueryResult<
  ListOwnLinesQuery,
  ListOwnLinesQueryVariables
>;
export const GetScheduledStopPointWithTimingSettingsDocument = gql`
  query GetScheduledStopPointWithTimingSettings(
    $journeyPatternId: uuid!
    $stopLabel: String!
    $sequence: Int!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
        scheduled_stop_point_sequence: { _eq: $sequence }
      }
    ) {
      ...scheduled_stop_point_with_timing_settings
    }
  }
  ${ScheduledStopPointWithTimingSettingsFragmentDoc}
`;

/**
 * __useGetScheduledStopPointWithTimingSettingsQuery__
 *
 * To run a query within a React component, call `useGetScheduledStopPointWithTimingSettingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledStopPointWithTimingSettingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledStopPointWithTimingSettingsQuery({
 *   variables: {
 *      journeyPatternId: // value for 'journeyPatternId'
 *      stopLabel: // value for 'stopLabel'
 *      sequence: // value for 'sequence'
 *   },
 * });
 */
export function useGetScheduledStopPointWithTimingSettingsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >(GetScheduledStopPointWithTimingSettingsDocument, options);
}
export function useGetScheduledStopPointWithTimingSettingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >(GetScheduledStopPointWithTimingSettingsDocument, options);
}
export type GetScheduledStopPointWithTimingSettingsQueryHookResult = ReturnType<
  typeof useGetScheduledStopPointWithTimingSettingsQuery
>;
export type GetScheduledStopPointWithTimingSettingsLazyQueryHookResult =
  ReturnType<typeof useGetScheduledStopPointWithTimingSettingsLazyQuery>;
export type GetScheduledStopPointWithTimingSettingsQueryResult =
  Apollo.QueryResult<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >;
export const GetVehicleJourneysDocument = gql`
  query GetVehicleJourneys {
    timetables {
      timetables_vehicle_journey_vehicle_journey {
        ...vehicle_journey_by_stop
      }
    }
  }
  ${VehicleJourneyByStopFragmentDoc}
`;

/**
 * __useGetVehicleJourneysQuery__
 *
 * To run a query within a React component, call `useGetVehicleJourneysQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVehicleJourneysQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVehicleJourneysQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVehicleJourneysQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetVehicleJourneysQuery,
    GetVehicleJourneysQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetVehicleJourneysQuery,
    GetVehicleJourneysQueryVariables
  >(GetVehicleJourneysDocument, options);
}
export function useGetVehicleJourneysLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetVehicleJourneysQuery,
    GetVehicleJourneysQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetVehicleJourneysQuery,
    GetVehicleJourneysQueryVariables
  >(GetVehicleJourneysDocument, options);
}
export type GetVehicleJourneysQueryHookResult = ReturnType<
  typeof useGetVehicleJourneysQuery
>;
export type GetVehicleJourneysLazyQueryHookResult = ReturnType<
  typeof useGetVehicleJourneysLazyQuery
>;
export type GetVehicleJourneysQueryResult = Apollo.QueryResult<
  GetVehicleJourneysQuery,
  GetVehicleJourneysQueryVariables
>;
export const QueryClosestLinkDocument = gql`
  query QueryClosestLink($point: geography) {
    infrastructure_network_resolve_point_to_closest_link(
      args: { geog: $point }
    ) {
      ...infrastructure_link_all_fields
    }
  }
  ${InfrastructureLinkAllFieldsFragmentDoc}
`;

/**
 * __useQueryClosestLinkQuery__
 *
 * To run a query within a React component, call `useQueryClosestLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryClosestLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryClosestLinkQuery({
 *   variables: {
 *      point: // value for 'point'
 *   },
 * });
 */
export function useQueryClosestLinkQuery(
  baseOptions?: Apollo.QueryHookOptions<
    QueryClosestLinkQuery,
    QueryClosestLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<QueryClosestLinkQuery, QueryClosestLinkQueryVariables>(
    QueryClosestLinkDocument,
    options,
  );
}
export function useQueryClosestLinkLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    QueryClosestLinkQuery,
    QueryClosestLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    QueryClosestLinkQuery,
    QueryClosestLinkQueryVariables
  >(QueryClosestLinkDocument, options);
}
export type QueryClosestLinkQueryHookResult = ReturnType<
  typeof useQueryClosestLinkQuery
>;
export type QueryClosestLinkLazyQueryHookResult = ReturnType<
  typeof useQueryClosestLinkLazyQuery
>;
export type QueryClosestLinkQueryResult = Apollo.QueryResult<
  QueryClosestLinkQuery,
  QueryClosestLinkQueryVariables
>;
export const QueryPointDirectionOnLinkDocument = gql`
  query QueryPointDirectionOnLink(
    $point_of_interest: geography
    $infrastructure_link_uuid: uuid
    $point_max_distance_in_meters: float8
  ) {
    infrastructure_network_find_point_direction_on_link(
      args: {
        point_of_interest: $point_of_interest
        infrastructure_link_uuid: $infrastructure_link_uuid
        point_max_distance_in_meters: $point_max_distance_in_meters
      }
    ) {
      value
    }
  }
`;

/**
 * __useQueryPointDirectionOnLinkQuery__
 *
 * To run a query within a React component, call `useQueryPointDirectionOnLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryPointDirectionOnLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryPointDirectionOnLinkQuery({
 *   variables: {
 *      point_of_interest: // value for 'point_of_interest'
 *      infrastructure_link_uuid: // value for 'infrastructure_link_uuid'
 *      point_max_distance_in_meters: // value for 'point_max_distance_in_meters'
 *   },
 * });
 */
export function useQueryPointDirectionOnLinkQuery(
  baseOptions?: Apollo.QueryHookOptions<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >(QueryPointDirectionOnLinkDocument, options);
}
export function useQueryPointDirectionOnLinkLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >(QueryPointDirectionOnLinkDocument, options);
}
export type QueryPointDirectionOnLinkQueryHookResult = ReturnType<
  typeof useQueryPointDirectionOnLinkQuery
>;
export type QueryPointDirectionOnLinkLazyQueryHookResult = ReturnType<
  typeof useQueryPointDirectionOnLinkLazyQuery
>;
export type QueryPointDirectionOnLinkQueryResult = Apollo.QueryResult<
  QueryPointDirectionOnLinkQuery,
  QueryPointDirectionOnLinkQueryVariables
>;
export const GetStopsAlongInfrastructureLinksDocument = gql`
  query GetStopsAlongInfrastructureLinks($infrastructure_link_ids: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: {
        located_on_infrastructure_link_id: { _in: $infrastructure_link_ids }
      }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
`;

/**
 * __useGetStopsAlongInfrastructureLinksQuery__
 *
 * To run a query within a React component, call `useGetStopsAlongInfrastructureLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopsAlongInfrastructureLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopsAlongInfrastructureLinksQuery({
 *   variables: {
 *      infrastructure_link_ids: // value for 'infrastructure_link_ids'
 *   },
 * });
 */
export function useGetStopsAlongInfrastructureLinksQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >(GetStopsAlongInfrastructureLinksDocument, options);
}
export function useGetStopsAlongInfrastructureLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >(GetStopsAlongInfrastructureLinksDocument, options);
}
export type GetStopsAlongInfrastructureLinksQueryHookResult = ReturnType<
  typeof useGetStopsAlongInfrastructureLinksQuery
>;
export type GetStopsAlongInfrastructureLinksLazyQueryHookResult = ReturnType<
  typeof useGetStopsAlongInfrastructureLinksLazyQuery
>;
export type GetStopsAlongInfrastructureLinksQueryResult = Apollo.QueryResult<
  GetStopsAlongInfrastructureLinksQuery,
  GetStopsAlongInfrastructureLinksQueryVariables
>;
export const PatchScheduledStopPointViaInfoDocument = gql`
  mutation PatchScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export type PatchScheduledStopPointViaInfoMutationFn = Apollo.MutationFunction<
  PatchScheduledStopPointViaInfoMutation,
  PatchScheduledStopPointViaInfoMutationVariables
>;

/**
 * __usePatchScheduledStopPointViaInfoMutation__
 *
 * To run a mutation, you first call `usePatchScheduledStopPointViaInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchScheduledStopPointViaInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchScheduledStopPointViaInfoMutation, { data, loading, error }] = usePatchScheduledStopPointViaInfoMutation({
 *   variables: {
 *      stopLabel: // value for 'stopLabel'
 *      journeyPatternId: // value for 'journeyPatternId'
 *      patch: // value for 'patch'
 *   },
 * });
 */
export function usePatchScheduledStopPointViaInfoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PatchScheduledStopPointViaInfoMutation,
    PatchScheduledStopPointViaInfoMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PatchScheduledStopPointViaInfoMutation,
    PatchScheduledStopPointViaInfoMutationVariables
  >(PatchScheduledStopPointViaInfoDocument, options);
}
export type PatchScheduledStopPointViaInfoMutationHookResult = ReturnType<
  typeof usePatchScheduledStopPointViaInfoMutation
>;
export type PatchScheduledStopPointViaInfoMutationResult =
  Apollo.MutationResult<PatchScheduledStopPointViaInfoMutation>;
export type PatchScheduledStopPointViaInfoMutationOptions =
  Apollo.BaseMutationOptions<
    PatchScheduledStopPointViaInfoMutation,
    PatchScheduledStopPointViaInfoMutationVariables
  >;
export const RemoveScheduledStopPointViaInfoDocument = gql`
  mutation RemoveScheduledStopPointViaInfo(
    $stopLabel: String!
    $journeyPatternId: uuid!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: {
        is_via_point: false
        via_point_name_i18n: null
        via_point_short_name_i18n: null
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export type RemoveScheduledStopPointViaInfoMutationFn = Apollo.MutationFunction<
  RemoveScheduledStopPointViaInfoMutation,
  RemoveScheduledStopPointViaInfoMutationVariables
>;

/**
 * __useRemoveScheduledStopPointViaInfoMutation__
 *
 * To run a mutation, you first call `useRemoveScheduledStopPointViaInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveScheduledStopPointViaInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeScheduledStopPointViaInfoMutation, { data, loading, error }] = useRemoveScheduledStopPointViaInfoMutation({
 *   variables: {
 *      stopLabel: // value for 'stopLabel'
 *      journeyPatternId: // value for 'journeyPatternId'
 *   },
 * });
 */
export function useRemoveScheduledStopPointViaInfoMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveScheduledStopPointViaInfoMutation,
    RemoveScheduledStopPointViaInfoMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveScheduledStopPointViaInfoMutation,
    RemoveScheduledStopPointViaInfoMutationVariables
  >(RemoveScheduledStopPointViaInfoDocument, options);
}
export type RemoveScheduledStopPointViaInfoMutationHookResult = ReturnType<
  typeof useRemoveScheduledStopPointViaInfoMutation
>;
export type RemoveScheduledStopPointViaInfoMutationResult =
  Apollo.MutationResult<RemoveScheduledStopPointViaInfoMutation>;
export type RemoveScheduledStopPointViaInfoMutationOptions =
  Apollo.BaseMutationOptions<
    RemoveScheduledStopPointViaInfoMutation,
    RemoveScheduledStopPointViaInfoMutationVariables
  >;
export const GetScheduledStopPointWithViaInfoDocument = gql`
  query GetScheduledStopPointWithViaInfo(
    $journeyPatternId: uuid!
    $stopLabel: String!
  ) {
    journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern_id: { _eq: $journeyPatternId }
        scheduled_stop_point_label: { _eq: $stopLabel }
      }
    ) {
      ...scheduled_stop_point_in_journey_pattern_all_fields
      journey_pattern {
        journey_pattern_id
        journey_pattern_route {
          route_id
          label
        }
      }
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;

/**
 * __useGetScheduledStopPointWithViaInfoQuery__
 *
 * To run a query within a React component, call `useGetScheduledStopPointWithViaInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledStopPointWithViaInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledStopPointWithViaInfoQuery({
 *   variables: {
 *      journeyPatternId: // value for 'journeyPatternId'
 *      stopLabel: // value for 'stopLabel'
 *   },
 * });
 */
export function useGetScheduledStopPointWithViaInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetScheduledStopPointWithViaInfoQuery,
    GetScheduledStopPointWithViaInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledStopPointWithViaInfoQuery,
    GetScheduledStopPointWithViaInfoQueryVariables
  >(GetScheduledStopPointWithViaInfoDocument, options);
}
export function useGetScheduledStopPointWithViaInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledStopPointWithViaInfoQuery,
    GetScheduledStopPointWithViaInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledStopPointWithViaInfoQuery,
    GetScheduledStopPointWithViaInfoQueryVariables
  >(GetScheduledStopPointWithViaInfoDocument, options);
}
export type GetScheduledStopPointWithViaInfoQueryHookResult = ReturnType<
  typeof useGetScheduledStopPointWithViaInfoQuery
>;
export type GetScheduledStopPointWithViaInfoLazyQueryHookResult = ReturnType<
  typeof useGetScheduledStopPointWithViaInfoLazyQuery
>;
export type GetScheduledStopPointWithViaInfoQueryResult = Apollo.QueryResult<
  GetScheduledStopPointWithViaInfoQuery,
  GetScheduledStopPointWithViaInfoQueryVariables
>;
export const GetLineDetailsByIdDocument = gql`
  query GetLineDetailsById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
    }
  }
  ${LineAllFieldsFragmentDoc}
`;

/**
 * __useGetLineDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetLineDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLineDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLineDetailsByIdQuery({
 *   variables: {
 *      line_id: // value for 'line_id'
 *   },
 * });
 */
export function useGetLineDetailsByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >(GetLineDetailsByIdDocument, options);
}
export function useGetLineDetailsByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >(GetLineDetailsByIdDocument, options);
}
export type GetLineDetailsByIdQueryHookResult = ReturnType<
  typeof useGetLineDetailsByIdQuery
>;
export type GetLineDetailsByIdLazyQueryHookResult = ReturnType<
  typeof useGetLineDetailsByIdLazyQuery
>;
export type GetLineDetailsByIdQueryResult = Apollo.QueryResult<
  GetLineDetailsByIdQuery,
  GetLineDetailsByIdQueryVariables
>;
export const GetLineValidityPeriodByIdDocument = gql`
  query GetLineValidityPeriodById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      line_id
      validity_start
      validity_end
    }
  }
`;

/**
 * __useGetLineValidityPeriodByIdQuery__
 *
 * To run a query within a React component, call `useGetLineValidityPeriodByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLineValidityPeriodByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLineValidityPeriodByIdQuery({
 *   variables: {
 *      line_id: // value for 'line_id'
 *   },
 * });
 */
export function useGetLineValidityPeriodByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLineValidityPeriodByIdQuery,
    GetLineValidityPeriodByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLineValidityPeriodByIdQuery,
    GetLineValidityPeriodByIdQueryVariables
  >(GetLineValidityPeriodByIdDocument, options);
}
export function useGetLineValidityPeriodByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLineValidityPeriodByIdQuery,
    GetLineValidityPeriodByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLineValidityPeriodByIdQuery,
    GetLineValidityPeriodByIdQueryVariables
  >(GetLineValidityPeriodByIdDocument, options);
}
export type GetLineValidityPeriodByIdQueryHookResult = ReturnType<
  typeof useGetLineValidityPeriodByIdQuery
>;
export type GetLineValidityPeriodByIdLazyQueryHookResult = ReturnType<
  typeof useGetLineValidityPeriodByIdLazyQuery
>;
export type GetLineValidityPeriodByIdQueryResult = Apollo.QueryResult<
  GetLineValidityPeriodByIdQuery,
  GetLineValidityPeriodByIdQueryVariables
>;
export const GetLinesByValidityDocument = gql`
  query GetLinesByValidity($filter: route_line_bool_exp) {
    route_line(where: $filter) {
      ...line_all_fields
    }
  }
  ${LineAllFieldsFragmentDoc}
`;

/**
 * __useGetLinesByValidityQuery__
 *
 * To run a query within a React component, call `useGetLinesByValidityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinesByValidityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinesByValidityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetLinesByValidityQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >(GetLinesByValidityDocument, options);
}
export function useGetLinesByValidityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >(GetLinesByValidityDocument, options);
}
export type GetLinesByValidityQueryHookResult = ReturnType<
  typeof useGetLinesByValidityQuery
>;
export type GetLinesByValidityLazyQueryHookResult = ReturnType<
  typeof useGetLinesByValidityLazyQuery
>;
export type GetLinesByValidityQueryResult = Apollo.QueryResult<
  GetLinesByValidityQuery,
  GetLinesByValidityQueryVariables
>;
export const GetLineDetailsWithRoutesByIdDocument = gql`
  query GetLineDetailsWithRoutesById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
      line_routes {
        ...route_all_fields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link {
              ...scheduled_stop_point_all_fields
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_all_fields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
              other_label_instances {
                ...scheduled_stop_point_default_fields
              }
            }
          }
        }
      }
    }
  }
  ${LineAllFieldsFragmentDoc}
  ${RouteAllFieldsFragmentDoc}
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
  ${ScheduledStopPointDefaultFieldsFragmentDoc}
`;

/**
 * __useGetLineDetailsWithRoutesByIdQuery__
 *
 * To run a query within a React component, call `useGetLineDetailsWithRoutesByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLineDetailsWithRoutesByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLineDetailsWithRoutesByIdQuery({
 *   variables: {
 *      line_id: // value for 'line_id'
 *   },
 * });
 */
export function useGetLineDetailsWithRoutesByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >(GetLineDetailsWithRoutesByIdDocument, options);
}
export function useGetLineDetailsWithRoutesByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >(GetLineDetailsWithRoutesByIdDocument, options);
}
export type GetLineDetailsWithRoutesByIdQueryHookResult = ReturnType<
  typeof useGetLineDetailsWithRoutesByIdQuery
>;
export type GetLineDetailsWithRoutesByIdLazyQueryHookResult = ReturnType<
  typeof useGetLineDetailsWithRoutesByIdLazyQuery
>;
export type GetLineDetailsWithRoutesByIdQueryResult = Apollo.QueryResult<
  GetLineDetailsWithRoutesByIdQuery,
  GetLineDetailsWithRoutesByIdQueryVariables
>;
export const GetHighestPriorityLineDetailsWithRoutesDocument = gql`
  query GetHighestPriorityLineDetailsWithRoutes(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
    $routeStopFilters: service_pattern_scheduled_stop_point_bool_exp
  ) {
    route_line(where: $lineFilters, order_by: { priority: desc }, limit: 1) {
      ...line_all_fields
      line_routes(where: $lineRouteFilters) {
        ...route_all_fields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link(
              where: $routeStopFilters
            ) {
              ...scheduled_stop_point_all_fields
              other_label_instances {
                ...scheduled_stop_point_default_fields
              }
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_all_fields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
            }
          }
        }
        route_journey_patterns {
          journey_pattern_id
        }
      }
    }
  }
  ${LineAllFieldsFragmentDoc}
  ${RouteAllFieldsFragmentDoc}
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointDefaultFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;

/**
 * __useGetHighestPriorityLineDetailsWithRoutesQuery__
 *
 * To run a query within a React component, call `useGetHighestPriorityLineDetailsWithRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHighestPriorityLineDetailsWithRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHighestPriorityLineDetailsWithRoutesQuery({
 *   variables: {
 *      lineFilters: // value for 'lineFilters'
 *      lineRouteFilters: // value for 'lineRouteFilters'
 *      routeStopFilters: // value for 'routeStopFilters'
 *   },
 * });
 */
export function useGetHighestPriorityLineDetailsWithRoutesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >(GetHighestPriorityLineDetailsWithRoutesDocument, options);
}
export function useGetHighestPriorityLineDetailsWithRoutesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >(GetHighestPriorityLineDetailsWithRoutesDocument, options);
}
export type GetHighestPriorityLineDetailsWithRoutesQueryHookResult = ReturnType<
  typeof useGetHighestPriorityLineDetailsWithRoutesQuery
>;
export type GetHighestPriorityLineDetailsWithRoutesLazyQueryHookResult =
  ReturnType<typeof useGetHighestPriorityLineDetailsWithRoutesLazyQuery>;
export type GetHighestPriorityLineDetailsWithRoutesQueryResult =
  Apollo.QueryResult<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >;
export const GetRoutesWithStopsDocument = gql`
  query GetRoutesWithStops($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...route_all_fields
      route_line {
        line_id
      }
      infrastructure_links_along_route {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        is_traversal_forwards
        infrastructure_link {
          infrastructure_link_id
          scheduled_stop_points_located_on_infrastructure_link {
            ...scheduled_stop_point_all_fields
            scheduled_stop_point_in_journey_patterns {
              ...scheduled_stop_point_in_journey_pattern_all_fields
              journey_pattern {
                journey_pattern_id
                on_route_id
              }
            }
          }
        }
      }
    }
  }
  ${RouteAllFieldsFragmentDoc}
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;

/**
 * __useGetRoutesWithStopsQuery__
 *
 * To run a query within a React component, call `useGetRoutesWithStopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesWithStopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesWithStopsQuery({
 *   variables: {
 *      routeFilters: // value for 'routeFilters'
 *   },
 * });
 */
export function useGetRoutesWithStopsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRoutesWithStopsQuery,
    GetRoutesWithStopsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRoutesWithStopsQuery,
    GetRoutesWithStopsQueryVariables
  >(GetRoutesWithStopsDocument, options);
}
export function useGetRoutesWithStopsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRoutesWithStopsQuery,
    GetRoutesWithStopsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRoutesWithStopsQuery,
    GetRoutesWithStopsQueryVariables
  >(GetRoutesWithStopsDocument, options);
}
export type GetRoutesWithStopsQueryHookResult = ReturnType<
  typeof useGetRoutesWithStopsQuery
>;
export type GetRoutesWithStopsLazyQueryHookResult = ReturnType<
  typeof useGetRoutesWithStopsLazyQuery
>;
export type GetRoutesWithStopsQueryResult = Apollo.QueryResult<
  GetRoutesWithStopsQuery,
  GetRoutesWithStopsQueryVariables
>;
export const GetRouteDetailsByIdDocument = gql`
  query GetRouteDetailsById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_with_journey_pattern_stops
      route_line {
        ...line_all_fields
      }
    }
  }
  ${RouteWithJourneyPatternStopsFragmentDoc}
  ${LineAllFieldsFragmentDoc}
`;

/**
 * __useGetRouteDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetRouteDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteDetailsByIdQuery({
 *   variables: {
 *      routeId: // value for 'routeId'
 *   },
 * });
 */
export function useGetRouteDetailsByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >(GetRouteDetailsByIdDocument, options);
}
export function useGetRouteDetailsByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >(GetRouteDetailsByIdDocument, options);
}
export type GetRouteDetailsByIdQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdQuery
>;
export type GetRouteDetailsByIdLazyQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdLazyQuery
>;
export type GetRouteDetailsByIdQueryResult = Apollo.QueryResult<
  GetRouteDetailsByIdQuery,
  GetRouteDetailsByIdQueryVariables
>;
export const GetRouteDetailsByIdsDocument = gql`
  query GetRouteDetailsByIds($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_all_fields
      infrastructure_links_along_route {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        is_traversal_forwards
        infrastructure_link {
          infrastructure_link_id
          scheduled_stop_points_located_on_infrastructure_link {
            ...scheduled_stop_point_all_fields
            scheduled_stop_point_in_journey_patterns {
              ...scheduled_stop_point_in_journey_pattern_all_fields
              journey_pattern {
                journey_pattern_id
                on_route_id
              }
            }
          }
        }
      }
      route_line {
        line_id
        label
        primary_vehicle_mode
      }
    }
  }
  ${RouteAllFieldsFragmentDoc}
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;

/**
 * __useGetRouteDetailsByIdsQuery__
 *
 * To run a query within a React component, call `useGetRouteDetailsByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteDetailsByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteDetailsByIdsQuery({
 *   variables: {
 *      route_ids: // value for 'route_ids'
 *   },
 * });
 */
export function useGetRouteDetailsByIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >(GetRouteDetailsByIdsDocument, options);
}
export function useGetRouteDetailsByIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >(GetRouteDetailsByIdsDocument, options);
}
export type GetRouteDetailsByIdsQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdsQuery
>;
export type GetRouteDetailsByIdsLazyQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdsLazyQuery
>;
export type GetRouteDetailsByIdsQueryResult = Apollo.QueryResult<
  GetRouteDetailsByIdsQuery,
  GetRouteDetailsByIdsQueryVariables
>;
export const GetRouteRenderInfoByIdDocument = gql`
  query GetRouteRenderInfoById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      route_id
      route_shape
      route_line {
        line_id
        primary_vehicle_mode
      }
    }
  }
`;

/**
 * __useGetRouteRenderInfoByIdQuery__
 *
 * To run a query within a React component, call `useGetRouteRenderInfoByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteRenderInfoByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteRenderInfoByIdQuery({
 *   variables: {
 *      routeId: // value for 'routeId'
 *   },
 * });
 */
export function useGetRouteRenderInfoByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRouteRenderInfoByIdQuery,
    GetRouteRenderInfoByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteRenderInfoByIdQuery,
    GetRouteRenderInfoByIdQueryVariables
  >(GetRouteRenderInfoByIdDocument, options);
}
export function useGetRouteRenderInfoByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteRenderInfoByIdQuery,
    GetRouteRenderInfoByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteRenderInfoByIdQuery,
    GetRouteRenderInfoByIdQueryVariables
  >(GetRouteRenderInfoByIdDocument, options);
}
export type GetRouteRenderInfoByIdQueryHookResult = ReturnType<
  typeof useGetRouteRenderInfoByIdQuery
>;
export type GetRouteRenderInfoByIdLazyQueryHookResult = ReturnType<
  typeof useGetRouteRenderInfoByIdLazyQuery
>;
export type GetRouteRenderInfoByIdQueryResult = Apollo.QueryResult<
  GetRouteRenderInfoByIdQuery,
  GetRouteRenderInfoByIdQueryVariables
>;
export const GetRouteDetailsByLabelsDocument = gql`
  query GetRouteDetailsByLabels($labels: [String!], $date: date) {
    route_route(
      where: {
        label: { _in: $labels }
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
      }
    ) {
      ...route_with_journey_pattern_stops
      route_line {
        line_id
        label
        primary_vehicle_mode
      }
    }
  }
  ${RouteWithJourneyPatternStopsFragmentDoc}
`;

/**
 * __useGetRouteDetailsByLabelsQuery__
 *
 * To run a query within a React component, call `useGetRouteDetailsByLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteDetailsByLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteDetailsByLabelsQuery({
 *   variables: {
 *      labels: // value for 'labels'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetRouteDetailsByLabelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >(GetRouteDetailsByLabelsDocument, options);
}
export function useGetRouteDetailsByLabelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >(GetRouteDetailsByLabelsDocument, options);
}
export type GetRouteDetailsByLabelsQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelsQuery
>;
export type GetRouteDetailsByLabelsLazyQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelsLazyQuery
>;
export type GetRouteDetailsByLabelsQueryResult = Apollo.QueryResult<
  GetRouteDetailsByLabelsQuery,
  GetRouteDetailsByLabelsQueryVariables
>;
export const GetRoutesWithInfrastructureLinksDocument = gql`
  query GetRoutesWithInfrastructureLinks($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_infrastructure_links
    }
  }
  ${RouteWithInfrastructureLinksFragmentDoc}
`;

/**
 * __useGetRoutesWithInfrastructureLinksQuery__
 *
 * To run a query within a React component, call `useGetRoutesWithInfrastructureLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesWithInfrastructureLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesWithInfrastructureLinksQuery({
 *   variables: {
 *      route_ids: // value for 'route_ids'
 *   },
 * });
 */
export function useGetRoutesWithInfrastructureLinksQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRoutesWithInfrastructureLinksQuery,
    GetRoutesWithInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRoutesWithInfrastructureLinksQuery,
    GetRoutesWithInfrastructureLinksQueryVariables
  >(GetRoutesWithInfrastructureLinksDocument, options);
}
export function useGetRoutesWithInfrastructureLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRoutesWithInfrastructureLinksQuery,
    GetRoutesWithInfrastructureLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRoutesWithInfrastructureLinksQuery,
    GetRoutesWithInfrastructureLinksQueryVariables
  >(GetRoutesWithInfrastructureLinksDocument, options);
}
export type GetRoutesWithInfrastructureLinksQueryHookResult = ReturnType<
  typeof useGetRoutesWithInfrastructureLinksQuery
>;
export type GetRoutesWithInfrastructureLinksLazyQueryHookResult = ReturnType<
  typeof useGetRoutesWithInfrastructureLinksLazyQuery
>;
export type GetRoutesWithInfrastructureLinksQueryResult = Apollo.QueryResult<
  GetRoutesWithInfrastructureLinksQuery,
  GetRoutesWithInfrastructureLinksQueryVariables
>;
export const GetRoutesByValidityDocument = gql`
  query GetRoutesByValidity($filter: route_route_bool_exp) {
    route_route(where: $filter) {
      ...route_default_fields
      validity_start
      validity_end
    }
  }
  ${RouteDefaultFieldsFragmentDoc}
`;

/**
 * __useGetRoutesByValidityQuery__
 *
 * To run a query within a React component, call `useGetRoutesByValidityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesByValidityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesByValidityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetRoutesByValidityQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRoutesByValidityQuery,
    GetRoutesByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRoutesByValidityQuery,
    GetRoutesByValidityQueryVariables
  >(GetRoutesByValidityDocument, options);
}
export function useGetRoutesByValidityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRoutesByValidityQuery,
    GetRoutesByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRoutesByValidityQuery,
    GetRoutesByValidityQueryVariables
  >(GetRoutesByValidityDocument, options);
}
export type GetRoutesByValidityQueryHookResult = ReturnType<
  typeof useGetRoutesByValidityQuery
>;
export type GetRoutesByValidityLazyQueryHookResult = ReturnType<
  typeof useGetRoutesByValidityLazyQuery
>;
export type GetRoutesByValidityQueryResult = Apollo.QueryResult<
  GetRoutesByValidityQuery,
  GetRoutesByValidityQueryVariables
>;
export const InsertLineOneDocument = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      line_id
      label
      priority
      primary_vehicle_mode
      transport_target
      validity_start
      validity_end
    }
  }
`;
export type InsertLineOneMutationFn = Apollo.MutationFunction<
  InsertLineOneMutation,
  InsertLineOneMutationVariables
>;

/**
 * __useInsertLineOneMutation__
 *
 * To run a mutation, you first call `useInsertLineOneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertLineOneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertLineOneMutation, { data, loading, error }] = useInsertLineOneMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertLineOneMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InsertLineOneMutation,
    InsertLineOneMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    InsertLineOneMutation,
    InsertLineOneMutationVariables
  >(InsertLineOneDocument, options);
}
export type InsertLineOneMutationHookResult = ReturnType<
  typeof useInsertLineOneMutation
>;
export type InsertLineOneMutationResult =
  Apollo.MutationResult<InsertLineOneMutation>;
export type InsertLineOneMutationOptions = Apollo.BaseMutationOptions<
  InsertLineOneMutation,
  InsertLineOneMutationVariables
>;
export const PatchLineDocument = gql`
  mutation PatchLine($line_id: uuid!, $object: route_line_set_input!) {
    update_route_line_by_pk(pk_columns: { line_id: $line_id }, _set: $object) {
      ...line_all_fields
    }
  }
  ${LineAllFieldsFragmentDoc}
`;
export type PatchLineMutationFn = Apollo.MutationFunction<
  PatchLineMutation,
  PatchLineMutationVariables
>;

/**
 * __usePatchLineMutation__
 *
 * To run a mutation, you first call `usePatchLineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchLineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchLineMutation, { data, loading, error }] = usePatchLineMutation({
 *   variables: {
 *      line_id: // value for 'line_id'
 *      object: // value for 'object'
 *   },
 * });
 */
export function usePatchLineMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PatchLineMutation,
    PatchLineMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PatchLineMutation, PatchLineMutationVariables>(
    PatchLineDocument,
    options,
  );
}
export type PatchLineMutationHookResult = ReturnType<
  typeof usePatchLineMutation
>;
export type PatchLineMutationResult = Apollo.MutationResult<PatchLineMutation>;
export type PatchLineMutationOptions = Apollo.BaseMutationOptions<
  PatchLineMutation,
  PatchLineMutationVariables
>;
export const InsertRouteOneDocument = gql`
  mutation InsertRouteOne($object: route_route_insert_input!) {
    insert_route_route_one(object: $object) {
      ...route_all_fields
    }
  }
  ${RouteAllFieldsFragmentDoc}
`;
export type InsertRouteOneMutationFn = Apollo.MutationFunction<
  InsertRouteOneMutation,
  InsertRouteOneMutationVariables
>;

/**
 * __useInsertRouteOneMutation__
 *
 * To run a mutation, you first call `useInsertRouteOneMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertRouteOneMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertRouteOneMutation, { data, loading, error }] = useInsertRouteOneMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertRouteOneMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InsertRouteOneMutation,
    InsertRouteOneMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    InsertRouteOneMutation,
    InsertRouteOneMutationVariables
  >(InsertRouteOneDocument, options);
}
export type InsertRouteOneMutationHookResult = ReturnType<
  typeof useInsertRouteOneMutation
>;
export type InsertRouteOneMutationResult =
  Apollo.MutationResult<InsertRouteOneMutation>;
export type InsertRouteOneMutationOptions = Apollo.BaseMutationOptions<
  InsertRouteOneMutation,
  InsertRouteOneMutationVariables
>;
export const PatchRouteDocument = gql`
  mutation PatchRoute($route_id: uuid!, $object: route_route_set_input!) {
    update_route_route(where: { route_id: { _eq: $route_id } }, _set: $object) {
      returning {
        ...route_all_fields
      }
    }
  }
  ${RouteAllFieldsFragmentDoc}
`;
export type PatchRouteMutationFn = Apollo.MutationFunction<
  PatchRouteMutation,
  PatchRouteMutationVariables
>;

/**
 * __usePatchRouteMutation__
 *
 * To run a mutation, you first call `usePatchRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchRouteMutation, { data, loading, error }] = usePatchRouteMutation({
 *   variables: {
 *      route_id: // value for 'route_id'
 *      object: // value for 'object'
 *   },
 * });
 */
export function usePatchRouteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PatchRouteMutation,
    PatchRouteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<PatchRouteMutation, PatchRouteMutationVariables>(
    PatchRouteDocument,
    options,
  );
}
export type PatchRouteMutationHookResult = ReturnType<
  typeof usePatchRouteMutation
>;
export type PatchRouteMutationResult =
  Apollo.MutationResult<PatchRouteMutation>;
export type PatchRouteMutationOptions = Apollo.BaseMutationOptions<
  PatchRouteMutation,
  PatchRouteMutationVariables
>;
export const DeleteRouteDocument = gql`
  mutation DeleteRoute($route_id: uuid!) {
    delete_route_route(where: { route_id: { _eq: $route_id } }) {
      returning {
        route_id
      }
    }
  }
`;
export type DeleteRouteMutationFn = Apollo.MutationFunction<
  DeleteRouteMutation,
  DeleteRouteMutationVariables
>;

/**
 * __useDeleteRouteMutation__
 *
 * To run a mutation, you first call `useDeleteRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRouteMutation, { data, loading, error }] = useDeleteRouteMutation({
 *   variables: {
 *      route_id: // value for 'route_id'
 *   },
 * });
 */
export function useDeleteRouteMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteRouteMutation,
    DeleteRouteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteRouteMutation, DeleteRouteMutationVariables>(
    DeleteRouteDocument,
    options,
  );
}
export type DeleteRouteMutationHookResult = ReturnType<
  typeof useDeleteRouteMutation
>;
export type DeleteRouteMutationResult =
  Apollo.MutationResult<DeleteRouteMutation>;
export type DeleteRouteMutationOptions = Apollo.BaseMutationOptions<
  DeleteRouteMutation,
  DeleteRouteMutationVariables
>;
export const GetScheduledStopsOnRouteDocument = gql`
  query GetScheduledStopsOnRoute($routeId: uuid!) {
    journey_pattern_journey_pattern(where: { on_route_id: { _eq: $routeId } }) {
      journey_pattern_id
      scheduled_stop_point_in_journey_patterns {
        journey_pattern_id
        scheduled_stop_point_sequence
        scheduled_stop_points {
          ...scheduled_stop_point_default_fields
        }
      }
    }
  }
  ${ScheduledStopPointDefaultFieldsFragmentDoc}
`;

/**
 * __useGetScheduledStopsOnRouteQuery__
 *
 * To run a query within a React component, call `useGetScheduledStopsOnRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledStopsOnRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledStopsOnRouteQuery({
 *   variables: {
 *      routeId: // value for 'routeId'
 *   },
 * });
 */
export function useGetScheduledStopsOnRouteQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetScheduledStopsOnRouteQuery,
    GetScheduledStopsOnRouteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledStopsOnRouteQuery,
    GetScheduledStopsOnRouteQueryVariables
  >(GetScheduledStopsOnRouteDocument, options);
}
export function useGetScheduledStopsOnRouteLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledStopsOnRouteQuery,
    GetScheduledStopsOnRouteQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledStopsOnRouteQuery,
    GetScheduledStopsOnRouteQueryVariables
  >(GetScheduledStopsOnRouteDocument, options);
}
export type GetScheduledStopsOnRouteQueryHookResult = ReturnType<
  typeof useGetScheduledStopsOnRouteQuery
>;
export type GetScheduledStopsOnRouteLazyQueryHookResult = ReturnType<
  typeof useGetScheduledStopsOnRouteLazyQuery
>;
export type GetScheduledStopsOnRouteQueryResult = Apollo.QueryResult<
  GetScheduledStopsOnRouteQuery,
  GetScheduledStopsOnRouteQueryVariables
>;
export const RemoveStopDocument = gql`
  mutation RemoveStop($stop_id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;
export type RemoveStopMutationFn = Apollo.MutationFunction<
  RemoveStopMutation,
  RemoveStopMutationVariables
>;

/**
 * __useRemoveStopMutation__
 *
 * To run a mutation, you first call `useRemoveStopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveStopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeStopMutation, { data, loading, error }] = useRemoveStopMutation({
 *   variables: {
 *      stop_id: // value for 'stop_id'
 *   },
 * });
 */
export function useRemoveStopMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveStopMutation,
    RemoveStopMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveStopMutation, RemoveStopMutationVariables>(
    RemoveStopDocument,
    options,
  );
}
export type RemoveStopMutationHookResult = ReturnType<
  typeof useRemoveStopMutation
>;
export type RemoveStopMutationResult =
  Apollo.MutationResult<RemoveStopMutation>;
export type RemoveStopMutationOptions = Apollo.BaseMutationOptions<
  RemoveStopMutation,
  RemoveStopMutationVariables
>;
export const GetStopsByLocationDocument = gql`
  query GetStopsByLocation(
    $measured_location_filter: geography_comparison_exp
  ) {
    service_pattern_scheduled_stop_point(
      where: { measured_location: $measured_location_filter }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
`;

/**
 * __useGetStopsByLocationQuery__
 *
 * To run a query within a React component, call `useGetStopsByLocationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopsByLocationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopsByLocationQuery({
 *   variables: {
 *      measured_location_filter: // value for 'measured_location_filter'
 *   },
 * });
 */
export function useGetStopsByLocationQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetStopsByLocationQuery,
    GetStopsByLocationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStopsByLocationQuery,
    GetStopsByLocationQueryVariables
  >(GetStopsByLocationDocument, options);
}
export function useGetStopsByLocationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopsByLocationQuery,
    GetStopsByLocationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStopsByLocationQuery,
    GetStopsByLocationQueryVariables
  >(GetStopsByLocationDocument, options);
}
export type GetStopsByLocationQueryHookResult = ReturnType<
  typeof useGetStopsByLocationQuery
>;
export type GetStopsByLocationLazyQueryHookResult = ReturnType<
  typeof useGetStopsByLocationLazyQuery
>;
export type GetStopsByLocationQueryResult = Apollo.QueryResult<
  GetStopsByLocationQuery,
  GetStopsByLocationQueryVariables
>;
export const GetStopsByValidityDocument = gql`
  query GetStopsByValidity(
    $filter: service_pattern_scheduled_stop_point_bool_exp
  ) {
    service_pattern_scheduled_stop_point(where: $filter) {
      ...scheduled_stop_point_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
`;

/**
 * __useGetStopsByValidityQuery__
 *
 * To run a query within a React component, call `useGetStopsByValidityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopsByValidityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopsByValidityQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetStopsByValidityQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetStopsByValidityQuery,
    GetStopsByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStopsByValidityQuery,
    GetStopsByValidityQueryVariables
  >(GetStopsByValidityDocument, options);
}
export function useGetStopsByValidityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopsByValidityQuery,
    GetStopsByValidityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStopsByValidityQuery,
    GetStopsByValidityQueryVariables
  >(GetStopsByValidityDocument, options);
}
export type GetStopsByValidityQueryHookResult = ReturnType<
  typeof useGetStopsByValidityQuery
>;
export type GetStopsByValidityLazyQueryHookResult = ReturnType<
  typeof useGetStopsByValidityLazyQuery
>;
export type GetStopsByValidityQueryResult = Apollo.QueryResult<
  GetStopsByValidityQuery,
  GetStopsByValidityQueryVariables
>;
export const GetStopsByIdsDocument = gql`
  query GetStopsByIds($stopIds: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _in: $stopIds } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
`;

/**
 * __useGetStopsByIdsQuery__
 *
 * To run a query within a React component, call `useGetStopsByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopsByIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopsByIdsQuery({
 *   variables: {
 *      stopIds: // value for 'stopIds'
 *   },
 * });
 */
export function useGetStopsByIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetStopsByIdsQuery,
    GetStopsByIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStopsByIdsQuery, GetStopsByIdsQueryVariables>(
    GetStopsByIdsDocument,
    options,
  );
}
export function useGetStopsByIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopsByIdsQuery,
    GetStopsByIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetStopsByIdsQuery, GetStopsByIdsQueryVariables>(
    GetStopsByIdsDocument,
    options,
  );
}
export type GetStopsByIdsQueryHookResult = ReturnType<
  typeof useGetStopsByIdsQuery
>;
export type GetStopsByIdsLazyQueryHookResult = ReturnType<
  typeof useGetStopsByIdsLazyQuery
>;
export type GetStopsByIdsQueryResult = Apollo.QueryResult<
  GetStopsByIdsQuery,
  GetStopsByIdsQueryVariables
>;
export const GetStopsByLabelsDocument = gql`
  query GetStopsByLabels($stopLabels: [String!]) {
    service_pattern_scheduled_stop_point(
      where: { label: { _in: $stopLabels } }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
`;

/**
 * __useGetStopsByLabelsQuery__
 *
 * To run a query within a React component, call `useGetStopsByLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopsByLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopsByLabelsQuery({
 *   variables: {
 *      stopLabels: // value for 'stopLabels'
 *   },
 * });
 */
export function useGetStopsByLabelsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetStopsByLabelsQuery,
    GetStopsByLabelsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStopsByLabelsQuery, GetStopsByLabelsQueryVariables>(
    GetStopsByLabelsDocument,
    options,
  );
}
export function useGetStopsByLabelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopsByLabelsQuery,
    GetStopsByLabelsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStopsByLabelsQuery,
    GetStopsByLabelsQueryVariables
  >(GetStopsByLabelsDocument, options);
}
export type GetStopsByLabelsQueryHookResult = ReturnType<
  typeof useGetStopsByLabelsQuery
>;
export type GetStopsByLabelsLazyQueryHookResult = ReturnType<
  typeof useGetStopsByLabelsLazyQuery
>;
export type GetStopsByLabelsQueryResult = Apollo.QueryResult<
  GetStopsByLabelsQuery,
  GetStopsByLabelsQueryVariables
>;
export const InsertStopDocument = gql`
  mutation InsertStop(
    $object: service_pattern_scheduled_stop_point_insert_input!
  ) {
    insert_service_pattern_scheduled_stop_point_one(object: $object) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      priority
      measured_location
      label
      validity_start
      validity_end
    }
  }
`;
export type InsertStopMutationFn = Apollo.MutationFunction<
  InsertStopMutation,
  InsertStopMutationVariables
>;

/**
 * __useInsertStopMutation__
 *
 * To run a mutation, you first call `useInsertStopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertStopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertStopMutation, { data, loading, error }] = useInsertStopMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertStopMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InsertStopMutation,
    InsertStopMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<InsertStopMutation, InsertStopMutationVariables>(
    InsertStopDocument,
    options,
  );
}
export type InsertStopMutationHookResult = ReturnType<
  typeof useInsertStopMutation
>;
export type InsertStopMutationResult =
  Apollo.MutationResult<InsertStopMutation>;
export type InsertStopMutationOptions = Apollo.BaseMutationOptions<
  InsertStopMutation,
  InsertStopMutationVariables
>;
export const EditStopDocument = gql`
  mutation EditStop(
    $stop_id: uuid!
    $stop_label: String!
    $stop_patch: service_pattern_scheduled_stop_point_set_input!
    $delete_from_journey_pattern_ids: [uuid!]!
  ) {
    update_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
      _set: $stop_patch
    ) {
      returning {
        ...scheduled_stop_point_all_fields
      }
    }
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        _and: {
          scheduled_stop_point_label: { _eq: $stop_label }
          journey_pattern_id: { _in: $delete_from_journey_pattern_ids }
        }
      }
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export type EditStopMutationFn = Apollo.MutationFunction<
  EditStopMutation,
  EditStopMutationVariables
>;

/**
 * __useEditStopMutation__
 *
 * To run a mutation, you first call `useEditStopMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditStopMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editStopMutation, { data, loading, error }] = useEditStopMutation({
 *   variables: {
 *      stop_id: // value for 'stop_id'
 *      stop_label: // value for 'stop_label'
 *      stop_patch: // value for 'stop_patch'
 *      delete_from_journey_pattern_ids: // value for 'delete_from_journey_pattern_ids'
 *   },
 * });
 */
export function useEditStopMutation(
  baseOptions?: Apollo.MutationHookOptions<
    EditStopMutation,
    EditStopMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<EditStopMutation, EditStopMutationVariables>(
    EditStopDocument,
    options,
  );
}
export type EditStopMutationHookResult = ReturnType<typeof useEditStopMutation>;
export type EditStopMutationResult = Apollo.MutationResult<EditStopMutation>;
export type EditStopMutationOptions = Apollo.BaseMutationOptions<
  EditStopMutation,
  EditStopMutationVariables
>;
export const GetStopWithRouteGraphDataByIdDocument = gql`
  query GetStopWithRouteGraphDataById($stopId: uuid!) {
    service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stopId } }
    ) {
      ...scheduled_stop_point_all_fields
      scheduled_stop_point_in_journey_patterns {
        ...scheduled_stop_point_in_journey_pattern_all_fields
        journey_pattern {
          journey_pattern_id
          journey_pattern_route {
            ...route_default_fields
            infrastructure_links_along_route {
              route_id
              infrastructure_link_id
              infrastructure_link_sequence
            }
          }
        }
      }
    }
  }
  ${ScheduledStopPointAllFieldsFragmentDoc}
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
  ${RouteDefaultFieldsFragmentDoc}
`;

/**
 * __useGetStopWithRouteGraphDataByIdQuery__
 *
 * To run a query within a React component, call `useGetStopWithRouteGraphDataByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStopWithRouteGraphDataByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStopWithRouteGraphDataByIdQuery({
 *   variables: {
 *      stopId: // value for 'stopId'
 *   },
 * });
 */
export function useGetStopWithRouteGraphDataByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >(GetStopWithRouteGraphDataByIdDocument, options);
}
export function useGetStopWithRouteGraphDataByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >(GetStopWithRouteGraphDataByIdDocument, options);
}
export type GetStopWithRouteGraphDataByIdQueryHookResult = ReturnType<
  typeof useGetStopWithRouteGraphDataByIdQuery
>;
export type GetStopWithRouteGraphDataByIdLazyQueryHookResult = ReturnType<
  typeof useGetStopWithRouteGraphDataByIdLazyQuery
>;
export type GetStopWithRouteGraphDataByIdQueryResult = Apollo.QueryResult<
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables
>;
export const GetRoutesBrokenByStopChangeDocument = gql`
  query GetRoutesBrokenByStopChange(
    $new_located_on_infrastructure_link_id: uuid!
    $new_direction: String!
    $new_label: String!
    $new_validity_start: date
    $new_validity_end: date
    $new_priority: Int!
    $new_measured_location: geography!
    $replace_scheduled_stop_point_id: uuid
  ) {
    journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point(
      args: {
        replace_scheduled_stop_point_id: $replace_scheduled_stop_point_id
        new_located_on_infrastructure_link_id: $new_located_on_infrastructure_link_id
        new_direction: $new_direction
        new_label: $new_label
        new_validity_start: $new_validity_start
        new_validity_end: $new_validity_end
        new_priority: $new_priority
        new_measured_location: $new_measured_location
      }
    ) {
      journey_pattern_id
      journey_pattern_route {
        ...route_all_fields
      }
    }
  }
  ${RouteAllFieldsFragmentDoc}
`;

/**
 * __useGetRoutesBrokenByStopChangeQuery__
 *
 * To run a query within a React component, call `useGetRoutesBrokenByStopChangeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoutesBrokenByStopChangeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoutesBrokenByStopChangeQuery({
 *   variables: {
 *      new_located_on_infrastructure_link_id: // value for 'new_located_on_infrastructure_link_id'
 *      new_direction: // value for 'new_direction'
 *      new_label: // value for 'new_label'
 *      new_validity_start: // value for 'new_validity_start'
 *      new_validity_end: // value for 'new_validity_end'
 *      new_priority: // value for 'new_priority'
 *      new_measured_location: // value for 'new_measured_location'
 *      replace_scheduled_stop_point_id: // value for 'replace_scheduled_stop_point_id'
 *   },
 * });
 */
export function useGetRoutesBrokenByStopChangeQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRoutesBrokenByStopChangeQuery,
    GetRoutesBrokenByStopChangeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRoutesBrokenByStopChangeQuery,
    GetRoutesBrokenByStopChangeQueryVariables
  >(GetRoutesBrokenByStopChangeDocument, options);
}
export function useGetRoutesBrokenByStopChangeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRoutesBrokenByStopChangeQuery,
    GetRoutesBrokenByStopChangeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRoutesBrokenByStopChangeQuery,
    GetRoutesBrokenByStopChangeQueryVariables
  >(GetRoutesBrokenByStopChangeDocument, options);
}
export type GetRoutesBrokenByStopChangeQueryHookResult = ReturnType<
  typeof useGetRoutesBrokenByStopChangeQuery
>;
export type GetRoutesBrokenByStopChangeLazyQueryHookResult = ReturnType<
  typeof useGetRoutesBrokenByStopChangeLazyQuery
>;
export type GetRoutesBrokenByStopChangeQueryResult = Apollo.QueryResult<
  GetRoutesBrokenByStopChangeQuery,
  GetRoutesBrokenByStopChangeQueryVariables
>;
export const UpdateRouteGeometryDocument = gql`
  mutation UpdateRouteGeometry(
    $route_id: uuid!
    $journey_pattern_id: uuid!
    $new_infrastructure_links: [route_infrastructure_link_along_route_insert_input!]!
    $new_stops_in_journey_pattern: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    delete_route_infrastructure_link_along_route(
      where: { route_id: { _eq: $route_id } }
    ) {
      returning {
        infrastructure_link_id
        infrastructure_link_sequence
        route_id
      }
    }
    insert_route_infrastructure_link_along_route(
      objects: $new_infrastructure_links
    ) {
      returning {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        infrastructure_link {
          infrastructure_link_id
          shape
        }
        is_traversal_forwards
      }
    }
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: { journey_pattern_id: { _eq: $journey_pattern_id } }
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $new_stops_in_journey_pattern
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
  }
`;
export type UpdateRouteGeometryMutationFn = Apollo.MutationFunction<
  UpdateRouteGeometryMutation,
  UpdateRouteGeometryMutationVariables
>;

/**
 * __useUpdateRouteGeometryMutation__
 *
 * To run a mutation, you first call `useUpdateRouteGeometryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRouteGeometryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRouteGeometryMutation, { data, loading, error }] = useUpdateRouteGeometryMutation({
 *   variables: {
 *      route_id: // value for 'route_id'
 *      journey_pattern_id: // value for 'journey_pattern_id'
 *      new_infrastructure_links: // value for 'new_infrastructure_links'
 *      new_stops_in_journey_pattern: // value for 'new_stops_in_journey_pattern'
 *   },
 * });
 */
export function useUpdateRouteGeometryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateRouteGeometryMutation,
    UpdateRouteGeometryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateRouteGeometryMutation,
    UpdateRouteGeometryMutationVariables
  >(UpdateRouteGeometryDocument, options);
}
export type UpdateRouteGeometryMutationHookResult = ReturnType<
  typeof useUpdateRouteGeometryMutation
>;
export type UpdateRouteGeometryMutationResult =
  Apollo.MutationResult<UpdateRouteGeometryMutation>;
export type UpdateRouteGeometryMutationOptions = Apollo.BaseMutationOptions<
  UpdateRouteGeometryMutation,
  UpdateRouteGeometryMutationVariables
>;
export const UpdateRouteJourneyPatternDocument = gql`
  mutation UpdateRouteJourneyPattern(
    $journey_pattern_id: uuid!
    $new_stops_in_journey_pattern: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: { journey_pattern_id: { _eq: $journey_pattern_id } }
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $new_stops_in_journey_pattern
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
  }
`;
export type UpdateRouteJourneyPatternMutationFn = Apollo.MutationFunction<
  UpdateRouteJourneyPatternMutation,
  UpdateRouteJourneyPatternMutationVariables
>;

/**
 * __useUpdateRouteJourneyPatternMutation__
 *
 * To run a mutation, you first call `useUpdateRouteJourneyPatternMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRouteJourneyPatternMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRouteJourneyPatternMutation, { data, loading, error }] = useUpdateRouteJourneyPatternMutation({
 *   variables: {
 *      journey_pattern_id: // value for 'journey_pattern_id'
 *      new_stops_in_journey_pattern: // value for 'new_stops_in_journey_pattern'
 *   },
 * });
 */
export function useUpdateRouteJourneyPatternMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateRouteJourneyPatternMutation,
    UpdateRouteJourneyPatternMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateRouteJourneyPatternMutation,
    UpdateRouteJourneyPatternMutationVariables
  >(UpdateRouteJourneyPatternDocument, options);
}
export type UpdateRouteJourneyPatternMutationHookResult = ReturnType<
  typeof useUpdateRouteJourneyPatternMutation
>;
export type UpdateRouteJourneyPatternMutationResult =
  Apollo.MutationResult<UpdateRouteJourneyPatternMutation>;
export type UpdateRouteJourneyPatternMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateRouteJourneyPatternMutation,
    UpdateRouteJourneyPatternMutationVariables
  >;
export const GetLinksWithStopsByExternalLinkIdsDocument = gql`
  query GetLinksWithStopsByExternalLinkIds($externalLinkIds: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $externalLinkIds } }
    ) {
      ...route_infra_link_fields
    }
  }
  ${RouteInfraLinkFieldsFragmentDoc}
`;

/**
 * __useGetLinksWithStopsByExternalLinkIdsQuery__
 *
 * To run a query within a React component, call `useGetLinksWithStopsByExternalLinkIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinksWithStopsByExternalLinkIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinksWithStopsByExternalLinkIdsQuery({
 *   variables: {
 *      externalLinkIds: // value for 'externalLinkIds'
 *   },
 * });
 */
export function useGetLinksWithStopsByExternalLinkIdsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLinksWithStopsByExternalLinkIdsQuery,
    GetLinksWithStopsByExternalLinkIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLinksWithStopsByExternalLinkIdsQuery,
    GetLinksWithStopsByExternalLinkIdsQueryVariables
  >(GetLinksWithStopsByExternalLinkIdsDocument, options);
}
export function useGetLinksWithStopsByExternalLinkIdsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLinksWithStopsByExternalLinkIdsQuery,
    GetLinksWithStopsByExternalLinkIdsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLinksWithStopsByExternalLinkIdsQuery,
    GetLinksWithStopsByExternalLinkIdsQueryVariables
  >(GetLinksWithStopsByExternalLinkIdsDocument, options);
}
export type GetLinksWithStopsByExternalLinkIdsQueryHookResult = ReturnType<
  typeof useGetLinksWithStopsByExternalLinkIdsQuery
>;
export type GetLinksWithStopsByExternalLinkIdsLazyQueryHookResult = ReturnType<
  typeof useGetLinksWithStopsByExternalLinkIdsLazyQuery
>;
export type GetLinksWithStopsByExternalLinkIdsQueryResult = Apollo.QueryResult<
  GetLinksWithStopsByExternalLinkIdsQuery,
  GetLinksWithStopsByExternalLinkIdsQueryVariables
>;
export const GetLineRoutesByLabelDocument = gql`
  query GetLineRoutesByLabel(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
  ) {
    route_line(where: $lineFilters) {
      line_id
      line_routes(where: $lineRouteFilters) {
        ...displayed_route
      }
    }
  }
  ${DisplayedRouteFragmentDoc}
`;

/**
 * __useGetLineRoutesByLabelQuery__
 *
 * To run a query within a React component, call `useGetLineRoutesByLabelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLineRoutesByLabelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLineRoutesByLabelQuery({
 *   variables: {
 *      lineFilters: // value for 'lineFilters'
 *      lineRouteFilters: // value for 'lineRouteFilters'
 *   },
 * });
 */
export function useGetLineRoutesByLabelQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetLineRoutesByLabelQuery,
    GetLineRoutesByLabelQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLineRoutesByLabelQuery,
    GetLineRoutesByLabelQueryVariables
  >(GetLineRoutesByLabelDocument, options);
}
export function useGetLineRoutesByLabelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLineRoutesByLabelQuery,
    GetLineRoutesByLabelQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLineRoutesByLabelQuery,
    GetLineRoutesByLabelQueryVariables
  >(GetLineRoutesByLabelDocument, options);
}
export type GetLineRoutesByLabelQueryHookResult = ReturnType<
  typeof useGetLineRoutesByLabelQuery
>;
export type GetLineRoutesByLabelLazyQueryHookResult = ReturnType<
  typeof useGetLineRoutesByLabelLazyQuery
>;
export type GetLineRoutesByLabelQueryResult = Apollo.QueryResult<
  GetLineRoutesByLabelQuery,
  GetLineRoutesByLabelQueryVariables
>;
export const GetRouteByFiltersDocument = gql`
  query GetRouteByFilters($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...displayed_route
    }
  }
  ${DisplayedRouteFragmentDoc}
`;

/**
 * __useGetRouteByFiltersQuery__
 *
 * To run a query within a React component, call `useGetRouteByFiltersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteByFiltersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteByFiltersQuery({
 *   variables: {
 *      routeFilters: // value for 'routeFilters'
 *   },
 * });
 */
export function useGetRouteByFiltersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRouteByFiltersQuery,
    GetRouteByFiltersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteByFiltersQuery,
    GetRouteByFiltersQueryVariables
  >(GetRouteByFiltersDocument, options);
}
export function useGetRouteByFiltersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteByFiltersQuery,
    GetRouteByFiltersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteByFiltersQuery,
    GetRouteByFiltersQueryVariables
  >(GetRouteByFiltersDocument, options);
}
export type GetRouteByFiltersQueryHookResult = ReturnType<
  typeof useGetRouteByFiltersQuery
>;
export type GetRouteByFiltersLazyQueryHookResult = ReturnType<
  typeof useGetRouteByFiltersLazyQuery
>;
export type GetRouteByFiltersQueryResult = Apollo.QueryResult<
  GetRouteByFiltersQuery,
  GetRouteByFiltersQueryVariables
>;
export const GetRouteWithInfrastructureLinksWithStopsDocument = gql`
  query GetRouteWithInfrastructureLinksWithStops($route_id: uuid!) {
    route_route_by_pk(route_id: $route_id) {
      ...route_with_infrastructure_links_with_stops
    }
  }
  ${RouteWithInfrastructureLinksWithStopsFragmentDoc}
`;

/**
 * __useGetRouteWithInfrastructureLinksWithStopsQuery__
 *
 * To run a query within a React component, call `useGetRouteWithInfrastructureLinksWithStopsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteWithInfrastructureLinksWithStopsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteWithInfrastructureLinksWithStopsQuery({
 *   variables: {
 *      route_id: // value for 'route_id'
 *   },
 * });
 */
export function useGetRouteWithInfrastructureLinksWithStopsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >(GetRouteWithInfrastructureLinksWithStopsDocument, options);
}
export function useGetRouteWithInfrastructureLinksWithStopsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >(GetRouteWithInfrastructureLinksWithStopsDocument, options);
}
export type GetRouteWithInfrastructureLinksWithStopsQueryHookResult =
  ReturnType<typeof useGetRouteWithInfrastructureLinksWithStopsQuery>;
export type GetRouteWithInfrastructureLinksWithStopsLazyQueryHookResult =
  ReturnType<typeof useGetRouteWithInfrastructureLinksWithStopsLazyQuery>;
export type GetRouteWithInfrastructureLinksWithStopsQueryResult =
  Apollo.QueryResult<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >;
export const SearchLinesAndRoutesDocument = gql`
  query SearchLinesAndRoutes(
    $lineFilter: route_line_bool_exp
    $routeFilter: route_route_bool_exp
    $lineOrderBy: [route_line_order_by!]
    $routeOrderBy: [route_route_order_by!]
  ) {
    route_line(where: $lineFilter, order_by: $lineOrderBy) {
      ...line_table_row
    }
    route_route(where: $routeFilter, order_by: $routeOrderBy) {
      ...route_table_row
    }
  }
  ${LineTableRowFragmentDoc}
  ${RouteTableRowFragmentDoc}
`;

/**
 * __useSearchLinesAndRoutesQuery__
 *
 * To run a query within a React component, call `useSearchLinesAndRoutesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchLinesAndRoutesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchLinesAndRoutesQuery({
 *   variables: {
 *      lineFilter: // value for 'lineFilter'
 *      routeFilter: // value for 'routeFilter'
 *      lineOrderBy: // value for 'lineOrderBy'
 *      routeOrderBy: // value for 'routeOrderBy'
 *   },
 * });
 */
export function useSearchLinesAndRoutesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    SearchLinesAndRoutesQuery,
    SearchLinesAndRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchLinesAndRoutesQuery,
    SearchLinesAndRoutesQueryVariables
  >(SearchLinesAndRoutesDocument, options);
}
export function useSearchLinesAndRoutesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchLinesAndRoutesQuery,
    SearchLinesAndRoutesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchLinesAndRoutesQuery,
    SearchLinesAndRoutesQueryVariables
  >(SearchLinesAndRoutesDocument, options);
}
export type SearchLinesAndRoutesQueryHookResult = ReturnType<
  typeof useSearchLinesAndRoutesQuery
>;
export type SearchLinesAndRoutesLazyQueryHookResult = ReturnType<
  typeof useSearchLinesAndRoutesLazyQuery
>;
export type SearchLinesAndRoutesQueryResult = Apollo.QueryResult<
  SearchLinesAndRoutesQuery,
  SearchLinesAndRoutesQueryVariables
>;
export const PatchScheduledStopPointTimingSettingsDocument = gql`
  mutation PatchScheduledStopPointTimingSettings(
    $stopLabel: String!
    $journeyPatternId: uuid!
    $sequence: Int!
    $patch: journey_pattern_scheduled_stop_point_in_journey_pattern_set_input!
  ) {
    update_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        scheduled_stop_point_label: { _eq: $stopLabel }
        scheduled_stop_point_sequence: { _eq: $sequence }
        journey_pattern_id: { _eq: $journeyPatternId }
      }
      _set: $patch
    ) {
      returning {
        ...scheduled_stop_point_in_journey_pattern_all_fields
      }
    }
  }
  ${ScheduledStopPointInJourneyPatternAllFieldsFragmentDoc}
`;
export type PatchScheduledStopPointTimingSettingsMutationFn =
  Apollo.MutationFunction<
    PatchScheduledStopPointTimingSettingsMutation,
    PatchScheduledStopPointTimingSettingsMutationVariables
  >;

/**
 * __usePatchScheduledStopPointTimingSettingsMutation__
 *
 * To run a mutation, you first call `usePatchScheduledStopPointTimingSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePatchScheduledStopPointTimingSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [patchScheduledStopPointTimingSettingsMutation, { data, loading, error }] = usePatchScheduledStopPointTimingSettingsMutation({
 *   variables: {
 *      stopLabel: // value for 'stopLabel'
 *      journeyPatternId: // value for 'journeyPatternId'
 *      sequence: // value for 'sequence'
 *      patch: // value for 'patch'
 *   },
 * });
 */
export function usePatchScheduledStopPointTimingSettingsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    PatchScheduledStopPointTimingSettingsMutation,
    PatchScheduledStopPointTimingSettingsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    PatchScheduledStopPointTimingSettingsMutation,
    PatchScheduledStopPointTimingSettingsMutationVariables
  >(PatchScheduledStopPointTimingSettingsDocument, options);
}
export type PatchScheduledStopPointTimingSettingsMutationHookResult =
  ReturnType<typeof usePatchScheduledStopPointTimingSettingsMutation>;
export type PatchScheduledStopPointTimingSettingsMutationResult =
  Apollo.MutationResult<PatchScheduledStopPointTimingSettingsMutation>;
export type PatchScheduledStopPointTimingSettingsMutationOptions =
  Apollo.BaseMutationOptions<
    PatchScheduledStopPointTimingSettingsMutation,
    PatchScheduledStopPointTimingSettingsMutationVariables
  >;
export const InsertTimingPlaceDocument = gql`
  mutation InsertTimingPlace(
    $object: timing_pattern_timing_place_insert_input!
  ) {
    insert_timing_pattern_timing_place_one(object: $object) {
      ...created_timing_place
    }
  }
  ${CreatedTimingPlaceFragmentDoc}
`;
export type InsertTimingPlaceMutationFn = Apollo.MutationFunction<
  InsertTimingPlaceMutation,
  InsertTimingPlaceMutationVariables
>;

/**
 * __useInsertTimingPlaceMutation__
 *
 * To run a mutation, you first call `useInsertTimingPlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertTimingPlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertTimingPlaceMutation, { data, loading, error }] = useInsertTimingPlaceMutation({
 *   variables: {
 *      object: // value for 'object'
 *   },
 * });
 */
export function useInsertTimingPlaceMutation(
  baseOptions?: Apollo.MutationHookOptions<
    InsertTimingPlaceMutation,
    InsertTimingPlaceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    InsertTimingPlaceMutation,
    InsertTimingPlaceMutationVariables
  >(InsertTimingPlaceDocument, options);
}
export type InsertTimingPlaceMutationHookResult = ReturnType<
  typeof useInsertTimingPlaceMutation
>;
export type InsertTimingPlaceMutationResult =
  Apollo.MutationResult<InsertTimingPlaceMutation>;
export type InsertTimingPlaceMutationOptions = Apollo.BaseMutationOptions<
  InsertTimingPlaceMutation,
  InsertTimingPlaceMutationVariables
>;
export const GetTimingPlacesByLabelDocument = gql`
  query GetTimingPlacesByLabel($label: String!) {
    timing_pattern_timing_place(where: { label: { _eq: $label } }) {
      ...created_timing_place
    }
  }
  ${CreatedTimingPlaceFragmentDoc}
`;

/**
 * __useGetTimingPlacesByLabelQuery__
 *
 * To run a query within a React component, call `useGetTimingPlacesByLabelQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimingPlacesByLabelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimingPlacesByLabelQuery({
 *   variables: {
 *      label: // value for 'label'
 *   },
 * });
 */
export function useGetTimingPlacesByLabelQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTimingPlacesByLabelQuery,
    GetTimingPlacesByLabelQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTimingPlacesByLabelQuery,
    GetTimingPlacesByLabelQueryVariables
  >(GetTimingPlacesByLabelDocument, options);
}
export function useGetTimingPlacesByLabelLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTimingPlacesByLabelQuery,
    GetTimingPlacesByLabelQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTimingPlacesByLabelQuery,
    GetTimingPlacesByLabelQueryVariables
  >(GetTimingPlacesByLabelDocument, options);
}
export type GetTimingPlacesByLabelQueryHookResult = ReturnType<
  typeof useGetTimingPlacesByLabelQuery
>;
export type GetTimingPlacesByLabelLazyQueryHookResult = ReturnType<
  typeof useGetTimingPlacesByLabelLazyQuery
>;
export type GetTimingPlacesByLabelQueryResult = Apollo.QueryResult<
  GetTimingPlacesByLabelQuery,
  GetTimingPlacesByLabelQueryVariables
>;
export const GetLinesForComboboxDocument = gql`
  query GetLinesForCombobox($labelPattern: String!, $date: date!) {
    route_line(
      limit: 10
      where: {
        label: { _ilike: $labelPattern }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
      }
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_for_combobox
    }
  }
  ${LineForComboboxFragmentDoc}
`;

/**
 * __useGetLinesForComboboxQuery__
 *
 * To run a query within a React component, call `useGetLinesForComboboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLinesForComboboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLinesForComboboxQuery({
 *   variables: {
 *      labelPattern: // value for 'labelPattern'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useGetLinesForComboboxQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetLinesForComboboxQuery,
    GetLinesForComboboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetLinesForComboboxQuery,
    GetLinesForComboboxQueryVariables
  >(GetLinesForComboboxDocument, options);
}
export function useGetLinesForComboboxLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetLinesForComboboxQuery,
    GetLinesForComboboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetLinesForComboboxQuery,
    GetLinesForComboboxQueryVariables
  >(GetLinesForComboboxDocument, options);
}
export type GetLinesForComboboxQueryHookResult = ReturnType<
  typeof useGetLinesForComboboxQuery
>;
export type GetLinesForComboboxLazyQueryHookResult = ReturnType<
  typeof useGetLinesForComboboxLazyQuery
>;
export type GetLinesForComboboxQueryResult = Apollo.QueryResult<
  GetLinesForComboboxQuery,
  GetLinesForComboboxQueryVariables
>;
export const GetSelectedLineDetailsByIdDocument = gql`
  query GetSelectedLineDetailsById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_for_combobox
    }
  }
  ${LineForComboboxFragmentDoc}
`;

/**
 * __useGetSelectedLineDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetSelectedLineDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelectedLineDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelectedLineDetailsByIdQuery({
 *   variables: {
 *      line_id: // value for 'line_id'
 *   },
 * });
 */
export function useGetSelectedLineDetailsByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSelectedLineDetailsByIdQuery,
    GetSelectedLineDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetSelectedLineDetailsByIdQuery,
    GetSelectedLineDetailsByIdQueryVariables
  >(GetSelectedLineDetailsByIdDocument, options);
}
export function useGetSelectedLineDetailsByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSelectedLineDetailsByIdQuery,
    GetSelectedLineDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSelectedLineDetailsByIdQuery,
    GetSelectedLineDetailsByIdQueryVariables
  >(GetSelectedLineDetailsByIdDocument, options);
}
export type GetSelectedLineDetailsByIdQueryHookResult = ReturnType<
  typeof useGetSelectedLineDetailsByIdQuery
>;
export type GetSelectedLineDetailsByIdLazyQueryHookResult = ReturnType<
  typeof useGetSelectedLineDetailsByIdLazyQuery
>;
export type GetSelectedLineDetailsByIdQueryResult = Apollo.QueryResult<
  GetSelectedLineDetailsByIdQuery,
  GetSelectedLineDetailsByIdQueryVariables
>;
export const GetRouteDetailsByLabelWildcardDocument = gql`
  query GetRouteDetailsByLabelWildcard(
    $labelPattern: String!
    $date: date
    $priorities: [Int!]
  ) {
    route_route(
      limit: 7
      where: {
        label: { _ilike: $labelPattern }
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
        priority: { _in: $priorities }
      }
      order_by: { label: asc }
    ) {
      ...route_all_fields
    }
  }
  ${RouteAllFieldsFragmentDoc}
`;

/**
 * __useGetRouteDetailsByLabelWildcardQuery__
 *
 * To run a query within a React component, call `useGetRouteDetailsByLabelWildcardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRouteDetailsByLabelWildcardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRouteDetailsByLabelWildcardQuery({
 *   variables: {
 *      labelPattern: // value for 'labelPattern'
 *      date: // value for 'date'
 *      priorities: // value for 'priorities'
 *   },
 * });
 */
export function useGetRouteDetailsByLabelWildcardQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetRouteDetailsByLabelWildcardQuery,
    GetRouteDetailsByLabelWildcardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRouteDetailsByLabelWildcardQuery,
    GetRouteDetailsByLabelWildcardQueryVariables
  >(GetRouteDetailsByLabelWildcardDocument, options);
}
export function useGetRouteDetailsByLabelWildcardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRouteDetailsByLabelWildcardQuery,
    GetRouteDetailsByLabelWildcardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRouteDetailsByLabelWildcardQuery,
    GetRouteDetailsByLabelWildcardQueryVariables
  >(GetRouteDetailsByLabelWildcardDocument, options);
}
export type GetRouteDetailsByLabelWildcardQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelWildcardQuery
>;
export type GetRouteDetailsByLabelWildcardLazyQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelWildcardLazyQuery
>;
export type GetRouteDetailsByLabelWildcardQueryResult = Apollo.QueryResult<
  GetRouteDetailsByLabelWildcardQuery,
  GetRouteDetailsByLabelWildcardQueryVariables
>;
export const GetSelectedRouteDetailsByIdDocument = gql`
  query GetSelectedRouteDetailsById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_all_fields
    }
  }
  ${RouteAllFieldsFragmentDoc}
`;

/**
 * __useGetSelectedRouteDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetSelectedRouteDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelectedRouteDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelectedRouteDetailsByIdQuery({
 *   variables: {
 *      routeId: // value for 'routeId'
 *   },
 * });
 */
export function useGetSelectedRouteDetailsByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSelectedRouteDetailsByIdQuery,
    GetSelectedRouteDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetSelectedRouteDetailsByIdQuery,
    GetSelectedRouteDetailsByIdQueryVariables
  >(GetSelectedRouteDetailsByIdDocument, options);
}
export function useGetSelectedRouteDetailsByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSelectedRouteDetailsByIdQuery,
    GetSelectedRouteDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSelectedRouteDetailsByIdQuery,
    GetSelectedRouteDetailsByIdQueryVariables
  >(GetSelectedRouteDetailsByIdDocument, options);
}
export type GetSelectedRouteDetailsByIdQueryHookResult = ReturnType<
  typeof useGetSelectedRouteDetailsByIdQuery
>;
export type GetSelectedRouteDetailsByIdLazyQueryHookResult = ReturnType<
  typeof useGetSelectedRouteDetailsByIdLazyQuery
>;
export type GetSelectedRouteDetailsByIdQueryResult = Apollo.QueryResult<
  GetSelectedRouteDetailsByIdQuery,
  GetSelectedRouteDetailsByIdQueryVariables
>;
export const GetTimingPlacesForComboboxDocument = gql`
  query GetTimingPlacesForCombobox($labelPattern: String!) {
    timing_pattern_timing_place(
      limit: 10
      where: { label: { _ilike: $labelPattern } }
      order_by: [{ label: asc }]
    ) {
      ...timing_place_for_combobox
    }
  }
  ${TimingPlaceForComboboxFragmentDoc}
`;

/**
 * __useGetTimingPlacesForComboboxQuery__
 *
 * To run a query within a React component, call `useGetTimingPlacesForComboboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimingPlacesForComboboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimingPlacesForComboboxQuery({
 *   variables: {
 *      labelPattern: // value for 'labelPattern'
 *   },
 * });
 */
export function useGetTimingPlacesForComboboxQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTimingPlacesForComboboxQuery,
    GetTimingPlacesForComboboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTimingPlacesForComboboxQuery,
    GetTimingPlacesForComboboxQueryVariables
  >(GetTimingPlacesForComboboxDocument, options);
}
export function useGetTimingPlacesForComboboxLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTimingPlacesForComboboxQuery,
    GetTimingPlacesForComboboxQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTimingPlacesForComboboxQuery,
    GetTimingPlacesForComboboxQueryVariables
  >(GetTimingPlacesForComboboxDocument, options);
}
export type GetTimingPlacesForComboboxQueryHookResult = ReturnType<
  typeof useGetTimingPlacesForComboboxQuery
>;
export type GetTimingPlacesForComboboxLazyQueryHookResult = ReturnType<
  typeof useGetTimingPlacesForComboboxLazyQuery
>;
export type GetTimingPlacesForComboboxQueryResult = Apollo.QueryResult<
  GetTimingPlacesForComboboxQuery,
  GetTimingPlacesForComboboxQueryVariables
>;
export const GetSelectedTimingPlaceDetailsByIdDocument = gql`
  query GetSelectedTimingPlaceDetailsById($timing_place_id: uuid!) {
    timing_pattern_timing_place_by_pk(timing_place_id: $timing_place_id) {
      ...timing_place_for_combobox
    }
  }
  ${TimingPlaceForComboboxFragmentDoc}
`;

/**
 * __useGetSelectedTimingPlaceDetailsByIdQuery__
 *
 * To run a query within a React component, call `useGetSelectedTimingPlaceDetailsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelectedTimingPlaceDetailsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelectedTimingPlaceDetailsByIdQuery({
 *   variables: {
 *      timing_place_id: // value for 'timing_place_id'
 *   },
 * });
 */
export function useGetSelectedTimingPlaceDetailsByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSelectedTimingPlaceDetailsByIdQuery,
    GetSelectedTimingPlaceDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetSelectedTimingPlaceDetailsByIdQuery,
    GetSelectedTimingPlaceDetailsByIdQueryVariables
  >(GetSelectedTimingPlaceDetailsByIdDocument, options);
}
export function useGetSelectedTimingPlaceDetailsByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSelectedTimingPlaceDetailsByIdQuery,
    GetSelectedTimingPlaceDetailsByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSelectedTimingPlaceDetailsByIdQuery,
    GetSelectedTimingPlaceDetailsByIdQueryVariables
  >(GetSelectedTimingPlaceDetailsByIdDocument, options);
}
export type GetSelectedTimingPlaceDetailsByIdQueryHookResult = ReturnType<
  typeof useGetSelectedTimingPlaceDetailsByIdQuery
>;
export type GetSelectedTimingPlaceDetailsByIdLazyQueryHookResult = ReturnType<
  typeof useGetSelectedTimingPlaceDetailsByIdLazyQuery
>;
export type GetSelectedTimingPlaceDetailsByIdQueryResult = Apollo.QueryResult<
  GetSelectedTimingPlaceDetailsByIdQuery,
  GetSelectedTimingPlaceDetailsByIdQueryVariables
>;
export const GetTimetablesForOperationDayDocument = gql`
  query GetTimetablesForOperationDay {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        order_by: { priority: desc }
        where: {
          vehicle_services: {
            blocks: {
              vehicle_journeys: {
                journey_pattern_ref: { journey_pattern_id: {} }
              }
            }
          }
        }
      ) {
        validity_end
        validity_start
        name_i18n
        vehicle_schedule_frame_id
        priority
        vehicle_services {
          ...vehicle_service_with_journeys
        }
      }
    }
  }
  ${VehicleServiceWithJourneysFragmentDoc}
`;

/**
 * __useGetTimetablesForOperationDayQuery__
 *
 * To run a query within a React component, call `useGetTimetablesForOperationDayQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTimetablesForOperationDayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTimetablesForOperationDayQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTimetablesForOperationDayQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetTimetablesForOperationDayQuery,
    GetTimetablesForOperationDayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetTimetablesForOperationDayQuery,
    GetTimetablesForOperationDayQueryVariables
  >(GetTimetablesForOperationDayDocument, options);
}
export function useGetTimetablesForOperationDayLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTimetablesForOperationDayQuery,
    GetTimetablesForOperationDayQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetTimetablesForOperationDayQuery,
    GetTimetablesForOperationDayQueryVariables
  >(GetTimetablesForOperationDayDocument, options);
}
export type GetTimetablesForOperationDayQueryHookResult = ReturnType<
  typeof useGetTimetablesForOperationDayQuery
>;
export type GetTimetablesForOperationDayLazyQueryHookResult = ReturnType<
  typeof useGetTimetablesForOperationDayLazyQuery
>;
export type GetTimetablesForOperationDayQueryResult = Apollo.QueryResult<
  GetTimetablesForOperationDayQuery,
  GetTimetablesForOperationDayQueryVariables
>;

export function useGetRouteWithInfrastructureLinksAsyncQuery() {
  return useAsyncQuery<
    GetRouteWithInfrastructureLinksQuery,
    GetRouteWithInfrastructureLinksQueryVariables
  >(GetRouteWithInfrastructureLinksDocument);
}
export type GetRouteWithInfrastructureLinksAsyncQueryHookResult = ReturnType<
  typeof useGetRouteWithInfrastructureLinksAsyncQuery
>;
export function useListChangingRoutesAsyncQuery() {
  return useAsyncQuery<
    ListChangingRoutesQuery,
    ListChangingRoutesQueryVariables
  >(ListChangingRoutesDocument);
}
export type ListChangingRoutesAsyncQueryHookResult = ReturnType<
  typeof useListChangingRoutesAsyncQuery
>;
export function useListOwnLinesAsyncQuery() {
  return useAsyncQuery<ListOwnLinesQuery, ListOwnLinesQueryVariables>(
    ListOwnLinesDocument,
  );
}
export type ListOwnLinesAsyncQueryHookResult = ReturnType<
  typeof useListOwnLinesAsyncQuery
>;
export function useGetScheduledStopPointWithTimingSettingsAsyncQuery() {
  return useAsyncQuery<
    GetScheduledStopPointWithTimingSettingsQuery,
    GetScheduledStopPointWithTimingSettingsQueryVariables
  >(GetScheduledStopPointWithTimingSettingsDocument);
}
export type GetScheduledStopPointWithTimingSettingsAsyncQueryHookResult =
  ReturnType<typeof useGetScheduledStopPointWithTimingSettingsAsyncQuery>;
export function useGetVehicleJourneysAsyncQuery() {
  return useAsyncQuery<
    GetVehicleJourneysQuery,
    GetVehicleJourneysQueryVariables
  >(GetVehicleJourneysDocument);
}
export type GetVehicleJourneysAsyncQueryHookResult = ReturnType<
  typeof useGetVehicleJourneysAsyncQuery
>;
export function useQueryClosestLinkAsyncQuery() {
  return useAsyncQuery<QueryClosestLinkQuery, QueryClosestLinkQueryVariables>(
    QueryClosestLinkDocument,
  );
}
export type QueryClosestLinkAsyncQueryHookResult = ReturnType<
  typeof useQueryClosestLinkAsyncQuery
>;
export function useQueryPointDirectionOnLinkAsyncQuery() {
  return useAsyncQuery<
    QueryPointDirectionOnLinkQuery,
    QueryPointDirectionOnLinkQueryVariables
  >(QueryPointDirectionOnLinkDocument);
}
export type QueryPointDirectionOnLinkAsyncQueryHookResult = ReturnType<
  typeof useQueryPointDirectionOnLinkAsyncQuery
>;
export function useGetStopsAlongInfrastructureLinksAsyncQuery() {
  return useAsyncQuery<
    GetStopsAlongInfrastructureLinksQuery,
    GetStopsAlongInfrastructureLinksQueryVariables
  >(GetStopsAlongInfrastructureLinksDocument);
}
export type GetStopsAlongInfrastructureLinksAsyncQueryHookResult = ReturnType<
  typeof useGetStopsAlongInfrastructureLinksAsyncQuery
>;

export function useGetScheduledStopPointWithViaInfoAsyncQuery() {
  return useAsyncQuery<
    GetScheduledStopPointWithViaInfoQuery,
    GetScheduledStopPointWithViaInfoQueryVariables
  >(GetScheduledStopPointWithViaInfoDocument);
}
export type GetScheduledStopPointWithViaInfoAsyncQueryHookResult = ReturnType<
  typeof useGetScheduledStopPointWithViaInfoAsyncQuery
>;
export function useGetLineDetailsByIdAsyncQuery() {
  return useAsyncQuery<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >(GetLineDetailsByIdDocument);
}
export type GetLineDetailsByIdAsyncQueryHookResult = ReturnType<
  typeof useGetLineDetailsByIdAsyncQuery
>;
export function useGetLineValidityPeriodByIdAsyncQuery() {
  return useAsyncQuery<
    GetLineValidityPeriodByIdQuery,
    GetLineValidityPeriodByIdQueryVariables
  >(GetLineValidityPeriodByIdDocument);
}
export type GetLineValidityPeriodByIdAsyncQueryHookResult = ReturnType<
  typeof useGetLineValidityPeriodByIdAsyncQuery
>;
export function useGetLinesByValidityAsyncQuery() {
  return useAsyncQuery<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >(GetLinesByValidityDocument);
}
export type GetLinesByValidityAsyncQueryHookResult = ReturnType<
  typeof useGetLinesByValidityAsyncQuery
>;
export function useGetLineDetailsWithRoutesByIdAsyncQuery() {
  return useAsyncQuery<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >(GetLineDetailsWithRoutesByIdDocument);
}
export type GetLineDetailsWithRoutesByIdAsyncQueryHookResult = ReturnType<
  typeof useGetLineDetailsWithRoutesByIdAsyncQuery
>;
export function useGetHighestPriorityLineDetailsWithRoutesAsyncQuery() {
  return useAsyncQuery<
    GetHighestPriorityLineDetailsWithRoutesQuery,
    GetHighestPriorityLineDetailsWithRoutesQueryVariables
  >(GetHighestPriorityLineDetailsWithRoutesDocument);
}
export type GetHighestPriorityLineDetailsWithRoutesAsyncQueryHookResult =
  ReturnType<typeof useGetHighestPriorityLineDetailsWithRoutesAsyncQuery>;
export function useGetRoutesWithStopsAsyncQuery() {
  return useAsyncQuery<
    GetRoutesWithStopsQuery,
    GetRoutesWithStopsQueryVariables
  >(GetRoutesWithStopsDocument);
}
export type GetRoutesWithStopsAsyncQueryHookResult = ReturnType<
  typeof useGetRoutesWithStopsAsyncQuery
>;
export function useGetRouteDetailsByIdAsyncQuery() {
  return useAsyncQuery<
    GetRouteDetailsByIdQuery,
    GetRouteDetailsByIdQueryVariables
  >(GetRouteDetailsByIdDocument);
}
export type GetRouteDetailsByIdAsyncQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdAsyncQuery
>;
export function useGetRouteDetailsByIdsAsyncQuery() {
  return useAsyncQuery<
    GetRouteDetailsByIdsQuery,
    GetRouteDetailsByIdsQueryVariables
  >(GetRouteDetailsByIdsDocument);
}
export type GetRouteDetailsByIdsAsyncQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByIdsAsyncQuery
>;
export function useGetRouteRenderInfoByIdAsyncQuery() {
  return useAsyncQuery<
    GetRouteRenderInfoByIdQuery,
    GetRouteRenderInfoByIdQueryVariables
  >(GetRouteRenderInfoByIdDocument);
}
export type GetRouteRenderInfoByIdAsyncQueryHookResult = ReturnType<
  typeof useGetRouteRenderInfoByIdAsyncQuery
>;
export function useGetRouteDetailsByLabelsAsyncQuery() {
  return useAsyncQuery<
    GetRouteDetailsByLabelsQuery,
    GetRouteDetailsByLabelsQueryVariables
  >(GetRouteDetailsByLabelsDocument);
}
export type GetRouteDetailsByLabelsAsyncQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelsAsyncQuery
>;
export function useGetRoutesWithInfrastructureLinksAsyncQuery() {
  return useAsyncQuery<
    GetRoutesWithInfrastructureLinksQuery,
    GetRoutesWithInfrastructureLinksQueryVariables
  >(GetRoutesWithInfrastructureLinksDocument);
}
export type GetRoutesWithInfrastructureLinksAsyncQueryHookResult = ReturnType<
  typeof useGetRoutesWithInfrastructureLinksAsyncQuery
>;
export function useGetRoutesByValidityAsyncQuery() {
  return useAsyncQuery<
    GetRoutesByValidityQuery,
    GetRoutesByValidityQueryVariables
  >(GetRoutesByValidityDocument);
}
export type GetRoutesByValidityAsyncQueryHookResult = ReturnType<
  typeof useGetRoutesByValidityAsyncQuery
>;

export function useGetScheduledStopsOnRouteAsyncQuery() {
  return useAsyncQuery<
    GetScheduledStopsOnRouteQuery,
    GetScheduledStopsOnRouteQueryVariables
  >(GetScheduledStopsOnRouteDocument);
}
export type GetScheduledStopsOnRouteAsyncQueryHookResult = ReturnType<
  typeof useGetScheduledStopsOnRouteAsyncQuery
>;

export function useGetStopsByLocationAsyncQuery() {
  return useAsyncQuery<
    GetStopsByLocationQuery,
    GetStopsByLocationQueryVariables
  >(GetStopsByLocationDocument);
}
export type GetStopsByLocationAsyncQueryHookResult = ReturnType<
  typeof useGetStopsByLocationAsyncQuery
>;
export function useGetStopsByValidityAsyncQuery() {
  return useAsyncQuery<
    GetStopsByValidityQuery,
    GetStopsByValidityQueryVariables
  >(GetStopsByValidityDocument);
}
export type GetStopsByValidityAsyncQueryHookResult = ReturnType<
  typeof useGetStopsByValidityAsyncQuery
>;
export function useGetStopsByIdsAsyncQuery() {
  return useAsyncQuery<GetStopsByIdsQuery, GetStopsByIdsQueryVariables>(
    GetStopsByIdsDocument,
  );
}
export type GetStopsByIdsAsyncQueryHookResult = ReturnType<
  typeof useGetStopsByIdsAsyncQuery
>;
export function useGetStopsByLabelsAsyncQuery() {
  return useAsyncQuery<GetStopsByLabelsQuery, GetStopsByLabelsQueryVariables>(
    GetStopsByLabelsDocument,
  );
}
export type GetStopsByLabelsAsyncQueryHookResult = ReturnType<
  typeof useGetStopsByLabelsAsyncQuery
>;

export function useGetStopWithRouteGraphDataByIdAsyncQuery() {
  return useAsyncQuery<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >(GetStopWithRouteGraphDataByIdDocument);
}
export type GetStopWithRouteGraphDataByIdAsyncQueryHookResult = ReturnType<
  typeof useGetStopWithRouteGraphDataByIdAsyncQuery
>;
export function useGetRoutesBrokenByStopChangeAsyncQuery() {
  return useAsyncQuery<
    GetRoutesBrokenByStopChangeQuery,
    GetRoutesBrokenByStopChangeQueryVariables
  >(GetRoutesBrokenByStopChangeDocument);
}
export type GetRoutesBrokenByStopChangeAsyncQueryHookResult = ReturnType<
  typeof useGetRoutesBrokenByStopChangeAsyncQuery
>;

export function useGetLinksWithStopsByExternalLinkIdsAsyncQuery() {
  return useAsyncQuery<
    GetLinksWithStopsByExternalLinkIdsQuery,
    GetLinksWithStopsByExternalLinkIdsQueryVariables
  >(GetLinksWithStopsByExternalLinkIdsDocument);
}
export type GetLinksWithStopsByExternalLinkIdsAsyncQueryHookResult = ReturnType<
  typeof useGetLinksWithStopsByExternalLinkIdsAsyncQuery
>;
export function useGetLineRoutesByLabelAsyncQuery() {
  return useAsyncQuery<
    GetLineRoutesByLabelQuery,
    GetLineRoutesByLabelQueryVariables
  >(GetLineRoutesByLabelDocument);
}
export type GetLineRoutesByLabelAsyncQueryHookResult = ReturnType<
  typeof useGetLineRoutesByLabelAsyncQuery
>;
export function useGetRouteByFiltersAsyncQuery() {
  return useAsyncQuery<GetRouteByFiltersQuery, GetRouteByFiltersQueryVariables>(
    GetRouteByFiltersDocument,
  );
}
export type GetRouteByFiltersAsyncQueryHookResult = ReturnType<
  typeof useGetRouteByFiltersAsyncQuery
>;
export function useGetRouteWithInfrastructureLinksWithStopsAsyncQuery() {
  return useAsyncQuery<
    GetRouteWithInfrastructureLinksWithStopsQuery,
    GetRouteWithInfrastructureLinksWithStopsQueryVariables
  >(GetRouteWithInfrastructureLinksWithStopsDocument);
}
export type GetRouteWithInfrastructureLinksWithStopsAsyncQueryHookResult =
  ReturnType<typeof useGetRouteWithInfrastructureLinksWithStopsAsyncQuery>;
export function useSearchLinesAndRoutesAsyncQuery() {
  return useAsyncQuery<
    SearchLinesAndRoutesQuery,
    SearchLinesAndRoutesQueryVariables
  >(SearchLinesAndRoutesDocument);
}
export type SearchLinesAndRoutesAsyncQueryHookResult = ReturnType<
  typeof useSearchLinesAndRoutesAsyncQuery
>;

export function useGetTimingPlacesByLabelAsyncQuery() {
  return useAsyncQuery<
    GetTimingPlacesByLabelQuery,
    GetTimingPlacesByLabelQueryVariables
  >(GetTimingPlacesByLabelDocument);
}
export type GetTimingPlacesByLabelAsyncQueryHookResult = ReturnType<
  typeof useGetTimingPlacesByLabelAsyncQuery
>;
export function useGetLinesForComboboxAsyncQuery() {
  return useAsyncQuery<
    GetLinesForComboboxQuery,
    GetLinesForComboboxQueryVariables
  >(GetLinesForComboboxDocument);
}
export type GetLinesForComboboxAsyncQueryHookResult = ReturnType<
  typeof useGetLinesForComboboxAsyncQuery
>;
export function useGetSelectedLineDetailsByIdAsyncQuery() {
  return useAsyncQuery<
    GetSelectedLineDetailsByIdQuery,
    GetSelectedLineDetailsByIdQueryVariables
  >(GetSelectedLineDetailsByIdDocument);
}
export type GetSelectedLineDetailsByIdAsyncQueryHookResult = ReturnType<
  typeof useGetSelectedLineDetailsByIdAsyncQuery
>;
export function useGetRouteDetailsByLabelWildcardAsyncQuery() {
  return useAsyncQuery<
    GetRouteDetailsByLabelWildcardQuery,
    GetRouteDetailsByLabelWildcardQueryVariables
  >(GetRouteDetailsByLabelWildcardDocument);
}
export type GetRouteDetailsByLabelWildcardAsyncQueryHookResult = ReturnType<
  typeof useGetRouteDetailsByLabelWildcardAsyncQuery
>;
export function useGetSelectedRouteDetailsByIdAsyncQuery() {
  return useAsyncQuery<
    GetSelectedRouteDetailsByIdQuery,
    GetSelectedRouteDetailsByIdQueryVariables
  >(GetSelectedRouteDetailsByIdDocument);
}
export type GetSelectedRouteDetailsByIdAsyncQueryHookResult = ReturnType<
  typeof useGetSelectedRouteDetailsByIdAsyncQuery
>;
export function useGetTimingPlacesForComboboxAsyncQuery() {
  return useAsyncQuery<
    GetTimingPlacesForComboboxQuery,
    GetTimingPlacesForComboboxQueryVariables
  >(GetTimingPlacesForComboboxDocument);
}
export type GetTimingPlacesForComboboxAsyncQueryHookResult = ReturnType<
  typeof useGetTimingPlacesForComboboxAsyncQuery
>;
export function useGetSelectedTimingPlaceDetailsByIdAsyncQuery() {
  return useAsyncQuery<
    GetSelectedTimingPlaceDetailsByIdQuery,
    GetSelectedTimingPlaceDetailsByIdQueryVariables
  >(GetSelectedTimingPlaceDetailsByIdDocument);
}
export type GetSelectedTimingPlaceDetailsByIdAsyncQueryHookResult = ReturnType<
  typeof useGetSelectedTimingPlaceDetailsByIdAsyncQuery
>;
export function useGetTimetablesForOperationDayAsyncQuery() {
  return useAsyncQuery<
    GetTimetablesForOperationDayQuery,
    GetTimetablesForOperationDayQueryVariables
  >(GetTimetablesForOperationDayDocument);
}
export type GetTimetablesForOperationDayAsyncQueryHookResult = ReturnType<
  typeof useGetTimetablesForOperationDayAsyncQuery
>;
