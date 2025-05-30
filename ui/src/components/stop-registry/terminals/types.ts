import { EnrichedParentStopPlace } from '../../../types';

export type TerminalComponentProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
};

export type TerminalFormComponentProps = {
  readonly terminal: EnrichedParentStopPlace;
  readonly className?: string;
  readonly refetch: () => Promise<unknown>;
};
