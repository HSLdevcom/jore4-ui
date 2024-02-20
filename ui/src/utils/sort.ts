export const sortAlphabetically = <T>(array: T[], attribute: keyof T): T[] =>
  [...array].sort((a, b) =>
    String(a[attribute]).localeCompare(String(b[attribute])),
  );

export const sortReverseAlphabetically = <T>(
  array: T[],
  attribute: keyof T,
): T[] => sortAlphabetically(array, attribute).reverse();
