export const sortAlphabetically = <T>(
  array: ReadonlyArray<T>,
  attribute: keyof T,
): T[] =>
  array.toSorted((a, b) =>
    String(a[attribute]).localeCompare(String(b[attribute])),
  );

export const sortReverseAlphabetically = <T>(
  array: ReadonlyArray<T>,
  attribute: keyof T,
): T[] => sortAlphabetically(array, attribute).reverse();
