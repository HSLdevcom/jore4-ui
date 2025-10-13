import { areEqual, log } from '../../../../utils';
import {
  TypedUrlStateDeserializationError,
  TypedUrlStateSerializationError,
} from './TypedRouterStateError';
import {
  PartialState,
  UrlStateDeserializers,
  UrlStateSerializers,
} from './types';

// On dev mode throws error, otherwise (in prod) logs a warning, with the expectation
// that the calling function has a sane fallback for the error.
export function warnOrThrow(cause: unknown) {
  const error =
    cause instanceof Error
      ? cause
      : new Error(
          `Caught non error cause: String(${String(cause)}) | JSON(${JSON.stringify(cause)})`,
          { cause },
        );

  if (process.env.NODE_ENV === 'development') {
    throw error;
  } else {
    log.warn(error);
  }
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
export function serializeUrlSearchState<StateT extends object>(
  serializers: UrlStateSerializers<StateT>,
  defaultValues: StateT,
  state: StateT,
): URLSearchParams {
  const serializableKeys = Object.keys(serializers) as unknown as ReadonlyArray<
    keyof StateT
  >;

  const serializedParams = serializableKeys
    .filter((knownKey) => !areEqual(defaultValues[knownKey], state[knownKey]))
    .map((knownKey) => [
      knownKey as string,
      TypedUrlStateSerializationError.try(knownKey, state[knownKey], () =>
        serializers[knownKey](state[knownKey] as ExplicitAny),
      ),
    ]);

  return new URLSearchParams(serializedParams);
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
      const trimmed = urlParamValue.trim();
      return TypedUrlStateDeserializationError.try(key, trimmed, () =>
        deserializers[key](trimmed),
      );
    } catch (e) {
      warnOrThrow(e);
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
 * @param deserializers url param string to state value mappers
 * @param defaultValues default values
 * @param search the url search string
 */
export function deserializeUrlSearchState<StateT extends object>(
  deserializers: UrlStateDeserializers<StateT>,
  defaultValues: StateT,
  search: string,
): StateT {
  const params = new URLSearchParams(search);
  const deserialized: PartialState = {};

  const stateKeys = Object.keys(deserializers) as unknown as ReadonlyArray<
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

  return deserialized as StateT;
}
