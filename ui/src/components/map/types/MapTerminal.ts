import { MapMinimalTerminalDetailsFragment } from '../../../generated/graphql';

export type ChildStopPlaceIds = {
  readonly id: number;
  readonly netextId: string;
};

export type MapTerminal = Omit<
  MapMinimalTerminalDetailsFragment,
  'children'
> & {
  readonly children: ReadonlyArray<ChildStopPlaceIds>;
};
