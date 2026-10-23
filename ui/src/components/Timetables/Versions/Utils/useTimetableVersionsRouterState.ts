import noop from 'lodash/noop';
import { today } from '../../../../time/date';
import {
  UrlStateDeserializers,
  UrlStateSerializers,
  useTypedRouterState,
} from '../../../common/Utils/typedRouterState';

export type TimetableVersionsRouterState = {
  readonly startDate: Temporal.PlainDate;
  readonly endDate: Temporal.PlainDate;
  readonly returnTo: UUID | null;
};

const serializers: UrlStateSerializers<TimetableVersionsRouterState> = {
  startDate: (value) => value.toString(),
  endDate: (value) => value.toString(),
  returnTo: (value) => value ?? '',
};

const deserializers: UrlStateDeserializers<TimetableVersionsRouterState> = {
  startDate: (str) => Temporal.PlainDate.from(str),
  endDate: (str) => Temporal.PlainDate.from(str),
  returnTo: (str) => (str.length ? str : null),
};

const defaultValues: TimetableVersionsRouterState = {
  startDate: today(),
  endDate: today().add({ years: 1 }),
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
