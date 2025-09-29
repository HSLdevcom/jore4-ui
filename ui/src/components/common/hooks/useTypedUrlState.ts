import omit from 'lodash/omit';
import without from 'lodash/without';
import xor from 'lodash/xor';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { areEqual, log } from '../../../utils';

type UrlStateSerializer<T> = (value: T) => string;
type UrlStateDeserializer<T> = (value: string) => T;

/**
 * Mapping from a state object to a collection of transformer functions
 * needed to stringify the individual fields of the state object.
 */
export type UrlStateSerializers<StateT extends object> = {
  readonly [key in keyof StateT]: UrlStateSerializer<StateT[key]>;
};

/**
 * Mapping from a state object to a collection of transformer functions
 * needed to retrieve the actual value of the state objects field,
 * from its string representation.
 */
export type UrlStateDeserializers<StateT extends object> = {
  readonly [key in keyof StateT]: UrlStateDeserializer<StateT[key]>;
};

const INTERNAL_PARAMS = 'INTERNAL_PARAMS' as const;

/**
 * State object with an extra slot for unknown URL params.
 * Needed for compatability with the old untyped and unmanaged setUrlParam system.
 */
type StateWithInternalParams<T extends object> = T & {
  readonly [INTERNAL_PARAMS]: { readonly [key: string]: ReadonlyArray<string> };
};

/**
 * Helper type used when reassembling the state from the URl params field by field.
 */
type PartialState = Record<string, unknown> & {
  [INTERNAL_PARAMS]: { [key: string]: ReadonlyArray<string> };
};

// On dev mode throws error, otherwise (in prod) logs a warning, with the expectation
// that the calling function has a sane fallback for the error.
export function warnOrThrow(message: string, cause?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(message, { cause });
  } else {
    log.warn(cause ? `${message} Cause: ${String(cause)}` : message);
  }
}

/**
 * Actual serialization implementation. Transforms state to URLSearchParams
 *
 * Diffs state with default values to determine changed fields that need to be
 * stored in the URL. Then calls the associated serializer with the given field's
 * value and sets the param in the URLSearchParams. Finally copies over any extra
 * fields from the { [INTERNAL_PARAMS] } slot from the interbal state object.
 *
 * @param serializers state to url param mappers
 * @param defaultValues default values
 * @param state current state
 * @returns URLSearchParams that can be transformed into the search string
 */
function serializeInternalState<StateT extends object>(
  serializers: UrlStateSerializers<StateT>,
  defaultValues: StateT,
  state: StateWithInternalParams<StateT>,
): URLSearchParams {
  const unknownParams = Object.entries(state.INTERNAL_PARAMS)
    .map(([key, values]) => values.map((value) => [key, value]))
    .flat(1);

  const serializableKeys = Object.keys(serializers) as unknown as ReadonlyArray<
    keyof StateT
  >;
  const serializedParams = serializableKeys
    .filter((knownKey) => !areEqual(defaultValues[knownKey], state[knownKey]))
    .map((knownKey) => [
      knownKey as string,
      serializers[knownKey](state[knownKey] as ExplicitAny),
    ]);

  return new URLSearchParams([...unknownParams, ...serializedParams]);
}

/**
 * Allow serializing a state for custom navigation.
 *
 * {@link useTypedUrlState} does not allow changing the url, its job is to simply
 * keep the page's state and URL in sync. If we need to navigate to another page,
 * this function can be used to construct a properly formatted query params string
 * for the page.
 *
 * This function should always be curried to provide the proper serializers and
 * default values, and then only be called with the state param.
 *
 * Sets the { [INTERNAL_PARAMS] } slot to be empty. A page using {@link useTypedUrlState}
 * should never have/depend on any extra params not present in the "typed URL state".
 * But technically those could be added into the returned URLSearchParams manually.
 *
 * @example
 * navigate({
 *   pathname: Paths.searchResults,
 *   // serializeState should be curried tough
 *   search: serializeState(
 *     SEARCH_SERIALIZERS,
 *     SEARCH_DEFAULT_STATE,
 *     { query: 'H100*' }
 *   ).toString()
 * });
 *
 * @param serializers state to url param mappers
 * @param defaultValues default values
 * @param state current state
 * @returns URLSearchParams that can be transformed into the search string
 */
export function serializeState<StateT extends object>(
  serializers: UrlStateSerializers<StateT>,
  defaultValues: StateT,
  state: StateT,
): URLSearchParams {
  return serializeInternalState(serializers, defaultValues, {
    ...state,
    [INTERNAL_PARAMS]: {},
  });
}

/**
 * Retrieves and parses the requested state field's value from the URL Params
 * or fallback on to the default value of the field.
 *
 * In Dev mode requires the known params to be valid and deserializable.
 * But on Prod simply logs a warning and falls back on the default value.
 *
 * @param deserializers url param string to state value mappers
 * @param defaultValues default values
 * @param params query params present on the URL
 * @param key name of the field being parsed
 * @returns StateT[typeof key] value for the field
 */
function resolveStateValue<StateT extends object>(
  deserializers: UrlStateDeserializers<StateT>,
  defaultValues: StateT,
  params: URLSearchParams,
  key: keyof StateT,
): StateT[typeof key] {
  const defaultValue = defaultValues[key];
  const urlParamValue = params.get(key as string);

  if (urlParamValue !== null) {
    try {
      return deserializers[key](urlParamValue.trim());
    } catch (e) {
      warnOrThrow(
        `Failed to parse url param (${key as string}) with value of (${urlParamValue})!`,
        e,
      );
    }
  }

  return defaultValue;
}

/**
 * Deserializes a state object from the values present in the URL Params.
 *
 * Assumes that the defaultValues function argument respects the shape of the
 * wanted state, and it is used as a source of truth for the field names assumed
 * to be in the state.
 *
 * Takes and deserializes the last instance of each named field from the URL Params
 * into the state object. Thus, in case of Arrays duplication of the param in the
 * URL is not possible aka `?a=1&a=2` cannot be deserialized into `{a: [1,2]}`,
 * but will instead result in `{ a: 2 }`.
 *
 * If the field is not present in the URL the default value is used instead.
 * See {@link resolveStateValue} for more details.
 *
 * Stores any extra params found from the URL Params in the { [INTERNAL_PARAMS] }
 * slot of the internal state object. For these, all duplicate params values are
 * preserved.
 *
 * @param deserializers url param string to state value mappers
 * @param defaultValues default values
 * @param search the url search string
 */
function deserializeState<StateT extends object>(
  deserializers: UrlStateDeserializers<StateT>,
  defaultValues: StateT,
  search: string,
): StateWithInternalParams<StateT> {
  const params = new URLSearchParams(search);
  const deserialized: PartialState = { [INTERNAL_PARAMS]: {} };

  const stateKeys = Object.keys(defaultValues) as unknown as ReadonlyArray<
    keyof StateT
  >;

  stateKeys.forEach((key) => {
    if (!(key in deserializers)) {
      warnOrThrow(`Missing deserializer for key (${key as string})!`);
    }

    deserialized[key as string] = resolveStateValue(
      deserializers,
      defaultValues,
      params,
      key,
    );
  });

  const extraParamKeys = without(
    Array.from(params.keys()),
    ...(stateKeys as unknown as ReadonlyArray<string>),
  );
  extraParamKeys.forEach((key) => {
    deserialized.INTERNAL_PARAMS[key] = params.getAll(key);
  });

  return deserialized as unknown as StateWithInternalParams<StateT>;
}

function useAssertProperSerializationData<StateT extends object>(
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

export function useTypedUrlState<StateT extends object>(
  serializers: UrlStateSerializers<StateT>,
  deserializers: UrlStateDeserializers<StateT>,
  defaultValues: StateT,
): [StateT, Dispatch<SetStateAction<StateT>>] {
  // Drop check on PROD build
  // eslint-disable-next-line @stylistic/spaced-comment
  /*#__PURE__*/ useAssertProperSerializationData(
    serializers,
    deserializers,
    defaultValues,
  );

  const { search, state: routerState } = useLocation();
  const navigate = useNavigate();

  const expectedSearchRef = useRef({
    search,
    pendingNavigationUpdate: false,
  });
  const [internalState, setInternalState] = useState<
    StateWithInternalParams<StateT>
  >(() => deserializeState(deserializers, defaultValues, search));

  const state = useMemo(
    () => omit(internalState, INTERNAL_PARAMS) as unknown as StateT,
    [internalState],
  );

  // If URL search is changed externally, update the state to reflect that.
  useEffect(() => {
    if (
      !expectedSearchRef.current.pendingNavigationUpdate &&
      expectedSearchRef.current.search !== search
    ) {
      setInternalState(deserializeState(deserializers, state, search));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (expectedSearchRef.current.pendingNavigationUpdate) {
      expectedSearchRef.current.pendingNavigationUpdate = false;
      navigate(
        { pathname: '.', search: expectedSearchRef.current.search },
        { replace: true, state: routerState },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalState]);

  const setState = useCallback(
    (newState: StateT | ((previousState: StateT) => StateT)) => {
      setInternalState((prevState) => {
        expectedSearchRef.current.pendingNavigationUpdate = true;

        const nextState =
          typeof newState === 'function' ? newState(prevState) : newState;
        const nextInternalState = {
          ...nextState,
          [INTERNAL_PARAMS]: prevState[INTERNAL_PARAMS],
        };

        expectedSearchRef.current.search = `?${serializeInternalState(
          serializers,
          defaultValues,
          nextInternalState,
        ).toString()}`;

        return nextInternalState;
      });
    },
    // All externals are checked and assumed to be stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [state, setState];
}
