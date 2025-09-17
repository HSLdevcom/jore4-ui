import { EnrichedStopPlace } from '../../../../../types';

export type CopyStopAreaResult =
  | CopyStopAreaSuccessResult
  | CopyStopAreaFailureResult;

export type CopyStopAreaSuccessResult = {
  readonly mutationResult: EnrichedStopPlace;
  readonly stopPointIds: ReadonlyArray<UUID>;
};

type CopyStopAreaFailureResult = {
  readonly cutCurrentVersionEnd: boolean;
};
