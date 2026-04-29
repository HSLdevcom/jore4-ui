export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};
export const mapToData = (data: ExplicitAny) => {
  return { data };
};

// null values are valid for patches, so here checking for undefined values only
export const defaultTo = <V, D>(value: V, defaultValue: D) =>
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  value === undefined ? defaultValue : value;

/**
 * It seems that hasura requires function parameter arrays to be
 * formatted as follows: {1,2,3,4,5}. This function takes in
 * an array and formats it correctly for hasura.
 */
export const convertArrayTypeForHasura = <T>(
  array: ReadonlyArray<T>,
): string => {
  const convertedItems = array.map((item) => {
    // If there is array inside of array, we need to do the same conversion to
    // the inner array by calling this function recursively
    if (Array.isArray(item)) {
      return convertArrayTypeForHasura(item);
    }
    return item;
  });

  return `{${convertedItems.join(',')}}`;
};
