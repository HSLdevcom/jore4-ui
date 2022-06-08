import { OperationVariables } from '@apollo/client';

export interface MutationHookFunctions<
  TParams,
  TChanges,
  TMutationVariables extends OperationVariables,
> {
  prepare(params: TParams): Promise<TChanges> | TChanges;
  mapChangesToVariables(
    changes: TChanges,
  ): Promise<TMutationVariables> | TMutationVariables;
  executeMutation(variables: TMutationVariables): Promise<unknown>;
}

export type MutationHook<
  TParams,
  TChanges,
  TMutationVariables extends OperationVariables,
> = () => MutationHookFunctions<TParams, TChanges, TMutationVariables>;
