import noop from 'lodash/noop';
import { DateTime } from 'luxon';
import { parseDate } from '../../../../time';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  useTypedRouterState,
} from '../../../common/Utils/typedRouterState';

export type TimetableVersionsRouterState = {
  readonly startDate: DateTime;
  readonly endDate: DateTime;
  readonly returnTo: UUID | null;
};

const serializers: UrlStateSerializers<TimetableVersionsRouterState> = {
  startDate: (value) => value.toISODate(),
  endDate: (value) => value.toISODate(),
  returnTo: (value) => value ?? '',
};

const deserializers: UrlStateDeserializers<TimetableVersionsRouterState> = {
  startDate: (str) => parseDate(str).startOf('day'),
  endDate: (str) => parseDate(str).endOf('day'),
  returnTo: (str) => (str.length ? str : null),
};

const defaultValues: TimetableVersionsRouterState = {
  startDate: DateTime.now().startOf('day'),
  endDate: DateTime.now().plus({ years: 1 }).endOf('day'),
  returnTo: null,
};

const alwaysSerialize: ReadonlyArray<keyof TimetableVersionsRouterState> = [
  'startDate',
  'endDate',
];

type HistoryState = Readonly<Record<string, never>>;
const defaultHistoryState: HistoryState = {};

export function useTimetableVersionsRouterState() {
  return useTypedRouterState({
    search: {
      defaultValues,
      deserializers,
      serializers,
    },
    history: { defaultValues: defaultHistoryState, assertShape: noop },
    options: { alwaysSerialize },
  });
}
