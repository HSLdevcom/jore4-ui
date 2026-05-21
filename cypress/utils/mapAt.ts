type Mapper<T, R> = (item: T) => R;
type Mappers<T, R> = { readonly [key: number]: Mapper<T, R> };

function mapSingleAt<T, R = T>(
  array: ReadonlyArray<T>,
  index: number,
  mapper: Mapper<T, R>,
): Array<T | R> {
  if (index >= array.length) {
    throw new RangeError(
      `Trying to map index ${index} of an Array with length of ${array.length}!`,
    );
  }

  const item = array[index];
  return (array as Array<T | R>).with(index, mapper(item));
}

function mapMultipleAt<T, R = T>(
  array: ReadonlyArray<T>,
  mappers: Mappers<T, R>,
): Array<T | R> {
  const indexes = Object.keys(mappers).map(Number);

  const invalidIndexes = indexes.filter((i) => i >= array.length);
  if (invalidIndexes.length) {
    throw new RangeError(
      `Trying to map indexes ${invalidIndexes} of an Array with length of ${array.length}!`,
    );
  }

  const copy: Array<T | R> = new Array(array.length);
  for (let i = 0; i < array.length; i += 1) {
    if (i in mappers) {
      copy[i] = mappers[i](array[i]);
    } else {
      copy[i] = array[i];
    }
  }

  return copy;
}

export function mapAt<T, R = T>(
  array: ReadonlyArray<T>,
  index: number,
  mapper: (item: T) => R,
): Array<T | R>;
export function mapAt<T, R = T>(
  array: ReadonlyArray<T>,
  mappers: { readonly [key: number]: (item: T) => R },
): Array<T | R>;
export function mapAt<T, R = T>(
  array: ReadonlyArray<T>,
  indexOrMappers: number | Mappers<T, R>,
  mapper?: Mapper<T, R>,
): Array<T | R> {
  if (mapper && typeof indexOrMappers === 'number') {
    return mapSingleAt(array, indexOrMappers, mapper);
  }

  if (typeof indexOrMappers === 'object' && indexOrMappers !== null) {
    return mapMultipleAt(array, indexOrMappers);
  }

  throw new TypeError(
    'mapAt called with invalid parameters! Known Fn contract: (array,number,Mapper) | (array,Mappers)',
  );
}
