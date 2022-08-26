import * as luxon from 'luxon';
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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  float8: number;
  geography: GeoJSON.Geometry;
  geography_linestring: GeoJSON.LineString;
  geography_point: GeoJSON.Point;
  geometry: GeoJSON.Geometry;
  jsonb: any;
  localized_string: LocalizedString;
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

/**
 * Transport target, can be used e.g. for cost sharing.
 *
 *
 * columns and relationships of "hsl_route.transport_target"
 *
 */
export type HslRouteTransportTarget = {
  __typename?: 'hsl_route_transport_target';
  /** An array relationship */
  lines: Array<RouteLine>;
  /** An aggregate relationship */
  lines_aggregate: RouteLineAggregate;
  transport_target: Scalars['String'];
};

/**
 * Transport target, can be used e.g. for cost sharing.
 *
 *
 * columns and relationships of "hsl_route.transport_target"
 *
 */
export type HslRouteTransportTargetLinesArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/**
 * Transport target, can be used e.g. for cost sharing.
 *
 *
 * columns and relationships of "hsl_route.transport_target"
 *
 */
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
  transport_target?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "hsl_route.transport_target" */
export enum HslRouteTransportTargetConstraint {
  /** unique or primary key constraint */
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

/** on conflict condition type for table "hsl_route.transport_target" */
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

/** primary key columns input for table: hsl_route_transport_target */
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

/** update columns of table "hsl_route.transport_target" */
export enum HslRouteTransportTargetUpdateColumn {
  /** column name */
  TransportTarget = 'transport_target',
}

/**
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 *
 */
export type InfrastructureNetworkDirection = {
  __typename?: 'infrastructure_network_direction';
  /** An array relationship */
  infrastructure_links: Array<InfrastructureNetworkInfrastructureLink>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  value: InfrastructureNetworkDirectionEnum;
};

/**
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 *
 */
export type InfrastructureNetworkDirectionInfrastructureLinksArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/**
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 *
 */
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
  value?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<InfrastructureNetworkDirectionOnConflict>;
};

/** on conflict condition type for table "infrastructure_network.direction" */
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

/** primary key columns input for table: infrastructure_network_direction */
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

/** update columns of table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionUpdateColumn {
  /** column name */
  Value = 'value',
}

/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 *
 */
export type InfrastructureNetworkExternalSource = {
  __typename?: 'infrastructure_network_external_source';
  /** An array relationship */
  infrastructure_links: Array<InfrastructureNetworkInfrastructureLink>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: InfrastructureNetworkInfrastructureLinkAggregate;
  value: Scalars['String'];
};

/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 *
 */
export type InfrastructureNetworkExternalSourceInfrastructureLinksArgs = {
  distinct_on?: Maybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: Maybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 *
 */
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
  value?: Maybe<StringComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** on conflict condition type for table "infrastructure_network.external_source" */
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

/** primary key columns input for table: infrastructure_network_external_source */
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

/** update columns of table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceUpdateColumn {
  /** column name */
  Value = 'value',
}

export type InfrastructureNetworkFindPointDirectionOnLinkArgs = {
  infrastructure_link_uuid?: Maybe<Scalars['uuid']>;
  point_max_distance_in_meters?: Maybe<Scalars['float8']>;
  point_of_interest?: Maybe<Scalars['geography']>;
};

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
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

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
export type InfrastructureNetworkInfrastructureLinkInfrastructureLinkAlongRoutesArgs =
  {
    distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
export type InfrastructureNetworkInfrastructureLinkInfrastructureLinkAlongRoutesAggregateArgs =
  {
    distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
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

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
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

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
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

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 *
 */
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
  /** on conflict condition */
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
  infrastructure_link_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_points_located_on_infrastructure_link?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  shape?: Maybe<GeographyComparisonExp>;
  vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_links?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
};

/** unique or primary key constraints on table "infrastructure_network.infrastructure_link" */
export enum InfrastructureNetworkInfrastructureLinkConstraint {
  /** unique or primary key constraint */
  InfrastructureLinkExternalLinkIdExternalLinkSourceIdx = 'infrastructure_link_external_link_id_external_link_source_idx',
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** on conflict condition type for table "infrastructure_network.infrastructure_link" */
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

/** primary key columns input for table: infrastructure_network_infrastructure_link */
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

/**
 * Which infrastructure links are safely traversed by which vehicle submodes?
 *
 *
 * columns and relationships of "infrastructure_network.vehicle_submode_on_infrastructure_link"
 *
 */
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
    /** on conflict condition */
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
  /** unique or primary key constraint */
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

/** on conflict condition type for table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
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

/** primary key columns input for table: infrastructure_network_vehicle_submode_on_infrastructure_link */
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

/** update columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdateColumn {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

export type JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    new_direction?: Maybe<Scalars['String']>;
    new_label?: Maybe<Scalars['String']>;
    new_located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
    new_measured_location?: Maybe<Scalars['geography']>;
    new_priority?: Maybe<Scalars['Int']>;
    new_validity_end?: Maybe<Scalars['timestamptz']>;
    new_validity_start?: Maybe<Scalars['timestamptz']>;
    replace_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  };

/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 *
 */
export type JourneyPatternJourneyPattern = {
  __typename?: 'journey_pattern_journey_pattern';
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** An object relationship */
  journey_pattern_route?: Maybe<RouteRoute>;
  /** The ID of the route the journey pattern is on. */
  on_route_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_point_in_journey_patterns: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_patterns_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
};

/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 *
 */
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

/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 *
 */
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
  /** on conflict condition */
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
};

/** unique or primary key constraints on table "journey_pattern.journey_pattern" */
export enum JourneyPatternJourneyPatternConstraint {
  /** unique or primary key constraint */
  JourneyPatternOnRouteIdIdx = 'journey_pattern_on_route_id_idx',
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<JourneyPatternJourneyPatternOnConflict>;
};

/** on conflict condition type for table "journey_pattern.journey_pattern" */
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

/** primary key columns input for table: journey_pattern_journey_pattern */
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

/** update columns of table "journey_pattern.journey_pattern" */
export enum JourneyPatternJourneyPatternUpdateColumn {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  OnRouteId = 'on_route_id',
}

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 *
 */
export type JourneyPatternScheduledStopPointInJourneyPattern = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  /** Is this scheduled stop point a timing point? */
  is_timing_point: Scalars['Boolean'];
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

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 *
 */
export type JourneyPatternScheduledStopPointInJourneyPatternScheduledStopPointsArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 *
 */
export type JourneyPatternScheduledStopPointInJourneyPatternScheduledStopPointsAggregateArgs =
  {
    distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  };

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 *
 */
export type JourneyPatternScheduledStopPointInJourneyPatternViaPointNameI18nArgs =
  {
    path?: Maybe<Scalars['String']>;
  };

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 *
 */
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
    /** on conflict condition */
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
  is_timing_point?: Maybe<BooleanComparisonExp>;
  is_via_point?: Maybe<BooleanComparisonExp>;
  journey_pattern?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  journey_pattern_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_point_label?: Maybe<StringComparisonExp>;
  scheduled_stop_point_sequence?: Maybe<IntComparisonExp>;
  scheduled_stop_points?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  via_point_name_i18n?: Maybe<JsonbComparisonExp>;
  via_point_short_name_i18n?: Maybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternConstraint {
  /** unique or primary key constraint */
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
  /** Is this scheduled stop point a timing point? */
  is_timing_point?: Maybe<Scalars['Boolean']>;
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

/** on conflict condition type for table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternOnConflict = {
  constraint: JourneyPatternScheduledStopPointInJourneyPatternConstraint;
  update_columns?: Array<JourneyPatternScheduledStopPointInJourneyPatternUpdateColumn>;
  where?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.scheduled_stop_point_in_journey_pattern". */
export type JourneyPatternScheduledStopPointInJourneyPatternOrderBy = {
  is_timing_point?: Maybe<OrderBy>;
  is_via_point?: Maybe<OrderBy>;
  journey_pattern?: Maybe<JourneyPatternJourneyPatternOrderBy>;
  journey_pattern_id?: Maybe<OrderBy>;
  scheduled_stop_point_label?: Maybe<OrderBy>;
  scheduled_stop_point_sequence?: Maybe<OrderBy>;
  scheduled_stop_points_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  via_point_name_i18n?: Maybe<OrderBy>;
  via_point_short_name_i18n?: Maybe<OrderBy>;
};

/** primary key columns input for table: journey_pattern_scheduled_stop_point_in_journey_pattern */
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
  IsTimingPoint = 'is_timing_point',
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

/** input type for updating data in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternSetInput = {
  /** Is this scheduled stop point a timing point? */
  is_timing_point?: Maybe<Scalars['Boolean']>;
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
  IsTimingPoint = 'is_timing_point',
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

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
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
  /** delete data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  delete_service_pattern_vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>;
  /** delete single row from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  delete_service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
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
  /** update data of the table: "hsl_route.transport_target" */
  update_hsl_route_transport_target?: Maybe<HslRouteTransportTargetMutationResponse>;
  /** update single row of the table: "hsl_route.transport_target" */
  update_hsl_route_transport_target_by_pk?: Maybe<HslRouteTransportTarget>;
  /** update data of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction?: Maybe<InfrastructureNetworkDirectionMutationResponse>;
  /** update single row of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction_by_pk?: Maybe<InfrastructureNetworkDirection>;
  /** update data of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source?: Maybe<InfrastructureNetworkExternalSourceMutationResponse>;
  /** update single row of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source_by_pk?: Maybe<InfrastructureNetworkExternalSource>;
  /** update data of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link?: Maybe<InfrastructureNetworkInfrastructureLinkMutationResponse>;
  /** update single row of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkInfrastructureLink>;
  /** update data of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMutationResponse>;
  /** update single row of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLink>;
  /** update data of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern?: Maybe<JourneyPatternJourneyPatternMutationResponse>;
  /** update single row of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern_by_pk?: Maybe<JourneyPatternJourneyPattern>;
  /** update data of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternMutationResponse>;
  /** update single row of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** update data of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode?: Maybe<ReusableComponentsVehicleModeMutationResponse>;
  /** update single row of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode_by_pk?: Maybe<ReusableComponentsVehicleMode>;
  /** update data of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode?: Maybe<ReusableComponentsVehicleSubmodeMutationResponse>;
  /** update single row of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode_by_pk?: Maybe<ReusableComponentsVehicleSubmode>;
  /** update data of the table: "route.direction" */
  update_route_direction?: Maybe<RouteDirectionMutationResponse>;
  /** update single row of the table: "route.direction" */
  update_route_direction_by_pk?: Maybe<RouteDirection>;
  /** update data of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route?: Maybe<RouteInfrastructureLinkAlongRouteMutationResponse>;
  /** update single row of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route_by_pk?: Maybe<RouteInfrastructureLinkAlongRoute>;
  /** update data of the table: "route.line" */
  update_route_line?: Maybe<RouteLineMutationResponse>;
  /** update single row of the table: "route.line" */
  update_route_line_by_pk?: Maybe<RouteLine>;
  /** update data of the table: "route.route" */
  update_route_route?: Maybe<RouteRouteMutationResponse>;
  /** update single row of the table: "route.route" */
  update_route_route_by_pk?: Maybe<RouteRoute>;
  /** update data of the table: "route.type_of_line" */
  update_route_type_of_line?: Maybe<RouteTypeOfLineMutationResponse>;
  /** update single row of the table: "route.type_of_line" */
  update_route_type_of_line_by_pk?: Maybe<RouteTypeOfLine>;
  /** update data of the table: "service_pattern.scheduled_stop_point" */
  update_service_pattern_scheduled_stop_point?: Maybe<ServicePatternScheduledStopPointMutationResponse>;
  /** update data of the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  update_service_pattern_vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointMutationResponse>;
  /** update single row of the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  update_service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
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
};

/** mutation root */
export type MutationRootInsertServicePatternScheduledStopPointOneArgs = {
  object: ServicePatternScheduledStopPointInsertInput;
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
export type MutationRootUpdateServicePatternScheduledStopPointArgs = {
  _inc?: Maybe<ServicePatternScheduledStopPointIncInput>;
  _set?: Maybe<ServicePatternScheduledStopPointSetInput>;
  where: ServicePatternScheduledStopPointBoolExp;
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
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" using primary key columns */
  service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
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

/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 *
 */
export type ReusableComponentsVehicleMode = {
  __typename?: 'reusable_components_vehicle_mode';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode: Scalars['String'];
  /** An array relationship */
  vehicle_submodes: Array<ReusableComponentsVehicleSubmode>;
  /** An aggregate relationship */
  vehicle_submodes_aggregate: ReusableComponentsVehicleSubmodeAggregate;
};

/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 *
 */
export type ReusableComponentsVehicleModeVehicleSubmodesArgs = {
  distinct_on?: Maybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: Maybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 *
 */
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
};

/** unique or primary key constraints on table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<ReusableComponentsVehicleModeOnConflict>;
};

/** on conflict condition type for table "reusable_components.vehicle_mode" */
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

/** primary key columns input for table: reusable_components_vehicle_mode */
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

/** update columns of table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeUpdateColumn {
  /** column name */
  VehicleMode = 'vehicle_mode',
}

/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 *
 */
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

/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 *
 */
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

/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 *
 */
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
  /** on conflict condition */
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
};

/** unique or primary key constraints on table "reusable_components.vehicle_submode" */
export enum ReusableComponentsVehicleSubmodeConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** on conflict condition type for table "reusable_components.vehicle_submode" */
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

/** primary key columns input for table: reusable_components_vehicle_submode */
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

/** update columns of table "reusable_components.vehicle_submode" */
export enum ReusableComponentsVehicleSubmodeUpdateColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  VehicleSubmode = 'vehicle_submode',
}

/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 *
 */
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

/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 *
 */
export type RouteDirectionDirectionsArgs = {
  distinct_on?: Maybe<Array<RouteDirectionSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteDirectionOrderBy>>;
  where?: Maybe<RouteDirectionBoolExp>;
};

/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 *
 */
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
  /** on conflict condition */
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
  the_opposite_of_direction?: Maybe<RouteDirectionEnumComparisonExp>;
};

/** unique or primary key constraints on table "route.direction" */
export enum RouteDirectionConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<RouteDirectionOnConflict>;
};

/** on conflict condition type for table "route.direction" */
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

/** primary key columns input for table: route_direction */
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

/** update columns of table "route.direction" */
export enum RouteDirectionUpdateColumn {
  /** column name */
  Direction = 'direction',
  /** column name */
  TheOppositeOfDirection = 'the_opposite_of_direction',
}

/**
 * The infrastructure links along which the routes are defined.
 *
 *
 * columns and relationships of "route.infrastructure_link_along_route"
 *
 */
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
  /** on conflict condition */
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
  /** unique or primary key constraint */
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

/** on conflict condition type for table "route.infrastructure_link_along_route" */
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

/** primary key columns input for table: route_infrastructure_link_along_route */
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

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 *
 */
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
  transport_target: HslRouteTransportTargetEnum;
  /** An object relationship */
  typeOfLineByTypeOfLine: RouteTypeOfLine;
  /** The type of the line. */
  type_of_line: RouteTypeOfLineEnum;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  vehicle_mode: ReusableComponentsVehicleMode;
};

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 *
 */
export type RouteLineLineRoutesArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 *
 */
export type RouteLineLineRoutesAggregateArgs = {
  distinct_on?: Maybe<Array<RouteRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteRouteOrderBy>>;
  where?: Maybe<RouteRouteBoolExp>;
};

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 *
 */
export type RouteLineNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 *
 */
export type RouteLineShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "route.line" */
export type RouteLineAggregate = {
  __typename?: 'route_line_aggregate';
  aggregate?: Maybe<RouteLineAggregateFields>;
  nodes: Array<RouteLine>;
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
  /** on conflict condition */
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
  name_i18n?: Maybe<JsonbComparisonExp>;
  primary_vehicle_mode?: Maybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  priority?: Maybe<IntComparisonExp>;
  short_name_i18n?: Maybe<JsonbComparisonExp>;
  transport_target?: Maybe<HslRouteTransportTargetEnumComparisonExp>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineBoolExp>;
  type_of_line?: Maybe<RouteTypeOfLineEnumComparisonExp>;
  validity_end?: Maybe<TimestamptzComparisonExp>;
  validity_start?: Maybe<TimestamptzComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

/** unique or primary key constraints on table "route.line" */
export enum RouteLineConstraint {
  /** unique or primary key constraint */
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
  transport_target?: Maybe<HslRouteTransportTargetEnum>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineObjRelInsertInput>;
  /** The type of the line. */
  type_of_line?: Maybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
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
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
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
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
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
  /** on conflict condition */
  on_conflict?: Maybe<RouteLineOnConflict>;
};

/** on conflict condition type for table "route.line" */
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
  transport_target?: Maybe<OrderBy>;
  typeOfLineByTypeOfLine?: Maybe<RouteTypeOfLineOrderBy>;
  type_of_line?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeOrderBy>;
};

/** primary key columns input for table: route_line */
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
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
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

/** columns and relationships of "route.route" */
export type RouteRoute = {
  __typename?: 'route_route';
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  direction: RouteDirectionEnum;
  /** An array relationship */
  infrastructure_links_along_route: Array<RouteInfrastructureLinkAlongRoute>;
  /** An aggregate relationship */
  infrastructure_links_along_route_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  label: Scalars['String'];
  name_i18n: Scalars['localized_string'];
  on_line_id: Scalars['uuid'];
  origin_name_i18n: Scalars['localized_string'];
  origin_short_name_i18n: Scalars['localized_string'];
  priority: Scalars['Int'];
  route_id: Scalars['uuid'];
  /** An array relationship */
  route_journey_patterns: Array<JourneyPatternJourneyPattern>;
  /** An aggregate relationship */
  route_journey_patterns_aggregate: JourneyPatternJourneyPatternAggregate;
  /** An object relationship */
  route_line: RouteLine;
  /** A computed field, executes function "route.route_shape" */
  route_shape?: Maybe<Scalars['geography_linestring']>;
  validity_end?: Maybe<Scalars['timestamptz']>;
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteDescriptionI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteDestinationNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteDestinationShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteInfrastructureLinksAlongRouteArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** columns and relationships of "route.route" */
export type RouteRouteInfrastructureLinksAlongRouteAggregateArgs = {
  distinct_on?: Maybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: Maybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** columns and relationships of "route.route" */
export type RouteRouteNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteOriginNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteOriginShortNameI18nArgs = {
  path?: Maybe<Scalars['String']>;
};

/** columns and relationships of "route.route" */
export type RouteRouteRouteJourneyPatternsArgs = {
  distinct_on?: Maybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: Maybe<JourneyPatternJourneyPatternBoolExp>;
};

/** columns and relationships of "route.route" */
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
  /** on conflict condition */
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** aggregate avg on columns */
export type RouteRouteAvgFields = {
  __typename?: 'route_route_avg_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.route" */
export type RouteRouteAvgOrderBy = {
  priority?: Maybe<OrderBy>;
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
  label?: Maybe<StringComparisonExp>;
  name_i18n?: Maybe<JsonbComparisonExp>;
  on_line_id?: Maybe<UuidComparisonExp>;
  origin_name_i18n?: Maybe<JsonbComparisonExp>;
  origin_short_name_i18n?: Maybe<JsonbComparisonExp>;
  priority?: Maybe<IntComparisonExp>;
  route_id?: Maybe<UuidComparisonExp>;
  route_journey_patterns?: Maybe<JourneyPatternJourneyPatternBoolExp>;
  route_line?: Maybe<RouteLineBoolExp>;
  route_shape?: Maybe<GeographyComparisonExp>;
  validity_end?: Maybe<TimestamptzComparisonExp>;
  validity_start?: Maybe<TimestamptzComparisonExp>;
};

/** unique or primary key constraints on table "route.route" */
export enum RouteRouteConstraint {
  /** unique or primary key constraint */
  RoutePkey = 'route_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RouteRouteDeleteAtPathInput = {
  description_i18n?: Maybe<Array<Scalars['String']>>;
  destination_name_i18n?: Maybe<Array<Scalars['String']>>;
  destination_short_name_i18n?: Maybe<Array<Scalars['String']>>;
  name_i18n?: Maybe<Array<Scalars['String']>>;
  origin_name_i18n?: Maybe<Array<Scalars['String']>>;
  origin_short_name_i18n?: Maybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RouteRouteDeleteElemInput = {
  description_i18n?: Maybe<Scalars['Int']>;
  destination_name_i18n?: Maybe<Scalars['Int']>;
  destination_short_name_i18n?: Maybe<Scalars['Int']>;
  name_i18n?: Maybe<Scalars['Int']>;
  origin_name_i18n?: Maybe<Scalars['Int']>;
  origin_short_name_i18n?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RouteRouteDeleteKeyInput = {
  description_i18n?: Maybe<Scalars['String']>;
  destination_name_i18n?: Maybe<Scalars['String']>;
  destination_short_name_i18n?: Maybe<Scalars['String']>;
  name_i18n?: Maybe<Scalars['String']>;
  origin_name_i18n?: Maybe<Scalars['String']>;
  origin_short_name_i18n?: Maybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "route.route" */
export type RouteRouteIncInput = {
  priority?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.route" */
export type RouteRouteInsertInput = {
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  direction?: Maybe<RouteDirectionEnum>;
  infrastructure_links_along_route?: Maybe<RouteInfrastructureLinkAlongRouteArrRelInsertInput>;
  label?: Maybe<Scalars['String']>;
  name_i18n: Scalars['localized_string'];
  on_line_id?: Maybe<Scalars['uuid']>;
  origin_name_i18n: Scalars['localized_string'];
  origin_short_name_i18n: Scalars['localized_string'];
  priority?: Maybe<Scalars['Int']>;
  route_id?: Maybe<Scalars['uuid']>;
  route_journey_patterns?: Maybe<JourneyPatternJourneyPatternArrRelInsertInput>;
  route_line?: Maybe<RouteLineObjRelInsertInput>;
  validity_end?: Maybe<Scalars['timestamptz']>;
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type RouteRouteMaxFields = {
  __typename?: 'route_route_max_fields';
  label?: Maybe<Scalars['String']>;
  on_line_id?: Maybe<Scalars['uuid']>;
  priority?: Maybe<Scalars['Int']>;
  route_id?: Maybe<Scalars['uuid']>;
  validity_end?: Maybe<Scalars['timestamptz']>;
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "route.route" */
export type RouteRouteMaxOrderBy = {
  label?: Maybe<OrderBy>;
  on_line_id?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  route_id?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteRouteMinFields = {
  __typename?: 'route_route_min_fields';
  label?: Maybe<Scalars['String']>;
  on_line_id?: Maybe<Scalars['uuid']>;
  priority?: Maybe<Scalars['Int']>;
  route_id?: Maybe<Scalars['uuid']>;
  validity_end?: Maybe<Scalars['timestamptz']>;
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "route.route" */
export type RouteRouteMinOrderBy = {
  label?: Maybe<OrderBy>;
  on_line_id?: Maybe<OrderBy>;
  priority?: Maybe<OrderBy>;
  route_id?: Maybe<OrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
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
  /** on conflict condition */
  on_conflict?: Maybe<RouteRouteOnConflict>;
};

/** on conflict condition type for table "route.route" */
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
};

/** primary key columns input for table: route_route */
export type RouteRoutePkColumnsInput = {
  route_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RouteRoutePrependInput = {
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
}

/** input type for updating data in table "route.route" */
export type RouteRouteSetInput = {
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n?: Maybe<Scalars['localized_string']>;
  destination_short_name_i18n?: Maybe<Scalars['localized_string']>;
  direction?: Maybe<RouteDirectionEnum>;
  label?: Maybe<Scalars['String']>;
  name_i18n?: Maybe<Scalars['localized_string']>;
  on_line_id?: Maybe<Scalars['uuid']>;
  origin_name_i18n?: Maybe<Scalars['localized_string']>;
  origin_short_name_i18n?: Maybe<Scalars['localized_string']>;
  priority?: Maybe<Scalars['Int']>;
  route_id?: Maybe<Scalars['uuid']>;
  validity_end?: Maybe<Scalars['timestamptz']>;
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type RouteRouteStddevFields = {
  __typename?: 'route_route_stddev_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.route" */
export type RouteRouteStddevOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RouteRouteStddevPopFields = {
  __typename?: 'route_route_stddev_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.route" */
export type RouteRouteStddevPopOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RouteRouteStddevSampFields = {
  __typename?: 'route_route_stddev_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.route" */
export type RouteRouteStddevSampOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate sum on columns */
export type RouteRouteSumFields = {
  __typename?: 'route_route_sum_fields';
  priority?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "route.route" */
export type RouteRouteSumOrderBy = {
  priority?: Maybe<OrderBy>;
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
}

/** aggregate var_pop on columns */
export type RouteRouteVarPopFields = {
  __typename?: 'route_route_var_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.route" */
export type RouteRouteVarPopOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RouteRouteVarSampFields = {
  __typename?: 'route_route_var_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.route" */
export type RouteRouteVarSampOrderBy = {
  priority?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type RouteRouteVarianceFields = {
  __typename?: 'route_route_variance_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.route" */
export type RouteRouteVarianceOrderBy = {
  priority?: Maybe<OrderBy>;
};

/**
 * Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm
 *
 *
 * columns and relationships of "route.type_of_line"
 *
 */
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

/**
 * Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm
 *
 *
 * columns and relationships of "route.type_of_line"
 *
 */
export type RouteTypeOfLineLinesArgs = {
  distinct_on?: Maybe<Array<RouteLineSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<RouteLineOrderBy>>;
  where?: Maybe<RouteLineBoolExp>;
};

/**
 * Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm
 *
 *
 * columns and relationships of "route.type_of_line"
 *
 */
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
  type_of_line?: Maybe<StringComparisonExp>;
  vehicle_mode?: Maybe<ReusableComponentsVehicleModeBoolExp>;
};

/** unique or primary key constraints on table "route.type_of_line" */
export enum RouteTypeOfLineConstraint {
  /** unique or primary key constraint */
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
  /** on conflict condition */
  on_conflict?: Maybe<RouteTypeOfLineOnConflict>;
};

/** on conflict condition type for table "route.type_of_line" */
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

/** primary key columns input for table: route_type_of_line */
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

/** update columns of table "route.type_of_line" */
export enum RouteTypeOfLineUpdateColumn {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  TypeOfLine = 'type_of_line',
}

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
export type ServicePatternScheduledStopPoint = {
  __typename?: 'service_pattern_scheduled_stop_point';
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography_point']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label: Scalars['String'];
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id: Scalars['uuid'];
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location: Scalars['geography_point'];
  /** An array relationship */
  other_label_instances: Array<ServicePatternScheduledStopPoint>;
  /** An aggregate relationship */
  other_label_instances_aggregate: ServicePatternScheduledStopPointAggregate;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start: Scalars['Float'];
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_point_in_journey_patterns: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_patterns_aggregate: JourneyPatternScheduledStopPointInJourneyPatternAggregate;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** An aggregate relationship */
  vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
};

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
export type ServicePatternScheduledStopPointOtherLabelInstancesArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
export type ServicePatternScheduledStopPointOtherLabelInstancesAggregateArgs = {
  distinct_on?: Maybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: Maybe<ServicePatternScheduledStopPointBoolExp>;
};

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
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

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
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

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
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

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 *
 */
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
};

/** aggregate avg on columns */
export type ServicePatternScheduledStopPointAvgFields = {
  __typename?: 'service_pattern_scheduled_stop_point_avg_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAvgOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type ServicePatternScheduledStopPointBoolExp = {
  _and?: Maybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  _not?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  _or?: Maybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  closest_point_on_infrastructure_link?: Maybe<GeographyComparisonExp>;
  direction?: Maybe<StringComparisonExp>;
  label?: Maybe<StringComparisonExp>;
  located_on_infrastructure_link_id?: Maybe<UuidComparisonExp>;
  measured_location?: Maybe<GeographyComparisonExp>;
  other_label_instances?: Maybe<ServicePatternScheduledStopPointBoolExp>;
  priority?: Maybe<IntComparisonExp>;
  relative_distance_from_infrastructure_link_start?: Maybe<Float8ComparisonExp>;
  scheduled_stop_point_id?: Maybe<UuidComparisonExp>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  validity_end?: Maybe<TimestamptzComparisonExp>;
  validity_start?: Maybe<TimestamptzComparisonExp>;
  vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
};

/** input type for incrementing numeric columns in table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointIncInput = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
};

/** input type for inserting data into table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointInsertInput = {
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label: Scalars['String'];
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id: Scalars['uuid'];
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location: Scalars['geography_point'];
  other_label_instances?: Maybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
  vehicle_mode_on_scheduled_stop_point?: Maybe<ServicePatternVehicleModeOnScheduledStopPointArrRelInsertInput>;
};

/** aggregate max on columns */
export type ServicePatternScheduledStopPointMaxFields = {
  __typename?: 'service_pattern_scheduled_stop_point_max_fields';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointMaxOrderBy = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<OrderBy>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<OrderBy>;
};

/** aggregate min on columns */
export type ServicePatternScheduledStopPointMinFields = {
  __typename?: 'service_pattern_scheduled_stop_point_min_fields';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointMinOrderBy = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<OrderBy>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<OrderBy>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<OrderBy>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
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

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point". */
export type ServicePatternScheduledStopPointOrderBy = {
  closest_point_on_infrastructure_link?: Maybe<OrderBy>;
  direction?: Maybe<OrderBy>;
  label?: Maybe<OrderBy>;
  located_on_infrastructure_link_id?: Maybe<OrderBy>;
  measured_location?: Maybe<OrderBy>;
  other_label_instances_aggregate?: Maybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  priority?: Maybe<OrderBy>;
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
  scheduled_stop_point_id?: Maybe<OrderBy>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy>;
  validity_end?: Maybe<OrderBy>;
  validity_start?: Maybe<OrderBy>;
  vehicle_mode_on_scheduled_stop_point_aggregate?: Maybe<ServicePatternVehicleModeOnScheduledStopPointAggregateOrderBy>;
};

/** select columns of table "service_pattern.scheduled_stop_point" */
export enum ServicePatternScheduledStopPointSelectColumn {
  /** column name */
  ClosestPointOnInfrastructureLink = 'closest_point_on_infrastructure_link',
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
  RelativeDistanceFromInfrastructureLinkStart = 'relative_distance_from_infrastructure_link_start',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  ValidityEnd = 'validity_end',
  /** column name */
  ValidityStart = 'validity_start',
}

/** input type for updating data in table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointSetInput = {
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<InfrastructureNetworkDirectionEnum>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography_point']>;
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The point in time from which onwards the stop is no longer valid. If NULL, the stop will be always valid. */
  validity_end?: Maybe<Scalars['timestamptz']>;
  /** The point in time when the stop becomes valid. If NULL, the stop has been always valid. */
  validity_start?: Maybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type ServicePatternScheduledStopPointStddevFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ServicePatternScheduledStopPointStddevPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_pop_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevPopOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type ServicePatternScheduledStopPointStddevSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_samp_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevSampOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate sum on columns */
export type ServicePatternScheduledStopPointSumFields = {
  __typename?: 'service_pattern_scheduled_stop_point_sum_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
};

/** order by sum() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointSumOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate var_pop on columns */
export type ServicePatternScheduledStopPointVarPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_pop_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarPopOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type ServicePatternScheduledStopPointVarSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_samp_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarSampOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/** aggregate variance on columns */
export type ServicePatternScheduledStopPointVarianceFields = {
  __typename?: 'service_pattern_scheduled_stop_point_variance_fields';
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarianceOrderBy = {
  /** The priority of the stop definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<OrderBy>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<OrderBy>;
};

/**
 * Which scheduled stop points are serviced by which vehicle modes?
 *
 *
 * columns and relationships of "service_pattern.vehicle_mode_on_scheduled_stop_point"
 *
 */
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
  /** on conflict condition */
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
  /** unique or primary key constraint */
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

/** on conflict condition type for table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
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

/** primary key columns input for table: service_pattern_vehicle_mode_on_scheduled_stop_point */
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

/** update columns of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export enum ServicePatternVehicleModeOnScheduledStopPointUpdateColumn {
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  VehicleMode = 'vehicle_mode',
}

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
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point: Array<ServicePatternVehicleModeOnScheduledStopPoint>;
  /** fetch aggregated fields from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" */
  service_pattern_vehicle_mode_on_scheduled_stop_point_aggregate: ServicePatternVehicleModeOnScheduledStopPointAggregate;
  /** fetch data from the table: "service_pattern.vehicle_mode_on_scheduled_stop_point" using primary key columns */
  service_pattern_vehicle_mode_on_scheduled_stop_point_by_pk?: Maybe<ServicePatternVehicleModeOnScheduledStopPoint>;
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

export type InsertLinesMutationVariables = Exact<{
  objects: Array<RouteLineInsertInput> | RouteLineInsertInput;
}>;

export type InsertLinesMutation = {
  __typename?: 'mutation_root';
  insert_route_line?:
    | {
        __typename?: 'route_line_mutation_response';
        returning: Array<{
          __typename?: 'route_line';
          line_id: UUID;
          label: string;
          priority: number;
          primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
          transport_target: HslRouteTransportTargetEnum;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
        }>;
      }
    | null
    | undefined;
};

export type InsertRoutesMutationVariables = Exact<{
  objects: Array<RouteRouteInsertInput> | RouteRouteInsertInput;
}>;

export type InsertRoutesMutation = {
  __typename?: 'mutation_root';
  insert_route_route?:
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
          direction: RouteDirectionEnum;
        }>;
      }
    | null
    | undefined;
};

export type DeleteRoutesMutationVariables = Exact<{
  route_id: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type DeleteRoutesMutation = {
  __typename?: 'mutation_root';
  delete_route_route?:
    | {
        __typename?: 'route_route_mutation_response';
        returning: Array<{ __typename?: 'route_route'; route_id: UUID }>;
      }
    | null
    | undefined;
};

export type RemoveLinesMutationVariables = Exact<{
  line_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveLinesMutation = {
  __typename?: 'mutation_root';
  delete_route_line?:
    | {
        __typename?: 'route_line_mutation_response';
        returning: Array<{ __typename?: 'route_line'; line_id: UUID }>;
      }
    | null
    | undefined;
};

export type InsertStopsMutationVariables = Exact<{
  objects:
    | Array<ServicePatternScheduledStopPointInsertInput>
    | ServicePatternScheduledStopPointInsertInput;
}>;

export type InsertStopsMutation = {
  __typename?: 'mutation_root';
  insert_service_pattern_scheduled_stop_point?:
    | {
        __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
        returning: Array<{
          __typename?: 'service_pattern_scheduled_stop_point';
          scheduled_stop_point_id: UUID;
          located_on_infrastructure_link_id: UUID;
          direction: InfrastructureNetworkDirectionEnum;
          priority: number;
          measured_location: GeoJSON.Point;
          label: string;
          validity_start?: luxon.DateTime | null | undefined;
          validity_end?: luxon.DateTime | null | undefined;
        }>;
      }
    | null
    | undefined;
};

export type RemoveStopsMutationVariables = Exact<{
  stop_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveStopsMutation = {
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

export type InsertInfraLinksMutationVariables = Exact<{
  objects:
    | Array<InfrastructureNetworkInfrastructureLinkInsertInput>
    | InfrastructureNetworkInfrastructureLinkInsertInput;
}>;

export type InsertInfraLinksMutation = {
  __typename?: 'mutation_root';
  insert_infrastructure_network_infrastructure_link?:
    | {
        __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
        returning: Array<{
          __typename?: 'infrastructure_network_infrastructure_link';
          infrastructure_link_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type RemoveInfraLinksMutationVariables = Exact<{
  infra_links_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveInfraLinksMutation = {
  __typename?: 'mutation_root';
  delete_infrastructure_network_infrastructure_link?:
    | {
        __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
        returning: Array<{
          __typename?: 'infrastructure_network_infrastructure_link';
          infrastructure_link_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type InsertInfraLinksAlongRouteMutationVariables = Exact<{
  objects:
    | Array<RouteInfrastructureLinkAlongRouteInsertInput>
    | RouteInfrastructureLinkAlongRouteInsertInput;
}>;

export type InsertInfraLinksAlongRouteMutation = {
  __typename?: 'mutation_root';
  insert_route_infrastructure_link_along_route?:
    | {
        __typename?: 'route_infrastructure_link_along_route_mutation_response';
        returning: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          infrastructure_link_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type RemoveInfraLinksAlongRouteMutationVariables = Exact<{
  infra_links_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveInfraLinksAlongRouteMutation = {
  __typename?: 'mutation_root';
  delete_route_infrastructure_link_along_route?:
    | {
        __typename?: 'route_infrastructure_link_along_route_mutation_response';
        returning: Array<{
          __typename?: 'route_infrastructure_link_along_route';
          infrastructure_link_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type InsertJourneyPatternsMutationVariables = Exact<{
  objects:
    | Array<JourneyPatternJourneyPatternInsertInput>
    | JourneyPatternJourneyPatternInsertInput;
}>;

export type InsertJourneyPatternsMutation = {
  __typename?: 'mutation_root';
  insert_journey_pattern_journey_pattern?:
    | {
        __typename?: 'journey_pattern_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type RemoveJourneyPatternsMutationVariables = Exact<{
  journey_pattern_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveJourneyPatternsMutation = {
  __typename?: 'mutation_root';
  delete_journey_pattern_journey_pattern?:
    | {
        __typename?: 'journey_pattern_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_journey_pattern';
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type InsertStopsInJourneyPatternMutationVariables = Exact<{
  objects:
    | Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>
    | JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
}>;

export type InsertStopsInJourneyPatternMutation = {
  __typename?: 'mutation_root';
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};

export type RemoveStopsInJourneyPatternMutationVariables = Exact<{
  journey_pattern_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveStopsInJourneyPatternMutation = {
  __typename?: 'mutation_root';
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?:
    | {
        __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
        returning: Array<{
          __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
          journey_pattern_id: UUID;
        }>;
      }
    | null
    | undefined;
};
