import { FetchResult, OperationVariables } from '@apollo/client';
import flow from 'lodash/flow';

export type MutationHookFunctions<
  TParams,
  TChanges,
  TMutationVariables extends OperationVariables,
> = {
  readonly prepare: (params: TParams) => Promise<TChanges> | TChanges;
  readonly mapChangesToVariables: (
    changes: TChanges,
  ) => Promise<TMutationVariables> | TMutationVariables;
  readonly executeMutation: (
    variables: TMutationVariables,
  ) => Promise<FetchResult>;
  // TODO: possible future extension
  // defaultErrorHandler?: (error: Error) => void;
};

// TODO: allow MutationHook to return other functions as well, not only MutationHookFunctions
// currently the caller cannot see these extra functions
export type MutationHook<
  TParams,
  TChanges,
  TMutationVariables extends OperationVariables,
> = (
  ...args: ExplicitAny
) => MutationHookFunctions<TParams, TChanges, TMutationVariables>;

// extends the mutation hook with some computed functions
export const extendHook = <
  TParams,
  TChanges,
  TMutationVariables extends OperationVariables,
>(
  hook: MutationHook<TParams, TChanges, TMutationVariables>,
) => {
  return (...args: Parameters<typeof hook>) => {
    const hookFunctions = hook(...args);
    const { prepare, mapChangesToVariables, executeMutation } = hookFunctions;

    const prepareAndExecute = flow(
      prepare,
      mapChangesToVariables,
      executeMutation,
    );

    return {
      ...hookFunctions,
      prepareAndExecute,
    };
  };
};
