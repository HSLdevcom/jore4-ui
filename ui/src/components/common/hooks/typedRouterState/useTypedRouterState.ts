import noop from 'lodash/noop';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { areEqual } from '../../../../utils';
import {
  deserializeUrlSearchState,
  serializeUrlSearchState,
} from './typedUrlState';
import {
  SimpleRecord,
  TypedRouterState,
  TypedRouterStateHookResponse,
  TypedRouterStateStateSetters,
  UrlStateDeserializers,
  UrlStateSerializers,
} from './types';
import {
  useAssertProperSerializationData,
  useAssertRouterHistoryStateIsSimple,
} from './useAssertRouterStateShape';

function useSetters<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord,
>(
  setInternalState: Dispatch<
    SetStateAction<TypedRouterState<SearchStateT, HistoryStateT>>
  >,
  pendingNavigationUpdateRef: MutableRefObject<boolean>,
): TypedRouterStateStateSetters<SearchStateT, HistoryStateT> {
  const setState = useCallback(
    (
      newState:
        | TypedRouterState<SearchStateT, HistoryStateT>
        | ((
            prevState: TypedRouterState<SearchStateT, HistoryStateT>,
          ) => TypedRouterState<SearchStateT, HistoryStateT>),
    ) => {
      setInternalState((prevState) => {
        const nextState =
          typeof newState === 'function' ? newState(prevState) : newState;

        // Nothing changed → no need to sync into router.
        if (!areEqual(prevState, nextState)) {
          // eslint-disable-next-line no-param-reassign
          pendingNavigationUpdateRef.current = true;
        }

        return nextState;
      });
    },

    // setInternalState is stable useState setter and
    // pendingNavigationUpdateRef is a stable ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const setSearchState = useCallback(
    (
      newSearchState:
        | SearchStateT
        | ((previousState: SearchStateT) => SearchStateT),
    ) => {
      setState((prevState) => {
        const nextSearch =
          typeof newSearchState === 'function'
            ? newSearchState(prevState.search)
            : newSearchState;

        return { search: nextSearch, history: prevState.history };
      });
    },
    [setState],
  );

  const setHistoryState = useCallback(
    (
      newHistoryState:
        | HistoryStateT
        | ((previousState: HistoryStateT) => HistoryStateT),
    ) => {
      setState((prevState) => {
        const nextHistoryState =
          typeof newHistoryState === 'function'
            ? newHistoryState(prevState.history)
            : newHistoryState;

        return { search: prevState.search, history: nextHistoryState };
      });
    },
    [setState],
  );

  return { setState, setSearchState, setHistoryState };
}

type UseTypedRouterStateOptions<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord,
> = {
  readonly search: {
    readonly serializers: UrlStateSerializers<SearchStateT>;
    readonly deserializers: UrlStateDeserializers<SearchStateT>;
    readonly defaultValues: SearchStateT;
  };
  readonly history: {
    readonly defaultValues: HistoryStateT;
    readonly assertShape: (value: SimpleRecord) => void;
  };
};

export function useTypedRouterState<
  SearchStateT extends object,
  HistoryStateT extends SimpleRecord = SimpleRecord,
>({
  search: { serializers, deserializers, defaultValues: defaultSearchValues },
  history: {
    defaultValues: defaultHistoryValues,
    assertShape: assertHistoryStateShape,
  },
}: UseTypedRouterStateOptions<
  SearchStateT,
  HistoryStateT
>): TypedRouterStateHookResponse<SearchStateT, HistoryStateT> {
  const { search, state: routerState } = useLocation();
  const navigate = useNavigate();

  const [internalState, setInternalState] = useState<
    TypedRouterState<SearchStateT, HistoryStateT>
  >(() => ({
    search: deserializeUrlSearchState(
      deserializers,
      defaultSearchValues,
      search,
    ),
    history: {
      ...defaultHistoryValues,
      ...routerState,
    },
  }));

  const { search: searchState, history: historyState } = internalState;

  // Drop check on PROD build
  // eslint-disable-next-line @stylistic/spaced-comment
  /*#__PURE__*/ useAssertProperSerializationData(
    serializers,
    deserializers,
    defaultSearchValues,
  );
  // eslint-disable-next-line @stylistic/spaced-comment
  /*#__PURE__*/ useAssertRouterHistoryStateIsSimple(historyState);
  // eslint-disable-next-line @stylistic/spaced-comment
  /*#__PURE__*/ assertHistoryStateShape(historyState);

  const pendingNavigationUpdateRef = useRef<boolean>(false);

  // If Router state is changed externally by manual navigation call,
  // update the state to reflect that.
  useEffect(() => {
    if (!pendingNavigationUpdateRef.current) {
      setInternalState((p) => {
        const possibleNewSearchState = deserializeUrlSearchState(
          deserializers,
          searchState,
          search,
        );
        const possibleNewHistoryState = { ...p.history, ...historyState };

        // In case of equal states, reuse the old object identity.
        const nextSearch = areEqual(p.search, possibleNewSearchState)
          ? p.search
          : possibleNewSearchState;
        const nextHistory = areEqual(p.history, possibleNewHistoryState)
          ? p.history
          : possibleNewHistoryState;

        return { search: nextSearch, history: nextHistory };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, historyState]);

  useEffect(() => {
    if (pendingNavigationUpdateRef.current) {
      pendingNavigationUpdateRef.current = false;

      const serializedSearchState = `?${serializeUrlSearchState(
        serializers,
        defaultSearchValues,
        searchState,
      ).toString()}`;

      navigate(
        { pathname: '.', search: serializedSearchState },
        { replace: true, state: searchState },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, historyState]);

  const setters = useSetters<SearchStateT, HistoryStateT>(
    setInternalState,
    pendingNavigationUpdateRef,
  );

  return {
    state: internalState,
    ...setters,
  };
}

const dummyHistoryStateOptions = {
  defaultValues: {},
  assertShape: noop,
} as const;

type UseTypedUrlStateResponse<SearchStateT extends object> = readonly [
  SearchStateT,
  Dispatch<SetStateAction<SearchStateT>>,
];

export function useTypedUrlState<SearchStateT extends object>(
  serializers: UrlStateSerializers<SearchStateT>,
  deserializers: UrlStateDeserializers<SearchStateT>,
  defaultValues: SearchStateT,
): UseTypedUrlStateResponse<SearchStateT> {
  const {
    state: { search },
    setSearchState,
  } = useTypedRouterState<SearchStateT, SimpleRecord>({
    search: { serializers, deserializers, defaultValues },
    history: dummyHistoryStateOptions,
  });

  return [search, setSearchState];
}
