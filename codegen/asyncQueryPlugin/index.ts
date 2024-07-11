/* eslint-disable import/no-extraneous-dependencies */
import {
  PluginFunction,
  Types,
  oldVisit,
} from '@graphql-codegen/plugin-helpers';
import { LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import {
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
  concatAST,
} from 'graphql';
import { AsyncQueryRawPluginConfig, ReactApolloVisitor } from './visitor';

// based on https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript/react-apollo

function notUndefined<T>(
  value: T | undefined,
): value is Exclude<T, 'undefined'> {
  return value !== undefined;
}

export const plugin: PluginFunction<
  AsyncQueryRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: AsyncQueryRawPluginConfig,
) => {
  const documentNodes = documents
    .map((item) => item.document)
    .filter(notUndefined);
  const allAst = concatAST(documentNodes);

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
    ...(config.externalFragments ?? []),
  ];

  const visitor = new ReactApolloVisitor(
    schema,
    allFragments,
    config,
    documents,
  );
  // TS is complaining about `visitor` not being compatible with `leave`
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const visitorResult = oldVisit(allAst, { leave: visitor });

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter(
        (t: unknown) => typeof t === 'string',
      ),
    ].join('\n'),
  };
};

export { ReactApolloVisitor };
