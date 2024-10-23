type NumberEnumEntry<KeyT extends string, ValueT extends number> = [
  KeyT,
  ValueT,
];

function isNumberEnumEntry<KeyT extends string, ValueT extends number>(
  entry: [unknown, unknown],
): entry is NumberEnumEntry<KeyT, ValueT> {
  const [key, value] = entry;
  return typeof key === 'string' && typeof value === 'number';
}

/**
 * Gets [key, value] pairs from a number based enums runtime type.
 *
 * enum MyEnum { A = 1, B, C} => [['A',1], ['B',2], ['C', 3]]
 *
 * @param enumDefinition runtime enum definition
 */
export function numberEnumEntries<KeyT extends string, ValueT extends number>(
  enumDefinition: Readonly<Record<KeyT, ValueT>>,
): Array<NumberEnumEntry<KeyT, ValueT>> {
  return Object.entries(enumDefinition).filter(isNumberEnumEntry<KeyT, ValueT>);
}

function isNumberEnumKey<KeyT extends string>(
  enumDefinition: Readonly<Record<string | number, string | number>>,
  key: unknown,
): key is KeyT {
  if (typeof key === 'string') {
    const value = enumDefinition[key];
    return typeof value === 'number' && enumDefinition[value] === key;
  }

  return false;
}

/**
 * Gets the enum keys (strings) from a number based enums runtime type.
 *
 * enum MyEnum { A = 1, B, C} => ['A', 'B', 'C']
 *
 * @param enumDefinition runtime enum definition
 */
export function numberEnumKeys<KeyT extends string, ValueT extends number>(
  enumDefinition: Readonly<Record<KeyT, ValueT>>,
): Array<KeyT> {
  return Object.values(enumDefinition).filter((it) =>
    isNumberEnumKey<KeyT>(enumDefinition, it),
  );
}

function isNumberEnumValue<ValueT extends number>(
  enumDefinition: Readonly<Record<string | number, string | number>>,
  value: unknown,
): value is ValueT {
  if (typeof value === 'number') {
    const key = enumDefinition[value];
    return typeof key === 'string' && enumDefinition[key] === value;
  }

  return false;
}

/**
 * Gets the enum values (numbers) from a number based enums runtime type.
 *
 * enum MyEnum { A = 1, B, C} => [1, 2, 3]
 *
 * @param enumDefinition runtime enum definition
 */
export function numberEnumValues<KeyT extends string, ValueT extends number>(
  enumDefinition: Readonly<Record<KeyT, ValueT>>,
): Array<ValueT> {
  return Object.values(enumDefinition).filter((it) =>
    isNumberEnumValue<ValueT>(enumDefinition, it),
  );
}
