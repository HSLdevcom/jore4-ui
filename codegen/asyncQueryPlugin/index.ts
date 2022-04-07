/* eslint-disable import/no-extraneous-dependencies */
import {
  oldVisit,
  PluginFunction,
  Types,
} from '@graphql-codegen/plugin-helpers';
import { LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import {
  concatAST,
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
} from 'graphql';
import { AsyncQueryRawPluginConfig, ReactApolloVisitor } from './visitor';

// based on https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript/react-apollo

export const plugin: PluginFunction<
  AsyncQueryRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: AsyncQueryRawPluginConfig,
) => {
  const allAst = concatAST(documents.map((item) => item.document!));

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION,
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new ReactApolloVisitor(
    schema,
    allFragments,
    config,
    documents,
  );
  const visitorResult = oldVisit(allAst, { leave: visitor });

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter((t: any) => typeof t === 'string'),
    ].join('\n'),
  };
};

export { ReactApolloVisitor };
