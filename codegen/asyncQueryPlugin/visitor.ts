/* eslint-disable import/no-extraneous-dependencies */
import { Types } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  DocumentMode,
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { pascalCase } from 'change-case-all';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';

// no need to extend the base plugin config types for now
export type AsyncQueryRawPluginConfig = RawClientSideBasePluginConfig;
type AsyncQueryPluginConfig = ClientSideBasePluginConfig;

// based on https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript/react-apollo
export class ReactApolloVisitor extends ClientSideBaseVisitor<
  AsyncQueryRawPluginConfig,
  AsyncQueryPluginConfig
> {
  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    protected rawConfig: AsyncQueryRawPluginConfig,
    documents: Types.DocumentFile[],
  ) {
    super(
      schema,
      fragments,
      rawConfig,
      // Note: don't include documents in the export
      { documentMode: DocumentMode.external },
      documents,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public getImports() {
    return [`import { useAsyncQuery } from '../hooks/useAsyncQuery';`];
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string {
    const nodeName = node.name?.value ?? '';

    const hookFns = [];
    const hookResults = [];

    if (operationType === 'Query') {
      const asyncOperationName: string = this.convertName(nodeName, {
        suffix: pascalCase('AsyncQuery'),
        useTypesPrefix: false,
      });
      hookFns.push(
        `export function use${asyncOperationName}() {
          return useAsyncQuery<${operationResultType}, ${operationVariablesTypes}>(${documentVariableName});
        }`,
      );
      hookResults.push(
        `export type ${asyncOperationName}HookResult = ReturnType<typeof use${asyncOperationName}>;`,
      );
    }

    return [...hookFns, ...hookResults].join('\n');
  }
}
