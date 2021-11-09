import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  float8: any;
  geography: any;
  geometry: any;
  uuid: any;
};


/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
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
export type Int_Comparison_Exp = {
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
export type String_Comparison_Exp = {
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
export type Float8_Comparison_Exp = {
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


export type Geography_Cast_Exp = {
  geometry?: Maybe<Geometry_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "geography". All fields are combined with logical 'AND'. */
export type Geography_Comparison_Exp = {
  _cast?: Maybe<Geography_Cast_Exp>;
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
  _st_d_within?: Maybe<St_D_Within_Geography_Input>;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: Maybe<Scalars['geography']>;
};


export type Geometry_Cast_Exp = {
  geography?: Maybe<Geography_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "geometry". All fields are combined with logical 'AND'. */
export type Geometry_Comparison_Exp = {
  _cast?: Maybe<Geometry_Cast_Exp>;
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
  _st_3d_d_within?: Maybe<St_D_Within_Input>;
  /** does the column spatially intersect the given geometry value in 3D */
  _st_3d_intersects?: Maybe<Scalars['geometry']>;
  /** does the column contain the given geometry value */
  _st_contains?: Maybe<Scalars['geometry']>;
  /** does the column cross the given geometry value */
  _st_crosses?: Maybe<Scalars['geometry']>;
  /** is the column within a given distance from the given geometry value */
  _st_d_within?: Maybe<St_D_Within_Input>;
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
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 */
export type Infrastructure_Network_Direction = {
  __typename?: 'infrastructure_network_direction';
  /** An array relationship */
  infrastructure_links: Array<Infrastructure_Network_Infrastructure_Link>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: Infrastructure_Network_Infrastructure_Link_Aggregate;
  value: Scalars['String'];
};


/**
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 */
export type Infrastructure_Network_DirectionInfrastructure_LinksArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/**
 * The direction in which an e.g. infrastructure link can be traversed
 *
 *
 * columns and relationships of "infrastructure_network.direction"
 */
export type Infrastructure_Network_DirectionInfrastructure_Links_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};

/** aggregated selection of "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Aggregate = {
  __typename?: 'infrastructure_network_direction_aggregate';
  aggregate?: Maybe<Infrastructure_Network_Direction_Aggregate_Fields>;
  nodes: Array<Infrastructure_Network_Direction>;
};

/** aggregate fields of "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Aggregate_Fields = {
  __typename?: 'infrastructure_network_direction_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Infrastructure_Network_Direction_Max_Fields>;
  min?: Maybe<Infrastructure_Network_Direction_Min_Fields>;
};


/** aggregate fields of "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.direction". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Direction_Bool_Exp = {
  _and?: Maybe<Array<Infrastructure_Network_Direction_Bool_Exp>>;
  _not?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
  _or?: Maybe<Array<Infrastructure_Network_Direction_Bool_Exp>>;
  infrastructure_links?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.direction" */
export enum Infrastructure_Network_Direction_Constraint {
  /** unique or primary key constraint */
  DirectionPkey = 'direction_pkey'
}

export enum Infrastructure_Network_Direction_Enum {
  Backward = 'backward',
  Bidirectional = 'bidirectional',
  Forward = 'forward'
}

/** Boolean expression to compare columns of type "infrastructure_network_direction_enum". All fields are combined with logical 'AND'. */
export type Infrastructure_Network_Direction_Enum_Comparison_Exp = {
  _eq?: Maybe<Infrastructure_Network_Direction_Enum>;
  _in?: Maybe<Array<Infrastructure_Network_Direction_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Infrastructure_Network_Direction_Enum>;
  _nin?: Maybe<Array<Infrastructure_Network_Direction_Enum>>;
};

/** input type for inserting data into table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Insert_Input = {
  infrastructure_links?: Maybe<Infrastructure_Network_Infrastructure_Link_Arr_Rel_Insert_Input>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Direction_Max_Fields = {
  __typename?: 'infrastructure_network_direction_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Direction_Min_Fields = {
  __typename?: 'infrastructure_network_direction_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Mutation_Response = {
  __typename?: 'infrastructure_network_direction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Infrastructure_Network_Direction>;
};

/** input type for inserting object relation for remote table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_Direction_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Infrastructure_Network_Direction_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_On_Conflict = {
  constraint: Infrastructure_Network_Direction_Constraint;
  update_columns?: Array<Infrastructure_Network_Direction_Update_Column>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};

/** Ordering options when selecting data from "infrastructure_network.direction". */
export type Infrastructure_Network_Direction_Order_By = {
  infrastructure_links_aggregate?: Maybe<Infrastructure_Network_Infrastructure_Link_Aggregate_Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: infrastructure_network_direction */
export type Infrastructure_Network_Direction_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "infrastructure_network.direction" */
export enum Infrastructure_Network_Direction_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Set_Input = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.direction" */
export enum Infrastructure_Network_Direction_Update_Column {
  /** column name */
  Value = 'value'
}

/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 */
export type Infrastructure_Network_External_Source = {
  __typename?: 'infrastructure_network_external_source';
  /** An array relationship */
  infrastructure_links: Array<Infrastructure_Network_Infrastructure_Link>;
  /** An aggregate relationship */
  infrastructure_links_aggregate: Infrastructure_Network_Infrastructure_Link_Aggregate;
  value: Scalars['String'];
};


/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 */
export type Infrastructure_Network_External_SourceInfrastructure_LinksArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/**
 * An external source from which infrastructure network parts are imported
 *
 *
 * columns and relationships of "infrastructure_network.external_source"
 */
export type Infrastructure_Network_External_SourceInfrastructure_Links_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};

/** aggregated selection of "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Aggregate = {
  __typename?: 'infrastructure_network_external_source_aggregate';
  aggregate?: Maybe<Infrastructure_Network_External_Source_Aggregate_Fields>;
  nodes: Array<Infrastructure_Network_External_Source>;
};

/** aggregate fields of "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Aggregate_Fields = {
  __typename?: 'infrastructure_network_external_source_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Infrastructure_Network_External_Source_Max_Fields>;
  min?: Maybe<Infrastructure_Network_External_Source_Min_Fields>;
};


/** aggregate fields of "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.external_source". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_External_Source_Bool_Exp = {
  _and?: Maybe<Array<Infrastructure_Network_External_Source_Bool_Exp>>;
  _not?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
  _or?: Maybe<Array<Infrastructure_Network_External_Source_Bool_Exp>>;
  infrastructure_links?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.external_source" */
export enum Infrastructure_Network_External_Source_Constraint {
  /** unique or primary key constraint */
  ExternalSourcePkey = 'external_source_pkey'
}

export enum Infrastructure_Network_External_Source_Enum {
  DigiroadR = 'digiroad_r',
  Fixup = 'fixup'
}

/** Boolean expression to compare columns of type "infrastructure_network_external_source_enum". All fields are combined with logical 'AND'. */
export type Infrastructure_Network_External_Source_Enum_Comparison_Exp = {
  _eq?: Maybe<Infrastructure_Network_External_Source_Enum>;
  _in?: Maybe<Array<Infrastructure_Network_External_Source_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Infrastructure_Network_External_Source_Enum>;
  _nin?: Maybe<Array<Infrastructure_Network_External_Source_Enum>>;
};

/** input type for inserting data into table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Insert_Input = {
  infrastructure_links?: Maybe<Infrastructure_Network_Infrastructure_Link_Arr_Rel_Insert_Input>;
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_External_Source_Max_Fields = {
  __typename?: 'infrastructure_network_external_source_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Infrastructure_Network_External_Source_Min_Fields = {
  __typename?: 'infrastructure_network_external_source_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Mutation_Response = {
  __typename?: 'infrastructure_network_external_source_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Infrastructure_Network_External_Source>;
};

/** input type for inserting object relation for remote table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_External_Source_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Infrastructure_Network_External_Source_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_On_Conflict = {
  constraint: Infrastructure_Network_External_Source_Constraint;
  update_columns?: Array<Infrastructure_Network_External_Source_Update_Column>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};

/** Ordering options when selecting data from "infrastructure_network.external_source". */
export type Infrastructure_Network_External_Source_Order_By = {
  infrastructure_links_aggregate?: Maybe<Infrastructure_Network_Infrastructure_Link_Aggregate_Order_By>;
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: infrastructure_network_external_source */
export type Infrastructure_Network_External_Source_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "infrastructure_network.external_source" */
export enum Infrastructure_Network_External_Source_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Set_Input = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.external_source" */
export enum Infrastructure_Network_External_Source_Update_Column {
  /** column name */
  Value = 'value'
}

/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 */
export type Infrastructure_Network_Infrastructure_Link = {
  __typename?: 'infrastructure_network_infrastructure_link';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction: Infrastructure_Network_Direction_Enum;
  /** An object relationship */
  directionByDirection: Infrastructure_Network_Direction;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id: Scalars['String'];
  external_link_source: Infrastructure_Network_External_Source_Enum;
  /** An object relationship */
  external_source: Infrastructure_Network_External_Source;
  /** An array relationship */
  infrastructure_link_along_routes: Array<Route_Infrastructure_Link_Along_Route>;
  /** An aggregate relationship */
  infrastructure_link_along_routes_aggregate: Route_Infrastructure_Link_Along_Route_Aggregate;
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape: Scalars['geography'];
  /** An array relationship */
  vehicle_submode_on_infrastructure_links: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** An aggregate relationship */
  vehicle_submode_on_infrastructure_links_aggregate: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate;
};


/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 */
export type Infrastructure_Network_Infrastructure_LinkInfrastructure_Link_Along_RoutesArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 */
export type Infrastructure_Network_Infrastructure_LinkInfrastructure_Link_Along_Routes_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 */
export type Infrastructure_Network_Infrastructure_LinkVehicle_Submode_On_Infrastructure_LinksArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/**
 * The infrastructure links, e.g. road or rail elements: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:1:1:453
 *
 *
 * columns and relationships of "infrastructure_network.infrastructure_link"
 */
export type Infrastructure_Network_Infrastructure_LinkVehicle_Submode_On_Infrastructure_Links_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** aggregated selection of "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Aggregate = {
  __typename?: 'infrastructure_network_infrastructure_link_aggregate';
  aggregate?: Maybe<Infrastructure_Network_Infrastructure_Link_Aggregate_Fields>;
  nodes: Array<Infrastructure_Network_Infrastructure_Link>;
};

/** aggregate fields of "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Aggregate_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_aggregate_fields';
  avg?: Maybe<Infrastructure_Network_Infrastructure_Link_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Infrastructure_Network_Infrastructure_Link_Max_Fields>;
  min?: Maybe<Infrastructure_Network_Infrastructure_Link_Min_Fields>;
  stddev?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Fields>;
  stddev_pop?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Fields>;
  sum?: Maybe<Infrastructure_Network_Infrastructure_Link_Sum_Fields>;
  var_pop?: Maybe<Infrastructure_Network_Infrastructure_Link_Var_Pop_Fields>;
  var_samp?: Maybe<Infrastructure_Network_Infrastructure_Link_Var_Samp_Fields>;
  variance?: Maybe<Infrastructure_Network_Infrastructure_Link_Variance_Fields>;
};


/** aggregate fields of "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Aggregate_Order_By = {
  avg?: Maybe<Infrastructure_Network_Infrastructure_Link_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Infrastructure_Network_Infrastructure_Link_Max_Order_By>;
  min?: Maybe<Infrastructure_Network_Infrastructure_Link_Min_Order_By>;
  stddev?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Order_By>;
  stddev_pop?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Order_By>;
  sum?: Maybe<Infrastructure_Network_Infrastructure_Link_Sum_Order_By>;
  var_pop?: Maybe<Infrastructure_Network_Infrastructure_Link_Var_Pop_Order_By>;
  var_samp?: Maybe<Infrastructure_Network_Infrastructure_Link_Var_Samp_Order_By>;
  variance?: Maybe<Infrastructure_Network_Infrastructure_Link_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Arr_Rel_Insert_Input = {
  data: Array<Infrastructure_Network_Infrastructure_Link_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};

/** aggregate avg on columns */
export type Infrastructure_Network_Infrastructure_Link_Avg_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_avg_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Avg_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.infrastructure_link". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Infrastructure_Link_Bool_Exp = {
  _and?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Bool_Exp>>;
  _not?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  _or?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Bool_Exp>>;
  direction?: Maybe<Infrastructure_Network_Direction_Enum_Comparison_Exp>;
  directionByDirection?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
  estimated_length_in_metres?: Maybe<Float8_Comparison_Exp>;
  external_link_id?: Maybe<String_Comparison_Exp>;
  external_link_source?: Maybe<Infrastructure_Network_External_Source_Enum_Comparison_Exp>;
  external_source?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
  infrastructure_link_along_routes?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
  infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  shape?: Maybe<Geography_Comparison_Exp>;
  vehicle_submode_on_infrastructure_links?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.infrastructure_link" */
export enum Infrastructure_Network_Infrastructure_Link_Constraint {
  /** unique or primary key constraint */
  InfrastructureLinkExternalLinkIdExternalLinkSourceIdx = 'infrastructure_link_external_link_id_external_link_source_idx',
  /** unique or primary key constraint */
  InfrastructureLinkPkey = 'infrastructure_link_pkey'
}

/** input type for incrementing numeric columns in table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Inc_Input = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** input type for inserting data into table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Insert_Input = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Infrastructure_Network_Direction_Enum>;
  directionByDirection?: Maybe<Infrastructure_Network_Direction_Obj_Rel_Insert_Input>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Infrastructure_Network_External_Source_Enum>;
  external_source?: Maybe<Infrastructure_Network_External_Source_Obj_Rel_Insert_Input>;
  infrastructure_link_along_routes?: Maybe<Route_Infrastructure_Link_Along_Route_Arr_Rel_Insert_Input>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: Maybe<Scalars['geography']>;
  vehicle_submode_on_infrastructure_links?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Infrastructure_Link_Max_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_max_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Max_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Infrastructure_Link_Min_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_min_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Min_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Mutation_Response = {
  __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Infrastructure_Network_Infrastructure_Link>;
};

/** input type for inserting object relation for remote table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_Infrastructure_Link_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_On_Conflict = {
  constraint: Infrastructure_Network_Infrastructure_Link_Constraint;
  update_columns?: Array<Infrastructure_Network_Infrastructure_Link_Update_Column>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};

/** Ordering options when selecting data from "infrastructure_network.infrastructure_link". */
export type Infrastructure_Network_Infrastructure_Link_Order_By = {
  direction?: Maybe<Order_By>;
  directionByDirection?: Maybe<Infrastructure_Network_Direction_Order_By>;
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  external_link_source?: Maybe<Order_By>;
  external_source?: Maybe<Infrastructure_Network_External_Source_Order_By>;
  infrastructure_link_along_routes_aggregate?: Maybe<Route_Infrastructure_Link_Along_Route_Aggregate_Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
  shape?: Maybe<Order_By>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_Order_By>;
};

/** primary key columns input for table: infrastructure_network_infrastructure_link */
export type Infrastructure_Network_Infrastructure_Link_Pk_Columns_Input = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
};

/** select columns of table "infrastructure_network.infrastructure_link" */
export enum Infrastructure_Network_Infrastructure_Link_Select_Column {
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
  Shape = 'shape'
}

/** input type for updating data in table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Set_Input = {
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Infrastructure_Network_Direction_Enum>;
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Infrastructure_Network_External_Source_Enum>;
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape?: Maybe<Scalars['geography']>;
};

/** aggregate stddev on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_pop_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_samp_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Infrastructure_Network_Infrastructure_Link_Sum_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_sum_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** order by sum() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Sum_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** update columns of table "infrastructure_network.infrastructure_link" */
export enum Infrastructure_Network_Infrastructure_Link_Update_Column {
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
  Shape = 'shape'
}

/** aggregate var_pop on columns */
export type Infrastructure_Network_Infrastructure_Link_Var_Pop_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_var_pop_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Var_Pop_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Infrastructure_Network_Infrastructure_Link_Var_Samp_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_var_samp_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Var_Samp_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Infrastructure_Network_Infrastructure_Link_Variance_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_variance_fields';
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Variance_Order_By = {
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Order_By>;
};

/**
 * Which infrastructure links are safely traversed by which vehicle submodes?
 *
 *
 * columns and relationships of "infrastructure_network.vehicle_submode_on_infrastructure_link"
 */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link';
  /** An object relationship */
  infrastructure_link: Infrastructure_Network_Infrastructure_Link;
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id: Scalars['uuid'];
  /** An object relationship */
  vehicleSubmodeByVehicleSubmode: Reusable_Components_Vehicle_Submode;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode: Reusable_Components_Vehicle_Submode_Enum;
};

/** aggregated selection of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate';
  aggregate?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_Fields>;
  nodes: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
};

/** aggregate fields of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_Fields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Fields>;
  min?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Fields>;
};


/** aggregate fields of "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Order_By>;
  min?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Order_By>;
};

/** input type for inserting array relation for remote table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Arr_Rel_Insert_Input = {
  data: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.vehicle_submode_on_infrastructure_link". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp = {
  _and?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>>;
  _not?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
  _or?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>>;
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  vehicleSubmodeByVehicleSubmode?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
  vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Constraint {
  /** unique or primary key constraint */
  VehicleSubmodeOnInfrastructureLinkPkey = 'vehicle_submode_on_infrastructure_link_pkey'
}

/** input type for inserting data into table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input = {
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Obj_Rel_Insert_Input>;
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  vehicleSubmodeByVehicleSubmode?: Maybe<Reusable_Components_Vehicle_Submode_Obj_Rel_Insert_Input>;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Enum>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Fields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_max_fields';
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Order_By = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Fields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_min_fields';
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Order_By = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Mutation_Response = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
};

/** on conflict condition type for table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict = {
  constraint: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Constraint;
  update_columns?: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Update_Column>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** Ordering options when selecting data from "infrastructure_network.vehicle_submode_on_infrastructure_link". */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By = {
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
  vehicleSubmodeByVehicleSubmode?: Maybe<Reusable_Components_Vehicle_Submode_Order_By>;
  vehicle_submode?: Maybe<Order_By>;
};

/** primary key columns input for table: infrastructure_network_vehicle_submode_on_infrastructure_link */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Pk_Columns_Input = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id: Scalars['uuid'];
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode: Reusable_Components_Vehicle_Submode_Enum;
};

/** select columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode'
}

/** input type for updating data in table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Set_Input = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Enum>;
};

/** update columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Update_Column {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode'
}

/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 */
export type Journey_Pattern_Journey_Pattern = {
  __typename?: 'journey_pattern_journey_pattern';
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The ID of the route the journey pattern is on. */
  on_route_id: Scalars['uuid'];
  /** An array relationship */
  scheduled_stop_point_in_journey_patterns: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** An aggregate relationship */
  scheduled_stop_point_in_journey_patterns_aggregate: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate;
};


/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 */
export type Journey_Pattern_Journey_PatternScheduled_Stop_Point_In_Journey_PatternsArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};


/**
 * The journey patterns, i.e. the ordered lists of stops and timing points along routes: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813
 *
 *
 * columns and relationships of "journey_pattern.journey_pattern"
 */
export type Journey_Pattern_Journey_PatternScheduled_Stop_Point_In_Journey_Patterns_AggregateArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};

/** aggregated selection of "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Aggregate = {
  __typename?: 'journey_pattern_journey_pattern_aggregate';
  aggregate?: Maybe<Journey_Pattern_Journey_Pattern_Aggregate_Fields>;
  nodes: Array<Journey_Pattern_Journey_Pattern>;
};

/** aggregate fields of "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Aggregate_Fields = {
  __typename?: 'journey_pattern_journey_pattern_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Journey_Pattern_Journey_Pattern_Max_Fields>;
  min?: Maybe<Journey_Pattern_Journey_Pattern_Min_Fields>;
};


/** aggregate fields of "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Journey_Pattern_Journey_Pattern_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "journey_pattern.journey_pattern". All fields are combined with a logical 'AND'. */
export type Journey_Pattern_Journey_Pattern_Bool_Exp = {
  _and?: Maybe<Array<Journey_Pattern_Journey_Pattern_Bool_Exp>>;
  _not?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
  _or?: Maybe<Array<Journey_Pattern_Journey_Pattern_Bool_Exp>>;
  journey_pattern_id?: Maybe<Uuid_Comparison_Exp>;
  on_route_id?: Maybe<Uuid_Comparison_Exp>;
  scheduled_stop_point_in_journey_patterns?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};

/** unique or primary key constraints on table "journey_pattern.journey_pattern" */
export enum Journey_Pattern_Journey_Pattern_Constraint {
  /** unique or primary key constraint */
  JourneyPatternPkey = 'journey_pattern_pkey'
}

/** input type for inserting data into table "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Insert_Input = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
  scheduled_stop_point_in_journey_patterns?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Journey_Pattern_Journey_Pattern_Max_Fields = {
  __typename?: 'journey_pattern_journey_pattern_max_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Journey_Pattern_Journey_Pattern_Min_Fields = {
  __typename?: 'journey_pattern_journey_pattern_min_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Mutation_Response = {
  __typename?: 'journey_pattern_journey_pattern_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Journey_Pattern_Journey_Pattern>;
};

/** input type for inserting object relation for remote table "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Obj_Rel_Insert_Input = {
  data: Journey_Pattern_Journey_Pattern_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Journey_Pattern_Journey_Pattern_On_Conflict>;
};

/** on conflict condition type for table "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_On_Conflict = {
  constraint: Journey_Pattern_Journey_Pattern_Constraint;
  update_columns?: Array<Journey_Pattern_Journey_Pattern_Update_Column>;
  where?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
};

/** Ordering options when selecting data from "journey_pattern.journey_pattern". */
export type Journey_Pattern_Journey_Pattern_Order_By = {
  journey_pattern_id?: Maybe<Order_By>;
  on_route_id?: Maybe<Order_By>;
  scheduled_stop_point_in_journey_patterns_aggregate?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate_Order_By>;
};

/** primary key columns input for table: journey_pattern_journey_pattern */
export type Journey_Pattern_Journey_Pattern_Pk_Columns_Input = {
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
};

/** select columns of table "journey_pattern.journey_pattern" */
export enum Journey_Pattern_Journey_Pattern_Select_Column {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  OnRouteId = 'on_route_id'
}

/** input type for updating data in table "journey_pattern.journey_pattern" */
export type Journey_Pattern_Journey_Pattern_Set_Input = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route the journey pattern is on. */
  on_route_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "journey_pattern.journey_pattern" */
export enum Journey_Pattern_Journey_Pattern_Update_Column {
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  OnRouteId = 'on_route_id'
}

/**
 * The scheduled stop points that form the journey pattern, in order: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:1:813 . For HSL, all timing points are stops, hence journey pattern instead of service pattern.
 *
 *
 * columns and relationships of "journey_pattern.scheduled_stop_point_in_journey_pattern"
 */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern';
  /** Is this scheduled stop point a timing point? */
  is_timing_point: Scalars['Boolean'];
  /** Is this scheduled stop point a via point? */
  is_via_point: Scalars['Boolean'];
  /** An object relationship */
  journey_pattern: Journey_Pattern_Journey_Pattern;
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence: Scalars['Int'];
};

/** aggregated selection of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate';
  aggregate?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate_Fields>;
  nodes: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
};

/** aggregate fields of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate_fields';
  avg?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Max_Fields>;
  min?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Min_Fields>;
  stddev?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Fields>;
  stddev_pop?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Samp_Fields>;
  sum?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Sum_Fields>;
  var_pop?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Pop_Fields>;
  var_samp?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Samp_Fields>;
  variance?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Variance_Fields>;
};


/** aggregate fields of "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate_Order_By = {
  avg?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Max_Order_By>;
  min?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Min_Order_By>;
  stddev?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Order_By>;
  stddev_pop?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Samp_Order_By>;
  sum?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Sum_Order_By>;
  var_pop?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Pop_Order_By>;
  var_samp?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Samp_Order_By>;
  variance?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Arr_Rel_Insert_Input = {
  data: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_On_Conflict>;
};

/** aggregate avg on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Avg_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_avg_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Avg_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "journey_pattern.scheduled_stop_point_in_journey_pattern". All fields are combined with a logical 'AND'. */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp = {
  _and?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>>;
  _not?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
  _or?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>>;
  is_timing_point?: Maybe<Boolean_Comparison_Exp>;
  is_via_point?: Maybe<Boolean_Comparison_Exp>;
  journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
  journey_pattern_id?: Maybe<Uuid_Comparison_Exp>;
  scheduled_stop_point_id?: Maybe<Uuid_Comparison_Exp>;
  scheduled_stop_point_sequence?: Maybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Constraint {
  /** unique or primary key constraint */
  ScheduledStopPointInJourneyPatternPkey = 'scheduled_stop_point_in_journey_pattern_pkey'
}

/** input type for incrementing numeric columns in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Inc_Input = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Insert_Input = {
  /** Is this scheduled stop point a timing point? */
  is_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: Maybe<Scalars['Boolean']>;
  journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Obj_Rel_Insert_Input>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** aggregate max on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Max_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_max_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by max() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Max_Order_By = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Order_By>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Order_By>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Min_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_min_fields';
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by min() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Min_Order_By = {
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Order_By>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Order_By>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** response of any mutation on the table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Mutation_Response = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
};

/** on conflict condition type for table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_On_Conflict = {
  constraint: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Constraint;
  update_columns?: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Update_Column>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};

/** Ordering options when selecting data from "journey_pattern.scheduled_stop_point_in_journey_pattern". */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By = {
  is_timing_point?: Maybe<Order_By>;
  is_via_point?: Maybe<Order_By>;
  journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Order_By>;
  journey_pattern_id?: Maybe<Order_By>;
  scheduled_stop_point_id?: Maybe<Order_By>;
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** primary key columns input for table: journey_pattern_scheduled_stop_point_in_journey_pattern */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Pk_Columns_Input = {
  /** The ID of the journey pattern. */
  journey_pattern_id: Scalars['uuid'];
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence: Scalars['Int'];
};

/** select columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column {
  /** column name */
  IsTimingPoint = 'is_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence'
}

/** input type for updating data in table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Set_Input = {
  /** Is this scheduled stop point a timing point? */
  is_timing_point?: Maybe<Scalars['Boolean']>;
  /** Is this scheduled stop point a via point? */
  is_via_point?: Maybe<Scalars['Boolean']>;
  /** The ID of the journey pattern. */
  journey_pattern_id?: Maybe<Scalars['uuid']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** aggregate stddev on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Pop_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_pop_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Pop_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Samp_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_stddev_samp_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Stddev_Samp_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Sum_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_sum_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Sum_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** update columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export enum Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Update_Column {
  /** column name */
  IsTimingPoint = 'is_timing_point',
  /** column name */
  IsViaPoint = 'is_via_point',
  /** column name */
  JourneyPatternId = 'journey_pattern_id',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  ScheduledStopPointSequence = 'scheduled_stop_point_sequence'
}

/** aggregate var_pop on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Pop_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_var_pop_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Pop_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Samp_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_var_samp_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Var_Samp_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Variance_Fields = {
  __typename?: 'journey_pattern_scheduled_stop_point_in_journey_pattern_variance_fields';
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "journey_pattern.scheduled_stop_point_in_journey_pattern" */
export type Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Variance_Order_By = {
  /** The order of the scheduled stop point within the journey pattern. */
  scheduled_stop_point_sequence?: Maybe<Order_By>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "infrastructure_network.direction" */
  delete_infrastructure_network_direction?: Maybe<Infrastructure_Network_Direction_Mutation_Response>;
  /** delete single row from the table: "infrastructure_network.direction" */
  delete_infrastructure_network_direction_by_pk?: Maybe<Infrastructure_Network_Direction>;
  /** delete data from the table: "infrastructure_network.external_source" */
  delete_infrastructure_network_external_source?: Maybe<Infrastructure_Network_External_Source_Mutation_Response>;
  /** delete single row from the table: "infrastructure_network.external_source" */
  delete_infrastructure_network_external_source_by_pk?: Maybe<Infrastructure_Network_External_Source>;
  /** delete data from the table: "infrastructure_network.infrastructure_link" */
  delete_infrastructure_network_infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Mutation_Response>;
  /** delete single row from the table: "infrastructure_network.infrastructure_link" */
  delete_infrastructure_network_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Infrastructure_Link>;
  /** delete data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  delete_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Mutation_Response>;
  /** delete single row from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  delete_infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** delete data from the table: "journey_pattern.journey_pattern" */
  delete_journey_pattern_journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Mutation_Response>;
  /** delete single row from the table: "journey_pattern.journey_pattern" */
  delete_journey_pattern_journey_pattern_by_pk?: Maybe<Journey_Pattern_Journey_Pattern>;
  /** delete data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Mutation_Response>;
  /** delete single row from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  delete_journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** delete data from the table: "reusable_components.vehicle_mode" */
  delete_reusable_components_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Mutation_Response>;
  /** delete single row from the table: "reusable_components.vehicle_mode" */
  delete_reusable_components_vehicle_mode_by_pk?: Maybe<Reusable_Components_Vehicle_Mode>;
  /** delete data from the table: "reusable_components.vehicle_submode" */
  delete_reusable_components_vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Mutation_Response>;
  /** delete single row from the table: "reusable_components.vehicle_submode" */
  delete_reusable_components_vehicle_submode_by_pk?: Maybe<Reusable_Components_Vehicle_Submode>;
  /** delete data from the table: "route.direction" */
  delete_route_direction?: Maybe<Route_Direction_Mutation_Response>;
  /** delete single row from the table: "route.direction" */
  delete_route_direction_by_pk?: Maybe<Route_Direction>;
  /** delete data from the table: "route.infrastructure_link_along_route" */
  delete_route_infrastructure_link_along_route?: Maybe<Route_Infrastructure_Link_Along_Route_Mutation_Response>;
  /** delete single row from the table: "route.infrastructure_link_along_route" */
  delete_route_infrastructure_link_along_route_by_pk?: Maybe<Route_Infrastructure_Link_Along_Route>;
  /** delete data from the table: "route.line" */
  delete_route_line?: Maybe<Route_Line_Mutation_Response>;
  /** delete single row from the table: "route.line" */
  delete_route_line_by_pk?: Maybe<Route_Line>;
  /** delete data from the table: "route.route" */
  delete_route_route?: Maybe<Route_Route_Mutation_Response>;
  /** delete data from the table: "service_pattern.scheduled_stop_point" */
  delete_service_pattern_scheduled_stop_point?: Maybe<Service_Pattern_Scheduled_Stop_Point_Mutation_Response>;
  /** delete data from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  delete_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Mutation_Response>;
  /** delete single row from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  delete_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_by_pk?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
  /** insert data into the table: "infrastructure_network.direction" */
  insert_infrastructure_network_direction?: Maybe<Infrastructure_Network_Direction_Mutation_Response>;
  /** insert a single row into the table: "infrastructure_network.direction" */
  insert_infrastructure_network_direction_one?: Maybe<Infrastructure_Network_Direction>;
  /** insert data into the table: "infrastructure_network.external_source" */
  insert_infrastructure_network_external_source?: Maybe<Infrastructure_Network_External_Source_Mutation_Response>;
  /** insert a single row into the table: "infrastructure_network.external_source" */
  insert_infrastructure_network_external_source_one?: Maybe<Infrastructure_Network_External_Source>;
  /** insert data into the table: "infrastructure_network.infrastructure_link" */
  insert_infrastructure_network_infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Mutation_Response>;
  /** insert a single row into the table: "infrastructure_network.infrastructure_link" */
  insert_infrastructure_network_infrastructure_link_one?: Maybe<Infrastructure_Network_Infrastructure_Link>;
  /** insert data into the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  insert_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Mutation_Response>;
  /** insert a single row into the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  insert_infrastructure_network_vehicle_submode_on_infrastructure_link_one?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** insert data into the table: "journey_pattern.journey_pattern" */
  insert_journey_pattern_journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Mutation_Response>;
  /** insert a single row into the table: "journey_pattern.journey_pattern" */
  insert_journey_pattern_journey_pattern_one?: Maybe<Journey_Pattern_Journey_Pattern>;
  /** insert data into the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Mutation_Response>;
  /** insert a single row into the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  insert_journey_pattern_scheduled_stop_point_in_journey_pattern_one?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** insert data into the table: "reusable_components.vehicle_mode" */
  insert_reusable_components_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Mutation_Response>;
  /** insert a single row into the table: "reusable_components.vehicle_mode" */
  insert_reusable_components_vehicle_mode_one?: Maybe<Reusable_Components_Vehicle_Mode>;
  /** insert data into the table: "reusable_components.vehicle_submode" */
  insert_reusable_components_vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Mutation_Response>;
  /** insert a single row into the table: "reusable_components.vehicle_submode" */
  insert_reusable_components_vehicle_submode_one?: Maybe<Reusable_Components_Vehicle_Submode>;
  /** insert data into the table: "route.direction" */
  insert_route_direction?: Maybe<Route_Direction_Mutation_Response>;
  /** insert a single row into the table: "route.direction" */
  insert_route_direction_one?: Maybe<Route_Direction>;
  /** insert data into the table: "route.infrastructure_link_along_route" */
  insert_route_infrastructure_link_along_route?: Maybe<Route_Infrastructure_Link_Along_Route_Mutation_Response>;
  /** insert a single row into the table: "route.infrastructure_link_along_route" */
  insert_route_infrastructure_link_along_route_one?: Maybe<Route_Infrastructure_Link_Along_Route>;
  /** insert data into the table: "route.line" */
  insert_route_line?: Maybe<Route_Line_Mutation_Response>;
  /** insert a single row into the table: "route.line" */
  insert_route_line_one?: Maybe<Route_Line>;
  /** insert data into the table: "route.route" */
  insert_route_route?: Maybe<Route_Route_Mutation_Response>;
  /** insert a single row into the table: "route.route" */
  insert_route_route_one?: Maybe<Route_Route>;
  /** insert data into the table: "service_pattern.scheduled_stop_point" */
  insert_service_pattern_scheduled_stop_point?: Maybe<Service_Pattern_Scheduled_Stop_Point_Mutation_Response>;
  /** insert a single row into the table: "service_pattern.scheduled_stop_point" */
  insert_service_pattern_scheduled_stop_point_one?: Maybe<Service_Pattern_Scheduled_Stop_Point>;
  /** insert data into the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  insert_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Mutation_Response>;
  /** insert a single row into the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  insert_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_one?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
  /** update data of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction?: Maybe<Infrastructure_Network_Direction_Mutation_Response>;
  /** update single row of the table: "infrastructure_network.direction" */
  update_infrastructure_network_direction_by_pk?: Maybe<Infrastructure_Network_Direction>;
  /** update data of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source?: Maybe<Infrastructure_Network_External_Source_Mutation_Response>;
  /** update single row of the table: "infrastructure_network.external_source" */
  update_infrastructure_network_external_source_by_pk?: Maybe<Infrastructure_Network_External_Source>;
  /** update data of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Mutation_Response>;
  /** update single row of the table: "infrastructure_network.infrastructure_link" */
  update_infrastructure_network_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Infrastructure_Link>;
  /** update data of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Mutation_Response>;
  /** update single row of the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  update_infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** update data of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern?: Maybe<Journey_Pattern_Journey_Pattern_Mutation_Response>;
  /** update single row of the table: "journey_pattern.journey_pattern" */
  update_journey_pattern_journey_pattern_by_pk?: Maybe<Journey_Pattern_Journey_Pattern>;
  /** update data of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Mutation_Response>;
  /** update single row of the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  update_journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** update data of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Mutation_Response>;
  /** update single row of the table: "reusable_components.vehicle_mode" */
  update_reusable_components_vehicle_mode_by_pk?: Maybe<Reusable_Components_Vehicle_Mode>;
  /** update data of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode?: Maybe<Reusable_Components_Vehicle_Submode_Mutation_Response>;
  /** update single row of the table: "reusable_components.vehicle_submode" */
  update_reusable_components_vehicle_submode_by_pk?: Maybe<Reusable_Components_Vehicle_Submode>;
  /** update data of the table: "route.direction" */
  update_route_direction?: Maybe<Route_Direction_Mutation_Response>;
  /** update single row of the table: "route.direction" */
  update_route_direction_by_pk?: Maybe<Route_Direction>;
  /** update data of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route?: Maybe<Route_Infrastructure_Link_Along_Route_Mutation_Response>;
  /** update single row of the table: "route.infrastructure_link_along_route" */
  update_route_infrastructure_link_along_route_by_pk?: Maybe<Route_Infrastructure_Link_Along_Route>;
  /** update data of the table: "route.line" */
  update_route_line?: Maybe<Route_Line_Mutation_Response>;
  /** update single row of the table: "route.line" */
  update_route_line_by_pk?: Maybe<Route_Line>;
  /** update data of the table: "route.route" */
  update_route_route?: Maybe<Route_Route_Mutation_Response>;
  /** update data of the table: "service_pattern.scheduled_stop_point" */
  update_service_pattern_scheduled_stop_point?: Maybe<Service_Pattern_Scheduled_Stop_Point_Mutation_Response>;
  /** update data of the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  update_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Mutation_Response>;
  /** update single row of the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  update_service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_by_pk?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_DirectionArgs = {
  where: Infrastructure_Network_Direction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_Direction_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_External_SourceArgs = {
  where: Infrastructure_Network_External_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_External_Source_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_Infrastructure_LinkArgs = {
  where: Infrastructure_Network_Infrastructure_Link_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  where: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
  vehicle_submode: Reusable_Components_Vehicle_Submode_Enum;
};


/** mutation root */
export type Mutation_RootDelete_Journey_Pattern_Journey_PatternArgs = {
  where: Journey_Pattern_Journey_Pattern_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Journey_Pattern_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Journey_Pattern_Scheduled_Stop_Point_In_Journey_PatternArgs = {
  where: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
  scheduled_stop_point_sequence: Scalars['Int'];
};


/** mutation root */
export type Mutation_RootDelete_Reusable_Components_Vehicle_ModeArgs = {
  where: Reusable_Components_Vehicle_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Reusable_Components_Vehicle_Mode_By_PkArgs = {
  vehicle_mode: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Reusable_Components_Vehicle_SubmodeArgs = {
  where: Reusable_Components_Vehicle_Submode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Reusable_Components_Vehicle_Submode_By_PkArgs = {
  vehicle_submode: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Route_DirectionArgs = {
  where: Route_Direction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Route_Direction_By_PkArgs = {
  direction: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Route_Infrastructure_Link_Along_RouteArgs = {
  where: Route_Infrastructure_Link_Along_Route_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Route_Infrastructure_Link_Along_Route_By_PkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Route_LineArgs = {
  where: Route_Line_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Route_Line_By_PkArgs = {
  line_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Route_RouteArgs = {
  where: Route_Route_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Service_Pattern_Scheduled_Stop_PointArgs = {
  where: Service_Pattern_Scheduled_Stop_Point_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_ModeArgs = {
  where: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_By_PkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
  vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_DirectionArgs = {
  objects: Array<Infrastructure_Network_Direction_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_Direction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_Direction_OneArgs = {
  object: Infrastructure_Network_Direction_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Direction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_External_SourceArgs = {
  objects: Array<Infrastructure_Network_External_Source_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_External_Source_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_External_Source_OneArgs = {
  object: Infrastructure_Network_External_Source_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_External_Source_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_Infrastructure_LinkArgs = {
  objects: Array<Infrastructure_Network_Infrastructure_Link_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_Infrastructure_Link_OneArgs = {
  object: Infrastructure_Network_Infrastructure_Link_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  objects: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_OneArgs = {
  object: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Journey_Pattern_Journey_PatternArgs = {
  objects: Array<Journey_Pattern_Journey_Pattern_Insert_Input>;
  on_conflict?: Maybe<Journey_Pattern_Journey_Pattern_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Journey_Pattern_Journey_Pattern_OneArgs = {
  object: Journey_Pattern_Journey_Pattern_Insert_Input;
  on_conflict?: Maybe<Journey_Pattern_Journey_Pattern_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Journey_Pattern_Scheduled_Stop_Point_In_Journey_PatternArgs = {
  objects: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Insert_Input>;
  on_conflict?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_OneArgs = {
  object: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Insert_Input;
  on_conflict?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reusable_Components_Vehicle_ModeArgs = {
  objects: Array<Reusable_Components_Vehicle_Mode_Insert_Input>;
  on_conflict?: Maybe<Reusable_Components_Vehicle_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reusable_Components_Vehicle_Mode_OneArgs = {
  object: Reusable_Components_Vehicle_Mode_Insert_Input;
  on_conflict?: Maybe<Reusable_Components_Vehicle_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reusable_Components_Vehicle_SubmodeArgs = {
  objects: Array<Reusable_Components_Vehicle_Submode_Insert_Input>;
  on_conflict?: Maybe<Reusable_Components_Vehicle_Submode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Reusable_Components_Vehicle_Submode_OneArgs = {
  object: Reusable_Components_Vehicle_Submode_Insert_Input;
  on_conflict?: Maybe<Reusable_Components_Vehicle_Submode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_DirectionArgs = {
  objects: Array<Route_Direction_Insert_Input>;
  on_conflict?: Maybe<Route_Direction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_Direction_OneArgs = {
  object: Route_Direction_Insert_Input;
  on_conflict?: Maybe<Route_Direction_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_Infrastructure_Link_Along_RouteArgs = {
  objects: Array<Route_Infrastructure_Link_Along_Route_Insert_Input>;
  on_conflict?: Maybe<Route_Infrastructure_Link_Along_Route_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_Infrastructure_Link_Along_Route_OneArgs = {
  object: Route_Infrastructure_Link_Along_Route_Insert_Input;
  on_conflict?: Maybe<Route_Infrastructure_Link_Along_Route_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_LineArgs = {
  objects: Array<Route_Line_Insert_Input>;
  on_conflict?: Maybe<Route_Line_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_Line_OneArgs = {
  object: Route_Line_Insert_Input;
  on_conflict?: Maybe<Route_Line_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Route_RouteArgs = {
  objects: Array<Route_Route_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Route_Route_OneArgs = {
  object: Route_Route_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Service_Pattern_Scheduled_Stop_PointArgs = {
  objects: Array<Service_Pattern_Scheduled_Stop_Point_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Service_Pattern_Scheduled_Stop_Point_OneArgs = {
  object: Service_Pattern_Scheduled_Stop_Point_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_ModeArgs = {
  objects: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Insert_Input>;
  on_conflict?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_OneArgs = {
  object: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Insert_Input;
  on_conflict?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_DirectionArgs = {
  _set?: Maybe<Infrastructure_Network_Direction_Set_Input>;
  where: Infrastructure_Network_Direction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_Direction_By_PkArgs = {
  _set?: Maybe<Infrastructure_Network_Direction_Set_Input>;
  pk_columns: Infrastructure_Network_Direction_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_External_SourceArgs = {
  _set?: Maybe<Infrastructure_Network_External_Source_Set_Input>;
  where: Infrastructure_Network_External_Source_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_External_Source_By_PkArgs = {
  _set?: Maybe<Infrastructure_Network_External_Source_Set_Input>;
  pk_columns: Infrastructure_Network_External_Source_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_Infrastructure_LinkArgs = {
  _inc?: Maybe<Infrastructure_Network_Infrastructure_Link_Inc_Input>;
  _set?: Maybe<Infrastructure_Network_Infrastructure_Link_Set_Input>;
  where: Infrastructure_Network_Infrastructure_Link_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_Infrastructure_Link_By_PkArgs = {
  _inc?: Maybe<Infrastructure_Network_Infrastructure_Link_Inc_Input>;
  _set?: Maybe<Infrastructure_Network_Infrastructure_Link_Set_Input>;
  pk_columns: Infrastructure_Network_Infrastructure_Link_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  _set?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Set_Input>;
  where: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  _set?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Set_Input>;
  pk_columns: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Journey_Pattern_Journey_PatternArgs = {
  _set?: Maybe<Journey_Pattern_Journey_Pattern_Set_Input>;
  where: Journey_Pattern_Journey_Pattern_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Journey_Pattern_Journey_Pattern_By_PkArgs = {
  _set?: Maybe<Journey_Pattern_Journey_Pattern_Set_Input>;
  pk_columns: Journey_Pattern_Journey_Pattern_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Journey_Pattern_Scheduled_Stop_Point_In_Journey_PatternArgs = {
  _inc?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Inc_Input>;
  _set?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Set_Input>;
  where: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_By_PkArgs = {
  _inc?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Inc_Input>;
  _set?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Set_Input>;
  pk_columns: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Reusable_Components_Vehicle_ModeArgs = {
  _set?: Maybe<Reusable_Components_Vehicle_Mode_Set_Input>;
  where: Reusable_Components_Vehicle_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Reusable_Components_Vehicle_Mode_By_PkArgs = {
  _set?: Maybe<Reusable_Components_Vehicle_Mode_Set_Input>;
  pk_columns: Reusable_Components_Vehicle_Mode_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Reusable_Components_Vehicle_SubmodeArgs = {
  _set?: Maybe<Reusable_Components_Vehicle_Submode_Set_Input>;
  where: Reusable_Components_Vehicle_Submode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Reusable_Components_Vehicle_Submode_By_PkArgs = {
  _set?: Maybe<Reusable_Components_Vehicle_Submode_Set_Input>;
  pk_columns: Reusable_Components_Vehicle_Submode_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Route_DirectionArgs = {
  _set?: Maybe<Route_Direction_Set_Input>;
  where: Route_Direction_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Route_Direction_By_PkArgs = {
  _set?: Maybe<Route_Direction_Set_Input>;
  pk_columns: Route_Direction_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Route_Infrastructure_Link_Along_RouteArgs = {
  _inc?: Maybe<Route_Infrastructure_Link_Along_Route_Inc_Input>;
  _set?: Maybe<Route_Infrastructure_Link_Along_Route_Set_Input>;
  where: Route_Infrastructure_Link_Along_Route_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Route_Infrastructure_Link_Along_Route_By_PkArgs = {
  _inc?: Maybe<Route_Infrastructure_Link_Along_Route_Inc_Input>;
  _set?: Maybe<Route_Infrastructure_Link_Along_Route_Set_Input>;
  pk_columns: Route_Infrastructure_Link_Along_Route_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Route_LineArgs = {
  _set?: Maybe<Route_Line_Set_Input>;
  where: Route_Line_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Route_Line_By_PkArgs = {
  _set?: Maybe<Route_Line_Set_Input>;
  pk_columns: Route_Line_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Route_RouteArgs = {
  _set?: Maybe<Route_Route_Set_Input>;
  where: Route_Route_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Service_Pattern_Scheduled_Stop_PointArgs = {
  _inc?: Maybe<Service_Pattern_Scheduled_Stop_Point_Inc_Input>;
  _set?: Maybe<Service_Pattern_Scheduled_Stop_Point_Set_Input>;
  where: Service_Pattern_Scheduled_Stop_Point_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_ModeArgs = {
  _set?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Set_Input>;
  where: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_By_PkArgs = {
  _set?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Set_Input>;
  pk_columns: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
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
  DescNullsLast = 'desc_nulls_last'
}

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "infrastructure_network.direction" */
  infrastructure_network_direction: Array<Infrastructure_Network_Direction>;
  /** fetch aggregated fields from the table: "infrastructure_network.direction" */
  infrastructure_network_direction_aggregate: Infrastructure_Network_Direction_Aggregate;
  /** fetch data from the table: "infrastructure_network.direction" using primary key columns */
  infrastructure_network_direction_by_pk?: Maybe<Infrastructure_Network_Direction>;
  /** fetch data from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source: Array<Infrastructure_Network_External_Source>;
  /** fetch aggregated fields from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source_aggregate: Infrastructure_Network_External_Source_Aggregate;
  /** fetch data from the table: "infrastructure_network.external_source" using primary key columns */
  infrastructure_network_external_source_by_pk?: Maybe<Infrastructure_Network_External_Source>;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link: Array<Infrastructure_Network_Infrastructure_Link>;
  /** fetch aggregated fields from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link_aggregate: Infrastructure_Network_Infrastructure_Link_Aggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" using primary key columns */
  infrastructure_network_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Infrastructure_Link>;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** fetch aggregated fields from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" using primary key columns */
  infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** fetch data from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern: Array<Journey_Pattern_Journey_Pattern>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern_aggregate: Journey_Pattern_Journey_Pattern_Aggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" using primary key columns */
  journey_pattern_journey_pattern_by_pk?: Maybe<Journey_Pattern_Journey_Pattern>;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** fetch aggregated fields from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" using primary key columns */
  journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** fetch data from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode: Array<Reusable_Components_Vehicle_Mode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode_aggregate: Reusable_Components_Vehicle_Mode_Aggregate;
  /** fetch data from the table: "reusable_components.vehicle_mode" using primary key columns */
  reusable_components_vehicle_mode_by_pk?: Maybe<Reusable_Components_Vehicle_Mode>;
  /** fetch data from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode: Array<Reusable_Components_Vehicle_Submode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode_aggregate: Reusable_Components_Vehicle_Submode_Aggregate;
  /** fetch data from the table: "reusable_components.vehicle_submode" using primary key columns */
  reusable_components_vehicle_submode_by_pk?: Maybe<Reusable_Components_Vehicle_Submode>;
  /** fetch data from the table: "route.direction" */
  route_direction: Array<Route_Direction>;
  /** fetch aggregated fields from the table: "route.direction" */
  route_direction_aggregate: Route_Direction_Aggregate;
  /** fetch data from the table: "route.direction" using primary key columns */
  route_direction_by_pk?: Maybe<Route_Direction>;
  /** fetch data from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route: Array<Route_Infrastructure_Link_Along_Route>;
  /** fetch aggregated fields from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route_aggregate: Route_Infrastructure_Link_Along_Route_Aggregate;
  /** fetch data from the table: "route.infrastructure_link_along_route" using primary key columns */
  route_infrastructure_link_along_route_by_pk?: Maybe<Route_Infrastructure_Link_Along_Route>;
  /** fetch data from the table: "route.line" */
  route_line: Array<Route_Line>;
  /** fetch aggregated fields from the table: "route.line" */
  route_line_aggregate: Route_Line_Aggregate;
  /** fetch data from the table: "route.line" using primary key columns */
  route_line_by_pk?: Maybe<Route_Line>;
  /** fetch data from the table: "route.route" */
  route_route: Array<Route_Route>;
  /** fetch aggregated fields from the table: "route.route" */
  route_route_aggregate: Route_Route_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point: Array<Service_Pattern_Scheduled_Stop_Point>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point_aggregate: Service_Pattern_Scheduled_Stop_Point_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_aggregate: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" using primary key columns */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_by_pk?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
};


export type Query_RootInfrastructure_Network_DirectionArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Direction_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootInfrastructure_Network_External_SourceArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_External_Source_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_External_Source_By_PkArgs = {
  value: Scalars['String'];
};


export type Query_RootInfrastructure_Network_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};


export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
  vehicle_submode: Reusable_Components_Vehicle_Submode_Enum;
};


export type Query_RootJourney_Pattern_Journey_PatternArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
};


export type Query_RootJourney_Pattern_Journey_Pattern_AggregateArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
};


export type Query_RootJourney_Pattern_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
};


export type Query_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_PatternArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};


export type Query_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_AggregateArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};


export type Query_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
  scheduled_stop_point_sequence: Scalars['Int'];
};


export type Query_RootReusable_Components_Vehicle_ModeArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Mode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
};


export type Query_RootReusable_Components_Vehicle_Mode_AggregateArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Mode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
};


export type Query_RootReusable_Components_Vehicle_Mode_By_PkArgs = {
  vehicle_mode: Scalars['String'];
};


export type Query_RootReusable_Components_Vehicle_SubmodeArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};


export type Query_RootReusable_Components_Vehicle_Submode_AggregateArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};


export type Query_RootReusable_Components_Vehicle_Submode_By_PkArgs = {
  vehicle_submode: Scalars['String'];
};


export type Query_RootRoute_DirectionArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};


export type Query_RootRoute_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};


export type Query_RootRoute_Direction_By_PkArgs = {
  direction: Scalars['String'];
};


export type Query_RootRoute_Infrastructure_Link_Along_RouteArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


export type Query_RootRoute_Infrastructure_Link_Along_Route_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


export type Query_RootRoute_Infrastructure_Link_Along_Route_By_PkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};


export type Query_RootRoute_LineArgs = {
  distinct_on?: Maybe<Array<Route_Line_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Line_Order_By>>;
  where?: Maybe<Route_Line_Bool_Exp>;
};


export type Query_RootRoute_Line_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Line_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Line_Order_By>>;
  where?: Maybe<Route_Line_Bool_Exp>;
};


export type Query_RootRoute_Line_By_PkArgs = {
  line_id: Scalars['uuid'];
};


export type Query_RootRoute_RouteArgs = {
  distinct_on?: Maybe<Array<Route_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Route_Order_By>>;
  where?: Maybe<Route_Route_Bool_Exp>;
};


export type Query_RootRoute_Route_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Route_Order_By>>;
  where?: Maybe<Route_Route_Bool_Exp>;
};


export type Query_RootService_Pattern_Scheduled_Stop_PointArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>;
};


export type Query_RootService_Pattern_Scheduled_Stop_Point_AggregateArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>;
};


export type Query_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_ModeArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


export type Query_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_AggregateArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


export type Query_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_By_PkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
  vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
};

/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 */
export type Reusable_Components_Vehicle_Mode = {
  __typename?: 'reusable_components_vehicle_mode';
  /** An array relationship */
  scheduled_stop_point_serviced_by_vehicle_modes: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
  /** An aggregate relationship */
  scheduled_stop_point_serviced_by_vehicle_modes_aggregate: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate;
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode: Scalars['String'];
  /** An array relationship */
  vehicle_submodes: Array<Reusable_Components_Vehicle_Submode>;
  /** An aggregate relationship */
  vehicle_submodes_aggregate: Reusable_Components_Vehicle_Submode_Aggregate;
};


/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 */
export type Reusable_Components_Vehicle_ModeScheduled_Stop_Point_Serviced_By_Vehicle_ModesArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 */
export type Reusable_Components_Vehicle_ModeScheduled_Stop_Point_Serviced_By_Vehicle_Modes_AggregateArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 */
export type Reusable_Components_Vehicle_ModeVehicle_SubmodesArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};


/**
 * The vehicle modes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283
 *
 *
 * columns and relationships of "reusable_components.vehicle_mode"
 */
export type Reusable_Components_Vehicle_ModeVehicle_Submodes_AggregateArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};

/** aggregated selection of "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Aggregate = {
  __typename?: 'reusable_components_vehicle_mode_aggregate';
  aggregate?: Maybe<Reusable_Components_Vehicle_Mode_Aggregate_Fields>;
  nodes: Array<Reusable_Components_Vehicle_Mode>;
};

/** aggregate fields of "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Aggregate_Fields = {
  __typename?: 'reusable_components_vehicle_mode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Reusable_Components_Vehicle_Mode_Max_Fields>;
  min?: Maybe<Reusable_Components_Vehicle_Mode_Min_Fields>;
};


/** aggregate fields of "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Reusable_Components_Vehicle_Mode_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_mode". All fields are combined with a logical 'AND'. */
export type Reusable_Components_Vehicle_Mode_Bool_Exp = {
  _and?: Maybe<Array<Reusable_Components_Vehicle_Mode_Bool_Exp>>;
  _not?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
  _or?: Maybe<Array<Reusable_Components_Vehicle_Mode_Bool_Exp>>;
  scheduled_stop_point_serviced_by_vehicle_modes?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
  vehicle_mode?: Maybe<String_Comparison_Exp>;
  vehicle_submodes?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};

/** unique or primary key constraints on table "reusable_components.vehicle_mode" */
export enum Reusable_Components_Vehicle_Mode_Constraint {
  /** unique or primary key constraint */
  VehicleModePkey = 'vehicle_mode_pkey'
}

export enum Reusable_Components_Vehicle_Mode_Enum {
  Bus = 'bus',
  Ferry = 'ferry',
  Metro = 'metro',
  Train = 'train',
  Tram = 'tram'
}

/** Boolean expression to compare columns of type "reusable_components_vehicle_mode_enum". All fields are combined with logical 'AND'. */
export type Reusable_Components_Vehicle_Mode_Enum_Comparison_Exp = {
  _eq?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  _in?: Maybe<Array<Reusable_Components_Vehicle_Mode_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  _nin?: Maybe<Array<Reusable_Components_Vehicle_Mode_Enum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Insert_Input = {
  scheduled_stop_point_serviced_by_vehicle_modes?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Arr_Rel_Insert_Input>;
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
  vehicle_submodes?: Maybe<Reusable_Components_Vehicle_Submode_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Reusable_Components_Vehicle_Mode_Max_Fields = {
  __typename?: 'reusable_components_vehicle_mode_max_fields';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Reusable_Components_Vehicle_Mode_Min_Fields = {
  __typename?: 'reusable_components_vehicle_mode_min_fields';
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Mutation_Response = {
  __typename?: 'reusable_components_vehicle_mode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Reusable_Components_Vehicle_Mode>;
};

/** input type for inserting object relation for remote table "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Obj_Rel_Insert_Input = {
  data: Reusable_Components_Vehicle_Mode_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Reusable_Components_Vehicle_Mode_On_Conflict>;
};

/** on conflict condition type for table "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_On_Conflict = {
  constraint: Reusable_Components_Vehicle_Mode_Constraint;
  update_columns?: Array<Reusable_Components_Vehicle_Mode_Update_Column>;
  where?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_mode". */
export type Reusable_Components_Vehicle_Mode_Order_By = {
  scheduled_stop_point_serviced_by_vehicle_modes_aggregate?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate_Order_By>;
  vehicle_mode?: Maybe<Order_By>;
  vehicle_submodes_aggregate?: Maybe<Reusable_Components_Vehicle_Submode_Aggregate_Order_By>;
};

/** primary key columns input for table: reusable_components_vehicle_mode */
export type Reusable_Components_Vehicle_Mode_Pk_Columns_Input = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode: Scalars['String'];
};

/** select columns of table "reusable_components.vehicle_mode" */
export enum Reusable_Components_Vehicle_Mode_Select_Column {
  /** column name */
  VehicleMode = 'vehicle_mode'
}

/** input type for updating data in table "reusable_components.vehicle_mode" */
export type Reusable_Components_Vehicle_Mode_Set_Input = {
  /** The vehicle mode from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  vehicle_mode?: Maybe<Scalars['String']>;
};

/** update columns of table "reusable_components.vehicle_mode" */
export enum Reusable_Components_Vehicle_Mode_Update_Column {
  /** column name */
  VehicleMode = 'vehicle_mode'
}

/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 */
export type Reusable_Components_Vehicle_Submode = {
  __typename?: 'reusable_components_vehicle_submode';
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
  /** An object relationship */
  vehicle_mode: Reusable_Components_Vehicle_Mode;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode: Scalars['String'];
  /** An array relationship */
  vehicle_submode_on_infrastructure_links: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** An aggregate relationship */
  vehicle_submode_on_infrastructure_links_aggregate: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate;
};


/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 */
export type Reusable_Components_Vehicle_SubmodeVehicle_Submode_On_Infrastructure_LinksArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/**
 * The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse
 *
 *
 * columns and relationships of "reusable_components.vehicle_submode"
 */
export type Reusable_Components_Vehicle_SubmodeVehicle_Submode_On_Infrastructure_Links_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** aggregated selection of "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Aggregate = {
  __typename?: 'reusable_components_vehicle_submode_aggregate';
  aggregate?: Maybe<Reusable_Components_Vehicle_Submode_Aggregate_Fields>;
  nodes: Array<Reusable_Components_Vehicle_Submode>;
};

/** aggregate fields of "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Aggregate_Fields = {
  __typename?: 'reusable_components_vehicle_submode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Reusable_Components_Vehicle_Submode_Max_Fields>;
  min?: Maybe<Reusable_Components_Vehicle_Submode_Min_Fields>;
};


/** aggregate fields of "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Reusable_Components_Vehicle_Submode_Max_Order_By>;
  min?: Maybe<Reusable_Components_Vehicle_Submode_Min_Order_By>;
};

/** input type for inserting array relation for remote table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Arr_Rel_Insert_Input = {
  data: Array<Reusable_Components_Vehicle_Submode_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Reusable_Components_Vehicle_Submode_On_Conflict>;
};

/** Boolean expression to filter rows from the table "reusable_components.vehicle_submode". All fields are combined with a logical 'AND'. */
export type Reusable_Components_Vehicle_Submode_Bool_Exp = {
  _and?: Maybe<Array<Reusable_Components_Vehicle_Submode_Bool_Exp>>;
  _not?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
  _or?: Maybe<Array<Reusable_Components_Vehicle_Submode_Bool_Exp>>;
  belonging_to_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum_Comparison_Exp>;
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
  vehicle_submode?: Maybe<String_Comparison_Exp>;
  vehicle_submode_on_infrastructure_links?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** unique or primary key constraints on table "reusable_components.vehicle_submode" */
export enum Reusable_Components_Vehicle_Submode_Constraint {
  /** unique or primary key constraint */
  VehicleSubmodePkey = 'vehicle_submode_pkey'
}

export enum Reusable_Components_Vehicle_Submode_Enum {
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
  TallElectricBus = 'tall_electric_bus'
}

/** Boolean expression to compare columns of type "reusable_components_vehicle_submode_enum". All fields are combined with logical 'AND'. */
export type Reusable_Components_Vehicle_Submode_Enum_Comparison_Exp = {
  _eq?: Maybe<Reusable_Components_Vehicle_Submode_Enum>;
  _in?: Maybe<Array<Reusable_Components_Vehicle_Submode_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Reusable_Components_Vehicle_Submode_Enum>;
  _nin?: Maybe<Array<Reusable_Components_Vehicle_Submode_Enum>>;
};

/** input type for inserting data into table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Insert_Input = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Obj_Rel_Insert_Input>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
  vehicle_submode_on_infrastructure_links?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Reusable_Components_Vehicle_Submode_Max_Fields = {
  __typename?: 'reusable_components_vehicle_submode_max_fields';
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Max_Order_By = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Reusable_Components_Vehicle_Submode_Min_Fields = {
  __typename?: 'reusable_components_vehicle_submode_min_fields';
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Min_Order_By = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Order_By>;
};

/** response of any mutation on the table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Mutation_Response = {
  __typename?: 'reusable_components_vehicle_submode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Reusable_Components_Vehicle_Submode>;
};

/** input type for inserting object relation for remote table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Obj_Rel_Insert_Input = {
  data: Reusable_Components_Vehicle_Submode_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Reusable_Components_Vehicle_Submode_On_Conflict>;
};

/** on conflict condition type for table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_On_Conflict = {
  constraint: Reusable_Components_Vehicle_Submode_Constraint;
  update_columns?: Array<Reusable_Components_Vehicle_Submode_Update_Column>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};

/** Ordering options when selecting data from "reusable_components.vehicle_submode". */
export type Reusable_Components_Vehicle_Submode_Order_By = {
  belonging_to_vehicle_mode?: Maybe<Order_By>;
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Order_By>;
  vehicle_submode?: Maybe<Order_By>;
  vehicle_submode_on_infrastructure_links_aggregate?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate_Order_By>;
};

/** primary key columns input for table: reusable_components_vehicle_submode */
export type Reusable_Components_Vehicle_Submode_Pk_Columns_Input = {
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode: Scalars['String'];
};

/** select columns of table "reusable_components.vehicle_submode" */
export enum Reusable_Components_Vehicle_Submode_Select_Column {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  VehicleSubmode = 'vehicle_submode'
}

/** input type for updating data in table "reusable_components.vehicle_submode" */
export type Reusable_Components_Vehicle_Submode_Set_Input = {
  /** The vehicle mode the vehicle submode belongs to: https://www.transmodel-cen.eu/model/index.htm?goto=1:6:1:283 */
  belonging_to_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  /** The vehicle submode, which may have implications on which infrastructure links the vehicle can traverse */
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** update columns of table "reusable_components.vehicle_submode" */
export enum Reusable_Components_Vehicle_Submode_Update_Column {
  /** column name */
  BelongingToVehicleMode = 'belonging_to_vehicle_mode',
  /** column name */
  VehicleSubmode = 'vehicle_submode'
}

/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 */
export type Route_Direction = {
  __typename?: 'route_direction';
  /** The name of the route direction. */
  direction: Scalars['String'];
  /** An object relationship */
  directionByTheOppositeOfDirection?: Maybe<Route_Direction>;
  /** An array relationship */
  directions: Array<Route_Direction>;
  /** An aggregate relationship */
  directions_aggregate: Route_Direction_Aggregate;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<Route_Direction_Enum>;
};


/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 */
export type Route_DirectionDirectionsArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};


/**
 * The route directions from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:480
 *
 *
 * columns and relationships of "route.direction"
 */
export type Route_DirectionDirections_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};

/** aggregated selection of "route.direction" */
export type Route_Direction_Aggregate = {
  __typename?: 'route_direction_aggregate';
  aggregate?: Maybe<Route_Direction_Aggregate_Fields>;
  nodes: Array<Route_Direction>;
};

/** aggregate fields of "route.direction" */
export type Route_Direction_Aggregate_Fields = {
  __typename?: 'route_direction_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Route_Direction_Max_Fields>;
  min?: Maybe<Route_Direction_Min_Fields>;
};


/** aggregate fields of "route.direction" */
export type Route_Direction_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Route_Direction_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.direction" */
export type Route_Direction_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Route_Direction_Max_Order_By>;
  min?: Maybe<Route_Direction_Min_Order_By>;
};

/** input type for inserting array relation for remote table "route.direction" */
export type Route_Direction_Arr_Rel_Insert_Input = {
  data: Array<Route_Direction_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Route_Direction_On_Conflict>;
};

/** Boolean expression to filter rows from the table "route.direction". All fields are combined with a logical 'AND'. */
export type Route_Direction_Bool_Exp = {
  _and?: Maybe<Array<Route_Direction_Bool_Exp>>;
  _not?: Maybe<Route_Direction_Bool_Exp>;
  _or?: Maybe<Array<Route_Direction_Bool_Exp>>;
  direction?: Maybe<String_Comparison_Exp>;
  directionByTheOppositeOfDirection?: Maybe<Route_Direction_Bool_Exp>;
  directions?: Maybe<Route_Direction_Bool_Exp>;
  the_opposite_of_direction?: Maybe<Route_Direction_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "route.direction" */
export enum Route_Direction_Constraint {
  /** unique or primary key constraint */
  DirectionPkey = 'direction_pkey'
}

export enum Route_Direction_Enum {
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
  Westbound = 'westbound'
}

/** Boolean expression to compare columns of type "route_direction_enum". All fields are combined with logical 'AND'. */
export type Route_Direction_Enum_Comparison_Exp = {
  _eq?: Maybe<Route_Direction_Enum>;
  _in?: Maybe<Array<Route_Direction_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Route_Direction_Enum>;
  _nin?: Maybe<Array<Route_Direction_Enum>>;
};

/** input type for inserting data into table "route.direction" */
export type Route_Direction_Insert_Input = {
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
  directionByTheOppositeOfDirection?: Maybe<Route_Direction_Obj_Rel_Insert_Input>;
  directions?: Maybe<Route_Direction_Arr_Rel_Insert_Input>;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<Route_Direction_Enum>;
};

/** aggregate max on columns */
export type Route_Direction_Max_Fields = {
  __typename?: 'route_direction_max_fields';
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "route.direction" */
export type Route_Direction_Max_Order_By = {
  /** The name of the route direction. */
  direction?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Route_Direction_Min_Fields = {
  __typename?: 'route_direction_min_fields';
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "route.direction" */
export type Route_Direction_Min_Order_By = {
  /** The name of the route direction. */
  direction?: Maybe<Order_By>;
};

/** response of any mutation on the table "route.direction" */
export type Route_Direction_Mutation_Response = {
  __typename?: 'route_direction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Route_Direction>;
};

/** input type for inserting object relation for remote table "route.direction" */
export type Route_Direction_Obj_Rel_Insert_Input = {
  data: Route_Direction_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Route_Direction_On_Conflict>;
};

/** on conflict condition type for table "route.direction" */
export type Route_Direction_On_Conflict = {
  constraint: Route_Direction_Constraint;
  update_columns?: Array<Route_Direction_Update_Column>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};

/** Ordering options when selecting data from "route.direction". */
export type Route_Direction_Order_By = {
  direction?: Maybe<Order_By>;
  directionByTheOppositeOfDirection?: Maybe<Route_Direction_Order_By>;
  directions_aggregate?: Maybe<Route_Direction_Aggregate_Order_By>;
  the_opposite_of_direction?: Maybe<Order_By>;
};

/** primary key columns input for table: route_direction */
export type Route_Direction_Pk_Columns_Input = {
  /** The name of the route direction. */
  direction: Scalars['String'];
};

/** select columns of table "route.direction" */
export enum Route_Direction_Select_Column {
  /** column name */
  Direction = 'direction',
  /** column name */
  TheOppositeOfDirection = 'the_opposite_of_direction'
}

/** input type for updating data in table "route.direction" */
export type Route_Direction_Set_Input = {
  /** The name of the route direction. */
  direction?: Maybe<Scalars['String']>;
  /** The opposite direction. */
  the_opposite_of_direction?: Maybe<Route_Direction_Enum>;
};

/** update columns of table "route.direction" */
export enum Route_Direction_Update_Column {
  /** column name */
  Direction = 'direction',
  /** column name */
  TheOppositeOfDirection = 'the_opposite_of_direction'
}

/**
 * The infrastructure links along which the routes are defined.
 *
 *
 * columns and relationships of "route.infrastructure_link_along_route"
 */
export type Route_Infrastructure_Link_Along_Route = {
  __typename?: 'route_infrastructure_link_along_route';
  /** An object relationship */
  infrastructure_link: Infrastructure_Network_Infrastructure_Link;
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
export type Route_Infrastructure_Link_Along_Route_Aggregate = {
  __typename?: 'route_infrastructure_link_along_route_aggregate';
  aggregate?: Maybe<Route_Infrastructure_Link_Along_Route_Aggregate_Fields>;
  nodes: Array<Route_Infrastructure_Link_Along_Route>;
};

/** aggregate fields of "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Aggregate_Fields = {
  __typename?: 'route_infrastructure_link_along_route_aggregate_fields';
  avg?: Maybe<Route_Infrastructure_Link_Along_Route_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Route_Infrastructure_Link_Along_Route_Max_Fields>;
  min?: Maybe<Route_Infrastructure_Link_Along_Route_Min_Fields>;
  stddev?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Fields>;
  stddev_pop?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Samp_Fields>;
  sum?: Maybe<Route_Infrastructure_Link_Along_Route_Sum_Fields>;
  var_pop?: Maybe<Route_Infrastructure_Link_Along_Route_Var_Pop_Fields>;
  var_samp?: Maybe<Route_Infrastructure_Link_Along_Route_Var_Samp_Fields>;
  variance?: Maybe<Route_Infrastructure_Link_Along_Route_Variance_Fields>;
};


/** aggregate fields of "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Aggregate_Order_By = {
  avg?: Maybe<Route_Infrastructure_Link_Along_Route_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Route_Infrastructure_Link_Along_Route_Max_Order_By>;
  min?: Maybe<Route_Infrastructure_Link_Along_Route_Min_Order_By>;
  stddev?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Order_By>;
  stddev_pop?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Route_Infrastructure_Link_Along_Route_Stddev_Samp_Order_By>;
  sum?: Maybe<Route_Infrastructure_Link_Along_Route_Sum_Order_By>;
  var_pop?: Maybe<Route_Infrastructure_Link_Along_Route_Var_Pop_Order_By>;
  var_samp?: Maybe<Route_Infrastructure_Link_Along_Route_Var_Samp_Order_By>;
  variance?: Maybe<Route_Infrastructure_Link_Along_Route_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Arr_Rel_Insert_Input = {
  data: Array<Route_Infrastructure_Link_Along_Route_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Route_Infrastructure_Link_Along_Route_On_Conflict>;
};

/** aggregate avg on columns */
export type Route_Infrastructure_Link_Along_Route_Avg_Fields = {
  __typename?: 'route_infrastructure_link_along_route_avg_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Avg_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "route.infrastructure_link_along_route". All fields are combined with a logical 'AND'. */
export type Route_Infrastructure_Link_Along_Route_Bool_Exp = {
  _and?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Bool_Exp>>;
  _not?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
  _or?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Bool_Exp>>;
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  infrastructure_link_sequence?: Maybe<Int_Comparison_Exp>;
  is_traversal_forwards?: Maybe<Boolean_Comparison_Exp>;
  route_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "route.infrastructure_link_along_route" */
export enum Route_Infrastructure_Link_Along_Route_Constraint {
  /** unique or primary key constraint */
  InfrastructureLinkAlongRoutePkey = 'infrastructure_link_along_route_pkey'
}

/** input type for incrementing numeric columns in table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Inc_Input = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
};

/** input type for inserting data into table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Insert_Input = {
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Obj_Rel_Insert_Input>;
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
export type Route_Infrastructure_Link_Along_Route_Max_Fields = {
  __typename?: 'route_infrastructure_link_along_route_max_fields';
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Max_Order_By = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Order_By>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
  /** The ID of the route. */
  route_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Route_Infrastructure_Link_Along_Route_Min_Fields = {
  __typename?: 'route_infrastructure_link_along_route_min_fields';
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Min_Order_By = {
  /** The ID of the infrastructure link. */
  infrastructure_link_id?: Maybe<Order_By>;
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
  /** The ID of the route. */
  route_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Mutation_Response = {
  __typename?: 'route_infrastructure_link_along_route_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Route_Infrastructure_Link_Along_Route>;
};

/** on conflict condition type for table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_On_Conflict = {
  constraint: Route_Infrastructure_Link_Along_Route_Constraint;
  update_columns?: Array<Route_Infrastructure_Link_Along_Route_Update_Column>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};

/** Ordering options when selecting data from "route.infrastructure_link_along_route". */
export type Route_Infrastructure_Link_Along_Route_Order_By = {
  infrastructure_link?: Maybe<Infrastructure_Network_Infrastructure_Link_Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
  infrastructure_link_sequence?: Maybe<Order_By>;
  is_traversal_forwards?: Maybe<Order_By>;
  route_id?: Maybe<Order_By>;
};

/** primary key columns input for table: route_infrastructure_link_along_route */
export type Route_Infrastructure_Link_Along_Route_Pk_Columns_Input = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence: Scalars['Int'];
  /** The ID of the route. */
  route_id: Scalars['uuid'];
};

/** select columns of table "route.infrastructure_link_along_route" */
export enum Route_Infrastructure_Link_Along_Route_Select_Column {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  InfrastructureLinkSequence = 'infrastructure_link_sequence',
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
  /** column name */
  RouteId = 'route_id'
}

/** input type for updating data in table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Set_Input = {
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
export type Route_Infrastructure_Link_Along_Route_Stddev_Fields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Stddev_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Route_Infrastructure_Link_Along_Route_Stddev_Pop_Fields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_pop_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Stddev_Pop_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Route_Infrastructure_Link_Along_Route_Stddev_Samp_Fields = {
  __typename?: 'route_infrastructure_link_along_route_stddev_samp_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Stddev_Samp_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Route_Infrastructure_Link_Along_Route_Sum_Fields = {
  __typename?: 'route_infrastructure_link_along_route_sum_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Sum_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** update columns of table "route.infrastructure_link_along_route" */
export enum Route_Infrastructure_Link_Along_Route_Update_Column {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  InfrastructureLinkSequence = 'infrastructure_link_sequence',
  /** column name */
  IsTraversalForwards = 'is_traversal_forwards',
  /** column name */
  RouteId = 'route_id'
}

/** aggregate var_pop on columns */
export type Route_Infrastructure_Link_Along_Route_Var_Pop_Fields = {
  __typename?: 'route_infrastructure_link_along_route_var_pop_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Var_Pop_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Route_Infrastructure_Link_Along_Route_Var_Samp_Fields = {
  __typename?: 'route_infrastructure_link_along_route_var_samp_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Var_Samp_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Route_Infrastructure_Link_Along_Route_Variance_Fields = {
  __typename?: 'route_infrastructure_link_along_route_variance_fields';
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "route.infrastructure_link_along_route" */
export type Route_Infrastructure_Link_Along_Route_Variance_Order_By = {
  /** The order of the infrastructure link within the journey pattern. */
  infrastructure_link_sequence?: Maybe<Order_By>;
};

/**
 * The line from Transmodel: http://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:487
 *
 *
 * columns and relationships of "route.line"
 */
export type Route_Line = {
  __typename?: 'route_line';
  /** The description of the line. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id: Scalars['uuid'];
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n: Scalars['String'];
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** aggregated selection of "route.line" */
export type Route_Line_Aggregate = {
  __typename?: 'route_line_aggregate';
  aggregate?: Maybe<Route_Line_Aggregate_Fields>;
  nodes: Array<Route_Line>;
};

/** aggregate fields of "route.line" */
export type Route_Line_Aggregate_Fields = {
  __typename?: 'route_line_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Route_Line_Max_Fields>;
  min?: Maybe<Route_Line_Min_Fields>;
};


/** aggregate fields of "route.line" */
export type Route_Line_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Route_Line_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "route.line". All fields are combined with a logical 'AND'. */
export type Route_Line_Bool_Exp = {
  _and?: Maybe<Array<Route_Line_Bool_Exp>>;
  _not?: Maybe<Route_Line_Bool_Exp>;
  _or?: Maybe<Array<Route_Line_Bool_Exp>>;
  description_i18n?: Maybe<String_Comparison_Exp>;
  line_id?: Maybe<Uuid_Comparison_Exp>;
  name_i18n?: Maybe<String_Comparison_Exp>;
  primary_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum_Comparison_Exp>;
  short_name_i18n?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "route.line" */
export enum Route_Line_Constraint {
  /** unique or primary key constraint */
  LinePkey = 'line_pkey'
}

/** input type for inserting data into table "route.line" */
export type Route_Line_Insert_Input = {
  /** The description of the line. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['String']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Route_Line_Max_Fields = {
  __typename?: 'route_line_max_fields';
  /** The description of the line. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['String']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Route_Line_Min_Fields = {
  __typename?: 'route_line_min_fields';
  /** The description of the line. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['String']>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "route.line" */
export type Route_Line_Mutation_Response = {
  __typename?: 'route_line_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Route_Line>;
};

/** on conflict condition type for table "route.line" */
export type Route_Line_On_Conflict = {
  constraint: Route_Line_Constraint;
  update_columns?: Array<Route_Line_Update_Column>;
  where?: Maybe<Route_Line_Bool_Exp>;
};

/** Ordering options when selecting data from "route.line". */
export type Route_Line_Order_By = {
  description_i18n?: Maybe<Order_By>;
  line_id?: Maybe<Order_By>;
  name_i18n?: Maybe<Order_By>;
  primary_vehicle_mode?: Maybe<Order_By>;
  short_name_i18n?: Maybe<Order_By>;
};

/** primary key columns input for table: route_line */
export type Route_Line_Pk_Columns_Input = {
  /** The ID of the line. */
  line_id: Scalars['uuid'];
};

/** select columns of table "route.line" */
export enum Route_Line_Select_Column {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  LineId = 'line_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  PrimaryVehicleMode = 'primary_vehicle_mode',
  /** column name */
  ShortNameI18n = 'short_name_i18n'
}

/** input type for updating data in table "route.line" */
export type Route_Line_Set_Input = {
  /** The description of the line. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The ID of the line. */
  line_id?: Maybe<Scalars['uuid']>;
  /** The name of the line. Placeholder for multilingual strings. */
  name_i18n?: Maybe<Scalars['String']>;
  /** The mode of the vehicles used as primary on the line. */
  primary_vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
  /** The shorted name of the line. Placeholder for multilingual strings. */
  short_name_i18n?: Maybe<Scalars['String']>;
};

/** update columns of table "route.line" */
export enum Route_Line_Update_Column {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  LineId = 'line_id',
  /** column name */
  NameI18n = 'name_i18n',
  /** column name */
  PrimaryVehicleMode = 'primary_vehicle_mode',
  /** column name */
  ShortNameI18n = 'short_name_i18n'
}

/**
 * The routes from Transmodel: https://www.transmodel-cen.eu/model/index.htm?goto=2:1:3:483
 *
 *
 * columns and relationships of "route.route"
 */
export type Route_Route = {
  __typename?: 'route_route';
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The scheduled stop point where the route ends at. */
  ends_at_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the shape of the route. */
  route_shape?: Maybe<Scalars['geography']>;
  /** The scheduled stop point where the route starts from. */
  starts_from_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "route.route" */
export type Route_Route_Aggregate = {
  __typename?: 'route_route_aggregate';
  aggregate?: Maybe<Route_Route_Aggregate_Fields>;
  nodes: Array<Route_Route>;
};

/** aggregate fields of "route.route" */
export type Route_Route_Aggregate_Fields = {
  __typename?: 'route_route_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Route_Route_Max_Fields>;
  min?: Maybe<Route_Route_Min_Fields>;
};


/** aggregate fields of "route.route" */
export type Route_Route_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Route_Route_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "route.route". All fields are combined with a logical 'AND'. */
export type Route_Route_Bool_Exp = {
  _and?: Maybe<Array<Route_Route_Bool_Exp>>;
  _not?: Maybe<Route_Route_Bool_Exp>;
  _or?: Maybe<Array<Route_Route_Bool_Exp>>;
  description_i18n?: Maybe<String_Comparison_Exp>;
  ends_at_scheduled_stop_point_id?: Maybe<Uuid_Comparison_Exp>;
  on_line_id?: Maybe<Uuid_Comparison_Exp>;
  route_id?: Maybe<Uuid_Comparison_Exp>;
  route_shape?: Maybe<Geography_Comparison_Exp>;
  starts_from_scheduled_stop_point_id?: Maybe<Uuid_Comparison_Exp>;
};

/** input type for inserting data into table "route.route" */
export type Route_Route_Insert_Input = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The scheduled stop point where the route ends at. */
  ends_at_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the shape of the route. */
  route_shape?: Maybe<Scalars['geography']>;
  /** The scheduled stop point where the route starts from. */
  starts_from_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Route_Route_Max_Fields = {
  __typename?: 'route_route_max_fields';
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The scheduled stop point where the route ends at. */
  ends_at_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The scheduled stop point where the route starts from. */
  starts_from_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Route_Route_Min_Fields = {
  __typename?: 'route_route_min_fields';
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The scheduled stop point where the route ends at. */
  ends_at_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** The scheduled stop point where the route starts from. */
  starts_from_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "route.route" */
export type Route_Route_Mutation_Response = {
  __typename?: 'route_route_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Route_Route>;
};

/** Ordering options when selecting data from "route.route". */
export type Route_Route_Order_By = {
  description_i18n?: Maybe<Order_By>;
  ends_at_scheduled_stop_point_id?: Maybe<Order_By>;
  on_line_id?: Maybe<Order_By>;
  route_id?: Maybe<Order_By>;
  route_shape?: Maybe<Order_By>;
  starts_from_scheduled_stop_point_id?: Maybe<Order_By>;
};

/** select columns of table "route.route" */
export enum Route_Route_Select_Column {
  /** column name */
  DescriptionI18n = 'description_i18n',
  /** column name */
  EndsAtScheduledStopPointId = 'ends_at_scheduled_stop_point_id',
  /** column name */
  OnLineId = 'on_line_id',
  /** column name */
  RouteId = 'route_id',
  /** column name */
  RouteShape = 'route_shape',
  /** column name */
  StartsFromScheduledStopPointId = 'starts_from_scheduled_stop_point_id'
}

/** input type for updating data in table "route.route" */
export type Route_Route_Set_Input = {
  /** The description of the route in the form of starting location - destination. Placeholder for multilingual strings. */
  description_i18n?: Maybe<Scalars['String']>;
  /** The scheduled stop point where the route ends at. */
  ends_at_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The line to which this route belongs. */
  on_line_id?: Maybe<Scalars['uuid']>;
  /** The ID of the route. */
  route_id?: Maybe<Scalars['uuid']>;
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the shape of the route. */
  route_shape?: Maybe<Scalars['geography']>;
  /** The scheduled stop point where the route starts from. */
  starts_from_scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/**
 * The scheduled stop points: https://www.transmodel-cen.eu/model/index.htm?goto=2:3:4:845 . Colloquially known as stops from the perspective of timetable planning.
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point"
 */
export type Service_Pattern_Scheduled_Stop_Point = {
  __typename?: 'service_pattern_scheduled_stop_point';
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Aggregate = {
  __typename?: 'service_pattern_scheduled_stop_point_aggregate';
  aggregate?: Maybe<Service_Pattern_Scheduled_Stop_Point_Aggregate_Fields>;
  nodes: Array<Service_Pattern_Scheduled_Stop_Point>;
};

/** aggregate fields of "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Aggregate_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_aggregate_fields';
  avg?: Maybe<Service_Pattern_Scheduled_Stop_Point_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Service_Pattern_Scheduled_Stop_Point_Max_Fields>;
  min?: Maybe<Service_Pattern_Scheduled_Stop_Point_Min_Fields>;
  stddev?: Maybe<Service_Pattern_Scheduled_Stop_Point_Stddev_Fields>;
  stddev_pop?: Maybe<Service_Pattern_Scheduled_Stop_Point_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Service_Pattern_Scheduled_Stop_Point_Stddev_Samp_Fields>;
  sum?: Maybe<Service_Pattern_Scheduled_Stop_Point_Sum_Fields>;
  var_pop?: Maybe<Service_Pattern_Scheduled_Stop_Point_Var_Pop_Fields>;
  var_samp?: Maybe<Service_Pattern_Scheduled_Stop_Point_Var_Samp_Fields>;
  variance?: Maybe<Service_Pattern_Scheduled_Stop_Point_Variance_Fields>;
};


/** aggregate fields of "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Service_Pattern_Scheduled_Stop_Point_Avg_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_avg_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point". All fields are combined with a logical 'AND'. */
export type Service_Pattern_Scheduled_Stop_Point_Bool_Exp = {
  _and?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>>;
  _not?: Maybe<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>;
  _or?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>>;
  closest_point_on_infrastructure_link?: Maybe<Geography_Comparison_Exp>;
  direction?: Maybe<String_Comparison_Exp>;
  label?: Maybe<String_Comparison_Exp>;
  located_on_infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  measured_location?: Maybe<Geography_Comparison_Exp>;
  relative_distance_from_infrastructure_link_start?: Maybe<Float8_Comparison_Exp>;
  scheduled_stop_point_id?: Maybe<Uuid_Comparison_Exp>;
};

/** input type for incrementing numeric columns in table "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Inc_Input = {
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
};

/** input type for inserting data into table "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Insert_Input = {
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Service_Pattern_Scheduled_Stop_Point_Max_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_max_fields';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Service_Pattern_Scheduled_Stop_Point_Min_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_min_fields';
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Mutation_Response = {
  __typename?: 'service_pattern_scheduled_stop_point_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Service_Pattern_Scheduled_Stop_Point>;
};

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point". */
export type Service_Pattern_Scheduled_Stop_Point_Order_By = {
  closest_point_on_infrastructure_link?: Maybe<Order_By>;
  direction?: Maybe<Order_By>;
  label?: Maybe<Order_By>;
  located_on_infrastructure_link_id?: Maybe<Order_By>;
  measured_location?: Maybe<Order_By>;
  relative_distance_from_infrastructure_link_start?: Maybe<Order_By>;
  scheduled_stop_point_id?: Maybe<Order_By>;
};

/** select columns of table "service_pattern.scheduled_stop_point" */
export enum Service_Pattern_Scheduled_Stop_Point_Select_Column {
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
  RelativeDistanceFromInfrastructureLinkStart = 'relative_distance_from_infrastructure_link_start',
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id'
}

/**
 * Which scheduled stop points are serviced by which vehicle modes?
 *
 *
 * columns and relationships of "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode"
 */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** An object relationship */
  vehicleModeByVehicleMode: Reusable_Components_Vehicle_Mode;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
};

/** aggregated selection of "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_aggregate';
  aggregate?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate_Fields>;
  nodes: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
};

/** aggregate fields of "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Max_Fields>;
  min?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Min_Fields>;
};


/** aggregate fields of "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Max_Order_By>;
  min?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Min_Order_By>;
};

/** input type for inserting array relation for remote table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Arr_Rel_Insert_Input = {
  data: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_On_Conflict>;
};

/** Boolean expression to filter rows from the table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode". All fields are combined with a logical 'AND'. */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp = {
  _and?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>>;
  _not?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
  _or?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>>;
  scheduled_stop_point_id?: Maybe<Uuid_Comparison_Exp>;
  vehicleModeByVehicleMode?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum_Comparison_Exp>;
};

/** unique or primary key constraints on table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export enum Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Constraint {
  /** unique or primary key constraint */
  ScheduledStopPointServicedByVehicleModePkey = 'scheduled_stop_point_serviced_by_vehicle_mode_pkey'
}

/** input type for inserting data into table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Insert_Input = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  vehicleModeByVehicleMode?: Maybe<Reusable_Components_Vehicle_Mode_Obj_Rel_Insert_Input>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
};

/** aggregate max on columns */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Max_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_max_fields';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Max_Order_By = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Min_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_min_fields';
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Min_Order_By = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Mutation_Response = {
  __typename?: 'service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
};

/** on conflict condition type for table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_On_Conflict = {
  constraint: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Constraint;
  update_columns?: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Update_Column>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};

/** Ordering options when selecting data from "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode". */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By = {
  scheduled_stop_point_id?: Maybe<Order_By>;
  vehicleModeByVehicleMode?: Maybe<Reusable_Components_Vehicle_Mode_Order_By>;
  vehicle_mode?: Maybe<Order_By>;
};

/** primary key columns input for table: service_pattern_scheduled_stop_point_serviced_by_vehicle_mode */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Pk_Columns_Input = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id: Scalars['uuid'];
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
};

/** select columns of table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export enum Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column {
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  VehicleMode = 'vehicle_mode'
}

/** input type for updating data in table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export type Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Set_Input = {
  /** The scheduled stop point that is serviced by the vehicle mode. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
  /** The vehicle mode servicing the scheduled stop point. */
  vehicle_mode?: Maybe<Reusable_Components_Vehicle_Mode_Enum>;
};

/** update columns of table "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
export enum Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Update_Column {
  /** column name */
  ScheduledStopPointId = 'scheduled_stop_point_id',
  /** column name */
  VehicleMode = 'vehicle_mode'
}

/** input type for updating data in table "service_pattern.scheduled_stop_point" */
export type Service_Pattern_Scheduled_Stop_Point_Set_Input = {
  /** The point on the infrastructure link closest to measured_location. A PostGIS PointZ geography in EPSG:4326. */
  closest_point_on_infrastructure_link?: Maybe<Scalars['geography']>;
  /** The direction(s) of traffic with respect to the digitization, i.e. the direction of the specified line string. */
  direction?: Maybe<Scalars['String']>;
  /** The label is the short code that identifies the stop to the passengers. There can be at most one stop with the same label at a time. The label matches the GTFS stop_code. */
  label?: Maybe<Scalars['String']>;
  /** The infrastructure link on which the stop is located. */
  located_on_infrastructure_link_id?: Maybe<Scalars['uuid']>;
  /** The measured location describes the physical location of the stop. For some stops this describes the location of the pole-mounted flag. A PostGIS PointZ geography in EPSG:4326. */
  measured_location?: Maybe<Scalars['geography']>;
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
  /** The ID of the scheduled stop point. */
  scheduled_stop_point_id?: Maybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type Service_Pattern_Scheduled_Stop_Point_Stddev_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Service_Pattern_Scheduled_Stop_Point_Stddev_Pop_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_pop_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Service_Pattern_Scheduled_Stop_Point_Stddev_Samp_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_stddev_samp_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** aggregate sum on columns */
export type Service_Pattern_Scheduled_Stop_Point_Sum_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_sum_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['float8']>;
};

/** aggregate var_pop on columns */
export type Service_Pattern_Scheduled_Stop_Point_Var_Pop_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_pop_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Service_Pattern_Scheduled_Stop_Point_Var_Samp_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_var_samp_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Service_Pattern_Scheduled_Stop_Point_Variance_Fields = {
  __typename?: 'service_pattern_scheduled_stop_point_variance_fields';
  /** The relative distance of the stop from the start of the linestring along the infrastructure link. Regardless of the specified direction, this value is the distance from the beginning of the linestring. The distance is normalized to the closed interval [0, 1]. */
  relative_distance_from_infrastructure_link_start?: Maybe<Scalars['Float']>;
};

export type St_D_Within_Geography_Input = {
  distance: Scalars['Float'];
  from: Scalars['geography'];
  use_spheroid?: Maybe<Scalars['Boolean']>;
};

export type St_D_Within_Input = {
  distance: Scalars['Float'];
  from: Scalars['geometry'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "infrastructure_network.direction" */
  infrastructure_network_direction: Array<Infrastructure_Network_Direction>;
  /** fetch aggregated fields from the table: "infrastructure_network.direction" */
  infrastructure_network_direction_aggregate: Infrastructure_Network_Direction_Aggregate;
  /** fetch data from the table: "infrastructure_network.direction" using primary key columns */
  infrastructure_network_direction_by_pk?: Maybe<Infrastructure_Network_Direction>;
  /** fetch data from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source: Array<Infrastructure_Network_External_Source>;
  /** fetch aggregated fields from the table: "infrastructure_network.external_source" */
  infrastructure_network_external_source_aggregate: Infrastructure_Network_External_Source_Aggregate;
  /** fetch data from the table: "infrastructure_network.external_source" using primary key columns */
  infrastructure_network_external_source_by_pk?: Maybe<Infrastructure_Network_External_Source>;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link: Array<Infrastructure_Network_Infrastructure_Link>;
  /** fetch aggregated fields from the table: "infrastructure_network.infrastructure_link" */
  infrastructure_network_infrastructure_link_aggregate: Infrastructure_Network_Infrastructure_Link_Aggregate;
  /** fetch data from the table: "infrastructure_network.infrastructure_link" using primary key columns */
  infrastructure_network_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Infrastructure_Link>;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** fetch aggregated fields from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
  infrastructure_network_vehicle_submode_on_infrastructure_link_aggregate: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Aggregate;
  /** fetch data from the table: "infrastructure_network.vehicle_submode_on_infrastructure_link" using primary key columns */
  infrastructure_network_vehicle_submode_on_infrastructure_link_by_pk?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
  /** fetch data from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern: Array<Journey_Pattern_Journey_Pattern>;
  /** fetch aggregated fields from the table: "journey_pattern.journey_pattern" */
  journey_pattern_journey_pattern_aggregate: Journey_Pattern_Journey_Pattern_Aggregate;
  /** fetch data from the table: "journey_pattern.journey_pattern" using primary key columns */
  journey_pattern_journey_pattern_by_pk?: Maybe<Journey_Pattern_Journey_Pattern>;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern: Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** fetch aggregated fields from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" */
  journey_pattern_scheduled_stop_point_in_journey_pattern_aggregate: Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Aggregate;
  /** fetch data from the table: "journey_pattern.scheduled_stop_point_in_journey_pattern" using primary key columns */
  journey_pattern_scheduled_stop_point_in_journey_pattern_by_pk?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern>;
  /** fetch data from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode: Array<Reusable_Components_Vehicle_Mode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_mode" */
  reusable_components_vehicle_mode_aggregate: Reusable_Components_Vehicle_Mode_Aggregate;
  /** fetch data from the table: "reusable_components.vehicle_mode" using primary key columns */
  reusable_components_vehicle_mode_by_pk?: Maybe<Reusable_Components_Vehicle_Mode>;
  /** fetch data from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode: Array<Reusable_Components_Vehicle_Submode>;
  /** fetch aggregated fields from the table: "reusable_components.vehicle_submode" */
  reusable_components_vehicle_submode_aggregate: Reusable_Components_Vehicle_Submode_Aggregate;
  /** fetch data from the table: "reusable_components.vehicle_submode" using primary key columns */
  reusable_components_vehicle_submode_by_pk?: Maybe<Reusable_Components_Vehicle_Submode>;
  /** fetch data from the table: "route.direction" */
  route_direction: Array<Route_Direction>;
  /** fetch aggregated fields from the table: "route.direction" */
  route_direction_aggregate: Route_Direction_Aggregate;
  /** fetch data from the table: "route.direction" using primary key columns */
  route_direction_by_pk?: Maybe<Route_Direction>;
  /** fetch data from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route: Array<Route_Infrastructure_Link_Along_Route>;
  /** fetch aggregated fields from the table: "route.infrastructure_link_along_route" */
  route_infrastructure_link_along_route_aggregate: Route_Infrastructure_Link_Along_Route_Aggregate;
  /** fetch data from the table: "route.infrastructure_link_along_route" using primary key columns */
  route_infrastructure_link_along_route_by_pk?: Maybe<Route_Infrastructure_Link_Along_Route>;
  /** fetch data from the table: "route.line" */
  route_line: Array<Route_Line>;
  /** fetch aggregated fields from the table: "route.line" */
  route_line_aggregate: Route_Line_Aggregate;
  /** fetch data from the table: "route.line" using primary key columns */
  route_line_by_pk?: Maybe<Route_Line>;
  /** fetch data from the table: "route.route" */
  route_route: Array<Route_Route>;
  /** fetch aggregated fields from the table: "route.route" */
  route_route_aggregate: Route_Route_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point: Array<Service_Pattern_Scheduled_Stop_Point>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point" */
  service_pattern_scheduled_stop_point_aggregate: Service_Pattern_Scheduled_Stop_Point_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode: Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
  /** fetch aggregated fields from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_aggregate: Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Aggregate;
  /** fetch data from the table: "service_pattern.scheduled_stop_point_serviced_by_vehicle_mode" using primary key columns */
  service_pattern_scheduled_stop_point_serviced_by_vehicle_mode_by_pk?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode>;
};


export type Subscription_RootInfrastructure_Network_DirectionArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Direction_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootInfrastructure_Network_External_SourceArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_External_Source_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_External_Source_By_PkArgs = {
  value: Scalars['String'];
};


export type Subscription_RootInfrastructure_Network_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};


export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
  vehicle_submode: Reusable_Components_Vehicle_Submode_Enum;
};


export type Subscription_RootJourney_Pattern_Journey_PatternArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
};


export type Subscription_RootJourney_Pattern_Journey_Pattern_AggregateArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Journey_Pattern_Bool_Exp>;
};


export type Subscription_RootJourney_Pattern_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
};


export type Subscription_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_PatternArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};


export type Subscription_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_AggregateArgs = {
  distinct_on?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Order_By>>;
  where?: Maybe<Journey_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_Bool_Exp>;
};


export type Subscription_RootJourney_Pattern_Scheduled_Stop_Point_In_Journey_Pattern_By_PkArgs = {
  journey_pattern_id: Scalars['uuid'];
  scheduled_stop_point_sequence: Scalars['Int'];
};


export type Subscription_RootReusable_Components_Vehicle_ModeArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Mode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
};


export type Subscription_RootReusable_Components_Vehicle_Mode_AggregateArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Mode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Mode_Bool_Exp>;
};


export type Subscription_RootReusable_Components_Vehicle_Mode_By_PkArgs = {
  vehicle_mode: Scalars['String'];
};


export type Subscription_RootReusable_Components_Vehicle_SubmodeArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};


export type Subscription_RootReusable_Components_Vehicle_Submode_AggregateArgs = {
  distinct_on?: Maybe<Array<Reusable_Components_Vehicle_Submode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Reusable_Components_Vehicle_Submode_Order_By>>;
  where?: Maybe<Reusable_Components_Vehicle_Submode_Bool_Exp>;
};


export type Subscription_RootReusable_Components_Vehicle_Submode_By_PkArgs = {
  vehicle_submode: Scalars['String'];
};


export type Subscription_RootRoute_DirectionArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};


export type Subscription_RootRoute_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Direction_Order_By>>;
  where?: Maybe<Route_Direction_Bool_Exp>;
};


export type Subscription_RootRoute_Direction_By_PkArgs = {
  direction: Scalars['String'];
};


export type Subscription_RootRoute_Infrastructure_Link_Along_RouteArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


export type Subscription_RootRoute_Infrastructure_Link_Along_Route_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Infrastructure_Link_Along_Route_Order_By>>;
  where?: Maybe<Route_Infrastructure_Link_Along_Route_Bool_Exp>;
};


export type Subscription_RootRoute_Infrastructure_Link_Along_Route_By_PkArgs = {
  infrastructure_link_sequence: Scalars['Int'];
  route_id: Scalars['uuid'];
};


export type Subscription_RootRoute_LineArgs = {
  distinct_on?: Maybe<Array<Route_Line_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Line_Order_By>>;
  where?: Maybe<Route_Line_Bool_Exp>;
};


export type Subscription_RootRoute_Line_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Line_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Line_Order_By>>;
  where?: Maybe<Route_Line_Bool_Exp>;
};


export type Subscription_RootRoute_Line_By_PkArgs = {
  line_id: Scalars['uuid'];
};


export type Subscription_RootRoute_RouteArgs = {
  distinct_on?: Maybe<Array<Route_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Route_Order_By>>;
  where?: Maybe<Route_Route_Bool_Exp>;
};


export type Subscription_RootRoute_Route_AggregateArgs = {
  distinct_on?: Maybe<Array<Route_Route_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Route_Route_Order_By>>;
  where?: Maybe<Route_Route_Bool_Exp>;
};


export type Subscription_RootService_Pattern_Scheduled_Stop_PointArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>;
};


export type Subscription_RootService_Pattern_Scheduled_Stop_Point_AggregateArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Bool_Exp>;
};


export type Subscription_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_ModeArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


export type Subscription_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_AggregateArgs = {
  distinct_on?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Order_By>>;
  where?: Maybe<Service_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_Bool_Exp>;
};


export type Subscription_RootService_Pattern_Scheduled_Stop_Point_Serviced_By_Vehicle_Mode_By_PkArgs = {
  scheduled_stop_point_id: Scalars['uuid'];
  vehicle_mode: Reusable_Components_Vehicle_Mode_Enum;
};


/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
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

export type MyQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MyQueryQuery = (
  { __typename?: 'query_root' }
  & { infrastructure_network_direction: Array<(
    { __typename?: 'infrastructure_network_direction' }
    & Pick<Infrastructure_Network_Direction, 'value'>
  )> }
);


export const MyQueryDocument = gql`
    query MyQuery {
  infrastructure_network_direction {
    value
  }
}
    `;

/**
 * __useMyQueryQuery__
 *
 * To run a query within a React component, call `useMyQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyQueryQuery(baseOptions?: Apollo.QueryHookOptions<MyQueryQuery, MyQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyQueryQuery, MyQueryQueryVariables>(MyQueryDocument, options);
      }
export function useMyQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyQueryQuery, MyQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyQueryQuery, MyQueryQueryVariables>(MyQueryDocument, options);
        }
export type MyQueryQueryHookResult = ReturnType<typeof useMyQueryQuery>;
export type MyQueryLazyQueryHookResult = ReturnType<typeof useMyQueryLazyQuery>;
export type MyQueryQueryResult = Apollo.QueryResult<MyQueryQuery, MyQueryQueryVariables>;