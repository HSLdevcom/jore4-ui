/* eslint-disable import/no-extraneous-dependencies */
import { Types } from '@graphql-codegen/plugin-helpers';
import {
  ClientSideBasePluginConfig,
  ClientSideBaseVisitor,
  LoadedFragment,
  RawClientSideBasePluginConfig,
} from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema } from 'graphql';

// no need to extend the base plugin config types for now
export type WriteDocumentsRawPluginConfig = RawClientSideBasePluginConfig;
type WriteDocumentsPluginConfig = ClientSideBasePluginConfig;

// based on https://github.com/dotansimha/graphql-code-generator/tree/master/packages/plugins/typescript/react-apollo
export class WriteDocumentsVisitor extends ClientSideBaseVisitor<
  WriteDocumentsRawPluginConfig,
  WriteDocumentsPluginConfig
> {
  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    protected rawConfig: WriteDocumentsRawPluginConfig,
    documents: Types.DocumentFile[],
  ) {
    super(schema, fragments, rawConfig, {}, documents);
  }

  // eslint-disable-next-line class-methods-use-this
  protected buildOperation() {
    return '';
  }
}
