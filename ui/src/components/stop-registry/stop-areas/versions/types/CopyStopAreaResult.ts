import { EnrichedStopPlace } from '../../../../../types';
import { CutDirection } from '../cut-stop-area-validity';

export type CopyStopAreaResult =
  | CopyStopAreaSuccessResult
  | CopyStopAreaRequireConfirmationResult;

export type CopyStopAreaSuccessResult = {
  readonly mutationResult: EnrichedStopPlace;
  readonly stopPointIds: ReadonlyArray<UUID>;
  readonly showCutConfirmationModal?: never;
};

export type CopyStopAreaRequireConfirmationResult = {
  readonly showCutConfirmationModal: true;
  readonly currentVersionCutDirection: CutDirection;
};
