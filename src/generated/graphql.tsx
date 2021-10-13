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

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};


/** expression to compare columns of type float8. All fields are combined with logical 'AND'. */
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


/** Expression to compare the result of casting a column of type geography. Multiple cast targets are combined with logical 'AND'. */
export type Geography_Cast_Exp = {
  geometry?: Maybe<Geometry_Comparison_Exp>;
};

/** expression to compare columns of type geography. All fields are combined with logical 'AND'. */
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
  /** is the column within a distance from a geography value */
  _st_d_within?: Maybe<St_D_Within_Geography_Input>;
  /** does the column spatially intersect the given geography value */
  _st_intersects?: Maybe<Scalars['geography']>;
};


/** Expression to compare the result of casting a column of type geometry. Multiple cast targets are combined with logical 'AND'. */
export type Geometry_Cast_Exp = {
  geography?: Maybe<Geography_Comparison_Exp>;
};

/** expression to compare columns of type geometry. All fields are combined with logical 'AND'. */
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
  /** does the column contain the given geometry value */
  _st_contains?: Maybe<Scalars['geometry']>;
  /** does the column crosses the given geometry value */
  _st_crosses?: Maybe<Scalars['geometry']>;
  /** is the column within a distance from a geometry value */
  _st_d_within?: Maybe<St_D_Within_Input>;
  /** is the column equal to given geometry value. Directionality is ignored */
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
  value: Scalars['String'];
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Infrastructure_Network_Direction_Max_Fields>;
  min?: Maybe<Infrastructure_Network_Direction_Min_Fields>;
};


/** aggregate fields of "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Infrastructure_Network_Direction_Max_Order_By>;
  min?: Maybe<Infrastructure_Network_Direction_Min_Order_By>;
};

/** input type for inserting array relation for remote table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Arr_Rel_Insert_Input = {
  data: Array<Infrastructure_Network_Direction_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_Direction_On_Conflict>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.direction". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Direction_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Infrastructure_Network_Direction_Bool_Exp>>>;
  _not?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Infrastructure_Network_Direction_Bool_Exp>>>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.direction" */
export enum Infrastructure_Network_Direction_Constraint {
  /** unique or primary key constraint */
  DirectionPkey = 'direction_pkey'
}

/** input type for inserting data into table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Insert_Input = {
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Direction_Max_Fields = {
  __typename?: 'infrastructure_network_direction_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Max_Order_By = {
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Direction_Min_Fields = {
  __typename?: 'infrastructure_network_direction_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Min_Order_By = {
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Mutation_Response = {
  __typename?: 'infrastructure_network_direction_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Infrastructure_Network_Direction>;
};

/** input type for inserting object relation for remote table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_Direction_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Direction_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_On_Conflict = {
  constraint: Infrastructure_Network_Direction_Constraint;
  update_columns: Array<Infrastructure_Network_Direction_Update_Column>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};

/** ordering options when selecting data from "infrastructure_network.direction" */
export type Infrastructure_Network_Direction_Order_By = {
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "infrastructure_network.direction" */
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
  value: Scalars['String'];
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
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Infrastructure_Network_External_Source_Max_Fields>;
  min?: Maybe<Infrastructure_Network_External_Source_Min_Fields>;
};


/** aggregate fields of "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Infrastructure_Network_External_Source_Max_Order_By>;
  min?: Maybe<Infrastructure_Network_External_Source_Min_Order_By>;
};

/** input type for inserting array relation for remote table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Arr_Rel_Insert_Input = {
  data: Array<Infrastructure_Network_External_Source_Insert_Input>;
  on_conflict?: Maybe<Infrastructure_Network_External_Source_On_Conflict>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.external_source". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_External_Source_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Infrastructure_Network_External_Source_Bool_Exp>>>;
  _not?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Infrastructure_Network_External_Source_Bool_Exp>>>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.external_source" */
export enum Infrastructure_Network_External_Source_Constraint {
  /** unique or primary key constraint */
  ExternalSourcePkey = 'external_source_pkey'
}

/** input type for inserting data into table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Insert_Input = {
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_External_Source_Max_Fields = {
  __typename?: 'infrastructure_network_external_source_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Max_Order_By = {
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_External_Source_Min_Fields = {
  __typename?: 'infrastructure_network_external_source_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Min_Order_By = {
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Mutation_Response = {
  __typename?: 'infrastructure_network_external_source_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Infrastructure_Network_External_Source>;
};

/** input type for inserting object relation for remote table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_External_Source_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_External_Source_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_On_Conflict = {
  constraint: Infrastructure_Network_External_Source_Constraint;
  update_columns: Array<Infrastructure_Network_External_Source_Update_Column>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};

/** ordering options when selecting data from "infrastructure_network.external_source" */
export type Infrastructure_Network_External_Source_Order_By = {
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "infrastructure_network.external_source" */
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
  direction: Scalars['String'];
  /** The estimated length of the infrastructure link in metres. */
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id: Scalars['String'];
  external_link_source: Scalars['String'];
  /** The ID of the infrastructure link. */
  infrastructure_link_id: Scalars['uuid'];
  /** A PostGIS LinestringZ geography in EPSG:4326 describing the infrastructure link. */
  shape: Scalars['geography'];
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
  count?: Maybe<Scalars['Int']>;
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
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};

/** aggregate avg on columns */
export type Infrastructure_Network_Infrastructure_Link_Avg_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_avg_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Avg_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.infrastructure_link". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Infrastructure_Link_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>>>;
  _not?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>>>;
  direction?: Maybe<String_Comparison_Exp>;
  estimated_length_in_metres?: Maybe<Float8_Comparison_Exp>;
  external_link_id?: Maybe<String_Comparison_Exp>;
  external_link_source?: Maybe<String_Comparison_Exp>;
  infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  shape?: Maybe<Geography_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.infrastructure_link" */
export enum Infrastructure_Network_Infrastructure_Link_Constraint {
  /** unique or primary key constraint */
  InfrastructureLinkExternalLinkIdExternalLinkSourceIdx = 'infrastructure_link_external_link_id_external_link_source_idx',
  /** unique or primary key constraint */
  InfrastructureLinkPkey = 'infrastructure_link_pkey'
}

/** input type for incrementing integer column in table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Inc_Input = {
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** input type for inserting data into table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Insert_Input = {
  direction?: Maybe<Scalars['String']>;
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Scalars['String']>;
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  shape?: Maybe<Scalars['geography']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Infrastructure_Link_Max_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_max_fields';
  direction?: Maybe<Scalars['String']>;
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Scalars['String']>;
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Max_Order_By = {
  direction?: Maybe<Order_By>;
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  external_link_source?: Maybe<Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Infrastructure_Link_Min_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_min_fields';
  direction?: Maybe<Scalars['String']>;
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Scalars['String']>;
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Min_Order_By = {
  direction?: Maybe<Order_By>;
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  external_link_source?: Maybe<Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Mutation_Response = {
  __typename?: 'infrastructure_network_infrastructure_link_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Infrastructure_Network_Infrastructure_Link>;
};

/** input type for inserting object relation for remote table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_Infrastructure_Link_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Infrastructure_Link_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_On_Conflict = {
  constraint: Infrastructure_Network_Infrastructure_Link_Constraint;
  update_columns: Array<Infrastructure_Network_Infrastructure_Link_Update_Column>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};

/** ordering options when selecting data from "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Order_By = {
  direction?: Maybe<Order_By>;
  estimated_length_in_metres?: Maybe<Order_By>;
  external_link_id?: Maybe<Order_By>;
  external_link_source?: Maybe<Order_By>;
  infrastructure_link_id?: Maybe<Order_By>;
  shape?: Maybe<Order_By>;
};

/** primary key columns input for table: "infrastructure_network.infrastructure_link" */
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
  direction?: Maybe<Scalars['String']>;
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
  external_link_id?: Maybe<Scalars['String']>;
  external_link_source?: Maybe<Scalars['String']>;
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  shape?: Maybe<Scalars['geography']>;
};

/** aggregate stddev on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_pop_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Pop_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_stddev_samp_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Stddev_Samp_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Infrastructure_Network_Infrastructure_Link_Sum_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_sum_fields';
  estimated_length_in_metres?: Maybe<Scalars['float8']>;
};

/** order by sum() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Sum_Order_By = {
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
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Var_Pop_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Infrastructure_Network_Infrastructure_Link_Var_Samp_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_var_samp_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Var_Samp_Order_By = {
  estimated_length_in_metres?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Infrastructure_Network_Infrastructure_Link_Variance_Fields = {
  __typename?: 'infrastructure_network_infrastructure_link_variance_fields';
  estimated_length_in_metres?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "infrastructure_network.infrastructure_link" */
export type Infrastructure_Network_Infrastructure_Link_Variance_Order_By = {
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
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id: Scalars['uuid'];
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode: Scalars['String'];
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
  count?: Maybe<Scalars['Int']>;
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
  on_conflict?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict>;
};

/** Boolean expression to filter rows from the table "infrastructure_network.vehicle_submode_on_infrastructure_link". All fields are combined with a logical 'AND'. */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>>>;
  _not?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>>>;
  infrastructure_link_id?: Maybe<Uuid_Comparison_Exp>;
  vehicle_submode?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Constraint {
  /** unique or primary key constraint */
  VehicleSubmodeOnInfrastructureLinkPkey = 'vehicle_submode_on_infrastructure_link_pkey'
}

/** input type for inserting data into table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input = {
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Fields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_max_fields';
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Max_Order_By = {
  infrastructure_link_id?: Maybe<Order_By>;
  vehicle_submode?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Fields = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_min_fields';
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Min_Order_By = {
  infrastructure_link_id?: Maybe<Order_By>;
  vehicle_submode?: Maybe<Order_By>;
};

/** response of any mutation on the table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Mutation_Response = {
  __typename?: 'infrastructure_network_vehicle_submode_on_infrastructure_link_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link>;
};

/** input type for inserting object relation for remote table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Obj_Rel_Insert_Input = {
  data: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Insert_Input;
  on_conflict?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict>;
};

/** on conflict condition type for table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_On_Conflict = {
  constraint: Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Constraint;
  update_columns: Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Update_Column>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};

/** ordering options when selecting data from "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By = {
  infrastructure_link_id?: Maybe<Order_By>;
  vehicle_submode?: Maybe<Order_By>;
};

/** primary key columns input for table: "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export type Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Pk_Columns_Input = {
  /** The infrastructure link that can be safely traversed by the vehicle submode. */
  infrastructure_link_id: Scalars['uuid'];
  /** The vehicle submode that can safely traverse the infrastructure link. */
  vehicle_submode: Scalars['String'];
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
  infrastructure_link_id?: Maybe<Scalars['uuid']>;
  vehicle_submode?: Maybe<Scalars['String']>;
};

/** update columns of table "infrastructure_network.vehicle_submode_on_infrastructure_link" */
export enum Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Update_Column {
  /** column name */
  InfrastructureLinkId = 'infrastructure_link_id',
  /** column name */
  VehicleSubmode = 'vehicle_submode'
}

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
  vehicle_submode: Scalars['String'];
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

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** query root */
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
};


/** query root */
export type Query_RootInfrastructure_Network_DirectionArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Direction_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootInfrastructure_Network_External_SourceArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_External_Source_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_External_Source_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootInfrastructure_Network_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};


/** query root */
export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/** query root */
export type Query_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
  vehicle_submode: Scalars['String'];
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

/** subscription root */
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
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_DirectionArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Direction_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Direction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Direction_Order_By>>;
  where?: Maybe<Infrastructure_Network_Direction_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Direction_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_External_SourceArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_External_Source_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_External_Source_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_External_Source_Order_By>>;
  where?: Maybe<Infrastructure_Network_External_Source_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_External_Source_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Infrastructure_Link_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_LinkArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_AggregateArgs = {
  distinct_on?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Order_By>>;
  where?: Maybe<Infrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootInfrastructure_Network_Vehicle_Submode_On_Infrastructure_Link_By_PkArgs = {
  infrastructure_link_id: Scalars['uuid'];
  vehicle_submode: Scalars['String'];
};


/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
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