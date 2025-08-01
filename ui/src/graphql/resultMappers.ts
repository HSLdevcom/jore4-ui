import {
  QueryRoot,
  ServicePatternScheduledStopPoint,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

type StopLike = Pick<ServicePatternScheduledStopPoint, '__typename'>;
type QueryRootLike<T> = Pick<QueryRoot, '__typename'> & T;

// Using a static, constant array (instead of `result ?? []`) as a default value for array queries
// to avoid infinite render loop caused by constantly changing object reference. This array is
// constant as we don't want anyone to write to this globally shared variable.
const emptyArray: ReadonlyArray<unknown> = [] as const;

// stops

type StopQueryResult = QueryRootLike<{
  service_pattern_scheduled_stop_point?: ReadonlyArray<StopLike>;
}>;

export const mapStopResultToStop = (result: GqlQueryResult<StopQueryResult>) =>
  result.data?.service_pattern_scheduled_stop_point?.[0] as
    | ServicePatternScheduledStopPoint
    | undefined;

export const mapStopResultToStops = (result: GqlQueryResult<StopQueryResult>) =>
  (result.data?.service_pattern_scheduled_stop_point ??
    emptyArray) as ReadonlyArray<ServicePatternScheduledStopPoint>;
