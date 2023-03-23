import * as luxon from 'luxon';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  _uuid: any;
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
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type IntComparisonExp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type StringComparisonExp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
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
  _eq?: InputMaybe<Scalars['date']>;
  _gt?: InputMaybe<Scalars['date']>;
  _gte?: InputMaybe<Scalars['date']>;
  _in?: InputMaybe<Array<Scalars['date']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['date']>;
  _lte?: InputMaybe<Scalars['date']>;
  _neq?: InputMaybe<Scalars['date']>;
  _nin?: InputMaybe<Array<Scalars['date']>>;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8ComparisonExp = {
  _eq?: InputMaybe<Scalars['float8']>;
  _gt?: InputMaybe<Scalars['float8']>;
  _gte?: InputMaybe<Scalars['float8']>;
  _in?: InputMaybe<Array<Scalars['float8']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['float8']>;
  _lte?: InputMaybe<Scalars['float8']>;
  _neq?: InputMaybe<Scalars['float8']>;
  _nin?: InputMaybe<Array<Scalars['float8']>>;
};

export type GeographyCastExp = {
  geometry?: InputMaybe<GeometryComparisonExp>;
};

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export type GeographyComparisonExp = {
  _cast?: InputMaybe<GeographyCastExp>;
  _eq?: InputMaybe<Scalars['geography']>;
  _gt?: InputMaybe<Scalars['geography']>;
  _gte?: InputMaybe<Scalars['geography']>;
  _in?: InputMaybe<Array<Scalars['geography']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['geography']>;
  _lte?: InputMaybe<Scalars['geography']>;
  _neq?: InputMaybe<Scalars['geography']>;
  _nin?: InputMaybe<Array<Scalars['geography']>>;
  /** is the column within a given distance from the given geography value */
  _st_d_within?: InputMaybe<StDWithinGeographyInput>;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: InputMaybe<Scalars['geography']>;
};

export type GeometryCastExp = {
  geography?: InputMaybe<GeographyComparisonExp>;
};

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export type GeometryComparisonExp = {
  _cast?: InputMaybe<GeometryCastExp>;
  _eq?: InputMaybe<Scalars['geometry']>;
  _gt?: InputMaybe<Scalars['geometry']>;
  _gte?: InputMaybe<Scalars['geometry']>;
  _in?: InputMaybe<Array<Scalars['geometry']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['geometry']>;
  _lte?: InputMaybe<Scalars['geometry']>;
  _neq?: InputMaybe<Scalars['geometry']>;
  _nin?: InputMaybe<Array<Scalars['geometry']>>;
  /** is the column within a given 3D distance from the given geometry value */
  _st_3d_d_within?: InputMaybe<StDWithinInput>;
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: InputMaybe<Scalars['geometry']>;
  /** does the column contain the given geometry value */
  _st_contains?: InputMaybe<Scalars['geometry']>;
  /** does the column cross the given geometry value */
  _st_crosses?: InputMaybe<Scalars['geometry']>;
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: InputMaybe<StDWithinInput>;
  /** is the column equal to given geometry value (directionality is ignored) */
  _st_equals?: InputMaybe<Scalars['geometry']>;
  /** does the column spatially intersect the given geometry value */
  _st_intersects?: InputMaybe<Scalars['geometry']>;
  /** does the column 'spatially overlap' (intersect but not completely contain) the given geometry value */
  _st_overlaps?: InputMaybe<Scalars['geometry']>;
  /** does the column have atleast one point in common with the given geometry value */
  _st_touches?: InputMaybe<Scalars['geometry']>;
  /** is the column contained in the given geometry value */
  _st_within?: InputMaybe<Scalars['geometry']>;
};

/** Legacy, avoid using. Main use nowadays is to enable support for eg. data exports that still need this. Originally this was used to represent the primary region for routes/lines. */
export type HslRouteLegacyHslMunicipalityCode = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code';
  hsl_municipality: Scalars['String'];
  jore3_code: Scalars['smallint'];
  /** An array relationship */
  lines: Array<RouteLine>;
  /** An aggregate relationship */
  lines_aggregate: RouteLineAggregate;
  /** An array relationship */
  routes: Array<RouteRoute>;
  /** An aggregate relationship */
  routes_aggregate: RouteRouteAggregate;
};

/** Legacy, avoid using. Main use nowadays is to enable support for eg. data exports that still need this. Originally this was used to represent the primary region for routes/lines. */
export type HslRouteLegacyHslMunicipalityCodeLinesArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

/** Legacy, avoid using. Main use nowadays is to enable support for eg. data exports that still need this. Originally this was used to represent the primary region for routes/lines. */
export type HslRouteLegacyHslMunicipalityCodeLinesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

/** Legacy, avoid using. Main use nowadays is to enable support for eg. data exports that still need this. Originally this was used to represent the primary region for routes/lines. */
export type HslRouteLegacyHslMunicipalityCodeRoutesArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

/** Legacy, avoid using. Main use nowadays is to enable support for eg. data exports that still need this. Originally this was used to represent the primary region for routes/lines. */
export type HslRouteLegacyHslMunicipalityCodeRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

/** aggregated selection of "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeAggregate = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_aggregate';
  aggregate?: Maybe<HslRouteLegacyHslMunicipalityCodeAggregateFields>;
  nodes: Array<HslRouteLegacyHslMunicipalityCode>;
};

/** aggregate fields of "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeAggregateFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_aggregate_fields';
  avg?: Maybe<HslRouteLegacyHslMunicipalityCodeAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<HslRouteLegacyHslMunicipalityCodeMaxFields>;
  min?: Maybe<HslRouteLegacyHslMunicipalityCodeMinFields>;
  stddev?: Maybe<HslRouteLegacyHslMunicipalityCodeStddevFields>;
  stddev_pop?: Maybe<HslRouteLegacyHslMunicipalityCodeStddevPopFields>;
  stddev_samp?: Maybe<HslRouteLegacyHslMunicipalityCodeStddevSampFields>;
  sum?: Maybe<HslRouteLegacyHslMunicipalityCodeSumFields>;
  var_pop?: Maybe<HslRouteLegacyHslMunicipalityCodeVarPopFields>;
  var_samp?: Maybe<HslRouteLegacyHslMunicipalityCodeVarSampFields>;
  variance?: Maybe<HslRouteLegacyHslMunicipalityCodeVarianceFields>;
};

/** aggregate fields of "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type HslRouteLegacyHslMunicipalityCodeAvgFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_avg_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "hsl_route.legacy_hsl_municipality_code". All fields are combined with a logical 'AND'. */
export type HslRouteLegacyHslMunicipalityCodeBoolExp = {
  _and?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeBoolExp>>;
  _not?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
  _or?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeBoolExp>>;
  hsl_municipality?: InputMaybe<StringComparisonExp>;
  jore3_code?: InputMaybe<SmallintComparisonExp>;
  lines?: InputMaybe<RouteLineBoolExp>;
  lines_aggregate?: InputMaybe<RouteLineAggregateBoolExp>;
  routes?: InputMaybe<RouteRouteBoolExp>;
  routes_aggregate?: InputMaybe<RouteRouteAggregateBoolExp>;
};

/** unique or primary key constraints on table "hsl_route.legacy_hsl_municipality_code" */
export enum HslRouteLegacyHslMunicipalityCodeConstraint {
  /** unique or primary key constraint on columns "hsl_municipality" */
  LegacyHslMunicipalityCodePkey = 'legacy_hsl_municipality_code_pkey',
}

/** input type for incrementing numeric columns in table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeIncInput = {
  jore3_code?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeInsertInput = {
  hsl_municipality?: InputMaybe<Scalars['String']>;
  jore3_code?: InputMaybe<Scalars['smallint']>;
  lines?: InputMaybe<RouteLineArrRelInsertInput>;
  routes?: InputMaybe<RouteRouteArrRelInsertInput>;
};

/** aggregate max on columns */
export type HslRouteLegacyHslMunicipalityCodeMaxFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_max_fields';
  hsl_municipality?: Maybe<Scalars['String']>;
  jore3_code?: Maybe<Scalars['smallint']>;
};

/** aggregate min on columns */
export type HslRouteLegacyHslMunicipalityCodeMinFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_min_fields';
  hsl_municipality?: Maybe<Scalars['String']>;
  jore3_code?: Maybe<Scalars['smallint']>;
};

/** response of any mutation on the table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeMutationResponse = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<HslRouteLegacyHslMunicipalityCode>;
};

/** input type for inserting object relation for remote table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeObjRelInsertInput = {
  data: HslRouteLegacyHslMunicipalityCodeInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<HslRouteLegacyHslMunicipalityCodeOnConflict>;
};

/** on_conflict condition type for table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeOnConflict = {
  constraint: HslRouteLegacyHslMunicipalityCodeConstraint;
  update_columns?: Array<HslRouteLegacyHslMunicipalityCodeUpdateColumn>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

/** Ordering options when selecting data from "hsl_route.legacy_hsl_municipality_code". */
export type HslRouteLegacyHslMunicipalityCodeOrderBy = {
  hsl_municipality?: InputMaybe<OrderBy>;
  jore3_code?: InputMaybe<OrderBy>;
  lines_aggregate?: InputMaybe<RouteLineAggregateOrderBy>;
  routes_aggregate?: InputMaybe<RouteRouteAggregateOrderBy>;
};

/** primary key columns input for table: hsl_route.legacy_hsl_municipality_code */
export type HslRouteLegacyHslMunicipalityCodePkColumnsInput = {
  hsl_municipality: Scalars['String'];
};

/** select columns of table "hsl_route.legacy_hsl_municipality_code" */
export enum HslRouteLegacyHslMunicipalityCodeSelectColumn {
  /** column name */
  HslMunicipality = 'hsl_municipality',
  /** column name */
  Jore3Code = 'jore3_code',
}

/** input type for updating data in table "hsl_route.legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeSetInput = {
  hsl_municipality?: InputMaybe<Scalars['String']>;
  jore3_code?: InputMaybe<Scalars['smallint']>;
};

/** aggregate stddev on columns */
export type HslRouteLegacyHslMunicipalityCodeStddevFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_stddev_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type HslRouteLegacyHslMunicipalityCodeStddevPopFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_stddev_pop_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type HslRouteLegacyHslMunicipalityCodeStddevSampFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_stddev_samp_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "hsl_route_legacy_hsl_municipality_code" */
export type HslRouteLegacyHslMunicipalityCodeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: HslRouteLegacyHslMunicipalityCodeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type HslRouteLegacyHslMunicipalityCodeStreamCursorValueInput = {
  hsl_municipality?: InputMaybe<Scalars['String']>;
  jore3_code?: InputMaybe<Scalars['smallint']>;
};

/** aggregate sum on columns */
export type HslRouteLegacyHslMunicipalityCodeSumFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_sum_fields';
  jore3_code?: Maybe<Scalars['smallint']>;
};

/** update columns of table "hsl_route.legacy_hsl_municipality_code" */
export enum HslRouteLegacyHslMunicipalityCodeUpdateColumn {
  /** column name */
  HslMunicipality = 'hsl_municipality',
  /** column name */
  Jore3Code = 'jore3_code',
}

export type HslRouteLegacyHslMunicipalityCodeUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<HslRouteLegacyHslMunicipalityCodeIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HslRouteLegacyHslMunicipalityCodeSetInput>;
  /** filter the rows which have to be updated */
  where: HslRouteLegacyHslMunicipalityCodeBoolExp;
};

/** aggregate var_pop on columns */
export type HslRouteLegacyHslMunicipalityCodeVarPopFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_var_pop_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type HslRouteLegacyHslMunicipalityCodeVarSampFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_var_samp_fields';
  jore3_code?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type HslRouteLegacyHslMunicipalityCodeVarianceFields = {
  __typename?: 'hsl_route_legacy_hsl_municipality_code_variance_fields';
  jore3_code?: Maybe<Scalars['Float']>;
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
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

/** Transport target, can be used e.g. for cost sharing. */
export type HslRouteTransportTargetLinesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
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
  columns?: InputMaybe<Array<HslRouteTransportTargetSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "hsl_route.transport_target". All fields are combined with a logical 'AND'. */
export type HslRouteTransportTargetBoolExp = {
  _and?: InputMaybe<Array<HslRouteTransportTargetBoolExp>>;
  _not?: InputMaybe<HslRouteTransportTargetBoolExp>;
  _or?: InputMaybe<Array<HslRouteTransportTargetBoolExp>>;
  lines?: InputMaybe<RouteLineBoolExp>;
  lines_aggregate?: InputMaybe<RouteLineAggregateBoolExp>;
  transport_target?: InputMaybe<StringComparisonExp>;
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
  _eq?: InputMaybe<HslRouteTransportTargetEnum>;
  _in?: InputMaybe<Array<HslRouteTransportTargetEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<HslRouteTransportTargetEnum>;
  _nin?: InputMaybe<Array<HslRouteTransportTargetEnum>>;
};

/** input type for inserting data into table "hsl_route.transport_target" */
export type HslRouteTransportTargetInsertInput = {
  lines?: InputMaybe<RouteLineArrRelInsertInput>;
  transport_target?: InputMaybe<Scalars['String']>;
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
  on_conflict?: InputMaybe<HslRouteTransportTargetOnConflict>;
};

/** on_conflict condition type for table "hsl_route.transport_target" */
export type HslRouteTransportTargetOnConflict = {
  constraint: HslRouteTransportTargetConstraint;
  update_columns?: Array<HslRouteTransportTargetUpdateColumn>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

/** Ordering options when selecting data from "hsl_route.transport_target". */
export type HslRouteTransportTargetOrderBy = {
  lines_aggregate?: InputMaybe<RouteLineAggregateOrderBy>;
  transport_target?: InputMaybe<OrderBy>;
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
  transport_target?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "hsl_route_transport_target" */
export type HslRouteTransportTargetStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: HslRouteTransportTargetStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type HslRouteTransportTargetStreamCursorValueInput = {
  transport_target?: InputMaybe<Scalars['String']>;
};

/** update columns of table "hsl_route.transport_target" */
export enum HslRouteTransportTargetUpdateColumn {
  /** column name */
  TransportTarget = 'transport_target',
}

export type HslRouteTransportTargetUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<HslRouteTransportTargetSetInput>;
  /** filter the rows which have to be updated */
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
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** The direction in which an e.g. infrastructure link can be traversed */
export type InfrastructureNetworkDirectionInfrastructureLinksAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
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
  columns?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.direction". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkDirectionBoolExp = {
  _and?: InputMaybe<Array<InfrastructureNetworkDirectionBoolExp>>;
  _not?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
  _or?: InputMaybe<Array<InfrastructureNetworkDirectionBoolExp>>;
  infrastructure_links?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExp>;
  value?: InputMaybe<StringComparisonExp>;
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
  _eq?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  _in?: InputMaybe<Array<InfrastructureNetworkDirectionEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  _nin?: InputMaybe<Array<InfrastructureNetworkDirectionEnum>>;
};

/** input type for inserting data into table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionInsertInput = {
  infrastructure_links?: InputMaybe<InfrastructureNetworkInfrastructureLinkArrRelInsertInput>;
  value?: InputMaybe<Scalars['String']>;
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
  on_conflict?: InputMaybe<InfrastructureNetworkDirectionOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.direction" */
export type InfrastructureNetworkDirectionOnConflict = {
  constraint: InfrastructureNetworkDirectionConstraint;
  update_columns?: Array<InfrastructureNetworkDirectionUpdateColumn>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.direction". */
export type InfrastructureNetworkDirectionOrderBy = {
  infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateOrderBy>;
  value?: InputMaybe<OrderBy>;
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
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "infrastructure_network_direction" */
export type InfrastructureNetworkDirectionStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkDirectionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkDirectionStreamCursorValueInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.direction" */
export enum InfrastructureNetworkDirectionUpdateColumn {
  /** column name */
  Value = 'value',
}

export type InfrastructureNetworkDirectionUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<InfrastructureNetworkDirectionSetInput>;
  /** filter the rows which have to be updated */
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
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** An external source from which infrastructure network parts are imported */
export type InfrastructureNetworkExternalSourceInfrastructureLinksAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
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
  columns?: InputMaybe<Array<InfrastructureNetworkExternalSourceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.external_source". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkExternalSourceBoolExp = {
  _and?: InputMaybe<Array<InfrastructureNetworkExternalSourceBoolExp>>;
  _not?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
  _or?: InputMaybe<Array<InfrastructureNetworkExternalSourceBoolExp>>;
  infrastructure_links?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExp>;
  value?: InputMaybe<StringComparisonExp>;
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
  _eq?: InputMaybe<InfrastructureNetworkExternalSourceEnum>;
  _in?: InputMaybe<Array<InfrastructureNetworkExternalSourceEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<InfrastructureNetworkExternalSourceEnum>;
  _nin?: InputMaybe<Array<InfrastructureNetworkExternalSourceEnum>>;
};

/** input type for inserting data into table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceInsertInput = {
  infrastructure_links?: InputMaybe<InfrastructureNetworkInfrastructureLinkArrRelInsertInput>;
  value?: InputMaybe<Scalars['String']>;
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
  on_conflict?: InputMaybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.external_source" */
export type InfrastructureNetworkExternalSourceOnConflict = {
  constraint: InfrastructureNetworkExternalSourceConstraint;
  update_columns?: Array<InfrastructureNetworkExternalSourceUpdateColumn>;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.external_source". */
export type InfrastructureNetworkExternalSourceOrderBy = {
  infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateOrderBy>;
  value?: InputMaybe<OrderBy>;
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
  value?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "infrastructure_network_external_source" */
export type InfrastructureNetworkExternalSourceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkExternalSourceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkExternalSourceStreamCursorValueInput = {
  value?: InputMaybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.external_source" */
export enum InfrastructureNetworkExternalSourceUpdateColumn {
  /** column name */
  Value = 'value',
}

export type InfrastructureNetworkExternalSourceUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<InfrastructureNetworkExternalSourceSetInput>;
  /** filter the rows which have to be updated */
  where: InfrastructureNetworkExternalSourceBoolExp;
};

export type InfrastructureNetworkFindPointDirectionOnLinkArgs = {
  infrastructure_link_uuid?: InputMaybe<Scalars['uuid']>;
  point_max_distance_in_meters?: InputMaybe<Scalars['float8']>;
  point_of_interest?: InputMaybe<Scalars['geography']>;
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
    distinct_on?: InputMaybe<
      Array<RouteInfrastructureLinkAlongRouteSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkInfrastructureLinkAlongRoutesAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<RouteInfrastructureLinkAlongRouteSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
    where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkScheduledStopPointsLocatedOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinksArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453 */
export type InfrastructureNetworkInfrastructureLinkVehicleSubmodeOnInfrastructureLinksAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** aggregated selection of "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregate = {
  __typename?: 'infrastructure_network_infrastructure_link_aggregate';
  aggregate?: Maybe<InfrastructureNetworkInfrastructureLinkAggregateFields>;
  nodes: Array<InfrastructureNetworkInfrastructureLink>;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExp = {
  avg?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpAvg>;
  corr?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorr>;
  count?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCount>;
  covar_samp?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSamp>;
  max?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpMax>;
  min?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpMin>;
  stddev_samp?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSamp>;
  sum?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpSum>;
  var_samp?: InputMaybe<InfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSamp>;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpAvg = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpAvgArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorr = {
  arguments: InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArguments =
  {
    X: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArgumentsColumns;
    Y: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCorrArgumentsColumns;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCount = {
  arguments?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: IntComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSamp = {
  arguments: InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArguments;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArguments =
  {
    X: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArgumentsColumns;
    Y: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpCovarSampArgumentsColumns;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpMax = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMaxArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpMin = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpMinArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSamp =
  {
    arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpStddevSampArgumentsColumns;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
    predicate: Float8ComparisonExp;
  };

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpSum = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpSumArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  predicate: Float8ComparisonExp;
};

export type InfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSamp = {
  arguments: InfrastructureNetworkInfrastructureLinkSelectColumnInfrastructureNetworkInfrastructureLinkAggregateBoolExpVarSampArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
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
  columns?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkAggregateOrderBy = {
  avg?: InputMaybe<InfrastructureNetworkInfrastructureLinkAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<InfrastructureNetworkInfrastructureLinkMaxOrderBy>;
  min?: InputMaybe<InfrastructureNetworkInfrastructureLinkMinOrderBy>;
  stddev?: InputMaybe<InfrastructureNetworkInfrastructureLinkStddevOrderBy>;
  stddev_pop?: InputMaybe<InfrastructureNetworkInfrastructureLinkStddevPopOrderBy>;
  stddev_samp?: InputMaybe<InfrastructureNetworkInfrastructureLinkStddevSampOrderBy>;
  sum?: InputMaybe<InfrastructureNetworkInfrastructureLinkSumOrderBy>;
  var_pop?: InputMaybe<InfrastructureNetworkInfrastructureLinkVarPopOrderBy>;
  var_samp?: InputMaybe<InfrastructureNetworkInfrastructureLinkVarSampOrderBy>;
  variance?: InputMaybe<InfrastructureNetworkInfrastructureLinkVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkArrRelInsertInput = {
  data: Array<InfrastructureNetworkInfrastructureLinkInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.infrastructure_link". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkInfrastructureLinkBoolExp = {
  _and?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkBoolExp>>;
  _not?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  _or?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkBoolExp>>;
  direction?: InputMaybe<InfrastructureNetworkDirectionEnumComparisonExp>;
  directionByDirection?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
  estimated_length_in_metres?: InputMaybe<Float8ComparisonExp>;
  external_link_id?: InputMaybe<StringComparisonExp>;
  external_link_source?: InputMaybe<InfrastructureNetworkExternalSourceEnumComparisonExp>;
  external_source?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
  infrastructure_link_along_routes?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  infrastructure_link_along_routes_aggregate?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateBoolExp>;
  infrastructure_link_id?: InputMaybe<UuidComparisonExp>;
  scheduled_stop_points_located_on_infrastructure_link?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_located_on_infrastructure_link_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  shape?: InputMaybe<GeographyComparisonExp>;
  vehicle_submode_on_infrastructure_link?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_link_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
  vehicle_submode_on_infrastructure_links?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
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
  estimated_length_in_metres?: InputMaybe<Scalars['float8']>;
};

/** input type for inserting data into table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkInsertInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  directionByDirection?: InputMaybe<InfrastructureNetworkDirectionObjRelInsertInput>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: InputMaybe<Scalars['float8']>;
  external_link_id?: InputMaybe<Scalars['String']>;
  external_link_source?: InputMaybe<InfrastructureNetworkExternalSourceEnum>;
  external_source?: InputMaybe<InfrastructureNetworkExternalSourceObjRelInsertInput>;
  infrastructure_link_along_routes?: InputMaybe<RouteInfrastructureLinkAlongRouteArrRelInsertInput>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  scheduled_stop_points_located_on_infrastructure_link?: InputMaybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: InputMaybe<Scalars['geography']>;
  vehicle_submode_on_infrastructure_link?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
  vehicle_submode_on_infrastructure_links?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
  external_link_id?: InputMaybe<OrderBy>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<OrderBy>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
  external_link_id?: InputMaybe<OrderBy>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** on_conflict condition type for table "infrastructure_network.infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkOnConflict = {
  constraint: InfrastructureNetworkInfrastructureLinkConstraint;
  update_columns?: Array<InfrastructureNetworkInfrastructureLinkUpdateColumn>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

/** Ordering options when selecting data from "infrastructure_network.infrastructure_link". */
export type InfrastructureNetworkInfrastructureLinkOrderBy = {
  direction?: InputMaybe<OrderBy>;
  directionByDirection?: InputMaybe<InfrastructureNetworkDirectionOrderBy>;
  estimated_length_in_metres?: InputMaybe<OrderBy>;
  external_link_id?: InputMaybe<OrderBy>;
  external_link_source?: InputMaybe<OrderBy>;
  external_source?: InputMaybe<InfrastructureNetworkExternalSourceOrderBy>;
  infrastructure_link_along_routes_aggregate?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateOrderBy>;
  infrastructure_link_id?: InputMaybe<OrderBy>;
  scheduled_stop_points_located_on_infrastructure_link_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  shape?: InputMaybe<OrderBy>;
  vehicle_submode_on_infrastructure_link_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
  vehicle_submode_on_infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
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
  direction?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: InputMaybe<Scalars['float8']>;
  external_link_id?: InputMaybe<Scalars['String']>;
  external_link_source?: InputMaybe<InfrastructureNetworkExternalSourceEnum>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: InputMaybe<Scalars['geography']>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "infrastructure_network_infrastructure_link" */
export type InfrastructureNetworkInfrastructureLinkStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: InfrastructureNetworkInfrastructureLinkStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkInfrastructureLinkStreamCursorValueInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: InputMaybe<Scalars['float8']>;
  external_link_id?: InputMaybe<Scalars['String']>;
  external_link_source?: InputMaybe<InfrastructureNetworkExternalSourceEnum>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: InputMaybe<Scalars['geography']>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
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
  _inc?: InputMaybe<InfrastructureNetworkInfrastructureLinkIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<InfrastructureNetworkInfrastructureLinkSetInput>;
  /** filter the rows which have to be updated */
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
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
  estimated_length_in_metres?: InputMaybe<OrderBy>;
};

export type InfrastructureNetworkResolvePointToClosestLinkArgs = {
  geog?: InputMaybe<Scalars['geography']>;
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
    count?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExpCount>;
  };

export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExpCount =
  {
    arguments?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
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
    columns?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy =
  {
    count?: InputMaybe<OrderBy>;
    max?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMaxOrderBy>;
    min?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkMinOrderBy>;
  };

/** input type for inserting array relation for remote table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput =
  {
    data: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput>;
    /** upsert condition */
    on_conflict?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** Boolean expression to filter rows from the table "infrastructure_network.vehicle_submode_on_infrastructure_link". All fields are combined with a logical 'AND'. */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp = {
  _and?: InputMaybe<
    Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>
  >;
  _not?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  _or?: InputMaybe<
    Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>
  >;
  infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_link_id?: InputMaybe<UuidComparisonExp>;
  vehicleSubmodeByVehicleSubmode?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
  vehicle_submode?: InputMaybe<ReusableComponentsVehicleSubmodeEnumComparisonExp>;
};

/** unique or primary key constraints on table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkConstraint {
  /** unique or primary key constraint on columns "infrastructure_link_id", "vehicle_submode" */
  VehicleSubmodeOnInfrastructureLinkPkey = 'vehicle_submode_on_infrastructure_link_pkey',
}

/** input type for inserting data into table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput =
  {
    infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
    vehicleSubmodeByVehicleSubmode?: InputMaybe<ReusableComponentsVehicleSubmodeObjRelInsertInput>;
    /** The vehicle submode that can safely traverse the infrastructure link. */
    vehicle_submode?: InputMaybe<ReusableComponentsVehicleSubmodeEnum>;
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
    infrastructure_link_id?: InputMaybe<OrderBy>;
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
    infrastructure_link_id?: InputMaybe<OrderBy>;
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
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** Ordering options when selecting data from "infrastructure_network.vehicle_submode_on_infrastructure_link". */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy = {
  infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  infrastructure_link_id?: InputMaybe<OrderBy>;
  vehicleSubmodeByVehicleSubmode?: InputMaybe<ReusableComponentsVehicleSubmodeOrderBy>;
  vehicle_submode?: InputMaybe<OrderBy>;
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
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode?: InputMaybe<ReusableComponentsVehicleSubmodeEnum>;
};

/** Streaming cursor of the table "infrastructure_network_vehicle_submode_on_infrastructure_link" */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorValueInput;
    /** cursor ordering */
    ordering?: InputMaybe<CursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorValueInput =
  {
    /** The infrastructure link that can be safely traversed by the vehicle submode. */
    infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
    /** The vehicle submode that can safely traverse the infrastructure link. */
    vehicle_submode?: InputMaybe<ReusableComponentsVehicleSubmodeEnum>;
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
  _set?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
  /** filter the rows which have to be updated */
  where: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp;
};

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type IntervalComparisonExp = {
  _eq?: InputMaybe<Scalars['interval']>;
  _gt?: InputMaybe<Scalars['interval']>;
  _gte?: InputMaybe<Scalars['interval']>;
  _in?: InputMaybe<Array<Scalars['interval']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['interval']>;
  _lte?: InputMaybe<Scalars['interval']>;
  _neq?: InputMaybe<Scalars['interval']>;
  _nin?: InputMaybe<Array<Scalars['interval']>>;
};

export type JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    new_direction?: InputMaybe<Scalars['String']>;
    new_label?: InputMaybe<Scalars['String']>;
    new_located_on_infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
    new_measured_location?: InputMaybe<Scalars['geography']>;
    new_priority?: InputMaybe<Scalars['Int']>;
    new_validity_end?: InputMaybe<Scalars['date']>;
    new_validity_start?: InputMaybe<Scalars['date']>;
    replace_scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
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
  distinct_on?: InputMaybe<
    Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
  >;
  where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternJourneyPatternRefsAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
  >;
  where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternScheduledStopPointInJourneyPatternsArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 */
export type JourneyPatternJourneyPatternScheduledStopPointInJourneyPatternsAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** aggregated selection of "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregate = {
  __typename?: 'journey_pattern_journey_pattern_aggregate';
  aggregate?: Maybe<JourneyPatternJourneyPatternAggregateFields>;
  nodes: Array<JourneyPatternJourneyPattern>;
};

export type JourneyPatternJourneyPatternAggregateBoolExp = {
  count?: InputMaybe<JourneyPatternJourneyPatternAggregateBoolExpCount>;
};

export type JourneyPatternJourneyPatternAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
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
  columns?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<JourneyPatternJourneyPatternMaxOrderBy>;
  min?: InputMaybe<JourneyPatternJourneyPatternMinOrderBy>;
};

/** input type for inserting array relation for remote table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternArrRelInsertInput = {
  data: Array<JourneyPatternJourneyPatternInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<JourneyPatternJourneyPatternOnConflict>;
};

/** Boolean expression to filter rows from the table "journey_pattern.journey_pattern". All fields are combined with a logical 'AND'. */
export type JourneyPatternJourneyPatternBoolExp = {
  _and?: InputMaybe<Array<JourneyPatternJourneyPatternBoolExp>>;
  _not?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  _or?: InputMaybe<Array<JourneyPatternJourneyPatternBoolExp>>;
  journey_pattern_id?: InputMaybe<UuidComparisonExp>;
  journey_pattern_route?: InputMaybe<RouteRouteBoolExp>;
  on_route_id?: InputMaybe<UuidComparisonExp>;
  scheduled_stop_point_in_journey_patterns?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  scheduled_stop_point_in_journey_patterns_aggregate?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp>;
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
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  journey_pattern_route?: InputMaybe<RouteRouteObjRelInsertInput>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: InputMaybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput>;
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
  journey_pattern_id?: InputMaybe<OrderBy>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: InputMaybe<OrderBy>;
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
  journey_pattern_id?: InputMaybe<OrderBy>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<JourneyPatternJourneyPatternOnConflict>;
};

/** on_conflict condition type for table "journey_pattern.journey_pattern" */
export type JourneyPatternJourneyPatternOnConflict = {
  constraint: JourneyPatternJourneyPatternConstraint;
  update_columns?: Array<JourneyPatternJourneyPatternUpdateColumn>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.journey_pattern". */
export type JourneyPatternJourneyPatternOrderBy = {
  journey_pattern_id?: InputMaybe<OrderBy>;
  journey_pattern_route?: InputMaybe<RouteRouteOrderBy>;
  on_route_id?: InputMaybe<OrderBy>;
  scheduled_stop_point_in_journey_patterns_aggregate?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy>;
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
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "journey_pattern_journey_pattern" */
export type JourneyPatternJourneyPatternStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: JourneyPatternJourneyPatternStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type JourneyPatternJourneyPatternStreamCursorValueInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: InputMaybe<Scalars['uuid']>;
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
  _set?: InputMaybe<JourneyPatternJourneyPatternSetInput>;
  /** filter the rows which have to be updated */
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
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternScheduledStopPointsAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternViaPointNameI18nArgs =
  {
    path?: InputMaybe<Scalars['String']>;
  };

/** The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern. */
export type JourneyPatternScheduledStopPointInJourneyPatternViaPointShortNameI18nArgs =
  {
    path?: InputMaybe<Scalars['String']>;
  };

/** aggregated selection of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregate = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate';
  aggregate?: Maybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateFields>;
  nodes: Array<JourneyPatternScheduledStopPointInJourneyPattern>;
};

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp = {
  bool_and?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOr>;
  count?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpCount>;
};

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAnd =
  {
    arguments: JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolAndArgumentsColumns;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
    predicate: BooleanComparisonExp;
  };

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOr =
  {
    arguments: JourneyPatternScheduledStopPointInJourneyPatternSelectColumnJourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpBoolOrArgumentsColumns;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
    predicate: BooleanComparisonExp;
  };

export type JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExpCount =
  {
    arguments?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
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
    columns?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy = {
  avg?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternMaxOrderBy>;
  min?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternMinOrderBy>;
  stddev?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternStddevOrderBy>;
  stddev_pop?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternStddevPopOrderBy>;
  stddev_samp?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternStddevSampOrderBy>;
  sum?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternSumOrderBy>;
  var_pop?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternVarPopOrderBy>;
  var_samp?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternVarSampOrderBy>;
  variance?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type JourneyPatternScheduledStopPointInJourneyPatternAppendInput = {
  via_point_name_i18n?: InputMaybe<Scalars['jsonb']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput =
  {
    data: Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>;
    /** upsert condition */
    on_conflict?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "journey_pattern.scheduled_stop_point_in_journey_pattern". All fields are combined with a logical 'AND'. */
export type JourneyPatternScheduledStopPointInJourneyPatternBoolExp = {
  _and?: InputMaybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>
  >;
  _not?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  _or?: InputMaybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>
  >;
  is_loading_time_allowed?: InputMaybe<BooleanComparisonExp>;
  is_regulated_timing_point?: InputMaybe<BooleanComparisonExp>;
  is_used_as_timing_point?: InputMaybe<BooleanComparisonExp>;
  is_via_point?: InputMaybe<BooleanComparisonExp>;
  journey_pattern?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  journey_pattern_id?: InputMaybe<UuidComparisonExp>;
  scheduled_stop_point_label?: InputMaybe<StringComparisonExp>;
  scheduled_stop_point_sequence?: InputMaybe<IntComparisonExp>;
  scheduled_stop_points?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  via_point_name_i18n?: InputMaybe<JsonbComparisonExp>;
  via_point_short_name_i18n?: InputMaybe<JsonbComparisonExp>;
};

/** unique or primary key constraints on table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum JourneyPatternScheduledStopPointInJourneyPatternConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_sequence", "journey_pattern_id" */
  ScheduledStopPointInJourneyPatternPkey = 'scheduled_stop_point_in_journey_pattern_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput =
  {
    via_point_name_i18n?: InputMaybe<Array<Scalars['String']>>;
    via_point_short_name_i18n?: InputMaybe<Array<Scalars['String']>>;
  };

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput = {
  via_point_name_i18n?: InputMaybe<Scalars['Int']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput = {
  via_point_name_i18n?: InputMaybe<Scalars['String']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternIncInput = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternInsertInput = {
  /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
  is_loading_time_allowed?: InputMaybe<Scalars['Boolean']>;
  /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
  is_regulated_timing_point?: InputMaybe<Scalars['Boolean']>;
  /** Is this scheduled stop point used as a timing point in the journey pattern? */
  is_used_as_timing_point?: InputMaybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: InputMaybe<Scalars['Boolean']>;
  journey_pattern?: InputMaybe<JourneyPatternJourneyPatternObjRelInsertInput>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
  scheduled_stop_points?: InputMaybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  via_point_name_i18n?: InputMaybe<Scalars['localized_string']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['localized_string']>;
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
  journey_pattern_id?: InputMaybe<OrderBy>;
  scheduled_stop_point_label?: InputMaybe<OrderBy>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  journey_pattern_id?: InputMaybe<OrderBy>;
  scheduled_stop_point_label?: InputMaybe<OrderBy>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.scheduled_stop_point_in_journey_pattern". */
export type JourneyPatternScheduledStopPointInJourneyPatternOrderBy = {
  is_loading_time_allowed?: InputMaybe<OrderBy>;
  is_regulated_timing_point?: InputMaybe<OrderBy>;
  is_used_as_timing_point?: InputMaybe<OrderBy>;
  is_via_point?: InputMaybe<OrderBy>;
  journey_pattern?: InputMaybe<JourneyPatternJourneyPatternOrderBy>;
  journey_pattern_id?: InputMaybe<OrderBy>;
  scheduled_stop_point_label?: InputMaybe<OrderBy>;
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
  scheduled_stop_points_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  via_point_name_i18n?: InputMaybe<OrderBy>;
  via_point_short_name_i18n?: InputMaybe<OrderBy>;
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
  via_point_name_i18n?: InputMaybe<Scalars['jsonb']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
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
  is_loading_time_allowed?: InputMaybe<Scalars['Boolean']>;
  /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
  is_regulated_timing_point?: InputMaybe<Scalars['Boolean']>;
  /** Is this scheduled stop point used as a timing point in the journey pattern? */
  is_used_as_timing_point?: InputMaybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: InputMaybe<Scalars['Boolean']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
  via_point_name_i18n?: InputMaybe<Scalars['localized_string']>;
  via_point_short_name_i18n?: InputMaybe<Scalars['localized_string']>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
  };

/** Streaming cursor of the table "journey_pattern_scheduled_stop_point_in_journey_pattern" */
export type JourneyPatternScheduledStopPointInJourneyPatternStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: JourneyPatternScheduledStopPointInJourneyPatternStreamCursorValueInput;
    /** cursor ordering */
    ordering?: InputMaybe<CursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type JourneyPatternScheduledStopPointInJourneyPatternStreamCursorValueInput =
  {
    /** Is adding loading time to this scheduled stop point in the journey pattern allowed? */
    is_loading_time_allowed?: InputMaybe<Scalars['Boolean']>;
    /** Is this stop point passing time regulated so that it cannot be passed before scheduled time? */
    is_regulated_timing_point?: InputMaybe<Scalars['Boolean']>;
    /** Is this scheduled stop point used as a timing point in the journey pattern? */
    is_used_as_timing_point?: InputMaybe<Scalars['Boolean']>;
    /** Is this scheduled stop point a via point? */
    is_via_point?: InputMaybe<Scalars['Boolean']>;
    /** The ID of the journey pattern. */
    journey_pattern_id?: InputMaybe<Scalars['uuid']>;
    scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
    /** The order of the scheduled stop point within the journey pattern. */
    scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
    via_point_name_i18n?: InputMaybe<Scalars['jsonb']>;
    via_point_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  _append?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
  /** filter the rows which have to be updated */
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
};

export type JsonbCastExp = {
  String?: InputMaybe<StringComparisonExp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type JsonbComparisonExp = {
  _cast?: InputMaybe<JsonbCastExp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type MutationRoot = {
  __typename?: 'mutation_root';
  /** delete data from the table: "hsl_route.legacy_hsl_municipality_code" */
  delete_hsl_route_legacy_hsl_municipality_code?: Maybe<HslRouteLegacyHslMunicipalityCodeMutationResponse>;
  /** delete single row from the table: "hsl_route.legacy_hsl_municipality_code" */
  delete_hsl_route_legacy_hsl_municipality_code_by_pk?: Maybe<HslRouteLegacyHslMunicipalityCode>;
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
  /** delete data from the table: "service_pattern.distance_between_stops_calculation" */
  delete_service_pattern_distance_between_stops_calculation?: Maybe<ServicePatternDistanceBetweenStopsCalculationMutationResponse>;
  /** delete single row from the table: "service_pattern.distance_between_stops_calculation" */
  delete_service_pattern_distance_between_stops_calculation_by_pk?: Maybe<ServicePatternDistanceBetweenStopsCalculation>;
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
  /** insert data into the table: "hsl_route.legacy_hsl_municipality_code" */
  insert_hsl_route_legacy_hsl_municipality_code?: Maybe<HslRouteLegacyHslMunicipalityCodeMutationResponse>;
  /** insert a single row into the table: "hsl_route.legacy_hsl_municipality_code" */
  insert_hsl_route_legacy_hsl_municipality_code_one?: Maybe<HslRouteLegacyHslMunicipalityCode>;
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
  /** insert data into the table: "service_pattern.distance_between_stops_calculation" */
  insert_service_pattern_distance_between_stops_calculation?: Maybe<ServicePatternDistanceBetweenStopsCalculationMutationResponse>;
  /** insert a single row into the table: "service_pattern.distance_between_stops_calculation" */
  insert_service_pattern_distance_between_stops_calculation_one?: Maybe<ServicePatternDistanceBetweenStopsCalculation>;
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
  /** update data of the table: "hsl_route.legacy_hsl_municipality_code" */
  update_hsl_route_legacy_hsl_municipality_code?: Maybe<HslRouteLegacyHslMunicipalityCodeMutationResponse>;
  /** update single row of the table: "hsl_route.legacy_hsl_municipality_code" */
  update_hsl_route_legacy_hsl_municipality_code_by_pk?: Maybe<HslRouteLegacyHslMunicipalityCode>;
  /** update multiples rows of table: "hsl_route.legacy_hsl_municipality_code" */
  update_hsl_route_legacy_hsl_municipality_code_many?: Maybe<
    Array<Maybe<HslRouteLegacyHslMunicipalityCodeMutationResponse>>
  >;
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
  /** update data of the table: "service_pattern.distance_between_stops_calculation" */
  update_service_pattern_distance_between_stops_calculation?: Maybe<ServicePatternDistanceBetweenStopsCalculationMutationResponse>;
  /** update single row of the table: "service_pattern.distance_between_stops_calculation" */
  update_service_pattern_distance_between_stops_calculation_by_pk?: Maybe<ServicePatternDistanceBetweenStopsCalculation>;
  /** update multiples rows of table: "service_pattern.distance_between_stops_calculation" */
  update_service_pattern_distance_between_stops_calculation_many?: Maybe<
    Array<Maybe<ServicePatternDistanceBetweenStopsCalculationMutationResponse>>
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
export type MutationRootDeleteHslRouteLegacyHslMunicipalityCodeArgs = {
  where: HslRouteLegacyHslMunicipalityCodeBoolExp;
};

/** mutation root */
export type MutationRootDeleteHslRouteLegacyHslMunicipalityCodeByPkArgs = {
  hsl_municipality: Scalars['String'];
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
export type MutationRootDeleteServicePatternDistanceBetweenStopsCalculationArgs =
  {
    where: ServicePatternDistanceBetweenStopsCalculationBoolExp;
  };

/** mutation root */
export type MutationRootDeleteServicePatternDistanceBetweenStopsCalculationByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    observation_date: Scalars['date'];
    route_priority: Scalars['Int'];
    stop_interval_sequence: Scalars['Int'];
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
export type MutationRootInsertHslRouteLegacyHslMunicipalityCodeArgs = {
  objects: Array<HslRouteLegacyHslMunicipalityCodeInsertInput>;
  on_conflict?: InputMaybe<HslRouteLegacyHslMunicipalityCodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertHslRouteLegacyHslMunicipalityCodeOneArgs = {
  object: HslRouteLegacyHslMunicipalityCodeInsertInput;
  on_conflict?: InputMaybe<HslRouteLegacyHslMunicipalityCodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertHslRouteTransportTargetArgs = {
  objects: Array<HslRouteTransportTargetInsertInput>;
  on_conflict?: InputMaybe<HslRouteTransportTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertHslRouteTransportTargetOneArgs = {
  object: HslRouteTransportTargetInsertInput;
  on_conflict?: InputMaybe<HslRouteTransportTargetOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkDirectionArgs = {
  objects: Array<InfrastructureNetworkDirectionInsertInput>;
  on_conflict?: InputMaybe<InfrastructureNetworkDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkDirectionOneArgs = {
  object: InfrastructureNetworkDirectionInsertInput;
  on_conflict?: InputMaybe<InfrastructureNetworkDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkExternalSourceArgs = {
  objects: Array<InfrastructureNetworkExternalSourceInsertInput>;
  on_conflict?: InputMaybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkExternalSourceOneArgs = {
  object: InfrastructureNetworkExternalSourceInsertInput;
  on_conflict?: InputMaybe<InfrastructureNetworkExternalSourceOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkInfrastructureLinkArgs = {
  objects: Array<InfrastructureNetworkInfrastructureLinkInsertInput>;
  on_conflict?: InputMaybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkInfrastructureLinkOneArgs = {
  object: InfrastructureNetworkInfrastructureLinkInsertInput;
  on_conflict?: InputMaybe<InfrastructureNetworkInfrastructureLinkOnConflict>;
};

/** mutation root */
export type MutationRootInsertInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    objects: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput>;
    on_conflict?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** mutation root */
export type MutationRootInsertInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOneArgs =
  {
    object: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkInsertInput;
    on_conflict?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOnConflict>;
  };

/** mutation root */
export type MutationRootInsertJourneyPatternJourneyPatternArgs = {
  objects: Array<JourneyPatternJourneyPatternInsertInput>;
  on_conflict?: InputMaybe<JourneyPatternJourneyPatternOnConflict>;
};

/** mutation root */
export type MutationRootInsertJourneyPatternJourneyPatternOneArgs = {
  object: JourneyPatternJourneyPatternInsertInput;
  on_conflict?: InputMaybe<JourneyPatternJourneyPatternOnConflict>;
};

/** mutation root */
export type MutationRootInsertJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    objects: Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>;
    on_conflict?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
  };

/** mutation root */
export type MutationRootInsertJourneyPatternScheduledStopPointInJourneyPatternOneArgs =
  {
    object: JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
    on_conflict?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternOnConflict>;
  };

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleModeArgs = {
  objects: Array<ReusableComponentsVehicleModeInsertInput>;
  on_conflict?: InputMaybe<ReusableComponentsVehicleModeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleModeOneArgs = {
  object: ReusableComponentsVehicleModeInsertInput;
  on_conflict?: InputMaybe<ReusableComponentsVehicleModeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleSubmodeArgs = {
  objects: Array<ReusableComponentsVehicleSubmodeInsertInput>;
  on_conflict?: InputMaybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertReusableComponentsVehicleSubmodeOneArgs = {
  object: ReusableComponentsVehicleSubmodeInsertInput;
  on_conflict?: InputMaybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteDirectionArgs = {
  objects: Array<RouteDirectionInsertInput>;
  on_conflict?: InputMaybe<RouteDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteDirectionOneArgs = {
  object: RouteDirectionInsertInput;
  on_conflict?: InputMaybe<RouteDirectionOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteInfrastructureLinkAlongRouteArgs = {
  objects: Array<RouteInfrastructureLinkAlongRouteInsertInput>;
  on_conflict?: InputMaybe<RouteInfrastructureLinkAlongRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteInfrastructureLinkAlongRouteOneArgs = {
  object: RouteInfrastructureLinkAlongRouteInsertInput;
  on_conflict?: InputMaybe<RouteInfrastructureLinkAlongRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteLineArgs = {
  objects: Array<RouteLineInsertInput>;
  on_conflict?: InputMaybe<RouteLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteLineOneArgs = {
  object: RouteLineInsertInput;
  on_conflict?: InputMaybe<RouteLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteRouteArgs = {
  objects: Array<RouteRouteInsertInput>;
  on_conflict?: InputMaybe<RouteRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteRouteOneArgs = {
  object: RouteRouteInsertInput;
  on_conflict?: InputMaybe<RouteRouteOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteTypeOfLineArgs = {
  objects: Array<RouteTypeOfLineInsertInput>;
  on_conflict?: InputMaybe<RouteTypeOfLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertRouteTypeOfLineOneArgs = {
  object: RouteTypeOfLineInsertInput;
  on_conflict?: InputMaybe<RouteTypeOfLineOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternDistanceBetweenStopsCalculationArgs =
  {
    objects: Array<ServicePatternDistanceBetweenStopsCalculationInsertInput>;
    on_conflict?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationOnConflict>;
  };

/** mutation root */
export type MutationRootInsertServicePatternDistanceBetweenStopsCalculationOneArgs =
  {
    object: ServicePatternDistanceBetweenStopsCalculationInsertInput;
    on_conflict?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationOnConflict>;
  };

/** mutation root */
export type MutationRootInsertServicePatternScheduledStopPointArgs = {
  objects: Array<ServicePatternScheduledStopPointInsertInput>;
  on_conflict?: InputMaybe<ServicePatternScheduledStopPointOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternScheduledStopPointOneArgs = {
  object: ServicePatternScheduledStopPointInsertInput;
  on_conflict?: InputMaybe<ServicePatternScheduledStopPointOnConflict>;
};

/** mutation root */
export type MutationRootInsertServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    objects: Array<ServicePatternVehicleModeOnScheduledStopPointInsertInput>;
    on_conflict?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
  };

/** mutation root */
export type MutationRootInsertServicePatternVehicleModeOnScheduledStopPointOneArgs =
  {
    object: ServicePatternVehicleModeOnScheduledStopPointInsertInput;
    on_conflict?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
  };

/** mutation root */
export type MutationRootInsertTimingPatternTimingPlaceArgs = {
  objects: Array<TimingPatternTimingPlaceInsertInput>;
  on_conflict?: InputMaybe<TimingPatternTimingPlaceOnConflict>;
};

/** mutation root */
export type MutationRootInsertTimingPatternTimingPlaceOneArgs = {
  object: TimingPatternTimingPlaceInsertInput;
  on_conflict?: InputMaybe<TimingPatternTimingPlaceOnConflict>;
};

/** mutation root */
export type MutationRootUpdateHslRouteLegacyHslMunicipalityCodeArgs = {
  _inc?: InputMaybe<HslRouteLegacyHslMunicipalityCodeIncInput>;
  _set?: InputMaybe<HslRouteLegacyHslMunicipalityCodeSetInput>;
  where: HslRouteLegacyHslMunicipalityCodeBoolExp;
};

/** mutation root */
export type MutationRootUpdateHslRouteLegacyHslMunicipalityCodeByPkArgs = {
  _inc?: InputMaybe<HslRouteLegacyHslMunicipalityCodeIncInput>;
  _set?: InputMaybe<HslRouteLegacyHslMunicipalityCodeSetInput>;
  pk_columns: HslRouteLegacyHslMunicipalityCodePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateHslRouteLegacyHslMunicipalityCodeManyArgs = {
  updates: Array<HslRouteLegacyHslMunicipalityCodeUpdates>;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetArgs = {
  _set?: InputMaybe<HslRouteTransportTargetSetInput>;
  where: HslRouteTransportTargetBoolExp;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetByPkArgs = {
  _set?: InputMaybe<HslRouteTransportTargetSetInput>;
  pk_columns: HslRouteTransportTargetPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateHslRouteTransportTargetManyArgs = {
  updates: Array<HslRouteTransportTargetUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionArgs = {
  _set?: InputMaybe<InfrastructureNetworkDirectionSetInput>;
  where: InfrastructureNetworkDirectionBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionByPkArgs = {
  _set?: InputMaybe<InfrastructureNetworkDirectionSetInput>;
  pk_columns: InfrastructureNetworkDirectionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkDirectionManyArgs = {
  updates: Array<InfrastructureNetworkDirectionUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceArgs = {
  _set?: InputMaybe<InfrastructureNetworkExternalSourceSetInput>;
  where: InfrastructureNetworkExternalSourceBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceByPkArgs = {
  _set?: InputMaybe<InfrastructureNetworkExternalSourceSetInput>;
  pk_columns: InfrastructureNetworkExternalSourcePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkExternalSourceManyArgs = {
  updates: Array<InfrastructureNetworkExternalSourceUpdates>;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkInfrastructureLinkArgs = {
  _inc?: InputMaybe<InfrastructureNetworkInfrastructureLinkIncInput>;
  _set?: InputMaybe<InfrastructureNetworkInfrastructureLinkSetInput>;
  where: InfrastructureNetworkInfrastructureLinkBoolExp;
};

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkInfrastructureLinkByPkArgs =
  {
    _inc?: InputMaybe<InfrastructureNetworkInfrastructureLinkIncInput>;
    _set?: InputMaybe<InfrastructureNetworkInfrastructureLinkSetInput>;
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
    _set?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
    where: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    _set?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSetInput>;
    pk_columns: InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkManyArgs =
  {
    updates: Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkUpdates>;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternArgs = {
  _set?: InputMaybe<JourneyPatternJourneyPatternSetInput>;
  where: JourneyPatternJourneyPatternBoolExp;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternByPkArgs = {
  _set?: InputMaybe<JourneyPatternJourneyPatternSetInput>;
  pk_columns: JourneyPatternJourneyPatternPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternJourneyPatternManyArgs = {
  updates: Array<JourneyPatternJourneyPatternUpdates>;
};

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    _append?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
    _delete_at_path?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
    _delete_elem?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
    _delete_key?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
    _inc?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
    _prepend?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
    _set?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
    where: JourneyPatternScheduledStopPointInJourneyPatternBoolExp;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    _append?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAppendInput>;
    _delete_at_path?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteAtPathInput>;
    _delete_elem?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteElemInput>;
    _delete_key?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternDeleteKeyInput>;
    _inc?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternIncInput>;
    _prepend?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternPrependInput>;
    _set?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternSetInput>;
    pk_columns: JourneyPatternScheduledStopPointInJourneyPatternPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateJourneyPatternScheduledStopPointInJourneyPatternManyArgs =
  {
    updates: Array<JourneyPatternScheduledStopPointInJourneyPatternUpdates>;
  };

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeArgs = {
  _set?: InputMaybe<ReusableComponentsVehicleModeSetInput>;
  where: ReusableComponentsVehicleModeBoolExp;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeByPkArgs = {
  _set?: InputMaybe<ReusableComponentsVehicleModeSetInput>;
  pk_columns: ReusableComponentsVehicleModePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleModeManyArgs = {
  updates: Array<ReusableComponentsVehicleModeUpdates>;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeArgs = {
  _set?: InputMaybe<ReusableComponentsVehicleSubmodeSetInput>;
  where: ReusableComponentsVehicleSubmodeBoolExp;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeByPkArgs = {
  _set?: InputMaybe<ReusableComponentsVehicleSubmodeSetInput>;
  pk_columns: ReusableComponentsVehicleSubmodePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateReusableComponentsVehicleSubmodeManyArgs = {
  updates: Array<ReusableComponentsVehicleSubmodeUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionArgs = {
  _set?: InputMaybe<RouteDirectionSetInput>;
  where: RouteDirectionBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionByPkArgs = {
  _set?: InputMaybe<RouteDirectionSetInput>;
  pk_columns: RouteDirectionPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteDirectionManyArgs = {
  updates: Array<RouteDirectionUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteArgs = {
  _inc?: InputMaybe<RouteInfrastructureLinkAlongRouteIncInput>;
  _set?: InputMaybe<RouteInfrastructureLinkAlongRouteSetInput>;
  where: RouteInfrastructureLinkAlongRouteBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteByPkArgs = {
  _inc?: InputMaybe<RouteInfrastructureLinkAlongRouteIncInput>;
  _set?: InputMaybe<RouteInfrastructureLinkAlongRouteSetInput>;
  pk_columns: RouteInfrastructureLinkAlongRoutePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteInfrastructureLinkAlongRouteManyArgs = {
  updates: Array<RouteInfrastructureLinkAlongRouteUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteLineArgs = {
  _append?: InputMaybe<RouteLineAppendInput>;
  _delete_at_path?: InputMaybe<RouteLineDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RouteLineDeleteElemInput>;
  _delete_key?: InputMaybe<RouteLineDeleteKeyInput>;
  _inc?: InputMaybe<RouteLineIncInput>;
  _prepend?: InputMaybe<RouteLinePrependInput>;
  _set?: InputMaybe<RouteLineSetInput>;
  where: RouteLineBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteLineByPkArgs = {
  _append?: InputMaybe<RouteLineAppendInput>;
  _delete_at_path?: InputMaybe<RouteLineDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RouteLineDeleteElemInput>;
  _delete_key?: InputMaybe<RouteLineDeleteKeyInput>;
  _inc?: InputMaybe<RouteLineIncInput>;
  _prepend?: InputMaybe<RouteLinePrependInput>;
  _set?: InputMaybe<RouteLineSetInput>;
  pk_columns: RouteLinePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteLineManyArgs = {
  updates: Array<RouteLineUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteRouteArgs = {
  _append?: InputMaybe<RouteRouteAppendInput>;
  _delete_at_path?: InputMaybe<RouteRouteDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RouteRouteDeleteElemInput>;
  _delete_key?: InputMaybe<RouteRouteDeleteKeyInput>;
  _inc?: InputMaybe<RouteRouteIncInput>;
  _prepend?: InputMaybe<RouteRoutePrependInput>;
  _set?: InputMaybe<RouteRouteSetInput>;
  where: RouteRouteBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteRouteByPkArgs = {
  _append?: InputMaybe<RouteRouteAppendInput>;
  _delete_at_path?: InputMaybe<RouteRouteDeleteAtPathInput>;
  _delete_elem?: InputMaybe<RouteRouteDeleteElemInput>;
  _delete_key?: InputMaybe<RouteRouteDeleteKeyInput>;
  _inc?: InputMaybe<RouteRouteIncInput>;
  _prepend?: InputMaybe<RouteRoutePrependInput>;
  _set?: InputMaybe<RouteRouteSetInput>;
  pk_columns: RouteRoutePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteRouteManyArgs = {
  updates: Array<RouteRouteUpdates>;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineArgs = {
  _set?: InputMaybe<RouteTypeOfLineSetInput>;
  where: RouteTypeOfLineBoolExp;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineByPkArgs = {
  _set?: InputMaybe<RouteTypeOfLineSetInput>;
  pk_columns: RouteTypeOfLinePkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateRouteTypeOfLineManyArgs = {
  updates: Array<RouteTypeOfLineUpdates>;
};

/** mutation root */
export type MutationRootUpdateServicePatternDistanceBetweenStopsCalculationArgs =
  {
    _inc?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationIncInput>;
    _set?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationSetInput>;
    where: ServicePatternDistanceBetweenStopsCalculationBoolExp;
  };

/** mutation root */
export type MutationRootUpdateServicePatternDistanceBetweenStopsCalculationByPkArgs =
  {
    _inc?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationIncInput>;
    _set?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationSetInput>;
    pk_columns: ServicePatternDistanceBetweenStopsCalculationPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateServicePatternDistanceBetweenStopsCalculationManyArgs =
  {
    updates: Array<ServicePatternDistanceBetweenStopsCalculationUpdates>;
  };

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointArgs = {
  _inc?: InputMaybe<ServicePatternScheduledStopPointIncInput>;
  _set?: InputMaybe<ServicePatternScheduledStopPointSetInput>;
  where: ServicePatternScheduledStopPointBoolExp;
};

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointByPkArgs = {
  _inc?: InputMaybe<ServicePatternScheduledStopPointIncInput>;
  _set?: InputMaybe<ServicePatternScheduledStopPointSetInput>;
  pk_columns: ServicePatternScheduledStopPointPkColumnsInput;
};

/** mutation root */
export type MutationRootUpdateServicePatternScheduledStopPointManyArgs = {
  updates: Array<ServicePatternScheduledStopPointUpdates>;
};

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    _set?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
    where: ServicePatternVehicleModeOnScheduledStopPointBoolExp;
  };

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointByPkArgs =
  {
    _set?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
    pk_columns: ServicePatternVehicleModeOnScheduledStopPointPkColumnsInput;
  };

/** mutation root */
export type MutationRootUpdateServicePatternVehicleModeOnScheduledStopPointManyArgs =
  {
    updates: Array<ServicePatternVehicleModeOnScheduledStopPointUpdates>;
  };

/** mutation root */
export type MutationRootUpdateTimingPatternTimingPlaceArgs = {
  _append?: InputMaybe<TimingPatternTimingPlaceAppendInput>;
  _delete_at_path?: InputMaybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  _delete_elem?: InputMaybe<TimingPatternTimingPlaceDeleteElemInput>;
  _delete_key?: InputMaybe<TimingPatternTimingPlaceDeleteKeyInput>;
  _prepend?: InputMaybe<TimingPatternTimingPlacePrependInput>;
  _set?: InputMaybe<TimingPatternTimingPlaceSetInput>;
  where: TimingPatternTimingPlaceBoolExp;
};

/** mutation root */
export type MutationRootUpdateTimingPatternTimingPlaceByPkArgs = {
  _append?: InputMaybe<TimingPatternTimingPlaceAppendInput>;
  _delete_at_path?: InputMaybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  _delete_elem?: InputMaybe<TimingPatternTimingPlaceDeleteElemInput>;
  _delete_key?: InputMaybe<TimingPatternTimingPlaceDeleteKeyInput>;
  _prepend?: InputMaybe<TimingPatternTimingPlacePrependInput>;
  _set?: InputMaybe<TimingPatternTimingPlaceSetInput>;
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
  count?: InputMaybe<PassingTimesTimetabledPassingTimeAggregateBoolExpCount>;
};

export type PassingTimesTimetabledPassingTimeAggregateBoolExpCount = {
  arguments?: InputMaybe<
    Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  predicate: IntComparisonExp;
};

export type QueryRoot = {
  __typename?: 'query_root';
  /** fetch data from the table: "hsl_route.legacy_hsl_municipality_code" */
  hsl_route_legacy_hsl_municipality_code: Array<HslRouteLegacyHslMunicipalityCode>;
  /** fetch aggregated fields from the table: "hsl_route.legacy_hsl_municipality_code" */
  hsl_route_legacy_hsl_municipality_code_aggregate: HslRouteLegacyHslMunicipalityCodeAggregate;
  /** fetch data from the table: "hsl_route.legacy_hsl_municipality_code" using primary key columns */
  hsl_route_legacy_hsl_municipality_code_by_pk?: Maybe<HslRouteLegacyHslMunicipalityCode>;
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
  /** fetch data from the table: "service_pattern.distance_between_stops_calculation" */
  service_pattern_distance_between_stops_calculation: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** fetch aggregated fields from the table: "service_pattern.distance_between_stops_calculation" */
  service_pattern_distance_between_stops_calculation_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
  /** fetch data from the table: "service_pattern.distance_between_stops_calculation" using primary key columns */
  service_pattern_distance_between_stops_calculation_by_pk?: Maybe<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_by_routes" which returns "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_by_routes: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_by_routes" and query aggregates on result of table type "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_by_routes_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
  /** execute function "service_pattern.get_distances_between_stop_points_in_journey_patterns" which returns "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_in_journey_patterns: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_in_journey_patterns" and query aggregates on result of table type "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_in_journey_patterns_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
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

export type QueryRootHslRouteLegacyHslMunicipalityCodeArgs = {
  distinct_on?: InputMaybe<
    Array<HslRouteLegacyHslMunicipalityCodeSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeOrderBy>>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

export type QueryRootHslRouteLegacyHslMunicipalityCodeAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<HslRouteLegacyHslMunicipalityCodeSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeOrderBy>>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

export type QueryRootHslRouteLegacyHslMunicipalityCodeByPkArgs = {
  hsl_municipality: Scalars['String'];
};

export type QueryRootHslRouteTransportTargetArgs = {
  distinct_on?: InputMaybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

export type QueryRootHslRouteTransportTargetAggregateArgs = {
  distinct_on?: InputMaybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

export type QueryRootHslRouteTransportTargetByPkArgs = {
  transport_target: Scalars['String'];
};

export type QueryRootInfrastructureNetworkDirectionArgs = {
  distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkDirectionAggregateArgs = {
  distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkDirectionByPkArgs = {
  value: Scalars['String'];
};

export type QueryRootInfrastructureNetworkExternalSourceArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkExternalSourceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type QueryRootInfrastructureNetworkExternalSourceAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkExternalSourceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type QueryRootInfrastructureNetworkExternalSourceByPkArgs = {
  value: Scalars['String'];
};

export type QueryRootInfrastructureNetworkFindPointDirectionOnLinkArgs = {
  args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
  distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type QueryRootInfrastructureNetworkFindPointDirectionOnLinkAggregateArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type QueryRootInfrastructureNetworkInfrastructureLinkArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkInfrastructureLinkAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkInfrastructureLinkByPkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};

export type QueryRootInfrastructureNetworkResolvePointToClosestLinkArgs = {
  args: InfrastructureNetworkResolvePointToClosestLinkArgs;
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type QueryRootInfrastructureNetworkResolvePointToClosestLinkAggregateArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type QueryRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkByPkArgs =
  {
    infrastructure_link_id: Scalars['uuid'];
    vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
  };

export type QueryRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointAggregateArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternJourneyPatternArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternJourneyPatternAggregateArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternJourneyPatternByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
};

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternArgs = {
  distinct_on?: InputMaybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
  >;
  where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
};

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type QueryRootJourneyPatternScheduledStopPointInJourneyPatternByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    scheduled_stop_point_sequence: Scalars['Int'];
  };

export type QueryRootReusableComponentsVehicleModeArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

export type QueryRootReusableComponentsVehicleModeAggregateArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

export type QueryRootReusableComponentsVehicleModeByPkArgs = {
  vehicle_mode: Scalars['String'];
};

export type QueryRootReusableComponentsVehicleSubmodeArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type QueryRootReusableComponentsVehicleSubmodeAggregateArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type QueryRootReusableComponentsVehicleSubmodeByPkArgs = {
  vehicle_submode: Scalars['String'];
};

export type QueryRootRouteDirectionArgs = {
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

export type QueryRootRouteDirectionAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

export type QueryRootRouteDirectionByPkArgs = {
  direction: Scalars['String'];
};

export type QueryRootRouteInfrastructureLinkAlongRouteArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type QueryRootRouteInfrastructureLinkAlongRouteAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type QueryRootRouteInfrastructureLinkAlongRouteByPkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};

export type QueryRootRouteLineArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

export type QueryRootRouteLineAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

export type QueryRootRouteLineByPkArgs = {
  line_id: Scalars['uuid'];
};

export type QueryRootRouteRouteArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

export type QueryRootRouteRouteAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

export type QueryRootRouteRouteByPkArgs = {
  route_id: Scalars['uuid'];
};

export type QueryRootRouteTypeOfLineArgs = {
  distinct_on?: InputMaybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteTypeOfLineOrderBy>>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

export type QueryRootRouteTypeOfLineAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteTypeOfLineOrderBy>>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

export type QueryRootRouteTypeOfLineByPkArgs = {
  type_of_line: Scalars['String'];
};

export type QueryRootServicePatternDistanceBetweenStopsCalculationArgs = {
  distinct_on?: InputMaybe<
    Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
  >;
  where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
};

export type QueryRootServicePatternDistanceBetweenStopsCalculationAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type QueryRootServicePatternDistanceBetweenStopsCalculationByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
  observation_date: Scalars['date'];
  route_priority: Scalars['Int'];
  stop_interval_sequence: Scalars['Int'];
};

export type QueryRootServicePatternGetDistancesBetweenStopPointsByRoutesArgs = {
  args: ServicePatternGetDistancesBetweenStopPointsByRoutesArgs;
  distinct_on?: InputMaybe<
    Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
  >;
  where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
};

export type QueryRootServicePatternGetDistancesBetweenStopPointsByRoutesAggregateArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsByRoutesArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type QueryRootServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type QueryRootServicePatternGetDistancesBetweenStopPointsInJourneyPatternsAggregateArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type QueryRootServicePatternScheduledStopPointArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternScheduledStopPointAggregateArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
};

export type QueryRootServicePatternVehicleModeOnScheduledStopPointArgs = {
  distinct_on?: InputMaybe<
    Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
  >;
  where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
};

export type QueryRootServicePatternVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type QueryRootServicePatternVehicleModeOnScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
  vehicle_mode: ReusableComponentsVehicleModeEnum;
};

export type QueryRootTimingPatternTimingPlaceArgs = {
  distinct_on?: InputMaybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
};

export type QueryRootTimingPatternTimingPlaceAggregateArgs = {
  distinct_on?: InputMaybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
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
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/** The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
export type ReusableComponentsVehicleModeVehicleSubmodesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
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
  columns?: InputMaybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_mode". All fields are combined with a logical 'AND'. */
export type ReusableComponentsVehicleModeBoolExp = {
  _and?: InputMaybe<Array<ReusableComponentsVehicleModeBoolExp>>;
  _not?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
  _or?: InputMaybe<Array<ReusableComponentsVehicleModeBoolExp>>;
  vehicle_mode?: InputMaybe<StringComparisonExp>;
  vehicle_submodes?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
  vehicle_submodes_aggregate?: InputMaybe<ReusableComponentsVehicleSubmodeAggregateBoolExp>;
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
  _eq?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  _in?: InputMaybe<Array<ReusableComponentsVehicleModeEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  _nin?: InputMaybe<Array<ReusableComponentsVehicleModeEnum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeInsertInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: InputMaybe<Scalars['String']>;
  vehicle_submodes?: InputMaybe<ReusableComponentsVehicleSubmodeArrRelInsertInput>;
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
  on_conflict?: InputMaybe<ReusableComponentsVehicleModeOnConflict>;
};

/** on_conflict condition type for table "reusable_components.vehicle_mode" */
export type ReusableComponentsVehicleModeOnConflict = {
  constraint: ReusableComponentsVehicleModeConstraint;
  update_columns?: Array<ReusableComponentsVehicleModeUpdateColumn>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_mode". */
export type ReusableComponentsVehicleModeOrderBy = {
  vehicle_mode?: InputMaybe<OrderBy>;
  vehicle_submodes_aggregate?: InputMaybe<ReusableComponentsVehicleSubmodeAggregateOrderBy>;
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
  vehicle_mode?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "reusable_components_vehicle_mode" */
export type ReusableComponentsVehicleModeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ReusableComponentsVehicleModeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ReusableComponentsVehicleModeStreamCursorValueInput = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: InputMaybe<Scalars['String']>;
};

/** update columns of table "reusable_components.vehicle_mode" */
export enum ReusableComponentsVehicleModeUpdateColumn {
  /** column name */
  VehicleMode = 'vehicle_mode',
}

export type ReusableComponentsVehicleModeUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ReusableComponentsVehicleModeSetInput>;
  /** filter the rows which have to be updated */
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
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
export type ReusableComponentsVehicleSubmodeVehicleSubmodeOnInfrastructureLinksAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

/** aggregated selection of "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregate = {
  __typename?: 'reusable_components_vehicle_submode_aggregate';
  aggregate?: Maybe<ReusableComponentsVehicleSubmodeAggregateFields>;
  nodes: Array<ReusableComponentsVehicleSubmode>;
};

export type ReusableComponentsVehicleSubmodeAggregateBoolExp = {
  count?: InputMaybe<ReusableComponentsVehicleSubmodeAggregateBoolExpCount>;
};

export type ReusableComponentsVehicleSubmodeAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
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
  columns?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ReusableComponentsVehicleSubmodeMaxOrderBy>;
  min?: InputMaybe<ReusableComponentsVehicleSubmodeMinOrderBy>;
};

/** input type for inserting array relation for remote table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeArrRelInsertInput = {
  data: Array<ReusableComponentsVehicleSubmodeInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_submode". All fields are combined with a logical 'AND'. */
export type ReusableComponentsVehicleSubmodeBoolExp = {
  _and?: InputMaybe<Array<ReusableComponentsVehicleSubmodeBoolExp>>;
  _not?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
  _or?: InputMaybe<Array<ReusableComponentsVehicleSubmodeBoolExp>>;
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
  vehicle_submode?: InputMaybe<StringComparisonExp>;
  vehicle_submode_on_infrastructure_links?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  vehicle_submode_on_infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateBoolExp>;
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
  _eq?: InputMaybe<ReusableComponentsVehicleSubmodeEnum>;
  _in?: InputMaybe<Array<ReusableComponentsVehicleSubmodeEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<ReusableComponentsVehicleSubmodeEnum>;
  _nin?: InputMaybe<Array<ReusableComponentsVehicleSubmodeEnum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeInsertInput = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeObjRelInsertInput>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: InputMaybe<Scalars['String']>;
  vehicle_submode_on_infrastructure_links?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArrRelInsertInput>;
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
  vehicle_submode?: InputMaybe<OrderBy>;
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
  vehicle_submode?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<ReusableComponentsVehicleSubmodeOnConflict>;
};

/** on_conflict condition type for table "reusable_components.vehicle_submode" */
export type ReusableComponentsVehicleSubmodeOnConflict = {
  constraint: ReusableComponentsVehicleSubmodeConstraint;
  update_columns?: Array<ReusableComponentsVehicleSubmodeUpdateColumn>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_submode". */
export type ReusableComponentsVehicleSubmodeOrderBy = {
  belonging_to_vehicle_mode?: InputMaybe<OrderBy>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeOrderBy>;
  vehicle_submode?: InputMaybe<OrderBy>;
  vehicle_submode_on_infrastructure_links_aggregate?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateOrderBy>;
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
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "reusable_components_vehicle_submode" */
export type ReusableComponentsVehicleSubmodeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ReusableComponentsVehicleSubmodeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ReusableComponentsVehicleSubmodeStreamCursorValueInput = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: InputMaybe<Scalars['String']>;
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
  _set?: InputMaybe<ReusableComponentsVehicleSubmodeSetInput>;
  /** filter the rows which have to be updated */
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
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

/** The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480 */
export type RouteDirectionDirectionsAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

/** aggregated selection of "route.direction" */
export type RouteDirectionAggregate = {
  __typename?: 'route_direction_aggregate';
  aggregate?: Maybe<RouteDirectionAggregateFields>;
  nodes: Array<RouteDirection>;
};

export type RouteDirectionAggregateBoolExp = {
  count?: InputMaybe<RouteDirectionAggregateBoolExpCount>;
};

export type RouteDirectionAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteDirectionBoolExp>;
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
  columns?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.direction" */
export type RouteDirectionAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RouteDirectionMaxOrderBy>;
  min?: InputMaybe<RouteDirectionMinOrderBy>;
};

/** input type for inserting array relation for remote table "route.direction" */
export type RouteDirectionArrRelInsertInput = {
  data: Array<RouteDirectionInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<RouteDirectionOnConflict>;
};

/** Boolean expression to filter rows from the table "route.direction". All fields are combined with a logical 'AND'. */
export type RouteDirectionBoolExp = {
  _and?: InputMaybe<Array<RouteDirectionBoolExp>>;
  _not?: InputMaybe<RouteDirectionBoolExp>;
  _or?: InputMaybe<Array<RouteDirectionBoolExp>>;
  direction?: InputMaybe<StringComparisonExp>;
  directionByTheOppositeOfDirection?: InputMaybe<RouteDirectionBoolExp>;
  directions?: InputMaybe<RouteDirectionBoolExp>;
  directions_aggregate?: InputMaybe<RouteDirectionAggregateBoolExp>;
  the_opposite_of_direction?: InputMaybe<RouteDirectionEnumComparisonExp>;
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
  _eq?: InputMaybe<RouteDirectionEnum>;
  _in?: InputMaybe<Array<RouteDirectionEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<RouteDirectionEnum>;
  _nin?: InputMaybe<Array<RouteDirectionEnum>>;
};

/** input type for inserting data into table "route.direction" */
export type RouteDirectionInsertInput = {
  /** The name of the route direction. */
  direction?: InputMaybe<Scalars['String']>;
  directionByTheOppositeOfDirection?: InputMaybe<RouteDirectionObjRelInsertInput>;
  directions?: InputMaybe<RouteDirectionArrRelInsertInput>;
  /** The opposite direction. */
  the_opposite_of_direction?: InputMaybe<RouteDirectionEnum>;
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
  direction?: InputMaybe<OrderBy>;
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
  direction?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<RouteDirectionOnConflict>;
};

/** on_conflict condition type for table "route.direction" */
export type RouteDirectionOnConflict = {
  constraint: RouteDirectionConstraint;
  update_columns?: Array<RouteDirectionUpdateColumn>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

/** Ordering options when selecting data from "route.direction". */
export type RouteDirectionOrderBy = {
  direction?: InputMaybe<OrderBy>;
  directionByTheOppositeOfDirection?: InputMaybe<RouteDirectionOrderBy>;
  directions_aggregate?: InputMaybe<RouteDirectionAggregateOrderBy>;
  the_opposite_of_direction?: InputMaybe<OrderBy>;
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
  direction?: InputMaybe<Scalars['String']>;
  /** The opposite direction. */
  the_opposite_of_direction?: InputMaybe<RouteDirectionEnum>;
};

/** Streaming cursor of the table "route_direction" */
export type RouteDirectionStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteDirectionStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteDirectionStreamCursorValueInput = {
  /** The name of the route direction. */
  direction?: InputMaybe<Scalars['String']>;
  /** The opposite direction. */
  the_opposite_of_direction?: InputMaybe<RouteDirectionEnum>;
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
  _set?: InputMaybe<RouteDirectionSetInput>;
  /** filter the rows which have to be updated */
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
  bool_and?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOr>;
  count?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateBoolExpCount>;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAnd = {
  arguments: RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  predicate: BooleanComparisonExp;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOr = {
  arguments: RouteInfrastructureLinkAlongRouteSelectColumnRouteInfrastructureLinkAlongRouteAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  predicate: BooleanComparisonExp;
};

export type RouteInfrastructureLinkAlongRouteAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
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
  columns?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteAggregateOrderBy = {
  avg?: InputMaybe<RouteInfrastructureLinkAlongRouteAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RouteInfrastructureLinkAlongRouteMaxOrderBy>;
  min?: InputMaybe<RouteInfrastructureLinkAlongRouteMinOrderBy>;
  stddev?: InputMaybe<RouteInfrastructureLinkAlongRouteStddevOrderBy>;
  stddev_pop?: InputMaybe<RouteInfrastructureLinkAlongRouteStddevPopOrderBy>;
  stddev_samp?: InputMaybe<RouteInfrastructureLinkAlongRouteStddevSampOrderBy>;
  sum?: InputMaybe<RouteInfrastructureLinkAlongRouteSumOrderBy>;
  var_pop?: InputMaybe<RouteInfrastructureLinkAlongRouteVarPopOrderBy>;
  var_samp?: InputMaybe<RouteInfrastructureLinkAlongRouteVarSampOrderBy>;
  variance?: InputMaybe<RouteInfrastructureLinkAlongRouteVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteArrRelInsertInput = {
  data: Array<RouteInfrastructureLinkAlongRouteInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<RouteInfrastructureLinkAlongRouteOnConflict>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.infrastructure_link_along_route". All fields are combined with a logical 'AND'. */
export type RouteInfrastructureLinkAlongRouteBoolExp = {
  _and?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteBoolExp>>;
  _not?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  _or?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteBoolExp>>;
  infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  infrastructure_link_id?: InputMaybe<UuidComparisonExp>;
  infrastructure_link_sequence?: InputMaybe<IntComparisonExp>;
  is_traversal_forwards?: InputMaybe<BooleanComparisonExp>;
  route_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "route.infrastructure_link_along_route" */
export enum RouteInfrastructureLinkAlongRouteConstraint {
  /** unique or primary key constraint on columns "route_id", "infrastructure_link_sequence" */
  InfrastructureLinkAlongRoutePkey = 'infrastructure_link_along_route_pkey',
}

/** input type for incrementing numeric columns in table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteIncInput = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteInsertInput = {
  infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: InputMaybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
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
  infrastructure_link_id?: InputMaybe<OrderBy>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
  /** The ID of the route. */
  route_id?: InputMaybe<OrderBy>;
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
  infrastructure_link_id?: InputMaybe<OrderBy>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
  /** The ID of the route. */
  route_id?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** Ordering options when selecting data from "route.infrastructure_link_along_route". */
export type RouteInfrastructureLinkAlongRouteOrderBy = {
  infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  infrastructure_link_id?: InputMaybe<OrderBy>;
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
  is_traversal_forwards?: InputMaybe<OrderBy>;
  route_id?: InputMaybe<OrderBy>;
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
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: InputMaybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "route_infrastructure_link_along_route" */
export type RouteInfrastructureLinkAlongRouteStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteInfrastructureLinkAlongRouteStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteInfrastructureLinkAlongRouteStreamCursorValueInput = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: InputMaybe<Scalars['Int']>;
  /** Is the infrastructure link traversed in the direction of its linestring? */
  is_traversal_forwards?: InputMaybe<Scalars['Boolean']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
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
  _inc?: InputMaybe<RouteInfrastructureLinkAlongRouteIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RouteInfrastructureLinkAlongRouteSetInput>;
  /** filter the rows which have to be updated */
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
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
  infrastructure_link_sequence?: InputMaybe<OrderBy>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLine = {
  __typename?: 'route_line';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label: Scalars['String'];
  /** An object relationship */
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: Maybe<HslRouteLegacyHslMunicipalityCode>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
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
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineLineRoutesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487 */
export type RouteLineShortNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "route.line" */
export type RouteLineAggregate = {
  __typename?: 'route_line_aggregate';
  aggregate?: Maybe<RouteLineAggregateFields>;
  nodes: Array<RouteLine>;
};

export type RouteLineAggregateBoolExp = {
  count?: InputMaybe<RouteLineAggregateBoolExpCount>;
};

export type RouteLineAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RouteLineSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteLineBoolExp>;
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
  columns?: InputMaybe<Array<RouteLineSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.line" */
export type RouteLineAggregateOrderBy = {
  avg?: InputMaybe<RouteLineAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RouteLineMaxOrderBy>;
  min?: InputMaybe<RouteLineMinOrderBy>;
  stddev?: InputMaybe<RouteLineStddevOrderBy>;
  stddev_pop?: InputMaybe<RouteLineStddevPopOrderBy>;
  stddev_samp?: InputMaybe<RouteLineStddevSampOrderBy>;
  sum?: InputMaybe<RouteLineSumOrderBy>;
  var_pop?: InputMaybe<RouteLineVarPopOrderBy>;
  var_samp?: InputMaybe<RouteLineVarSampOrderBy>;
  variance?: InputMaybe<RouteLineVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RouteLineAppendInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "route.line" */
export type RouteLineArrRelInsertInput = {
  data: Array<RouteLineInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<RouteLineOnConflict>;
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
  priority?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.line". All fields are combined with a logical 'AND'. */
export type RouteLineBoolExp = {
  _and?: InputMaybe<Array<RouteLineBoolExp>>;
  _not?: InputMaybe<RouteLineBoolExp>;
  _or?: InputMaybe<Array<RouteLineBoolExp>>;
  label?: InputMaybe<StringComparisonExp>;
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
  legacy_hsl_municipality_code?: InputMaybe<StringComparisonExp>;
  line_id?: InputMaybe<UuidComparisonExp>;
  line_routes?: InputMaybe<RouteRouteBoolExp>;
  line_routes_aggregate?: InputMaybe<RouteRouteAggregateBoolExp>;
  name_i18n?: InputMaybe<JsonbComparisonExp>;
  primary_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  short_name_i18n?: InputMaybe<JsonbComparisonExp>;
  transportTargetByTransportTarget?: InputMaybe<HslRouteTransportTargetBoolExp>;
  transport_target?: InputMaybe<HslRouteTransportTargetEnumComparisonExp>;
  typeOfLineByTypeOfLine?: InputMaybe<RouteTypeOfLineBoolExp>;
  type_of_line?: InputMaybe<RouteTypeOfLineEnumComparisonExp>;
  validity_end?: InputMaybe<DateComparisonExp>;
  validity_start?: InputMaybe<DateComparisonExp>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

/** unique or primary key constraints on table "route.line" */
export enum RouteLineConstraint {
  /** unique or primary key constraint on columns "line_id" */
  LinePkey = 'line_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RouteLineDeleteAtPathInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Array<Scalars['String']>>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RouteLineDeleteElemInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RouteLineDeleteKeyInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['String']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "route.line" */
export type RouteLineIncInput = {
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.line" */
export type RouteLineInsertInput = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: InputMaybe<Scalars['String']>;
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeObjRelInsertInput>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: InputMaybe<Scalars['uuid']>;
  line_routes?: InputMaybe<RouteRouteArrRelInsertInput>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n: Scalars['localized_string'];
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n: Scalars['localized_string'];
  transportTargetByTransportTarget?: InputMaybe<HslRouteTransportTargetObjRelInsertInput>;
  transport_target?: InputMaybe<HslRouteTransportTargetEnum>;
  typeOfLineByTypeOfLine?: InputMaybe<RouteTypeOfLineObjRelInsertInput>;
  /** The type of the line. */
  type_of_line?: InputMaybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: InputMaybe<Scalars['date']>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeObjRelInsertInput>;
};

/** aggregate max on columns */
export type RouteLineMaxFields = {
  __typename?: 'route_line_max_fields';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
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
  label?: InputMaybe<OrderBy>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  /** The ID of the line. */
  line_id?: InputMaybe<OrderBy>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: InputMaybe<OrderBy>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteLineMinFields = {
  __typename?: 'route_line_min_fields';
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: Maybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
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
  label?: InputMaybe<OrderBy>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  /** The ID of the line. */
  line_id?: InputMaybe<OrderBy>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: InputMaybe<OrderBy>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<RouteLineOnConflict>;
};

/** on_conflict condition type for table "route.line" */
export type RouteLineOnConflict = {
  constraint: RouteLineConstraint;
  update_columns?: Array<RouteLineUpdateColumn>;
  where?: InputMaybe<RouteLineBoolExp>;
};

/** Ordering options when selecting data from "route.line". */
export type RouteLineOrderBy = {
  label?: InputMaybe<OrderBy>;
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeOrderBy>;
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  line_id?: InputMaybe<OrderBy>;
  line_routes_aggregate?: InputMaybe<RouteRouteAggregateOrderBy>;
  name_i18n?: InputMaybe<OrderBy>;
  primary_vehicle_mode?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  short_name_i18n?: InputMaybe<OrderBy>;
  transportTargetByTransportTarget?: InputMaybe<HslRouteTransportTargetOrderBy>;
  transport_target?: InputMaybe<OrderBy>;
  typeOfLineByTypeOfLine?: InputMaybe<RouteTypeOfLineOrderBy>;
  type_of_line?: InputMaybe<OrderBy>;
  validity_end?: InputMaybe<OrderBy>;
  validity_start?: InputMaybe<OrderBy>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeOrderBy>;
};

/** primary key columns input for table: route.line */
export type RouteLinePkColumnsInput = {
  /** The ID of the line. */
  line_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RouteLinePrependInput = {
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "route.line" */
export enum RouteLineSelectColumn {
  /** column name */
  Label = 'label',
  /** column name */
  LegacyHslMunicipalityCode = 'legacy_hsl_municipality_code',
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
  label?: InputMaybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: InputMaybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['localized_string']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['localized_string']>;
  transport_target?: InputMaybe<HslRouteTransportTargetEnum>;
  /** The type of the line. */
  type_of_line?: InputMaybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: InputMaybe<Scalars['date']>;
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
  priority?: InputMaybe<OrderBy>;
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
  priority?: InputMaybe<OrderBy>;
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
  priority?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "route_line" */
export type RouteLineStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteLineStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteLineStreamCursorValueInput = {
  /** The label of the line definition. The label is unique for a certain priority and validity period. */
  label?: InputMaybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: InputMaybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** The priority of the line definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: InputMaybe<Scalars['jsonb']>;
  transport_target?: InputMaybe<HslRouteTransportTargetEnum>;
  /** The type of the line. */
  type_of_line?: InputMaybe<RouteTypeOfLineEnum>;
  /** The point in time from which onwards the line is no longer valid. If NULL, the line will be always valid. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the line becomes valid. If NULL, the line has been always valid. */
  validity_start?: InputMaybe<Scalars['date']>;
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
  priority?: InputMaybe<OrderBy>;
};

/** update columns of table "route.line" */
export enum RouteLineUpdateColumn {
  /** column name */
  Label = 'label',
  /** column name */
  LegacyHslMunicipalityCode = 'legacy_hsl_municipality_code',
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
  _append?: InputMaybe<RouteLineAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<RouteLineDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<RouteLineDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<RouteLineDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RouteLineIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<RouteLinePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RouteLineSetInput>;
  /** filter the rows which have to be updated */
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
  priority?: InputMaybe<OrderBy>;
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
  priority?: InputMaybe<OrderBy>;
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
  priority?: InputMaybe<OrderBy>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRoute = {
  __typename?: 'route_route';
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  /** The direction of the route definition. */
  direction: RouteDirectionEnum;
  /** An array relationship */
  infrastructure_links_along_route: Array<RouteInfrastructureLinkAlongRoute>;
  /** An aggregate relationship */
  infrastructure_links_along_route_aggregate: RouteInfrastructureLinkAlongRouteAggregate;
  /** The label of the route definition. */
  label: Scalars['String'];
  /** An object relationship */
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: Maybe<HslRouteLegacyHslMunicipalityCode>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
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
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label: Scalars['String'];
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['smallint']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDescriptionI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDestinationNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteDestinationShortNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteInfrastructureLinksAlongRouteArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteInfrastructureLinksAlongRouteAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteOriginNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteOriginShortNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteRouteJourneyPatternsArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

/** The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483 */
export type RouteRouteRouteJourneyPatternsAggregateArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

/** aggregated selection of "route.route" */
export type RouteRouteAggregate = {
  __typename?: 'route_route_aggregate';
  aggregate?: Maybe<RouteRouteAggregateFields>;
  nodes: Array<RouteRoute>;
};

export type RouteRouteAggregateBoolExp = {
  count?: InputMaybe<RouteRouteAggregateBoolExpCount>;
};

export type RouteRouteAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<RouteRouteSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<RouteRouteBoolExp>;
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
  columns?: InputMaybe<Array<RouteRouteSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.route" */
export type RouteRouteAggregateOrderBy = {
  avg?: InputMaybe<RouteRouteAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<RouteRouteMaxOrderBy>;
  min?: InputMaybe<RouteRouteMinOrderBy>;
  stddev?: InputMaybe<RouteRouteStddevOrderBy>;
  stddev_pop?: InputMaybe<RouteRouteStddevPopOrderBy>;
  stddev_samp?: InputMaybe<RouteRouteStddevSampOrderBy>;
  sum?: InputMaybe<RouteRouteSumOrderBy>;
  var_pop?: InputMaybe<RouteRouteVarPopOrderBy>;
  var_samp?: InputMaybe<RouteRouteVarSampOrderBy>;
  variance?: InputMaybe<RouteRouteVarianceOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type RouteRouteAppendInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_name_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  origin_name_i18n?: InputMaybe<Scalars['jsonb']>;
  origin_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "route.route" */
export type RouteRouteArrRelInsertInput = {
  data: Array<RouteRouteInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<RouteRouteOnConflict>;
};

/** aggregate avg on columns */
export type RouteRouteAvgFields = {
  __typename?: 'route_route_avg_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.route" */
export type RouteRouteAvgOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "route.route". All fields are combined with a logical 'AND'. */
export type RouteRouteBoolExp = {
  _and?: InputMaybe<Array<RouteRouteBoolExp>>;
  _not?: InputMaybe<RouteRouteBoolExp>;
  _or?: InputMaybe<Array<RouteRouteBoolExp>>;
  description_i18n?: InputMaybe<JsonbComparisonExp>;
  destination_name_i18n?: InputMaybe<JsonbComparisonExp>;
  destination_short_name_i18n?: InputMaybe<JsonbComparisonExp>;
  direction?: InputMaybe<RouteDirectionEnumComparisonExp>;
  infrastructure_links_along_route?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
  infrastructure_links_along_route_aggregate?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateBoolExp>;
  label?: InputMaybe<StringComparisonExp>;
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
  legacy_hsl_municipality_code?: InputMaybe<StringComparisonExp>;
  name_i18n?: InputMaybe<JsonbComparisonExp>;
  on_line_id?: InputMaybe<UuidComparisonExp>;
  origin_name_i18n?: InputMaybe<JsonbComparisonExp>;
  origin_short_name_i18n?: InputMaybe<JsonbComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  route_id?: InputMaybe<UuidComparisonExp>;
  route_journey_patterns?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  route_journey_patterns_aggregate?: InputMaybe<JourneyPatternJourneyPatternAggregateBoolExp>;
  route_line?: InputMaybe<RouteLineBoolExp>;
  route_shape?: InputMaybe<GeographyComparisonExp>;
  unique_label?: InputMaybe<StringComparisonExp>;
  validity_end?: InputMaybe<DateComparisonExp>;
  validity_start?: InputMaybe<DateComparisonExp>;
  variant?: InputMaybe<SmallintComparisonExp>;
};

/** unique or primary key constraints on table "route.route" */
export enum RouteRouteConstraint {
  /** unique or primary key constraint on columns "route_id" */
  RoutePkey = 'route_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type RouteRouteDeleteAtPathInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Array<Scalars['String']>>;
  destination_name_i18n?: InputMaybe<Array<Scalars['String']>>;
  destination_short_name_i18n?: InputMaybe<Array<Scalars['String']>>;
  name_i18n?: InputMaybe<Array<Scalars['String']>>;
  origin_name_i18n?: InputMaybe<Array<Scalars['String']>>;
  origin_short_name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type RouteRouteDeleteElemInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['Int']>;
  destination_name_i18n?: InputMaybe<Scalars['Int']>;
  destination_short_name_i18n?: InputMaybe<Scalars['Int']>;
  name_i18n?: InputMaybe<Scalars['Int']>;
  origin_name_i18n?: InputMaybe<Scalars['Int']>;
  origin_short_name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type RouteRouteDeleteKeyInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['String']>;
  destination_name_i18n?: InputMaybe<Scalars['String']>;
  destination_short_name_i18n?: InputMaybe<Scalars['String']>;
  name_i18n?: InputMaybe<Scalars['String']>;
  origin_name_i18n?: InputMaybe<Scalars['String']>;
  origin_short_name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "route.route" */
export type RouteRouteIncInput = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The variant for route definition. */
  variant?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "route.route" */
export type RouteRouteInsertInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['localized_string']>;
  destination_name_i18n: Scalars['localized_string'];
  destination_short_name_i18n: Scalars['localized_string'];
  /** The direction of the route definition. */
  direction?: InputMaybe<RouteDirectionEnum>;
  infrastructure_links_along_route?: InputMaybe<RouteInfrastructureLinkAlongRouteArrRelInsertInput>;
  /** The label of the route definition. */
  label: Scalars['String'];
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeObjRelInsertInput>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  name_i18n: Scalars['localized_string'];
  /** The line to which this route belongs. */
  on_line_id?: InputMaybe<Scalars['uuid']>;
  origin_name_i18n: Scalars['localized_string'];
  origin_short_name_i18n: Scalars['localized_string'];
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
  route_journey_patterns?: InputMaybe<JourneyPatternJourneyPatternArrRelInsertInput>;
  route_line?: InputMaybe<RouteLineObjRelInsertInput>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: InputMaybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: InputMaybe<Scalars['smallint']>;
};

/** aggregate max on columns */
export type RouteRouteMaxFields = {
  __typename?: 'route_route_max_fields';
  /** The label of the route definition. */
  label?: Maybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label?: Maybe<Scalars['String']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by max() on columns of table "route.route" */
export type RouteRouteMaxOrderBy = {
  /** The label of the route definition. */
  label?: InputMaybe<OrderBy>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  /** The line to which this route belongs. */
  on_line_id?: InputMaybe<OrderBy>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The ID of the route. */
  route_id?: InputMaybe<OrderBy>;
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label?: InputMaybe<OrderBy>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: InputMaybe<OrderBy>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type RouteRouteMinFields = {
  __typename?: 'route_route_min_fields';
  /** The label of the route definition. */
  label?: Maybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: Maybe<Scalars['String']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label?: Maybe<Scalars['String']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: Maybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: Maybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by min() on columns of table "route.route" */
export type RouteRouteMinOrderBy = {
  /** The label of the route definition. */
  label?: InputMaybe<OrderBy>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  /** The line to which this route belongs. */
  on_line_id?: InputMaybe<OrderBy>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The ID of the route. */
  route_id?: InputMaybe<OrderBy>;
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label?: InputMaybe<OrderBy>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: InputMaybe<OrderBy>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<RouteRouteOnConflict>;
};

/** on_conflict condition type for table "route.route" */
export type RouteRouteOnConflict = {
  constraint: RouteRouteConstraint;
  update_columns?: Array<RouteRouteUpdateColumn>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

/** Ordering options when selecting data from "route.route". */
export type RouteRouteOrderBy = {
  description_i18n?: InputMaybe<OrderBy>;
  destination_name_i18n?: InputMaybe<OrderBy>;
  destination_short_name_i18n?: InputMaybe<OrderBy>;
  direction?: InputMaybe<OrderBy>;
  infrastructure_links_along_route_aggregate?: InputMaybe<RouteInfrastructureLinkAlongRouteAggregateOrderBy>;
  label?: InputMaybe<OrderBy>;
  legacyHslMunicipalityCodeByLegacyHslMunicipalityCode?: InputMaybe<HslRouteLegacyHslMunicipalityCodeOrderBy>;
  legacy_hsl_municipality_code?: InputMaybe<OrderBy>;
  name_i18n?: InputMaybe<OrderBy>;
  on_line_id?: InputMaybe<OrderBy>;
  origin_name_i18n?: InputMaybe<OrderBy>;
  origin_short_name_i18n?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  route_id?: InputMaybe<OrderBy>;
  route_journey_patterns_aggregate?: InputMaybe<JourneyPatternJourneyPatternAggregateOrderBy>;
  route_line?: InputMaybe<RouteLineOrderBy>;
  route_shape?: InputMaybe<OrderBy>;
  unique_label?: InputMaybe<OrderBy>;
  validity_end?: InputMaybe<OrderBy>;
  validity_start?: InputMaybe<OrderBy>;
  variant?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: route.route */
export type RouteRoutePkColumnsInput = {
  /** The ID of the route. */
  route_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type RouteRoutePrependInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_name_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  origin_name_i18n?: InputMaybe<Scalars['jsonb']>;
  origin_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
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
  LegacyHslMunicipalityCode = 'legacy_hsl_municipality_code',
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
  UniqueLabel = 'unique_label',
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
  description_i18n?: InputMaybe<Scalars['localized_string']>;
  destination_name_i18n?: InputMaybe<Scalars['localized_string']>;
  destination_short_name_i18n?: InputMaybe<Scalars['localized_string']>;
  /** The direction of the route definition. */
  direction?: InputMaybe<RouteDirectionEnum>;
  /** The label of the route definition. */
  label?: InputMaybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  name_i18n?: InputMaybe<Scalars['localized_string']>;
  /** The line to which this route belongs. */
  on_line_id?: InputMaybe<Scalars['uuid']>;
  origin_name_i18n?: InputMaybe<Scalars['localized_string']>;
  origin_short_name_i18n?: InputMaybe<Scalars['localized_string']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: InputMaybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: InputMaybe<Scalars['smallint']>;
};

/** aggregate stddev on columns */
export type RouteRouteStddevFields = {
  __typename?: 'route_route_stddev_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.route" */
export type RouteRouteStddevOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type RouteRouteStddevPopFields = {
  __typename?: 'route_route_stddev_pop_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.route" */
export type RouteRouteStddevPopOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type RouteRouteStddevSampFields = {
  __typename?: 'route_route_stddev_samp_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.route" */
export type RouteRouteStddevSampOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "route_route" */
export type RouteRouteStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteRouteStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteRouteStreamCursorValueInput = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_name_i18n?: InputMaybe<Scalars['jsonb']>;
  destination_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The direction of the route definition. */
  direction?: InputMaybe<RouteDirectionEnum>;
  /** The label of the route definition. */
  label?: InputMaybe<Scalars['String']>;
  /** Defines the legacy municipality that is mainly used for data exports. */
  legacy_hsl_municipality_code?: InputMaybe<Scalars['String']>;
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The line to which this route belongs. */
  on_line_id?: InputMaybe<Scalars['uuid']>;
  origin_name_i18n?: InputMaybe<Scalars['jsonb']>;
  origin_short_name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: InputMaybe<Scalars['uuid']>;
  /** Derived from label and variant. Routes are unique for each unique label for a certain direction, priority and validity period */
  unique_label?: InputMaybe<Scalars['String']>;
  /** The point in time from which onwards the route is no longer valid. If NULL, the route is valid indefinitely after the start time of the validity period. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** The point in time when the route becomes valid. If NULL, the route has been always valid before end time of validity period. */
  validity_start?: InputMaybe<Scalars['date']>;
  /** The variant for route definition. */
  variant?: InputMaybe<Scalars['smallint']>;
};

/** aggregate sum on columns */
export type RouteRouteSumFields = {
  __typename?: 'route_route_sum_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Int']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['smallint']>;
};

/** order by sum() on columns of table "route.route" */
export type RouteRouteSumOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
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
  LegacyHslMunicipalityCode = 'legacy_hsl_municipality_code',
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
  _append?: InputMaybe<RouteRouteAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<RouteRouteDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<RouteRouteDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<RouteRouteDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<RouteRouteIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<RouteRoutePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<RouteRouteSetInput>;
  /** filter the rows which have to be updated */
  where: RouteRouteBoolExp;
};

/** aggregate var_pop on columns */
export type RouteRouteVarPopFields = {
  __typename?: 'route_route_var_pop_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.route" */
export type RouteRouteVarPopOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type RouteRouteVarSampFields = {
  __typename?: 'route_route_var_samp_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.route" */
export type RouteRouteVarSampOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type RouteRouteVarianceFields = {
  __typename?: 'route_route_variance_fields';
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
  /** The variant for route definition. */
  variant?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.route" */
export type RouteRouteVarianceOrderBy = {
  /** The priority of the route definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<OrderBy>;
  /** The variant for route definition. */
  variant?: InputMaybe<OrderBy>;
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
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

/** Type of line. https://www.transmodel-cen.eu/model/EARoot/EA2/EA1/EA3/EA491.htm */
export type RouteTypeOfLineLinesAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
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
  columns?: InputMaybe<Array<RouteTypeOfLineSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "route.type_of_line". All fields are combined with a logical 'AND'. */
export type RouteTypeOfLineBoolExp = {
  _and?: InputMaybe<Array<RouteTypeOfLineBoolExp>>;
  _not?: InputMaybe<RouteTypeOfLineBoolExp>;
  _or?: InputMaybe<Array<RouteTypeOfLineBoolExp>>;
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnumComparisonExp>;
  lines?: InputMaybe<RouteLineBoolExp>;
  lines_aggregate?: InputMaybe<RouteLineAggregateBoolExp>;
  type_of_line?: InputMaybe<StringComparisonExp>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
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
  _eq?: InputMaybe<RouteTypeOfLineEnum>;
  _in?: InputMaybe<Array<RouteTypeOfLineEnum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<RouteTypeOfLineEnum>;
  _nin?: InputMaybe<Array<RouteTypeOfLineEnum>>;
};

/** input type for inserting data into table "route.type_of_line" */
export type RouteTypeOfLineInsertInput = {
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  lines?: InputMaybe<RouteLineArrRelInsertInput>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeObjRelInsertInput>;
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
  on_conflict?: InputMaybe<RouteTypeOfLineOnConflict>;
};

/** on_conflict condition type for table "route.type_of_line" */
export type RouteTypeOfLineOnConflict = {
  constraint: RouteTypeOfLineConstraint;
  update_columns?: Array<RouteTypeOfLineUpdateColumn>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

/** Ordering options when selecting data from "route.type_of_line". */
export type RouteTypeOfLineOrderBy = {
  belonging_to_vehicle_mode?: InputMaybe<OrderBy>;
  lines_aggregate?: InputMaybe<RouteLineAggregateOrderBy>;
  type_of_line?: InputMaybe<OrderBy>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeOrderBy>;
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
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "route_type_of_line" */
export type RouteTypeOfLineStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: RouteTypeOfLineStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type RouteTypeOfLineStreamCursorValueInput = {
  belonging_to_vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
  /** GTFS route type: https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
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
  _set?: InputMaybe<RouteTypeOfLineSetInput>;
  /** filter the rows which have to be updated */
  where: RouteTypeOfLineBoolExp;
};

export type ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExp = {
  count?: InputMaybe<ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExpCount>;
};

export type ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExpCount = {
  arguments?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  predicate: IntComparisonExp;
};

/** A dummy table that models the results of calculating the lengths of stop intervals from the given journey patterns. The table exists due to the limitations of Hasura and there is no intention to insert anything to it. */
export type ServicePatternDistanceBetweenStopsCalculation = {
  __typename?: 'service_pattern_distance_between_stops_calculation';
  /** The length of the stop interval in metres. */
  distance_in_metres: Scalars['float8'];
  /** The label of the end stop of the stop interval. */
  end_stop_label: Scalars['String'];
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date: Scalars['date'];
  /** The ID of the route related to the journey pattern. */
  route_id: Scalars['uuid'];
  /** The priority of the route related to the journey pattern. */
  route_priority: Scalars['Int'];
  /** The label of the start stop of the stop interval. */
  start_stop_label: Scalars['String'];
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence: Scalars['Int'];
};

/** aggregated selection of "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationAggregate = {
  __typename?: 'service_pattern_distance_between_stops_calculation_aggregate';
  aggregate?: Maybe<ServicePatternDistanceBetweenStopsCalculationAggregateFields>;
  nodes: Array<ServicePatternDistanceBetweenStopsCalculation>;
};

/** aggregate fields of "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationAggregateFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_aggregate_fields';
  avg?: Maybe<ServicePatternDistanceBetweenStopsCalculationAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<ServicePatternDistanceBetweenStopsCalculationMaxFields>;
  min?: Maybe<ServicePatternDistanceBetweenStopsCalculationMinFields>;
  stddev?: Maybe<ServicePatternDistanceBetweenStopsCalculationStddevFields>;
  stddev_pop?: Maybe<ServicePatternDistanceBetweenStopsCalculationStddevPopFields>;
  stddev_samp?: Maybe<ServicePatternDistanceBetweenStopsCalculationStddevSampFields>;
  sum?: Maybe<ServicePatternDistanceBetweenStopsCalculationSumFields>;
  var_pop?: Maybe<ServicePatternDistanceBetweenStopsCalculationVarPopFields>;
  var_samp?: Maybe<ServicePatternDistanceBetweenStopsCalculationVarSampFields>;
  variance?: Maybe<ServicePatternDistanceBetweenStopsCalculationVarianceFields>;
};

/** aggregate fields of "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationAggregateFieldsCountArgs =
  {
    columns?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** aggregate avg on columns */
export type ServicePatternDistanceBetweenStopsCalculationAvgFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_avg_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "service_pattern.distance_between_stops_calculation". All fields are combined with a logical 'AND'. */
export type ServicePatternDistanceBetweenStopsCalculationBoolExp = {
  _and?: InputMaybe<
    Array<ServicePatternDistanceBetweenStopsCalculationBoolExp>
  >;
  _not?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  _or?: InputMaybe<Array<ServicePatternDistanceBetweenStopsCalculationBoolExp>>;
  distance_in_metres?: InputMaybe<Float8ComparisonExp>;
  end_stop_label?: InputMaybe<StringComparisonExp>;
  journey_pattern_id?: InputMaybe<UuidComparisonExp>;
  observation_date?: InputMaybe<DateComparisonExp>;
  route_id?: InputMaybe<UuidComparisonExp>;
  route_priority?: InputMaybe<IntComparisonExp>;
  start_stop_label?: InputMaybe<StringComparisonExp>;
  stop_interval_sequence?: InputMaybe<IntComparisonExp>;
};

/** unique or primary key constraints on table "service_pattern.distance_between_stops_calculation" */
export enum ServicePatternDistanceBetweenStopsCalculationConstraint {
  /** unique or primary key constraint on columns "route_priority", "stop_interval_sequence", "observation_date", "journey_pattern_id" */
  DistanceBetweenStopsCalculationPkey = 'distance_between_stops_calculation_pkey',
}

/** input type for incrementing numeric columns in table "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationIncInput = {
  /** The length of the stop interval in metres. */
  distance_in_metres?: InputMaybe<Scalars['float8']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: InputMaybe<Scalars['Int']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationInsertInput = {
  /** The length of the stop interval in metres. */
  distance_in_metres?: InputMaybe<Scalars['float8']>;
  /** The label of the end stop of the stop interval. */
  end_stop_label?: InputMaybe<Scalars['String']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date?: InputMaybe<Scalars['date']>;
  /** The ID of the route related to the journey pattern. */
  route_id?: InputMaybe<Scalars['uuid']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: InputMaybe<Scalars['Int']>;
  /** The label of the start stop of the stop interval. */
  start_stop_label?: InputMaybe<Scalars['String']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: InputMaybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type ServicePatternDistanceBetweenStopsCalculationMaxFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_max_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['float8']>;
  /** The label of the end stop of the stop interval. */
  end_stop_label?: Maybe<Scalars['String']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date?: Maybe<Scalars['date']>;
  /** The ID of the route related to the journey pattern. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Int']>;
  /** The label of the start stop of the stop interval. */
  start_stop_label?: Maybe<Scalars['String']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Int']>;
};

/** aggregate min on columns */
export type ServicePatternDistanceBetweenStopsCalculationMinFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_min_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['float8']>;
  /** The label of the end stop of the stop interval. */
  end_stop_label?: Maybe<Scalars['String']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date?: Maybe<Scalars['date']>;
  /** The ID of the route related to the journey pattern. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Int']>;
  /** The label of the start stop of the stop interval. */
  start_stop_label?: Maybe<Scalars['String']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Int']>;
};

/** response of any mutation on the table "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationMutationResponse = {
  __typename?: 'service_pattern_distance_between_stops_calculation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<ServicePatternDistanceBetweenStopsCalculation>;
};

/** on_conflict condition type for table "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationOnConflict = {
  constraint: ServicePatternDistanceBetweenStopsCalculationConstraint;
  update_columns?: Array<ServicePatternDistanceBetweenStopsCalculationUpdateColumn>;
  where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
};

/** Ordering options when selecting data from "service_pattern.distance_between_stops_calculation". */
export type ServicePatternDistanceBetweenStopsCalculationOrderBy = {
  distance_in_metres?: InputMaybe<OrderBy>;
  end_stop_label?: InputMaybe<OrderBy>;
  journey_pattern_id?: InputMaybe<OrderBy>;
  observation_date?: InputMaybe<OrderBy>;
  route_id?: InputMaybe<OrderBy>;
  route_priority?: InputMaybe<OrderBy>;
  start_stop_label?: InputMaybe<OrderBy>;
  stop_interval_sequence?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: service_pattern.distance_between_stops_calculation */
export type ServicePatternDistanceBetweenStopsCalculationPkColumnsInput = {
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date: Scalars['date'];
  /** The priority of the route related to the journey pattern. */
  route_priority: Scalars['Int'];
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence: Scalars['Int'];
};

/** select columns of table "service_pattern.distance_between_stops_calculation" */
export enum ServicePatternDistanceBetweenStopsCalculationSelectColumn {
  /** column name */
  DistanceInMetres = 'distance_in_metres',
  /** column name */
  EndStopLabel = 'end_stop_label',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ObservationDate = 'observation_date',
  /** column name */
  RouteId = 'route_id',
  /** column name */
  RoutePriority = 'route_priority',
  /** column name */
  StartStopLabel = 'start_stop_label',
  /** column name */
  StopIntervalSequence = 'stop_interval_sequence',
}

/** input type for updating data in table "service_pattern.distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationSetInput = {
  /** The length of the stop interval in metres. */
  distance_in_metres?: InputMaybe<Scalars['float8']>;
  /** The label of the end stop of the stop interval. */
  end_stop_label?: InputMaybe<Scalars['String']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  /** The observation date for the state of the route related to the journey pattern. */
  observation_date?: InputMaybe<Scalars['date']>;
  /** The ID of the route related to the journey pattern. */
  route_id?: InputMaybe<Scalars['uuid']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: InputMaybe<Scalars['Int']>;
  /** The label of the start stop of the stop interval. */
  start_stop_label?: InputMaybe<Scalars['String']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: InputMaybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type ServicePatternDistanceBetweenStopsCalculationStddevFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_stddev_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type ServicePatternDistanceBetweenStopsCalculationStddevPopFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_stddev_pop_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type ServicePatternDistanceBetweenStopsCalculationStddevSampFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_stddev_samp_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "service_pattern_distance_between_stops_calculation" */
export type ServicePatternDistanceBetweenStopsCalculationStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ServicePatternDistanceBetweenStopsCalculationStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePatternDistanceBetweenStopsCalculationStreamCursorValueInput =
  {
    /** The length of the stop interval in metres. */
    distance_in_metres?: InputMaybe<Scalars['float8']>;
    /** The label of the end stop of the stop interval. */
    end_stop_label?: InputMaybe<Scalars['String']>;
    /** The ID of the journey pattern. */
    journey_pattern_id?: InputMaybe<Scalars['uuid']>;
    /** The observation date for the state of the route related to the journey pattern. */
    observation_date?: InputMaybe<Scalars['date']>;
    /** The ID of the route related to the journey pattern. */
    route_id?: InputMaybe<Scalars['uuid']>;
    /** The priority of the route related to the journey pattern. */
    route_priority?: InputMaybe<Scalars['Int']>;
    /** The label of the start stop of the stop interval. */
    start_stop_label?: InputMaybe<Scalars['String']>;
    /** The sequence number of the stop interval within the journey pattern. */
    stop_interval_sequence?: InputMaybe<Scalars['Int']>;
  };

/** aggregate sum on columns */
export type ServicePatternDistanceBetweenStopsCalculationSumFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_sum_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['float8']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Int']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Int']>;
};

/** update columns of table "service_pattern.distance_between_stops_calculation" */
export enum ServicePatternDistanceBetweenStopsCalculationUpdateColumn {
  /** column name */
  DistanceInMetres = 'distance_in_metres',
  /** column name */
  EndStopLabel = 'end_stop_label',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ObservationDate = 'observation_date',
  /** column name */
  RouteId = 'route_id',
  /** column name */
  RoutePriority = 'route_priority',
  /** column name */
  StartStopLabel = 'start_stop_label',
  /** column name */
  StopIntervalSequence = 'stop_interval_sequence',
}

export type ServicePatternDistanceBetweenStopsCalculationUpdates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationSetInput>;
  /** filter the rows which have to be updated */
  where: ServicePatternDistanceBetweenStopsCalculationBoolExp;
};

/** aggregate var_pop on columns */
export type ServicePatternDistanceBetweenStopsCalculationVarPopFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_var_pop_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type ServicePatternDistanceBetweenStopsCalculationVarSampFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_var_samp_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type ServicePatternDistanceBetweenStopsCalculationVarianceFields = {
  __typename?: 'service_pattern_distance_between_stops_calculation_variance_fields';
  /** The length of the stop interval in metres. */
  distance_in_metres?: Maybe<Scalars['Float']>;
  /** The priority of the route related to the journey pattern. */
  route_priority?: Maybe<Scalars['Float']>;
  /** The sequence number of the stop interval within the journey pattern. */
  stop_interval_sequence?: Maybe<Scalars['Float']>;
};

export type ServicePatternGetDistancesBetweenStopPointsByRoutesArgs = {
  observation_date?: InputMaybe<Scalars['date']>;
  route_ids?: InputMaybe<Scalars['_uuid']>;
};

export type ServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs = {
  include_draft_stops?: InputMaybe<Scalars['Boolean']>;
  journey_pattern_ids?: InputMaybe<Scalars['_uuid']>;
  observation_date?: InputMaybe<Scalars['date']>;
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
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointOtherLabelInstancesAggregateArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointScheduledStopPointInJourneyPatternsArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointScheduledStopPointInJourneyPatternsAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointVehicleModeOnScheduledStopPointArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

/** The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning. */
export type ServicePatternScheduledStopPointVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

/** aggregated selection of "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregate = {
  __typename?: 'service_pattern_scheduled_stop_point_aggregate';
  aggregate?: Maybe<ServicePatternScheduledStopPointAggregateFields>;
  nodes: Array<ServicePatternScheduledStopPoint>;
};

export type ServicePatternScheduledStopPointAggregateBoolExp = {
  count?: InputMaybe<ServicePatternScheduledStopPointAggregateBoolExpCount>;
};

export type ServicePatternScheduledStopPointAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
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
  columns?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAggregateOrderBy = {
  avg?: InputMaybe<ServicePatternScheduledStopPointAvgOrderBy>;
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ServicePatternScheduledStopPointMaxOrderBy>;
  min?: InputMaybe<ServicePatternScheduledStopPointMinOrderBy>;
  stddev?: InputMaybe<ServicePatternScheduledStopPointStddevOrderBy>;
  stddev_pop?: InputMaybe<ServicePatternScheduledStopPointStddevPopOrderBy>;
  stddev_samp?: InputMaybe<ServicePatternScheduledStopPointStddevSampOrderBy>;
  sum?: InputMaybe<ServicePatternScheduledStopPointSumOrderBy>;
  var_pop?: InputMaybe<ServicePatternScheduledStopPointVarPopOrderBy>;
  var_samp?: InputMaybe<ServicePatternScheduledStopPointVarSampOrderBy>;
  variance?: InputMaybe<ServicePatternScheduledStopPointVarianceOrderBy>;
};

/** input type for inserting array relation for remote table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointArrRelInsertInput = {
  data: Array<ServicePatternScheduledStopPointInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<ServicePatternScheduledStopPointOnConflict>;
};

/** aggregate avg on columns */
export type ServicePatternScheduledStopPointAvgFields = {
  __typename?: 'service_pattern_scheduled_stop_point_avg_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointAvgOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type ServicePatternScheduledStopPointBoolExp = {
  _and?: InputMaybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  _not?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  _or?: InputMaybe<Array<ServicePatternScheduledStopPointBoolExp>>;
  closest_point_on_infrastructure_link?: InputMaybe<GeographyComparisonExp>;
  direction?: InputMaybe<InfrastructureNetworkDirectionEnumComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  located_on_infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  located_on_infrastructure_link_id?: InputMaybe<UuidComparisonExp>;
  measured_location?: InputMaybe<GeographyComparisonExp>;
  other_label_instances?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  other_label_instances_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  priority?: InputMaybe<IntComparisonExp>;
  relative_distance_from_infrastructure_link_start?: InputMaybe<Float8ComparisonExp>;
  scheduled_stop_point_id?: InputMaybe<UuidComparisonExp>;
  scheduled_stop_point_in_journey_patterns?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  scheduled_stop_point_in_journey_patterns_aggregate?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateBoolExp>;
  timing_place?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
  timing_place_id?: InputMaybe<UuidComparisonExp>;
  validity_end?: InputMaybe<DateComparisonExp>;
  validity_start?: InputMaybe<DateComparisonExp>;
  vehicle_mode_on_scheduled_stop_point?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  vehicle_mode_on_scheduled_stop_point_aggregate?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExp>;
};

/** unique or primary key constraints on table "service_pattern.scheduled_stop_point" */
export enum ServicePatternScheduledStopPointConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_id" */
  ScheduledStopPointPkey = 'scheduled_stop_point_pkey',
}

export type ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExp =
  {
    count?: InputMaybe<ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExpCount>;
  };

export type ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExpCount =
  {
    arguments?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
    predicate: IntComparisonExp;
  };

/** input type for incrementing numeric columns in table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointIncInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointInsertInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: InfrastructureNetworkDirectionEnum;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label: Scalars['String'];
  located_on_infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkObjRelInsertInput>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id: Scalars['uuid'];
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location: Scalars['geography_point'];
  other_label_instances?: InputMaybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  priority: Scalars['Int'];
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternArrRelInsertInput>;
  timing_place?: InputMaybe<TimingPatternTimingPlaceObjRelInsertInput>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: InputMaybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: InputMaybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: InputMaybe<Scalars['date']>;
  vehicle_mode_on_scheduled_stop_point?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointArrRelInsertInput>;
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
  label?: InputMaybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: InputMaybe<OrderBy>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: InputMaybe<OrderBy>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: InputMaybe<OrderBy>;
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
  label?: InputMaybe<OrderBy>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: InputMaybe<OrderBy>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: InputMaybe<OrderBy>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point". */
export type ServicePatternScheduledStopPointOrderBy = {
  closest_point_on_infrastructure_link?: InputMaybe<OrderBy>;
  direction?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  located_on_infrastructure_link?: InputMaybe<InfrastructureNetworkInfrastructureLinkOrderBy>;
  located_on_infrastructure_link_id?: InputMaybe<OrderBy>;
  measured_location?: InputMaybe<OrderBy>;
  other_label_instances_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  priority?: InputMaybe<OrderBy>;
  relative_distance_from_infrastructure_link_start?: InputMaybe<OrderBy>;
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
  scheduled_stop_point_in_journey_patterns_aggregate?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternAggregateOrderBy>;
  timing_place?: InputMaybe<TimingPatternTimingPlaceOrderBy>;
  timing_place_id?: InputMaybe<OrderBy>;
  validity_end?: InputMaybe<OrderBy>;
  validity_start?: InputMaybe<OrderBy>;
  vehicle_mode_on_scheduled_stop_point_aggregate?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointAggregateOrderBy>;
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
  direction?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: InputMaybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: InputMaybe<Scalars['geography_point']>;
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: InputMaybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: InputMaybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: InputMaybe<Scalars['date']>;
};

/** aggregate stddev on columns */
export type ServicePatternScheduledStopPointStddevFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** aggregate stddev_pop on columns */
export type ServicePatternScheduledStopPointStddevPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevPopOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** aggregate stddev_samp on columns */
export type ServicePatternScheduledStopPointStddevSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointStddevSampOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** Streaming cursor of the table "service_pattern_scheduled_stop_point" */
export type ServicePatternScheduledStopPointStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ServicePatternScheduledStopPointStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePatternScheduledStopPointStreamCursorValueInput = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: InputMaybe<InfrastructureNetworkDirectionEnum>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: InputMaybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: InputMaybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: InputMaybe<Scalars['geography']>;
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
  /** Optional reference to a TIMING PLACE. If NULL, the SCHEDULED STOP POINT is not used for timing. */
  timing_place_id?: InputMaybe<Scalars['uuid']>;
  /** end of the operating date span in the scheduled stop point's local time */
  validity_end?: InputMaybe<Scalars['date']>;
  /** end of the route's operating date span in the route's local time */
  validity_start?: InputMaybe<Scalars['date']>;
};

/** aggregate sum on columns */
export type ServicePatternScheduledStopPointSumFields = {
  __typename?: 'service_pattern_scheduled_stop_point_sum_fields';
  priority?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointSumOrderBy = {
  priority?: InputMaybe<OrderBy>;
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
  _inc?: InputMaybe<ServicePatternScheduledStopPointIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<ServicePatternScheduledStopPointSetInput>;
  /** filter the rows which have to be updated */
  where: ServicePatternScheduledStopPointBoolExp;
};

/** aggregate var_pop on columns */
export type ServicePatternScheduledStopPointVarPopFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_pop_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarPopOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** aggregate var_samp on columns */
export type ServicePatternScheduledStopPointVarSampFields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_samp_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarSampOrderBy = {
  priority?: InputMaybe<OrderBy>;
};

/** aggregate variance on columns */
export type ServicePatternScheduledStopPointVarianceFields = {
  __typename?: 'service_pattern_scheduled_stop_point_variance_fields';
  priority?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "service_pattern.scheduled_stop_point" */
export type ServicePatternScheduledStopPointVarianceOrderBy = {
  priority?: InputMaybe<OrderBy>;
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
  count?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExpCount>;
};

export type ServicePatternVehicleModeOnScheduledStopPointAggregateBoolExpCount =
  {
    arguments?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
    filter?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
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
    columns?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointMaxOrderBy>;
  min?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointMinOrderBy>;
};

/** input type for inserting array relation for remote table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointArrRelInsertInput = {
  data: Array<ServicePatternVehicleModeOnScheduledStopPointInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointOnConflict>;
};

/** Boolean expression to filter rows from the table "service_pattern.vehicle_mode_on_scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type ServicePatternVehicleModeOnScheduledStopPointBoolExp = {
  _and?: InputMaybe<
    Array<ServicePatternVehicleModeOnScheduledStopPointBoolExp>
  >;
  _not?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  _or?: InputMaybe<Array<ServicePatternVehicleModeOnScheduledStopPointBoolExp>>;
  scheduled_stop_point_id?: InputMaybe<UuidComparisonExp>;
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnumComparisonExp>;
};

/** unique or primary key constraints on table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export enum ServicePatternVehicleModeOnScheduledStopPointConstraint {
  /** unique or primary key constraint on columns "scheduled_stop_point_id", "vehicle_mode" */
  ScheduledStopPointServicedByVehicleModePkey = 'scheduled_stop_point_serviced_by_vehicle_mode_pkey',
}

/** input type for inserting data into table "service_pattern.vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointInsertInput = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
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
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
};

/** Ordering options when selecting data from "service_pattern.vehicle_mode_on_scheduled_stop_point". */
export type ServicePatternVehicleModeOnScheduledStopPointOrderBy = {
  scheduled_stop_point_id?: InputMaybe<OrderBy>;
  vehicle_mode?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
};

/** Streaming cursor of the table "service_pattern_vehicle_mode_on_scheduled_stop_point" */
export type ServicePatternVehicleModeOnScheduledStopPointStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: ServicePatternVehicleModeOnScheduledStopPointStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type ServicePatternVehicleModeOnScheduledStopPointStreamCursorValueInput =
  {
    /** The scheduled stop point that is serviced by the vehicle mode. */
    scheduled_stop_point_id?: InputMaybe<Scalars['uuid']>;
    /** The vehicle mode servicing the scheduled stop point. */
    vehicle_mode?: InputMaybe<ReusableComponentsVehicleModeEnum>;
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
  _set?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointSetInput>;
  /** filter the rows which have to be updated */
  where: ServicePatternVehicleModeOnScheduledStopPointBoolExp;
};

/** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
export type SmallintComparisonExp = {
  _eq?: InputMaybe<Scalars['smallint']>;
  _gt?: InputMaybe<Scalars['smallint']>;
  _gte?: InputMaybe<Scalars['smallint']>;
  _in?: InputMaybe<Array<Scalars['smallint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['smallint']>;
  _lte?: InputMaybe<Scalars['smallint']>;
  _neq?: InputMaybe<Scalars['smallint']>;
  _nin?: InputMaybe<Array<Scalars['smallint']>>;
};

export type StDWithinGeographyInput = {
  distance: Scalars['Float'];
  from: Scalars['geography'];
  use_spheroid?: InputMaybe<Scalars['Boolean']>;
};

export type StDWithinInput = {
  distance: Scalars['Float'];
  from: Scalars['geometry'];
};

export type SubscriptionRoot = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "hsl_route.legacy_hsl_municipality_code" */
  hsl_route_legacy_hsl_municipality_code: Array<HslRouteLegacyHslMunicipalityCode>;
  /** fetch aggregated fields from the table: "hsl_route.legacy_hsl_municipality_code" */
  hsl_route_legacy_hsl_municipality_code_aggregate: HslRouteLegacyHslMunicipalityCodeAggregate;
  /** fetch data from the table: "hsl_route.legacy_hsl_municipality_code" using primary key columns */
  hsl_route_legacy_hsl_municipality_code_by_pk?: Maybe<HslRouteLegacyHslMunicipalityCode>;
  /** fetch data from the table in a streaming manner: "hsl_route.legacy_hsl_municipality_code" */
  hsl_route_legacy_hsl_municipality_code_stream: Array<HslRouteLegacyHslMunicipalityCode>;
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
  /** fetch data from the table: "service_pattern.distance_between_stops_calculation" */
  service_pattern_distance_between_stops_calculation: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** fetch aggregated fields from the table: "service_pattern.distance_between_stops_calculation" */
  service_pattern_distance_between_stops_calculation_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
  /** fetch data from the table: "service_pattern.distance_between_stops_calculation" using primary key columns */
  service_pattern_distance_between_stops_calculation_by_pk?: Maybe<ServicePatternDistanceBetweenStopsCalculation>;
  /** fetch data from the table in a streaming manner: "service_pattern.distance_between_stops_calculation" */
  service_pattern_distance_between_stops_calculation_stream: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_by_routes" which returns "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_by_routes: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_by_routes" and query aggregates on result of table type "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_by_routes_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
  /** execute function "service_pattern.get_distances_between_stop_points_in_journey_patterns" which returns "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_in_journey_patterns: Array<ServicePatternDistanceBetweenStopsCalculation>;
  /** execute function "service_pattern.get_distances_between_stop_points_in_journey_patterns" and query aggregates on result of table type "service_pattern.distance_between_stops_calculation" */
  service_pattern_get_distances_between_stop_points_in_journey_patterns_aggregate: ServicePatternDistanceBetweenStopsCalculationAggregate;
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

export type SubscriptionRootHslRouteLegacyHslMunicipalityCodeArgs = {
  distinct_on?: InputMaybe<
    Array<HslRouteLegacyHslMunicipalityCodeSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeOrderBy>>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

export type SubscriptionRootHslRouteLegacyHslMunicipalityCodeAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<HslRouteLegacyHslMunicipalityCodeSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteLegacyHslMunicipalityCodeOrderBy>>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

export type SubscriptionRootHslRouteLegacyHslMunicipalityCodeByPkArgs = {
  hsl_municipality: Scalars['String'];
};

export type SubscriptionRootHslRouteLegacyHslMunicipalityCodeStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<HslRouteLegacyHslMunicipalityCodeStreamCursorInput>>;
  where?: InputMaybe<HslRouteLegacyHslMunicipalityCodeBoolExp>;
};

export type SubscriptionRootHslRouteTransportTargetArgs = {
  distinct_on?: InputMaybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootHslRouteTransportTargetAggregateArgs = {
  distinct_on?: InputMaybe<Array<HslRouteTransportTargetSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<HslRouteTransportTargetOrderBy>>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootHslRouteTransportTargetByPkArgs = {
  transport_target: Scalars['String'];
};

export type SubscriptionRootHslRouteTransportTargetStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<HslRouteTransportTargetStreamCursorInput>>;
  where?: InputMaybe<HslRouteTransportTargetBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionArgs = {
  distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionAggregateArgs = {
  distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkDirectionByPkArgs = {
  value: Scalars['String'];
};

export type SubscriptionRootInfrastructureNetworkDirectionStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<InfrastructureNetworkDirectionStreamCursorInput>>;
  where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkExternalSourceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkExternalSourceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkExternalSourceOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkExternalSourceByPkArgs = {
  value: Scalars['String'];
};

export type SubscriptionRootInfrastructureNetworkExternalSourceStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<
    InputMaybe<InfrastructureNetworkExternalSourceStreamCursorInput>
  >;
  where?: InputMaybe<InfrastructureNetworkExternalSourceBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkFindPointDirectionOnLinkArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkFindPointDirectionOnLinkAggregateArgs =
  {
    args: InfrastructureNetworkFindPointDirectionOnLinkArgs;
    distinct_on?: InputMaybe<Array<InfrastructureNetworkDirectionSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<InfrastructureNetworkDirectionOrderBy>>;
    where?: InputMaybe<InfrastructureNetworkDirectionBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkArgs = {
  distinct_on?: InputMaybe<
    Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<InfrastructureNetworkInfrastructureLinkOrderBy>>;
  where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
};

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkByPkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};

export type SubscriptionRootInfrastructureNetworkInfrastructureLinkStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<InfrastructureNetworkInfrastructureLinkStreamCursorInput>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkResolvePointToClosestLinkArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkResolvePointToClosestLinkAggregateArgs =
  {
    args: InfrastructureNetworkResolvePointToClosestLinkArgs;
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootInfrastructureNetworkVehicleSubmodeOnInfrastructureLinkAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkOrderBy>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
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
      InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkStreamCursorInput>
    >;
    where?: InputMaybe<InfrastructureNetworkVehicleSubmodeOnInfrastructureLinkBoolExp>;
  };

export type SubscriptionRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointAggregateArgs =
  {
    args: JourneyPatternCheckInfraLinkStopRefsWithNewScheduledStopPointArgs;
    distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
    where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternJourneyPatternArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternJourneyPatternAggregateArgs = {
  distinct_on?: InputMaybe<Array<JourneyPatternJourneyPatternSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<JourneyPatternJourneyPatternOrderBy>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternJourneyPatternByPkArgs = {
  journey_pattern_id: Scalars['uuid'];
};

export type SubscriptionRootJourneyPatternJourneyPatternStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<JourneyPatternJourneyPatternStreamCursorInput>>;
  where?: InputMaybe<JourneyPatternJourneyPatternBoolExp>;
};

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type SubscriptionRootJourneyPatternScheduledStopPointInJourneyPatternAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<JourneyPatternScheduledStopPointInJourneyPatternOrderBy>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
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
      InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternStreamCursorInput>
    >;
    where?: InputMaybe<JourneyPatternScheduledStopPointInJourneyPatternBoolExp>;
  };

export type SubscriptionRootReusableComponentsVehicleModeArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleModeAggregateArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleModeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleModeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleModeByPkArgs = {
  vehicle_mode: Scalars['String'];
};

export type SubscriptionRootReusableComponentsVehicleModeStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<ReusableComponentsVehicleModeStreamCursorInput>>;
  where?: InputMaybe<ReusableComponentsVehicleModeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeAggregateArgs = {
  distinct_on?: InputMaybe<Array<ReusableComponentsVehicleSubmodeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ReusableComponentsVehicleSubmodeOrderBy>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootReusableComponentsVehicleSubmodeByPkArgs = {
  vehicle_submode: Scalars['String'];
};

export type SubscriptionRootReusableComponentsVehicleSubmodeStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<ReusableComponentsVehicleSubmodeStreamCursorInput>>;
  where?: InputMaybe<ReusableComponentsVehicleSubmodeBoolExp>;
};

export type SubscriptionRootRouteDirectionArgs = {
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteDirectionAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteDirectionSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteDirectionOrderBy>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteDirectionByPkArgs = {
  direction: Scalars['String'];
};

export type SubscriptionRootRouteDirectionStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RouteDirectionStreamCursorInput>>;
  where?: InputMaybe<RouteDirectionBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<RouteInfrastructureLinkAlongRouteSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteInfrastructureLinkAlongRouteOrderBy>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteByPkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};

export type SubscriptionRootRouteInfrastructureLinkAlongRouteStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RouteInfrastructureLinkAlongRouteStreamCursorInput>>;
  where?: InputMaybe<RouteInfrastructureLinkAlongRouteBoolExp>;
};

export type SubscriptionRootRouteLineArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteLineAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteLineOrderBy>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteLineByPkArgs = {
  line_id: Scalars['uuid'];
};

export type SubscriptionRootRouteLineStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RouteLineStreamCursorInput>>;
  where?: InputMaybe<RouteLineBoolExp>;
};

export type SubscriptionRootRouteRouteArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteRouteAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteRouteSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteRouteOrderBy>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteRouteByPkArgs = {
  route_id: Scalars['uuid'];
};

export type SubscriptionRootRouteRouteStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RouteRouteStreamCursorInput>>;
  where?: InputMaybe<RouteRouteBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineArgs = {
  distinct_on?: InputMaybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteTypeOfLineOrderBy>>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineAggregateArgs = {
  distinct_on?: InputMaybe<Array<RouteTypeOfLineSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<RouteTypeOfLineOrderBy>>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootRouteTypeOfLineByPkArgs = {
  type_of_line: Scalars['String'];
};

export type SubscriptionRootRouteTypeOfLineStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<RouteTypeOfLineStreamCursorInput>>;
  where?: InputMaybe<RouteTypeOfLineBoolExp>;
};

export type SubscriptionRootServicePatternDistanceBetweenStopsCalculationArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternDistanceBetweenStopsCalculationAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternDistanceBetweenStopsCalculationByPkArgs =
  {
    journey_pattern_id: Scalars['uuid'];
    observation_date: Scalars['date'];
    route_priority: Scalars['Int'];
    stop_interval_sequence: Scalars['Int'];
  };

export type SubscriptionRootServicePatternDistanceBetweenStopsCalculationStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<ServicePatternDistanceBetweenStopsCalculationStreamCursorInput>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternGetDistancesBetweenStopPointsByRoutesArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsByRoutesArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternGetDistancesBetweenStopPointsByRoutesAggregateArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsByRoutesArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternGetDistancesBetweenStopPointsInJourneyPatternsAggregateArgs =
  {
    args: ServicePatternGetDistancesBetweenStopPointsInJourneyPatternsArgs;
    distinct_on?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternDistanceBetweenStopsCalculationOrderBy>
    >;
    where?: InputMaybe<ServicePatternDistanceBetweenStopsCalculationBoolExp>;
  };

export type SubscriptionRootServicePatternScheduledStopPointArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternScheduledStopPointAggregateArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternScheduledStopPointByPkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
};

export type SubscriptionRootServicePatternScheduledStopPointStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<ServicePatternScheduledStopPointStreamCursorInput>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type SubscriptionRootServicePatternVehicleModeOnScheduledStopPointAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<ServicePatternVehicleModeOnScheduledStopPointOrderBy>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
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
      InputMaybe<ServicePatternVehicleModeOnScheduledStopPointStreamCursorInput>
    >;
    where?: InputMaybe<ServicePatternVehicleModeOnScheduledStopPointBoolExp>;
  };

export type SubscriptionRootTimingPatternTimingPlaceArgs = {
  distinct_on?: InputMaybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
};

export type SubscriptionRootTimingPatternTimingPlaceAggregateArgs = {
  distinct_on?: InputMaybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimingPatternTimingPlaceOrderBy>>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
};

export type SubscriptionRootTimingPatternTimingPlaceByPkArgs = {
  timing_place_id: Scalars['uuid'];
};

export type SubscriptionRootTimingPatternTimingPlaceStreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<TimingPatternTimingPlaceStreamCursorInput>>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type TimestamptzComparisonExp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
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
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line: Scalars['String'];
  /** An array relationship */
  vehicle_journeys: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** An aggregate relationship */
  vehicle_journeys_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
};

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefScheduledStopPointInJourneyPatternRefsArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefScheduledStopPointInJourneyPatternRefsAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefVehicleJourneysArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** Reference to a given snapshot of a JOURNEY PATTERN for a given operating day. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesJourneyPatternJourneyPatternRefVehicleJourneysAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
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
    columns?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** Boolean expression to filter rows from the table "journey_pattern.journey_pattern_ref". All fields are combined with a logical 'AND'. */
export type TimetablesJourneyPatternJourneyPatternRefBoolExp = {
  _and?: InputMaybe<Array<TimetablesJourneyPatternJourneyPatternRefBoolExp>>;
  _not?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  _or?: InputMaybe<Array<TimetablesJourneyPatternJourneyPatternRefBoolExp>>;
  journey_pattern_id?: InputMaybe<UuidComparisonExp>;
  journey_pattern_ref_id?: InputMaybe<UuidComparisonExp>;
  observation_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  scheduled_stop_point_in_journey_pattern_refs?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  scheduled_stop_point_in_journey_pattern_refs_aggregate?: InputMaybe<ServicePatternScheduledStopPointInJourneyPatternRefAggregateBoolExp>;
  snapshot_timestamp?: InputMaybe<TimestamptzComparisonExp>;
  type_of_line?: InputMaybe<StringComparisonExp>;
  vehicle_journeys?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journeys_aggregate?: InputMaybe<VehicleJourneyVehicleJourneyAggregateBoolExp>;
};

/** unique or primary key constraints on table "journey_pattern.journey_pattern_ref" */
export enum TimetablesJourneyPatternJourneyPatternRefConstraint {
  /** unique or primary key constraint on columns "journey_pattern_ref_id" */
  JourneyPatternRefPkey = 'journey_pattern_ref_pkey',
}

/** input type for inserting data into table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefInsertInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: InputMaybe<Scalars['timestamptz']>;
  scheduled_stop_point_in_journey_pattern_refs?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefArrRelInsertInput>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: InputMaybe<Scalars['timestamptz']>;
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
  vehicle_journeys?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput>;
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
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
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
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: Maybe<Scalars['String']>;
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
  on_conflict?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
};

/** on_conflict condition type for table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefOnConflict = {
  constraint: TimetablesJourneyPatternJourneyPatternRefConstraint;
  update_columns?: Array<TimetablesJourneyPatternJourneyPatternRefUpdateColumn>;
  where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
};

/** Ordering options when selecting data from "journey_pattern.journey_pattern_ref". */
export type TimetablesJourneyPatternJourneyPatternRefOrderBy = {
  journey_pattern_id?: InputMaybe<OrderBy>;
  journey_pattern_ref_id?: InputMaybe<OrderBy>;
  observation_timestamp?: InputMaybe<OrderBy>;
  scheduled_stop_point_in_journey_pattern_refs_aggregate?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateOrderBy>;
  snapshot_timestamp?: InputMaybe<OrderBy>;
  type_of_line?: InputMaybe<OrderBy>;
  vehicle_journeys_aggregate?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy>;
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
  /** column name */
  TypeOfLine = 'type_of_line',
}

/** input type for updating data in table "journey_pattern.journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefSetInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: InputMaybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: InputMaybe<Scalars['timestamptz']>;
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "journey_pattern_journey_pattern_ref" */
export type TimetablesJourneyPatternJourneyPatternRefStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesJourneyPatternJourneyPatternRefStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesJourneyPatternJourneyPatternRefStreamCursorValueInput = {
  /** The ID of the referenced JOURNEY PATTERN */
  journey_pattern_id?: InputMaybe<Scalars['uuid']>;
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** The user-given point of time used to pick one journey pattern (with route and scheduled stop points) among possibly many variants. The selected, unambiguous journey pattern variant is used as a basis for schedule planning. */
  observation_timestamp?: InputMaybe<Scalars['timestamptz']>;
  /** The timestamp when the snapshot was taken */
  snapshot_timestamp?: InputMaybe<Scalars['timestamptz']>;
  /** The type of line (GTFS route type): https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type_of_line?: InputMaybe<Scalars['String']>;
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
  /** column name */
  TypeOfLine = 'type_of_line',
}

export type TimetablesJourneyPatternJourneyPatternRefUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
  /** filter the rows which have to be updated */
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
    columns?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeMaxOrderBy>;
  min?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeMinOrderBy>;
};

/** input type for inserting array relation for remote table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput = {
  data: Array<TimetablesPassingTimesTimetabledPassingTimeInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
};

/** Boolean expression to filter rows from the table "passing_times.timetabled_passing_time". All fields are combined with a logical 'AND'. */
export type TimetablesPassingTimesTimetabledPassingTimeBoolExp = {
  _and?: InputMaybe<Array<TimetablesPassingTimesTimetabledPassingTimeBoolExp>>;
  _not?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  _or?: InputMaybe<Array<TimetablesPassingTimesTimetabledPassingTimeBoolExp>>;
  arrival_time?: InputMaybe<IntervalComparisonExp>;
  departure_time?: InputMaybe<IntervalComparisonExp>;
  passing_time?: InputMaybe<IntervalComparisonExp>;
  scheduled_stop_point_in_journey_pattern_ref?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<UuidComparisonExp>;
  timetabled_passing_time_id?: InputMaybe<UuidComparisonExp>;
  vehicle_journey?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journey_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "passing_times.timetabled_passing_time" */
export enum TimetablesPassingTimesTimetabledPassingTimeConstraint {
  /** unique or primary key constraint on columns "timetabled_passing_time_id" */
  TimetabledPassingTimePkey = 'timetabled_passing_time_pkey',
  /** unique or primary key constraint on columns "vehicle_journey_id", "scheduled_stop_point_in_journey_pattern_ref_id" */
  TimetabledPassingTimeStopPointUniqueIdx = 'timetabled_passing_time_stop_point_unique_idx',
}

/** input type for inserting data into table "passing_times.timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeInsertInput = {
  /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
  arrival_time?: InputMaybe<Scalars['interval']>;
  /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
  departure_time?: InputMaybe<Scalars['interval']>;
  scheduled_stop_point_in_journey_pattern_ref?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefObjRelInsertInput>;
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  timetabled_passing_time_id?: InputMaybe<Scalars['uuid']>;
  vehicle_journey?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyObjRelInsertInput>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
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
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
  timetabled_passing_time_id?: InputMaybe<OrderBy>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: InputMaybe<OrderBy>;
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
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
  timetabled_passing_time_id?: InputMaybe<OrderBy>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
};

/** Ordering options when selecting data from "passing_times.timetabled_passing_time". */
export type TimetablesPassingTimesTimetabledPassingTimeOrderBy = {
  arrival_time?: InputMaybe<OrderBy>;
  departure_time?: InputMaybe<OrderBy>;
  passing_time?: InputMaybe<OrderBy>;
  scheduled_stop_point_in_journey_pattern_ref?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>;
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
  timetabled_passing_time_id?: InputMaybe<OrderBy>;
  vehicle_journey?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyOrderBy>;
  vehicle_journey_id?: InputMaybe<OrderBy>;
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
  arrival_time?: InputMaybe<Scalars['interval']>;
  /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
  departure_time?: InputMaybe<Scalars['interval']>;
  /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
  scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  timetabled_passing_time_id?: InputMaybe<Scalars['uuid']>;
  /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
  vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "passing_times_timetabled_passing_time" */
export type TimetablesPassingTimesTimetabledPassingTimeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesPassingTimesTimetabledPassingTimeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesPassingTimesTimetabledPassingTimeStreamCursorValueInput =
  {
    /** The time when the vehicle arrives to the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the departure time is defined for the passing time. E.g. in case this is the first SCHEDULED STOP POINT of the journey. */
    arrival_time?: InputMaybe<Scalars['interval']>;
    /** The time when the vehicle departs from the SCHEDULED STOP POINT. Measured as interval counted from the midnight of the OPERATING DAY. When NULL, only the arrival time is defined for the passing time. E.g. in case this is the last SCHEDULED STOP POINT of the journey. */
    departure_time?: InputMaybe<Scalars['interval']>;
    /** The time when the vehicle can be considered as passing a SCHEDULED STOP POINT. Computed field to ease development; it can never be NULL. */
    passing_time?: InputMaybe<Scalars['interval']>;
    /** The SCHEDULED STOP POINT of the JOURNEY PATTERN where the vehicle passes */
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<
      Scalars['uuid']
    >;
    timetabled_passing_time_id?: InputMaybe<Scalars['uuid']>;
    /** The VEHICLE JOURNEY to which this TIMETABLED PASSING TIME belongs */
    vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
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
  _set?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
  /** filter the rows which have to be updated */
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
  distinct_on?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
  >;
  where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeActiveOnDaysOfWeekAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
  >;
  where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeVehicleServicesArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** A type of day characterised by one or more properties which affect public transport operation. For example: weekday in school holidays. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:3:299  */
export type TimetablesServiceCalendarDayTypeVehicleServicesAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
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
    columns?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateOrderBy =
  {
    avg?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAvgOrderBy>;
    count?: InputMaybe<OrderBy>;
    max?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMaxOrderBy>;
    min?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekMinOrderBy>;
    stddev?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevOrderBy>;
    stddev_pop?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevPopOrderBy>;
    stddev_samp?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStddevSampOrderBy>;
    sum?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSumOrderBy>;
    var_pop?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarPopOrderBy>;
    var_samp?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarSampOrderBy>;
    variance?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekVarianceOrderBy>;
  };

/** input type for inserting array relation for remote table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekArrRelInsertInput =
  {
    data: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput>;
    /** upsert condition */
    on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
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
  day_of_week?: InputMaybe<OrderBy>;
};

/** Boolean expression to filter rows from the table "service_calendar.day_type_active_on_day_of_week". All fields are combined with a logical 'AND'. */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp = {
  _and?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>
  >;
  _not?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  _or?: InputMaybe<
    Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>
  >;
  day_of_week?: InputMaybe<IntComparisonExp>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  day_type_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "service_calendar.day_type_active_on_day_of_week" */
export enum TimetablesServiceCalendarDayTypeActiveOnDayOfWeekConstraint {
  /** unique or primary key constraint on columns "day_type_id", "day_of_week" */
  DayTypeActiveOnDayOfWeekPkey = 'day_type_active_on_day_of_week_pkey',
}

/** input type for incrementing numeric columns in table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "service_calendar.day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput = {
  /** ISO week day definition (1 = Monday, 7 = Sunday) */
  day_of_week?: InputMaybe<Scalars['Int']>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeObjRelInsertInput>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: InputMaybe<Scalars['uuid']>;
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
  day_of_week?: InputMaybe<OrderBy>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: InputMaybe<OrderBy>;
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
  day_of_week?: InputMaybe<OrderBy>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: InputMaybe<OrderBy>;
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
  where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
};

/** Ordering options when selecting data from "service_calendar.day_type_active_on_day_of_week". */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy = {
  day_of_week?: InputMaybe<OrderBy>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeOrderBy>;
  day_type_id?: InputMaybe<OrderBy>;
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
  day_of_week?: InputMaybe<Scalars['Int']>;
  /** The DAY TYPE for which we define the activeness */
  day_type_id?: InputMaybe<Scalars['uuid']>;
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
  day_of_week?: InputMaybe<OrderBy>;
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
    day_of_week?: InputMaybe<OrderBy>;
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
    day_of_week?: InputMaybe<OrderBy>;
  };

/** Streaming cursor of the table "service_calendar_day_type_active_on_day_of_week" */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorValueInput;
    /** cursor ordering */
    ordering?: InputMaybe<TimetablesCursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorValueInput =
  {
    /** ISO week day definition (1 = Monday, 7 = Sunday) */
    day_of_week?: InputMaybe<Scalars['Int']>;
    /** The DAY TYPE for which we define the activeness */
    day_type_id?: InputMaybe<Scalars['uuid']>;
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
  day_of_week?: InputMaybe<OrderBy>;
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
  _inc?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
  /** filter the rows which have to be updated */
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
  day_of_week?: InputMaybe<OrderBy>;
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
  day_of_week?: InputMaybe<OrderBy>;
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
  day_of_week?: InputMaybe<OrderBy>;
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
  columns?: InputMaybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesServiceCalendarDayTypeAppendInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "service_calendar.day_type". All fields are combined with a logical 'AND'. */
export type TimetablesServiceCalendarDayTypeBoolExp = {
  _and?: InputMaybe<Array<TimetablesServiceCalendarDayTypeBoolExp>>;
  _not?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  _or?: InputMaybe<Array<TimetablesServiceCalendarDayTypeBoolExp>>;
  active_on_days_of_week?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  active_on_days_of_week_aggregate?: InputMaybe<ServiceCalendarDayTypeActiveOnDayOfWeekAggregateBoolExp>;
  day_type_id?: InputMaybe<UuidComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  name_i18n?: InputMaybe<JsonbComparisonExp>;
  vehicle_services?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_services_aggregate?: InputMaybe<VehicleServiceVehicleServiceAggregateBoolExp>;
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
  name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesServiceCalendarDayTypeDeleteElemInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesServiceCalendarDayTypeDeleteKeyInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeInsertInput = {
  active_on_days_of_week?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekArrRelInsertInput>;
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  vehicle_services?: InputMaybe<TimetablesVehicleServiceVehicleServiceArrRelInsertInput>;
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
  on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeOnConflict>;
};

/** on_conflict condition type for table "service_calendar.day_type" */
export type TimetablesServiceCalendarDayTypeOnConflict = {
  constraint: TimetablesServiceCalendarDayTypeConstraint;
  update_columns?: Array<TimetablesServiceCalendarDayTypeUpdateColumn>;
  where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
};

/** Ordering options when selecting data from "service_calendar.day_type". */
export type TimetablesServiceCalendarDayTypeOrderBy = {
  active_on_days_of_week_aggregate?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateOrderBy>;
  day_type_id?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  name_i18n?: InputMaybe<OrderBy>;
  vehicle_services_aggregate?: InputMaybe<TimetablesVehicleServiceVehicleServiceAggregateOrderBy>;
};

/** primary key columns input for table: service_calendar.day_type */
export type TimetablesServiceCalendarDayTypePkColumnsInput = {
  day_type_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesServiceCalendarDayTypePrependInput = {
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
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
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** Streaming cursor of the table "service_calendar_day_type" */
export type TimetablesServiceCalendarDayTypeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesServiceCalendarDayTypeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesServiceCalendarDayTypeStreamCursorValueInput = {
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** The label for the DAY TYPE. Used for identifying the DAY TYPE when importing data from Hastus. Includes both basic (e.g. "Monday-Thursday") and special ("Easter Sunday") day types */
  label?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the DAY TYPE */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
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
  _append?: InputMaybe<TimetablesServiceCalendarDayTypeAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimetablesServiceCalendarDayTypePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesServiceCalendarDayTypeSetInput>;
  /** filter the rows which have to be updated */
  where: TimetablesServiceCalendarDayTypeBoolExp;
};

export type TimetablesServiceCalendarGetActiveDayTypesForDateArgs = {
  observation_date?: InputMaybe<Scalars['date']>;
};

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRef = {
  __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
  /** An object relationship */
  journey_pattern_ref: TimetablesJourneyPatternJourneyPatternRef;
  /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
  journey_pattern_ref_id: Scalars['uuid'];
  scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  scheduled_stop_point_instances: Array<ServicePatternScheduledStopPoint>;
  scheduled_stop_point_instances_aggregate: ServicePatternScheduledStopPointAggregate;
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
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefScheduledStopPointInstancesArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefScheduledStopPointInstancesAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<ServicePatternScheduledStopPointSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
    where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  };

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefTimetabledPassingTimesArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

/** Reference the a SCHEDULED STOP POINT within a JOURNEY PATTERN. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:729  */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefTimetabledPassingTimesAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
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
    columns?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** order by aggregate values of table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateOrderBy =
  {
    avg?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefAvgOrderBy>;
    count?: InputMaybe<OrderBy>;
    max?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMaxOrderBy>;
    min?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefMinOrderBy>;
    stddev?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevOrderBy>;
    stddev_pop?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevPopOrderBy>;
    stddev_samp?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStddevSampOrderBy>;
    sum?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSumOrderBy>;
    var_pop?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarPopOrderBy>;
    var_samp?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarSampOrderBy>;
    variance?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefVarianceOrderBy>;
  };

/** input type for inserting array relation for remote table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefArrRelInsertInput =
  {
    data: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput>;
    /** upsert condition */
    on_conflict?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
  };

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point_in_journey_pattern_ref". All fields are combined with a logical 'AND'. */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp =
  {
    _and?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>
    >;
    _not?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
    _or?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>
    >;
    journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
    journey_pattern_ref_id?: InputMaybe<UuidComparisonExp>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<UuidComparisonExp>;
    scheduled_stop_point_label?: InputMaybe<StringComparisonExp>;
    scheduled_stop_point_sequence?: InputMaybe<IntComparisonExp>;
    timetabled_passing_times?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
    timetabled_passing_times_aggregate?: InputMaybe<PassingTimesTimetabledPassingTimeAggregateBoolExp>;
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
    scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
  };

/** input type for inserting data into table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput =
  {
    journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefObjRelInsertInput>;
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<
      Scalars['uuid']
    >;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
    timetabled_passing_times?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput>;
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
    journey_pattern_ref_id?: InputMaybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: InputMaybe<OrderBy>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    journey_pattern_ref_id?: InputMaybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: InputMaybe<OrderBy>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    on_conflict?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

/** on_conflict condition type for table "service_pattern.scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict =
  {
    constraint: TimetablesServicePatternScheduledStopPointInJourneyPatternRefConstraint;
    update_columns?: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdateColumn>;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point_in_journey_pattern_ref". */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy =
  {
    journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefOrderBy>;
    journey_pattern_ref_id?: InputMaybe<OrderBy>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<OrderBy>;
    scheduled_stop_point_label?: InputMaybe<OrderBy>;
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
    timetabled_passing_times_aggregate?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy>;
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
    journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<
      Scalars['uuid']
    >;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
  };

/** Streaming cursor of the table "service_pattern_scheduled_stop_point_in_journey_pattern_ref" */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorInput =
  {
    /** Stream column input with initial value */
    initial_value: TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorValueInput;
    /** cursor ordering */
    ordering?: InputMaybe<TimetablesCursorOrdering>;
  };

/** Initial value of the column from where the streaming should start */
export type TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorValueInput =
  {
    /** JOURNEY PATTERN to which the SCHEDULED STOP POINT belongs */
    journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
    scheduled_stop_point_in_journey_pattern_ref_id?: InputMaybe<
      Scalars['uuid']
    >;
    /** The label of the SCHEDULED STOP POINT */
    scheduled_stop_point_label?: InputMaybe<Scalars['String']>;
    /** The order of the SCHEDULED STOP POINT within the JOURNEY PATTERN. */
    scheduled_stop_point_sequence?: InputMaybe<Scalars['Int']>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    _inc?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    /** sets the columns of the filtered rows to the given values */
    _set?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    /** filter the rows which have to be updated */
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
    scheduled_stop_point_sequence?: InputMaybe<OrderBy>;
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
  /** delete data from the table: "vehicle_type.vehicle_type" */
  timetables_delete_vehicle_type_vehicle_type?: Maybe<TimetablesVehicleTypeVehicleTypeMutationResponse>;
  /** delete single row from the table: "vehicle_type.vehicle_type" */
  timetables_delete_vehicle_type_vehicle_type_by_pk?: Maybe<TimetablesVehicleTypeVehicleType>;
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
  /** insert data into the table: "vehicle_type.vehicle_type" */
  timetables_insert_vehicle_type_vehicle_type?: Maybe<TimetablesVehicleTypeVehicleTypeMutationResponse>;
  /** insert a single row into the table: "vehicle_type.vehicle_type" */
  timetables_insert_vehicle_type_vehicle_type_one?: Maybe<TimetablesVehicleTypeVehicleType>;
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
  /** update data of the table: "vehicle_type.vehicle_type" */
  timetables_update_vehicle_type_vehicle_type?: Maybe<TimetablesVehicleTypeVehicleTypeMutationResponse>;
  /** update single row of the table: "vehicle_type.vehicle_type" */
  timetables_update_vehicle_type_vehicle_type_by_pk?: Maybe<TimetablesVehicleTypeVehicleType>;
  /** update multiples rows of table: "vehicle_type.vehicle_type" */
  timetables_update_vehicle_type_vehicle_type_many?: Maybe<
    Array<Maybe<TimetablesVehicleTypeVehicleTypeMutationResponse>>
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

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleTypeVehicleTypeArgs =
  {
    where: TimetablesVehicleTypeVehicleTypeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesDeleteVehicleTypeVehicleTypeByPkArgs =
  {
    vehicle_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertJourneyPatternJourneyPatternRefArgs =
  {
    objects: Array<TimetablesJourneyPatternJourneyPatternRefInsertInput>;
    on_conflict?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertJourneyPatternJourneyPatternRefOneArgs =
  {
    object: TimetablesJourneyPatternJourneyPatternRefInsertInput;
    on_conflict?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertPassingTimesTimetabledPassingTimeArgs =
  {
    objects: Array<TimetablesPassingTimesTimetabledPassingTimeInsertInput>;
    on_conflict?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertPassingTimesTimetabledPassingTimeOneArgs =
  {
    object: TimetablesPassingTimesTimetabledPassingTimeInsertInput;
    on_conflict?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeArgs =
  {
    objects: Array<TimetablesServiceCalendarDayTypeInsertInput>;
    on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    objects: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput>;
    on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeActiveOnDayOfWeekOneArgs =
  {
    object: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekInsertInput;
    on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServiceCalendarDayTypeOneArgs =
  {
    object: TimetablesServiceCalendarDayTypeInsertInput;
    on_conflict?: InputMaybe<TimetablesServiceCalendarDayTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    objects: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput>;
    on_conflict?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertServicePatternScheduledStopPointInJourneyPatternRefOneArgs =
  {
    object: TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput;
    on_conflict?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleJourneyVehicleJourneyArgs =
  {
    objects: Array<TimetablesVehicleJourneyVehicleJourneyInsertInput>;
    on_conflict?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleJourneyVehicleJourneyOneArgs =
  {
    object: TimetablesVehicleJourneyVehicleJourneyInsertInput;
    on_conflict?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleScheduleVehicleScheduleFrameArgs =
  {
    objects: Array<TimetablesVehicleScheduleVehicleScheduleFrameInsertInput>;
    on_conflict?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleScheduleVehicleScheduleFrameOneArgs =
  {
    object: TimetablesVehicleScheduleVehicleScheduleFrameInsertInput;
    on_conflict?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceBlockArgs =
  {
    objects: Array<TimetablesVehicleServiceBlockInsertInput>;
    on_conflict?: InputMaybe<TimetablesVehicleServiceBlockOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceBlockOneArgs =
  {
    object: TimetablesVehicleServiceBlockInsertInput;
    on_conflict?: InputMaybe<TimetablesVehicleServiceBlockOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceVehicleServiceArgs =
  {
    objects: Array<TimetablesVehicleServiceVehicleServiceInsertInput>;
    on_conflict?: InputMaybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleServiceVehicleServiceOneArgs =
  {
    object: TimetablesVehicleServiceVehicleServiceInsertInput;
    on_conflict?: InputMaybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleTypeVehicleTypeArgs =
  {
    objects: Array<TimetablesVehicleTypeVehicleTypeInsertInput>;
    on_conflict?: InputMaybe<TimetablesVehicleTypeVehicleTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesInsertVehicleTypeVehicleTypeOneArgs =
  {
    object: TimetablesVehicleTypeVehicleTypeInsertInput;
    on_conflict?: InputMaybe<TimetablesVehicleTypeVehicleTypeOnConflict>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefArgs =
  {
    _set?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
    where: TimetablesJourneyPatternJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefByPkArgs =
  {
    _set?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefSetInput>;
    pk_columns: TimetablesJourneyPatternJourneyPatternRefPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateJourneyPatternJourneyPatternRefManyArgs =
  {
    updates: Array<TimetablesJourneyPatternJourneyPatternRefUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeArgs =
  {
    _set?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
    where: TimetablesPassingTimesTimetabledPassingTimeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeByPkArgs =
  {
    _set?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeSetInput>;
    pk_columns: TimetablesPassingTimesTimetabledPassingTimePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdatePassingTimesTimetabledPassingTimeManyArgs =
  {
    updates: Array<TimetablesPassingTimesTimetabledPassingTimeUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeArgs =
  {
    _append?: InputMaybe<TimetablesServiceCalendarDayTypeAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesServiceCalendarDayTypePrependInput>;
    _set?: InputMaybe<TimetablesServiceCalendarDayTypeSetInput>;
    where: TimetablesServiceCalendarDayTypeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    _inc?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
    _set?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
    where: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    _inc?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekIncInput>;
    _set?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSetInput>;
    pk_columns: TimetablesServiceCalendarDayTypeActiveOnDayOfWeekPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeActiveOnDayOfWeekManyArgs =
  {
    updates: Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeByPkArgs =
  {
    _append?: InputMaybe<TimetablesServiceCalendarDayTypeAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesServiceCalendarDayTypeDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesServiceCalendarDayTypePrependInput>;
    _set?: InputMaybe<TimetablesServiceCalendarDayTypeSetInput>;
    pk_columns: TimetablesServiceCalendarDayTypePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServiceCalendarDayTypeManyArgs =
  {
    updates: Array<TimetablesServiceCalendarDayTypeUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    _inc?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    _set?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    where: TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    _inc?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefIncInput>;
    _set?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSetInput>;
    pk_columns: TimetablesServicePatternScheduledStopPointInJourneyPatternRefPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateServicePatternScheduledStopPointInJourneyPatternRefManyArgs =
  {
    updates: Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyArgs =
  {
    _append?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyPrependInput>;
    _set?: InputMaybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
    where: TimetablesVehicleJourneyVehicleJourneyBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyByPkArgs =
  {
    _append?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyPrependInput>;
    _set?: InputMaybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
    pk_columns: TimetablesVehicleJourneyVehicleJourneyPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleJourneyVehicleJourneyManyArgs =
  {
    updates: Array<TimetablesVehicleJourneyVehicleJourneyUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameArgs =
  {
    _append?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
    _inc?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
    _prepend?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
    _set?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
    where: TimetablesVehicleScheduleVehicleScheduleFrameBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    _append?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
    _inc?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
    _prepend?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
    _set?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
    pk_columns: TimetablesVehicleScheduleVehicleScheduleFramePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleScheduleVehicleScheduleFrameManyArgs =
  {
    updates: Array<TimetablesVehicleScheduleVehicleScheduleFrameUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockArgs =
  {
    _set?: InputMaybe<TimetablesVehicleServiceBlockSetInput>;
    where: TimetablesVehicleServiceBlockBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockByPkArgs =
  {
    _set?: InputMaybe<TimetablesVehicleServiceBlockSetInput>;
    pk_columns: TimetablesVehicleServiceBlockPkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceBlockManyArgs =
  {
    updates: Array<TimetablesVehicleServiceBlockUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceArgs =
  {
    _append?: InputMaybe<TimetablesVehicleServiceVehicleServiceAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesVehicleServiceVehicleServicePrependInput>;
    _set?: InputMaybe<TimetablesVehicleServiceVehicleServiceSetInput>;
    where: TimetablesVehicleServiceVehicleServiceBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceByPkArgs =
  {
    _append?: InputMaybe<TimetablesVehicleServiceVehicleServiceAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteKeyInput>;
    _prepend?: InputMaybe<TimetablesVehicleServiceVehicleServicePrependInput>;
    _set?: InputMaybe<TimetablesVehicleServiceVehicleServiceSetInput>;
    pk_columns: TimetablesVehicleServiceVehicleServicePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleServiceVehicleServiceManyArgs =
  {
    updates: Array<TimetablesVehicleServiceVehicleServiceUpdates>;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleTypeVehicleTypeArgs =
  {
    _append?: InputMaybe<TimetablesVehicleTypeVehicleTypeAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteKeyInput>;
    _inc?: InputMaybe<TimetablesVehicleTypeVehicleTypeIncInput>;
    _prepend?: InputMaybe<TimetablesVehicleTypeVehicleTypePrependInput>;
    _set?: InputMaybe<TimetablesVehicleTypeVehicleTypeSetInput>;
    where: TimetablesVehicleTypeVehicleTypeBoolExp;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleTypeVehicleTypeByPkArgs =
  {
    _append?: InputMaybe<TimetablesVehicleTypeVehicleTypeAppendInput>;
    _delete_at_path?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteAtPathInput>;
    _delete_elem?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteElemInput>;
    _delete_key?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteKeyInput>;
    _inc?: InputMaybe<TimetablesVehicleTypeVehicleTypeIncInput>;
    _prepend?: InputMaybe<TimetablesVehicleTypeVehicleTypePrependInput>;
    _set?: InputMaybe<TimetablesVehicleTypeVehicleTypeSetInput>;
    pk_columns: TimetablesVehicleTypeVehicleTypePkColumnsInput;
  };

export type TimetablesTimetablesMutationFrontendTimetablesUpdateVehicleTypeVehicleTypeManyArgs =
  {
    updates: Array<TimetablesVehicleTypeVehicleTypeUpdates>;
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
  /** fetch data from the table: "vehicle_type.vehicle_type" */
  timetables_vehicle_type_vehicle_type: Array<TimetablesVehicleTypeVehicleType>;
  /** fetch aggregated fields from the table: "vehicle_type.vehicle_type" */
  timetables_vehicle_type_vehicle_type_aggregate: TimetablesVehicleTypeVehicleTypeAggregate;
  /** fetch data from the table: "vehicle_type.vehicle_type" using primary key columns */
  timetables_vehicle_type_vehicle_type_by_pk?: Maybe<TimetablesVehicleTypeVehicleType>;
};

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesJourneyPatternJourneyPatternRefByPkArgs =
  {
    journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesPassingTimesTimetabledPassingTimeByPkArgs =
  {
    timetabled_passing_time_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeArgs = {
  distinct_on?: InputMaybe<Array<TimetablesServiceCalendarDayTypeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
  where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
};

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeActiveOnDayOfWeekByPkArgs =
  {
    day_of_week: Scalars['Int'];
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarDayTypeByPkArgs =
  {
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarGetActiveDayTypesForDateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServiceCalendarGetActiveDayTypesForDateAggregateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleJourneyVehicleJourneyByPkArgs =
  {
    vehicle_journey_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    vehicle_schedule_frame_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockArgs = {
  distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
};

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockAggregateArgs =
  {
    distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceBlockByPkArgs = {
  block_id: Scalars['uuid'];
};

export type TimetablesTimetablesQueryTimetablesVehicleServiceGetVehicleServicesForDateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceGetVehicleServicesForDateAggregateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleServiceVehicleServiceByPkArgs =
  {
    vehicle_service_id: Scalars['uuid'];
  };

export type TimetablesTimetablesQueryTimetablesVehicleTypeVehicleTypeArgs = {
  distinct_on?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeOrderBy>>;
  where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
};

export type TimetablesTimetablesQueryTimetablesVehicleTypeVehicleTypeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleTypeVehicleTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeOrderBy>>;
    where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  };

export type TimetablesTimetablesQueryTimetablesVehicleTypeVehicleTypeByPkArgs =
  {
    vehicle_type_id: Scalars['uuid'];
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
  /** fetch data from the table: "vehicle_type.vehicle_type" */
  timetables_vehicle_type_vehicle_type: Array<TimetablesVehicleTypeVehicleType>;
  /** fetch aggregated fields from the table: "vehicle_type.vehicle_type" */
  timetables_vehicle_type_vehicle_type_aggregate: TimetablesVehicleTypeVehicleTypeAggregate;
  /** fetch data from the table: "vehicle_type.vehicle_type" using primary key columns */
  timetables_vehicle_type_vehicle_type_by_pk?: Maybe<TimetablesVehicleTypeVehicleType>;
  /** fetch data from the table in a streaming manner: "vehicle_type.vehicle_type" */
  timetables_vehicle_type_vehicle_type_stream: Array<TimetablesVehicleTypeVehicleType>;
};

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesJourneyPatternJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefByPkArgs =
  {
    journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesJourneyPatternJourneyPatternRefStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesJourneyPatternJourneyPatternRefStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeByPkArgs =
  {
    timetabled_passing_time_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesPassingTimesTimetabledPassingTimeStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesPassingTimesTimetabledPassingTimeStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeActiveOnDayOfWeekAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekOrderBy>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
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
      InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeActiveOnDayOfWeekBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeByPkArgs =
  {
    day_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarDayTypeStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesServiceCalendarDayTypeStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarGetActiveDayTypesForDateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServiceCalendarGetActiveDayTypesForDateAggregateArgs =
  {
    args: TimetablesServiceCalendarGetActiveDayTypesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesServiceCalendarDayTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesServiceCalendarDayTypeOrderBy>>;
    where?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefOrderBy>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefByPkArgs =
  {
    scheduled_stop_point_in_journey_pattern_ref_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesServicePatternScheduledStopPointInJourneyPatternRefBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyByPkArgs =
  {
    vehicle_journey_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleJourneyVehicleJourneyStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesVehicleJourneyVehicleJourneyStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>
    >;
    where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameByPkArgs =
  {
    vehicle_schedule_frame_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleScheduleVehicleScheduleFrameStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockArgs =
  {
    distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockAggregateArgs =
  {
    distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockByPkArgs =
  {
    block_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceBlockStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<InputMaybe<TimetablesVehicleServiceBlockStreamCursorInput>>;
    where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceGetVehicleServicesForDateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceGetVehicleServicesForDateAggregateArgs =
  {
    args: TimetablesVehicleServiceGetVehicleServicesForDateArgs;
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceByPkArgs =
  {
    vehicle_service_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleServiceVehicleServiceStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesVehicleServiceVehicleServiceStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleTypeVehicleTypeArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleTypeVehicleTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeOrderBy>>;
    where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleTypeVehicleTypeAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleTypeVehicleTypeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeOrderBy>>;
    where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleTypeVehicleTypeByPkArgs =
  {
    vehicle_type_id: Scalars['uuid'];
  };

export type TimetablesTimetablesSubscriptionTimetablesVehicleTypeVehicleTypeStreamArgs =
  {
    batch_size: Scalars['Int'];
    cursor: Array<
      InputMaybe<TimetablesVehicleTypeVehicleTypeStreamCursorInput>
    >;
    where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  };

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourney = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey';
  /** An object relationship */
  block: TimetablesVehicleServiceBlock;
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id: Scalars['uuid'];
  /** Displayed name of the journey. */
  displayed_name?: Maybe<Scalars['String']>;
  /** A computed field, executes function "vehicle_journey.vehicle_journey_end_time" */
  end_time: Scalars['interval'];
  /** Is the journey a backup journey. */
  is_backup_journey: Scalars['Boolean'];
  /** Is the journey an extra journey. */
  is_extra_journey: Scalars['Boolean'];
  /** It is required to use the same vehicle type as required in vehicle service. */
  is_vehicle_type_mandatory: Scalars['Boolean'];
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: Maybe<Scalars['jsonb']>;
  /** An object relationship */
  journey_pattern_ref: TimetablesJourneyPatternJourneyPatternRef;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id: Scalars['uuid'];
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type: Scalars['String'];
  /** LAYOVER TIMEs describe a certain time allowance that may be given at the end of each VEHICLE JOURNEY, before starting the next one, to compensate delays or for other purposes (e.g. rest time for the driver). This “layover time” can be regarded as a buffer time, which may or may not be actually consumed in real time operation. */
  layover_time?: Maybe<Scalars['interval']>;
  /** A computed field, executes function "vehicle_journey.vehicle_journey_start_time" */
  start_time: Scalars['interval'];
  /** An array relationship */
  timetabled_passing_times: Array<TimetablesPassingTimesTimetabledPassingTime>;
  /** An aggregate relationship */
  timetabled_passing_times_aggregate: TimetablesPassingTimesTimetabledPassingTimeAggregate;
  /** Turnaround time is the time taken by a vehicle to proceed from the end of a ROUTE to the start of another. */
  turnaround_time?: Maybe<Scalars['interval']>;
  vehicle_journey_id: Scalars['uuid'];
};

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourneyJourneyNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourneyTimetabledPassingTimesArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<
    Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
  >;
  where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
};

/** The planned movement of a public transport vehicle on a DAY TYPE from the start point to the end point of a JOURNEY PATTERN on a specified ROUTE. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:1:1:831  */
export type TimetablesVehicleJourneyVehicleJourneyTimetabledPassingTimesAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<
      Array<TimetablesPassingTimesTimetabledPassingTimeOrderBy>
    >;
    where?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
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
  columns?: InputMaybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyMaxOrderBy>;
  min?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleJourneyVehicleJourneyAppendInput = {
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput = {
  data: Array<TimetablesVehicleJourneyVehicleJourneyInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_journey.vehicle_journey". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleJourneyVehicleJourneyBoolExp = {
  _and?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyBoolExp>>;
  _not?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  _or?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyBoolExp>>;
  block?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  block_id?: InputMaybe<UuidComparisonExp>;
  displayed_name?: InputMaybe<StringComparisonExp>;
  end_time?: InputMaybe<StringComparisonExp>;
  is_backup_journey?: InputMaybe<BooleanComparisonExp>;
  is_extra_journey?: InputMaybe<BooleanComparisonExp>;
  is_vehicle_type_mandatory?: InputMaybe<BooleanComparisonExp>;
  journey_name_i18n?: InputMaybe<JsonbComparisonExp>;
  journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefBoolExp>;
  journey_pattern_ref_id?: InputMaybe<UuidComparisonExp>;
  journey_type?: InputMaybe<StringComparisonExp>;
  layover_time?: InputMaybe<IntervalComparisonExp>;
  start_time?: InputMaybe<StringComparisonExp>;
  timetabled_passing_times?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeBoolExp>;
  timetabled_passing_times_aggregate?: InputMaybe<PassingTimesTimetabledPassingTimeAggregateBoolExp>;
  turnaround_time?: InputMaybe<IntervalComparisonExp>;
  vehicle_journey_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneyConstraint {
  /** unique or primary key constraint on columns "vehicle_journey_id" */
  VehicleJourneyPkey = 'vehicle_journey_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesVehicleJourneyVehicleJourneyDeleteAtPathInput = {
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesVehicleJourneyVehicleJourneyDeleteElemInput = {
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesVehicleJourneyVehicleJourneyDeleteKeyInput = {
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyInsertInput = {
  block?: InputMaybe<TimetablesVehicleServiceBlockObjRelInsertInput>;
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Displayed name of the journey. */
  displayed_name?: InputMaybe<Scalars['String']>;
  /** Is the journey a backup journey. */
  is_backup_journey?: InputMaybe<Scalars['Boolean']>;
  /** Is the journey an extra journey. */
  is_extra_journey?: InputMaybe<Scalars['Boolean']>;
  /** It is required to use the same vehicle type as required in vehicle service. */
  is_vehicle_type_mandatory?: InputMaybe<Scalars['Boolean']>;
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['jsonb']>;
  journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefObjRelInsertInput>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: InputMaybe<Scalars['String']>;
  /** LAYOVER TIMEs describe a certain time allowance that may be given at the end of each VEHICLE JOURNEY, before starting the next one, to compensate delays or for other purposes (e.g. rest time for the driver). This “layover time” can be regarded as a buffer time, which may or may not be actually consumed in real time operation. */
  layover_time?: InputMaybe<Scalars['interval']>;
  timetabled_passing_times?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeArrRelInsertInput>;
  /** Turnaround time is the time taken by a vehicle to proceed from the end of a ROUTE to the start of another. */
  turnaround_time?: InputMaybe<Scalars['interval']>;
  vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleJourneyVehicleJourneyMaxFields = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_max_fields';
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** Displayed name of the journey. */
  displayed_name?: Maybe<Scalars['String']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: Maybe<Scalars['String']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyMaxOrderBy = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: InputMaybe<OrderBy>;
  /** Displayed name of the journey. */
  displayed_name?: InputMaybe<OrderBy>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: InputMaybe<OrderBy>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: InputMaybe<OrderBy>;
  vehicle_journey_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesVehicleJourneyVehicleJourneyMinFields = {
  __typename?: 'timetables_vehicle_journey_vehicle_journey_min_fields';
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: Maybe<Scalars['uuid']>;
  /** Displayed name of the journey. */
  displayed_name?: Maybe<Scalars['String']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: Maybe<Scalars['uuid']>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: Maybe<Scalars['String']>;
  vehicle_journey_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyMinOrderBy = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: InputMaybe<OrderBy>;
  /** Displayed name of the journey. */
  displayed_name?: InputMaybe<OrderBy>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: InputMaybe<OrderBy>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: InputMaybe<OrderBy>;
  vehicle_journey_id?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyOnConflict>;
};

/** on_conflict condition type for table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyOnConflict = {
  constraint: TimetablesVehicleJourneyVehicleJourneyConstraint;
  update_columns?: Array<TimetablesVehicleJourneyVehicleJourneyUpdateColumn>;
  where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** Ordering options when selecting data from "vehicle_journey.vehicle_journey". */
export type TimetablesVehicleJourneyVehicleJourneyOrderBy = {
  block?: InputMaybe<TimetablesVehicleServiceBlockOrderBy>;
  block_id?: InputMaybe<OrderBy>;
  displayed_name?: InputMaybe<OrderBy>;
  end_time?: InputMaybe<OrderBy>;
  is_backup_journey?: InputMaybe<OrderBy>;
  is_extra_journey?: InputMaybe<OrderBy>;
  is_vehicle_type_mandatory?: InputMaybe<OrderBy>;
  journey_name_i18n?: InputMaybe<OrderBy>;
  journey_pattern_ref?: InputMaybe<TimetablesJourneyPatternJourneyPatternRefOrderBy>;
  journey_pattern_ref_id?: InputMaybe<OrderBy>;
  journey_type?: InputMaybe<OrderBy>;
  layover_time?: InputMaybe<OrderBy>;
  start_time?: InputMaybe<OrderBy>;
  timetabled_passing_times_aggregate?: InputMaybe<TimetablesPassingTimesTimetabledPassingTimeAggregateOrderBy>;
  turnaround_time?: InputMaybe<OrderBy>;
  vehicle_journey_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: vehicle_journey.vehicle_journey */
export type TimetablesVehicleJourneyVehicleJourneyPkColumnsInput = {
  vehicle_journey_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleJourneyVehicleJourneyPrependInput = {
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneySelectColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  DisplayedName = 'displayed_name',
  /** column name */
  IsBackupJourney = 'is_backup_journey',
  /** column name */
  IsExtraJourney = 'is_extra_journey',
  /** column name */
  IsVehicleTypeMandatory = 'is_vehicle_type_mandatory',
  /** column name */
  JourneyNameI18n = 'journey_name_i18n',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  JourneyType = 'journey_type',
  /** column name */
  LayoverTime = 'layover_time',
  /** column name */
  TurnaroundTime = 'turnaround_time',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

/** select "vehicle_journey_vehicle_journey_aggregate_bool_exp_bool_and_arguments_columns" columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneySelectColumnVehicleJourneyVehicleJourneyAggregateBoolExpBoolAndArgumentsColumns {
  /** column name */
  IsBackupJourney = 'is_backup_journey',
  /** column name */
  IsExtraJourney = 'is_extra_journey',
  /** column name */
  IsVehicleTypeMandatory = 'is_vehicle_type_mandatory',
}

/** select "vehicle_journey_vehicle_journey_aggregate_bool_exp_bool_or_arguments_columns" columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneySelectColumnVehicleJourneyVehicleJourneyAggregateBoolExpBoolOrArgumentsColumns {
  /** column name */
  IsBackupJourney = 'is_backup_journey',
  /** column name */
  IsExtraJourney = 'is_extra_journey',
  /** column name */
  IsVehicleTypeMandatory = 'is_vehicle_type_mandatory',
}

/** input type for updating data in table "vehicle_journey.vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneySetInput = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Displayed name of the journey. */
  displayed_name?: InputMaybe<Scalars['String']>;
  /** Is the journey a backup journey. */
  is_backup_journey?: InputMaybe<Scalars['Boolean']>;
  /** Is the journey an extra journey. */
  is_extra_journey?: InputMaybe<Scalars['Boolean']>;
  /** It is required to use the same vehicle type as required in vehicle service. */
  is_vehicle_type_mandatory?: InputMaybe<Scalars['Boolean']>;
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: InputMaybe<Scalars['String']>;
  /** LAYOVER TIMEs describe a certain time allowance that may be given at the end of each VEHICLE JOURNEY, before starting the next one, to compensate delays or for other purposes (e.g. rest time for the driver). This “layover time” can be regarded as a buffer time, which may or may not be actually consumed in real time operation. */
  layover_time?: InputMaybe<Scalars['interval']>;
  /** Turnaround time is the time taken by a vehicle to proceed from the end of a ROUTE to the start of another. */
  turnaround_time?: InputMaybe<Scalars['interval']>;
  vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_journey_vehicle_journey" */
export type TimetablesVehicleJourneyVehicleJourneyStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleJourneyVehicleJourneyStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleJourneyVehicleJourneyStreamCursorValueInput = {
  /** The BLOCK to which this VEHICLE JOURNEY belongs */
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Displayed name of the journey. */
  displayed_name?: InputMaybe<Scalars['String']>;
  /** Is the journey a backup journey. */
  is_backup_journey?: InputMaybe<Scalars['Boolean']>;
  /** Is the journey an extra journey. */
  is_extra_journey?: InputMaybe<Scalars['Boolean']>;
  /** It is required to use the same vehicle type as required in vehicle service. */
  is_vehicle_type_mandatory?: InputMaybe<Scalars['Boolean']>;
  /** Name that user can give to the vehicle journey. */
  journey_name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The JOURNEY PATTERN on which the VEHICLE JOURNEY travels */
  journey_pattern_ref_id?: InputMaybe<Scalars['uuid']>;
  /** STANDARD | DRY_RUN | SERVICE_JOURNEY */
  journey_type?: InputMaybe<Scalars['String']>;
  /** LAYOVER TIMEs describe a certain time allowance that may be given at the end of each VEHICLE JOURNEY, before starting the next one, to compensate delays or for other purposes (e.g. rest time for the driver). This “layover time” can be regarded as a buffer time, which may or may not be actually consumed in real time operation. */
  layover_time?: InputMaybe<Scalars['interval']>;
  /** Turnaround time is the time taken by a vehicle to proceed from the end of a ROUTE to the start of another. */
  turnaround_time?: InputMaybe<Scalars['interval']>;
  vehicle_journey_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_journey.vehicle_journey" */
export enum TimetablesVehicleJourneyVehicleJourneyUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  DisplayedName = 'displayed_name',
  /** column name */
  IsBackupJourney = 'is_backup_journey',
  /** column name */
  IsExtraJourney = 'is_extra_journey',
  /** column name */
  IsVehicleTypeMandatory = 'is_vehicle_type_mandatory',
  /** column name */
  JourneyNameI18n = 'journey_name_i18n',
  /** column name */
  JourneyPatternRefId = 'journey_pattern_ref_id',
  /** column name */
  JourneyType = 'journey_type',
  /** column name */
  LayoverTime = 'layover_time',
  /** column name */
  TurnaroundTime = 'turnaround_time',
  /** column name */
  VehicleJourneyId = 'vehicle_journey_id',
}

export type TimetablesVehicleJourneyVehicleJourneyUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyPrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesVehicleJourneyVehicleJourneySetInput>;
  /** filter the rows which have to be updated */
  where: TimetablesVehicleJourneyVehicleJourneyBoolExp;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrame = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: Maybe<Scalars['jsonb']>;
  /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
  booking_label: Scalars['String'];
  /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
  label: Scalars['String'];
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority: Scalars['Int'];
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end: Scalars['date'];
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start: Scalars['date'];
  vehicle_schedule_frame_id: Scalars['uuid'];
  /** An array relationship */
  vehicle_services: Array<TimetablesVehicleServiceVehicleService>;
  /** An aggregate relationship */
  vehicle_services_aggregate: TimetablesVehicleServiceVehicleServiceAggregate;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameBookingDescriptionI18nArgs =
  {
    path?: InputMaybe<Scalars['String']>;
  };

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameVehicleServicesArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** A coherent set of BLOCKS, COMPOUND BLOCKs, COURSEs of JOURNEY and VEHICLE SCHEDULEs to which the same set of VALIDITY CONDITIONs have been assigned. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:7:2:993  */
export type TimetablesVehicleScheduleVehicleScheduleFrameVehicleServicesAggregateArgs =
  {
    distinct_on?: InputMaybe<
      Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
    >;
    limit?: InputMaybe<Scalars['Int']>;
    offset?: InputMaybe<Scalars['Int']>;
    order_by?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceOrderBy>>;
    where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
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
    columns?: InputMaybe<
      Array<TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn>
    >;
    distinct?: InputMaybe<Scalars['Boolean']>;
  };

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleScheduleVehicleScheduleFrameAppendInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameAvgFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_avg_fields';
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "vehicle_schedule.vehicle_schedule_frame". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleScheduleVehicleScheduleFrameBoolExp = {
  _and?: InputMaybe<
    Array<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>
  >;
  _not?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  _or?: InputMaybe<Array<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>>;
  booking_description_i18n?: InputMaybe<JsonbComparisonExp>;
  booking_label?: InputMaybe<StringComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  name_i18n?: InputMaybe<JsonbComparisonExp>;
  priority?: InputMaybe<IntComparisonExp>;
  validity_end?: InputMaybe<DateComparisonExp>;
  validity_start?: InputMaybe<DateComparisonExp>;
  vehicle_schedule_frame_id?: InputMaybe<UuidComparisonExp>;
  vehicle_services?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_services_aggregate?: InputMaybe<VehicleServiceVehicleServiceAggregateBoolExp>;
};

/** unique or primary key constraints on table "vehicle_schedule.vehicle_schedule_frame" */
export enum TimetablesVehicleScheduleVehicleScheduleFrameConstraint {
  /** unique or primary key constraint on columns "vehicle_schedule_frame_id" */
  VehicleScheduleFramePkey = 'vehicle_schedule_frame_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Array<Scalars['String']>>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['Int']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameIncInput = {
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameInsertInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
  booking_label?: InputMaybe<Scalars['String']>;
  /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
  label?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: InputMaybe<Scalars['date']>;
  vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
  vehicle_services?: InputMaybe<TimetablesVehicleServiceVehicleServiceArrRelInsertInput>;
};

/** aggregate max on columns */
export type TimetablesVehicleScheduleVehicleScheduleFrameMaxFields = {
  __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_max_fields';
  /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
  booking_label?: Maybe<Scalars['String']>;
  /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
  label?: Maybe<Scalars['String']>;
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
  /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
  booking_label?: Maybe<Scalars['String']>;
  /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
  label?: Maybe<Scalars['String']>;
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
  on_conflict?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameOnConflict>;
};

/** on_conflict condition type for table "vehicle_schedule.vehicle_schedule_frame" */
export type TimetablesVehicleScheduleVehicleScheduleFrameOnConflict = {
  constraint: TimetablesVehicleScheduleVehicleScheduleFrameConstraint;
  update_columns?: Array<TimetablesVehicleScheduleVehicleScheduleFrameUpdateColumn>;
  where?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
};

/** Ordering options when selecting data from "vehicle_schedule.vehicle_schedule_frame". */
export type TimetablesVehicleScheduleVehicleScheduleFrameOrderBy = {
  booking_description_i18n?: InputMaybe<OrderBy>;
  booking_label?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  name_i18n?: InputMaybe<OrderBy>;
  priority?: InputMaybe<OrderBy>;
  validity_end?: InputMaybe<OrderBy>;
  validity_start?: InputMaybe<OrderBy>;
  vehicle_schedule_frame_id?: InputMaybe<OrderBy>;
  vehicle_services_aggregate?: InputMaybe<TimetablesVehicleServiceVehicleServiceAggregateOrderBy>;
};

/** primary key columns input for table: vehicle_schedule.vehicle_schedule_frame */
export type TimetablesVehicleScheduleVehicleScheduleFramePkColumnsInput = {
  vehicle_schedule_frame_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleScheduleVehicleScheduleFramePrependInput = {
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "vehicle_schedule.vehicle_schedule_frame" */
export enum TimetablesVehicleScheduleVehicleScheduleFrameSelectColumn {
  /** column name */
  BookingDescriptionI18n = 'booking_description_i18n',
  /** column name */
  BookingLabel = 'booking_label',
  /** column name */
  Label = 'label',
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
  /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
  booking_description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
  booking_label?: InputMaybe<Scalars['String']>;
  /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
  label?: InputMaybe<Scalars['String']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
  priority?: InputMaybe<Scalars['Int']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
  validity_end?: InputMaybe<Scalars['date']>;
  /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
  validity_start?: InputMaybe<Scalars['date']>;
  vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
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
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleScheduleVehicleScheduleFrameStreamCursorValueInput =
  {
    /** Booking description for the vehicle schedule frame. Comes from BookingRecord vsc_booking_desc field from Hastus. */
    booking_description_i18n?: InputMaybe<Scalars['jsonb']>;
    /** Booking label for the vehicle schedule frame. Comes from BookingRecord vsc_booking field from Hastus. */
    booking_label?: InputMaybe<Scalars['String']>;
    /** Label for the vehicle schedule frame. Comes from BookingRecord vsc_name field from Hastus. */
    label?: InputMaybe<Scalars['String']>;
    /** Human-readable name for the VEHICLE SCHEDULE FRAME */
    name_i18n?: InputMaybe<Scalars['jsonb']>;
    /** The priority of the timetable definition. The definition may be overridden by higher priority definitions. */
    priority?: InputMaybe<Scalars['Int']>;
    /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity end. Null if always will be valid. */
    validity_end?: InputMaybe<Scalars['date']>;
    /** OPERATING DAY when the VEHICLE SCHEDULE FRAME validity starts. Null if always has been valid. */
    validity_start?: InputMaybe<Scalars['date']>;
    vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
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
  BookingDescriptionI18n = 'booking_description_i18n',
  /** column name */
  BookingLabel = 'booking_label',
  /** column name */
  Label = 'label',
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
  _append?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFramePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameSetInput>;
  /** filter the rows which have to be updated */
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
  /** Finishing time after end of vehicle service block. */
  finishing_time?: Maybe<Scalars['interval']>;
  /** Preparation time before start of vehicle service block. */
  preparing_time?: Maybe<Scalars['interval']>;
  /** An array relationship */
  vehicle_journeys: Array<TimetablesVehicleJourneyVehicleJourney>;
  /** An aggregate relationship */
  vehicle_journeys_aggregate: TimetablesVehicleJourneyVehicleJourneyAggregate;
  /** An object relationship */
  vehicle_service: TimetablesVehicleServiceVehicleService;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id: Scalars['uuid'];
  /** An object relationship */
  vehicle_type?: Maybe<TimetablesVehicleTypeVehicleType>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: Maybe<Scalars['uuid']>;
};

/** The work of a vehicle from the time it leaves a PARKING POINT after parking until its next return to park at a PARKING POINT. Any subsequent departure from a PARKING POINT after parking marks the start of a new BLOCK. The period of a BLOCK has to be covered by DUTies. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:958  */
export type TimetablesVehicleServiceBlockVehicleJourneysArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
};

/** The work of a vehicle from the time it leaves a PARKING POINT after parking until its next return to park at a PARKING POINT. Any subsequent departure from a PARKING POINT after parking marks the start of a new BLOCK. The period of a BLOCK has to be covered by DUTies. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:958  */
export type TimetablesVehicleServiceBlockVehicleJourneysAggregateArgs = {
  distinct_on?: InputMaybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleJourneyVehicleJourneyOrderBy>>;
  where?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
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
  columns?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TimetablesVehicleServiceBlockMaxOrderBy>;
  min?: InputMaybe<TimetablesVehicleServiceBlockMinOrderBy>;
};

/** input type for inserting array relation for remote table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockArrRelInsertInput = {
  data: Array<TimetablesVehicleServiceBlockInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<TimetablesVehicleServiceBlockOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_service.block". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleServiceBlockBoolExp = {
  _and?: InputMaybe<Array<TimetablesVehicleServiceBlockBoolExp>>;
  _not?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  _or?: InputMaybe<Array<TimetablesVehicleServiceBlockBoolExp>>;
  block_id?: InputMaybe<UuidComparisonExp>;
  finishing_time?: InputMaybe<IntervalComparisonExp>;
  preparing_time?: InputMaybe<IntervalComparisonExp>;
  vehicle_journeys?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  vehicle_journeys_aggregate?: InputMaybe<VehicleJourneyVehicleJourneyAggregateBoolExp>;
  vehicle_service?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  vehicle_service_id?: InputMaybe<UuidComparisonExp>;
  vehicle_type?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  vehicle_type_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_service.block" */
export enum TimetablesVehicleServiceBlockConstraint {
  /** unique or primary key constraint on columns "block_id" */
  BlockPkey = 'block_pkey',
}

/** input type for inserting data into table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockInsertInput = {
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Finishing time after end of vehicle service block. */
  finishing_time?: InputMaybe<Scalars['interval']>;
  /** Preparation time before start of vehicle service block. */
  preparing_time?: InputMaybe<Scalars['interval']>;
  vehicle_journeys?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyArrRelInsertInput>;
  vehicle_service?: InputMaybe<TimetablesVehicleServiceVehicleServiceObjRelInsertInput>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
  vehicle_type?: InputMaybe<TimetablesVehicleTypeVehicleTypeObjRelInsertInput>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleServiceBlockMaxFields = {
  __typename?: 'timetables_vehicle_service_block_max_fields';
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockMaxOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: InputMaybe<OrderBy>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: InputMaybe<OrderBy>;
};

/** aggregate min on columns */
export type TimetablesVehicleServiceBlockMinFields = {
  __typename?: 'timetables_vehicle_service_block_min_fields';
  block_id?: Maybe<Scalars['uuid']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: Maybe<Scalars['uuid']>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockMinOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: InputMaybe<OrderBy>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<TimetablesVehicleServiceBlockOnConflict>;
};

/** on_conflict condition type for table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockOnConflict = {
  constraint: TimetablesVehicleServiceBlockConstraint;
  update_columns?: Array<TimetablesVehicleServiceBlockUpdateColumn>;
  where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** Ordering options when selecting data from "vehicle_service.block". */
export type TimetablesVehicleServiceBlockOrderBy = {
  block_id?: InputMaybe<OrderBy>;
  finishing_time?: InputMaybe<OrderBy>;
  preparing_time?: InputMaybe<OrderBy>;
  vehicle_journeys_aggregate?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyAggregateOrderBy>;
  vehicle_service?: InputMaybe<TimetablesVehicleServiceVehicleServiceOrderBy>;
  vehicle_service_id?: InputMaybe<OrderBy>;
  vehicle_type?: InputMaybe<TimetablesVehicleTypeVehicleTypeOrderBy>;
  vehicle_type_id?: InputMaybe<OrderBy>;
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
  FinishingTime = 'finishing_time',
  /** column name */
  PreparingTime = 'preparing_time',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
  /** column name */
  VehicleTypeId = 'vehicle_type_id',
}

/** input type for updating data in table "vehicle_service.block" */
export type TimetablesVehicleServiceBlockSetInput = {
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Finishing time after end of vehicle service block. */
  finishing_time?: InputMaybe<Scalars['interval']>;
  /** Preparation time before start of vehicle service block. */
  preparing_time?: InputMaybe<Scalars['interval']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_service_block" */
export type TimetablesVehicleServiceBlockStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleServiceBlockStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleServiceBlockStreamCursorValueInput = {
  block_id?: InputMaybe<Scalars['uuid']>;
  /** Finishing time after end of vehicle service block. */
  finishing_time?: InputMaybe<Scalars['interval']>;
  /** Preparation time before start of vehicle service block. */
  preparing_time?: InputMaybe<Scalars['interval']>;
  /** The VEHICLE SERVICE to which this BLOCK belongs. */
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
  /** Reference to vehicle_type.vehicle_type. */
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_service.block" */
export enum TimetablesVehicleServiceBlockUpdateColumn {
  /** column name */
  BlockId = 'block_id',
  /** column name */
  FinishingTime = 'finishing_time',
  /** column name */
  PreparingTime = 'preparing_time',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
  /** column name */
  VehicleTypeId = 'vehicle_type_id',
}

export type TimetablesVehicleServiceBlockUpdates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesVehicleServiceBlockSetInput>;
  /** filter the rows which have to be updated */
  where: TimetablesVehicleServiceBlockBoolExp;
};

export type TimetablesVehicleServiceGetVehicleServicesForDateArgs = {
  observation_date?: InputMaybe<Scalars['date']>;
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
  /** Name for vehicle service. */
  name_i18n?: Maybe<Scalars['jsonb']>;
  /** An object relationship */
  vehicle_schedule_frame: TimetablesVehicleScheduleVehicleScheduleFrame;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id: Scalars['uuid'];
  vehicle_service_id: Scalars['uuid'];
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleServiceBlocksArgs = {
  distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleServiceBlocksAggregateArgs = {
  distinct_on?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<TimetablesVehicleServiceBlockOrderBy>>;
  where?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
};

/** A work plan for a single vehicle for a whole day, planned for a specific DAY TYPE. A VEHICLE SERVICE includes one or several BLOCKs. If there is no service on a given day, it does not include any BLOCKs. Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=3:5:965  */
export type TimetablesVehicleServiceVehicleServiceNameI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
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
  columns?: InputMaybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceAggregateOrderBy = {
  count?: InputMaybe<OrderBy>;
  max?: InputMaybe<TimetablesVehicleServiceVehicleServiceMaxOrderBy>;
  min?: InputMaybe<TimetablesVehicleServiceVehicleServiceMinOrderBy>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleServiceVehicleServiceAppendInput = {
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceArrRelInsertInput = {
  data: Array<TimetablesVehicleServiceVehicleServiceInsertInput>;
  /** upsert condition */
  on_conflict?: InputMaybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
};

/** Boolean expression to filter rows from the table "vehicle_service.vehicle_service". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleServiceVehicleServiceBoolExp = {
  _and?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceBoolExp>>;
  _not?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  _or?: InputMaybe<Array<TimetablesVehicleServiceVehicleServiceBoolExp>>;
  blocks?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  blocks_aggregate?: InputMaybe<VehicleServiceBlockAggregateBoolExp>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeBoolExp>;
  day_type_id?: InputMaybe<UuidComparisonExp>;
  name_i18n?: InputMaybe<JsonbComparisonExp>;
  vehicle_schedule_frame?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameBoolExp>;
  vehicle_schedule_frame_id?: InputMaybe<UuidComparisonExp>;
  vehicle_service_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceConstraint {
  /** unique or primary key constraint on columns "vehicle_service_id" */
  VehicleServicePkey = 'vehicle_service_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesVehicleServiceVehicleServiceDeleteAtPathInput = {
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesVehicleServiceVehicleServiceDeleteElemInput = {
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesVehicleServiceVehicleServiceDeleteKeyInput = {
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceInsertInput = {
  blocks?: InputMaybe<TimetablesVehicleServiceBlockArrRelInsertInput>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeObjRelInsertInput>;
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  vehicle_schedule_frame?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameObjRelInsertInput>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
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
  day_type_id?: InputMaybe<OrderBy>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: InputMaybe<OrderBy>;
  vehicle_service_id?: InputMaybe<OrderBy>;
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
  day_type_id?: InputMaybe<OrderBy>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: InputMaybe<OrderBy>;
  vehicle_service_id?: InputMaybe<OrderBy>;
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
  on_conflict?: InputMaybe<TimetablesVehicleServiceVehicleServiceOnConflict>;
};

/** on_conflict condition type for table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceOnConflict = {
  constraint: TimetablesVehicleServiceVehicleServiceConstraint;
  update_columns?: Array<TimetablesVehicleServiceVehicleServiceUpdateColumn>;
  where?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
};

/** Ordering options when selecting data from "vehicle_service.vehicle_service". */
export type TimetablesVehicleServiceVehicleServiceOrderBy = {
  blocks_aggregate?: InputMaybe<TimetablesVehicleServiceBlockAggregateOrderBy>;
  day_type?: InputMaybe<TimetablesServiceCalendarDayTypeOrderBy>;
  day_type_id?: InputMaybe<OrderBy>;
  name_i18n?: InputMaybe<OrderBy>;
  vehicle_schedule_frame?: InputMaybe<TimetablesVehicleScheduleVehicleScheduleFrameOrderBy>;
  vehicle_schedule_frame_id?: InputMaybe<OrderBy>;
  vehicle_service_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: vehicle_service.vehicle_service */
export type TimetablesVehicleServiceVehicleServicePkColumnsInput = {
  vehicle_service_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleServiceVehicleServicePrependInput = {
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceSelectColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

/** input type for updating data in table "vehicle_service.vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceSetInput = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "vehicle_service_vehicle_service" */
export type TimetablesVehicleServiceVehicleServiceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleServiceVehicleServiceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleServiceVehicleServiceStreamCursorValueInput = {
  /** The DAY TYPE for the VEHICLE SERVICE. */
  day_type_id?: InputMaybe<Scalars['uuid']>;
  /** Name for vehicle service. */
  name_i18n?: InputMaybe<Scalars['jsonb']>;
  /** Human-readable name for the VEHICLE SCHEDULE FRAME */
  vehicle_schedule_frame_id?: InputMaybe<Scalars['uuid']>;
  vehicle_service_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "vehicle_service.vehicle_service" */
export enum TimetablesVehicleServiceVehicleServiceUpdateColumn {
  /** column name */
  DayTypeId = 'day_type_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  VehicleScheduleFrameId = 'vehicle_schedule_frame_id',
  /** column name */
  VehicleServiceId = 'vehicle_service_id',
}

export type TimetablesVehicleServiceVehicleServiceUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<TimetablesVehicleServiceVehicleServiceAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimetablesVehicleServiceVehicleServiceDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimetablesVehicleServiceVehicleServicePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesVehicleServiceVehicleServiceSetInput>;
  /** filter the rows which have to be updated */
  where: TimetablesVehicleServiceVehicleServiceBoolExp;
};

/** The VEHICLE entity is used to describe the physical public transport vehicles available for short-term planning of operations and daily assignment (in contrast to logical vehicles considered for resource planning of operations and daily assignment (in contrast to logical vehicles cplanning). Each VEHICLE shall be classified as of a particular VEHICLE TYPE. */
export type TimetablesVehicleTypeVehicleType = {
  __typename?: 'timetables_vehicle_type_vehicle_type';
  /** Description of the vehicle type. */
  description_i18n?: Maybe<Scalars['jsonb']>;
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id: Scalars['smallint'];
  /** Label of the vehicle type. */
  label: Scalars['String'];
  vehicle_type_id: Scalars['uuid'];
};

/** The VEHICLE entity is used to describe the physical public transport vehicles available for short-term planning of operations and daily assignment (in contrast to logical vehicles considered for resource planning of operations and daily assignment (in contrast to logical vehicles cplanning). Each VEHICLE shall be classified as of a particular VEHICLE TYPE. */
export type TimetablesVehicleTypeVehicleTypeDescriptionI18nArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeAggregate = {
  __typename?: 'timetables_vehicle_type_vehicle_type_aggregate';
  aggregate?: Maybe<TimetablesVehicleTypeVehicleTypeAggregateFields>;
  nodes: Array<TimetablesVehicleTypeVehicleType>;
};

/** aggregate fields of "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeAggregateFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_aggregate_fields';
  avg?: Maybe<TimetablesVehicleTypeVehicleTypeAvgFields>;
  count: Scalars['Int'];
  max?: Maybe<TimetablesVehicleTypeVehicleTypeMaxFields>;
  min?: Maybe<TimetablesVehicleTypeVehicleTypeMinFields>;
  stddev?: Maybe<TimetablesVehicleTypeVehicleTypeStddevFields>;
  stddev_pop?: Maybe<TimetablesVehicleTypeVehicleTypeStddevPopFields>;
  stddev_samp?: Maybe<TimetablesVehicleTypeVehicleTypeStddevSampFields>;
  sum?: Maybe<TimetablesVehicleTypeVehicleTypeSumFields>;
  var_pop?: Maybe<TimetablesVehicleTypeVehicleTypeVarPopFields>;
  var_samp?: Maybe<TimetablesVehicleTypeVehicleTypeVarSampFields>;
  variance?: Maybe<TimetablesVehicleTypeVehicleTypeVarianceFields>;
};

/** aggregate fields of "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeAggregateFieldsCountArgs = {
  columns?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleTypeVehicleTypeAppendInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate avg on columns */
export type TimetablesVehicleTypeVehicleTypeAvgFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_avg_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "vehicle_type.vehicle_type". All fields are combined with a logical 'AND'. */
export type TimetablesVehicleTypeVehicleTypeBoolExp = {
  _and?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeBoolExp>>;
  _not?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
  _or?: InputMaybe<Array<TimetablesVehicleTypeVehicleTypeBoolExp>>;
  description_i18n?: InputMaybe<JsonbComparisonExp>;
  hsl_id?: InputMaybe<SmallintComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  vehicle_type_id?: InputMaybe<UuidComparisonExp>;
};

/** unique or primary key constraints on table "vehicle_type.vehicle_type" */
export enum TimetablesVehicleTypeVehicleTypeConstraint {
  /** unique or primary key constraint on columns "hsl_id" */
  VehicleTypeHslIdIdx = 'vehicle_type_hsl_id_idx',
  /** unique or primary key constraint on columns "label" */
  VehicleTypeLabelIdx = 'vehicle_type_label_idx',
  /** unique or primary key constraint on columns "vehicle_type_id" */
  VehicleTypePkey = 'vehicle_type_pkey',
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type TimetablesVehicleTypeVehicleTypeDeleteAtPathInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimetablesVehicleTypeVehicleTypeDeleteElemInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimetablesVehicleTypeVehicleTypeDeleteKeyInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['String']>;
};

/** input type for incrementing numeric columns in table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeIncInput = {
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: InputMaybe<Scalars['smallint']>;
};

/** input type for inserting data into table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeInsertInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: InputMaybe<Scalars['smallint']>;
  /** Label of the vehicle type. */
  label?: InputMaybe<Scalars['String']>;
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type TimetablesVehicleTypeVehicleTypeMaxFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_max_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['smallint']>;
  /** Label of the vehicle type. */
  label?: Maybe<Scalars['String']>;
  vehicle_type_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type TimetablesVehicleTypeVehicleTypeMinFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_min_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['smallint']>;
  /** Label of the vehicle type. */
  label?: Maybe<Scalars['String']>;
  vehicle_type_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeMutationResponse = {
  __typename?: 'timetables_vehicle_type_vehicle_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<TimetablesVehicleTypeVehicleType>;
};

/** input type for inserting object relation for remote table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeObjRelInsertInput = {
  data: TimetablesVehicleTypeVehicleTypeInsertInput;
  /** upsert condition */
  on_conflict?: InputMaybe<TimetablesVehicleTypeVehicleTypeOnConflict>;
};

/** on_conflict condition type for table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeOnConflict = {
  constraint: TimetablesVehicleTypeVehicleTypeConstraint;
  update_columns?: Array<TimetablesVehicleTypeVehicleTypeUpdateColumn>;
  where?: InputMaybe<TimetablesVehicleTypeVehicleTypeBoolExp>;
};

/** Ordering options when selecting data from "vehicle_type.vehicle_type". */
export type TimetablesVehicleTypeVehicleTypeOrderBy = {
  description_i18n?: InputMaybe<OrderBy>;
  hsl_id?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  vehicle_type_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: vehicle_type.vehicle_type */
export type TimetablesVehicleTypeVehicleTypePkColumnsInput = {
  vehicle_type_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimetablesVehicleTypeVehicleTypePrependInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "vehicle_type.vehicle_type" */
export enum TimetablesVehicleTypeVehicleTypeSelectColumn {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  HslId = 'hsl_id',
  /** column name */
  Label = 'label',
  /** column name */
  VehicleTypeId = 'vehicle_type_id',
}

/** input type for updating data in table "vehicle_type.vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeSetInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: InputMaybe<Scalars['smallint']>;
  /** Label of the vehicle type. */
  label?: InputMaybe<Scalars['String']>;
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type TimetablesVehicleTypeVehicleTypeStddevFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_stddev_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type TimetablesVehicleTypeVehicleTypeStddevPopFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_stddev_pop_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type TimetablesVehicleTypeVehicleTypeStddevSampFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_stddev_samp_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "vehicle_type_vehicle_type" */
export type TimetablesVehicleTypeVehicleTypeStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimetablesVehicleTypeVehicleTypeStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<TimetablesCursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimetablesVehicleTypeVehicleTypeStreamCursorValueInput = {
  /** Description of the vehicle type. */
  description_i18n?: InputMaybe<Scalars['jsonb']>;
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: InputMaybe<Scalars['smallint']>;
  /** Label of the vehicle type. */
  label?: InputMaybe<Scalars['String']>;
  vehicle_type_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate sum on columns */
export type TimetablesVehicleTypeVehicleTypeSumFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_sum_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['smallint']>;
};

/** update columns of table "vehicle_type.vehicle_type" */
export enum TimetablesVehicleTypeVehicleTypeUpdateColumn {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  HslId = 'hsl_id',
  /** column name */
  Label = 'label',
  /** column name */
  VehicleTypeId = 'vehicle_type_id',
}

export type TimetablesVehicleTypeVehicleTypeUpdates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<TimetablesVehicleTypeVehicleTypeAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimetablesVehicleTypeVehicleTypeDeleteKeyInput>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<TimetablesVehicleTypeVehicleTypeIncInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimetablesVehicleTypeVehicleTypePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimetablesVehicleTypeVehicleTypeSetInput>;
  /** filter the rows which have to be updated */
  where: TimetablesVehicleTypeVehicleTypeBoolExp;
};

/** aggregate var_pop on columns */
export type TimetablesVehicleTypeVehicleTypeVarPopFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_var_pop_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type TimetablesVehicleTypeVehicleTypeVarSampFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_var_samp_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type TimetablesVehicleTypeVehicleTypeVarianceFields = {
  __typename?: 'timetables_vehicle_type_vehicle_type_variance_fields';
  /** ID used in Hastus to represent the vehicle type. */
  hsl_id?: Maybe<Scalars['Float']>;
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
  path?: InputMaybe<Scalars['String']>;
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlaceScheduledStopPointsArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
};

/** A set of SCHEDULED STOP POINTs against which the timing information necessary to build schedules may be recorded. In HSL context this is "Hastus paikka". Based on Transmodel entity TIMING POINT: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:2:709  */
export type TimingPatternTimingPlaceScheduledStopPointsAggregateArgs = {
  distinct_on?: InputMaybe<Array<ServicePatternScheduledStopPointSelectColumn>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<ServicePatternScheduledStopPointOrderBy>>;
  where?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
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
  columns?: InputMaybe<Array<TimingPatternTimingPlaceSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type TimingPatternTimingPlaceAppendInput = {
  description?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "timing_pattern.timing_place". All fields are combined with a logical 'AND'. */
export type TimingPatternTimingPlaceBoolExp = {
  _and?: InputMaybe<Array<TimingPatternTimingPlaceBoolExp>>;
  _not?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
  _or?: InputMaybe<Array<TimingPatternTimingPlaceBoolExp>>;
  description?: InputMaybe<JsonbComparisonExp>;
  label?: InputMaybe<StringComparisonExp>;
  scheduled_stop_points?: InputMaybe<ServicePatternScheduledStopPointBoolExp>;
  scheduled_stop_points_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateBoolExp>;
  timing_place_id?: InputMaybe<UuidComparisonExp>;
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
  description?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type TimingPatternTimingPlaceDeleteElemInput = {
  description?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type TimingPatternTimingPlaceDeleteKeyInput = {
  description?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceInsertInput = {
  description?: InputMaybe<Scalars['jsonb']>;
  label?: InputMaybe<Scalars['String']>;
  scheduled_stop_points?: InputMaybe<ServicePatternScheduledStopPointArrRelInsertInput>;
  timing_place_id?: InputMaybe<Scalars['uuid']>;
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
  on_conflict?: InputMaybe<TimingPatternTimingPlaceOnConflict>;
};

/** on_conflict condition type for table "timing_pattern.timing_place" */
export type TimingPatternTimingPlaceOnConflict = {
  constraint: TimingPatternTimingPlaceConstraint;
  update_columns?: Array<TimingPatternTimingPlaceUpdateColumn>;
  where?: InputMaybe<TimingPatternTimingPlaceBoolExp>;
};

/** Ordering options when selecting data from "timing_pattern.timing_place". */
export type TimingPatternTimingPlaceOrderBy = {
  description?: InputMaybe<OrderBy>;
  label?: InputMaybe<OrderBy>;
  scheduled_stop_points_aggregate?: InputMaybe<ServicePatternScheduledStopPointAggregateOrderBy>;
  timing_place_id?: InputMaybe<OrderBy>;
};

/** primary key columns input for table: timing_pattern.timing_place */
export type TimingPatternTimingPlacePkColumnsInput = {
  timing_place_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type TimingPatternTimingPlacePrependInput = {
  description?: InputMaybe<Scalars['jsonb']>;
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
  description?: InputMaybe<Scalars['jsonb']>;
  label?: InputMaybe<Scalars['String']>;
  timing_place_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "timing_pattern_timing_place" */
export type TimingPatternTimingPlaceStreamCursorInput = {
  /** Stream column input with initial value */
  initial_value: TimingPatternTimingPlaceStreamCursorValueInput;
  /** cursor ordering */
  ordering?: InputMaybe<CursorOrdering>;
};

/** Initial value of the column from where the streaming should start */
export type TimingPatternTimingPlaceStreamCursorValueInput = {
  description?: InputMaybe<Scalars['jsonb']>;
  label?: InputMaybe<Scalars['String']>;
  timing_place_id?: InputMaybe<Scalars['uuid']>;
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
  _append?: InputMaybe<TimingPatternTimingPlaceAppendInput>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<TimingPatternTimingPlaceDeleteAtPathInput>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<TimingPatternTimingPlaceDeleteElemInput>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<TimingPatternTimingPlaceDeleteKeyInput>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<TimingPatternTimingPlacePrependInput>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<TimingPatternTimingPlaceSetInput>;
  /** filter the rows which have to be updated */
  where: TimingPatternTimingPlaceBoolExp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type UuidComparisonExp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type ValidityPeriod = {
  validity_end?: Maybe<Scalars['date']>;
  validity_start?: Maybe<Scalars['date']>;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExp = {
  bool_and?: InputMaybe<VehicleJourneyVehicleJourneyAggregateBoolExpBoolAnd>;
  bool_or?: InputMaybe<VehicleJourneyVehicleJourneyAggregateBoolExpBoolOr>;
  count?: InputMaybe<VehicleJourneyVehicleJourneyAggregateBoolExpCount>;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExpBoolAnd = {
  arguments: TimetablesVehicleJourneyVehicleJourneySelectColumnVehicleJourneyVehicleJourneyAggregateBoolExpBoolAndArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  predicate: BooleanComparisonExp;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExpBoolOr = {
  arguments: TimetablesVehicleJourneyVehicleJourneySelectColumnVehicleJourneyVehicleJourneyAggregateBoolExpBoolOrArgumentsColumns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  predicate: BooleanComparisonExp;
};

export type VehicleJourneyVehicleJourneyAggregateBoolExpCount = {
  arguments?: InputMaybe<
    Array<TimetablesVehicleJourneyVehicleJourneySelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesVehicleJourneyVehicleJourneyBoolExp>;
  predicate: IntComparisonExp;
};

export type VehicleServiceBlockAggregateBoolExp = {
  count?: InputMaybe<VehicleServiceBlockAggregateBoolExpCount>;
};

export type VehicleServiceBlockAggregateBoolExpCount = {
  arguments?: InputMaybe<Array<TimetablesVehicleServiceBlockSelectColumn>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesVehicleServiceBlockBoolExp>;
  predicate: IntComparisonExp;
};

export type VehicleServiceVehicleServiceAggregateBoolExp = {
  count?: InputMaybe<VehicleServiceVehicleServiceAggregateBoolExpCount>;
};

export type VehicleServiceVehicleServiceAggregateBoolExpCount = {
  arguments?: InputMaybe<
    Array<TimetablesVehicleServiceVehicleServiceSelectColumn>
  >;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<TimetablesVehicleServiceVehicleServiceBoolExp>;
  predicate: IntComparisonExp;
};

export type InsertLinesMutationVariables = Exact<{
  objects: Array<RouteLineInsertInput> | RouteLineInsertInput;
}>;

export type InsertLinesMutation = {
  __typename?: 'mutation_root';
  insert_route_line?: {
    __typename?: 'route_line_mutation_response';
    returning: Array<{
      __typename?: 'route_line';
      line_id: UUID;
      label: string;
      priority: number;
      primary_vehicle_mode: ReusableComponentsVehicleModeEnum;
      transport_target: HslRouteTransportTargetEnum;
      validity_start?: luxon.DateTime | null;
      validity_end?: luxon.DateTime | null;
    }>;
  } | null;
};

export type InsertRoutesMutationVariables = Exact<{
  objects: Array<RouteRouteInsertInput> | RouteRouteInsertInput;
}>;

export type InsertRoutesMutation = {
  __typename?: 'mutation_root';
  insert_route_route?: {
    __typename?: 'route_route_mutation_response';
    returning: Array<{
      __typename?: 'route_route';
      route_id: UUID;
      name_i18n: LocalizedString;
      description_i18n?: LocalizedString | null;
      origin_name_i18n: LocalizedString;
      origin_short_name_i18n: LocalizedString;
      destination_name_i18n: LocalizedString;
      destination_short_name_i18n: LocalizedString;
      route_shape?: GeoJSON.LineString | null;
      on_line_id: UUID;
      validity_start?: luxon.DateTime | null;
      validity_end?: luxon.DateTime | null;
      priority: number;
      label: string;
      direction: RouteDirectionEnum;
    }>;
  } | null;
};

export type DeleteRoutesMutationVariables = Exact<{
  route_id: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type DeleteRoutesMutation = {
  __typename?: 'mutation_root';
  delete_route_route?: {
    __typename?: 'route_route_mutation_response';
    returning: Array<{ __typename?: 'route_route'; route_id: UUID }>;
  } | null;
};

export type RemoveLinesMutationVariables = Exact<{
  line_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveLinesMutation = {
  __typename?: 'mutation_root';
  delete_route_line?: {
    __typename?: 'route_line_mutation_response';
    returning: Array<{ __typename?: 'route_line'; line_id: UUID }>;
  } | null;
};

export type InsertTimingPlacesMutationVariables = Exact<{
  objects:
    | Array<TimingPatternTimingPlaceInsertInput>
    | TimingPatternTimingPlaceInsertInput;
}>;

export type InsertTimingPlacesMutation = {
  __typename?: 'mutation_root';
  insert_timing_pattern_timing_place?: {
    __typename?: 'timing_pattern_timing_place_mutation_response';
    returning: Array<{
      __typename?: 'timing_pattern_timing_place';
      description?: any | null;
      label: string;
      timing_place_id: UUID;
    }>;
  } | null;
};

export type RemoveTimingPlacesMutationVariables = Exact<{
  timing_place_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveTimingPlacesMutation = {
  __typename?: 'mutation_root';
  delete_timing_pattern_timing_place?: {
    __typename?: 'timing_pattern_timing_place_mutation_response';
    returning: Array<{
      __typename?: 'timing_pattern_timing_place';
      timing_place_id: UUID;
    }>;
  } | null;
};

export type InsertStopsMutationVariables = Exact<{
  objects:
    | Array<ServicePatternScheduledStopPointInsertInput>
    | ServicePatternScheduledStopPointInsertInput;
}>;

export type InsertStopsMutation = {
  __typename?: 'mutation_root';
  insert_service_pattern_scheduled_stop_point?: {
    __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
    returning: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      scheduled_stop_point_id: UUID;
      located_on_infrastructure_link_id: UUID;
      direction: InfrastructureNetworkDirectionEnum;
      priority: number;
      measured_location: GeoJSON.Point;
      label: string;
      validity_start?: luxon.DateTime | null;
      validity_end?: luxon.DateTime | null;
    }>;
  } | null;
};

export type RemoveStopsMutationVariables = Exact<{
  stop_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveStopsMutation = {
  __typename?: 'mutation_root';
  delete_service_pattern_scheduled_stop_point?: {
    __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
    returning: Array<{
      __typename?: 'service_pattern_scheduled_stop_point';
      scheduled_stop_point_id: UUID;
    }>;
  } | null;
};

export type InsertInfraLinksMutationVariables = Exact<{
  objects:
    | Array<InfrastructureNetworkInfrastructureLinkInsertInput>
    | InfrastructureNetworkInfrastructureLinkInsertInput;
}>;

export type InsertInfraLinksMutation = {
  __typename?: 'mutation_root';
  insert_infrastructure_network_infrastructure_link?: {
    __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
    returning: Array<{
      __typename?: 'infrastructure_network_infrastructure_link';
      infrastructure_link_id: UUID;
    }>;
  } | null;
};

export type RemoveInfraLinksMutationVariables = Exact<{
  infra_links_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveInfraLinksMutation = {
  __typename?: 'mutation_root';
  delete_infrastructure_network_infrastructure_link?: {
    __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
    returning: Array<{
      __typename?: 'infrastructure_network_infrastructure_link';
      infrastructure_link_id: UUID;
    }>;
  } | null;
};

export type InsertInfraLinksAlongRouteMutationVariables = Exact<{
  objects:
    | Array<RouteInfrastructureLinkAlongRouteInsertInput>
    | RouteInfrastructureLinkAlongRouteInsertInput;
}>;

export type InsertInfraLinksAlongRouteMutation = {
  __typename?: 'mutation_root';
  insert_route_infrastructure_link_along_route?: {
    __typename?: 'route_infrastructure_link_along_route_mutation_response';
    returning: Array<{
      __typename?: 'route_infrastructure_link_along_route';
      infrastructure_link_id: UUID;
    }>;
  } | null;
};

export type RemoveInfraLinksAlongRouteMutationVariables = Exact<{
  infra_links_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveInfraLinksAlongRouteMutation = {
  __typename?: 'mutation_root';
  delete_route_infrastructure_link_along_route?: {
    __typename?: 'route_infrastructure_link_along_route_mutation_response';
    returning: Array<{
      __typename?: 'route_infrastructure_link_along_route';
      infrastructure_link_id: UUID;
    }>;
  } | null;
};

export type InsertJourneyPatternsMutationVariables = Exact<{
  objects:
    | Array<JourneyPatternJourneyPatternInsertInput>
    | JourneyPatternJourneyPatternInsertInput;
}>;

export type InsertJourneyPatternsMutation = {
  __typename?: 'mutation_root';
  insert_journey_pattern_journey_pattern?: {
    __typename?: 'journey_pattern_journey_pattern_mutation_response';
    returning: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
    }>;
  } | null;
};

export type RemoveJourneyPatternsMutationVariables = Exact<{
  journey_pattern_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveJourneyPatternsMutation = {
  __typename?: 'mutation_root';
  delete_journey_pattern_journey_pattern?: {
    __typename?: 'journey_pattern_journey_pattern_mutation_response';
    returning: Array<{
      __typename?: 'journey_pattern_journey_pattern';
      journey_pattern_id: UUID;
    }>;
  } | null;
};

export type InsertStopsInJourneyPatternMutationVariables = Exact<{
  objects:
    | Array<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>
    | JourneyPatternScheduledStopPointInJourneyPatternInsertInput;
}>;

export type InsertStopsInJourneyPatternMutation = {
  __typename?: 'mutation_root';
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?: {
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
    returning: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
    }>;
  } | null;
};

export type RemoveStopsInJourneyPatternMutationVariables = Exact<{
  journey_pattern_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveStopsInJourneyPatternMutation = {
  __typename?: 'mutation_root';
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?: {
    __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
    returning: Array<{
      __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
      journey_pattern_id: UUID;
    }>;
  } | null;
};

export type InsertTimetablesJourneyPatternRefMutationVariables = Exact<{
  objects:
    | Array<TimetablesJourneyPatternJourneyPatternRefInsertInput>
    | TimetablesJourneyPatternJourneyPatternRefInsertInput;
}>;

export type InsertTimetablesJourneyPatternRefMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_journey_pattern_journey_pattern_ref?: {
      __typename?: 'timetables_journey_pattern_journey_pattern_ref_mutation_response';
      returning: Array<{
        __typename?: 'timetables_journey_pattern_journey_pattern_ref';
        journey_pattern_id: UUID;
        journey_pattern_ref_id: UUID;
      }>;
    } | null;
  } | null;
};

export type RemoveTimetablesJourneyPatternRefsMutationVariables = Exact<{
  journey_pattern_ref_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveTimetablesJourneyPatternRefsMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_journey_pattern_journey_pattern_ref?: {
      __typename?: 'timetables_journey_pattern_journey_pattern_ref_mutation_response';
      returning: Array<{
        __typename?: 'timetables_journey_pattern_journey_pattern_ref';
        journey_pattern_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertStopInJourneyPatternRefMutationVariables = Exact<{
  objects:
    | Array<TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput>
    | TimetablesServicePatternScheduledStopPointInJourneyPatternRefInsertInput;
}>;

export type InsertStopInJourneyPatternRefMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_service_pattern_scheduled_stop_point_in_journey_pattern_ref?: {
      __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_mutation_response';
      returning: Array<{
        __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
        journey_pattern_ref_id: UUID;
        scheduled_stop_point_in_journey_pattern_ref_id: UUID;
      }>;
    } | null;
  } | null;
};

export type RemoveStopInJourneyPatternRefsMutationVariables = Exact<{
  stop_ref_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveStopInJourneyPatternRefsMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_service_pattern_scheduled_stop_point_in_journey_pattern_ref?: {
      __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref_mutation_response';
      returning: Array<{
        __typename?: 'timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref';
        scheduled_stop_point_in_journey_pattern_ref_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertVehicleScheduleFramesMutationVariables = Exact<{
  objects:
    | Array<TimetablesVehicleScheduleVehicleScheduleFrameInsertInput>
    | TimetablesVehicleScheduleVehicleScheduleFrameInsertInput;
}>;

export type InsertVehicleScheduleFramesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_vehicle_schedule_vehicle_schedule_frame?: {
      __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
        vehicle_schedule_frame_id: UUID;
      }>;
    } | null;
  } | null;
};

export type RemoveVehicleScheduleFramesMutationVariables = Exact<{
  vehicle_schedule_frame_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveVehicleScheduleFramesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_vehicle_schedule_vehicle_schedule_frame?: {
      __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_schedule_vehicle_schedule_frame';
        vehicle_schedule_frame_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertVehicleServicesMutationVariables = Exact<{
  objects:
    | Array<TimetablesVehicleServiceVehicleServiceInsertInput>
    | TimetablesVehicleServiceVehicleServiceInsertInput;
}>;

export type InsertVehicleServicesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_vehicle_service_vehicle_service?: {
      __typename?: 'timetables_vehicle_service_vehicle_service_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_service_vehicle_service';
        vehicle_service_id: UUID;
      }>;
    } | null;
  } | null;
};

export type RemoveVehicleServicesMutationVariables = Exact<{
  vehicle_service_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveVehicleServicesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_vehicle_service_vehicle_service?: {
      __typename?: 'timetables_vehicle_service_vehicle_service_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_service_vehicle_service';
        vehicle_service_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertVehicleServiceBlocksMutationVariables = Exact<{
  objects:
    | Array<TimetablesVehicleServiceBlockInsertInput>
    | TimetablesVehicleServiceBlockInsertInput;
}>;

export type InsertVehicleServiceBlocksMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_vehicle_service_block?: {
      __typename?: 'timetables_vehicle_service_block_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_service_block';
        block_id: UUID;
      }>;
    } | null;
  } | null;
};

export type RemoveVehicleServiceBlocksMutationVariables = Exact<{
  block_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type RemoveVehicleServiceBlocksMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_vehicle_service_block?: {
      __typename?: 'timetables_vehicle_service_block_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_service_block';
        block_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertVehicleJourneysMutationVariables = Exact<{
  objects:
    | Array<TimetablesVehicleJourneyVehicleJourneyInsertInput>
    | TimetablesVehicleJourneyVehicleJourneyInsertInput;
}>;

export type InsertVehicleJourneysMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_vehicle_journey_vehicle_journey?: {
      __typename?: 'timetables_vehicle_journey_vehicle_journey_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_journey_vehicle_journey';
        vehicle_journey_id: UUID;
      }>;
    } | null;
  } | null;
};

export type DeleteVehicleJourneysMutationVariables = Exact<{
  vehicle_journey_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type DeleteVehicleJourneysMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_vehicle_journey_vehicle_journey?: {
      __typename?: 'timetables_vehicle_journey_vehicle_journey_mutation_response';
      returning: Array<{
        __typename?: 'timetables_vehicle_journey_vehicle_journey';
        vehicle_journey_id: UUID;
      }>;
    } | null;
  } | null;
};

export type InsertTimetabledPassingTimesMutationVariables = Exact<{
  objects:
    | Array<TimetablesPassingTimesTimetabledPassingTimeInsertInput>
    | TimetablesPassingTimesTimetabledPassingTimeInsertInput;
}>;

export type InsertTimetabledPassingTimesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_insert_passing_times_timetabled_passing_time?: {
      __typename?: 'timetables_passing_times_timetabled_passing_time_mutation_response';
      returning: Array<{
        __typename?: 'timetables_passing_times_timetabled_passing_time';
        timetabled_passing_time_id: UUID;
      }>;
    } | null;
  } | null;
};

export type DeleteTimetabledPassingTimesMutationVariables = Exact<{
  timetabled_passing_time_ids: Array<Scalars['uuid']> | Scalars['uuid'];
}>;

export type DeleteTimetabledPassingTimesMutation = {
  __typename?: 'mutation_root';
  timetables?: {
    __typename?: 'timetables_timetables_mutation_frontend';
    timetables_delete_passing_times_timetabled_passing_time?: {
      __typename?: 'timetables_passing_times_timetabled_passing_time_mutation_response';
      returning: Array<{
        __typename?: 'timetables_passing_times_timetabled_passing_time';
        timetabled_passing_time_id: UUID;
      }>;
    } | null;
  } | null;
};
