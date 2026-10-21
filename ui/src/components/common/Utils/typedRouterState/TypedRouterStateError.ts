/* eslint-disable max-classes-per-file */

export class TypedRouterStateError extends Error {
  readonly key: string | number | symbol;

  readonly value: unknown;

  constructor(
    message: string,
    key: string | number | symbol,
    value: unknown,
    cause: Error | unknown = undefined,
  ) {
    super(message, { cause });

    this.key = key;
    this.value = value;
  }
}

export class TypedUrlStateSerializationError extends TypedRouterStateError {
  constructor(
    key: string | number | symbol,
    value: unknown,
    cause: Error | unknown,
  ) {
    super(
      `Failed to serialize state: key(${String(key)}) | value(${String(value)})!`,
      key,
      value,
      cause,
    );
  }

  static try<T>(
    key: string | number | symbol,
    value: unknown,
    action: () => T,
  ): T {
    try {
      return action();
    } catch (cause) {
      throw new TypedUrlStateSerializationError(key, value, cause);
    }
  }
}

export class TypedUrlStateDeserializationError extends TypedRouterStateError {
  constructor(
    key: string | number | symbol,
    value: unknown,
    cause: Error | unknown,
  ) {
    super(
      `Failed to deserialize state: key(${String(key)}) | value(${String(value)})!`,
      key,
      value,
      cause,
    );
  }

  static try<T>(
    key: string | number | symbol,
    value: unknown,
    action: () => T,
  ): T {
    try {
      return action();
    } catch (cause) {
      throw new TypedUrlStateDeserializationError(key, value, cause);
    }
  }
}

export class TypedRouterHistoryStateShapeError extends Error {
  readonly path: string;

  readonly value: unknown;

  constructor(path: string, value: unknown, reason: string) {
    super(
      `Found a complex value at path('${path}'): value(${String(value)}) | Reason: ${reason}!`,
    );

    this.path = path;

    this.value = value;
  }
}
