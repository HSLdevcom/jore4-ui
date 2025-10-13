import { Dispatch, SetStateAction } from 'react';

export type UrlStateSerializer<T> = (value: T) => string;
export type UrlStateDeserializer<T> = (value: string) => T;

/**
 * Mapping from a state object to a collection of transformer functions
 * needed to stringify the individual fields of the state object.
 */
export type UrlStateSerializers<StateT extends object> = {
  readonly [key in keyof StateT]: UrlStateSerializer<StateT[key]>;
};

/**
 * Mapping from a state object to a collection of transformer functions
 * needed to retrieve the actual value of the state objects field,
 * from its string representation.
 */
export type UrlStateDeserializers<StateT extends object> = {
  readonly [key in keyof StateT]: UrlStateDeserializer<StateT[key]>;
};

/**
 * Helper type used when reassembling the state from the URl params field by field.
 */
export type PartialState = Record<string, unknown>;

export type SimpleType =
  | string
  | number
  | boolean
  | ReadonlyArray<SimpleType>
  | { readonly [key: string]: SimpleType };

export type SimpleRecord = Readonly<Record<string, SimpleType>>;

export type TypedRouterState<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord,
> = {
  readonly search: SearchStateT;
  readonly history: HistoryStateT;
};

export type TypedRouterStateStateSetters<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord,
> = {
  readonly setState: Dispatch<
    SetStateAction<TypedRouterState<SearchStateT, HistoryStateT>>
  >;
  readonly setSearchState: Dispatch<SetStateAction<SearchStateT>>;
  readonly setHistoryState: Dispatch<SetStateAction<HistoryStateT>>;
};

export type TypedRouterStateHookResponse<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord,
> = {
  readonly state: TypedRouterState<SearchStateT, HistoryStateT>;
} & TypedRouterStateStateSetters<SearchStateT, HistoryStateT>;
