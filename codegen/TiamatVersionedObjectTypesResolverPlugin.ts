import { GraphQLInterfaceType, GraphQLSchema } from 'graphql';
import { GraphQLObjectType } from 'graphql/type/definition';

function hasField(
  object: GraphQLObjectType | GraphQLInterfaceType,
  field: string,
): boolean {
  const fields = object.getFields();

  if (field in fields) {
    return true;
  }

  return object.getInterfaces().some((inf) => hasField(inf, field));
}

function TiamatVersionedObjectTypesResolverPluginImplementation(
  schema: GraphQLSchema,
): string {
  // Get all defined types from the schema
  const typeMap = schema.getTypeMap();

  // Get Output Objects from Tiamat
  const tiamatObjects = Object.values(typeMap)
    .filter((type) => type instanceof GraphQLObjectType)
    .filter((type) => type.name.startsWith('stop_registry_'));

  // Tiamat Output Objects that define both an id and version field
  const versionedObjects = tiamatObjects.filter(
    (object) => hasField(object, 'id') && hasField(object, 'version'),
  );

  const outputContent = versionedObjects.map((object) => object.name).sort();
  return JSON.stringify(outputContent, null, 2);
}

const TiamatVersionedObjectTypesResolverPlugin = {
  plugin: TiamatVersionedObjectTypesResolverPluginImplementation,
};

// eslint-disable-next-line import/no-default-export
export default TiamatVersionedObjectTypesResolverPlugin;
