import xor from 'lodash/xor';
import { useRef } from 'react';
import { TypedRouterHistoryStateShapeError } from './TypedRouterStateError';
import {
  SimpleRecord,
  UrlStateDeserializers,
  UrlStateSerializers,
} from './types';

export function useAssertProperSerializationData<StateT extends object>(
  serializers: UrlStateSerializers<StateT>,
  deserializers: UrlStateDeserializers<StateT>,
  defaultValues: StateT,
) {
  const stableInputRef = useRef({
    serializers,
    deserializers,
    defaultValues,
  });

  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (
    stableInputRef.current.serializers !== serializers ||
    stableInputRef.current.deserializers !== deserializers ||
    stableInputRef.current.defaultValues !== defaultValues
  ) {
    throw new Error(
      'Serializers, deserializers and defaultValues provided into useTypedUrlState need to be stable!',
    );
  }

  const expectedKeys = Object.keys(defaultValues);
  if (
    xor(expectedKeys, Object.keys(serializers)).length ||
    xor(expectedKeys, Object.keys(deserializers)).length
  ) {
    throw new Error(
      'Serializers, deserializers and defaultValues all need to have the same keys!',
    );
  }
}

const expectedTypes =
  'useTypedRouterState() hook history state values should be small and simple. SupportedValues: String, number, boolean, Record<string, SupportedValues>, Array<SupportedValues>.';

const simplePrimitiveTypes: ReadonlyArray<string> = [
  'string',
  'number',
  'boolean',
];

function assertValueIsSimplePrimitive(path: string, value: unknown) {
  const type = typeof value;

  if (!simplePrimitiveTypes.includes(type)) {
    throw new TypedRouterHistoryStateShapeError(
      path,
      value,
      `Encountered an unexpected primitive type (${type})! ${expectedTypes}`,
    );
  }
}

function assertValueIsSimpleNestedObject(path: string, value: object | null) {
  if (value === null) {
    return;
  }

  if ('prototype' in value && value.prototype !== undefined) {
    throw new TypedRouterHistoryStateShapeError(
      path,
      value,
      "Provided object seems to have a prototype, hinting that it is not a pain object defined with the '{}' syntax, but rather a class instance!",
    );
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [childKey, childValue] of Object.entries(value)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assertValueConsistOfSimpleValue(
      `${path}${path ? '.' : ''}${childKey}`,
      childValue,
    );
  }
}

function assertValueIsSimpleNestedArray(
  path: string,
  value: ReadonlyArray<unknown>,
) {
  for (let i = 0; i < value.length; i += 1) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assertValueConsistOfSimpleValue(`${path}[${i}]`, value[i]);
  }
}

function assertValueConsistOfSimpleValue(path: string, value: unknown) {
  if (Array.isArray(value)) {
    assertValueIsSimpleNestedArray(path, value);
  } else if (typeof value === 'object') {
    assertValueIsSimpleNestedObject(path, value);
  } else {
    assertValueIsSimplePrimitive(path, value);
  }
}

export function useAssertRouterHistoryStateIsSimple(
  state: unknown,
): asserts state is SimpleRecord {
  if (typeof state !== 'object' || state === null) {
    throw new TypedRouterHistoryStateShapeError(
      '',
      state,
      `The root Router history state value must be a simple nested object!`,
    );
  }

  assertValueIsSimpleNestedObject('', state);
}
