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
  geography: any;
  geometry: any;
  uuid: any;
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

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "playground.points" */
  delete_playground_points?: Maybe<Playground_Points_Mutation_Response>;
  /** delete single row from the table: "playground.points" */
  delete_playground_points_by_pk?: Maybe<Playground_Points>;
  /** insert data into the table: "playground.points" */
  insert_playground_points?: Maybe<Playground_Points_Mutation_Response>;
  /** insert a single row into the table: "playground.points" */
  insert_playground_points_one?: Maybe<Playground_Points>;
  /** update data of the table: "playground.points" */
  update_playground_points?: Maybe<Playground_Points_Mutation_Response>;
  /** update single row of the table: "playground.points" */
  update_playground_points_by_pk?: Maybe<Playground_Points>;
};


/** mutation root */
export type Mutation_RootDelete_Playground_PointsArgs = {
  where: Playground_Points_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Playground_Points_By_PkArgs = {
  point_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_Playground_PointsArgs = {
  objects: Array<Playground_Points_Insert_Input>;
  on_conflict?: Maybe<Playground_Points_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Playground_Points_OneArgs = {
  object: Playground_Points_Insert_Input;
  on_conflict?: Maybe<Playground_Points_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_Playground_PointsArgs = {
  _set?: Maybe<Playground_Points_Set_Input>;
  where: Playground_Points_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Playground_Points_By_PkArgs = {
  _set?: Maybe<Playground_Points_Set_Input>;
  pk_columns: Playground_Points_Pk_Columns_Input;
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

/**
 * Geographic points for fun
 *
 *
 * columns and relationships of "playground.points"
 */
export type Playground_Points = {
  __typename?: 'playground_points';
  /** The geography of the point */
  point_geog: Scalars['geography'];
  /** The ID of the point */
  point_id: Scalars['uuid'];
};

/** aggregated selection of "playground.points" */
export type Playground_Points_Aggregate = {
  __typename?: 'playground_points_aggregate';
  aggregate?: Maybe<Playground_Points_Aggregate_Fields>;
  nodes: Array<Playground_Points>;
};

/** aggregate fields of "playground.points" */
export type Playground_Points_Aggregate_Fields = {
  __typename?: 'playground_points_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Playground_Points_Max_Fields>;
  min?: Maybe<Playground_Points_Min_Fields>;
};


/** aggregate fields of "playground.points" */
export type Playground_Points_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Playground_Points_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "playground.points" */
export type Playground_Points_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Playground_Points_Max_Order_By>;
  min?: Maybe<Playground_Points_Min_Order_By>;
};

/** input type for inserting array relation for remote table "playground.points" */
export type Playground_Points_Arr_Rel_Insert_Input = {
  data: Array<Playground_Points_Insert_Input>;
  on_conflict?: Maybe<Playground_Points_On_Conflict>;
};

/** Boolean expression to filter rows from the table "playground.points". All fields are combined with a logical 'AND'. */
export type Playground_Points_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Playground_Points_Bool_Exp>>>;
  _not?: Maybe<Playground_Points_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Playground_Points_Bool_Exp>>>;
  point_geog?: Maybe<Geography_Comparison_Exp>;
  point_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "playground.points" */
export enum Playground_Points_Constraint {
  /** unique or primary key constraint */
  PointsPkey = 'points_pkey'
}

/** input type for inserting data into table "playground.points" */
export type Playground_Points_Insert_Input = {
  point_geog?: Maybe<Scalars['geography']>;
};

/** aggregate max on columns */
export type Playground_Points_Max_Fields = {
  __typename?: 'playground_points_max_fields';
  point_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "playground.points" */
export type Playground_Points_Max_Order_By = {
  point_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Playground_Points_Min_Fields = {
  __typename?: 'playground_points_min_fields';
  point_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "playground.points" */
export type Playground_Points_Min_Order_By = {
  point_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "playground.points" */
export type Playground_Points_Mutation_Response = {
  __typename?: 'playground_points_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Playground_Points>;
};

/** input type for inserting object relation for remote table "playground.points" */
export type Playground_Points_Obj_Rel_Insert_Input = {
  data: Playground_Points_Insert_Input;
  on_conflict?: Maybe<Playground_Points_On_Conflict>;
};

/** on conflict condition type for table "playground.points" */
export type Playground_Points_On_Conflict = {
  constraint: Playground_Points_Constraint;
  update_columns: Array<Playground_Points_Update_Column>;
  where?: Maybe<Playground_Points_Bool_Exp>;
};

/** ordering options when selecting data from "playground.points" */
export type Playground_Points_Order_By = {
  point_geog?: Maybe<Order_By>;
  point_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "playground.points" */
export type Playground_Points_Pk_Columns_Input = {
  /** The ID of the point */
  point_id: Scalars['uuid'];
};

/** select columns of table "playground.points" */
export enum Playground_Points_Select_Column {
  /** column name */
  PointGeog = 'point_geog',
  /** column name */
  PointId = 'point_id'
}

/** input type for updating data in table "playground.points" */
export type Playground_Points_Set_Input = {
  point_geog?: Maybe<Scalars['geography']>;
};

/** update columns of table "playground.points" */
export enum Playground_Points_Update_Column {
  /** column name */
  PointGeog = 'point_geog'
}

/** query root */
export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "playground.points" */
  playground_points: Array<Playground_Points>;
  /** fetch aggregated fields from the table: "playground.points" */
  playground_points_aggregate: Playground_Points_Aggregate;
  /** fetch data from the table: "playground.points" using primary key columns */
  playground_points_by_pk?: Maybe<Playground_Points>;
};


/** query root */
export type Query_RootPlayground_PointsArgs = {
  distinct_on?: Maybe<Array<Playground_Points_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playground_Points_Order_By>>;
  where?: Maybe<Playground_Points_Bool_Exp>;
};


/** query root */
export type Query_RootPlayground_Points_AggregateArgs = {
  distinct_on?: Maybe<Array<Playground_Points_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playground_Points_Order_By>>;
  where?: Maybe<Playground_Points_Bool_Exp>;
};


/** query root */
export type Query_RootPlayground_Points_By_PkArgs = {
  point_id: Scalars['uuid'];
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
  /** fetch data from the table: "playground.points" */
  playground_points: Array<Playground_Points>;
  /** fetch aggregated fields from the table: "playground.points" */
  playground_points_aggregate: Playground_Points_Aggregate;
  /** fetch data from the table: "playground.points" using primary key columns */
  playground_points_by_pk?: Maybe<Playground_Points>;
};


/** subscription root */
export type Subscription_RootPlayground_PointsArgs = {
  distinct_on?: Maybe<Array<Playground_Points_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playground_Points_Order_By>>;
  where?: Maybe<Playground_Points_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlayground_Points_AggregateArgs = {
  distinct_on?: Maybe<Array<Playground_Points_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Playground_Points_Order_By>>;
  where?: Maybe<Playground_Points_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootPlayground_Points_By_PkArgs = {
  point_id: Scalars['uuid'];
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

export type InsertPointMutationVariables = Exact<{
  geojson: Scalars['geography'];
}>;


export type InsertPointMutation = (
  { __typename?: 'mutation_root' }
  & { insert_playground_points_one?: Maybe<(
    { __typename?: 'playground_points' }
    & Pick<Playground_Points, 'point_id' | 'point_geog'>
  )> }
);

export type SubscribeAllPointsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SubscribeAllPointsSubscription = (
  { __typename?: 'subscription_root' }
  & { playground_points: Array<(
    { __typename?: 'playground_points' }
    & Pick<Playground_Points, 'point_geog' | 'point_id'>
  )> }
);


export const InsertPointDocument = gql`
    mutation InsertPoint($geojson: geography!) {
  insert_playground_points_one(object: {point_geog: $geojson}) {
    point_id
    point_geog
  }
}
    `;
export type InsertPointMutationFn = Apollo.MutationFunction<InsertPointMutation, InsertPointMutationVariables>;

/**
 * __useInsertPointMutation__
 *
 * To run a mutation, you first call `useInsertPointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertPointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertPointMutation, { data, loading, error }] = useInsertPointMutation({
 *   variables: {
 *      geojson: // value for 'geojson'
 *   },
 * });
 */
export function useInsertPointMutation(baseOptions?: Apollo.MutationHookOptions<InsertPointMutation, InsertPointMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertPointMutation, InsertPointMutationVariables>(InsertPointDocument, options);
      }
export type InsertPointMutationHookResult = ReturnType<typeof useInsertPointMutation>;
export type InsertPointMutationResult = Apollo.MutationResult<InsertPointMutation>;
export type InsertPointMutationOptions = Apollo.BaseMutationOptions<InsertPointMutation, InsertPointMutationVariables>;
export const SubscribeAllPointsDocument = gql`
    subscription SubscribeAllPoints {
  playground_points {
    point_geog
    point_id
  }
}
    `;

/**
 * __useSubscribeAllPointsSubscription__
 *
 * To run a query within a React component, call `useSubscribeAllPointsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSubscribeAllPointsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSubscribeAllPointsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSubscribeAllPointsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SubscribeAllPointsSubscription, SubscribeAllPointsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<SubscribeAllPointsSubscription, SubscribeAllPointsSubscriptionVariables>(SubscribeAllPointsDocument, options);
      }
export type SubscribeAllPointsSubscriptionHookResult = ReturnType<typeof useSubscribeAllPointsSubscription>;
export type SubscribeAllPointsSubscriptionResult = Apollo.SubscriptionResult<SubscribeAllPointsSubscription>;