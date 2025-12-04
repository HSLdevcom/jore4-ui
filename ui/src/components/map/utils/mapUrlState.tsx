import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { areEqual, memoizeOne } from '../../../utils';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  parsePriorities,
  parseQuayNetexIdList,
  serializeArray,
  serializeQuayNetexIdList,
  serializeUrlSearchState,
  splitString,
  toEnum,
  useTypedUrlState,
} from '../../common/hooks/typedRouterState';
import {
  ResultSelection,
  StopSearchFilters,
  defaultFilters,
  defaultResultSelection,
  selectionStateValues,
} from '../../stop-registry/search/types';
import {
  filterDeserializers,
  filterSerializers,
} from '../../stop-registry/search/utils/useStopSearchRouterState';
import {
  DisplayedRouteParams,
  MapUrlState,
  OpenMapUrlState,
  ViewPortParams,
  defaultDisplayedRouteParams,
  defaultViewPortParams,
} from '../types';

type MapUrlFlatState = DisplayedRouteParams &
  StopSearchFilters &
  ResultSelection &
  ViewPortParams;

const defaultValues: MapUrlFlatState = {
  ...defaultDisplayedRouteParams,
  ...defaultFilters,
  ...defaultResultSelection,
  ...defaultViewPortParams,
};

const displayedRouteParamSerializers: UrlStateSerializers<DisplayedRouteParams> =
  {
    lineLabel: (it) => it ?? '',
    routeId: (it) => it ?? '',
    routeLabels: serializeArray,
    routePriorities: serializeArray,
    showSelectedDaySituation: (show) => (show ? '' : String(false)),
  };

const resultSelectionSerializers: UrlStateSerializers<ResultSelection> = {
  selectionState: (it) => it,
  excluded: serializeQuayNetexIdList,
  included: serializeQuayNetexIdList,
};

const viewPortParamSerializers: UrlStateSerializers<ViewPortParams> = {
  latitude: String,
  longitude: String,
  zoom: String,
};

const serializers: UrlStateSerializers<MapUrlFlatState> = {
  ...displayedRouteParamSerializers,
  ...filterSerializers,
  ...resultSelectionSerializers,
  ...viewPortParamSerializers,
};

function mapEmptyStringToNull(value: string): string | null {
  const trimmed = value.trim();

  if (!value) {
    return null;
  }

  return trimmed;
}

/**
 * The deserializers are called only when the named parameter is present in the
 * url's search portion. If the value for that params is 'false' then return
 * false, else if it is anything else, or even present without a value (empty string)
 * return true. If the param is not present, then this is not called and the
 * default value is used instead.
 *
 * @param value url query param value
 */
function ifBooleanOrPresent(value: string): boolean {
  return value.trim().toLowerCase() !== 'false';
}

const displayedRouteParamDeserializers: UrlStateDeserializers<DisplayedRouteParams> =
  {
    lineLabel: mapEmptyStringToNull,
    routeId: mapEmptyStringToNull,
    routeLabels: splitString,
    routePriorities: parsePriorities,
    showSelectedDaySituation: ifBooleanOrPresent,
  };

const resultSelectionDeserializers: UrlStateDeserializers<ResultSelection> = {
  selectionState: toEnum(selectionStateValues),
  excluded: parseQuayNetexIdList,
  included: parseQuayNetexIdList,
};

const viewPortParamDeserializers: UrlStateDeserializers<ViewPortParams> = {
  latitude: Number.parseFloat,
  longitude: Number.parseFloat,
  zoom: Number.parseFloat,
};

const deserializers: UrlStateDeserializers<MapUrlFlatState> = {
  ...displayedRouteParamDeserializers,
  ...filterDeserializers,
  ...resultSelectionDeserializers,
  ...viewPortParamDeserializers,
};

const displayedRouteFields = [
  'lineLabel',
  'routeId',
  'routeLabels',
  'routePriorities',
  'showSelectedDaySituation',
] as const;

const viewPortFields = ['latitude', 'longitude', 'zoom'] as const;

const resultSelectionFields = [
  'selectionState',
  'excluded',
  'included',
] as const;

function pickDisplayedRoute(flatState: MapUrlFlatState) {
  return pick(flatState, displayedRouteFields);
}

function pickFilters(flatState: MapUrlFlatState) {
  return omit(flatState, [
    ...displayedRouteFields,
    ...resultSelectionFields,
    ...viewPortFields,
  ]);
}

function pickResultSelection(flatState: MapUrlFlatState) {
  return pick(flatState, resultSelectionFields);
}

function pickViewPort(flatState: MapUrlFlatState) {
  return pick(flatState, viewPortFields);
}

type MemoizedPickers = {
  readonly pickDisplayedRoute: typeof pickDisplayedRoute;
  readonly pickFilters: typeof pickFilters;
  readonly pickResultSelection: typeof pickResultSelection;
  readonly pickViewPort: typeof pickViewPort;
};

function useReconstitutedState(flatState: MapUrlFlatState): MapUrlState {
  const memoizedPickersRef = useRef<null | MemoizedPickers>(null);

  memoizedPickersRef.current ??= {
    pickDisplayedRoute: memoizeOne(pickDisplayedRoute, areEqual),
    pickFilters: memoizeOne(pickFilters, areEqual),
    pickResultSelection: memoizeOne(pickResultSelection, areEqual),
    pickViewPort: memoizeOne(pickViewPort, areEqual),
  };

  const memoizedPickers = memoizedPickersRef.current;

  return {
    displayedRoute: memoizedPickers.pickDisplayedRoute(flatState),
    filters: memoizedPickers.pickFilters(flatState),
    resultSelection: memoizedPickers.pickResultSelection(flatState),
    viewPort: memoizedPickers.pickViewPort(flatState),
  };
}

function useSetter<T extends Readonly<Record<string, unknown>>>(
  setFlatState: Dispatch<SetStateAction<MapUrlFlatState>>,
  pickFields: (flatState: MapUrlFlatState) => T,
): Dispatch<SetStateAction<T>> {
  return useCallback(
    (nextState) => {
      if (typeof nextState === 'function') {
        setFlatState((p) => ({ ...p, ...nextState(pickFields(p)) }));
      } else {
        setFlatState((p) => ({ ...p, ...nextState }));
      }
    },
    [setFlatState, pickFields],
  );
}

function useMapUrlState() {
  const [flatState, setFlatUrlState] = useTypedUrlState<MapUrlFlatState>(
    serializers,
    deserializers,
    defaultValues,
  );

  const state: MapUrlState = useReconstitutedState(flatState);

  const setDisplayedRoute = useSetter(setFlatUrlState, pickDisplayedRoute);
  const setFilters = useSetter(setFlatUrlState, pickFilters);
  const setViewPort = useSetter(setFlatUrlState, pickViewPort);

  const resetUrlState = useCallback(
    () => setFlatUrlState(defaultValues),
    [setFlatUrlState],
  );

  return {
    state,
    setDisplayedRoute,
    setFilters,
    setViewPort,
    setFlatUrlState,
    resetUrlState,
  };
}

function placeHolderMapUrlStateContextFunction() {
  throw new Error('MapUrlStateContext Provider not it the React node tree!');
}

const MapUrlStateContext = createContext<ReturnType<typeof useMapUrlState>>({
  state: {
    displayedRoute: defaultDisplayedRouteParams,
    filters: defaultFilters,
    resultSelection: defaultResultSelection,
    viewPort: defaultViewPortParams,
  },
  setDisplayedRoute: placeHolderMapUrlStateContextFunction,
  setFilters: placeHolderMapUrlStateContextFunction,
  setViewPort: placeHolderMapUrlStateContextFunction,
  setFlatUrlState: placeHolderMapUrlStateContextFunction,
  resetUrlState: placeHolderMapUrlStateContextFunction,
});

export const ProvideMapUrlStateContext: FC<PropsWithChildren> = ({
  children,
}) => (
  <MapUrlStateContext.Provider value={useMapUrlState()}>
    {children}
  </MapUrlStateContext.Provider>
);

export function useMapUrlStateContext() {
  return useContext(MapUrlStateContext);
}

export function useMapObservationDate() {
  return useContext(MapUrlStateContext).state.filters.observationDate;
}

export function mapUrlStateToSearch(state: OpenMapUrlState): string {
  return serializeUrlSearchState(serializers, defaultValues, {
    ...defaultValues,
    ...(state.displayedRoute ?? {}),
    ...(state.filters ?? {}),
    ...(state.resultSelection ?? {}),
    ...(state.viewPort ?? {}),
  }).toString();
}
