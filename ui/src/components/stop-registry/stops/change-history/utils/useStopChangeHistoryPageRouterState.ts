import noop from 'lodash/noop';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { parseDate } from '../../../../../time';
import { Priority } from '../../../../../types/enums';
import { memoizeStatePicker } from '../../../../../utils';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  useTypedRouterState,
} from '../../../../common/hooks/typedRouterState';
import { StopChangeHistoryFilters } from '../types';

type HistoryState = Readonly<Record<string, never>>;
const defaultHistoryState: HistoryState = {};

type FlatStopChangeHistoryState = StopChangeHistoryFilters;

export const defaultValues: FlatStopChangeHistoryState = {
  from: DateTime.now().minus({ months: 6 }).startOf('month').startOf('day'),
  to: DateTime.now().endOf('day'),
  priority: Priority.Standard,
};

const serializers: UrlStateSerializers<FlatStopChangeHistoryState> = {
  from: (v) => v.toISODate(),
  to: (v) => v.toISODate(),
  priority: String,
};

const deserializers: UrlStateDeserializers<FlatStopChangeHistoryState> = {
  from: (str) => parseDate(str).startOf('day'),
  to: (str) => parseDate(str).endOf('day'),
  priority: Number,
};

export function useStopChangeHistoryPageRouterState() {
  const { state, setSearchState } = useTypedRouterState<
    FlatStopChangeHistoryState,
    HistoryState
  >({
    search: {
      serializers,
      deserializers,
      defaultValues,
    },
    history: {
      defaultValues: defaultHistoryState,
      assertShape: noop,
    },
  });

  const pickers = useMemo(
    () => ({
      filters: memoizeStatePicker(['from', 'to', 'priority'], setSearchState),
    }),
    [setSearchState],
  );

  return {
    filters: pickers.filters.getPickedState(state.search),
    setFilters: pickers.filters.setPickedState,
  };
}
