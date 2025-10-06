import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const expectedTypes =
  'useViewState() hook values should be small and simple. SupportedValues: String, number, boolean, Record<string, SupportedValues>, Array<SupportedValues>.';

const simplePrimitiveTypes: ReadonlyArray<string> = [
  'string',
  'number',
  'boolean',
];

function assertValueIsSimplePrimitive(value: unknown) {
  const type = typeof value;

  if (!simplePrimitiveTypes.includes(type)) {
    throw new TypeError(
      `Encountered an unexpected primitive type (${type})! ${expectedTypes}`,
    );
  }
}

function assertValueIsSimpleNestedObject(value: object | null) {
  if (value === null) {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const child of Object.values(value)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assertValueConsistOfSimpleValue(child);
  }
}

function assertValueIsSimpleNestedArray(value: ReadonlyArray<unknown>) {
  // eslint-disable-next-line no-restricted-syntax
  for (const child of value) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    assertValueConsistOfSimpleValue(child);
  }
}

function assertValueConsistOfSimpleValue(value: unknown) {
  if (Array.isArray(value)) {
    assertValueIsSimpleNestedArray(value);
  } else if (typeof value === 'object') {
    assertValueIsSimpleNestedObject(value);
  } else {
    assertValueIsSimplePrimitive(value);
  }
}

function toDebugString(value: unknown) {
  return `typeof(${typeof value}) | String(${String(value)}) | JSON(${JSON.stringify(value, null, 0)})`;
}

function assertStateIsValid(
  rawState: unknown,
): asserts rawState is Readonly<Record<string, unknown>> {
  if (typeof rawState !== 'object') {
    throw new TypeError(
      `Routes making use of the useViewState() hook must use a valid plain object as the react router route location state! But the state value is: ${toDebugString(rawState)}`,
    );
  }
}

function assertTypeofMatches<ValueT>(
  to: unknown,
): (value: unknown) => asserts value is ValueT {
  const expectedType = typeof to;

  return (value) => {
    // eslint-disable-next-line valid-typeof
    if (typeof value !== expectedType) {
      throw new TypeError(
        `Expeted a value of type ${expectedType}, but provided value is: ${toDebugString(value)}`,
      );
    }
  };
}

type UseViewStateReturn<ValueT> = [ValueT, Dispatch<SetStateAction<ValueT>>];

export function useViewState<ValueT extends string | number | boolean>(
  name: string,
  defaultValue: ValueT,
): UseViewStateReturn<ValueT>;
export function useViewState<
  ValueT extends Readonly<Record<string, unknown>> | ReadonlyArray<unknown>,
>(
  name: string,
  defaultValue: ValueT,
  assertIsValidValue: (value: unknown) => asserts value is ValueT,
): UseViewStateReturn<ValueT>;
export function useViewState<ValueT>(
  name: string,
  defaultValue: ValueT,
  assertIsValidValue: (
    value: unknown,
  ) => asserts value is ValueT = assertTypeofMatches<ValueT>(defaultValue),
) {
  // Bits for reading previous value on mount and updating the changes to the router.
  const navigate = useNavigate();
  const { hash, pathname, search, state: rawState } = useLocation();
  assertStateIsValid(rawState);

  // Primary storage and source of truth for the value
  const [value, setValue] = useState<ValueT>(() => {
    if (rawState && name in rawState) {
      const stateValue = rawState[name];
      assertIsValidValue(stateValue);
      return stateValue;
    }

    return defaultValue;
  });

  // On dev mode, assert that the value is a good one.
  if (process.env.NODE_ENV === 'development') {
    assertValueConsistOfSimpleValue(value);
  }

  // Sync the value into the History API state
  useEffect(() => {
    navigate(
      { pathname, search, hash },
      {
        replace: true,
        state: {
          ...(rawState ?? {}),
          [name]: value,
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return [value, setValue];
}
