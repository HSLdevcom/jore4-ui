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

  // Tiamat Output Objects that define both an id field
  const tiamatObjectsWithIds = tiamatObjects.filter((object) =>
    hasField(object, 'id'),
  );

  // Tiamat Output Objects that define both an id and version field
  const versionedObjects = tiamatObjectsWithIds.filter((object) =>
    hasField(object, 'version'),
  );

  const typesWithVersion = versionedObjects.map((object) => object.name).sort();

  const typesWithId = tiamatObjectsWithIds
    .map((object) => object.name)
    .filter((name) => !typesWithVersion.includes(name))
    .sort();

  const embeddedTypes = tiamatObjects
    .map((type) => type.name)
    .filter(
      (name) => !typesWithVersion.includes(name) && !typesWithId.includes(name),
    )
    .sort();

  return JSON.stringify(
    { typesWithVersion, typesWithId, embeddedTypes },
    null,
    2,
  );
}

const TiamatVersionedObjectTypesResolverPlugin = {
  plugin: TiamatVersionedObjectTypesResolverPluginImplementation,
};

// eslint-disable-next-line import-x/no-default-export
export default TiamatVersionedObjectTypesResolverPlugin;
